import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Swal from 'sweetalert2';
import { useAuthMode } from "../hooks/AuthModeContext";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const LoginForm = ({ onSubmit, datosUsuario, handleChange }) => (
  <form className="w-50" onSubmit={onSubmit}>
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
    <button type="submit" className="btn btn-primary w-100">Iniciar Sesión</button>
  </form>
);

const RegisterForm = ({ onSubmit, datosUsuario, handleChange }) => (
  <form className="w-50" onSubmit={onSubmit}>
    <div className="form-group py-3">
      <label htmlFor="nombre_de_usuario">Nombre de usuario *</label>
      <input
        type="text"
        className="form-control"
        id="nombre_de_usuario"
        name="nombre_de_usuario"
        value={datosUsuario.nombre_de_usuario || ""}
        onChange={handleChange}
        required
      />
    </div>
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
    <button type="submit" className="btn btn-primary w-100">Registrarse</button>
  </form>
);

export const LoginRegistro = () => {
  const { mode } = useAuthMode();
  const navigate = useNavigate();

  const [datosUsuario, setDatosUsuario] = useState({
    nombre_de_usuario: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatosUsuario(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const loginCall = async (datos) => {
    try {
      const response = await fetch(`${backendUrl}login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: datos.email,
          password: datos.password,
        }),
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

  const registerCall = async (datos) => {
    try {
      const response = await fetch(`${backendUrl}register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre_de_usuario: datos.nombre_de_usuario,
          email: datos.email,
          password: datos.password,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        Swal.fire({
          title: `Usuario creado: ${datos.nombre_de_usuario}`,
          icon: "success",
          confirmButtonText: "Continuar",
        }).then(() => navigate("/login")); // o donde quieras
      } else {
        Swal.fire({
          title: "Error en registro",
          text: data.msg || "No se pudo registrar",
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
    if (mode === "login") {
      loginCall(datosUsuario);
    } else {
      registerCall(datosUsuario);
    }
  };
  return (
    <>
      {mode ? (
        <div className="d-flex justify-content-center align-items-start vh-100">
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

            <button type="submit" className="btn btn-primary w-100">
              Iniciar Sesión
            </button>
          </form>
        </div>
      ) : (
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

            <button type="submit" className="btn btn-primary w-100">
              Iniciar Sesión
            </button>
          </form>
        </div>
      )}
    </>


  );
};