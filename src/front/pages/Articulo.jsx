// Import necessary components from react-router-dom and other parts of the application.
import { Link } from "react-router-dom";
import { useState } from "react";

export const ArticuloPublicado = () => {

  const token = localStorage.getItem("token")

  const eliminarArticulo = async (id) => {
    try {
      const response = await fetch(`/eliminar-articulo/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!token) {
        return { error: { message: 'Token no encontrado. El usuario no está autenticado.' } };
      }
      if (response.ok) {
        const data = await response.json();
        console.log("Artículo eliminado correctamente:", data);
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
