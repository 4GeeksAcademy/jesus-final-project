from sqlalchemy import ForeignKey, Integer
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

db = SQLAlchemy()

class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

class ArticuloFavorito(db.Model):
    __tablename__ = 'articulo_favorito'
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    usuario_id: Mapped[int] = mapped_column(ForeignKey('usuario.id'))
    articulo_id: Mapped[int] = mapped_column(ForeignKey('articulo.id'))

   # usuario: Mapped['Usuario'] = relationship(back_populates='articulo_favorito')
   # articulo: Mapped['Articulo'] = relationship(back_populates='a')

    def articulos_favoritos(self):
        return [rel.articulo for rel in self.articulos_favoritos_rel]


    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        }