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
			<div className="text-center mt-5">
				<h1 className="display-4">Hello Rigo!!</h1>
				<p className="lead">
					<img src="" className="img-fluid rounded-circle mb-3" alt="Rigo Baby" />
				</p>
				<div className="alert alert-info"></div>
			</div>
		</motion.div>
	);
};