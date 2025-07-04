import React from "react";
import equipo from "../assets/img/equipo.png";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
const SobreNosotros = () => {
  const navigate = useNavigate();

  const paragraphs = [
    "¡Cambiando el juego, un intercambio a la vez!",
    "Somos TRUEKETEO, un proyecto nacido como trabajo final de un Bootcamp de Full Stack Development. Pero somos mucho más que código: somos una idea que surgió del deseo de hacer algo diferente, donde el valor no lo define el dinero, sino la conexión entre personas.",
    "En un mundo donde todo parece tener precio, nosotros creemos en el trueque accesible e inclusivo. Nuestra plataforma nació para facilitar el intercambio de artículos (libros, ropa, tecnología, hobbies y más), rompiendo barreras económicas y fomentando una comunidad donde lo que importa es lo que puedes aportar, no lo que puedes pagar.",
    "¿Por qué lo hacemos?",
    "🌱 Sostenibilidad: Dar segunda vida a lo que ya no usas.",
    "🤝 Comunidad: Crear redes basadas en confianza y colaboración.",
    "💡 Innovación: Usar la tecnología (¡nuestras habilidades de full stack!) para un fin social.",
    "¿Te unes al movimiento? Juntos podemos demostrar que otra economía es posible.",
  ];

  const goHome = () => {
    navigate("/");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="container my-5">
        <div className="row align-items-center">
          <div className="col-lg-8 mb-4">
            <h1 className="mb-4 fw-bold fs-2">¿Quiénes Somos?</h1>
            <div className="lh-lg">
              {paragraphs.map((paragraph, index) => (
                <p key={index} className="text-muted fs-5">
                  {paragraph}
                </p>
              ))}
            </div>
            <button
              onClick={goHome}
              className="btn btn-primary btn-lg mt-4">
              TRUEKETEO
            </button>
          </div>

          <div className="col-lg-4 d-flex justify-content-center justify-content-lg-end mt-lg-5">
            <img
              src={equipo}
              alt="Equipo de TRUEKETEO"
              className="img-fluid rounded shadow"
              style={{ maxWidth: "100%", width: "600px" }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SobreNosotros;
