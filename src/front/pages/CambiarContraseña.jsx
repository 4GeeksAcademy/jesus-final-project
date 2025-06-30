
import { useState } from "react";

export const CambiarContraseña = () => {
  const [mostrarPassword, setMostrarPassword] = useState(false);
  return (
    <form className="w-25" onSubmit={""}>
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
            className={`bi ${mostrarPassword ? "bi-eye-slash" : "bi-eye"
              } position-absolute`}
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
            className={`bi ${mostrarPassword ? "bi-eye-slash" : "bi-eye"
              } position-absolute`}
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
      <p
        className="mt-3 text-info"
        style={{ cursor: "pointer" }}
      >
        Vuelve a enviar el código
      </p>
    </form>
  )
};
