// Import necessary components from react-router-dom and other parts of the application.
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from 'sweetalert2'

export const Registro = () => {

  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre_de_usuario: "",
    mail: "",
    password: "",
  });
  const navigate = useNavigate();

  const crearCuenta = async () => {
    try {
      const response = await fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoUsuario),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`Usuario ${nuevoUsuario.mail} creado correctamente:`, data);
        Swal.fire({
          title: "Usuario creado correctamente",
          icon: "success",
          confirmButtonText: "Ir al login",
        }).then(() => navigate("/login"));
        return data;
      } else {
        const errorMsg = await response.text();
        Swal.fire({
          title: "Error al crear cuenta",
          text: errorMsg,
          icon: "error",
        });
        return { error: { status: response.status, message: errorMsg } };
      }
    } catch (error) {
      console.log("Error de red u otro: ", error);
      Swal.fire({
        title: "Error de red",
        text: error.message,
        icon: "error",
      });
      return { error: { message: "Error en la solicitud", details: error.message } };
    }
  };

  return (
    <div>


    </div>
  );
};
