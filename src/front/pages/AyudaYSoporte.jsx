import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { useState } from "react";

export const AyudaYSoporte = () => {
  const navigate = useNavigate();



  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="container-fluid d-flex justify-content-center">
        <div className="d-flex align-items-center p-5">
          <div className="w-100">
            <div className="mb-4 fs-3 fw-bold">
              Ayuda y Soporte en Trueketeo
            </div>
            <div className="card-body p-0">
              <h1
                className="card-title display-5 lh-1 mb-4"
                style={{ fontSize: "3rem" }}
              >
                Siempre disponibles para ayudarte
              </h1>
              <p className="card-text text-secondary fs-5 mb-3">
                Nuestro equipo de soporte está listo para responder tus dudas en tiempo récord.
              </p>
              <p className="card-text text-secondary fs-5 mb-3">
                Ya sea un problema técnico o una pregunta sobre cómo intercambiar, estamos aquí para ti.
              </p>
              <p className="card-text text-secondary fs-5 mb-3">
                Contáctanos desde la app o el sitio web y recibe ayuda personalizada.
              </p>
              <p className="card-text text-secondary fs-5">
                Rápido, confiable y cercano. Porque tu experiencia nos importa.
              </p>
            </div>
          </div>
        </div>
      </div>


      <div className="row gx-0 mx-0 align-items-stretch bg-ayuda-fondo">
        <div className="col-12 col-lg-4 p-0 bg-ayudaysoporte"></div>
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
              Llevame a contacto
            </button>
          </div>
        </div>
      </div>

      <div className="container-fluid px-5">


        <section
          className="my-5 px-4"
          style={{ maxWidth: "1300px", margin: "auto", fontSize: "1.2rem" }}
        >
          <h2 className="fw-bold mb-5 text-center">¿Necesitás ayuda? Seguinos estos pasos</h2>

          <div className="row">
            <div className="col-12 col-md-6 mb-4">
              <h4 className="fw-bold mb-3">Cómo contactarnos</h4>
              <p className="fw-bold mb-2">1. Enviá un mail a soporte@trueketeo.com</p>
              <p className="mb-3">
                Describí tu consulta o problema con la mayor cantidad de detalles posible para que podamos ayudarte rápido.
              </p>

              <p className="fw-bold mb-2">2. Revisá tu correo para nuestras respuestas</p>
              <p className="mb-3">
                Nuestro equipo te responderá por mail dentro de las 24-48 horas hábiles.
              </p>

              <p className="fw-bold mb-2">3. Seguimos en contacto</p>
              <p className="mb-3">
                Si necesitás más asistencia, respondé nuestro mail o escribinos nuevamente.
              </p>

              <p className="fw-bold mb-2">4. ¡Problema resuelto!</p>
              <p>
                Queremos que disfrutes al máximo la experiencia Trueketeo, por eso estamos acá para ayudarte.
              </p>
            </div>

            <div className="col-12 col-md-6 mb-4">
              <h4 className="fw-bold mb-3">Consejos para una atención rápida</h4>
              <p className="mb-3">
                1. Incluí capturas de pantalla o fotos si el problema es visual o técnico.
              </p>
              <p className="mb-3">
                2. Detallá los pasos que hiciste antes de que surgiera el inconveniente.
              </p>
              <p className="mb-3">
                3. Mantené la información de tu cuenta y contacto actualizada para agilizar la ayuda.
              </p>
              <p className="mb-3">
                4. Sé claro y cortés en tu comunicación para que podamos brindarte el mejor soporte posible.
              </p>
            </div>
          </div>
        </section>


      </div >
    </motion.div >
  );
};