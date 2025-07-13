import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { DatosPersonales } from "./pages/DatosPersonales";
import { Articulo } from "./pages/Articulo";
import { LoginRegistro } from "./pages/LoginRegistro";
import { CambiarContraseña } from "./pages/CambiarContraseña";
import { PublicarArticulo } from "./pages/PublicarArticulo";
import { Truekes } from "./pages/Truekes";
import { TruekeDetalle } from "./pages/TruekeDetalle";
import { ArticulosXCategoria } from "./pages/ArticulosXCategorias";
import SobreNosotros from "./pages/sobreNosotros";
import Contacto from "./pages/Contacto"
import { AyudaYSoporte } from "./pages/AyudaYSoporte"
import PoliticaPrivacidad from "./pages/PoliticaPrivacidad";
import { ComoTruekear } from "./pages/ComoTruekear";
import { MisPublicaciones } from "./pages/MisPublicaciones";
import { Favoritos } from "./pages/Favoritos";
import { ProtectedRoute } from "./components/ProtectedRoute"; // Añadir esta línea
import { DatosUsuario } from "./pages/DatosUsuario";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >
      
      {/* RUTAS PÚBLICAS (sin autenticación) */}
      <Route path="/" element={<Home />} />
      <Route path="/single/:theId" element={<Single />} />  {/* Dynamic route for single items */}
      <Route path="/usuario/:usuarioId" element={<DatosUsuario />} />
      <Route path="/identificate" element={<LoginRegistro />} />
      <Route path="/recuperar-contrasena/:codigoUUID" element={<CambiarContraseña />} />
      <Route path="/articulos/:categorias" element={<ArticulosXCategoria />} />
      <Route path="/articulo/:id" element={<Articulo />} />
      <Route path="/como-truekear" element={<ComoTruekear />} />
      <Route path="/ayuda-&-soporte" element={<AyudaYSoporte />} />
      <Route path="/sobre-nosotros" element={<SobreNosotros />} />
      <Route path="/Contacto" element={<Contacto />} />
      <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />

      {/* RUTAS PROTEGIDAS (requieren autenticación) */}
      <Route path="/truekes/historial/:usuarioId" element={<ProtectedRoute><Truekes /></ProtectedRoute>} />
      <Route path="/datospersonales/:usuarioId" element={<ProtectedRoute><DatosPersonales /></ProtectedRoute>} />
      <Route path="/publicar-articulo" element={<ProtectedRoute><PublicarArticulo /></ProtectedRoute>} />
      <Route path="/trueke-detalle/:truekeId" element={<ProtectedRoute><TruekeDetalle /></ProtectedRoute>} />
      <Route path="/mis-publicaciones/:usuarioId" element={<ProtectedRoute><MisPublicaciones /></ProtectedRoute>} />
      <Route path="/favoritos/:usuarioId" element={<ProtectedRoute><Favoritos /></ProtectedRoute>} />
      
    </Route>
  )
);