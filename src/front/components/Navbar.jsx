import { Link } from "react-router-dom";
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
	const [busqueda, setBusqueda] = useState("")

	const callBusqueda = async () => {
		try {
			const response = await fetch(`${backendUrl}api/busqueda-articulos?query=${encodeURIComponent(busqueda)}`); // EncodeURIComponent --> le saca los espcios o simbolos

			if (response.ok) {
				const data = await response.json();
				if (data.length > 0) {
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
		<nav className="navbar navbar-light bg-light">
			<div className="container-fluid d-flex align-items-center justify-content-start gap-3">
				<div className="d-flex" style={{ cursor: "pointer" }} onClick={() => {
					navigate("/")
				}}>
					<img src={logo} className="logo-NavBar ms-5" alt="Logo de Trueke" />
					<h4 className="mb-0 mt-0 d-flex align-items-center">Trueketeo</h4>
				</div>

				<form onSubmit={(e) => e.preventDefault()} className="d-flex align-items-center">
					<div className="d-flex border rounded overflow-hidden">
						<input type="text" placeholder="Buscar..." onChange={(e) => {
							setBusqueda(e.target.value)
						}} className="border-0 px-3 py-2" />
						<select
							className="border-0 px-3 py-2 bg-light rounded-start"
							onChange={(e) => {
								const categoria = e.target.value;
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

							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="18px"
								height="18px"
								viewBox="0 0 1244 1280"
								preserveAspectRatio="xMidYMid meet"
							>
								<g transform="translate(0,1280) scale(0.1,-0.1)" fill="#000000" stroke="none">
									<path d="M4025 12789 c-1029 -79 -1969 -501 -2704 -1214 -985 -955 -1456 -2292 -1285 -3650 156 -1244 849 -2360 1899 -3059 193 -129 272 -175 470 -274 452 -227 906 -362 1445 -429 207 -25 763 -25 970 0 404 50 752 138 1115 281 251 98 600 283 819 433 l80 54 1075 -1073 c3835 -3827 3770 -3762 3828 -3795 189 -105 411 -75 563 77 148 148 180 359 84 553 -21 43 -462 488 -2432 2459 -2212 2213 -2404 2408 -2392 2425 8 10 40 47 70 83 714 836 1088 1927 1031 3011 -32 610 -165 1136 -420 1664 -169 349 -340 615 -592 920 -106 128 -395 417 -524 524 -687 569 -1463 900 -2336 996 -174 19 -598 27 -764 14z m780 -949 c777 -118 1453 -463 1982 -1014 516 -536 829 -1194 930 -1951 24 -186 24 -618 0 -810 -54 -416 -158 -758 -342 -1125 -297 -593 -779 -1101 -1360 -1432 -964 -549 -2153 -590 -3152 -108 -975 470 -1667 1364 -1873 2420 -37 192 -51 323 -57 555 -6 258 4 423 42 651 161 971 742 1831 1588 2348 453 278 935 434 1512 490 22 2 164 3 315 1 217 -3 304 -8 415 -25z" />
								</g>
							</svg>
						</button>
					</div>
				</form>


				<div className="d-flex align-items-center links gap-5">
					<Link to="/sobre-nosotros" className="text-decoration-none" style={{ color: "black" }}>
						Sobre nosotros
					</Link>
					<Link to="/ayuda-&-soporte" className="text-decoration-none" style={{ color: "black" }}>
						Ayuda & soporte
					</Link>
					<Link to="/guia-truekear" className="text-decoration-none" style={{ color: "black" }}>
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
										"https://img.freepik.com/vector-premium/icono-perfil-usuario-estilo-plano-ilustracion-vector-avatar-miembro-sobre-fondo-aislado-concepto-negocio-signo-permiso-humano_157943-15752.jpg"
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
								navigate("/identificate");
								setMode("login");
							}}
							className="btn me-1"
						>
							<span className="borde-Navbar ps-2">Entrar</span>
						</button>
						<button
							onClick={() => {
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
