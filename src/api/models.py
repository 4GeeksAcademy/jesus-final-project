from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'usuario'

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    def serialize(self):
        return {
            'id': self.id,
            'email': self.email,
            # do not serialize the password, it's a security breach
        }


class Articulos(db.Model):  # corregido db.model a db.Model
    __tablename__ = 'articulos'

    id: Mapped[int] = mapped_column(primary_key=True)
    nombre_articulo: Mapped[str] = mapped_column(String(25), unique=True, nullable=False)
    caracteristicas: Mapped[str] = mapped_column(String(200))
    cantidad: Mapped[int] = mapped_column(nullable=True, default=1)
    estado: Mapped[str] = mapped_column(String(50), nullable=False)
    categoria: Mapped[str] = mapped_column(String(50), nullable=False)

    usuario_id: Mapped[int] = mapped_column(ForeignKey('usuario.id'))
    usuario: Mapped['User'] = relationship('User', back_populates='articulos')

    articulo_favorito_id: Mapped[int] = mapped_column(ForeignKey('articulo_favorito.id'))
    articulo_favorito: Mapped['Articulo_Favorito'] = relationship('Articulo_Favorito', back_populates='articulos')

    rating_id: Mapped[int] = mapped_column(ForeignKey('rating.id'))
    rating: Mapped['Rating'] = relationship('Rating', back_populates='articulos')

    transaccion_trueke_id: Mapped[int] = mapped_column(ForeignKey('trueke.id'), unique=True)
    transaccion_trueke: Mapped['Trueke'] = relationship('Trueke', back_populates='articulos', uselist=False)
