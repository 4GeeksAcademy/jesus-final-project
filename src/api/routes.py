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


@api.route('/editar/datos_personales', methods=['PUT'])
def editar_datos_personales():
    body = request.get_json(silent=True)
    if not body:
        return jsonify({'msg': 'necesitas completar los datos'}), 400
    if 'nombre_completo' not in body:
        return jsonify({'msg': 'necesitas completar enviar tu nombre para poder editar tu perfil'}), 400
    if 'telefono' not in body:
        return jsonify({'msg': 'necesitas completar enviar tu teléfono para poder editar tu perfil'}), 400
    if 'direccion' not in body:
        return jsonify({'msg': 'necesitas completar enviar tu dirección para poder editar tu perfil'}), 400

    datos_personales = DatosPersonales()
    datos_personales.nombre_completo = body['nombre_completo']
    datos_personales.telefono = body['telefono']
    datos_personales.direccion = body['direccion']
    datos_personales.img = body['img']

    db.session.add(datos_personales)
    db.session.commit()
    return jsonify({'msg': 'datos personales editados correctamente'}), 200
