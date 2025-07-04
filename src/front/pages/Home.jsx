import React, { useEffect } from "react"
import { motion } from "framer-motion";

export const Home = () => {

	const cloud_name = import.meta.env.CLOUD_NAME


	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 1 }}
		>
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

		</motion.div>
	);
};