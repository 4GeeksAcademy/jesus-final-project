export const AyudaYSoporte = () => {
  return (
    <div className="container-fluid px-5">
      <div className="row align-items-center g-5 py-5 px-3">
        {/* Columna de texto principal (8 columnas) */}
        <div className="col-12 col-lg-8">
          <p className="lead">
            Ayuda & Soporte
          </p>
          <h1 className="display-5 fw-bold lh-1 mb-3">
            Responsive left-aligned hero with image
          </h1>
          <p className="lead">
            ¿Necesitás ayuda con tu experiencia en Truekes? Estamos acá para asistirte. Descubrí respuestas rápidas, guías útiles y soporte personalizado para sacarle el máximo provecho a la app.
          </p>
          <div className="d-grid gap-2 d-md-flex justify-content-md-start">
            <button type="button" className="btn btn-primary btn-lg px-4 me-md-2">
              Vamos a ello
            </button>

          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="contenedor-soporte">
            <div className="icono-comilla">&#8220;</div>
            <p className="texto-cita">El equipo de soporte de Truekes me respondió en minutos. ¡Así da gusto usar la app!</p>
          </div>
        </div>
      </div>
    </div>
  );
}; 