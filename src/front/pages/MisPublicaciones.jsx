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
          navigate('/login');
          return;
        }

        const response = await fetch(`${backendUrl}/api/mis-publicaciones`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.msg || `Error ${response.status}`);
        }

        const data = await response.json();
        setPublicaciones(data);
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          title: "Error",
          text: error.message || "Error al cargar tus publicaciones",
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPublicaciones();
  }, [navigate]);

  const handleVerPublicacion = (id) => {
    navigate(`/articulo/${id}`);
  };

  const handleEditarPublicacion = (id, e) => {
    e.stopPropagation();
    navigate(`/editar-publicacion/${id}`);
  };

  const handleEliminarPublicacion = async (id, e) => {
    e.stopPropagation();

    const confirmacion = await Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (!confirmacion.isConfirmed) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${backendUrl}/api/eliminar-articulo/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || `Error ${response.status}`);
      }

      // Actualizar el estado eliminando la publicación
      setPublicaciones(publicaciones.filter(pub => pub.id !== id));

      Swal.fire(
        '¡Eliminado!',
        'Tu publicación ha sido eliminada.',
        'success'
      );
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error",
        text: error.message || "Error al eliminar la publicación",
        icon: "error",
      });
    }
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
            <motion.div
              key={publicacion.id}
              className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
              style={{ cursor: "pointer" }}
              onClick={() => handleVerPublicacion(publicacion.id)}
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="d-flex align-items-center flex-grow-1">
                <img
                  src={publicacion.img || "https://via.placeholder.com/100"}
                  alt={publicacion.titulo}
                  className="me-3 rounded"
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/100";
                  }}
                />
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start">
                    <h5 className="mb-1">{publicacion.titulo}</h5>
                    <span className={`badge rounded-pill ${publicacion.estado === 'nuevo' ? 'bg-success' :
                        publicacion.estado === 'como_nuevo' ? 'bg-primary' :
                          publicacion.estado === 'bueno' ? 'bg-info' :
                            publicacion.estado === 'regular' ? 'bg-warning' : 'bg-secondary'
                      }`}>
                      {publicacion.estado?.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="mb-1 text-muted">
                    {publicacion.caracteristicas?.substring(0, 100)}...
                  </p>
                  <div className="d-flex gap-2 flex-wrap">
                    <small className="text-muted">
                      <strong>Categoría:</strong> {publicacion.categoria}
                    </small>
                    <small className="text-muted">
                      <strong>Modelo:</strong> {publicacion.modelo || 'No especificado'}
                    </small>
                    <small className="text-muted">
                      <strong>Precio:</strong> ${publicacion.precio?.toLocaleString() || 'No especificado'}
                    </small>
                  </div>
                </div>
              </div>
              <div className="d-flex flex-column align-items-end ms-3">
                <div className="d-flex gap-2 mb-2">
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={(e) => handleEditarPublicacion(publicacion.id, e)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={(e) => handleEliminarPublicacion(publicacion.id, e)}
                  >
                    Eliminar
                  </button>
                </div>
                <small className="text-muted">
                  {publicacion.fecha_publicacion ?
                    new Date(publicacion.fecha_publicacion).toLocaleDateString() :
                    'Sin fecha'}
                </small>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};