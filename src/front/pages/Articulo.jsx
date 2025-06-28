// Import necessary components from react-router-dom and other parts of the application.
import { Link } from "react-router-dom";
import { useState } from "react";

export const ArticuloPublicado = () => {

  const eliminarArticulo = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: { message: 'Token no encontrado. Usuario no autenticado.' } };
    }
    try {
      const response = await fetch(`/eliminar-datos-articulo/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(datosArticuloEditados),
      });

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


  const [datosArticulo, setDatosArticulo] = useState({
    titulo: "",
    caracteristicas: "",
    estado: "",
    modelo: "",
    cantidad: "",
    categoria: "",
    img: "",

  });

  const Articulos = async (id) => {
    try {
      const response = await fetch(`/articulo/${id}`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Artículo obtenido correctamente:", data);
        return data;
      } else {
        const errorMsg = await response.text();
        return { error: { status: response.status, message: errorMsg } };
      }
    } catch (error) {
      console.log('Error de red u otro:', error);
      return { error: { message: 'Error en la solicitud', details: error.message } };
    }
  };


  const editarArticulo = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: { message: 'Token no encontrado. Usuario no autenticado.' } };
    }
    try {
      const response = await fetch(`/editar-datos-articulo/${id}`, {
        method: "PUT",
        body: JSON.stringify(datosEditados),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json();
        console.log("Artículo editado correctamente:", data);
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
