import { useState } from "react";
import Swal from "sweetalert2";
import { useAuthMode } from "../hooks/AuthModeContext";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const LoginRegistro = () => {
  const { dispatch } = useGlobalReducer();
  const { mode, setMode } = useAuthMode();
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const navigate = useNavigate();

  const [datosUsuario, setDatosUsuario] = useState({
    nombre_de_usuario: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatosUsuario((prev) => ({ ...prev, [name]: value }));
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
        await Swal.fire({
          title: `Bienvenido ${data.mail}`,
          icon: "success",
          confirmButtonText: "Continuar",
        });

        localStorage.setItem("token", data.token);
        localStorage.setItem("refresh_token", data.refresh_token);
        localStorage.setItem("userId", data.userId);

        dispatch({
          type: "login_success",
          payload: {
            token: data.token,
            refreshToken: data.refresh_token,
            userId: data.userId,
          },
        });

        navigate("/");
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
        }).then(() => setMode("login"));
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

  const backgroundVariants = {
    login: {
      background: "linear-gradient(135deg, #77a6e9 50%, #ffffff 50%)",
      transition: { duration: 1.5, ease: "easeInOut" },
    },
    registro: {
      background: "linear-gradient(225deg, #77a6e9 50%, #ffffff 50%)",
      transition: { duration: 1.5, ease: "easeInOut" },
    },
  };



  return (
    <motion.div
      className="container-fluid login-bg"
      variants={backgroundVariants}
      animate={mode}
      initial={false}
      style={{ minHeight: "100vh" }}
    >
      <div className="row vh-100 position-relative overflow-hidden">
        <AnimatePresence mode="wait">
          {mode === "registro" && (
            <motion.div
              key="registro"
              className="position-absolute top-0 start-0 w-100 h-100"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.4 }}
            >
              <div className="row h-100">
                <div className="col-12 col-md-6 d-flex align-items-center justify-content-center p-5">
                  <form className="w-75" onSubmit={handleSubmit}>
                    <h2 className="mb-4">Registro</h2>
                    <div className="form-group mb-3">
                      <label>Nombre de usuario</label>
                      <input
                        type="text"
                        className="form-control"
                        name="nombre_de_usuario"
                        value={datosUsuario.nombre_de_usuario}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={datosUsuario.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group mb-4 position-relative w-100">
                      <label>Contraseña</label>
                      <div style={{ position: "relative", width: "100%" }}>
                        <input
                          type={mostrarPassword ? "text" : "password"}
                          className="form-control pe-5"
                          name="password"
                          value={datosUsuario.password}
                          onChange={handleChange}
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
                      Registrarme
                    </button>
                    <p
                      className="mt-3 text-info"
                      style={{ cursor: "pointer" }}
                      onClick={() => setMode("login")}
                    >
                      ¿Ya tienes cuenta? Inicia sesión
                    </p>
                  </form>
                </div>
                <div className="col-12 col-md-6 fondo-lateral d-none d-md-block"></div>
              </div>
            </motion.div>
          )}

          {mode === "login" && (
            <motion.div
              key="login"
              className="position-absolute top-0 start-0 w-100 h-100"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <div className="row h-100">
                <div className="col-12 col-md-6 fondo-lateral d-none d-md-block"></div>
                <div className="col-12 col-md-6 d-flex align-items-center justify-content-center p-5">
                  <form className="w-75" onSubmit={handleSubmit}>
                    <h2 className="mb-4">Iniciar sesión</h2>
                    <div className="form-group mb-3">
                      <label>Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={datosUsuario.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group mb-4 position-relative w-100">
                      <label>Contraseña</label>
                      <div style={{ position: "relative", width: "100%" }}>
                        <input
                          type={mostrarPassword ? "text" : "password"}
                          className="form-control pe-5"
                          name="password"
                          value={datosUsuario.password}
                          onChange={handleChange}
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
                    <button type="submit" className="btn btn-primary w-100">
                      Iniciar sesión
                    </button>
                    <div className="mt-3 d-flex justify-content-between">
                      <span
                        className="text-info"
                        style={{ cursor: "pointer" }}
                        onClick={() => setMode("registro")}
                      >
                        ¿No tienes cuenta? Registrate
                      </span>

                      <span
                        className="olvidaste-pass"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          Swal.fire({
                            title: "Recuperar contraseña",
                            html:
                              `<input type="email" id="swal-input-email" class="swal2-input" placeholder="email@ejemplo.com" autocapitalize="off">` +
                              `<input type="email" id="swal-input-email2" class="swal2-input" placeholder="Confirma tu email" autocapitalize="off">`,
                            focusConfirm: false,
                            showCancelButton: true,
                            confirmButtonText: "Enviar",
                            showLoaderOnConfirm: true,
                            preConfirm: async () => {
                              const email1 = document.getElementById('swal-input-email').value;
                              const email2 = document.getElementById('swal-input-email2').value;

                              if (!email1 || !email2) {
                                Swal.showValidationMessage("Por favor, completa ambos campos.");
                                return false;
                              }

                              if (!email1.includes("@") || !email2.includes("@")) {
                                Swal.showValidationMessage("Introduce un correo válido que contenga '@'.");
                                return false;
                              }

                              if (email1 !== email2) {
                                Swal.showValidationMessage("Los correos no coinciden, por favor intenta nuevamente.");
                                return false;
                              }

                              try {
                                const response = await fetch(`${backendUrl}enviar-mensaje`, {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ mailTo: email1 }),
                                });

                                if (!response.ok) {
                                  const errData = await response.json();
                                  throw new Error(errData.msg || "No se pudo enviar el email");
                                }

                                return response.json();
                              } catch (error) {
                                Swal.showValidationMessage(`Error en la petición: ${error.message}`);
                                return false;
                              }
                            },
                            allowOutsideClick: () => !Swal.isLoading(),
                          }).then((result) => {
                            if (result.isConfirmed) {
                              Swal.fire({
                                title: "Email enviado",
                                text: "Revisa tu bandeja de entrada para restablecer tu contraseña.",
                                icon: "success",
                              });
                            }
                          })
                        }
                      >
                        ¿Olvidaste tu contraseña?
                      </span>

                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          )
          }
        </AnimatePresence >
      </div >
    </motion.div >
  );
};

