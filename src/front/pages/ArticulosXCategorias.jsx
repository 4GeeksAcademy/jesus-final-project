import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3 }
  }
};


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
    <div style={styles.container}>
      {Array.isArray(articulos) && articulos.length > 0 ? (
        articulos.map((articulo) => (
          <motion.div
            key={articulo.id}
            className="card"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.05 }}
            style={styles.card}
          >
            <img
              src={articulo.img}
              alt={articulo.titulo}
              style={styles.image}
            />
            <h3 style={styles.title}>{articulo.titulo}</h3>
            <p><strong>Modelo:</strong> {articulo.modelo}</p>
            <p><strong>Estado:</strong> {articulo.estado}</p>
            <p><strong>Categoría:</strong> {articulo.categoria}</p>
            <p><strong>Cantidad:</strong> {articulo.cantidad}</p>
            <p><strong>Características:</strong> {articulo.caracteristicas}</p>
          </motion.div>
        ))
      ) : (
        <div style={{ textAlign: "center", marginTop: "40px", width: "100%" }}>
          <p>No hay artículos en esta categoría.</p>
          <img src="https://source.unsplash.com/300x200/?empty,box" alt="No articles" />
        </div>
      )}
    </div>
  );
};
const styles = {
  container: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "20px",
    padding: "20px",
  },
  card: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    padding: "20px",
    width: "20%",
    minWidth: "280px",
    boxSizing: "border-box",
    cursor: "pointer",
  },
  image: {
    width: "100%",
    height: "160px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "12px",
  },
  title: {
    margin: "0 0 8px 0",
  },
};

