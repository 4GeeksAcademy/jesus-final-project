from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'usuario'

    id: Mapped[int] = mapped_column(primary_key=True)
    nombre_de_usuario: Mapped[str] = mapped_column(String(25), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    # Relaciones
    articulos_usuario: Mapped[list["Articulos"]] = relationship("Articulos", back_populates="usuario", cascade="all, delete-orphan")
    articulos_favoritos: Mapped[list["Articulos_Favoritos"]] = relationship("Articulos_Favoritos", back_populates="usuario", cascade="all, delete-orphan")
    rating: Mapped[list["Rating"]] = relationship("Rating", back_populates="usuario", cascade="all, delete-orphan")
    datos_personales: Mapped[list["Datos_personales"]] = relationship("Datos_personales", back_populates="usuario", cascade="all, delete-orphan")
    comentarios: Mapped[list["Comentarios"]] = relationship("Comentarios", back_populates="usuario", cascade="all, delete-orphan")
    trueke: Mapped[list["Trueke"]] = relationship("Trueke", back_populates="usuario", cascade="all, delete-orphan")

    def __str__(self):
        return f"{self.nombre_de_usuario} ({self.email})"

    def serialize(self):
        return {
            "id": self.id,
            "nombre_de_usuario": self.nombre_de_usuario,
            "email": self.email,
            # do not serialize the password, it's a security breach
        }
