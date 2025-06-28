// Import necessary components from react-router-dom and other parts of the application.
import { Link } from "react-router-dom";
import { useState } from "react";

export const DatosPersonales = () => {
  const [datosPersonalesEditados, setDatosPersonalesEditados] = useState({
    nombre_completo: "",
    telefono: "",
    direccion: "",
    img: ""
  });


  const editarDatosPersonales = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: { message: 'Token no encontrado. Usuario no autenticado.' } };
    }
    try {
      const response = await fetch(`/editar-datos-personales/${id}`, {
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

  return (
    <div>

    </div>
  );
};
