from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Integer, ForeignKey, Text, Enum, DateTime, CheckConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime, timedelta
from sqlalchemy.dialects.postgresql import UUID
import uuid
from flask_uuid import FlaskUUID

db = SQLAlchemy()


class Usuario(db.Model):
    __tablename__ = 'usuario'

    id: Mapped[int] = mapped_column(primary_key=True)
    nombre_de_usuario: Mapped[str] = mapped_column(
        String(25), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(25), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(
        String(255), nullable=False)  # Ampliado para hashes seguros
    is_active: Mapped[bool] = mapped_column(
        Boolean(), nullable=False, default=True)

    # Relaciones
    articulos: Mapped[list['Articulo']] = relationship(
        'Articulo', back_populates='usuario', cascade='all, delete-orphan')
    articulos_favoritos: Mapped[list['ArticuloFavorito']] = relationship(
        'ArticuloFavorito', back_populates='usuario', cascade='all, delete-orphan')
    ratings: Mapped[list['Rating']] = relationship(
        'Rating', back_populates='usuario', cascade='all, delete-orphan')
    datos_personales: Mapped['DatosPersonales'] = relationship(
        'DatosPersonales', back_populates='usuario', cascade='all, delete-orphan', uselist=False)
    comentarios: Mapped[list['Comentario']] = relationship(
        'Comentario', back_populates='usuario', cascade='all, delete-orphan')

    def __str__(self):
        return f'{self.nombre_de_usuario} ({self.email})'

    def serialize(self):
        return {
            'id': self.id,
            'nombre_de_usuario': self.nombre_de_usuario,
            'email': self.email,
            'is_active': self.is_active
        }


class Articulo(db.Model):
    __tablename__ = 'articulo'

    id: Mapped[int] = mapped_column(primary_key=True)
    titulo: Mapped[str] = mapped_column(String(25), nullable=False)
    caracteristicas: Mapped[str] = mapped_column(Text, nullable=True)
    estado: Mapped[str] = mapped_column(Enum(
        'nuevo', 'como_nuevo', 'bueno', 'regular', 'malo', name='estado_enum'), nullable=False)
    modelo: Mapped[str] = mapped_column(String(50), nullable=True)
    cantidad: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    categoria: Mapped[str] = mapped_column(Enum(
        'electronica', 'ropa', 'hogar', 'deportes', 'libros', 'juguetes', 'otros', name='categoria_enum'), nullable=False)
    img: Mapped[str] = mapped_column(String(200), nullable=False)

    # Foreign Keys
    usuario_id: Mapped[int] = mapped_column(
        ForeignKey('usuario.id'), nullable=False)

    # Relaciones
    usuario: Mapped['Usuario'] = relationship(
        'Usuario', back_populates='articulos')
    articulos_favoritos: Mapped[list['ArticuloFavorito']] = relationship(
        'ArticuloFavorito', back_populates='articulo', cascade='all, delete-orphan')
    ratings: Mapped[list['Rating']] = relationship(
        'Rating', back_populates='articulo', cascade='all, delete-orphan')

    def __str__(self):
        return f'{self.titulo} - {self.categoria}'

    def serialize(self):
        return {
            'id': self.id,
            'titulo': self.titulo,
            'caracteristicas': self.caracteristicas,
            'estado': self.estado,
            'modelo': self.modelo,
            'cantidad': self.cantidad,
            'categoria': self.categoria,
            'usuario_id': self.usuario_id
        }


class ArticuloFavorito(db.Model):
    __tablename__ = 'articulo_favorito'

    id: Mapped[int] = mapped_column(primary_key=True)

    # Foreign Keys
    usuario_id: Mapped[int] = mapped_column(
        ForeignKey('usuario.id'), nullable=False)
    articulo_id: Mapped[int] = mapped_column(
        ForeignKey('articulo.id'), nullable=False)
    es_favorito: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=True)

    # Relaciones
    usuario: Mapped['Usuario'] = relationship(
        'Usuario', back_populates='articulos_favoritos')
    articulo: Mapped['Articulo'] = relationship(
        'Articulo', back_populates='articulos_favoritos')

    def __str__(self):
        return f'Trueke: {self.articulo_propietario.titulo} entre {self.propietario.nombre_de_usuario} y {self.receptor.nombre_de_usuario}'

    def serialize(self):
        return {
            'id': self.id,
            'usuario_id': self.usuario_id,
            'articulo_id': self.articulo_id,
            'es_favorito': self.es_favorito,
            'articulo': self.articulo.serialize() if self.articulo else None
        }


class TransaccionTrueke(db.Model):
    __tablename__ = 'transaccion_trueke'

    id: Mapped[int] = mapped_column(primary_key=True)
    comentarios: Mapped[str] = mapped_column(String(150), nullable=True)

    # Foreign Keys
    articulo_propietario_id: Mapped[int] = mapped_column(
        ForeignKey('articulo.id'), nullable=False)
    articulo_receptor_id: Mapped[int] = mapped_column(
        ForeignKey('articulo.id'), nullable=False)

    # Relaciones
    articulo_propietario: Mapped['Articulo'] = relationship(
        'Articulo', foreign_keys=[articulo_propietario_id])
    articulo_receptor: Mapped['Articulo'] = relationship(
        'Articulo', foreign_keys=[articulo_receptor_id])
    comentarios_transaccion: Mapped[list['Comentario']] = relationship(
        'Comentario', back_populates='transaccion', cascade='all, delete-orphan')

    def __str__(self):
        return f'''Trueke: {self.articulo_propietario.usuario.nombre_de_usuario} y {self.articulo_receptor.usuario.nombre_de_usuario} 
        intercambian {self.articulo_propietario.titulo} y {self.articulo_receptor.titulo} respectivamente'''

    def serialize(self):
        return {
            'id': self.id,
            'articulo_propietario_id': self.articulo_propietario_id,
            'articulo_receptor_id': self.articulo_receptor_id,
            'propietario': self.articulo_propietario.usuario.nombre_de_usuario,
            'receptor': self.articulo_receptor.usuario.nombre_de_usuario,
            'comentarios': self.comentarios
        }


class Comentario(db.Model):
    __tablename__ = 'comentario'

    id: Mapped[int] = mapped_column(primary_key=True)  # Agregado para PK
    comentario: Mapped[str] = mapped_column(String(200), nullable=False)

    # Foreign Keys
    usuario_id: Mapped[int] = mapped_column(
        ForeignKey('usuario.id'), nullable=False)
    transaccion_id: Mapped[int] = mapped_column(
        ForeignKey('transaccion_trueke.id'), nullable=False)

    # Relaciones
    usuario: Mapped['Usuario'] = relationship(
        'Usuario', back_populates='comentarios')
    transaccion: Mapped['TransaccionTrueke'] = relationship(
        'TransaccionTrueke', back_populates='comentarios_transaccion')

    def __str__(self):
        return f'Comentario de {self.usuario.nombre_de_usuario}: {self.comentario[:50]}...'

    def serialize(self):
        return {
            'id': self.id,
            'comentario': self.comentario,
            'usuario_id': self.usuario_id,
            'transaccion_id': self.transaccion_id
        }


class DatosPersonales(db.Model):
    __tablename__ = 'datos_personales'

    id: Mapped[int] = mapped_column(primary_key=True)
    nombre_completo: Mapped[str] = mapped_column(String(50), nullable=False)
    telefono: Mapped[str] = mapped_column(String(15), nullable=True)
    direccion: Mapped[str] = mapped_column(String(50), nullable=False)
    fecha_registro: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.utcnow)
    img: Mapped[str] = mapped_column(String(200), nullable=False)

    # Foreign Key
    usuario_id: Mapped[int] = mapped_column(
        ForeignKey('usuario.id'), nullable=False)

    # Relaciones
    usuario: Mapped['Usuario'] = relationship(
        'Usuario', back_populates='datos_personales')

    def __str__(self):
        return f'{self.nombre_completo} - {self.usuario.nombre_de_usuario}'

    def serialize(self):
        return {
            'id': self.id,
            'nombre_completo': self.nombre_completo,
            'telefono': self.telefono,
            'direccion': self.direccion,
            'fecha_registro': self.fecha_registro.isoformat() if self.fecha_registro else None,
            'usuario_id': self.usuario_id
        }


class Rating(db.Model):
    __tablename__ = 'rating'

    id: Mapped[int] = mapped_column(primary_key=True)
    puntuacion: Mapped[int] = mapped_column(Integer, nullable=False)
    comentarios: Mapped[str] = mapped_column(String(100), nullable=True)

    # Foreign Keys
    usuario_id: Mapped[int] = mapped_column(
        ForeignKey('usuario.id'), nullable=False)
    articulo_id: Mapped[int] = mapped_column(
        ForeignKey('articulo.id'), nullable=False)

    # Relaciones
    usuario: Mapped['Usuario'] = relationship(
        'Usuario', back_populates='ratings')
    articulo: Mapped['Articulo'] = relationship(
        'Articulo', back_populates='ratings')

    __table_args__ = (
        CheckConstraint('puntuacion >= 1 AND puntuacion <= 5',
                        name='check_puntuacion_rango'),
    )

    def __str__(self):
        return f'Rating {self.puntuacion}/5 para {self.articulo.titulo}'

    def serialize(self):
        return {
            'id': self.id,
            'puntuacion': self.puntuacion,
            'comentarios': self.comentarios,
            'usuario_id': self.usuario_id,
            'articulo_id': self.articulo_id
        }


def fecha_expedicion_default():
    return datetime.now() + timedelta(hours=2)


class RestaurarCodigosPassword(db.Model):
    __tablename__ = 'restaurar_codigos_password'

    codigo_uuid: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    fecha_expedicion: Mapped[datetime] = mapped_column(
        DateTime, default=fecha_expedicion_default)
