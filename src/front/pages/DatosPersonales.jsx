import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const DatosPersonales = () => {
  const [datosPersonalesEditados, setDatosPersonalesEditados] = useState({
    nombre_completo: "",
    telefono: "",
    direccion: "",
    img: ""
  });
  const [articulosFavoritos, setArticulosFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);
  const navigate = useNavigate();
  const { usuarioId } = useParams();

  const token = localStorage.getItem("token");
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    if (!token) {
      navigate("/identificate");
      return;
    }

    if (usuarioId && usuarioId !== currentUserId) {
      Swal.fire({
        title: "Acceso denegado",
        text: "No puedes ver los datos de otro usuario",
        icon: "error",
      }).then(() => {
        navigate("/");
      });
      return;
    }

    obtenerDatosPersonales();
    obtenerFavoritos();
  }, [token, usuarioId, currentUserId, navigate]);

  const obtenerDatosPersonales = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/datos-personales`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDatosPersonalesEditados(data);
      } else if (response.status === 404) {
        setDatosPersonalesEditados({
          nombre_completo: "",
          telefono: "",
          direccion: "",
          img: ""
        });
      }
    } catch (error) {
      console.error('Error al obtener datos personales:', error);
    } finally {
      setLoading(false);
    }
  };

  const editarDatosPersonales = async () => {
    if (!token) {
      Swal.fire({
        title: "Error",
        text: "Debes iniciar sesión",
        icon: "error",
      });
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/datos-personales`, {
        method: "PUT",
        body: JSON.stringify(datosPersonalesEditados),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        Swal.fire({
          title: "Éxito",
          text: "Datos actualizados correctamente",
          icon: "success",
        });
        setEditando(false);
      } else {
        const errorData = await response.json();
        Swal.fire({
          title: "Error",
          text: errorData.msg || "Error al actualizar datos",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Error de conexión",
        icon: "error",
      });
    }
  };

  const obtenerFavoritos = async () => {
    if (!token) return;

    try {
      const response = await fetch(`${backendUrl}/api/favoritos`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const favoritosIds = await response.json();
        
        const articulosDetalle = await Promise.all(
          favoritosIds.map(async (id) => {
            try {
              const articuloResponse = await fetch(`${backendUrl}/api/articulo/${id}`);
              if (articuloResponse.ok) {
                return await articuloResponse.json();
              }
            } catch (error) {
              console.error(`Error al obtener artículo ${id}:`, error);
            }
            return null;
          })
        );

        setArticulosFavoritos(articulosDetalle.filter(articulo => articulo !== null));
      }
    } catch (error) {
      console.error('Error al obtener favoritos:', error);
    }
  };

  const eliminarFavorito = async (articuloId) => {
    try {
      const response = await fetch(`${backendUrl}/api/eliminar-articulos-favoritos/${articuloId}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setArticulosFavoritos(prev => prev.filter(articulo => articulo.id !== articuloId));
        Swal.fire({
          title: "Eliminado",
          text: "Artículo eliminado de favoritos",
          icon: "success",
          timer: 1500,
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Error al eliminar favorito",
        icon: "error",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDatosPersonalesEditados(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    editarDatosPersonales();
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mt-4"
    >
      <div className="row">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Mis Datos Personales</h5>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setEditando(!editando)}
              >
                <i className="bi bi-pencil-square me-2"></i>
                {editando ? 'Cancelar' : 'Editar'}
              </button>
            </div>
            
            <div className="card-body">
              {editando ? (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="nombre_completo" className="form-label">Nombre Completo</label>
                    <input
                      type="text"
                      className="form-control"
                      id="nombre_completo"
                      name="nombre_completo"
                      value={datosPersonalesEditados.nombre_completo}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="telefono" className="form-label">Teléfono</label>
                    <input
                      type="tel"
                      className="form-control"
                      id="telefono"
                      name="telefono"
                      value={datosPersonalesEditados.telefono}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="direccion" className="form-label">Dirección</label>
                    <input
                      type="text"
                      className="form-control"
                      id="direccion"
                      name="direccion"
                      value={datosPersonalesEditados.direccion}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="img" className="form-label">URL de Imagen</label>
                    <input
                      type="url"
                      className="form-control"
                      id="img"
                      name="img"
                      value={datosPersonalesEditados.img}
                      onChange={handleInputChange}
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                  </div>
                  
                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setEditando(false)}
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Guardar Cambios
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <div className="row">
                    <div className="col-md-8">
                      <p><strong>Nombre Completo:</strong> {datosPersonalesEditados.nombre_completo || 'No especificado'}</p>
                      <p><strong>Teléfono:</strong> {datosPersonalesEditados.telefono || 'No especificado'}</p>
                      <p><strong>Dirección:</strong> {datosPersonalesEditados.direccion || 'No especificado'}</p>
                    </div>
                    <div className="col-md-4 text-center">
                      {datosPersonalesEditados.img && (
                        <img
                          src={datosPersonalesEditados.img}
                          alt="Foto de perfil"
                          className="img-fluid rounded-circle"
                          style={{ width: "100px", height: "100px", objectFit: "cover" }}
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/100x100?text=Sin+Imagen";
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Mis Favoritos ({articulosFavoritos.length})</h5>
            </div>
            
            <div className="card-body">
              {articulosFavoritos.length > 0 ? (
                <div className="row g-3">
                  {articulosFavoritos.map((articulo) => (
                    <div key={articulo.id} className="col-12">
                      <div className="card">
                        <div className="row g-0">
                          <div className="col-4">
                            <img
                              src={articulo.img}
                              className="img-fluid rounded-start"
                              alt={articulo.titulo}
                              style={{ height: "80px", objectFit: "cover" }}
                            />
                          </div>
                          <div className="col-8">
                            <div className="card-body p-2">
                              <h6 className="card-title mb-1" style={{ fontSize: "0.9rem" }}>
                                {articulo.titulo}
                              </h6>
                              <p className="card-text mb-1" style={{ fontSize: "0.8rem" }}>
                                <strong>Estado:</strong> {articulo.estado}
                              </p>
                              <div className="d-flex justify-content-between align-items-center">
                                <Link
                                  to={`/articulo/${articulo.id}`}
                                  className="btn btn-outline-primary btn-sm"
                                >
                                  Ver
                                </Link>
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => eliminarFavorito(articulo.id)}
                                >
                                  <i className="bi bi-heart-fill"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted">
                  <i className="bi bi-heart display-4 mb-3"></i>
                  <p>No tienes artículos favoritos</p>
                  <Link to="/" className="btn btn-primary btn-sm">
                    Explorar Artículos
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <Link to="/" className="btn btn-secondary">
          <i className="bi bi-arrow-left me-2"></i>
          Volver al inicio
        </Link>
      </div>
    </motion.div>
  );
};