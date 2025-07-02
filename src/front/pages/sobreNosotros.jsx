import React from "react";
import equipo from ".src/front/assets/img/equipo.png";
import { useNavigate } from "react-router-dom";

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
  }
  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-8">
      <div className="max-w-[1400px] w-full relative">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/2 space-y-6">
            <h1 className="text-3xl font-bold text-black mb-8">¿Quiénes Somos?</h1>
            <div className="space-y-4">
              {paragraphs.map((paragraph, index) => (
                <p
                  key={`paragraph-${index}`}
                  className="text-gray-600 text-base leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="lg:w-1/2 flex justify-center lg:justify-end">
            <img
              className="max-w-full h-auto object-contain rounded-lg shadow-md"
              alt="Equipo de TRUEKETEO"
              src={equipo}/>
          </div>
        </div>

        <div className="mt-12 lg:absolute lg:bottom-8 lg:right-8">
          <button
            onClick={goHome}
            className="w-[212px] h-[70px] bg-[#8a77ff] rounded-xl flex items-center justify-center hover:bg-[#7a67ee] transition-colors shadow-md"
          >
            <h2 className="text-black text-2xl font-bold">TRUEKETEO</h2>
          </button>
        </div>
      </div>
    </div>

  );
};

export default SobreNosotros;