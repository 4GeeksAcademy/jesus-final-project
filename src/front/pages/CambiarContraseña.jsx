import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useAuthMode } from "../hooks/AuthModeContext";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const CambiarContraseña = () => {
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [newPassword, setNewPassword] = useState({
    password: "",
    confirmPassword: ""
  });
  const navigate = useNavigate();
  const { codigo_uuid } = useParams();
  const { setMode } = useAuthMode();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPassword((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!newPassword.password || !newPassword.confirmPassword) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor, completa ambos campos."
      });
      return;
    }

    if (newPassword.password !== newPassword.confirmPassword) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Las contraseñas no coinciden."
      });
      return;
    }

    await changePassword();
  };


  const changePassword = async () => {
    try {

      const response = await fetch(`${backendUrl}recuperar-contraseña/${codigo_uuid}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword.password }),
      });
      if (response.ok) {
        await Swal.fire({
          title: "Contraseña cambiada correctamente",
          icon: "success",
          confirmButtonText: "Ok",
        });
        navigate("/identificate");
        setMode("login");
      } else {
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al cambiar la contraseña",
        });
      }
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error de red o servidor. Intenta nuevamente.",
      });
    }
  };

  return (
    <motion.div
      className="container-fluid login-bg"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
      }}
      transition={{ duration: 0.5 }}
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#fff",
      }}
    >
      <motion.div
        initial={{ backgroundPosition: "100% 0%" }}
        animate={{ backgroundPosition: "0% 100%" }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #f9d8d9 0%, #f9d8d9 100%)",
          backgroundSize: "200% 200%",
          zIndex: 0,
          clipPath: "polygon(0 0, 100% 0, 100% 40%, 0 70%)",
        }}
      />

      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh", zIndex: 1, position: "relative" }}
      >
        <motion.form
          className="w-25 bg-white p-4 rounded shadow"
          initial={{ opacity: 0, x: -60, rotateY: 10 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          onSubmit={handleSubmit}
        >
          <h2 className="mb-4">Cambiar Contraseña</h2>

          <div className="form-group mb-4 position-relative w-100">
            <label>Contraseña</label>
            <div style={{ position: "relative", width: "100%" }}>
              <input
                type={mostrarPassword ? "text" : "password"}
                className="form-control pe-5"
                name="password"
                value={newPassword.password}
                onChange={handleChange}
                required
                style={{ paddingRight: "3rem", width: "100%" }}
              />
              <i
                className={`bi ${mostrarPassword ? "bi-eye-slash" : "bi-eye"} position-absolute`}
                style={{
                  top: "50%",
                  right: "1rem",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#6c757d",
                  fontSize: "1.5rem",
                  lineHeight: 1,
                }}
                onClick={() => setMostrarPassword(!mostrarPassword)}
              ></i>
            </div>
          </div>

          <div className="form-group mb-4 position-relative w-100">
            <label>Confirmar contraseña</label>
            <div style={{ position: "relative", width: "100%" }}>
              <input
                type={mostrarPassword ? "text" : "password"}
                className="form-control pe-5"
                name="confirmPassword"
                value={newPassword.confirmPassword}
                onChange={handleChange}
                required
                style={{ paddingRight: "3rem", width: "100%" }}
              />
              <i
                className={`bi ${mostrarPassword ? "bi-eye-slash" : "bi-eye"} position-absolute`}
                style={{
                  top: "50%",
                  right: "1rem",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#6c757d",
                  fontSize: "1.5rem",
                  lineHeight: 1,
                }}
                onClick={() => setMostrarPassword(!mostrarPassword)} // Igual aquí para confirmPassword
              ></i>
            </div>
          </div>

          <button type="submit" className="btn btn-success w-100">
            Confirmar
          </button>
          <p className="mt-3 text-info" style={{ cursor: "pointer" }}>
            Vuelve a enviar el código
          </p>
        </motion.form>
      </div>
    </motion.div>
  );
};
