import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const Favoritos = () => {
    const navigate = useNavigate();
    const [favoritos, setFavoritos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavoritos = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/login");
                    return;
                }

                const response = await fetch(`${backendUrl}api/favoritos`, {  
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    const err = await response.json();
                    throw new Error(err.msg || `Error ${response.status}`);
                }

                const data = await response.json();
                setFavoritos(data);
            } catch (error) {
                console.error("Error:", error);
                Swal.fire({
                    title: "Error",
                    text: error.message || "No se pudieron cargar los favoritos",
                    icon: "error",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchFavoritos();
    }, [navigate]);

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
            className="container mt-5 pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="mb-4">Mis Favoritos</h2>

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
                            className="list-group-item list-group-item-action d-flex align-items-center"
                            whileHover={{ scale: 1.01 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                            <img
                                src={fav.img || "/placeholder-item.png"}
                                alt={fav.titulo}
                                className="me-3 rounded"
                                style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                onError={(e) => (e.target.src = "/placeholder-item.png")}
                            />
                            <div className="flex-grow-1">
                                <h6>{fav.titulo}</h6>
                                <small className="text-muted">
                                    {fav.categoria && fav.categoria.charAt(0).toUpperCase() + fav.categoria.slice(1)}
                                </small>
                            </div>
                            <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleVerArticulo(fav.articulo_id)}
                            >
                                Ver
                            </button>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};