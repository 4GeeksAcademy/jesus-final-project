import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

// Aseguramos que no haya doble barra al final de la URL
const backendUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "");

export const Articulo = () => {
  const [error, setError] = useState(null);
  const [datosArticulo, setDatosArticulo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [esFavorito, setEsFavorito] = useState(false);
  const [editando, setEditando] = useState(false);
  const [loadingFavorito, setLoadingFavorito] = useState(false);
  const [datosEditados, setDatosEditados] = useState({
    titulo: '',
    caracteristicas: '',
    categoria: '',
    modelo: '',
    estado: '',
    cantidad: 1
  });
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const es_mio = datosArticulo.usuario_id == userId;


  // Categorías y estados disponibles
  const categorias = [
    { value: 'electronica', label: 'Electrónica' },
    { value: 'ropa', label: 'Ropa' },
    { value: 'hogar', label: 'Hogar' },
    { value: 'deportes', label: 'Deportes' },
    { value: 'libros', label: 'Libros' },
    { value: 'juguetes', label: 'Juguetes' },
    { value: 'otros', label: 'Otros' }

  ];

  const estados = [
    { value: 'nuevo', label: 'Nuevo' },
    { value: 'como_nuevo', label: 'Como nuevo' },
    { value: 'bueno', label: 'Bueno' },
    { value: 'regular', label: 'Regular' },
    { value: 'malo', label: 'Malo' }
  ];

  // Obtener artículo
  const obtenerArticulo = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${backendUrl}/api/articulo/${id}`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Authorization': `Bearer ${token}`
        }
      });

      // Verificar tipo de contenido
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Respuesta no es JSON: ${text.substring(0, 100)}...`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || `Error ${response.status}`);
      }

      setDatosArticulo(data);
      setDatosEditados({
        titulo: data.titulo,
        caracteristicas: data.caracteristicas,
        categoria: data.categoria,
        modelo: data.modelo,
        estado: data.estado,
        cantidad: data.cantidad,
      });

    } catch (error) {
      console.error("Error al obtener artículo:", error);
      setError(error.message);
      setDatosArticulo(null);

      Swal.fire({
        title: "Error",
        html: `No se pudo cargar el artículo.<br><small>${error.message}</small>`,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };


  // Verificar si es favorito
  const verificarFavorito = async () => {
    if (!token) return;

    setLoadingFavorito(true);

    try {
      const response = await fetch(`${backendUrl}/api/favoritos`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      const favoritos = await response.json();
      setEsFavorito(favoritos.some(fav => fav.articulo_id === parseInt(id)));

    } catch (error) {
      console.error('Error al verificar favorito:', error);
    } finally {
      setLoadingFavorito(false);
    }
  };

  // Toggle favorito
  const toggleFavorito = async () => {
    if (!token) {
      Swal.fire({
        title: "Error",
        text: "Debes iniciar sesión para agregar favoritos",
        icon: "error",
      });
      return;
    }

    setLoadingFavorito(true);

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
    } finally {
      setLoadingFavorito(false);
    }
  };

  // Eliminar artículo
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

  // Editar artículo 
  const handleEditarArticulo = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        titulo: datosEditados.titulo,
        caracteristicas: datosEditados.caracteristicas,
        categoria: datosEditados.categoria,
        img: datosArticulo.img,
        modelo: datosEditados.modelo || '',
        estado: datosEditados.estado || '',
        cantidad: datosEditados.cantidad || 1
      };

      console.log("Enviando datos:", payload);

      const response = await fetch(`${backendUrl}/api/editar-datos-articulo/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Error al editar el artículo');
      }

      const data = await response.json();

      setDatosArticulo(prev => ({
        ...prev,
        ...datosEditados,
        img: payload.img
      }));

      setEditando(false);

      Swal.fire({
        title: '¡Éxito!',
        text: data.msg || 'Artículo editado correctamente',
        icon: 'success',
        timer: 2000
      });

    } catch (error) {
      console.error("Error al editar artículo:", error);
      Swal.fire({
        title: 'Error',
        text: error.message || 'Ocurrió un error al editar el artículo',
        icon: 'error'
      });
    }
  };

  // Crear trueke
  const crearTrueke = async () => {
    if (!token) {
      Swal.fire({
        title: "Error",
        text: "Debes iniciar sesión para crear truekes",
        icon: "error",
      });
      return;
    }

    const fetchPublicaciones = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(`${backendUrl}/api/mis-publicaciones`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.msg || `Error ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          title: "Error",
          text: error.message || "Error al cargar tus publicaciones",
          icon: "error",
        });
      }
    }

    const publicaciones = await fetchPublicaciones();

    const { value: formValues } = await Swal.fire({
      title: "Crear Trueke",
      width: "40%",
      html: `
    <div style="text-align: center;">
      <label for="swal-select" style="display: block; margin-bottom: 5px; font-weight: bold;">
        Selecciona tu artículo para intercambiar:
      </label>
      <select id="swal-select" class="swal2-select" style="width: 70%; margin-bottom: 15px; padding: 8px; border: 1px solid #d1d3e2; border-radius: 4px;">
        <option value="">Selecciona un artículo...</option>
        ${publicaciones.map(publicacion =>
        `<option value="${publicacion.id}">${publicacion.titulo} - ${publicacion.categoria}</option>`
      ).join('')}
      </select>
      
      <label for="swal-textarea" style="display: block; margin-bottom: 5px; font-weight: bold;">
        Comentarios adicionales:
      </label>
      <textarea 
        id="swal-textarea" 
        class="swal2-textarea" 
        placeholder="Escribe un comentario sobre este trueke..."
        style="width: 70%; height: 80px; padding: 8px; border: 1px solid #d1d3e2; border-radius: 4px; resize: vertical;"
      ></textarea>
    </div>
  `,
      showCancelButton: true,
      confirmButtonText: "Crear Trueke",
      cancelButtonText: "Cancelar",
      customClass: {
        confirmButton: 'btn btn-primary',
      },
      focusConfirm: false,
      preConfirm: () => {
        const select = document.getElementById('swal-select');
        const textarea = document.getElementById('swal-textarea');

        if (!select.value) {
          Swal.showValidationMessage('Debes seleccionar un artículo');
          return false;
        }

        return {
          articuloSeleccionado: parseInt(select.value),
          comentarios: textarea.value.trim()
        };
      }
    });
    if (!formValues) {
      return false;
    }
    if (formValues) {
      console.log('Artículo seleccionado ID:', formValues.articuloSeleccionado);
      console.log('Comentarios:', formValues.comentarios);
    }

    try {

      const response = await fetch(`${backendUrl}/api/truekes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          articulo_propietario_id: parseInt(id),
          articulo_receptor_id: formValues.articuloSeleccionado,
          comentario: formValues.comentarios || "",
          usuario_id: userId,
        }),
      });

      if (response.ok) {
        Swal.fire({
          title: "Éxito",
          text: "Trueke creado correctamente",
          icon: "success",
        }).then(() => {
          navigate(`/truekes/historial/${userId}`);
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
        text: `Error de conexión: ${error}`,
        icon: "error",
      });
    }

  };

  useEffect(() => {
    if (id) {
      obtenerArticulo(id);
      verificarFavorito();
    }
  }, [id]);

  const recargarPagina = () => {
    setLoading(true);
    setError(null);
    obtenerArticulo(id);
    verificarFavorito();
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando artículo...</p>
          <button
            className="btn btn-link mt-2"
            onClick={recargarPagina}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error</h4>
          <p>{error}</p>
          <hr />
          <div className="d-flex justify-content-between">
            <Link to="/" className="btn btn-primary">
              Volver al inicio
            </Link>
            <button
              className="btn btn-secondary"
              onClick={recargarPagina}
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!datosArticulo) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning" role="alert">
          <h4 className="alert-heading">Artículo no encontrado</h4>
          <p>El artículo solicitado no existe o no está disponible.</p>
          <hr />
          <Link to="/" className="btn btn-primary">
            Volver al inicio
          </Link>
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
            <div className="position-relative">
              <img
                src={datosArticulo.img || "https://via.placeholder.com/800x400?text=Imagen+no+disponible"}
                className="card-img-top"
                alt={datosArticulo.titulo}
                style={{ height: "400px", width: "100%", objectFit: "scale-down", backgroundColor: "#f8f9fa" }}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/800x400?text=Imagen+no+disponible";
                }}
              />
              {token && (
                <button
                  className="btn btn-link position-absolute top-0 end-0 p-3"
                  onClick={toggleFavorito}
                  disabled={loadingFavorito}
                  style={{ fontSize: "1.8rem", zIndex: 1 }}
                >
                  {loadingFavorito ? (
                    <span className="spinner-border spinner-border-sm text-danger" role="status"></span>
                  ) : esFavorito ? (
                    <i className="bi bi-heart-fill text-danger"></i>
                  ) : (
                    <i className="bi bi-heart text-secondary"></i>
                  )}
                </button>
              )}
            </div>

            <div className="card-body">
              <h2 className="card-title">{datosArticulo.titulo}</h2>

              <div className="row mt-3">
                <div className="col-md-6">
                  <p><strong>Categoría:</strong> {datosArticulo.categoria || 'No especificado'}</p>
                  <p><strong>Estado:</strong> {datosArticulo.estado || 'No especificado'}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Modelo:</strong> {datosArticulo.modelo || 'No especificado'}</p>
                  <p><strong>Cantidad:</strong> {datosArticulo.cantidad || 1}</p>
                </div>
              </div>

              <div className="mt-3">
                <h5>Características:</h5>
                <p className="card-text" style={{ whiteSpace: "pre-line" }}>
                  {datosArticulo.caracteristicas || 'No hay descripción disponible'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card sticky-top" style={{ top: "20px" }}>
            <div className="card-body">
              <h5 className="card-title">Acciones</h5>

              {token ? (
                <div className="d-grid gap-2">
                  {es_mio ? (
                    <>
                      <button className="btn btn-warning" onClick={() => setEditando(true)} disabled={loading}>
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
                            cancelButtonText: "Cancelar",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              eliminarArticulo();
                            }
                          });
                        }}
                        disabled={loading}
                      >
                        <i className="bi bi-trash me-2"></i>
                        Eliminar Artículo
                      </button>
                    </>
                  ) : (
                    <>                    <button className="btn btn-primary" onClick={crearTrueke} disabled={loading}>
                      <i className="bi bi-arrow-left-right me-2"></i>
                      {loading ? "Cargando..." : "Crear Trueke"}
                    </button>
                      <button className="btn btn-success" onClick={() => {
                        navigate(`/usuario/${datosArticulo.usuario_id}`)
                      }} disabled={loading}>

                        {loading ? "Cargando..." : "Datos del dueño"}
                      </button>
                    </>

                  )}
                </div>
              ) : (
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

      {/*  Edición */}
      {editando && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1050 }}>
          <div className="modal-dialog modal-lg" style={{ marginTop: '5%' }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Artículo</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditando(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleEditarArticulo}>
                  <div className="mb-3">
                    <label className="form-label">Título*</label>
                    <input
                      type="text"
                      className="form-control"
                      value={datosEditados.titulo}
                      onChange={(e) => setDatosEditados({ ...datosEditados, titulo: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Características*</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      value={datosEditados.caracteristicas}
                      onChange={(e) => setDatosEditados({ ...datosEditados, caracteristicas: e.target.value })}
                      required
                    ></textarea>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Categoría*</label>
                      <select
                        className="form-select"
                        value={datosEditados.categoria}
                        onChange={(e) => setDatosEditados({ ...datosEditados, categoria: e.target.value })}
                        required
                      >
                        <option value="">Seleccionar...</option>
                        {categorias.map(cat => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Estado*</label>
                      <select
                        className="form-select"
                        value={datosEditados.estado}
                        onChange={(e) => setDatosEditados({ ...datosEditados, estado: e.target.value })}
                        required
                      >
                        <option value="">Seleccionar...</option>
                        {estados.map(estado => (
                          <option key={estado.value} value={estado.value}>
                            {estado.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Modelo</label>
                      <input
                        type="text"
                        className="form-control"
                        value={datosEditados.modelo}
                        onChange={(e) => setDatosEditados({ ...datosEditados, modelo: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Cantidad</label>
                      <input
                        type="number"
                        className="form-control"
                        value={datosEditados.cantidad}
                        onChange={(e) => setDatosEditados({ ...datosEditados, cantidad: parseInt(e.target.value) || 1 })}
                        min="1"
                      />
                    </div>
                  </div>

                  <div className="alert alert-info mt-3">
                    <small>Los campos marcados con * son obligatorios</small>
                  </div>

                  <div className="modal-footer">
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
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4">
        <Link to="/" className="btn btn-secondary">
          <i className="bi bi-arrow-left me-2"></i>
          Volver al inicio
        </Link>
      </div>
    </motion.div>
  );
};
