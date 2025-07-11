import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { useAuth } from "../components/AuthWrapper";

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const PublicarArticulo = () => {
    const { authenticatedRequest } = useAuth();
    const [informacionArticulo, setInformacionArticulo] = useState({
        titulo: '',
        caracteristicas: '',
        categoria: '',
        img: '',
        modelo: '',
        estado: '',
        cantidad: 1,
    });
    const [error, setError] = useState(null);
    const [publicado, setPublicado] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/identificate');
        }
    }, [token, navigate]);

    // Función para subir imagen a Cloudinary
    const uploadImage = async (file) => {
        setUploadingImage(true);
        setError(null);

        try {
            // Mostrar vista previa antes de subir
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);

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

            if (!response.ok) {
                throw new Error('Error al subir la imagen a Cloudinary');
            }

            const data = await response.json();
            setInformacionArticulo(prev => ({
                ...prev,
                img: data.secure_url
            }));

            Swal.fire({
                title: "¡Imagen subida!",
                text: "La imagen se ha cargado correctamente",
                icon: "success",
                timer: 2000,
                showConfirmButton: false
            });

        } catch (error) {
            console.error("Error uploading image:", error);
            setImagePreview(null);
            setError("Error al subir la imagen. Por favor, inténtalo de nuevo.");

            Swal.fire({
                title: "Error",
                text: "No se pudo subir la imagen. Verifica que sea válida e inténtalo nuevamente.",
                icon: "error",
            });
        } finally {
            setUploadingImage(false);
        }
    };

    // Manejar cambio de imagen seleccionada
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validaciones
        if (file.size > 5 * 1024 * 1024) {
            Swal.fire({
                title: "Archivo demasiado grande",
                text: "El tamaño máximo permitido es 5MB",
                icon: "error",
            });
            return;
        }

        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            Swal.fire({
                title: "Formato no soportado",
                text: "Solo se aceptan JPG, PNG o WEBP",
                icon: "error",
            });
            return;
        }

        uploadImage(file);
    };

    const manejarMensaje = async (e) => {
        e.preventDefault();

        // Validar campos requeridos
        if (!informacionArticulo.titulo ||
            !informacionArticulo.caracteristicas ||
            !informacionArticulo.categoria ||
            !informacionArticulo.modelo ||
            !informacionArticulo.estado ||
            !informacionArticulo.img) {
            Swal.fire({
                title: "Campos incompletos",
                text: "Por favor completa todos los campos obligatorios",
                icon: "error",
            });
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await authenticatedRequest(`//api/publicar-articulo`, {
                method: 'POST',
                body: JSON.stringify(informacionArticulo)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || 'Error al publicar el artículo');
            }

            setPublicado(true);
            setError(null);

            Swal.fire({
                title: "¡Éxito!",
                text: "Artículo publicado correctamente",
                icon: "success",
                showConfirmButton: true,
                confirmButtonText: "Ver artículo",
                showCancelButton: true,
                cancelButtonText: "Volver al inicio"
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate(`/articulo/${data.articulo.id}`);
                } else {
                    navigate('/');
                }
            });

            // Resetear formulario
            setInformacionArticulo({
                titulo: '',
                caracteristicas: '',
                categoria: '',
                img: '',
                modelo: '',
                estado: '',
                cantidad: 1,
            });
            setImagePreview(null);

        } catch (err) {
            setError(err.message);
            setPublicado(false);

            Swal.fire({
                title: "Error",
                text: err.message,
                icon: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    const manejarCambiar = (e) => {
        const { name, value } = e.target;
        setInformacionArticulo(prev => ({
            ...prev,
            [name]: name === 'cantidad' ? parseInt(value) || 1 : value
        }));
    };

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

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mt-4"
        >
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="mb-0">Publicar Nuevo Artículo</h4>
                        </div>

                        <div className="card-body">
                            <form onSubmit={manejarMensaje}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="titulo" className="form-label">
                                                Título *
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="titulo"
                                                name="titulo"
                                                value={informacionArticulo.titulo}
                                                onChange={manejarCambiar}
                                                required
                                                maxLength="25"
                                                placeholder="Ej: iPhone 12 Pro"
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="categoria" className="form-label">
                                                Categoría *
                                            </label>
                                            <select
                                                className="form-select"
                                                id="categoria"
                                                name="categoria"
                                                value={informacionArticulo.categoria}
                                                onChange={manejarCambiar}
                                                required
                                            >
                                                <option value="">Selecciona una categoría</option>
                                                {categorias.map(cat => (
                                                    <option key={cat.value} value={cat.value}>
                                                        {cat.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="caracteristicas" className="form-label">
                                        Características *
                                    </label>
                                    <textarea
                                        className="form-control"
                                        id="caracteristicas"
                                        name="caracteristicas"
                                        value={informacionArticulo.caracteristicas}
                                        onChange={manejarCambiar}
                                        required
                                        rows="4"
                                        placeholder="Describe las características principales del artículo..."
                                    />
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="modelo" className="form-label">
                                                Modelo *
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="modelo"
                                                name="modelo"
                                                value={informacionArticulo.modelo}
                                                onChange={manejarCambiar}
                                                required
                                                maxLength="50"
                                                placeholder="Ej: Pro Max 256GB"
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="estado" className="form-label">
                                                Estado *
                                            </label>
                                            <select
                                                className="form-select"
                                                id="estado"
                                                name="estado"
                                                value={informacionArticulo.estado}
                                                onChange={manejarCambiar}
                                                required
                                            >
                                                <option value="">Selecciona el estado</option>
                                                {estados.map(estado => (
                                                    <option key={estado.value} value={estado.value}>
                                                        {estado.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="cantidad" className="form-label">
                                                Cantidad *
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="cantidad"
                                                name="cantidad"
                                                value={informacionArticulo.cantidad}
                                                onChange={manejarCambiar}
                                                required
                                                min="1"
                                                max="100"
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="img" className="form-label">
                                                Imagen del artículo *
                                            </label>
                                            <div className="d-flex flex-column gap-2">
                                                <button
                                                    className={`btn ${informacionArticulo.img ? 'btn-outline-primary' : 'btn-primary'} ${uploadingImage ? 'disabled' : ''}`}
                                                    type="button"
                                                    onClick={() => fileInputRef.current.click()}
                                                    disabled={uploadingImage}
                                                >
                                                    {uploadingImage ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                            Subiendo...
                                                        </>
                                                    ) : (
                                                        informacionArticulo.img ? 'Cambiar Imagen' : 'Subir Imagen'
                                                    )}
                                                </button>
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={handleImageChange}
                                                    accept="image/*"
                                                    className="d-none"
                                                    disabled={uploadingImage}
                                                />
                                                <small className="text-muted">Formatos: JPG, PNG, WEBP - Máx. 5MB</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {(imagePreview || informacionArticulo.img) && (
                                    <div className="mb-3">
                                        <label className="form-label">Vista previa:</label>
                                        <div className="text-center">
                                            <img
                                                src={imagePreview || informacionArticulo.img}
                                                alt="Vista previa"
                                                className="img-fluid rounded"
                                                style={{
                                                    maxHeight: "200px",
                                                    objectFit: "contain",
                                                    border: "1px solid #dee2e6"
                                                }}
                                                onError={(e) => {
                                                    e.target.src = "https://via.placeholder.com/200?text=Imagen+no+disponible";
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                                    <Link to="/" className="btn btn-secondary">
                                        Cancelar
                                    </Link>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading || uploadingImage}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Publicando...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-upload me-2"></i>
                                                Publicar Artículo
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};