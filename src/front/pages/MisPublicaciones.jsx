import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const MisPublicaciones = () => {
  const navigate = useNavigate();
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [articuloAEditar, setArticuloAEditar] = useState(null);
  const [datosEditados, setDatosEditados] = useState({
    titulo: "",
    caracteristicas: "",
    categoria: "",
    img: "",
    modelo: "",
    estado: "",
    cantidad: 1,
  });

  // Categorías y estados disponibles
  const categorias = [
    { value: "electronica", label: "Electrónica" },
    { value: "ropa", label: "Ropa" },
    { value: "hogar", label: "Hogar" },
    { value: "deportes", label: "Deportes" },
    { value: "libros", label: "Libros" },
    { value: "juguetes", label: "Juguetes" },
  ];

  const estados = [
    { value: "nuevo", label: "Nuevo" },
    { value: "como_nuevo", label: "Como nuevo" },
    { value: "bueno", label: "Bueno" },
    { value: "regular", label: "Regular" },
  ];

  // Obtener publicaciones del usuario
  useEffect(() => {
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

  // Manejar edición
  const handleEditarPublicacion = (publicacion, e) => {
    e.stopPropagation();
    setArticuloAEditar(publicacion);
    setDatosEditados({
      titulo: publicacion.titulo,
      caracteristicas: publicacion.caracteristicas,
      categoria: publicacion.categoria,
      img: publicacion.img || "",
      modelo: publicacion.modelo || "",
      estado: publicacion.estado || "",
      cantidad: publicacion.cantidad || 1,
    });
  };

  // Guardar cambios
  const handleGuardarEdicion = async () => {
    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...datosEditados,
        img: datosEditados.img || articuloAEditar.img
      };
      const response = await fetch(
        `${backendUrl}/api/editar-datos-articulo/${articuloAEditar.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(datosEditados),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Error al editar el artículo");
      }

      // Actualizar lista localmente
      setPublicaciones(
        publicaciones.map((pub) =>
          pub.id === articuloAEditar.id ? { ...pub, ...datosEditados } : pub
        )
      );

      setArticuloAEditar(null);
      Swal.fire("¡Éxito!", "Artículo actualizado correctamente", "success");
    } catch (error) {
      Swal.fire("Error", error.message || "Error al guardar cambios", "error");
    }
  };

  // Eliminar publicación
  const handleEliminarPublicacion = async (id, e) => {
    e.stopPropagation();

    const confirmacion = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirmacion.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendUrl}/api/eliminar-articulo/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json(); 

      if (response.status === 409 && data.error_type === "trueke_en_proceso") {
        const esPropietario = data. es_propietario;
        const truekeEstado = data.trueke_estado.replace('_',' '); 

        return Swal.fire({
          title: "Trueke en proceso",
          html: `
          <p>${data.msg}</p>
          <p><strong>Estado:</strong> ${truekeEstado}</p>
          <p><strong>Rol:</strong> ${esPropietario ? 'Propietario' : 'Receptor'}</p>`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: 'Ir al trueke',
          denyButtonText: 'Cancelar trueke',
          cancelButtonText: 'Cerrar'
        }).then((result) => {
          if (result.isConfirmed) {
            navigate(`truekes/historial`);
          } 
        });
       
      }

      if (!response.ok) {
        throw new Error(data.msg || `Error ${response.status}`);
      }

      setPublicaciones(publicaciones.filter((pub) => pub.id !== id));
      Swal.fire("¡Eliminado!", "Tu publicación ha sido eliminada.", "success");
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
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
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

      {publicaciones.length === 0 ? (
        <div className="text-center py-5">
          <h2 className="pb-4">Mis Publicaciones</h2>
          <h4>No tienes publicaciones aún</h4>
          <p>Comienza creando tu primera publicación</p>
          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate("/publicar-articulo")}
          >
            Crear Publicación
          </button>
        </div>
      ) : (
        <div className="list-group">
          <h2 className="pb-4">Mis Publicaciones</h2>
          {publicaciones.map((publicacion) => (
            <motion.div
              key={publicacion.id}
              className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
              style={{ cursor: "pointer" }}
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="d-flex align-items-center flex-grow-1">
                <img
                  src={publicacion.img || "/placeholder-item.png"}
                  alt={publicacion.titulo}
                  className="me-3 rounded"
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src = "/placeholder-item.png";
                  }}
                />
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start">
                    <h5 className="mb-1">{publicacion.titulo}</h5>
                    <span
                      className={`badge rounded-pill ${publicacion.estado === "nuevo"
                        ? "bg-success"
                        : publicacion.estado === "como_nuevo"
                          ? "bg-primary"
                          : publicacion.estado === "bueno"
                            ? "bg-info"
                            : "bg-warning"
                        }`}
                    >
                      {publicacion.estado?.replace("_", " ")}
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
                      <strong>Modelo:</strong>{" "}
                      {publicacion.modelo || "No especificado"}
                    </small>
                  </div>
                </div>
              </div>
              <div className="d-flex flex-column align-items-end ms-3">
                <div className="d-flex gap-2 mb-2">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={(e) => handleEditarPublicacion(publicacion, e)}
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
                  {publicacion.fecha_publicacion
                    ? new Date(publicacion.fecha_publicacion).toLocaleDateString()
                    : "Sin fecha"}
                </small>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal de Edición */}
      {articuloAEditar && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1050,
          }}
        >
          <div className="modal-dialog modal-lg" style={{ marginTop: "5%" }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Artículo</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setArticuloAEditar(null)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={(e) => { e.preventDefault(); handleGuardarEdicion(); }}>
                  <div className="mb-3">
                    <label className="form-label">Título*</label>
                    <input
                      type="text"
                      className="form-control"
                      value={datosEditados.titulo}
                      onChange={(e) =>
                        setDatosEditados({ ...datosEditados, titulo: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Características*</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      value={datosEditados.caracteristicas}
                      onChange={(e) =>
                        setDatosEditados({
                          ...datosEditados,
                          caracteristicas: e.target.value,
                        })
                      }
                      required
                    ></textarea>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Categoría*</label>
                      <select
                        className="form-select"
                        value={datosEditados.categoria}
                        onChange={(e) =>
                          setDatosEditados({ ...datosEditados, categoria: e.target.value })
                        }
                        required
                      >
                        <option value="">Seleccionar...</option>
                        {categorias.map((cat) => (
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
                        onChange={(e) =>
                          setDatosEditados({ ...datosEditados, estado: e.target.value })
                        }
                        required
                      >
                        <option value="">Seleccionar...</option>
                        {estados.map((estado) => (
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
                        onChange={(e) =>
                          setDatosEditados({ ...datosEditados, modelo: e.target.value })
                        }
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Cantidad</label>
                      <input
                        type="number"
                        className="form-control"
                        value={datosEditados.cantidad}
                        onChange={(e) =>
                          setDatosEditados({
                            ...datosEditados,
                            cantidad: parseInt(e.target.value) || 1,
                          })
                        }
                        min="1"
                      />
                    </div>
                  </div>

                  <div className="alert alert-info mt-3">
                    <small>Los campos marcados con * son obligatorios </small>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setArticuloAEditar(null)}
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
    </motion.div>
  );
};