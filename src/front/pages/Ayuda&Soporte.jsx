import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const AyudaYSoporte = () => {
  const navigate = useNavigate();

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
      </div>
    </motion.div>
  );
};
