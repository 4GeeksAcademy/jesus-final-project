
import os
from flask_admin import Admin
from .models import db, User, Articulos, Articulo_favorito, TransaccionTrueke, Comentarios, DatosPersonales, Rating
from flask_admin.contrib.sqla import ModelView


def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    admin.add_view(UserModelView(User, db.session))
    admin.add_view(ArticulosModelView(Articulos, db.session))
    admin.add_view(Articulo_favoritoModelView(Articulo_favorito, db.session))
    admin.add_view(TransaccionTruekeModelView(TransaccionTrueke, db.session))
    admin.add_view(ComentariosModelView(Comentarios, db.session))
    admin.add_view(DatosPersonalesModelView(DatosPersonales, db.session))
    admin.add_view(RatingModelView(Rating, db.session))


class UserModelView(ModelView):
    column_auto_selected = True
    column_list = ['id', 'nombre_de_usuario',
                   'email', 'password_hash', 'is_active']


class ArticulosModelView(ModelView):
    column_auto_selected = True
    column_list = ['id', 'titulo', 'caracteristicas', 'estado',
                   'modelo', 'cantidad', 'categoria', 'img', 'usuario_id']
    form_columns = ['titulo', 'caracteristicas', 'estado',
                    'modelo', 'cantidad', 'categoria', 'img', 'usuario_id']


class Articulo_favoritoModelView(ModelView):
    column_auto_selected = True
    column_list = ['id', 'usuario_id', 'usuario', 'articulo_id', 'articulo']


class TransaccionTruekeModelView(ModelView):
    column_auto_selected = True
    column_list = ['id', 'comentarios', 'articulo_id_propietario',
                   'articulo_id_receptor', 'usuario_propietario_id', 'usuario_receptor_id']


class ComentariosModelView(ModelView):
    column_auto_selected = True
    column_list = ['id', 'comentario', 'comentario_user_id',
                   'transaccion_id', 'usuario', 'transaccion']


class DatosPersonalesModelView(ModelView):
    column_auto_selected = True
    column_list = ['id', 'nombre_completo', 'telefono',
                   'direccion', 'fecha_registro', 'img', 'user_id', 'usuario']


class RatingModelView(ModelView):
    column_auto_selected = True
    column_list = ['id', 'valoraciones', 'comentarios',
                   'usuario_id', 'usuario', 'articulo_id', 'articulo']
