from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Integer, ForeignKey, Text, Enum, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'usuario'

    id: Mapped[int] = mapped_column(primary_key=True)
    nombre_de_usuario: Mapped[str] = mapped_column(
        String(25), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(25), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(
        String(255), nullable=False)  # Ampliado para hashes seguros
    is_active: Mapped[bool] = mapped_column(
        Boolean(), nullable=False, default=True)

    # Relaciones
    articulos: Mapped[list['Articulos']] = relationship(
        'Articulos', back_populates='usuario', cascade='all, delete-orphan')
    articulos_favoritos: Mapped[list['Articulo_favorito']] = relationship(
        'Articulo_favorito', back_populates='usuario', cascade='all, delete-orphan')
    ratings: Mapped[list['Rating']] = relationship(
        'Rating', back_populates='usuario', cascade='all, delete-orphan')
    datos_personales: Mapped[list['DatosPersonales']] = relationship(
        'DatosPersonales', back_populates='usuario', cascade='all, delete-orphan')
    comentarios: Mapped[list['Comentarios']] = relationship(
        'Comentarios', back_populates='usuario', cascade='all, delete-orphan')

    # Relaciones para transacciones (como user1 y user2)
    transacciones_como_propietario: Mapped[list['TransaccionTrueke']] = relationship(
        'TransaccionTrueke', foreign_keys='TransaccionTrueke.usuario_propietario_id', back_populates='propietario', cascade='all, delete-orphan')
    transacciones_como_receptor: Mapped[list['TransaccionTrueke']] = relationship(
        'TransaccionTrueke', foreign_keys='TransaccionTrueke.usuario_receptor_id', back_populates='receptor', cascade='all, delete-orphan')

    def __str__(self):
        return f'{self.nombre_de_usuario} ({self.email})'

    def serialize(self):
        return {
            'id': self.id,
            'nombre_de_usuario': self.nombre_de_usuario,
            'email': self.email,
            'is_active': self.is_active
        }


class Articulos(db.Model):
    __tablename__ = 'articulos'

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

    # Relaciones

    usuario_id: Mapped[int] = mapped_column(ForeignKey('usuario.id'), nullable=False)
    usuario: Mapped['User'] = relationship('User', back_populates='articulos')
    articulos_favoritos: Mapped[list['Articulo_favorito']] = relationship(
        'Articulo_favorito', back_populates='articulo', cascade='all, delete-orphan')
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


class Articulo_favorito(db.Model):
    __tablename__ = 'articulo_favorito'

    id: Mapped[int] = mapped_column(primary_key=True)

    # Foreign Keys
    usuario_id: Mapped[int] = mapped_column(
        ForeignKey('usuario.id'), nullable=False)
    articulo_id: Mapped[int] = mapped_column(
        ForeignKey('articulos.id'), nullable=False)

    # Relaciones
    usuario: Mapped['User'] = relationship(
        'User', back_populates='articulos_favoritos')
    articulo: Mapped['Articulos'] = relationship(
        'Articulos', back_populates='articulos_favoritos')

    def str(self):
        return f'Trueke: {self.articulo_propietario.titulo} entre {self.propietario.nombre_de_usuario} y {self.receptor.nombre_de_usuario}'

    def serialize(self):
        return {
            'id': self.id,
            'usuario_id': self.usuario_id,
            'articulo_id': self.articulo_id
        }


class TransaccionTrueke(db.Model):
    __tablename__ = 'transaccion_trueke'

    id: Mapped[int] = mapped_column(primary_key=True)
    comentarios: Mapped[str] = mapped_column(String(100), nullable=True)

    # Foreign Keys
    articulo_id_propietario: Mapped[int] = mapped_column(
        ForeignKey('articulos.id'), nullable=False)
    articulo_id_receptor: Mapped[int] = mapped_column(
        ForeignKey('articulos.id'), nullable=False)
    usuario_propietario_id: Mapped[int] = mapped_column(
        ForeignKey('usuario.id'), nullable=False)
    usuario_receptor_id: Mapped[int] = mapped_column(
        ForeignKey('usuario.id'), nullable=False)

    # Relaciones
    articulo_propietario: Mapped['Articulos'] = relationship(
        'Articulos', foreign_keys=[articulo_id_propietario])
    articulo_receptor: Mapped['Articulos'] = relationship(
        'Articulos', foreign_keys=[articulo_id_receptor])
    propietario: Mapped['User'] = relationship(
        'User', foreign_keys=[usuario_propietario_id], back_populates='transacciones_como_propietario')
    receptor: Mapped['User'] = relationship(
        'User', foreign_keys=[usuario_receptor_id], back_populates='transacciones_como_receptor')
    comentarios_transaccion: Mapped[list['Comentarios']] = relationship(
        'Comentarios', back_populates='transaccion', cascade='all, delete-orphan')

    def __str__(self):
        return f'Trueke: {self.articulo_propietario.titulo} entre {self.propietario.nombre_de_usuario} y {self.receptor.nombre_de_usuario}'

    def serialize(self):
        return {
            'id': self.id,
            'articulo_id_propietario': self.articulo_id_propietario,
            'articulo_id_receptor': self.articulo_id_receptor,
            'usuario_propietario_id': self.usuario_propietario_id,
            'usuario_receptor_id': self.usuario_receptor_id,
            'comentarios': self.comentarios
        }


class Comentarios(db.Model):
    __tablename__ = 'comentarios'

    id: Mapped[int] = mapped_column(primary_key=True)  # Agregado para PK
    comentario: Mapped[str] = mapped_column(String(200), nullable=False)

    # Foreign Keys
    comentario_user_id: Mapped[int] = mapped_column(
        ForeignKey('usuario.id'), nullable=False)
    transaccion_id: Mapped[int] = mapped_column(
        ForeignKey('transaccion_trueke.id'), nullable=False)

    # Relaciones
    usuario: Mapped['User'] = relationship(
        'User', back_populates='comentarios')
    transaccion: Mapped['TransaccionTrueke'] = relationship(
        'TransaccionTrueke', back_populates='comentarios_transaccion')

    def __str__(self):
        return f'Comentario de {self.usuario.nombre_de_usuario}: {self.comentario[:50]}...'

    def serialize(self):
        return {
            'id': self.id,
            'comentario': self.comentario,
            'comentario_user_id': self.comentario_user_id,
            'transaccion_id': self.transaccion_id
        }


class DatosPersonales(db.Model):
    __tablename__ = 'datos_personales'

    id: Mapped[int] = mapped_column(primary_key=True)
    nombre_completo: Mapped[str] = mapped_column(String(25), nullable=False)
    telefono: Mapped[int] = mapped_column(Integer, nullable=True)
    direccion: Mapped[str] = mapped_column(String(50), nullable=False)
    fecha_registro: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.utcnow)
    img: Mapped[str] = mapped_column(String(200), nullable=False)

    # Foreign Key
    user_id: Mapped[int] = mapped_column(
        ForeignKey('usuario.id'), nullable=False)

    # Relaciones
    usuario: Mapped['User'] = relationship(
        'User', back_populates='datos_personales')

    def __str__(self):
        return f'{self.nombre_completo} - {self.usuario.nombre_de_usuario}'

    def serialize(self):
        return {
            'id': self.id,
            'nombre_completo': self.nombre_completo,
            'telefono': self.telefono,
            'direccion': self.direccion,
            'fecha_registro': self.fecha_registro.isoformat() if self.fecha_registro else None,
            'user_id': self.user_id
        }


class Rating(db.Model):
    __tablename__ = 'rating'

    id: Mapped[int] = mapped_column(primary_key=True)
    valoraciones: Mapped[int] = mapped_column(Integer, nullable=False)
    comentarios: Mapped[str] = mapped_column(String(100), nullable=True)

    # Foreign Keys
    usuario_id: Mapped[int] = mapped_column(
        ForeignKey('usuario.id'), nullable=False)
    articulo_id: Mapped[int] = mapped_column(
        ForeignKey('articulos.id'), nullable=False)

    # Relaciones
    usuario: Mapped['User'] = relationship('User', back_populates='ratings')
    articulo: Mapped['Articulos'] = relationship(
        'Articulos', back_populates='ratings')

    def __str__(self):
        return f'Rating {self.valoraciones}/5 para {self.articulo.titulo}'

    def serialize(self):
        return {
            'id': self.id,
            'valoraciones': self.valoraciones,
            'comentarios': self.comentarios,
            'usuario_id': self.usuario_id,
            'articulo_id': self.articulo_id
        }
