"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory, render_template
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db, Usuario, RestaurarCodigosPassword, Articulo, TransaccionTrueke
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_mail import Mail
from flask_mail import Message
from flask_jwt_extended import create_access_token, create_refresh_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
from datetime import datetime, timezone, timedelta
from flask_bcrypt import Bcrypt
from flask_uuid import FlaskUUID
import uuid
from flask_cors import CORS
frontendUrl = os.getenv('VITE_FRONTEND_URL',
                        'http://localhost:3001/')  # Valor por defecto


# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../dist/')
app = Flask(__name__)
app.url_map.strict_slashes = False
app.config["JWT_SECRET_KEY"] = "super-secret"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(hours=12)
jwt = JWTManager(app)
app.config.update(dict(
    DEBUG=False,
    MAIL_SERVER='smtp.gmail.com',
    MAIL_PORT=587,
    MAIL_USE_TLS=True,
    MAIL_USE_SSL=False,
    MAIL_USERNAME='trueketeo@gmail.com',
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
))
mail = Mail(app)
bcrypt = Bcrypt(app)
FlaskUUID(app)
CORS(app)
# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file


@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response


@app.route('/register', methods=['POST'])
def register():
    body = request.get_json(silent=True)

    if not body:
        return jsonify({'msg': 'you have to send something'}), 400
    if 'nombre_de_usuario' not in body:
        return jsonify({'msg': 'El campo de nombre de usuario es obligatorio'}), 400
    if 'email' not in body:
        return jsonify({'msg': 'El campo del email es obligatorio'}), 400
    if 'password' not in body:
        return jsonify({'msg': 'El campo de la contraseña es obligatorio'}), 400

    nuevo_usuario = Usuario()
    nuevo_usuario.nombre_de_usuario = body['nombre_de_usuario']
    nuevo_usuario.email = body['email']
    nuevo_usuario.password = bcrypt.generate_password_hash(
        body['password']).decode("utf-8")
    nuevo_usuario.is_active = True

    db.session.add(nuevo_usuario)
    db.session.commit()
    return jsonify({'msg': f'usuario {nuevo_usuario.nombre_de_usuario} creado correctamente'}), 201


@app.route('/enviar-mensaje', methods=['POST'])
def enviar_mensaje():
    body = request.get_json()
    mail_to = body.get('mailTo') if body else None

    if not mail_to:
        return jsonify({'msg': 'Email incorrecto'}), 400

    mail_ok = db.session.query(Usuario).filter_by(email=mail_to).first()
    if not mail_ok:
        return jsonify({'msg': 'Usuario no encontrado'}), 404

    registro = db.session.query(
        RestaurarCodigosPassword).filter_by(email=mail_to).first()

    if registro is None:
        nuevo_codigo = uuid.uuid4()
        registro = RestaurarCodigosPassword(
            codigo_uuid=nuevo_codigo,
            email=mail_to,
            fecha_expedicion=datetime.now(timezone.utc) + timedelta(hours=2)
        )
        db.session.add(registro)
    else:
        registro.fecha_expedicion = datetime.now(
            timezone.utc) + timedelta(hours=2)
        nuevo_codigo = registro.codigo_uuid

    db.session.commit()

    link = f'{frontendUrl}cambiar-contraseña/{nuevo_codigo}'
    logo = f'{frontendUrl}front/assets/img/logo.png'
    msg = Message(
        subject="Hello",
        sender="Trueketeo@gmail.com",
        recipients=[mail_to],
        html=render_template('mensajeMail.html', link=link, logo=logo)
    )
    mail.send(msg)

    # Testing en Postman
    if os.getenv("FLASK_DEBUG") == "1":
        return jsonify({
            'msg': 'Mail enviado correctamente',
            'uuid_debug': str(nuevo_codigo)
        }), 201

    return jsonify({'msg': 'Mail enviado correctamente'}), 201


@app.route('/notificar-interesado', methods=['POST'])
@jwt_required()
def notificar_interesado():
    data = request.json
    trueke_id = data.get('trueke_id')

    if not trueke_id:
        return jsonify({'msg': 'trueke_id es requerido'}), 400

    trueke = db.session.query(TransaccionTrueke).get(trueke_id)
    if not trueke:
        return jsonify({'msg': 'Trueke no encontrado'}), 404

    articulo = db.session.query(Articulo).get(trueke.articulo_propietario_id)
    if not articulo:
        return jsonify({'msg': 'Artículo no encontrado'}), 404

    duenio = db.session.query(Usuario).get(articulo.usuario_id)
    interesado_id = int(get_jwt_identity())
    interesado = db.session.query(Usuario).get(interesado_id)

    if not duenio or not interesado:
        return jsonify({'msg': 'Usuario no encontrado'}), 404

    asunto = f"Interesado en tu artículo '{articulo.titulo}'"
    destinatario = duenio.email

    msg = Message(
        subject=asunto,
        sender="Trueketeo@gmail.com",
        recipients=[destinatario],
        html=render_template(
            'notificacion_interesado.html',
            interesado=interesado,
            articulo=articulo,
            duenio=duenio
        )
    )
    mail.send(msg)
    return jsonify({'msg': 'Notificación enviada correctamente'}), 200


@app.route('/recuperar-contrasena/<uuid:codigo_uuid>', methods=['POST'])
def mypage(codigo_uuid):
    body = request.get_json()
    nueva_password = body['password'] if body else None

    if not nueva_password:
        return jsonify({'msg': 'No se recibió la nueva contraseña'})

    registro = db.session.query(RestaurarCodigosPassword).filter_by(
        codigo_uuid=codigo_uuid).first()
    if not registro:
        return jsonify({'msg': 'Código inválido'}), 404

    # CONVERSIÓN SEGURA
    fecha_exp = registro.fecha_expedicion
    if fecha_exp.tzinfo is None:
        # Si es naive, asumir que es UTC y convertir a aware
        fecha_exp = fecha_exp.replace(tzinfo=timezone.utc)

    if fecha_exp < datetime.now(timezone.utc):
        return jsonify({'msg': 'El código ha expirado'}), 400

    usuario = db.session.query(Usuario).filter_by(email=registro.email).first()
    if not usuario:
        return jsonify({'msg': 'Usuario no encontrado'}), 404

    usuario.password = bcrypt.generate_password_hash(
        nueva_password).decode("utf-8")
    db.session.commit()

    return jsonify({'msg': 'Contraseña actualizada correctamente'}), 200


@app.route('/login', methods=['POST'])
def login():
    try:
        body = request.get_json()

        if not body:
            return jsonify({'msg': 'Falta el body'}), 400
        if 'email' not in body:
            return jsonify({'msg': 'Email necesario'}), 400
        if 'password' not in body:
            return jsonify({'msg': 'Password necesario'}), 400

        user = Usuario.query.filter_by(email=body['email']).first()

        if user is None or not bcrypt.check_password_hash(user.password, body['password']):
            return jsonify({'msg': 'Usuario o contraseña incorrectos'}), 400

        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))

        return jsonify({
            'msg': 'Login exitoso',
            'token': access_token,
            'refresh_token': refresh_token,
            'mail': user.email,
            'userId': user.id
        }), 200

    except Exception as e:
        return jsonify({'msg': f'Error interno: {str(e)}'}), 500

    # this only runs if `$ python src/main.py` is executed


@app.route('/post/<int:id>', methods=['DELETE'])
def delete_post(id):
    from api.models import Post
    post = Post.query.get(id)
    if post is None:
        return jsonify({'msg': 'post no encontrado'}), 404

    from api.models import db
    db.session.delete(post)
    db.session.commit()

    return jsonify({'msg': 'post eliminado correctamente'}), 200


if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
