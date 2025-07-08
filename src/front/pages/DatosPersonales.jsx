import { img, p } from "framer-motion/client";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const DatosPersonales = () => {
  const { dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const { usuarioId } = useParams();
  const [userRating, setUserRating] = useState(null);
  const [favoritos, setFavoritos] = useState(null)

  const [userData, setUserData] = useState({
    email: "",
    nombre_completo: "",
    telefono: "",
    direccion: "",
    pais: "España",
    region: "",
    codigo_postal: "",
    imagen: "",
    fecha_registro: "",
  });

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);
  const fileInputRef = useRef(null);

  const fetchUserRating = async () => {
    try {
      const response = await fetch(`${backendUrl}api/rating/${usuarioId}`);

      if (response.ok) {
        const data = await response.json();
        setUserRating(data);
      } else {
        console.error(`Error: ${response.status} - ${response.statusText}`);
        setUserRating(null);
      }
    } catch (error) {
      console.error('Error fetching user rating:', error);
      setUserRating(null);
    }
  };

  const fetchFavoritos = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      Swal.fire({
        title: "Token vencido",
        text: "Redireccionado al Log in",
        icon: "error",
      }).then(() => {
        dispatch({ type: "logout" });
      });
      return;
    }

    try {
      const response = await fetch(`${backendUrl}api/favoritos`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setFavoritos(data);
      } else {
        Swal.fire({
          title: "Error al cargar los favoritos",
          text: data.msg || "Ocurrió un error.",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error de red",
        text: error.message,
        icon: "error",
      });
    }
  };


  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(`${backendUrl}api/datos-personales`, {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();

          setUserData({
            ...data,
            imagen: data.img || ""
          });

          if (data.id) {
            fetchUserRating(data.id);
          }
        } else {
          throw new Error(await response.text());
        }
      } catch (error) {
        console.error("Error fetch userData:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    fetchUserRating();
    fetchFavoritos();
  }, []);

  // Cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  // Subir imagen a Cloudinary con fetch
  const uploadImage = async (file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      formData.append('cloud_name', cloudName);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUserData(prev => ({ ...prev, imagen: data.secure_url }));
      } else {
        throw new Error('Error al subir la imagen');
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      await Swal.fire({
        title: "Error al subir la imagen",
        icon: "error",
        confirmButtonText: "Ok",
      });
    } finally {
      setUploading(false);
    }
  };

  // Cambio de imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) uploadImage(file);
  };

  // Guardar cambios en el perfil
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar campos requeridos
    if (!userData.nombre_completo || !userData.telefono || !userData.direccion) {
      await Swal.fire({
        title: `Por favor complete todos los campos obligatorios (Nombre, Teléfono y Dirección`,
        icon: "error",
        confirmButtonText: "Ok",
      });

      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`${backendUrl}api/datos-personales`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre_completo: userData.nombre_completo,
          telefono: userData.telefono,
          direccion: userData.direccion,
          pais: userData.pais,
          region: userData.region,
          codigo_postal: userData.codigo_postal,
          img: userData.imagen
        })
      });

      if (response.ok) {
        const data = await response.json();
        await Swal.fire({
          title: `Perfil actualizado correctamente`,
          icon: "success",
          confirmButtonText: "Ok",
        });
        setEditing(false);


        const fetchResponse = await fetch(`${backendUrl}api/datos-personales`, {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (fetchResponse.ok) {
          const updatedData = await fetchResponse.json();
          setUserData({
            ...updatedData,
            imagen: updatedData.img || ""
          });
        }
      } else {
        throw new Error(await response.text());
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      const errorMsg = error.message.includes("necesitas enviar") ?
        "Faltan campos obligatorios: " + error.message :
        "Error al actualizar el perfil";
      alert(errorMsg);
    }
  };

  if (loading) return <div className="text-center mt-5">Cargando datos...</div>;



  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: "¿Estás seguro que querés eliminar tu cuenta?",
      text: "¡No podrás revertir este cambio!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí"
    });

    if (result.isConfirmed) {
      await borrarCuentaAPI();
    }
  };

  const borrarCuentaAPI = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${backendUrl}api/borrar-cuenta`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      const data = await response.json();

      if (response.status === 409 && data.error_type === "trueke_en_proceso") {
              const esPropietario = data.es_ofertante;
              const truekeEstado = data.trueke_estado
                .replace(/_/g, " ");
      
              return Swal.fire({
                title: "Trueke en proceso",
                html: `
                <p>${data.msg}</p>
                <p><strong>Estado:</strong> ${truekeEstado}</p>
                <p><strong>Rol:</strong> ${esPropietario ? "Propietario" : "Receptor"
                  }</p>
              `,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Ir al trueke",
                denyButtonText: "Cancelar trueke",
                cancelButtonText: "Cerrar",
              }).then((result) => {
                if (result.isConfirmed) {
      
                  navigate(`/trueke-detalle/${data.trueke_id}`);
                } else if (result.isDenied) {
      
      
                  Swal.fire("Trueke cancelado", "Has cancelado el trueke.", "success");
                }
              });
            }

      if (response.ok) {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('userId');


        await Swal.fire({
          title: "Cuenta eliminada",
          text: "Tu cuenta ha sido eliminada exitosamente.",
          icon: "success",
        });
        dispatch({ type: "logout" });
        navigate("/");

      } else {
        Swal.fire({
          title: "Error al eliminar la cuenta",
          text: data.msg || "Ocurrió un error.",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error de red",
        text: error.message,
        icon: "error",
      });
    }
  };


  const renderStars = (rating) => {
    const starsCount = Math.min(5, Math.round(rating));
    return '⭐'.repeat(starsCount);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };



  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="container mt-4">
        <form onSubmit={handleSubmit}>
          <div className="row">

            {/* Columna de datos */}
            <div className="col-md-8">
              <div className="d-flex justify-content-between mb-4">
                <h2>Mi Perfil</h2>
                {!editing ? (
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => setEditing(true)}
                  >
                    Editar Información
                  </button>
                ) : (
                  <div>
                    <button
                      type="button"
                      className="btn btn-outline-secondary me-2"
                      onClick={() => setEditing(false)}
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary" >
                      Guardar Cambios
                    </button>
                  </div>
                )}
              </div>

              {/* Campos inmutables */}
              <div className="mb-3">
                <label className="form-label">E-mail</label>
                <input
                  type="email"
                  className="form-control bg-light"
                  value={userData.email}
                  readOnly
                  disabled
                />
                <small className="text-muted">El email no se puede modificar después del registro</small>
              </div>

              <div className="mb-3">
                <label className="form-label">Nombre Completo</label>
                <input
                  type="text"
                  className="form-control"
                  name="nombre_completo"
                  value={userData.nombre_completo}
                  onChange={handleInputChange}
                  disabled={!editing}
                />
                <small className="text-muted">Nombre completo del usuario</small>
              </div>

              <div className="mb-3">
                <label className="form-label">Fecha de Registro</label>
                <input
                  type="text"
                  className="form-control bg-light"
                  value={userData.fecha_registro ? new Date(userData.fecha_registro).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : ''}
                  readOnly
                  disabled
                />
              </div>

              {/* Campos editables */}
              <div className="mb-3">
                <label htmlFor="telefono" className="form-label">Teléfono</label>
                <input
                  type="tel"
                  className="form-control"
                  id="telefono"
                  name="telefono"
                  value={userData.telefono}
                  onChange={handleInputChange}
                  disabled={!editing}
                  required
                />
              </div>

              <div className="mb-3">
                <h5>Dirección</h5>
                <label htmlFor="direccion" className="form-label">Dirección</label>
                <input
                  type="text"
                  className="form-control"
                  id="direccion"
                  name="direccion"
                  value={userData.direccion}
                  onChange={handleInputChange}
                  disabled={!editing}
                  required
                />

                <label htmlFor="pais" className="form-label">País</label>
                <input
                  type="text"
                  className="form-control"
                  id="pais"
                  name="pais"
                  value={"España"}
                  readOnly
                  disabled
                />

                <label htmlFor="region" className="form-label">Región</label>
                <input
                  type="text"
                  className="form-control"
                  id="region"
                  name="region"
                  value={userData.region}
                  onChange={handleInputChange}
                  disabled={!editing}
                />

                <label htmlFor="codigo_postal" className="form-label">Código Postal</label>
                <input
                  type="text"
                  className="form-control"
                  id="codigo_postal"
                  name="codigo_postal"
                  value={userData.codigo_postal}
                  onChange={handleInputChange}
                  disabled={!editing}
                />
              </div>

            </div>

            {/* Columna de imagen */}
            <div className="col-md-4">
              <div className="card">
                <div className="card-body text-center">
                  <h5 className="card-title">Foto de Perfil</h5>

                  <div className="mb-3">
                    <img
                      src={userData.imagen || "https://via.placeholder.com/200"}
                      className="img-thumbnail"
                      alt="Perfil"
                      style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                    />
                  </div>

                  <button
                    type="button"
                    className={`btn ${userData.imagen ? 'btn-outline-primary' : 'btn-primary'}`}
                    onClick={() => fileInputRef.current.click()}
                    disabled={uploading || !editing}
                  >
                    {uploading ? 'Subiendo...' : (userData.imagen ? 'Cambiar Imagen' : 'Subir Imagen')}
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="d-none"
                    disabled={!editing}
                  />

                  <p className="text-muted small mt-2">
                    Formatos: JPG, PNG, WEBP<br />
                    Máx. 5MB
                  </p>
                </div>
              </div>


              <div id="favoritosCarousel" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                  {!favoritos || favoritos.length === 0 ? (
                    <div className="text-center mt-3">
                      <p>Aún no tienes ningún favorito asignado</p>
                    </div>
                  ) : (
                    favoritos.map((fav, index) => (
                      <div
                        key={fav.articulo_id}
                        className={`carousel-item ${index === 0 ? "active" : ""}`}
                      >
                        <div className="card d-flex flex-column align-items-center shadow-sm mt-4 bg-white rounded">
                          <div className="d-flex justify-content-center mt-4">
                            <h5>Artículos Favoritos</h5>
                          </div>
                          <img
                            src={fav.img ?? ""}
                            alt={fav.titulo ?? "Imagen favorita"}
                            className="card-img-top rounded mt-3 imagen-datos-personales-fav"
                            style={{
                              width: "auto",
                              height: "100px",
                              objectFit: "cover",
                              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              if (fav.articulo_id) {
                                navigate(`/articulo/${fav.articulo_id}`);
                              }
                            }}
                          />
                          <div className="card-body text-center">
                            <h6
                              className="card-title fw-semibold text-truncate"
                              title={fav.titulo ?? ""}
                              style={{ maxWidth: "160px" }}
                            >
                              {fav.titulo ?? "Sin título"}
                            </h6>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {favoritos && favoritos.length > 0 && (
                  <>
                    <button
                      className="carousel-control-prev"
                      type="button"
                      data-bs-target="#favoritosCarousel"
                      data-bs-slide="prev"
                      style={{ filter: "invert(1)" }}
                    >
                      <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                      <span className="visually-hidden">Anterior</span>
                    </button>
                    <button
                      className="carousel-control-next"
                      type="button"
                      data-bs-target="#favoritosCarousel"
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
                className="card2 mt-5"
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
                        ? 'Aún no te han puntuado'
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
                          <p> {userRating.promedio_rating <= 2 ? `Mejorá tus valoraciones para atraer más truekes 💪 ` : `Sigue así , mantene tus valoraciones altas 🚀`} </p>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </motion.div>

            </div>

          </div>
        </form>
        <div className="my-4 row">
          <div className="col-md-8">
            <h5>
              Zona de peligro
            </h5>
            <div className="p-2" style={{ border: "2px solid rgb(194, 34, 34)", borderRadius: "6px" }}>
              <div className="d-flex">
                <p className="px-2" style={{ color: "rgb(194, 34, 34)" }}>Eliminar cuenta</p>
                <button onClick={handleDeleteAccount} className="btn btn-outline-danger ms-auto">Eliminar cuenta</button>
              </div>
              <p
                className="px-2 mt-0 mb-0"
                style={{ color: "rgb(194, 34, 34)", fontSize: "14px" }}
              >
                Una vez que elimines tu cuenta se borrarán todos tus datos
              </p>
            </div>
          </div>
        </div>
      </div>
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
