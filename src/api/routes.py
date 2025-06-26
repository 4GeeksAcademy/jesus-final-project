"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, Usuario, DatosPersonales
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


# falta el jwt auth
@api.route('/editar_datos_personales/<int:usuario_id>', methods=['PUT'])
def editar_datos_personales(usuario_id):
    body = request.get_json(silent=True)
    if not body:
        return jsonify({'msg': 'necesitas completar los datos'}), 400

    if 'nombre_completo' not in body:
        return jsonify({'msg': 'necesitas enviar tu nombre'}), 400
    if 'telefono' not in body:
        return jsonify({'msg': 'necesitas enviar tu teléfono'}), 400
    if 'direccion' not in body:
        return jsonify({'msg': 'necesitas enviar tu dirección'}), 400

    usuario = db.session.query(Usuario).get(usuario_id)
    if not usuario:
        return jsonify({'msg': 'Usuario no encontrado'}), 404

    datos_personales = db.session.query(
        DatosPersonales).filter_by(usuario_id=usuario_id).first()
    if not datos_personales:
        datos_personales = DatosPersonales(usuario_id=usuario_id)

    datos_personales.nombre_completo = body['nombre_completo']
    datos_personales.telefono = body['telefono']
    datos_personales.direccion = body['direccion']
    datos_personales.img = body.get('img')

    db.session.add(datos_personales)
    db.session.commit()

    return jsonify({'msg': 'Datos personales editados correctamente'}), 200
