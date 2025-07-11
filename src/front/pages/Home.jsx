import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Importamos Link
import electronica from "../assets/img/electronica.png";
import ropa from "../assets/img/ropa.png";
import deportes from "../assets/img/deportes.png";
import casa from "../assets/img/casa.png";
import libros from "../assets/img/libros.png";
import juguetes from "../assets/img/juguetes.png";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const Home = () => {
	const navigate = useNavigate();
	const [articulos, setArticulos] = useState([]);
	const [rating, setRating] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);

				// Fetch artículos
				const articulosResponse = await fetch(`${backendUrl}api/articulos`);
				if (articulosResponse.ok) {
					const articulosData = await articulosResponse.json();
					setArticulos(
						articulosData
							.sort((a, b) => new Date(b.fecha_publicacion) - new Date(a.fecha_publicacion))
							.slice(0, 4)
					);
				}

				// Fetch ratings
				const ratingResponse = await fetch(`${backendUrl}api/rating`);
				if (ratingResponse.ok) {
					const ratingData = await ratingResponse.json();
					setRating(ratingData.slice(0, 3));
				}
			} catch (err) {
				console.error("Error al cargar datos:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const renderStars = (rating) => {
		const starsCount = Math.min(5, Math.round(rating));
		return '⭐'.repeat(starsCount);
	};

	const cardVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0 },
	};

	if (loading) {
		return (
			<div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
				<div className="spinner-border text-primary" role="status">
					<span className="visually-hidden">Cargando...</span>
				</div>
			</div>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 1 }}
		>
			{/* Hero Section */}
			<div className="row gx-0 mx-0 align-items-stretch bg-home-fondo">
				<div className="col-12 col-lg-4 p-0 bg-home"></div>
				<div className="col-12 col-lg-8 d-flex flex-column px-5 justify-content-center">
					<h1 className="display-5 lh-1 mb-3 text-white" style={{ fontSize: "3rem" }}>
						Truekes: el lugar donde tus cosas encuentran nuevo valor
					</h1>
					<p className="lead text-white">
						Intercambiá lo que ya no usás por lo que realmente necesitás. Conectá con otras personas, acordá un trueque justo y empezá a darle una segunda vida a tus objetos favoritos.
					</p>
					<div className="d-flex justify-content-center mt-4">
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className="btn btn-primary btn-lg"
							onClick={() => navigate('/publicar-articulo')}
							style={{
								backgroundColor: '#4a6bff',
								border: 'none',
								borderRadius: '8px',
								padding: '12px 24px',
								fontSize: '1.1rem',
								fontWeight: '600'
							}}
						>
							<i className="bi bi-plus-circle me-2"></i>
							Crear Publicación
						</motion.button>
					</div>
				</div>
			</div>


			{articulos.length > 0 ? (
				<>
					<div className="containerHome mt-5 pb-0">
						<h4>Últimos Artículos</h4>
					</div>
					<div className="containerHome">
						{articulos.map((articulo) => (
							<motion.div
								key={articulo.id}
								className="card"
								variants={cardVariants}
								initial="hidden"
								animate="visible"
								whileHover={{ scale: 1.03 }}
								style={styles.card}
							>
								<Link
									to={`/articulo/${articulo.id}`}
									style={{ textDecoration: 'none', color: 'inherit' }}
								>
									<img
										src={articulo.img}
										alt={articulo.titulo}
										style={styles.image}
										onError={(e) => {
											e.target.src =
												'https://via.placeholder.com/300x200?text=Imagen+no+disponible';
										}}
									/>
									<div style={styles.content}>
										<div
											style={styles.titleContainer}
											className="d-flex justify-content-center"
										>
											<h3 style={styles.title}>{articulo.titulo}</h3>
										</div>
										<div className="d-flex justify-content-center">
											<p style={styles.subtitle}>
												<strong>Estado:</strong> {articulo.estado}
											</p>
										</div>
									</div>
								</Link>
							</motion.div>
						))}
					</div>
				</>
			) : (
				<div className="containerHome mt-5 pb-0">
					<h4>Aún no hay artículos publicados</h4>
				</div>
			)}


			{rating.length > 0 ? (
				<>
					<div className="pb-0 mt-5">
						<h4 className="textoRating">Usuarios mejores puntuados</h4>
					</div>
					<div className="containerHome2 mb-5">
						{rating.map((usuario) => (
							<motion.div
								key={usuario.usuario_destino_id}
								className="card2"
								variants={cardVariants}
								initial="hidden"
								animate="visible"
								whileHover={{ scale: 1.03 }}
								style={styles.card2}
								onClick={() => navigate(`/usuario/${usuario.usuario_destino_id}`)}
							>
								<div style={styles.content}>
									<div
										style={styles.titleContainer}
										className="d-flex justify-content-center"
									>
										<h3 style={styles.title}>{usuario.nombre_de_usuario}</h3>
									</div>
									<div className="d-flex justify-content-center">
										<p style={styles.subtitle2}>
											<strong>Rating promedio:</strong> {usuario.promedio_puntuacion}{' '}
											{renderStars(usuario.promedio_puntuacion)}
										</p>
									</div>
								</div>
							</motion.div>
						))}
					</div>

				</>
			) : (
				<div className="pb-0 my-5">
					<h4 className="textoRating">Aún no hay usuarios puntuados</h4>
				</div>
			)}


			{/* Carrusel de categorías */}
			<div className="bg-carousel">
				<div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="carousel" style={{ width: '280px', margin: 'auto' }}>
					<div className="carousel-indicators">
						{[0, 1, 2, 3, 4, 5].map((index) => (
							<button
								key={index}
								type="button"
								data-bs-target="#carouselExampleCaptions"
								data-bs-slide-to={index}
								className={index === 0 ? "active" : ""}
								aria-label={`Slide ${index + 1}`}
							></button>
						))}
					</div>

					<div className="carousel-inner">
						{[
							{ img: electronica, title: "Electrónica", category: "electronica" },
							{ img: ropa, title: "Ropa", category: "ropa" },
							{ img: casa, title: "Casa", category: "casa" },
							{ img: deportes, title: "Deportes", category: "deportes" },
							{ img: libros, title: "Libros", category: "libros" },
							{ img: juguetes, title: "Juguetes", category: "juguetes" }
						].map((item, index) => (
							<div className={`carousel-item ${index === 0 ? "active" : ""}`} key={item.category}>
								<img
									src={item.img}
									className="d-block w-100"
									alt={`Icono ${item.title}`}
									style={{ maxHeight: '200px', objectFit: 'cover' }}
								/>
								<div className="text-center mt-4">
									<h4>{item.title}</h4>
									<Link
										to={`/articulos/${item.category}`}
										className="mb-5 categoriasHomeCarusel"
										style={{ display: 'block', cursor: 'pointer', color: 'inherit', textDecoration: 'none' }}
									>
										Explora la sección de {item.title.toLowerCase()}
									</Link>
								</div>
							</div>
						))}
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

// Estilos (se mantienen igual)
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
};