import { Link } from "react-router-dom";
import { useState } from "react";

export const PublicarArticulo = () => {

    const [informacionArticulo, setInformacionArticulo] = useState({
        titulo: '',
        descripcion: '',
        categoria: '',
        img: '',
        modelo: '',
        estado: '',
        cantidad: '',
    });
    const [error, setError] = useState(null);
    const [publicado, setPublicado] = useState(false);

    const manejarMensaje = async (e) =>{
        e.preventDefault();
        const token =localStorage.getItem('token');

        try{
            const response = await fetch ('/publicar-articulo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'aplication/json',
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
            
            //Reinicia el formulario
            setInformacionArticulo({
                titulo: '',
                descripcion: '',
                categoria: '',
                img: '',
                modelo: '',
                estado: '',
                cantidad: '',
            });

        } catch (err) {
            setError(err.message);
            setPublicado(false);
        }
    }; 

    const manejarCambiar = (e) => {
        const { name, value } = e.target;
        setInformacionArticulo(prev => ({
            ...prev,
            [name]: name === 'cantidad' ? parseInt(value) : value
        }));
    };

    return (
         <div className="publicar-form">
            
         </div>
    )
};

