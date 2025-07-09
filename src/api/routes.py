"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from sqlalchemy import func
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, Usuario, DatosPersonales, Articulo, ArticuloFavorito, TransaccionTrueke, Comentario, Rating
from api.utils import generate_sitemap, APIException
from datetime import datetime, timezone
import time
from enum import Enum
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request, jwt_required
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


@api.route('borrar-cuenta', methods=['DELETE'])
@jwt_required()
def borrar_cuenta():
    usuario_token_id = int(get_jwt_identity())
    usuario = db.session.query(Usuario).get(usuario_token_id)

    if not usuario:
        return jsonify({'msg': 'Usuario no encontrado'}), 404

    trueke_propietario = db.session.query(TransaccionTrueke).filter(
        (TransaccionTrueke.articulo_propietario_id == usuario.id) &
        (TransaccionTrueke.estado_transaccion.in_(
            ['pendiente', 'aceptado', 'rechazado']))
    ).first()

    trueke_receptor = db.session.query(TransaccionTrueke).filter(
        (TransaccionTrueke.articulo_receptor_id == usuario.id) &
        (TransaccionTrueke.estado_transaccion.in_(
            ['pendiente', 'aceptado', 'rechazado']))
    ).first()

    trueke_activo = trueke_propietario or trueke_receptor

    if trueke_activo:
        return jsonify({
            'msg': 'No puedes eliminar este artículo porque tiene un trueke en proceso',
            'error_type': 'trueke_en_proceso',
            'trueke_id': trueke_activo.id,
            'trueke_estado': trueke_activo.estado_transaccion,
            'es_ofertante': trueke_activo == trueke_propietario
        }), 409
    db.session.delete(usuario)
    db.session.commit()

    return jsonify({'msg': 'Usuario borrado exitosamente'}), 200

#  EDITS


@api.route('/datos-personales', methods=['GET', 'POST', 'PUT'])
@jwt_required()
def editar_datos_personales():
    usuario_token_id = int(get_jwt_identity())
    usuario = db.session.query(Usuario).get(usuario_token_id)

    if not usuario:
        return jsonify({'msg': 'Usuario no encontrado'}), 404

    if request.method == 'GET':
        datos_personales = db.session.query(DatosPersonales).filter_by(
            usuario_id=usuario_token_id).first()

        if not datos_personales:

            return jsonify({
                'email': usuario.email,
                'nombre_completo': '',
                'telefono': '',
                'direccion': '',
                'pais': '',
                'region': '',
                'codigo_postal': '',
                'img': '',
                'fecha_registro': usuario.fecha_registro.isoformat() if usuario.fecha_registro else ''
            }), 200
        return jsonify({
            'email': usuario.email,
            'nombre_completo': datos_personales.nombre_completo,
            'telefono': datos_personales.telefono,
            'direccion': datos_personales.direccion,
            'pais': datos_personales.pais if hasattr(datos_personales, 'pais') else '',
            'region': datos_personales.region if hasattr(datos_personales, 'region') else '',
            'codigo_postal': datos_personales.codigo_postal if hasattr(datos_personales, 'codigo_postal') else '',
            'img': datos_personales.img,
            'fecha_registro': usuario.fecha_registro.isoformat() if hasattr(usuario, 'fecha_registro') and usuario.fecha_registro else ''
        }), 200

    body = request.get_json(silent=True)
    if not body:
        return jsonify({'msg': 'necesitas completar los campos'}), 400

    if 'nombre_completo' not in body:
        return jsonify({'msg': 'necesitas enviar tu nombre'}), 400
    if 'telefono' not in body:
        return jsonify({'msg': 'necesitas enviar tu teléfono'}), 400
    if 'direccion' not in body:
        return jsonify({'msg': 'necesitas enviar tu dirección'}), 400

    datos_personales = db.session.query(DatosPersonales).filter_by(
        usuario_id=usuario_token_id).first()
    if not datos_personales:
        datos_personales = DatosPersonales(usuario_id=usuario_token_id)

    datos_personales.nombre_completo = body['nombre_completo']
    datos_personales.telefono = body['telefono']
    datos_personales.direccion = body['direccion']
    datos_personales.img = body.get('img')
    datos_personales.pais = body.get('pais')
    datos_personales.region = body.get('region')
    datos_personales.codigo_postal = body.get('codigo_postal')

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


@api.route('/articulos', methods=['GET'])
def obtener_todos_los_articulos():
    articulos = Articulo.query.all()

    resultados = []
    for articulo in articulos:
        resultados.append({
            'id': articulo.id,
            'titulo': articulo.titulo,
            'img': articulo.img,
            'estado': articulo.estado,
            'fecha_publicacion': articulo.fecha_publicacion.isoformat() if articulo.fecha_publicacion else None
        })

    return jsonify(resultados), 200


@api.route('/api/mis-publicaciones', methods=['GET'])
@jwt_required()
def obtener_articulos_usuario():

    user_id = int(get_jwt_identity())

    articulos = Articulo.query.filter_by(usuario_id=user_id).all()

    resultados = [{
        'id': articulo.id,
        'titulo': articulo.titulo,
        'caracteristicas': articulo.caracteristicas,
        'categoria': articulo.categoria,
        'img': articulo.img,
        'estado': articulo.estado,
        'fecha_publicacion': articulo.fecha_publicacion.isoformat() if articulo.fecha_publicacion else None
    } for articulo in articulos]

    return jsonify(resultados), 200


@api.route('/rating', methods=['GET'])
def obtener_todos_los_ratings():
    ratings = (
        db.session.query(
            Rating.usuario_id,
            Usuario.nombre_de_usuario.label('nombre_de_usuario'),
            func.avg(Rating.puntuacion).label('promedio_puntuacion')
        )
        .join(Usuario, Usuario.id == Rating.usuario_id)
        .group_by(Rating.usuario_id, Usuario.nombre_de_usuario)
        .order_by(func.avg(Rating.puntuacion).desc())
        .all()
    )

    rating_data = [
        {
            'usuario_id': r.usuario_id,
            'nombre_de_usuario': r.nombre_de_usuario,
            'promedio_puntuacion': round(r.promedio_puntuacion, 2)
        }
        for r in ratings
    ]

    return jsonify(rating_data), 200


@api.route('/rating-review/<int:trueke_id>', methods=['POST'])
@jwt_required()
def crear_rating_review(trueke_id):
    usuario_id_remitente = int(get_jwt_identity())

    trueke = TransaccionTrueke.query.filter_by(id=trueke_id).first()
    if not trueke:
        return jsonify({'msg': 'Trueke no encontrado'}), 404

    id_propietario = trueke.id_usuario_propietario
    id_receptor = trueke.id_usuario_receptor

    participantes_ids = [id_propietario, id_receptor]

    if usuario_id_remitente not in participantes_ids:
        return jsonify({'msg': 'El usuario no participa en esta transacción'}), 400

    if usuario_id_remitente == id_propietario:
        usuario_destino_id = id_receptor
    else:
        usuario_destino_id = id_propietario

    if usuario_id_remitente == usuario_destino_id:
        return jsonify({'msg': 'No puedes dejar una review a ti mismo'}), 400

    body = request.get_json(silent=True)
    if not body:
        return jsonify({'msg': 'Debes enviar datos en formato JSON'}), 400

    if 'puntaje' not in body or 'comentario' not in body:
        return jsonify({'msg': 'Debes enviar puntaje y comentario'}), 400

    existing_review = Rating.query.filter_by(
        trueke_id=trueke_id,
        usuario_id=usuario_id_remitente
    ).first()

    if existing_review:
        return jsonify({'msg': 'Ya has dejado una reseña para esta transacción'}), 400

    nueva_review = Rating(
        puntuacion=body['puntaje'],
        comentarios=body['comentario'],
        usuario_id=usuario_id_remitente,
        usuario_destino_id=usuario_destino_id,
        trueke_id=trueke_id
    )

    db.session.add(nueva_review)
    db.session.commit()

    return jsonify({'msg': 'Review enviada con éxito'}), 201


@api.route('/rating/<int:id>', methods=['GET'])
def obtener_rating_usuario(id):
    usuario = db.session.query(Usuario).get(id)

    if not usuario:
        return jsonify({"error": "Usuario no encontrado"}), 404

    ratings = db.session.query(Rating).filter(Rating.usuario_id == id).all()

    if ratings:
        promedio = sum(r.puntuacion for r in ratings) / len(ratings)
    else:
        promedio = 0

    return jsonify({
        "usuario_id": id,
        "promedio_rating": promedio,
        "cantidad_ratings": len(ratings)
    })


@api.route('/articulo/<int:articulo_id>', methods=['GET'])
def obtener_datos_articulo(articulo_id):
    articulo = db.session.get(Articulo, articulo_id)
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
        'usuario_id': articulo.usuario_id
    }

    return jsonify(articulo_data), 200


@api.route('/editar-datos-articulo/<int:articulo_id>', methods=['PUT'])
@jwt_required()
def editar_datos_articulo(articulo_id):
    usuario_token_id = int(get_jwt_identity())
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
    usuario_token_id = int(get_jwt_identity())

    articulo = db.session.query(Articulo).get(articulo_id)
    if not articulo:
        return jsonify({'msg': 'Artículo no encontrado', 'error_type': 'articulo_no_encontrado'}), 404

    if articulo.usuario_id != usuario_token_id:
        return jsonify({'msg': 'No tienes permiso para editar este artículo', 'error_type': 'permiso_denegado'}), 403

    trueke_propietario = db.session.query(TransaccionTrueke).filter(
        (TransaccionTrueke.articulo_propietario_id == articulo_id) &
        (TransaccionTrueke.estado_transaccion.in_(
            ['pendiente', 'aceptado', 'rechazado']))
    ).first()

    trueke_receptor = db.session.query(TransaccionTrueke).filter(
        (TransaccionTrueke.articulo_receptor_id == articulo_id) &
        (TransaccionTrueke.estado_transaccion.in_(
            ['pendiente', 'aceptado', 'rechazado']))
    ).first()

    trueke_activo = trueke_propietario or trueke_receptor

    if trueke_activo:
        return jsonify({
            'msg': 'No puedes eliminar este artículo porque tiene un trueke en proceso',
            'error_type': 'trueke_en_proceso',
            'trueke_id': trueke_activo.id,
            'trueke_estado': trueke_activo.estado_transaccion,
            'es_ofertante': trueke_activo == trueke_propietario
        }), 409

    try:
        db.session.delete(articulo)
        db.session.commit()
        return jsonify({'msg': 'Artículo eliminado correctamente'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'msg': 'Error al eliminar el artículo', 'error': str(e)}), 500


@api.route('/favoritos', methods=['GET'])
@jwt_required()
def obtener_favoritos():
    usuario_token_id = int(get_jwt_identity())
    favoritos = db.session.query(ArticuloFavorito, Articulo).join(
        Articulo, ArticuloFavorito.articulo_id == Articulo.id
    ).filter(
        ArticuloFavorito.usuario_id == usuario_token_id,
        ArticuloFavorito.es_favorito == True
    ).all()

    if not favoritos:
        return jsonify([]), 200

    favoritos_serializados = [
        {
            "articulo_id": articulo.id,
            "titulo": articulo.titulo,
            "caracteristicas": articulo.caracteristicas,
            "categoria": articulo.categoria,
            "img": articulo.img,
            "modelo": articulo.modelo,
            "estado": articulo.estado,
            "fecha_publicacion": articulo.fecha_publicacion.isoformat() if articulo.fecha_publicacion else None
        }
        for favorito, articulo in favoritos
    ]

    return jsonify(favoritos_serializados), 200


@api.route('/agregar-articulos-favoritos', methods=['POST'])
@jwt_required()
def agregar_articulos_favoritos():
    usuario_token_id = int(get_jwt_identity())
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

    usuario_token_id = int(get_jwt_identity())

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
    usuario_token_id = int(get_jwt_identity())
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
        )

        if data.get('comentario'):
            nuevo_comentario = Comentario(
                comentario=data['comentario'],
                usuario_id=data['usuario_id']
            )

        nueva_transaccion.comentarios_transaccion = nuevo_comentario

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


@api.route('/truekes/historial/<int:user_id>', methods=['GET'])
@jwt_required()
def historial_truekes_usuario(user_id):
    usuario_token_id = int(get_jwt_identity())
    if user_id != usuario_token_id:
        return jsonify({'error': 'No autorizado'}), 403

    # Truekes donde el usuario es receptor (su artículo es el que se solicita)
    truekes_como_receptor = TransaccionTrueke.query.join(
        Articulo, TransaccionTrueke.articulo_receptor_id == Articulo.id
    ).filter(
        Articulo.usuario_id == usuario_token_id
    ).all()

    truekes_como_propietario = TransaccionTrueke.query.join(
        Articulo, TransaccionTrueke.articulo_propietario_id == Articulo.id
    ).filter(
        Articulo.usuario_id == usuario_token_id
    ).all()

    historial_recibidos = [{
        'id': t.id,
        'estado': getattr(t, 'estado_transaccion', 'pendiente'),
        'rol_usuario': 'receptor',
        'mi_articulo': {
            'id': t.articulo_receptor.id,
            'titulo': t.articulo_receptor.titulo,
            'img': t.articulo_receptor.img
        },
        'articulo_a_intercambiar': {
            'id': t.articulo_propietario.id,
            'titulo': t.articulo_propietario.titulo,
            'img': t.articulo_propietario.img
        },
        'solicitado': True
    } for t in truekes_como_receptor]

    historial_solicitados = [{
        'id': t.id,
        'estado': getattr(t, 'estado_transaccion', 'pendiente'),
        'rol_usuario': 'solicitante',
        'mi_articulo': {
            'id': t.articulo_propietario.id,
            'titulo': t.articulo_propietario.titulo,
            'img': t.articulo_propietario.img
        },
        'articulo_a_intercambiar': {
            'id': t.articulo_receptor.id,
            'titulo': t.articulo_receptor.titulo,
            'img': t.articulo_receptor.img
        },
        'solicitado': False
    } for t in truekes_como_propietario]

    return jsonify({
        'success': True,
        'historial': historial_recibidos + historial_solicitados
    }), 200


@api.route('/historial-truekes/stats', methods=['GET'])
@jwt_required()
def obtener_estadisticas_truekes():
    """
    Obtiene estadísticas de truekes del usuario
    """
    try:
        usuario_token_id = int(get_jwt_identity())

        # Contar truekes como propietario
        truekes_como_propietario = db.session.query(TransaccionTrueke).join(
            Articulo, TransaccionTrueke.articulo_propietario_id == Articulo.id
        ).filter(Articulo.usuario_id == usuario_token_id).count()

        # Contar truekes como receptor
        truekes_como_receptor = db.session.query(TransaccionTrueke).join(
            Articulo, TransaccionTrueke.articulo_receptor_id == Articulo.id
        ).filter(Articulo.usuario_id == usuario_token_id).count()

        # Total de artículos publicados por el usuario
        total_articulos = db.session.query(Articulo).filter_by(
            usuario_id=usuario_token_id).count()

        # Categorías más intercambiadas
        categorias_query = db.session.query(
            Articulo.categoria,
            db.func.count(TransaccionTrueke.id).label('total')
        ).join(
            TransaccionTrueke,
            db.or_(
                TransaccionTrueke.articulo_propietario_id == Articulo.id,
                TransaccionTrueke.articulo_receptor_id == Articulo.id
            )
        ).filter(
            Articulo.usuario_id == usuario_token_id
        ).group_by(Articulo.categoria).all()

        categorias_stats = [
            {'categoria': cat, 'total_truekes': total}
            for cat, total in categorias_query
        ]

        return jsonify({
            'truekes_como_propietario': truekes_como_propietario,
            'truekes_como_receptor': truekes_como_receptor,
            'total_truekes': truekes_como_propietario + truekes_como_receptor,
            'total_articulos_publicados': total_articulos,
            'categorias_mas_intercambiadas': categorias_stats,
            'tasa_intercambio': round((truekes_como_propietario + truekes_como_receptor) / max(total_articulos, 1) * 100, 2)
        }), 200

    except Exception as e:
        return jsonify({'error': f'Error al obtener estadísticas: {str(e)}'}), 500


@api.route('/trueke-detalle/<int:trueke_id>', methods=['GET'])
@jwt_required()
def obtener_detalle_trueke(trueke_id):
    """
    Obtiene el detalle completo de un trueke específico
    Solo si el usuario participó en él
    """
    try:
        usuario_token_id = int(get_jwt_identity())

        transaccion = db.session.query(
            TransaccionTrueke).filter_by(id=trueke_id).first()

        if not transaccion:
            return jsonify({'error': 'Trueke no encontrado'}), 404

        # Verificar que el usuario participó en este trueke
        es_propietario = transaccion.articulo_propietario.usuario_id == usuario_token_id
        es_receptor = transaccion.articulo_receptor.usuario_id == usuario_token_id

        if not (es_propietario or es_receptor):
            return jsonify({'error': 'No tienes acceso a este trueke'}), 403

        detalles = {
            'id': transaccion.id,
            'fecha_creacion': transaccion.fecha_creacion.isoformat() if hasattr(transaccion, 'fecha_creacion') else None,
            'rol_usuario': 'propietario' if es_propietario else 'receptor',
            'estado_transaccion': transaccion.estado_transaccion,

            'articulo_propietario': {
                'id': transaccion.articulo_propietario.id,
                'titulo': transaccion.articulo_propietario.titulo,
                'caracteristicas': transaccion.articulo_propietario.caracteristicas,
                'categoria': transaccion.articulo_propietario.categoria,
                'img': transaccion.articulo_propietario.img,
                'estado': transaccion.articulo_propietario.estado,
                'modelo': transaccion.articulo_propietario.modelo,
                'cantidad': transaccion.articulo_propietario.cantidad,
                'usuario': {
                    'id': transaccion.articulo_propietario.usuario.id,
                    'nombre_de_usuario': transaccion.articulo_propietario.usuario.nombre_de_usuario,
                    'email': transaccion.articulo_propietario.usuario.email
                }
            },

            'articulo_receptor': {
                'id': transaccion.articulo_receptor.id,
                'titulo': transaccion.articulo_receptor.titulo,
                'caracteristicas': transaccion.articulo_receptor.caracteristicas,
                'categoria': transaccion.articulo_receptor.categoria,
                'img': transaccion.articulo_receptor.img,
                'estado': transaccion.articulo_receptor.estado,
                'modelo': transaccion.articulo_receptor.modelo,
                'cantidad': transaccion.articulo_receptor.cantidad,
                'usuario': {
                    'id': transaccion.articulo_receptor.usuario.id,
                    'nombre_de_usuario': transaccion.articulo_receptor.usuario.nombre_de_usuario,
                    'email': transaccion.articulo_receptor.usuario.email
                }
            },
        }

        # Comentarios asociados al trueke (si tienes la relación)
        if transaccion.comentarios_transaccion:
            detalles["comentarios_transaccion"] = {
                'id': transaccion.comentarios_transaccion.id,
                'comentario': transaccion.comentarios_transaccion.comentario,
                # 'fecha': comentario.fecha_creacion.isoformat() if hasattr(comentario, 'fecha_creacion') else None
            }

        return jsonify(detalles), 200

    except Exception as e:
        return jsonify({'error': f'Error al obtener detalle del trueke: {str(e)}'}), 500


# Quitamos /api/ para mantener consistencia
@api.route('/mis-publicaciones', methods=['GET'])
@jwt_required()
def obtener_mis_publicaciones():
    usuario_token_id = int(get_jwt_identity())

    articulos = Articulo.query.filter_by(usuario_id=usuario_token_id).all()

    resultados = [{
        'id': articulo.id,
        'titulo': articulo.titulo,
        'caracteristicas': articulo.caracteristicas,
        'categoria': articulo.categoria,
        'img': articulo.img,
        'modelo': articulo.modelo,
        'estado': articulo.estado,
        'cantidad': articulo.cantidad,
        'fecha_publicacion': articulo.fecha_publicacion.isoformat() if articulo.fecha_publicacion else None
    } for articulo in articulos]

    return jsonify(resultados), 200


# Rutas temporales para debug en postman

@api.route('/debug/trueke/<int:trueke_id>', methods=['GET'])
@jwt_required()
def debug_trueke(trueke_id):
    if os.getenv("FLASK_DEBUG") != "1":
        return jsonify({'msg': 'Solo disponible en desarrollo'}), 404

    usuario_token_id = int(get_jwt_identity())

    # Buscar el trueke
    transaccion = db.session.query(
        TransaccionTrueke).filter_by(id=trueke_id).first()

    if not transaccion:
        return jsonify({
            'error': 'Trueke no encontrado',
            'trueke_id_buscado': trueke_id,
            'todos_los_truekes': [t.id for t in db.session.query(TransaccionTrueke).all()]
        }), 404

    # Verificar participación del usuario
    es_propietario = transaccion.articulo_propietario.usuario_id == int(
        usuario_token_id)
    es_receptor = transaccion.articulo_receptor.usuario_id == int(
        usuario_token_id)

    return jsonify({
        'trueke_encontrado': True,
        'trueke_id': transaccion.id,
        'usuario_token_id': usuario_token_id,
        'usuario_token_id_int': int(usuario_token_id),
        'propietario_user_id': transaccion.articulo_propietario.usuario_id,
        'receptor_user_id': transaccion.articulo_receptor.usuario_id,
        'es_propietario': es_propietario,
        'es_receptor': es_receptor,
        'tiene_acceso': es_propietario or es_receptor,
        'datos_transaccion': transaccion.serialize()
    }), 200


# Añadir temporalmente a routes.py para debug

@api.route('/debug/articulo/<int:articulo_id>', methods=['GET'])
@jwt_required()
def debug_articulo(articulo_id):
    if os.getenv("FLASK_DEBUG") != "1":
        return jsonify({'msg': 'Solo disponible en desarrollo'}), 404

    usuario_token_id = int(get_jwt_identity())

    # Buscar el artículo
    articulo = db.session.query(Articulo).get(articulo_id)

    if not articulo:
        return jsonify({
            'error': 'Artículo no encontrado',
            'articulo_id_buscado': articulo_id,
            'todos_los_articulos': [
                {'id': a.id, 'usuario_id': a.usuario_id, 'titulo': a.titulo}
                for a in db.session.query(Articulo).all()
            ]
        }), 404

    return jsonify({
        'articulo_encontrado': True,
        'articulo_id': articulo.id,
        'articulo_usuario_id': articulo.usuario_id,
        'articulo_usuario_id_type': type(articulo.usuario_id).__name__,
        'usuario_token_id': usuario_token_id,
        'usuario_token_id_type': type(usuario_token_id).__name__,
        'usuario_token_id_int': int(usuario_token_id),
        'son_iguales_directo': articulo.usuario_id == usuario_token_id,
        'son_iguales_con_int': articulo.usuario_id == int(usuario_token_id),
        'tiene_permiso': articulo.usuario_id == int(usuario_token_id),
        'datos_articulo': articulo.serialize()
    }), 200
