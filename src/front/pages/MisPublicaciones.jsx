import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const MisPublicaciones = () => {
  const navigate = useNavigate();
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicaciones = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error("No hay token de autenticación");
        }

        console.log("Intentando conectar a:", `${backendUrl}/mis-publicaciones`); // Debug

        const response = await fetch(`${backendUrl}/mis-publicaciones`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log("Respuesta del servidor:", response); // Debug

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.msg || `Error ${response.status}`);
        }

        const data = await response.json();
        console.log("Datos recibidos:", data); // Debug
        setPublicaciones(data);
      } catch (error) {
        console.error("Error completo:", error); // Debug
        Swal.fire({
          title: "Error",
          text: error.message,
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPublicaciones();
  }, []);

  const handleVerPublicacion = (id) => {
    navigate(`/articulo/${id}`);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="container mt-5 pt-4"
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Mis Publicaciones</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/crear-publicacion")}
        >
          + Nueva Publicación
        </button>
      </div>

      {publicaciones.length === 0 ? (
        <div className="text-center py-5">
          <h4>No tienes publicaciones aún</h4>
          <p>Comienza creando tu primera publicación</p>
          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate("/crear-publicacion")}
          >
            Crear Publicación
          </button>
        </div>
      ) : (
        <div className="list-group">
          {publicaciones.map((publicacion) => (
            <div
              key={publicacion.id}
              className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
              style={{ cursor: "pointer" }}
              onClick={() => handleVerPublicacion(publicacion.id)}
            >
              <div className="d-flex align-items-center">
                <img
                  src={publicacion.img || "https://via.placeholder.com/100"}
                  alt={publicacion.titulo}
                  className="me-3 rounded"
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/100";
                  }}
                />
                <div>
                  <h5 className="mb-1">{publicacion.titulo}</h5>
                  <p className="mb-1 text-muted">
                    {publicacion.caracteristicas?.substring(0, 100)}...
                  </p>
                  <div className="d-flex gap-2">
                    <small className="text-muted">
                      <strong>Categoría:</strong> {publicacion.categoria}
                    </small>
                    <small className="text-muted">
                      <strong>Modelo:</strong> {publicacion.modelo || 'No especificado'}
                    </small>
                  </div>
                </div>
              </div>
              <div className="d-flex flex-column align-items-end">
                <span className={`badge rounded-pill ${publicacion.estado === 'nuevo' ? 'bg-success' :
                  publicacion.estado === 'como_nuevo' ? 'bg-primary' :
                    publicacion.estado === 'bueno' ? 'bg-info' :
                      publicacion.estado === 'regular' ? 'bg-warning' : 'bg-secondary'
                  }`}>
                  {publicacion.estado}
                </span>
                <small className="text-muted mt-1">
                  {publicacion.fecha_publicacion ?
                    new Date(publicacion.fecha_publicacion).toLocaleDateString() :
                    'Sin fecha'}
                </small>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};