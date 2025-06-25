
import os
from flask_admin import Admin
from .models import db, User,Articulos,Articulo_favorito,TransaccionTrueke, Comentarios,DatosPersonales,Rating
from flask_admin.contrib.sqla import ModelView



def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    admin.add_view(ModelView(User, db.session))


class User(ModelView):
    column_auto_selected = True
    column_list = ['id', 'nombre_de_usuario', 'email', 'password_hash', 'is_active', 'articulos', 'articulos_favoritos',
                   'ratings', 'datos_personales', 'comentarios', 'transacciones_como_propietario', 'transacciones_como_receptor']


class Articulos(ModelView):
    column_auto_selected = True
    column_list = ['id', 'titulo', 'caracteristicas', 'estado', 'modelo', 'cantidad', 'categoria',
                   'img', 'usuario_id', 'usuario', 'articulos_favoritos', 'ratings', 'transaccion_trueke']


class Articulos_Favoritos(ModelView):
    column_auto_selected = True
    column_list = ['id', 'usuario_id', 'usuario', 'articulo_id', 'articulo']


class TransaccionTrueke(ModelView):
    column_auto_selected = True
    column_list = ['id', 'comentarios', ' articulo_id_propietario', ' articulo_id_receptor', 'articulo',
                   ' transacciones_como_propietario', ' transacciones_como_receptor', ' comentarios_transaccion']


class Comentarios(ModelView):
    column_auto_selected = True
    column_list = ['id', 'comentario', 'comentario_user_id',
                   'transaccion_id', 'usuario', 'transaccion']


class DatosPersonales(ModelView):
    column_auto_selected = True
    column_list = ['id', 'nombre_completo', 'telefono',
                   'direccion', 'fecha_registro', 'img', 'user_id', 'usuario']


class Rating(ModelView):
    column_auto_selected = True
    column_list = ['id', 'valoraciones', 'comentarios',
                   'usuario_id', 'usuario', 'articulo_id', 'articulo']

    # admin.add_view(ModelView(YourModelName, db.session))
