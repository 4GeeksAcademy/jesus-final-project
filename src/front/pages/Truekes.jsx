import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const Truekes = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    const [truekes, setTruekes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTruekes = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/login");
                    return;
                }

                if (!userId) {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "No se encontró el usuario logueado",
                    });
                    navigate("/");
                    return;
                }

                const response = await fetch(`${backendUrl}api/truekes/${userId}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || errorData.msg || `Error ${response.status}`);
                }

                const data = await response.json();
                setTruekes(data.historial || []);
            } catch (error) {
                console.error("Error:", error);
                Swal.fire({
                    title: "Error",
                    text: error.message || "Error al cargar tus truekes",
                    icon: "error",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchTruekes();
    }, [navigate, userId]);

    const handleVerTrueke = (id) => {
        navigate(`/trueke-detalle/${id}`);
    };

    const handleCancelarTrueke = async (id, e) => {
        e.stopPropagation();

        const confirmacion = await Swal.fire({
            title: "¿Cancelar trueke?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, cancelar",
            cancelButtonText: "No",
        });

        if (!confirmacion.isConfirmed) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${backendUrl}api/truekes/${id}`, {
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

            setTruekes(truekes.filter((t) => t.id !== id));

            Swal.fire("Cancelado", "El trueke ha sido cancelado.", "success");
        } catch (error) {
            console.error("Error:", error);
            Swal.fire({
                title: "Error",
                text: error.message || "Error al cancelar el trueke",
                icon: "error",
            });
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

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="container mt-5 pt-4"
        >
            <h2 className="mb-4">Mis Truekes </h2>

            {truekes.length === 0 ? (
                <div className="text-center py-5">
                    <h4>No tienes truekes aún</h4>
                    <p>Comienza intercambiando tus artículos</p>
                    <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>
                        Ver artículos
                    </button>
                </div>
            ) : (
                <div className="list-group">
                    {truekes.map((trueke) => (
                        <motion.div
                            key={trueke.id}
                            className="list-group-item list-group-item-action"
                            onClick={() => handleVerTrueke(trueke.id)}
                            whileHover={{ scale: 1.01 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <img
                                        src={trueke.mi_articulo?.img || "https://via.placeholder.com/100"}
                                        alt={trueke.mi_articulo?.titulo}
                                        className="me-3 rounded"
                                        style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                    />
                                    <div>
                                        <h6>{trueke.mi_articulo?.titulo}</h6>
                                        <small className="text-muted">{trueke.mi_articulo?.categoria || "Categoría no disponible"}</small>
                                    </div>
                                </div>

                                <div className="d-flex gap-2">
                                    <button className="btn btn-sm btn-outline-primary" onClick={() => handleVerTrueke(trueke.id)}>
                                        Detalles
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={(e) => handleCancelarTrueke(trueke.id, e)}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};
