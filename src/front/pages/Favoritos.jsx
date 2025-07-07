import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const Favoritos = () => {
    const navigate = useNavigate();
    const [favoritos, setFavoritos] = useState([]);
    const [loading, setLoading] = useState(true);

    // Obtener favoritos del usuario
    useEffect(() => {
        const fetchFavoritos = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/login");
                    return;
                }

                const response = await fetch(`${backendUrl}api/favoritos`, {
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
                setFavoritos(data);
            } catch (error) {
                console.error("Error:", error);
                Swal.fire({
                    title: "Error",
                    text: error.message || "Error al cargar tus favoritos",
                    icon: "error",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchFavoritos();
    }, [navigate]);

    // Eliminar de favoritos
    const handleEliminarFavorito = async (articuloId, e) => {
        e.stopPropagation();

        const confirmacion = await Swal.fire({
            title: "¿Estás seguro?",
            text: "¿Quieres eliminar este artículo de tus favoritos?",
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
            const response = await fetch(`${backendUrl}api/eliminar-articulos-favoritos/${articuloId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || `Error ${response.status}`);
            }

            // Actualizar el estado local eliminando el artículo
            setFavoritos(favoritos.filter(fav => fav.articulo_id !== articuloId));

            Swal.fire("¡Eliminado!", "Artículo eliminado de favoritos", "success");
        } catch (error) {
            console.error("Error:", error);
            Swal.fire({
                title: "Error",
                text: error.message || "Error al eliminar el favorito",
                icon: "error",
            });
        }
    };

    const handleVerArticulo = (id) => {
        navigate(`/articulo/${id}`);
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
                <h2>Mis Favoritos</h2>
            </div>

            {favoritos.length === 0 ? (
                <div className="text-center py-5">
                    <h4>No tienes artículos en favoritos</h4>
                    <p>Explora artículos y agrega los que te interesen</p>
                    <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>
                        Ver artículos disponibles
                    </button>
                </div>
            ) : (
                <div className="list-group">
                    {favoritos.map((fav) => (
                        <motion.div
                            key={fav.articulo_id}
                            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                            style={{ cursor: "pointer" }}
                            whileHover={{ scale: 1.01 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            onClick={() => handleVerArticulo(fav.articulo_id)}
                        >
                            <div className="d-flex align-items-center flex-grow-1">
                                <img
                                    src={fav.img || "/placeholder-item.png"}
                                    alt={fav.titulo}
                                    className="me-3 rounded"
                                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                    onError={(e) => {
                                        e.target.src = "/placeholder-item.png";
                                    }}
                                />
                                <div className="flex-grow-1">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <h5 className="mb-1">{fav.titulo}</h5>
                                        <span
                                            className={`badge rounded-pill ${fav.estado === "nuevo"
                                                    ? "bg-success"
                                                    : fav.estado === "como_nuevo"
                                                        ? "bg-primary"
                                                        : fav.estado === "bueno"
                                                            ? "bg-info"
                                                            : "bg-warning"
                                                }`}
                                        >
                                            {fav.estado?.replace("_", " ")}
                                        </span>
                                    </div>
                                    <p className="mb-1 text-muted">
                                        {fav.caracteristicas?.substring(0, 100)}...
                                    </p>
                                    <div className="d-flex gap-2 flex-wrap">
                                        <small className="text-muted">
                                            <strong>Categoría:</strong>{" "}
                                            {fav.categoria?.charAt(0).toUpperCase() + fav.categoria?.slice(1)}
                                        </small>
                                        <small className="text-muted">
                                            <strong>Modelo:</strong>{" "}
                                            {fav.modelo || "No especificado"}
                                        </small>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex flex-column align-items-end ms-3">
                                <div className="d-flex gap-2 mb-2">
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={(e) => handleEliminarFavorito(fav.articulo_id, e)}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                                <small className="text-muted">
                                    {fav.fecha_publicacion
                                        ? new Date(fav.fecha_publicacion).toLocaleDateString()
                                        : "Sin fecha"}
                                </small>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};