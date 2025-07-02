import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/img/logo.png";


export const Footer = () => {
	const navigate = useNavigate();

	const styles = {
		footer: {
			backgroundColor: "#d1e2eb",
			padding: "2rem 0",
			fontFamily: "Arial, sans-serif",
			width: "100%",
		},
		footerContent: {
			display: "flex",
			justifyContent: "space-around",
			alignItems: "flex-start",
			maxWidth: "1200px",
			margin: "0 auto",
			padding: "0 20px",
			flexWrap: "wrap",
		},
		footerSection: {
			margin: "1rem",
			flex: 1,
			minWidth: "200px",
		},
		logoSection: {
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
		},
		footerLogo: {
			maxWidth: "120px",
			height: "auto",
			cursor: "pointer",
			transition: "transform 0.3s",
		},
		footerTitle: {
			color: "#333",
			fontSize: "1.2rem",
			marginBottom: "1rem",
			borderBottom: "2px solid #4a90e2",
			paddingBottom: "5px",
			display: "inline-block",
		},
		footerLinks: {
			listStyle: "none",
			padding: 0,
		},
		footerLinkItem: {
			margin: "0.8rem 0",
		},
		footerLink: {
			color: "#555",
			textDecoration: "none",
			cursor: "pointer",
			transition: "color 0.3s, padding-left 0.3s",
			display: "block",
		},
		footerBottom: {
			textAlign: "center",
			marginTop: "2rem",
			paddingTop: "1rem",
			borderTop: "1px solid #b3cde0",
			color: "#666",
			fontSize: "0.9rem",
		},
		hoverEffect: {
			color: "#4a90e2",
			paddingLeft: "5px",
		},
	};

	//manejo del hover
	const [hoverStates, setHoverStates] = React.useState({});

	const handleMouseEnter = (linkName) => {
		setHoverStates({ ...hoverStates, [linkName]: true });
	};

	const handleMouseLeave = (linkName) => {
		setHoverStates({ ...hoverStates, [linkName]: false });
	};

	//manejo navegación
	const handleNavigation = (path) => {
		navigate(path);
	};

	return (

		<footer style={styles.footer}>
			<div style={styles.footerContent}>

				{/* logo sección*/}
				<div style={{ ...styles.footerSection, ...styles.logoSection }}>
					<img
						src={logo}
						alt="Logo de Trueke"
						style={styles.footerLogo}
						onClick={() => handleNavigation("/")}
						onMouseEnter={() => handleMouseEnter('logo')}
						onMouseLeave={() => handleMouseLeave('logo')} />
				</div>

				{/* columna 1*/}
				<div style={styles.footerSection}>
					<h3 style={styles.footerTitle}>Compañía</h3>
					<ul style={styles.footerLinks}>
						<li style={styles.footerLinkItem}>
							<span style={{
								...styles.footerLink,
								...(hoverStates.sobreNosotros && styles.hoverEffect)
							}}
								onClick={() => handleNavigation("/sobre-nosotros")}
								onMouseEnter={() => handleMouseEnter('sobreNosotros')}
								onMouseLeave={() => handleMouseLeave('sobreNosotros')}>
								Sobre Nosotros
							</span>
						</li>
						<li style={styles.footerLinkItem}>
							<span style={{
								...styles.footerLink,
								...(hoverStates.trueketeo && styles.hoverEffect)
							}}
								onClick={() => handleNavigation("/trueketeo")}
								onMouseEnter={() => handleMouseEnter('trueketeo')}
								onMouseLeave={() => handleMouseLeave('trueketeo')}>
								Trueketeo
							</span>
						</li>
						<li style={styles.footerLinkItem}>
							<span style={{
								...styles.footerLink,
								...(hoverStates.contacto && styles.hoverEffect)
							}}
								onClick={() => handleNavigation("/contacto")}
								onMouseEnter={() => handleMouseEnter('contacto')}
								onMouseLeave={() => handleMouseLeave('contacto')}>
								Contacto
							</span>
						</li>
					</ul>
				</div>

				{/* columna 2*/}
				<div style={styles.footerSection}>
					<h3 style={styles.footerTitle}>Trueketeo</h3>
					<ul style={styles.footerLinks}>
						<li style={styles.footerLinkItem}>
							<span style={{
								...styles.footerLink,
								...(hoverStates.intercambiar && styles.hoverEffect)
							}}
								onClick={() => handleNavigation("/intercambiar-articulos")}
								onMouseEnter={() => handleMouseEnter('intercambiar')}
								onMouseLeave={() => handleMouseLeave('intercambiar')}>
								Intercambiar artículos
							</span>
						</li>
						<li style={styles.footerLinkItem}>
							<span style={{
								...styles.footerLink,
								...(hoverStates.acordar && styles.hoverEffect)
							}}
								onClick={() => handleNavigation("/acordar-responsable")}
								onMouseEnter={() => handleMouseEnter('acordar')}
								onMouseLeave={() => handleMouseLeave('acordar')}>
								Acordar con el responsable del trueke
							</span>
						</li>
						<li style={styles.footerLinkItem}>
							<span style={{
								...styles.footerLink,
								...(hoverStates.condiciones && styles.hoverEffect)
							}}
								onClick={() => handleNavigation("/condiciones-devolucion")}
								onMouseEnter={() => handleMouseEnter('condiciones')}
								onMouseLeave={() => handleMouseLeave('condiciones')}>
								Condiciones de devolución
							</span>
						</li>
					</ul>
				</div>
			</div>
		</footer>
	)
};
