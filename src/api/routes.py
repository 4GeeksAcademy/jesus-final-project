"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, Usuario, DatosPersonales, Articulo, ArticuloFavorito, TransaccionTrueke
from api.utils import generate_sitemap, APIException
from datetime import datetime, timezone
import time
from enum import Enum
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_cors import CORS
api = Blueprint('api', __name__)
CORS(api)
# Allow CORS requests to this API


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

#  EDITS


@api.route('/editar-datos-personales/', methods=['PUT'])
@jwt_required()
def editar_datos_personales():
    usuario_token_id = get_jwt_identity()

    body = request.get_json(silent=True)
    if not body:
        return jsonify({'msg': 'necesitas completar los campos'}), 400

    if 'nombre_completo' not in body:
        return jsonify({'msg': 'necesitas enviar tu nombre'}), 400
    if 'telefono' not in body:
        return jsonify({'msg': 'necesitas enviar tu teléfono'}), 400
    if 'direccion' not in body:
        return jsonify({'msg': 'necesitas enviar tu dirección'}), 400

    usuario = db.session.query(Usuario).get(usuario_token_id)
    if not usuario:
        return jsonify({'msg': 'Usuario no encontrado'}), 404

    datos_personales = db.session.query(
        DatosPersonales).filter_by(usuario_id=usuario_token_id).first()
    if not datos_personales:
        datos_personales = DatosPersonales(usuario_id=usuario_token_id)

    datos_personales.nombre_completo = body['nombre_completo']
    datos_personales.telefono = body['telefono']
    datos_personales.direccion = body['direccion']
    datos_personales.img = body.get('img')

    db.session.add(datos_personales)
    db.session.commit()

    return jsonify({'msg': 'Datos personales editados correctamente'}), 200


@api.route('/busqueda-articulos', methods=['GET'])
def buscar_articulos():
    query = request.args.get('query', '').lower()

    if not query:
        return jsonify([]), 200

    articulos = Articulo.query.filter(
        Articulo.titulo.ilike(f'%{query}%')).all()  # busqueda parcial

    resultados = []
    for articulo in articulos:
        resultados.append({
            'id': articulo.id,
            'titulo': articulo.titulo,
            'categoria': articulo.categoria,
        })

    return jsonify(resultados), 200


@api.route('/articulos/categoria/<string:categoria>', methods=['GET'])
def obtener_articulos_por_categoria(categoria):
    articulos = Articulo.query.filter_by(categoria=categoria).all()

    resultados = []
    for articulo in articulos:
        resultados.append({
            'id': articulo.id,
            'titulo': articulo.titulo,
            'caracteristicas': articulo.caracteristicas,
            'categoria': articulo.categoria,
            'img': articulo.img,
            'modelo': articulo.modelo,
            'estado': articulo.estado,
            'cantidad': articulo.cantidad,

        })

    return jsonify(resultados), 200


@api.route('/articulo/<int:articulo_id>', methods=['GET'])
def obtener_datos_articulo(articulo_id):

    articulo = db.session.query(Articulo).get(articulo_id)
    if not articulo:
        return jsonify({'msg': 'Artículo no encontrado'}), 404

    articulo_data = {
        'id': articulo.id,
        'titulo': articulo.titulo,
        'caracteristicas': articulo.caracteristicas,
        'categoria': articulo.categoria,
        'img': articulo.img,
        'modelo': articulo.modelo,
        'estado': articulo.estado,
        'cantidad': articulo.cantidad,

    }

    return jsonify(articulo_data), 200


@api.route('/editar-datos-articulo/<int:articulo_id>', methods=['PUT'])
@jwt_required()
def editar_datos_articulo(articulo_id):
    usuario_token_id = get_jwt_identity()
    body = request.get_json(silent=True)
    if not body:
        return jsonify({'msg': 'necesitas completar los campos'}), 400

    if 'titulo' not in body:
        return jsonify({'msg': 'necesitas enviar el titulo del articulo'}), 400
    if 'caracteristicas' not in body:
        return jsonify({'msg': 'necesitas enviar las caracteristicas del articulo'}), 400
    if 'categoria' not in body:
        return jsonify({'msg': 'necesitas enviar la categoría del articulo'}), 400
    if 'img' not in body:
        return jsonify({'msg': 'necesitas enviar la imagen del articulo'}), 400

    articulo = db.session.query(Articulo).get(articulo_id)
    if not articulo:
        return jsonify({'msg': 'Artículo no encontrado'}), 404

    if articulo.usuario_id != usuario_token_id:
        return jsonify({'msg': 'No tienes permiso para editar este artículo'}), 403

    articulo.titulo = body['titulo']
    articulo.caracteristicas = body['caracteristicas']
    articulo.categoria = body['categoria']
    articulo.img = body['img']
    articulo.modelo = body.get('modelo')
    articulo.estado = body.get('estado')
    articulo.cantidad = body.get('cantidad')

    db.session.commit()

    return jsonify({'msg': 'Artículo editado correctamente'}), 200


@api.route('/eliminar-articulo/<int:articulo_id>', methods=['DELETE'])
@jwt_required()
def eliminar_articulo(articulo_id):
    usuario_token_id = get_jwt_identity()

    articulo = db.session.query(Articulo).get(articulo_id)
    if not articulo:
        return jsonify({'msg': 'Artículo no encontrado'}), 404

    if articulo.usuario_id != usuario_token_id:
        return jsonify({'msg': 'No tienes permiso para editar este artículo'}), 403

    db.session.delete(articulo)
    db.session.commit()

    return jsonify({'msg': 'Artículo eliminado correctamente'}), 200


@api.route('/favoritos', methods=['GET'])
@jwt_required()
def obtener_favoritos():
    usuario_token_id = get_jwt_identity()

    favoritos = db.session.query(ArticuloFavorito).filter_by(
        usuario_id=usuario_token_id
    ).all()

    favoritos_serializados = [f.serialize() for f in favoritos]

    return jsonify(favoritos_serializados), 200


@api.route('/agregar-articulos-favoritos', methods=['POST'])
@jwt_required()
def agregar_articulos_favoritos():
    usuario_token_id = get_jwt_identity()
    body = request.get_json(silent=True)
    if not body:
        return jsonify({'msg': 'necesitas completar el campo'}), 400
    if "articulo_id" not in body:
        return jsonify({'msg': 'necesitas enviar el favorito que desees agregar'}), 400

    articulo_id = body['articulo_id']
    favorito_existente = db.session.query(ArticuloFavorito).filter_by(
        usuario_id=usuario_token_id, articulo_id=articulo_id).first()
    if favorito_existente:
        return jsonify({'msg': 'El artículo ya está en favoritos'}), 400

    nuevo_favorito = ArticuloFavorito(
        usuario_id=usuario_token_id,
        articulo_id=articulo_id,
        es_favorito=True
    )

    db.session.add(nuevo_favorito)
    db.session.commit()

    return jsonify({'msg': 'Artículo agregado a favoritos'}), 201


@api.route('/eliminar-articulos-favoritos/<int:articulo_id>', methods=['DELETE'])
@jwt_required()
def eliminar_articulos_favoritos(articulo_id):

    usuario_token_id = get_jwt_identity()

    favorito = db.session.query(ArticuloFavorito).filter_by(
        usuario_id=usuario_token_id, articulo_id=articulo_id).first()
    if not favorito:
        return jsonify({'msg': 'Este artículo no está en tu lista de favoritos'}), 404

    db.session.delete(favorito)
    db.session.commit()

    return jsonify({'msg': 'Artículo eliminado de favoritos'}), 201


@api.route('/publicar-articulo', methods=['POST'])
@jwt_required()
def publicar_articulo():
    usuario_token_id = get_jwt_identity()
    body = request.get_json(silent=True)

    # Validación básica del body
    if not body:
        return jsonify({'msg': 'Debes enviar un JSON con los datos del artículo'}), 400

    # Validación de campos obligatorios
    required_fields = ['titulo', 'estado', 'categoria', 'img']
    for field in required_fields:
        if field not in body:
            return jsonify({'msg': f'El campo "{field}" es obligatorio'}), 400

    # Validación de enums
    estados_validos = ['nuevo', 'como_nuevo', 'bueno', 'regular', 'malo']
    categorias_validas = ['electronica', 'ropa', 'hogar',
                          'deportes', 'libros', 'juguetes', 'otros']

    if body['estado'] not in estados_validos:
        return jsonify({'msg': f'Estado inválido. Opciones: {", ".join(estados_validos)}'}), 400

    if body['categoria'] not in categorias_validas:
        return jsonify({'msg': f'Categoría inválida. Opciones: {", ".join(categorias_validas)}'}), 400

    # Validación de tipos de datos
    if 'cantidad' in body and not isinstance(body['cantidad'], int):
        return jsonify({'msg': 'La cantidad debe ser un número entero'}), 400

    nuevo_articulo = Articulo(
        titulo=body['titulo'],
        caracteristicas=body.get('caracteristicas'),
        estado=body['estado'],
        modelo=body.get('modelo'),
        cantidad=body.get('cantidad', 1),
        categoria=body['categoria'],
        img=body['img'],
        usuario_id=usuario_token_id,
        fecha_publicacion=datetime.now(timezone.utc)
    )

    try:
        db.session.add(nuevo_articulo)
        db.session.commit()

        return jsonify({
            'msg': 'Artículo publicado exitosamente',
            'articulo': nuevo_articulo.serialize()
        }), 201

    except Exception as e:
        db.session.rollback()
    return jsonify({'msg': f'Error al publicar el artículo: {str(e)}'}), 500


# Categorías para los artículos
class CategoriaEnum(str, Enum):
    ELECTRONICA = 'electronica'
    ROPA = 'ropa'
    HOGAR = 'hogar'
    DEPORTES = 'deportes'
    LIBROS = 'libros'
    JUGUETES = 'juguetes'
    OTROS = 'otros'


@api.route('/categorias', methods=['GET'])
def obtener_categorias():
    categorias = [{
        'nombre': categoria.value,
        'valor': categoria.value,
        'icono': f'icon-{categoria.value}'  # Para frontend
    } for categoria in CategoriaEnum]

    return jsonify({
        'categorias': categorias
    }), 200


@api.route('/truekes', methods=['POST'])
def crear_trueke():
    try:
        data = request.get_json(silent=True)
        if not data:
            return jsonify({'error': 'No se proporcionaron datos'}), 400

        # Validar campos requeridos
        required_fields = ['articulo_propietario_id', 'articulo_receptor_id']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Faltan campos requeridos'}), 400

        nueva_transaccion = TransaccionTrueke(
            articulo_propietario_id=data['articulo_propietario_id'],
            articulo_receptor_id=data['articulo_receptor_id'],
            comentarios=data.get('comentarios')
        )

        db.session.add(nueva_transaccion)
        db.session.commit()

        return jsonify(nueva_transaccion.serialize()), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@api.route('/truekes/<int:id>', methods=['GET'])
def obtener_trueke(id):
    try:
        transaccion = TransaccionTrueke.query.get(id)
        if not transaccion:
            return jsonify({'error': 'Transacción no encontrada'}), 404

        return jsonify(transaccion.serialize()), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@api.route('/truekes/<int:id>', methods=['DELETE'])
def eliminar_trueke(id):
    try:
        transaccion = TransaccionTrueke.query.get(id)

        if not transaccion:
            return jsonify({'error': 'Transacción no encontrada'}), 404

        db.session.delete(transaccion)
        db.session.commit()

        return jsonify({
            'mensaje': 'Transacción eliminada correctamente',
            'id': id
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
