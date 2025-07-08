import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const TruekeDetalle = () => {
  const navigate = useNavigate();
  const { truekeId } = useParams();
  const [trueke, setTrueke] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrueke = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch(`${backendUrl}api/trueke-detalle/${truekeId}`, {
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
        setTrueke(data);
        
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          title: "Error",
          text: error.message || "Error al cargar el trueke",
          icon: "error",
        });
        /* navigate(-1); // Volver atrás si hay error */
      } finally {
        setLoading(false);
      }
    };

    fetchTrueke();
  }, [navigate, truekeId]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!trueke) {
    return (
      <div className="container mt-5 pt-4 text-center">
        <h4>No se encontró el trueke</h4>
        <button className="btn btn-primary mt-3" onClick={() => navigate(-1)}>
          Volver
        </button>
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
      <button className="btn btn-outline-secondary mb-4" onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left"></i> Volver
      </button>

      <div className="card">
        <div className="card-header">
          <h4>Detalle del Trueke</h4>
          {/* <small className="text-muted">Fecha: {trueke.fecha_creacion}</small> */}
        </div>
        
        <div className="card-body">
          <div className="row">
            <div className="col-md-5">
              <div className="card">
                <div className="card-header bg-primary text-white">
                  <h5>Tu artículo</h5>
                </div>
                <div className="card-body">
                  <div className="d-flex">
                    <img
                      src={trueke.articulo_receptor.img || "https://via.placeholder.com/100"}
                      alt={trueke.articulo_receptor.titulo}
                      className="me-3 rounded"
                      style={{ width: "100px", height: "100px", objectFit: "cover" }}
                    />
                    <div>
                      <h5>{trueke.articulo_receptor.titulo}</h5>
                      <p>{trueke.articulo_receptor.caracteristicas}</p>
                      <p><strong>Categoría:</strong> {trueke.articulo_receptor.categoria}</p>
                      <p><strong>Estado:</strong> {trueke.articulo_receptor.estado}</p>
                      <p><strong>De:</strong> {trueke.articulo_receptor.usuario.nombre_de_usuario}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-2 d-flex align-items-center justify-content-center">
              <i className="bi bi-arrow-left-right fs-1"></i>
            </div>
            
            <div className="col-md-5">
              <div className="card">
                <div className="card-header bg-success text-white">
                  <h5>Artículo a recibir</h5>
                </div>
                <div className="card-body">
                  <div className="d-flex">
                    <img
                      src={trueke.articulo_propietario.img || "https://via.placeholder.com/100"}
                      alt={trueke.articulo_propietario.titulo}
                      className="me-3 rounded"
                      style={{ width: "100px", height: "100px", objectFit: "cover" }}
                    />
                    <div>
                      <h5>{trueke.articulo_propietario.titulo}</h5>
                      <p>{trueke.articulo_propietario.caracteristicas}</p>
                      <p><strong>Categoría:</strong> {trueke.articulo_propietario.categoria}</p>
                      <p><strong>Estado:</strong> {trueke.articulo_propietario.estado}</p>
                      <p><strong>Hacia:</strong> {trueke.articulo_propietario.usuario.nombre_de_usuario}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <h5>Comentarios</h5>
            {trueke.comentarios_transaccion && trueke.comentarios_transaccion.comentario.length > 0 ? (
              <div className="list-group">
                <div className="d-flex justify-content-between">
                  <strong>{trueke.comentarios_transaccion.comentario.usuario}</strong>
                </div>
                <p>{trueke.comentarios_transaccion.comentario}</p>
              </div>
            ) : (
              <p>No hay comentarios en este trueke</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};