// Import necessary components from react-router-dom and other parts of the application.
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";  // Custom hook for accessing the global state.

export const CambiarContraseña = () => {

  return (
    <form className="w-75" onSubmit={""}>
      <h2 className="mb-4">Cambiar Contraseña</h2>
      <div className="form-group mb-4">
        <label>Contraseña</label>
        <input
          type="password"
          className="form-control"
          name="password"
          value={""}
          onChange={""}
          required
        />
      </div>
      <div className="form-group mb-4">
        <label>Contraseña</label>
        <input
          type="password"
          className="form-control"
          name="password"
          value={""}
          onChange={""}
          required
        />
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
