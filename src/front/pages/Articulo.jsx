import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const Articulo = () => {
  const [error, setError] = useState(null);
  const [datosArticulo, setDatosArticulo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [esFavorito, setEsFavorito] = useState(false);
  const [editando, setEditando] = useState(false);
  const navigate = useNavigate();

  const { id } = useParams();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const obtenerArticulo = async (id) => {
    try {
      const response = await fetch(`${backendUrl}/api/articulo/${id}`, { method: "GET" });
      if (response.ok) {
        const data = await response.json();
        setDatosArticulo(data);
      } else {
        const errorMsg = await response.text();
        setDatosArticulo(null);
        setError(errorMsg);
      }
    } catch (error) {
      setDatosArticulo(null);
      setError("Error en la solicitud: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const verificarFavorito = async () => {
    if (!token) return;
    
    try {
      const response = await fetch(`${backendUrl}/api/favoritos`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const favoritos = await response.json();
        setEsFavorito(favoritos.includes(parseInt(id)));
      }
    } catch (error) {
      console.error('Error al verificar favorito:', error);
    }
  };

  useEffect(() => {
    if (id) {
      obtenerArticulo(id);
      verificarFavorito();
    }
  }, [id]);

  const eliminarArticulo = async () => {
    if (!token) {
      Swal.fire({
        title: "Error",
        text: "Debes iniciar sesión para eliminar artículos",
        icon: "error",
      });
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/eliminar-articulo/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.ok) {
        Swal.fire({
          title: "Éxito",
          text: "Artículo eliminado correctamente",
          icon: "success",
        }).then(() => {
          navigate("/");
        });
      } else {
        const errorData = await response.json();
        Swal.fire({
          title: "Error",
          text: errorData.msg || "Error al eliminar el artículo",
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

  const editarArticulo = async (datosEditados) => {
    if (!token) {
      Swal.fire({
        title: "Error",
        text: "Debes iniciar sesión para editar artículos",
        icon: "error",
      });
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/editar-datos-articulo/${id}`, {
        method: "PUT",
        body: JSON.stringify(datosEditados),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        Swal.fire({
          title: "Éxito",
          text: "Artículo editado correctamente",
          icon: "success",
        });
        setDatosArticulo(datosEditados);
        setEditando(false);
      } else {
        const errorData = await response.json();
        Swal.fire({
          title: "Error",
          text: errorData.msg || "Error al editar el artículo",
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

  const toggleFavorito = async () => {
    if (!token) {
      Swal.fire({
        title: "Error",
        text: "Debes iniciar sesión para agregar favoritos",
        icon: "error",
      });
      return;
    }

    try {
      if (esFavorito) {
        const response = await fetch(`${backendUrl}/api/eliminar-articulos-favoritos/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          setEsFavorito(false);
          Swal.fire({
            title: "Eliminado",
            text: "Artículo eliminado de favoritos",
            icon: "success",
            timer: 1500,
          });
        }
      } else {
        const response = await fetch(`${backendUrl}/api/agregar-articulos-favoritos`, {
          method: "POST",
          body: JSON.stringify({ articulo_id: parseInt(id) }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          setEsFavorito(true);
          Swal.fire({
            title: "Agregado",
            text: "Artículo agregado a favoritos",
            icon: "success",
            timer: 1500,
          });
        }
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Error de conexión",
        icon: "error",
      });
    }
  };

  const crearTrueke = async () => {
    if (!token) {
      Swal.fire({
        title: "Error",
        text: "Debes iniciar sesión para crear truekes",
        icon: "error",
      });
      return;
    }

    const { value: comentarios } = await Swal.fire({
      title: "Crear Trueke",
      input: "textarea",
      inputLabel: "Comentarios adicionales (opcional)",
      inputPlaceholder: "Escribe un comentario sobre este trueke...",
      showCancelButton: true,
      confirmButtonText: "Crear Trueke",
      cancelButtonText: "Cancelar",
    });

    if (comentarios !== undefined) {
      try {
        const response = await fetch(`${backendUrl}/api/truekes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            articulo_propietario_id: parseInt(id),
            articulo_receptor_id: parseInt(id),
            comentarios: comentarios || "",
          }),
        });

        if (response.ok) {
          const data = await response.json();
          Swal.fire({
            title: "Éxito",
            text: "Trueke creado correctamente",
            icon: "success",
          }).then(() => {
            navigate(`/trueke/${data.id}`);
          });
        } else {
          const errorData = await response.json();
          Swal.fire({
            title: "Error",
            text: errorData.error || "Error al crear el trueke",
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

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          Error: {error}
        </div>
        <Link to="/" className="btn btn-primary">
          Volver al inicio
        </Link>
      </div>
    );
  }

  if (!datosArticulo) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning" role="alert">
          No se encontró el artículo
        </div>
        <Link to="/" className="btn btn-primary">
          Volver al inicio
        </Link>
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
            <img
              src={datosArticulo.img}
              className="card-img-top"
              alt={datosArticulo.titulo}
              style={{ height: "400px", objectFit: "cover" }}
            />
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <h2 className="card-title">{datosArticulo.titulo}</h2>
                {token && (
                  <button
                    className="btn btn-link p-0"
                    onClick={toggleFavorito}
                    style={{ fontSize: "1.5rem" }}
                  >
                    {esFavorito ? (
                      <i className="bi bi-heart-fill text-danger"></i>
                    ) : (
                      <i className="bi bi-heart text-muted"></i>
                    )}
                  </button>
                )}
              </div>
              
              <div className="row mt-3">
                <div className="col-md-6">
                  <p><strong>Categoría:</strong> {datosArticulo.categoria}</p>
                  <p><strong>Estado:</strong> {datosArticulo.estado}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Modelo:</strong> {datosArticulo.modelo}</p>
                  <p><strong>Cantidad:</strong> {datosArticulo.cantidad}</p>
                </div>
              </div>
              
              <div className="mt-3">
                <h5>Características:</h5>
                <p>{datosArticulo.caracteristicas}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Acciones</h5>
              
              {token && (
                <div className="d-grid gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={crearTrueke}
                  >
                    <i className="bi bi-arrow-left-right me-2"></i>
                    Crear Trueke
                  </button>
                  
                  <button
                    className="btn btn-warning"
                    onClick={() => setEditando(true)}
                  >
                    <i className="bi bi-pencil-square me-2"></i>
                    Editar Artículo
                  </button>
                  
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      Swal.fire({
                        title: "¿Estás seguro?",
                        text: "Esta acción no se puede deshacer",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#d33",
                        cancelButtonColor: "#3085d6",
                        confirmButtonText: "Sí, eliminar",
                        cancelButtonText: "Cancelar"
                      }).then((result) => {
                        if (result.isConfirmed) {
                          eliminarArticulo();
                        }
                      });
                    }}
                  >
                    <i className="bi bi-trash me-2"></i>
                    Eliminar Artículo
                  </button>
                </div>
              )}
              
              {!token && (
                <div className="alert alert-info">
                  <p>Inicia sesión para interactuar con este artículo</p>
                  <Link to="/identificate" className="btn btn-primary btn-sm">
                    Iniciar Sesión
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