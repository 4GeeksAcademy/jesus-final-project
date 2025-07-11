import React from "react";
import { useNavigate } from "react-router-dom";
import desktop from "../assets/img/desktop.png";
import { motion } from "framer-motion";

const Contacto = () => {
  const navigate = useNavigate();

  const redirectHome = () => {
    navigate("/");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      style={{ minHeight: 'calc(100vh - 386px)' }}
    >
      <div className="container my-5 ">
        <div className="row align-items-center">

          <div className="col-md-5 ">
            <h2 className="mb-3">¡Estamos A Un Correo De Distancia!</h2>
            <p className="text-muted">Envíanos Tus Dudas A:</p>
            <a
              href="mailto:trueketeo@gmail.com"
              className="text-primary fw-semibold text-decoration-underline"
            >
              trueketeo@gmail.com
            </a>
            <p className="text-muted mt-2">Y Con Gusto Te Ayudaremos.</p>
            <button
              type="button"
              onClick={redirectHome}
              className="btn btn-primary mt-4 px-4 py-3 fs-3"
            >
              Trueketeo
            </button>
          </div>

          <div className="col-md-7 d-flex justify-content-center">
            <img
              src={desktop}
              alt="Customer support representative at desk with computer"
              className="img-fluid"
              style={{ maxHeight: "400px", objectFit: "contain" }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Contacto;
