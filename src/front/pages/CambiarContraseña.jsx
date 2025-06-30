
import { useState } from "react";
import { motion } from "framer-motion";

export const CambiarContraseña = () => {
  const [mostrarPassword, setMostrarPassword] = useState(false);
  return (
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>

      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "200%",
          height: "200%",
          background: "linear-gradient(45deg, #007bff, #00ffcc)",
          zIndex: 0,
          filter: "blur(40px)",
        }}
      />


      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          position: "relative",
          zIndex: 2,
          height: "100vh",
        }}
      >
        <form className="w-25 bg-white p-4 rounded shadow" onSubmit={""}>
          <h2 className="mb-4">Cambiar Contraseña</h2>

          <div className="form-group mb-4 position-relative w-100">
            <label>Contraseña</label>
            <div style={{ position: "relative", width: "100%" }}>
              <input
                type={mostrarPassword ? "text" : "password"}
                className="form-control pe-5"
                name="password"
                value={""}
                onChange={""}
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
            <label>Contraseña</label>
            <div style={{ position: "relative", width: "100%" }}>
              <input
                type={mostrarPassword ? "text" : "password"}
                className="form-control pe-5"
                name="password"
                value={""}
                onChange={""}
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

          <button type="submit" className="btn btn-success w-100">
            Confirmar
          </button>
          <p className="mt-3 text-info" style={{ cursor: "pointer" }}>
            Vuelve a enviar el código
          </p>
        </form>
      </div>
    </div>
  );
};