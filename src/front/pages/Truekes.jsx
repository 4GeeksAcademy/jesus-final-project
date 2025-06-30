import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const Truekes = () => {
    const { id } = useParams();
    const [trueke, setTrueke] = useState(null);
    const [loading, setLoading] = usestate(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Obtiene token de localStorage
    const getAuthToken = () => {
        const authData = localStorage.getItem('authTokens');
        return authData ? JSON.parse(authData).access : null;
    };

    //Trueke especifico o lista
    useEffect(() => {
        const fetchTrueke = async () => {
            try {
                const token = getAuthToken();
                if (!token) {
                    navigate('/login');
                    return;
                }

                const url = id ? `${backendUrl}${id}`
                    : 'api/truekes';

                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 401) {
                    //token invalid o exp
                    localStorage.removeItem('authTokens');
                    navigate('/login');
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

    const crearTrueke = async (FormData) => {
        try {
            const token = getAuthToken();
            if (!token) {
                navigate('/login');
                return;
            }
            const response = await fetch('api/truekes', {   //cambiar fetch
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(FormData)
            });

            if (response.status === 401) {
                localStorage.removeItem('authToken');
                navigate('/login');
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al crear trueke');
            }

            const data = await response.json();
            navigate(`/truekes/${data.id}`);
        } catch (err) {
            setError(err.message);
        }
    };

    const actualizarTrueke = async (truekeId, actualizar) => {
        try {
            const token = getAuthToken();
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch(`/api/truekes/${truekeId}`, {   //cambiar
                method: 'PUT',
                headers: {
                    'Content-Type': 'application.json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(actualizar)
            });

            if (response.status === 401) {
                localStorage.removeItem('authTokens');
                navigate('/login');
                return;
            }

            if (!response.ok) {
                throw new Error('Error al actualizar trueke');
            }

            // act el local
            setTrueke(prev => ({ ...prev, ...actualizar }));
        } catch (err) {
            setError(err.message);
        }
    };

    const cerrarSesion = () => {
        localStorage.removeItem('authTokens');
        navigate('/login');
    };

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="trueke-container">

        </div>
    )
}