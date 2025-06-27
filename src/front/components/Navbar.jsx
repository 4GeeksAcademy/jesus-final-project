import { Link } from "react-router-dom";
import logo from "../assets/img/logo.png";
export const Navbar = () => {

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container-fluid d-flex align-items-center justify-content-start gap-3">
				<img src={logo} className="logo-NavBar ms-5" alt="Logo de Trueke" />
				<h4 className="mb-0 mt-0 d-flex align-items-center" >
					Trueketeo
				</h4>
				<form onSubmit="" className="d-flex align-items-center">
					<div className="d-flex border rounded overflow-hidden">
						<input
							type="text"
							placeholder="Buscar..."
							className="border-0 px-3 py-2"
						/>
						<select className="border-0 px-3 py-2 bg-light rounded-start">
							<option value="">Categorías</option>
							<option value="ropa">Electronica</option>
							<option value="electro">Ropa</option>
							<option value="juguetes">Hogar</option>
							<option value="juguetes">Deportes</option>
							<option value="juguetes">Libros</option>
							<option value="juguetes">Jueguetes</option>
							<option value="juguetes">Otros</option>
						</select>
						<button type="submit" className=" border-0 text-white px-4 py-2 rounded ms-2">
							<svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 1244 1280" preserveAspectRatio="xMidYMid meet">
								<g transform="translate(0,1280) scale(0.1,-0.1)" fill="#000000" stroke="none">
									<path d="M4025 12789 c-1029 -79 -1969 -501 -2704 -1214 -985 -955 -1456 -2292 -1285 -3650 156 -1244 849 -2360 1899 -3059 193 -129 272 -175 470 -274 452 -227 906 -362 1445 -429 207 -25 763 -25 970 0 404 50 752 138 1115 281 251 98 600 283 819 433 l80 54 1075 -1073 c3835 -3827 3770 -3762 3828 -3795 189 -105 411 -75 563 77 148 148 180 359 84 553 -21 43 -462 488 -2432 2459 -2212 2213 -2404 2408 -2392 2425 8 10 40 47 70 83 714 836 1088 1927 1031 3011 -32 610 -165 1136 -420 1664 -169 349 -340 615 -592 920 -106 128 -395 417 -524 524 -687 569 -1463 900 -2336 996 -174 19 -598 27 -764 14z m780 -949 c777 -118 1453 -463 1982 -1014 516 -536 829 -1194 930 -1951 24 -186 24 -618 0 -810 -54 -416 -158 -758 -342 -1125 -297 -593 -779 -1101 -1360 -1432 -964 -549 -2153 -590 -3152 -108 -975 470 -1667 1364 -1873 2420 -37 192 -51 323 -57 555 -6 258 4 423 42 651 161 971 742 1831 1588 2348 453 278 935 434 1512 490 22 2 164 3 315 1 217 -3 304 -8 415 -25z" />
								</g>
							</svg>
						</button>
					</div>
				</form>
				<div className="d-flex align-items-center links gap-5">
					<Link href="/sobre-nosotros" className="text-decoration-none" style={{ color: 'black' }}>
						Sobre nosotros
					</Link>
					<Link href="/ayuda" className="text-decoration-none" style={{ color: 'black' }}>
						Ayuda & soporte
					</Link>
					<Link href="/guia-truekear" className="text-decoration-none" style={{ color: 'black' }}>
						Guía de cómo Truekear
					</Link>
				</div>
				<div className="ms-auto me-5">
					<button className="btn btn-primary me-3">
						Registrarse
					</button>
				</div>

			</div>

		</nav>
	);
};