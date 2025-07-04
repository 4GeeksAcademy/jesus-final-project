import { Link, } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../assets/img/logo.png";
import { useNavigate } from "react-router";
import { useAuthMode } from "../hooks/AuthModeContext";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useState } from "react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const Navbar = () => {
	const { store, dispatch } = useGlobalReducer();
	const { mode, setMode } = useAuthMode();
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
			} else {
				Swal.fire({
					title: "Error de búsqueda",
					text: "Ocurrió un problema al buscar el artículo.",
					icon: "error",
				});
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
		<nav className="navbar navbar-light bg-light fixed-top">
			<div className="container-fluid d-flex align-items-center justify-content-start gap-3">
				<div
					className="d-flex"
					style={{ cursor: "pointer" }}
					onClick={() => {
						navigate("/");
						setCategoriaSeleccionada("");
						setBusqueda("");
					}}
				>
					<img src={logo} className="logo-NavBar ms-5" alt="Logo de Trueke" />
					<h4 className="mb-0 mt-0 d-flex align-items-center">Trueketeo</h4>
				</div>

				<form onSubmit={(e) => e.preventDefault()} className="d-flex align-items-center">
					<div className="d-flex border rounded overflow-hidden">
						<input
							type="text"
							placeholder="Buscar..."
							value={busqueda}
							onChange={(e) => setBusqueda(e.target.value)}
							className="border-0 px-3 py-2"
						/>
						<select
							value={categoriaSeleccionada}
							className="border-0 px-3 py-2 bg-light rounded-start"
							onChange={(e) => {
								const categoria = e.target.value;
								setCategoriaSeleccionada(categoria);
								if (categoria) {
									navigate(`/articulos/${categoria}`);
								}
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
						<button onClick={callBusqueda} type="submit" className="border-0 text-white px-4 py-2 rounded ms-2">
							<svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 1244 1280">
								<g transform="translate(0,1280) scale(0.1,-0.1)" fill="#000000">
									<path d="M4025 12789 ... (ICON PATH OMITTED FOR BREVITY) ..." />
								</g>
							</svg>
						</button>
					</div>
				</form>

				<div className="d-flex align-items-center links gap-5">
					<Link
						to="/sobre-nosotros"
						onClick={() => {
							setCategoriaSeleccionada("")
							setBusqueda("");
						}}
						className="text-decoration-none"
						style={{ color: "black" }}
					>
						Sobre nosotros
					</Link>
					<Link
						to="/ayuda-&-soporte"
						onClick={() => {
							setCategoriaSeleccionada("")
							setBusqueda("");
						}}
						className="text-decoration-none"
						style={{ color: "black" }}
					>
						Ayuda & soporte
					</Link>
					<Link
						to="/como-truekear"
						onClick={() => {
							setCategoriaSeleccionada("")
							setBusqueda("");
						}}
						className="text-decoration-none"
						style={{ color: "black" }}
					>
						Guía de cómo Truekear
					</Link>
				</div>

				{store.isAuthenticated ? (
					<div className=" d-flex ms-auto me-5">
						<button
							className="btn btn-light d-flex align-items-center me-1 gap-2 border rounded shadow-sm"
							onClick={() => navigate(`/datospersonales/${userId}`)}
						>
							<img
								onError={(e) => {
									e.currentTarget.src =
										"https://img.freepik.com/vector-premium/icono-perfil-usuario-estilo-plano-ilustracion-vector-avatar-miembro-sobre-fondo-aislado-concepto-negocio-signo-permiso-humano_157943-15752.jpg";
								}}
								className="rounded-circle"
								width="32"
								height="32"
								src={"CLOUDINARY"}
								alt="User profile"
							/>
							<span className="fw-semibold text-dark">Mis datos</span>
						</button>

						<button
							onClick={() => {
								Swal.fire({
									title: "Porque tan prónto?",
									text: "Asegurate que guardaste todos tus cambios",
									icon: "warning",
									showCancelButton: true,
									confirmButtonColor: "#3085d6",
									cancelButtonColor: "#d33",
									confirmButtonText: "Si, quiero irme",
									cancelButtonText: "No, me quedo",
								}).then((result) => {
									if (result.isConfirmed) {
										Swal.fire({
											title: "Has salido!",
											text: "Hasta pronto.",
											icon: "success",
										});
										dispatch({ type: "logout" });
										localStorage.removeItem("token");
										localStorage.removeItem("refresh_token");
										localStorage.removeItem("userId");
										navigate("/");
									}
								});
							}}
							className="btn btn-danger text-white ms-1"
						>
							Salir
						</button>
					</div>
				) : (
					<div className="ms-auto me-5">
						<button
							onClick={() => {
								setCategoriaSeleccionada("")
								setBusqueda("");
								navigate("/identificate");
								setMode("login");
							}}
							className="btn me-1"
						>
							<span className="borde-Navbar ps-2">Entrar</span>
						</button>
						<button
							onClick={() => {
								setCategoriaSeleccionada("")
								setBusqueda("");
								navigate("/identificate");
								setMode("registro");
							}}
							className="btn btn-primary ms-1 me-3"
						>
							Registrarse
						</button>
					</div>
				)}
			</div>
		</nav>
	);
};
