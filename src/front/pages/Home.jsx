import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const Home = () => {
	const navigate = useNavigate()
	const [articulos, setArticulos] = useState([]);

	const cloud_name = import.meta.env.CLOUD_NAME

	useEffect(() => {
		const fetchArticulos = async () => {
			try {
				const response = await fetch(`${backendUrl}api/articulos`);
				if (response.ok) {
					const data = await response.json();
					const ordenados = data
						.sort((a, b) => new Date(b.fecha_publicacion) - new Date(a.fecha_publicacion))
						.slice(0, 4);
					setArticulos(ordenados);
				}
			} catch (err) {
				console.error("Error al cargar artículos por categoría", err);
			}
		};

		fetchArticulos();
	}, []);

	const cardVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0 },
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 1 }}
		>
			<div className="row gx-0 mx-0 align-items-stretch bg-home-fondo">
				<div className="col-12 col-lg-4 p-0 bg-home"></div>
				<div className="col-12 col-lg-8 d-flex flex-column  px-5 justify-content-center">
					<h1 className="display-5 lh-1 mb-3 text-white" style={{ fontSize: "3rem" }}>
						Truekes: el lugar donde tus cosas encuentran nuevo valor
					</h1>
					<p className="lead  text-white">
						Intercambiá lo que ya no usás por lo que realmente necesitás. Conectá con otras personas, acordá un trueque justo y empezá a darle una segunda vida a tus objetos favoritos.
					</p>

				</div>
			</div>

			<div style={styles.container}>
				{(
					articulos.map((articulo) => (
						<motion.div
							key={articulo.id}
							className="card"
							variants={cardVariants}
							initial="hidden"
							animate="visible"
							whileHover={{ scale: 1.03 }}
							style={styles.card}
						>
							<img src={articulo.img} alt={articulo.titulo} style={styles.image} />
							<div style={styles.content}>
								<div style={styles.titleContainer} className="d-flex justify-content-center">
									<h3 style={styles.title}>{articulo.titulo}</h3>

								</div>

								<div className="d-flex justify-content-center">
									<p style={styles.subtitle}>
										<strong>Estado:</strong> {articulo.estado}
									</p>
								</div>
								<span
									style={styles.box}
									onClick={() => {
										navigate(`/articulo/${articulo.id}`);
									}}
									className="ms-auto"
								>
									<i className="bi bi-box2-heart"></i>
								</span>




							</div>
						</motion.div>
					))

				)}
			</div>

			<div style={styles.container}>
				{(
					articulos.map((articulo) => (
						<motion.div
							key={articulo.id}
							className="card"
							variants={cardVariants}
							initial="hidden"
							animate="visible"
							whileHover={{ scale: 1.03 }}
							style={styles.card}
						>
							<img src={articulo.img} alt={articulo.titulo} style={styles.image} />
							<div style={styles.content}>
								<div style={styles.titleContainer} className="d-flex justify-content-center">
									<h3 style={styles.title}>{articulo.titulo}</h3>

								</div>

								<div className="d-flex justify-content-center">
									<p style={styles.subtitle}>
										<strong>Estado:</strong> {articulo.estado}
									</p>
								</div>
								<span
									style={styles.box}
									onClick={() => {
										navigate(`/articulo/${articulo.id}`);
									}}
									className="ms-auto"
								>
									<i className="bi bi-box2-heart"></i>
								</span>




							</div>
						</motion.div>
					))

				)}
			</div>

		</motion.div>
	);
};


const styles = {
	container: {
		display: "grid",
		gridTemplateColumns: "repeat(4, 1fr)",
		gap: "24px",
		padding: "40px 20px",
		maxWidth: "1500px",
		margin: "0 auto",
	},
	card: {
		backgroundColor: "#fff",
		border: "1px solid #e0e0e0",
		borderRadius: "12px",
		boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
		overflow: "hidden",
		cursor: "pointer",
		display: "flex",
		flexDirection: "column",
		transition: "transform 0.2s ease, box-shadow 0.2s ease",
	},
	image: {
		width: "100%",
		height: "280px",
		objectFit: "cover",
	},
	content: {
		padding: "16px",
		display: "flex",
		flexDirection: "column",
		gap: "6px",
	},
	titleContainer: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
	},
	title: {
		margin: "0",
		fontSize: "1.1rem",
		fontWeight: "600",
	},
	heart: {
		color: "red",
		fontSize: "1.2rem",
		cursor: "pointer",
		userSelect: "none",
	},
	box: {
		color: "black",
		fontSize: "1.2rem",
		cursor: "pointer",
		userSelect: "none",
	},
	subtitle: {
		margin: "0",
		fontSize: "0.9rem",
		color: "#444",
	},
	caracteristicas: {
		maxHeight: "60px",
		overflowY: "auto",
		fontSize: "0.8rem",
		color: "#333",
		backgroundColor: "#f9f9f9",
		padding: "8px",
		borderRadius: "6px",
		marginTop: "8px",
		border: "1px solid #eee",
	},
};
