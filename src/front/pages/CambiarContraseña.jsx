// Import necessary components from react-router-dom and other parts of the application.
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";  // Custom hook for accessing the global state.

export const CambiarContraseña = () => {
  // Access the global state and dispatch function using the useGlobalReducer hook.

 return (
   <form className="w-75" onSubmit={handleSubmit}>
                  <h2 className="mb-4">Registro</h2>
                  <div className="form-group mb-3">
                    <label>Nombre de usuario</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nombre_de_usuario"
                      value={""}
                      onChange={""}
                      required
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label>Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={""}
                      onChange={""}
                      required
                    />
                  </div>
                  <div className="form-group mb-4">
                    <label>Password</label>
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
                    Registrarme
                  </button>
                  <p
                    className="mt-3 text-info"
                    style={{ cursor: "pointer" }}
                  >
                    ¿Ya tienes cuenta? Inicia sesión
                  </p>
                </form>
 )
};
