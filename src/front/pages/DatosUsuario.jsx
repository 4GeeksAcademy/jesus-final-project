import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const DatosUsuario = () => {
  const { usuarioId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchDatosUsuario = async () => {
      try {
        const response = await fetch(`${backendUrl}api/datos-usuario/${usuarioId}`);
        if (response.ok) {
          const data = await response.json();
          console.log("Datos del usuario:", data);
          setUserData(data);
        } else {
          const errorData = await response.json();
          console.error("Error al obtener los datos:", errorData);
        }
      } catch (error) {
        console.error("Error de red:", error);
      }
    };

    if (usuarioId) fetchDatosUsuario();
  }, [usuarioId]);

  if (!userData) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
        <div className="spinner" />
      </div>
    );
  }

  const publicaciones = userData.publicaciones || [];
  const userRating = userData.userRating || null;


  const renderStars = (rating) => {
    const starsCount = Math.min(5, Math.round(rating));
    return '⭐'.repeat(starsCount);
  };


  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      transition={{ duration: 0.5 }}
      className="container mt-4"
    >
      <h2>Datos Personales</h2>

    
      <div className="mb-3">
        <label className="form-label fw-bold">Nombre de usuario</label>
        <p className="form-control bg-light">{userData.nombre_de_usuario}</p>
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">Fecha de Registro</label>
        <p className="form-control bg-light">
          {new Date(userData.fecha_registro).toLocaleDateString("es-ES")}
        </p>
      </div>

      <div id="publicacionesCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          {publicaciones.length === 0 ? (
            <div className="text-center mt-3">
              <p>Aún no tienes publicaciones</p>
            </div>
          ) : (
            publicaciones.map((publicacion, index) => (
              <div
                key={publicacion.id}
                className={`carousel-item ${index === 0 ? "active" : ""}`}
              >
                <div className="card d-flex flex-column align-items-center shadow-sm mt-4 bg-white rounded">
                  <div className="d-flex justify-content-center mt-4">
                    <h5>Publicaciones</h5>
                  </div>
                  <img
                    src={publicacion.img ?? ""}
                    alt={publicacion.titulo ?? "Imagen publicación"}
                    className="card-img-top rounded mt-3"
                    style={{
                      width: "auto",
                      height: "100px",
                      objectFit: "cover",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      if (publicacion.id) {
                        navigate(`/articulo/${publicacion.id}`);
                      }
                    }}
                  />
                  <div className="card-body text-center">
                    <h6
                      className="card-title fw-semibold text-truncate"
                      title={publicacion.titulo ?? ""}
                      style={{ maxWidth: "160px" }}
                    >
                      {publicacion.titulo ?? "Sin título"}
                    </h6>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {publicaciones.length > 0 && (
          <>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#publicacionesCarousel"
              data-bs-slide="prev"
              style={{ filter: "invert(1)" }}
            >
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Anterior</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#publicacionesCarousel"
              data-bs-slide="next"
              style={{ filter: "invert(1)" }}
            >
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Siguiente</span>
            </button>
          </>
        )}
      </div>

      <motion.div
        className="card2 my-5"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ scale: 1.03 }}
        style={styles.card2}
      >
        <div style={styles.content}>
          <div style={styles.titleContainer} className="d-flex justify-content-center">
            <h3 style={styles.title}>
              {!userRating || userRating.cantidad_ratings === 0
                ? 'Este usuario aún no esta puntuado'
                : userRating.cantidad_ratings === 1
                  ? `${userRating.cantidad_ratings} valoración`
                  : `${userRating.cantidad_ratings} valoraciones`}
            </h3>
          </div>
          <div className="d-flex justify-content-center">
            <p style={styles.subtitle2} className="justify-content-center">
              {!userRating || userRating.cantidad_ratings === 0 ? (
                <strong>💭💭💭</strong>
              ) : (
                <>
                  <strong>Rating promedio:</strong> {userRating.promedio_rating} {renderStars(userRating.promedio_rating)}
                  <p>
                    {userRating.promedio_rating <= 2
                      ? 'Mejorá tus valoraciones para atraer más truekes 💪'
                      : 'Sigue así, mantené tus valoraciones altas 🚀'}
                  </p>
                </>
              )}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const styles = {


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

  subtitle2: {
    margin: "0",
    fontSize: "0.9rem",
    color: "#fff",
  },
  card2: {
    border: "1px solid #e0e0e0",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    overflow: "hidden",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    backgroundColor: "#262626",
    color: "#fff",
  },

};