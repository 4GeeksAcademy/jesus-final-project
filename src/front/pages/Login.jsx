import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Swal from 'sweetalert2';

export const Login = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [datosUsuario, setDatosUsuario] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatosUsuario((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const loginCall = async (datos) => {
    try {
      const response = await fetch(`${backendUrl}login`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: datos.email,
          password: datos.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          title: `Bienvenido ${data.email}`,
          icon: "success",
          confirmButtonText: "Continuar",
        }).then(() => navigate("/asd"));
      } else {
        Swal.fire({
          title: "Error de login",
          text: data.msg || "Credenciales incorrectas",
          icon: "error",
        });
      }

    } catch (error) {
      Swal.fire({
        title: "Error de red",
        text: error.message,
        icon: "error",
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginCall(datosUsuario);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <form className="w-50" onSubmit={handleSubmit}>
        <div className="form-group py-3">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={datosUsuario.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group pb-3">
          <label htmlFor="password">Password *</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={datosUsuario.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="d-flex justify-content-end pb-3">
          <span className="text-primary" style={{ cursor: "pointer" }}>
            ¿Olvidaste tu contraseña?
          </span>
        </div>

        <button type="submit" className="btn btn-primary w-100">Iniciar Sesión</button>
      </form>
    </div>
  );
};