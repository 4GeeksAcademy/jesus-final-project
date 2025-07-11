import { createContext, useContext } from 'react';
import Swal from 'sweetalert2';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthWrapper');
    }
    return context;
};

export const AuthWrapper = ({ children }) => {
    const logout = (showMessage = true) => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('mail');
        
        console.log('🔒 Cerrando sesión y limpiando datos...');
        
        if (showMessage) {
            Swal.fire({
                title: 'Sesión Expirada',
                text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
                icon: 'warning',
                confirmButtonText: 'Ir al Login'
            }).then(() => {
                window.location.href = '/identificate';
            });
        } else {
            window.location.href = '/identificate';
        }
    };

    const isAuthenticated = () => {
        const token = localStorage.getItem('token');
        return !!token;
    };

    const authenticatedRequest = async (url, options = {}) => {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const token = localStorage.getItem('token');
        
        if (!token) {
            logout(false);
            throw new Error('No token available');
        }

        const defaultHeaders = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        const config = {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers
            }
        };

        try {
            const response = await fetch(`${backendUrl}${url}`, config);
            
            if (response.status === 401 || response.status === 403) {
                try {
                    const data = await response.clone().json();
                    
                    if (data.msg && (
                        data.msg.includes('token') || 
                        data.msg.includes('expired') || 
                        data.msg.includes('invalid') ||
                        data.msg.includes('unauthorized') ||
                        data.error === 'token_expired' ||
                        data.error === 'token_invalid' ||
                        data.error === 'authorization_required'
                    )) {
                        console.log('🔒 Token expirado detectado en petición');
                        logout(true);
                        throw new Error('Token expired');
                    }
                } catch (parseError) {
                    console.log('🔒 Error de autenticación detectado');
                    logout(true);
                    throw new Error('Authentication error');
                }
            }
            
            return response;
            
        } catch (error) {
            console.error('Error en petición autenticada:', error);
            throw error;
        }
    };

    const value = {
        logout,
        isAuthenticated,
        authenticatedRequest
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};