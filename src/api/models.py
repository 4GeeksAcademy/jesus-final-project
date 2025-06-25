from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship  

db = SQLAlchemy()          

    
          

class Comentarios(db.Model):
    __tablename__ = 'comentarios'

    comentario_user_id: Mapped[int] = mapped_column(ForeignKey('usuario.id'), primary_key=True)
    comentario: Mapped[str] = mapped_column(String(200), nullable=False)
    transaccion_id: Mapped[int] = mapped_column(ForeignKey('transaccion_trueke.id'), primary_key=True)

    usuario: Mapped["Usuario"] = relationship("Usuario", back_populates="comentarios")
    transaccion: Mapped["TransaccionTrueke"] = relationship("TransaccionTrueke", back_populates="comentarios")


class Rating(db.Model):
    __tablename__ = 'rating'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    usuario_id: Mapped[int] = mapped_column(ForeignKey('usuario.id'), nullable=False)
    articulo_id: Mapped[int] = mapped_column(ForeignKey('articulo.id'), nullable=False)
    valoraciones: Mapped[int] = mapped_column(Integer, nullable=False)
    comentarios: Mapped[str] = mapped_column(String(100), nullable=True)

    usuario: Mapped["Usuario"] = relationship("Usuario", back_populates="ratings")    
    articulo: Mapped["Articulo"] = relationship("Articulo", back_populates="ratings")             










from eralchemy2 import render_er
render_er(db.Model, 'diagram.png')






def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        }
