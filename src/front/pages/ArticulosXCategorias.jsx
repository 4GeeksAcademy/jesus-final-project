import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const ArticulosXCategoria = () => {
  const { categorias } = useParams();
  const [articulos, setArticulos] = useState([]);

  useEffect(() => {
    const fetchArticulos = async () => {
      try {
        const response = await fetch(`${backendUrl}api/articulos/categoria/${categorias}`);
        if (response.ok) {
          const data = await response.json();
          setArticulos(data);
        }
      } catch (err) {
        console.error("Error al cargar artículos por categoría", err);
      }
    };

    fetchArticulos();
  }, [categorias]);


  return (
    <div>
      {Array.isArray(articulos) && articulos.length > 0 ? (
        articulos.map((articulo) => (
          <div key={articulo.id}>
            <h4>{articulo.titulo}</h4>
            <img src={articulo.img} alt={articulo.titulo} width={100} />
          </div>
        ))
      ) : (
        <div>
          <div className="d-flex justify-content-center pt-4"><p>No hay artículos en esta categoría.</p> </div>
          <div> <img src="https://source.unsplash.com/300x200/?empty,box" alt="" /></div>
        </div>
      )}
    </div>
  );
};
