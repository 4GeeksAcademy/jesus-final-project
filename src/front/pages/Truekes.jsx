import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const Truekes = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    const [truekes, setTruekes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTruekes = async () => {
            if (!token || !userId) {
                console.warn("No hay token o userId en localStorage");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    `${backendUrl}/api/truekes/historial/${userId}`,
                    {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                const data = await response.json();
                if (response.ok) {
                    setTruekes(data.historial || []);

                } else {
                    setError(data.msg || "Error al obtener truekes");
                    console.error("Error al obtener truekes:", data);
                }
            } catch (error) {
                console.error("Error de red al obtener truekes:", error);
                setError("Error de red al cargar truekes");
            } finally {
                setLoading(false);
            }
        };

        fetchTruekes();
    }, [token, userId]);

    const handleVerTrueke = (id) => {
        navigate(`/trueke-detalle/${id}`);
    };

    const handleAceptarTrueke = (id) => {
        Swal.fire({
            title: '¿Quieres aceptar este trueke?',
            text: "Si lo aceptas, se notificará por email al usuario para que puedan ponerse de acuerdo.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                await aceptarTrueke(id);
                Swal.fire('¡Aceptado!', 'Se ha notificado al usuario.', 'success');
            }
        });
    };
    const aceptarTrueke = async (id) => {
        try {
            const response = await fetch(`${backendUrl}/api/aceptar-trueke/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.msg || "Error al aceptar el trueke");
                console.error("Error al aceptar el trueke:", data);
                return;
            }

            setEstadoTrueke("aceptado");

            const notifyResponse = await fetch(`${backendUrl}/notificar-interesado`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ trueke_id: id })
            });

            if (!notifyResponse.ok) {
                const notifyData = await notifyResponse.json();
                console.error("Error al enviar notificación:", notifyData.msg);
            }

        } catch (error) {
            console.error("Error de red al aceptar trueke o enviar notificación:", error);
            setError("Error de red al aceptar el trueke o enviar notificación");
        }
    };

    const handleCancelarTrueke = async (id, e) => {
        e.stopPropagation();

        const { isConfirmed } = await Swal.fire({
            title: "¿Cancelar trueke?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, cancelar",
            cancelButtonText: "No",
        });

        if (!isConfirmed) return;

        try {
            const response = await fetch(`${backendUrl}/api/truekes/${id}`, {
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

            setTruekes(prev => prev.filter(t => t.id !== id));
            Swal.fire("Cancelado", "El trueke ha sido cancelado.", "success");
        } catch (error) {
            console.error("Error al cancelar trueke:", error);
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
                <p className="ms-3">Cargando tus truekes...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5 pt-4">
                <div className="alert alert-danger">
                    <h4>Error al cargar los truekes</h4>
                    <p>{error}</p>
                    <button
                        className="btn btn-primary"
                        onClick={() => window.location.reload()}
                    >
                        Reintentar
                    </button>
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

            {truekes.length === 0 ? (
                <div className="text-center py-5">
                    <h2 className="mb-4">Mis Truekes</h2>
                    <h4>No tienes truekes aún</h4>
                    <p>Comienza intercambiando tus artículos</p>
                    <button
                        className="btn btn-primary mt-3"
                        onClick={() => navigate("/")}
                    >
                        Ver artículos disponibles
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
                                        src={trueke.mi_articulo?.img || "/placeholder-item.png"}
                                        alt={trueke.mi_articulo?.titulo || "Artículo sin título"}
                                        className="me-3 rounded"
                                        style={{
                                            width: "80px",
                                            height: "80px",
                                            objectFit: "cover",
                                            backgroundColor: "#f8f9fa"
                                        }}
                                        onError={(e) => {
                                            e.target.src = "/placeholder-item.png";
                                        }}
                                    />
                                    <div>
                                        <h6>{trueke.mi_articulo?.titulo || "Artículo sin título"}</h6>
                                        <small className="text-muted">
                                            {trueke.mi_articulo?.categoria || "Sin categoría"} • Estado: {trueke.estado || "desconocido"} • {trueke.solicitado ? "Solicitado" : "Recibido"}
                                        </small>
                                    </div>
                                </div>

                                <div className="d-flex gap-2">
                                    {trueke.solicitado ? (
                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => handleVerTrueke(trueke.id)}
                                        >
                                            Detalles
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-sm btn-outline-success"
                                            onClick={() => handleAceptarTrueke(trueke.id)}
                                        >
                                            Aceptar
                                        </button>
                                    )}
                                    {trueke.estado !== "cancelado" && (
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={(e) => handleCancelarTrueke(trueke.id, e)}
                                        >
                                            Cancelar
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};
