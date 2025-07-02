import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import pasouno from "../assets/img/pasouno.png"
import pasodos from "../assets/img/pasodos.png"
import pasotres from "../assets/img/pasotres.png"
import pasocuatro from "../assets/img/pasocuatro.png"
import { useState } from "react";

export const ComoTruekear = () => {
  const navigate = useNavigate();

  const [oks, setOks] = useState([false, false, false, false]);


  const toggleOk = (index) => {
    setOks(prev => {
      const newOks = [...prev];
      newOks[index] = !newOks[index];
      return newOks;
    });
  };

  const allTrue = oks.every(Boolean);

  const cardsData = [
    {
      img: pasouno,
      title: "Paso 1",
      subtitle: "Elegí el artículo",
      text: "Revisá las ofertas disponibles o publicá lo que querés dar a cambio. Así podés ver qué quieren ofrecerte y decidir qué trueke te interesa.",
    },
    {
      img: pasodos,
      title: "Paso 2",
      subtitle: "Confirmá el trueke",
      text: "Coordiná una fecha para el intercambio y confirmá con la otra persona. Esto asegura que ambos estén listos para hacer el trueke.",
    },
    {
      img: pasotres,
      title: "Paso 3",
      subtitle: "Acordá detalles y lugar",
      text: "Acordá por mensajería el lugar (recomendamos uno público y seguro, como una plaza) y la hora del intercambio para garantizar la seguridad de ambos.",
    },
    {
      img: pasocuatro,
      title: "Paso 4",
      subtitle: "Dejá tu reseña",
      text: "Dejando un comentario y una reseña ayudás a mejorar la comunidad y el sistema de puntos, fomentando la confianza para futuros truekes.",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 col-lg-8">
            <div className="d-flex align-items-center p-5 ">
              <div className="w-100 ">
                <div className="mb-4 fs-3 fw-bold ">
                  Llega a conocer Trueketeo
                </div>
                <div className="card-body p-0">
                  <h1
                    className="card-title display-5 lh-1 mb-4"
                    style={{ fontSize: "3rem" }}
                  >
                    Proviendo la mejor experiencia para tu trueke online
                  </h1>
                  <p className="card-text text-secondary fs-5 mb-3">
                    En Trueka no compras ni vendes: intercambias.
                  </p>
                  <p className="card-text text-secondary fs-5 mb-3">
                    Somos la app donde puedes prestar y pedir objetos por un
                    tiempo.
                  </p>
                  <p className="card-text text-secondary fs-5 mb-3">
                    Desde una bici hasta una cámara, comparte lo que tienes y usa
                    lo que necesitas.
                  </p>
                  <p className="card-text text-secondary fs-5">
                    Fácil, temporal y entre personas de confianza.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-4">
            <div className="contenedor-soporte">
              <div className="icono-comilla">&#8220;</div>
              <p className="texto-cita">
                El equipo de soporte de Truekes me respondió en minutos. ¡Así da
                gusto usar la app!
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row gx-0 mx-0 align-items-stretch bg-ayuda-fondo">
        <div className="col-12 col-lg-8 d-flex flex-column  px-5 justify-content-center">
          <p className="lead fw-bold">Ayuda & Soporte</p>
          <h1 className="display-5 lh-1 mb-3" style={{ fontSize: "3rem" }}>
            Soporte rápido y confiable para que disfrutes Truekes al máximo
          </h1>
          <p className="lead">
            ¿Tenés dudas o necesitás ayuda? Nuestro equipo está listo para
            asistirte con soluciones rápidas, guías claras y soporte personalizado.
          </p>
          <div className="d-grid gap-2 d-md-flex justify-content-md-start">
            <button
              onClick={() => {
                navigate("/Contacto");
              }}
              type="button"
              className="btn btn-primary btn-lg px-4 me-md-2"
            >
              Vamos a ello
            </button>
          </div>
        </div>

        <div className="col-12 col-lg-4 p-0 bg-ayudaysoporte"></div>
      </div>

      <div className="container-fluid px-5">
        <section
          className="my-5 px-4"
          style={{ maxWidth: "1300px", margin: "auto", fontSize: "1.2rem" }}
        >
          <h2 className="fw-bold mb-5 text-center">Guía para un trueke exitoso</h2>

          <div className="row">
            <div className="col-12 col-md-6 mb-4">
              <h4 className="fw-bold mb-3">Cómo acordar con la otra persona</h4>
              <p className="fw-bold mb-2">1. Contactate por mensajería o mail.</p>
              <p className="mb-3">
                Escribí un mensaje amable para presentarte y proponer el
                intercambio. Aclará qué objeto querés truekear y preguntá
                disponibilidad.
              </p>

              <p className="fw-bold mb-2">2. Acordá un lugar y horario para encontrarse.</p>
              <p className="mb-3">
                Proponé un lugar seguro y cómodo, como una plaza o cafetería.
                Confirmá la hora que mejor les quede.
              </p>

              <p className="fw-bold mb-2">3. Confirmá el encuentro un día antes.</p>
              <p className="mb-3">
                Un mensaje rápido para reconfirmar evita malentendidos y asegura
                que ambos estarán presentes.
              </p>

              <p className="fw-bold mb-2">4. ¡Disfrutá tu trueke!</p>
              <p>
                Revisen el objeto, hagan el intercambio y disfruten esta
                experiencia colaborativa.
              </p>
            </div>

            <div className="col-12 col-md-6 mb-4">
              <h4 className="fw-bold mb-3">Buenas Prácticas</h4>
              <p className="mb-3">
                1. Consultá y aclará siempre el tiempo de préstamo o intercambio
                antes de acordar.
              </p>
              <p className="mb-3">
                2. Acordá las condiciones de devolución: fecha, estado del
                objeto y forma de entrega.
              </p>
              <p className="mb-3">
                3. Comunicalo con anticipación si surge algún inconveniente para
                evitar malentendidos.
              </p>
              <p className="mb-3">
                4 .Sé amable, puntual y respetuoso. Una comunicación clara genera
                confianza y mejora la experiencia para todos.
              </p>
            </div>
          </div>
        </section>
        <div className="d-flex justify-content-center">  <h2 className="fw-bold mb-5 text-center">Truekeando en 4 pasos</h2></div>
        <section className="my-5 d-flex justify-content-center">

          <div className="row g-4">
            {cardsData.map(({ img, title, subtitle, text }, i) => (
              <div key={i} className="col-12 col-md-6 col-xxl-3">
                <div className="card shadow-sm" style={{ width: "20rem", height: "21rem" }}>
                  <div className="d-flex justify-content-center pt-3">
                    <img src={img} alt={`Icono ${title}`} style={{ width: "55px", height: "55px" }} />
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title text-center">{title}</h5>
                    <h6 className="card-subtitle mb-2 text-muted text-center">{subtitle}</h6>
                    <p className="card-text">{text}</p>
                    {oks[i] ? (
                      <button
                        className="btn btn-success w-100 mt-auto"
                        onClick={() => toggleOk(i)}
                      >
                        ✓
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary w-100 mt-auto"
                        onClick={() => toggleOk(i)}
                      >
                        OK
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        {allTrue && (
          <div className="alert alert-success text-center mt-4" role="alert">
            ¡Felicitaciones! Y ahora... a truekear. 🚀
          </div>
        )}

      </div >
    </motion.div >
  );
};