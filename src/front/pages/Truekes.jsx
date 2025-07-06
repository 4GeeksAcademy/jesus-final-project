import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const Truekes = () => {
    const { usuarioId } = useParams();
    const [truekes, setTruekes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const getAuthToken = () => {
        return localStorage.getItem('token');
    };

    const fetchTruekesUsuario = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = getAuthToken();
            const currentUserId = localStorage.getItem('userId');

            // Verificar que el usuario solicitado coincide con el autenticado
            if (usuarioId && usuarioId !== currentUserId) {
                navigate('/identificate');
                return;
            }

            if (!token) {
                navigate('/identificate');
                return;
            }

            const response = await fetch(`${backendUrl}/api/historial-truekes`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            // Verificación exhaustiva de la respuesta
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error("Respuesta no JSON:", text);
                throw new Error('El servidor respondió con formato incorrecto');
            }

            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                navigate('/identificate');
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Error ${response.status}`);
            }

            const data = await response.json();

            // Validar estructura de datos recibida
            if (!data.historial) {
                throw new Error('Formato de respuesta inesperado');
            }

            // Ordenar truekes por fecha (más recientes primero)
            const truekesOrdenados = data.historial.sort((a, b) =>
                new Date(b.fecha_creacion) - new Date(a.fecha_creacion)
            );

            setTruekes(truekesOrdenados);
        } catch (err) {
            console.error("Error al obtener truekes:", err);
            setError(err.message || 'Error al cargar tus truekes');
            Swal.fire({
                title: 'Error',
                text: err.message || 'No se pudieron cargar los truekes',
                icon: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    // Recargar cuando cambie el usuarioId o al montar el componente
    useEffect(() => {
        fetchTruekesUsuario();
    }, [usuarioId]);

    const handleVerDetalle = (truekeId) => {
        navigate(`/trueke/${truekeId}`);
    };

    const handleCrearTrueke = () => {
        navigate('/publicar-articulo');
    };

    const handleRecargar = () => {
        fetchTruekesUsuario();
    };

    if (loading) return (
        <div className="container mt-5 pt-4">
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <div className="text-center">
                    <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-3">Cargando tus truekes...</p>
                </div>
            </div>
        </div>
    );

    if (error) return (
        <div className="container mt-5 pt-4">
            <div className="alert alert-danger">
                <h5 className="alert-heading">Error al cargar truekes</h5>
                <p>{error}</p>
                <div className="d-flex justify-content-between mt-3">
                    <button
                        className="btn btn-danger"
                        onClick={() => navigate('/')}
                    >
                        Volver al inicio
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleRecargar}
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="container mt-5 pt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h3 mb-0">Mis Truekes</h1>
                <div>
                    <button
                        className="btn btn-sm btn-outline-secondary me-2"
                        onClick={() => navigate(-1)}
                    >
                        <i className="bi bi-arrow-left me-1"></i> Volver
                    </button>
                    <button
                        className="btn btn-sm btn-primary"
                        onClick={handleRecargar}
                    >
                        <i className="bi bi-arrow-clockwise me-1"></i> Actualizar
                    </button>
                </div>
            </div>

            {truekes.length > 0 ? (
                <div className="row g-4">
                    {truekes.map((trueke) => (
                        <div key={trueke.id} className="col-md-6 col-lg-4">
                            <div className="card h-100 shadow-sm border-0">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div>
                                            <span className="badge bg-light text-dark mb-2">
                                                ID: {trueke.id}
                                            </span>
                                            <h5 className="card-title mb-1">
                                                {trueke.rol_usuario === 'propietario' ?
                                                    'Ofrecí' : 'Recibí'} un trueke
                                            </h5>
                                            <small className="text-muted d-block">
                                                <i className="bi bi-calendar me-1"></i>
                                                {new Date(trueke.fecha_creacion).toLocaleDateString('es-ES', {
                                                    day: '2-digit',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </small>
                                        </div>
                                        <span className={`badge ${trueke.estado === 'completado' ? 'bg-success' : 'bg-warning'}`}>
                                            {trueke.estado || 'pendiente'}
                                        </span>
                                    </div>

                                    <div className="mb-3">
                                        <h6 className="text-primary d-flex align-items-center">
                                            <i className="bi bi-box-seam me-2"></i>
                                            Mi Artículo
                                        </h6>
                                        <div className="d-flex align-items-center mt-2 ps-3">
                                            {trueke.mi_articulo?.img ? (
                                                <img
                                                    src={trueke.mi_articulo.img}
                                                    alt={trueke.mi_articulo.titulo}
                                                    className="img-thumbnail me-3 flex-shrink-0"
                                                    style={{
                                                        width: '70px',
                                                        height: '70px',
                                                        objectFit: 'cover'
                                                    }}
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/70?text=Imagen+no+disponible';
                                                    }}
                                                />
                                            ) : (
                                                <div className="bg-light me-3 d-flex align-items-center justify-content-center flex-shrink-0"
                                                    style={{
                                                        width: '70px',
                                                        height: '70px'
                                                    }}>
                                                    <i className="bi bi-image text-muted"></i>
                                                </div>
                                            )}
                                            <div>
                                                <strong className="d-block">{trueke.mi_articulo?.titulo || 'Artículo no especificado'}</strong>
                                                <small className="text-muted">{trueke.mi_articulo?.categoria || 'Sin categoría'}</small>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <h6 className="text-primary d-flex align-items-center">
                                            <i className="bi bi-arrow-left-right me-2"></i>
                                            Intercambio por
                                        </h6>
                                        <div className="d-flex align-items-center mt-2 ps-3">
                                            {trueke.articulo_intercambiado?.img ? (
                                                <img
                                                    src={trueke.articulo_intercambiado.img}
                                                    alt={trueke.articulo_intercambiado.titulo}
                                                    className="img-thumbnail me-3 flex-shrink-0"
                                                    style={{
                                                        width: '70px',
                                                        height: '70px',
                                                        objectFit: 'cover'
                                                    }}
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/70?text=Imagen+no+disponible';
                                                    }}
                                                />
                                            ) : (
                                                <div className="bg-light me-3 d-flex align-items-center justify-content-center flex-shrink-0"
                                                    style={{
                                                        width: '70px',
                                                        height: '70px'
                                                    }}>
                                                    <i className="bi bi-image text-muted"></i>
                                                </div>
                                            )}
                                            <div>
                                                <strong className="d-block">{trueke.articulo_intercambiado?.titulo || 'Artículo no especificado'}</strong>
                                                <small className="text-muted">{trueke.articulo_intercambiado?.categoria || 'Sin categoría'}</small>
                                                <small className="d-block mt-1">
                                                    <i className="bi bi-person me-1"></i>
                                                    {trueke.otro_usuario?.nombre_de_usuario || 'Usuario desconocido'}
                                                </small>
                                            </div>
                                        </div>
                                    </div>

                                    {trueke.comentarios && (
                                        <div className="alert alert-light mt-3 mb-0 py-2 small">
                                            <i className="bi bi-chat-left-text me-1"></i>
                                            <strong>Comentario:</strong> {trueke.comentarios}
                                        </div>
                                    )}

                                    <div className="d-grid mt-3">
                                        <button
                                            className="btn btn-outline-primary"
                                            onClick={() => handleVerDetalle(trueke.id)}
                                        >
                                            <i className="bi bi-eye me-2"></i>
                                            Ver detalles completos
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card border-0 shadow-sm">
                    <div className="card-body text-center py-5">
                        <i className="bi bi-arrow-repeat text-muted mb-4" style={{ fontSize: '3rem' }}></i>
                        <h3 className="mb-3">No tienes truekes registrados</h3>
                        <p className="text-muted mb-4">Empieza a truequear tus artículos con otros usuarios de la comunidad</p>
                        <div className="d-flex justify-content-center gap-3">
                            <button
                                className="btn btn-primary"
                                onClick={handleCrearTrueke}
                            >
                                <i className="bi bi-plus-circle me-2"></i>
                                Crear mi primer trueke
                            </button>
                            <button
                                className="btn btn-outline-secondary"
                                onClick={() => navigate('/')}
                            >
                                <i className="bi bi-house me-2"></i>
                                Volver al inicio
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};