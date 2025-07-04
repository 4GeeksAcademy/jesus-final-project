import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const PublicarArticulo = () => {
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
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/identificate');
        }
    }, [token, navigate]);

    const manejarMensaje = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${backendUrl}/api/publicar-articulo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
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
                confirmButtonText: "Ver artículo"
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate(`/articulo/${data.articulo.id}`);
                } else {
                    navigate('/');
                }
            });

            setInformacionArticulo({
                titulo: '',
                caracteristicas: '',
                categoria: '',
                img: '',
                modelo: '',
                estado: '',
                cantidad: 1,
            });

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
                                                URL de la imagen *
                                            </label>
                                            <input
                                                type="url"
                                                className="form-control"
                                                id="img"
                                                name="img"
                                                value={informacionArticulo.img}
                                                onChange={manejarCambiar}
                                                required
                                                placeholder="https://ejemplo.com/imagen.jpg"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {informacionArticulo.img && (
                                    <div className="mb-3">
                                        <label className="form-label">Vista previa de la imagen:</label>
                                        <div className="text-center">
                                            <img
                                                src={informacionArticulo.img}
                                                alt="Vista previa"
                                                className="img-fluid rounded"
                                                style={{ maxHeight: "200px", objectFit: "contain" }}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                    <Link to="/" className="btn btn-secondary">
                                        Cancelar
                                    </Link>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading}
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