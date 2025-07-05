import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const Truekes = () => {
    const { id } = useParams();
    const [trueke, setTrueke] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const getAuthToken = () => {
        return localStorage.getItem('token');
    };

    useEffect(() => {
        const fetchTrueke = async () => {
            try {
                const token = getAuthToken();
                if (!token) {
                    navigate('/identificate');
                    return;
                }

                const url = id
                    ? `${backendUrl}/api/truekes/${id}`
                    : `${backendUrl}/api/truekes`;

                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('refresh_token');
                    localStorage.removeItem('userId');
                    navigate('/identificate');
                    return;
                }

                if (!response.ok) {
                    throw new Error('Error al obtener truekes');
                }

                const data = await response.json();
                setTrueke(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTrueke();
    }, [id, navigate]);

    const crearTrueke = async (formData) => {
        try {
            const token = getAuthToken();
            if (!token) {
                navigate('/identificate');
                return;
            }

            const response = await fetch(`${backendUrl}/api/truekes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('userId');
                navigate('/identificate');
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al crear trueke');
            }

            const data = await response.json();
            navigate(`/trueke/${data.id}`);
        } catch (err) {
            setError(err.message);
        }
    };

    const actualizarTrueke = async (truekeId, actualizar) => {
        try {
            const token = getAuthToken();
            if (!token) {
                navigate('/identificate');
                return;
            }

            const response = await fetch(`${backendUrl}/api/truekes/${truekeId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(actualizar)
            });

            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('userId');
                navigate('/identificate');
                return;
            }

            if (!response.ok) {
                throw new Error('Error al actualizar trueke');
            }

            setTrueke(prev => ({ ...prev, ...actualizar }));
        } catch (err) {
            setError(err.message);
        }
    };

    const cerrarSesion = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('userId');
        navigate('/identificate');
    };

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="trueke-container">
            <div className="container mt-4">
                <div className="row">
                    <div className="col-12">
                        <h2>Gestión de Truekes</h2>
                        {trueke ? (
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Trueke #{trueke.id}</h5>
                                    <p className="card-text">
                                        <strong>Comentarios:</strong> {trueke.comentarios || 'Sin comentarios'}
                                    </p>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <h6>Artículo Propietario:</h6>
                                            <p>{trueke.propietario}</p>
                                        </div>
                                        <div className="col-md-6">
                                            <h6>Artículo Receptor:</h6>
                                            <p>{trueke.receptor}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="alert alert-info">
                                <p>No se encontraron truekes.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};