// Import necessary components from react-router-dom and other parts of the application.
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const DatosPersonales = () => {
  const [datosPersonalesEditados, setDatosPersonalesEditados] = useState({
    nombre_completo: "",
    telefono: "",
    direccion: "",
    img: ""
  });
  const [articulosFavoritos, setArticulosFavoritos] = useState([]);


  const editarDatosPersonales = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: { message: 'Token no encontrado. Usuario no autenticado.' } };
    }
    try {
      const response = await fetch(`${backendUrl}api/editar-datos-personales`, {
        method: "PUT",
        body: JSON.stringify(datosPersonalesEditados),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Datos actualizados correctamente:", data);
        return data;
      } else {
        return { error: { status: response.status, message: await response.text() } };
      }
    } catch (error) {
      console.log('Error de red u otro: ', error);
      return { error: { message: 'Error en la solicitud', details: error.message } };
    }
  };


  const obtenerFavoritos = async () => {

    const token = localStorage.getItem("token");
    if (!token) {
      return { error: { message: 'Token no encontrado. Usuario no autenticado.' } };
    }
    try {
      const response = await fetch(`${backendUrl}api/favoritos`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Favoritos actualizados correctamente:", data);
        setArticulosFavoritos(data)
        return data;
      } else {
        return { error: { status: response.status, message: await response.text() } };
      }
    } catch (error) {
      console.log('Error de red u otro: ', error);
      return { error: { message: 'Error en la solicitud', details: error.message } };
    }
  };

  useEffect(() => {
    obtenerFavoritos();
  }, [])

  return (
    <div>

    </div>
  );
};
