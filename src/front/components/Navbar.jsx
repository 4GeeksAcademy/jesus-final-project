import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../assets/img/logo.png";
import { useNavigate } from "react-router";
import { useAuthMode } from "../hooks/AuthModeContext";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useState } from "react";
import { motion } from "framer-motion";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const Navbar = () => {
	const { store, dispatch } = useGlobalReducer();
	const { setMode } = useAuthMode();
	const navigate = useNavigate();
	const userId = store.userId;
	const [busqueda, setBusqueda] = useState("");
	const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");

	const callBusqueda = async () => {
		try {
			const response = await fetch(`${backendUrl}api/busqueda-articulos?query=${encodeURIComponent(busqueda)}`);
			if (response.ok) {
				const data = await response.json();
				if (data.length > 0) {
					setBusqueda("");
					navigate(`articulo/${data[0].id}`);
				} else {
					Swal.fire({
						title: "Sin resultados",
						text: "No se encontraron artículos con ese nombre.",
						icon: "info",
					});
				}
			}
		} catch (err) {
			Swal.fire({
				title: "Error de red",
				text: err.message,
				icon: "error",
			});
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 1 }}
		>
			<nav className="navbar navbar-light bg-light fixed-top py-2">
				<div className="container-fluid d-flex align-items-center flex-nowrap">
					{/* Logo y marca */}
					<div className="d-flex align-items-center me-3" style={{ minWidth: "180px" }}>
						<img
							src={logo}
							className="logo-NavBar"
							alt="Logo"
							style={{ height: "40px", cursor: "pointer" }}
							onClick={() => {
								navigate("/");
								setCategoriaSeleccionada("");
								setBusqueda("");
							}}
						/>
						<h4 className="mb-0 ms-2 d-none d-lg-block">Trueketeo</h4>
					</div>

					{/* Links centrales - Movidos a la izquierda */}
					<div className="d-flex align-items-center me-auto ms-3">
						<Link
							to="/sobre-nosotros"
							className="text-decoration-none text-dark mx-3"
							onClick={() => {
								setCategoriaSeleccionada("");
								setBusqueda("");
							}}
						>
							Sobre nosotros
						</Link>
						<Link
							to="/ayuda-&-soporte"
							className="text-decoration-none text-dark mx-3"
							onClick={() => {
								setCategoriaSeleccionada("");
								setBusqueda("");
							}}
						>
							Ayuda & soporte
						</Link>
						<Link
							to="/como-truekear"
							className="text-decoration-none text-dark mx-3"
							onClick={() => {
								setCategoriaSeleccionada("");
								setBusqueda("");
							}}
						>
							Guía de cómo Truekear
						</Link>
					</div>

					{/* Búsqueda y categorías */}
					<div className="d-flex mx-3" style={{ width: "400px" }}>
						<div className="input-group">
							<input
								type="text"
								placeholder="Buscar..."
								value={busqueda}
								onChange={(e) => setBusqueda(e.target.value)}
								className="form-control"
							/>
							<select
								value={categoriaSeleccionada}
								className="form-select"
								style={{ width: "120px" }}
								onChange={(e) => {
									const categoria = e.target.value;
									setCategoriaSeleccionada(categoria);
									if (categoria) navigate(`/articulos/${categoria}`);
								}}
							>
								<option value="">Categorías</option>
								<option value="electronica">Electrónica</option>
								<option value="ropa">Ropa</option>
								<option value="hogar">Hogar</option>
								<option value="deportes">Deportes</option>
								<option value="libros">Libros</option>
								<option value="juguetes">Juguetes</option>
							</select>
							<button
								onClick={callBusqueda}
								className="btn btn-outline-secondary"
								type="button"
							>
								<i className="bi bi-search"></i>
							</button>
						</div>
					</div>

					{/* Botones de usuario */}
					<div className="d-flex align-items-center flex-nowrap ms-auto">
						{store.isAuthenticated ? (
							<>
								<button
									onClick={() => navigate(`/favoritos/${userId}`)}
									className="btn btn-light d-flex align-items-center mx-1 border rounded shadow-sm"
									style={{ color: "red" }}
								>
									<span className="fw-semibold">&#x2665;&#xfe0f;</span>
								</button>
								<button
									onClick={() => navigate(`/truekes/${userId}`)}
									className="btn btn-light d-flex align-items-center mx-1 border rounded shadow-sm"
								>
									<span className="fw-semibold text-dark">Mis truekes</span>
								</button>
								<button
									onClick={() => navigate(`/mis-publicaciones/${userId}`)}
									className="btn btn-light d-flex align-items-center mx-1 border rounded shadow-sm"
								>
									<span className="fw-semibold text-dark">Mis publicaciones</span>
								</button>
								<button
									onClick={() => navigate(`/datospersonales/${userId}`)}
									className="btn btn-light d-flex align-items-center mx-1 border rounded shadow-sm"
								>
									<span className="fw-semibold text-dark">Mis datos</span>
								</button>
								<button
									onClick={() => {
										Swal.fire({
											title: "¿Salir?",
											text: "¿Estás seguro de que quieres cerrar sesión?",
											icon: "warning",
											showCancelButton: true,
											confirmButtonText: "Sí, salir",
											cancelButtonText: "Cancelar",
										}).then((result) => {
											if (result.isConfirmed) {
												dispatch({ type: "logout" });
												localStorage.removeItem("token");
												localStorage.removeItem("refresh_token");
												localStorage.removeItem("userId");
												navigate("/");
											}
										});
									}}
									className="btn btn-danger text-white ms-2"
								>
									Salir
								</button>
							</>
						) : (
							<>
								<button
									onClick={() => {
										navigate("/identificate");
										setMode("login");
									}}
									className="btn me-1 no-hover"
								>
									<span className="borde-Navbar ps-2">Entrar</span>
								</button>
								<button
									onClick={() => {
										navigate("/identificate");
										setMode("registro");
									}}
									className="btn btn-primary ms-1"
								>
									Registrarse
								</button>
							</>
						)}
					</div>
				</div>
			</nav>
		</motion.div>
	);
};