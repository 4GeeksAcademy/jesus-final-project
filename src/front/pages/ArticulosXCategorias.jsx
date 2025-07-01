import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const ArticulosXCategoria = () => {
  const { categorias } = useParams();
  const [articulos, setArticulos] = useState([]);
  const navigate = useNavigate();

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


  const [likes, setLikes] = useState({});


  const token = localStorage.getItem("token");

  const toggleLike = (id) => {
    setLikes((prev) => {
      const isLiked = !prev[id];

      if (!token) return prev;

      if (isLiked) {

        fetch(`${backendUrl}api/agregar-articulos-favoritos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ articulo_id: id }),
        })
          .then((res) => {
            if (!res.ok) throw new Error("Error al agregar favorito");
            return res.json();
          })
          .then((data) => {
            console.log(data.msg);
          })
          .catch((err) => {
            console.error(err);
          });
      } else {

        fetch(`${backendUrl}api/eliminar-articulo-favorito/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => {
            if (!res.ok) throw new Error("Error al eliminar favorito");
            return res.json();
          })
          .then((data) => {
            console.log(data.msg);
          })
          .catch((err) => {
            console.error(err);
          });
      }

      return { ...prev, [id]: isLiked };
    });
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

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
            whileHover={{ scale: 1.03 }}
            style={styles.card}
          >
            <img src={articulo.img} alt={articulo.titulo} style={styles.image} />
            <div style={styles.content}>
              <div style={styles.titleContainer}>
                <h3 style={styles.title}>{articulo.titulo}</h3>
                {token && (
                  <span
                    style={styles.heart}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(articulo.id);
                    }}
                  >
                    {likes[articulo.id] ? (
                      <i className="bi bi-heart-fill"></i>
                    ) : (
                      <i className="bi bi-heart"></i>
                    )}
                  </span>
                )}
              </div>

              <p style={styles.subtitle}>
                <strong>Modelo:</strong> {articulo.modelo}
              </p>
              <p style={styles.subtitle}>
                <strong>Estado:</strong> {articulo.estado}
              </p>
              <p style={styles.subtitle}>
                <strong>Categoría:</strong> {articulo.categoria}
              </p>
              <div className="d-flex">
                <p style={styles.subtitle}>
                  <strong>Cantidad:</strong> {articulo.cantidad}
                </p>
                <span
                  style={styles.box}
                  onClick={() => {
                    navigate(`/articulo/${articulo.id}`);
                  }}
                  className="ms-auto"
                >
                  <i className="bi bi-box2-heart"></i>
                </span>
              </div>
              <div style={styles.caracteristicas}>
                <p>
                  <strong>Características:</strong> {articulo.caracteristicas}
                </p>
              </div>
            </div>
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
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "24px",
    padding: "40px 20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  card: {
    backgroundColor: "#fff",
    border: "1px solid #e0e0e0",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    overflow: "hidden",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  image: {
    width: "100%",
    height: "280px",
    objectFit: "cover",
  },
  content: {
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  titleContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    margin: "0",
    fontSize: "1.1rem",
    fontWeight: "600",
  },
  heart: {
    color: "red",
    fontSize: "1.2rem",
    cursor: "pointer",
    userSelect: "none",
  },
  box: {
    color: "black",
    fontSize: "1.2rem",
    cursor: "pointer",
    userSelect: "none",
  },
  subtitle: {
    margin: "0",
    fontSize: "0.9rem",
    color: "#444",
  },
  caracteristicas: {
    maxHeight: "60px",
    overflowY: "auto",
    fontSize: "0.85rem",
    color: "#333",
    backgroundColor: "#f9f9f9",
    padding: "8px",
    borderRadius: "6px",
    marginTop: "8px",
    border: "1px solid #eee",
  },
};
