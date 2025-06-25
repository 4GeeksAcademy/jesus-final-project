from sqlalchemy import ForeignKey, Integer
from sqlalchemy import String, Boolean, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

db = SQLAlchemy()

class Usuario(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

class ArticuloFavorito(db.Model):
    __tablename__ = 'articulos_favoritos'
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    usuario_id: Mapped[int] = mapped_column(ForeignKey('usuario.id'))
    articulo_id: Mapped[int] = mapped_column(ForeignKey('articulo.id'))
    usuario: Mapped['Usuario'] = relationship('Usuario', back_populates='articulos')
    articulo_favorito_id: Mapped[int] = mapped_column(ForeignKey('articulo_favorito.id'))
    articulo_favorito: Mapped['Articulo_Favorito'] = relationship('Articulo_Favorito', back_populates='articulos')
    
    def serialize(self):
        return {
            "id": self.id,
            "usuario_id": self.usuario_id,
            "articulo_id": self.articulo_id
            }