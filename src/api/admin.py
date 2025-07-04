
import os
from flask_admin import Admin
from .models import db, Usuario, Articulo, ArticuloFavorito, TransaccionTrueke, Comentario, DatosPersonales, Rating
from flask_admin.contrib.sqla import ModelView


def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    admin.add_view(UsuarioModelView(Usuario, db.session))
    admin.add_view(ArticuloModelView(Articulo, db.session))
    admin.add_view(ArticuloFavoritoModelView(ArticuloFavorito, db.session))
    admin.add_view(TransaccionTruekeModelView(TransaccionTrueke, db.session))
    admin.add_view(ComentarioModelView(Comentario, db.session))
    admin.add_view(DatosPersonalesModelView(DatosPersonales, db.session))
    admin.add_view(RatingModelView(Rating, db.session))


class UsuarioModelView(ModelView):
    column_auto_selected = True
    column_list = ['id', 'nombre_de_usuario', 'email', 'password', 'is_active',
                   'articulos', 'articulos_favoritos', 'ratings', 'datos_personales', 'comentarios']


class ArticuloModelView(ModelView):
    column_auto_selected = True
    column_list = ['id', 'titulo', 'caracteristicas', 'estado',
                   'modelo', 'cantidad', 'categoria', 'img',
                   'usuario_id',
                   'usuario', 'articulos_favoritos', 'ratings',]


"""     form_columns = ['titulo', 'caracteristicas', 'estado',
                    'modelo', 'cantidad', 'categoria', 'img',
                    'usuario_id',
                    'usuario', 'articulos_favoritos', 'ratings'] """


class ArticuloFavoritoModelView(ModelView):
    column_auto_selected = True
    column_list = ['id',
                   'usuario_id', 'articulo_id',
                   'usuario', 'articulo']


class TransaccionTruekeModelView(ModelView):
    column_auto_selected = True
    column_list = ['id', 'comentarios',
                   'articulo_propietario_id', 'articulo_receptor_id',
                   'articulo_propietario', 'articulo_receptor', 'comentarios_transaccion']


class ComentarioModelView(ModelView):
    column_auto_selected = True
    column_list = ['id', 'comentario',
                   'usuario_id', 'transaccion_id',
                   'usuario', 'transaccion']


class DatosPersonalesModelView(ModelView):
    column_auto_selected = True
    column_list = ['id', 'nombre_completo', 'telefono', 'direccion', 'fecha_registro', 'img',
                   'usuario_id',
                   'usuario']


class RatingModelView(ModelView):
    column_auto_selected = True
    column_list = ['id', 'puntuacion', 'comentarios',
                   'usuario_id', 'articulo_id',
                   'usuario', 'articulo']
