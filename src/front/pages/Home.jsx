import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import electronica from "../assets/img/electronica.png"
import ropa from "../assets/img/ropa.png"
import deportes from "../assets/img/deportes.png"
import casa from "../assets/img/casa.png"
import libros from "../assets/img/libros.png"
import juguetes from "../assets/img/juguetes.png"


const backendUrl = import.meta.env.VITE_BACKEND_URL;
const cloud_name = import.meta.env.CLOUD_NAME

export const Home = () => {
	const navigate = useNavigate()
	const [articulos, setArticulos] = useState([]);
	const [rating, setRating] = useState([]);


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
		const fetchRating = async () => {
			try {
				const response = await fetch(`${backendUrl}api/rating`);
				if (response.ok) {
					const data = await response.json();
					const ordenados = data
						.slice(0, 3);
					setRating(ordenados);
				}

			} catch (err) {
				console.error("Error al cargar los usuarios con mejor rating", err);
			}
		}
		fetchArticulos();
		fetchRating();
	}, []);

	const renderStars = (rating) => {
		const starsCount = Math.min(5, Math.round(rating));
		return '⭐'.repeat(starsCount);
	};

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

			<div className="containerHome mt-5 pb-0">
				<h4>Últimos Artículos</h4>
			</div>
			<div className="containerHome">

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

			<div className="pb-0 mt-5" >
				<h4 className="textoRating"> Usuarios mejores puntuados</h4>
			</div>
			<div className="containerHome2 mb-5">
				{rating.map((usuario) => (
					<motion.div
						key={usuario.usuario_id}
						className="card2"
						variants={cardVariants}
						initial="hidden"
						animate="visible"
						whileHover={{ scale: 1.03 }}
						style={styles.card2}
					>

						<div style={styles.content}>
							<div style={styles.titleContainer} className="d-flex justify-content-center">
								<h3 style={styles.title}>{usuario.nombre_de_usuario}</h3>
							</div>
							<div className="d-flex justify-content-center">
								<p style={styles.subtitle2}>
									<strong>Rating promedio:</strong> {usuario.promedio_puntuacion} {renderStars(usuario.promedio_puntuacion)}
								</p>
							</div>
						</div>

					</motion.div>
				))}
			</div>
			<div className="bg-carousel">
				<div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="carousel" style={{ maxWidth: '200px', margin: 'auto' }}>
					<div class="carousel-indicators">
						<button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
						<button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
						<button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
						<button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="3" aria-label="Slide 4"></button>
						<button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="4" aria-label="Slide 5"></button>
						<button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="5" aria-label="Slide 6"></button>
					</div>

					<div className="carousel-inner ">
						<div className="carousel-item active">
							<img
								src={electronica}
								className="d-block w-100"
								alt="Icono electrónica"
								style={{ maxHeight: '200px', objectFit: 'cover' }}
							/>
							<div className="text-center mt-2">
								<h5>Electrónica</h5>
								<p onClick={() => {
									navigate(`/articulos/electronica`);
								}} className="mb-5 categoriasHomeCarusel">Explora la sección de electrónica</p>
							</div>
						</div>

						<div className="carousel-item">
							<img
								src={ropa}
								className="d-block w-100"
								alt="Ropa"
								style={{ maxHeight: '200px', objectFit: 'cover' }}
							/>
							<div className="text-center mt-2">
								<h5>Ropa</h5>
								<p onClick={() => {
									navigate(`/articulos/ropa`);
								}} className="mb-5 categoriasHomeCarusel">Explora la sección de ropa</p>
							</div>
						</div>

						<div className="carousel-item">
							<img
								src={casa}
								className="d-block w-100"
								alt="Icono casa"
								style={{ maxHeight: '200px', objectFit: 'cover' }}
							/>
							<div className="text-center mt-2">
								<h5>Casa</h5>
								<p onClick={() => {
									navigate(`/articulos/casa`);
								}} className="mb-5 categoriasHomeCarusel">Explora la sección de casa</p>
							</div>
						</div>

						<div className="carousel-item">
							<img
								src={deportes}
								className="d-block w-100"
								alt="Icono deportes"
								style={{ maxHeight: '200px', objectFit: 'cover' }}
							/>
							<div className="text-center mt-2">
								<h5>Deportes</h5>
								<p onClick={() => {
									navigate(`/articulos/deportes`);
								}} className="mb-5 categoriasHomeCarusel">Explora la sección de deportes</p>
							</div>
						</div>

						<div className="carousel-item">
							<img
								src={libros}
								className="d-block w-100"
								alt="Icono libro"
								style={{ maxHeight: '200px', objectFit: 'cover' }}
							/>
							<div className="text-center mt-2">
								<h5>Libros</h5>
								<p onClick={() => {
									navigate(`/articulos/libros`);
								}} className="mb-5 categoriasHomeCarusel">Explora la sección de libros</p>
							</div>
						</div>
						<div className="carousel-item">
							<img
								src={juguetes}
								className="d-block w-100"
								alt="Icono juguete"
								style={{
									height: '200px',
									objectFit: 'cover',
									overflow: 'hidden'
								}}
							/>
							<div className="text-center mt-2">
								<h5>Juguetes</h5>
								<p onClick={() => {
									navigate(`/articulos/juguetes`);
								}}
									className="mb-5 categoriasHomeCarusel">Explora la sección de juguetes</p>
							</div>
						</div>
					</div>


					<button
						className="carousel-control-prev"
						type="button"
						data-bs-target="#carouselExampleCaptions"
						data-bs-slide="prev"
						style={{ left: '-40px' }}
					>
						<span className="carousel-control-prev-icon" aria-hidden="true"></span>
						<span className="visually-hidden">Anterior</span>
					</button>
					<button
						className="carousel-control-next"
						type="button"
						data-bs-target="#carouselExampleCaptions"
						data-bs-slide="next"
						style={{ right: '-40px' }}
					>
						<span className="carousel-control-next-icon" aria-hidden="true"></span>
						<span className="visually-hidden">Siguiente</span>
					</button>
				</div>
			</div>

		</motion.div>
	);
};


const baseCardStyle = {
	border: "1px solid #e0e0e0",
	borderRadius: "12px",
	boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
	overflow: "hidden",
	cursor: "pointer",
	display: "flex",
	flexDirection: "column",
	transition: "transform 0.2s ease, box-shadow 0.2s ease",
};

const styles = {
	card: {
		...baseCardStyle,
		backgroundColor: "#fff",
		color: "#000",
	},
	card2: {
		...baseCardStyle,
		backgroundColor: "#262626",
		color: "#fff",
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
	subtitle2: {
		margin: "0",
		fontSize: "0.9rem",
		color: "#fff",
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
