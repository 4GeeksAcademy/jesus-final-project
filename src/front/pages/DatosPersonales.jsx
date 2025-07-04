import { img } from "framer-motion/client";
import { useState, useEffect, useRef } from "react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const DatosPersonales = () => {
  const [userData, setUserData] = useState({
    email: "",
    nombre_completo: "",
    telefono: "",
    direccion: "",
    pais: "",
    region: "",
    codigo_postal: "",
    imagen: "",
    fecha_registro: "",
  });

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);
  const fileInputRef = useRef(null);

  // Obtener datos del usuario
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
      alert("Error al subir la imagen");
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
      alert("Por favor complete todos los campos obligatorios (Nombre, Teléfono y Dirección)");
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
        alert("Perfil actualizado correctamente");
        setEditing(false);
        
        // Volver a cargar los datos para asegurar consistencia
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

  return (
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
                  <button type="submit" className="btn btn-primary">
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
                value={userData.pais}
                onChange={handleInputChange}
                disabled={!editing}
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
          </div>
        </div>
      </form>
    </div>
  );
};