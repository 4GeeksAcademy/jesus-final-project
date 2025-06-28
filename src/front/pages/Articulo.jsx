// Import necessary components from react-router-dom and other parts of the application.
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const ArticuloPublicado = () => {
  const [error, setError] = useState(null);
  const [datosArticulo, setDatosArticulo] = useState(null);

  const { id } = useParams();
  const obtenerArticulo = async (id) => {
    try {
      const response = await fetch(`/articulo/${id}`, { method: "GET" });
      if (response.ok) {
        const data = await response.json();
        setDatosArticulo(data);
      } else {
        const errorMsg = await response.text();
        setDatosArticulo(null);
        setError(errorMsg);
      }
    } catch (error) {
      setDatosArticulo(null);
      setError("Error en la solicitud: " + error.message);
    }
  }
  useEffect(() => {
    obtenerArticulo(id);
  }, [id]);

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
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Artículo eliminado correctamente:", data);
        setDatosArticulo(null);
        return data;
      } else {
        return { error: { status: response.status, message: await response.text() } };
      }
    } catch (error) {
      console.log('Error de red u otro: ', error);
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
        body: JSON.stringify(datosArticulo),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Artículo editado correctamente:", data);
        setDatosArticulo(data);
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
