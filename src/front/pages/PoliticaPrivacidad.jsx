import React from "react";
import { motion } from "framer-motion";

const PoliticaPrivacidad = () => {
  const texto = `POLÍTICA DE PRIVACIDAD DE TRUEKETEO

Es compromiso de Trueketeo el respeto de la privacidad de los usuarios y la protección y seguridad de tus datos personales. Por ello, para nosotros es muy importante informarte sobre la forma en que recabamos, tratamos y protegemos los datos de carácter personal que nos son facilitados a través de nuestra página web.

La utilización de la página web de Trueketeo no está dirigida a menores de 14 años y, por consiguiente, éstos deberán abstenerse de facilitar cualquier información de carácter personal. En este sentido, Trueketeo recomienda la utilización de su página web a personas mayores de 18 años.  Para ello, Trueketeo se reserva el derecho a comprobar en cualquier momento la edad de los usuarios de su página web.

Por ello, es importante informar que Trueketeo cumple con la normativa de protección de datos de los países en los que operamos, así como con el Reglamento Europeo de Protección de Datos. A causa de ello, pueden existir enmiendas específicas a las que se hace referencia en esta política de privacidad y que apliquen únicamente a los usuarios de los países, en algunos casos, pueden establecerse normas diferentes debido a la legislación local aplicable. En caso de conflicto prevalecerá la enmienda específica.

¿Quién es el responsable en el tratamiento de datos personales?
El tratamiento de los datos es llevado a cabo por y en nombre de Trueketeo, que recopiló tus datos, España.

Si deseas ponerte en contacto con nosotros para resolver cualquier duda, por favor escribe un email a Trueketeo@gmail.com.

Te informamos que cuando a través de nuestra página web realices algún comentario en redes sociales, el responsable de los datos que facilites a través de las mismas será la red social correspondiente y no Trueketeo, debiendo dirigirte a dicha red social para ejercer, en su caso, tus derechos de protección de datos.

¿Cuándo y cómo recabamos tus datos personales?
Trueketeo recaba y trata datos de carácter personal tanto de usuarios que se hayan registrado en nuestra página web, como de usuarios que, no habiéndose registrado, naveguen en ellas o las consulten.

De esta manera, Trueketeo obtiene y utiliza los datos de la IP y demás identificadores proporcionados por el dispositivo desde el que navegues por nuestra página web, a la vez que recaba los datos que proporcionas en el momento de registrarte como «Usuario» de Trueketeo, así como aquellos datos obtenidos como consecuencia de tu navegación, solicitudes, publicaciones, conversaciones, búsquedas, truekes, valoraciones de otros usuarios, participación en concursos y los datos derivados, en su caso, de la vinculación de tu registro en nuestra página web con tu cuenta Google.

Adicionalmente, si nos das tu consentimiento, Trueketeo también tratará la ubicación a través del GPS de tu dispositivo para informarte de los productos que tienes más cerca, permitiéndote así disfrutar de nuestros servicios de manera completa.

¿Qué tipo de datos personales recabamos?
Las categorías de datos que recogemos dependen de tu actividad e interacción con Trueketeo a través de página web. Asimismo, Trueketeo solamente recabará datos personales que sean necesarios para las finalidades que llevamos a cabo. Por ello, es importante que te expliquemos cómo y qué tipo de datos recogemos: .

Categorías de datos: Datos básicos
Datos recogidos: Nombre y apellidos, correo electrónico, número de teléfono, contraseña.
Categorías de datos: Datos de registro(Información recopilada cuando utilizas la página web de Trueketeo con fines exclusivamente informativos. Información relativa a tu uso del sitio web)
Datos recogidos:En consonancia con la elección de cookies proporcionada (siempre y cuando sea aplicable), cuando utilizas nuestra plataforma únicamente con fines informativos (por ejemplo, no te registras en la plataforma, no compras a través de ella ni envías tus datos de otro modo), tu navegador de Internet recopila automáticamente, y nos transfiere, cierta información básica relacionada con tu uso de la plataforma. Dichos datos de registro pueden incluir el tipo y la versión de tu navegador, tu sistema operativo e interfaz, el dispositivo utilizado, la preferencia de idioma, el sitio web desde el que nos visitas (URL de referencia), la(s) página(s) que visitas en nuestras plataformas, la fecha y la hora de tu visita, parte de tu dirección de protocolo de Internet (IP), tus acciones realizadas en las plataformas y el nombre de tu proveedor de acceso.
Asimismo, te informamos que determinadas funcionalidades de nuestra página web así como de nuestra aplicación utilizan la navegación considerando tu ubicación para poder proporcionarte la información más relevante en cada caso, así como para ofrecerte ciertos servicios. Aunque la navegación considerando que la ubicación del GPS de tu dispositivo es siempre una elección del usuario, en los casos en los que rechaces la página web y/o la aplicación de Trueketeo no podrán ofrecerte las funcionalidades o proporcionarte los contenidos basados en dicha ubicación.
Categorías de datos: Datos de las redes sociales(Información recopilada cuando utilizas las redes sociales de Trueketeo con fines exclusivamente informativos. Información procesada por proveedores externos de redes sociales)
Datos recogidos:El mero uso de nuestras plataformas no suele implicar actividades de tratamiento de datos (incluidas las transferencias de datos) en relación con plataformas de medios y/o redes sociales de tercerosacidad del respectivo proveedor de la Plataforma Externa.
Categorías de datos: Datos de solicitud(información recopilada cuando interactúas con nosotros de otra manera)
Datos recogidos:La información que nos compartas cuando interactúas con nosotros a través de formularios de solicitud. También cuando aplicas a alguna oferta de trabajo.
Categorías de datos:Datos básicos y datos de transacciones económicas. (Información recopilada para cumplir con la Directiva DAC7 sobre comunicación de datos fiscales.
Datos recogidos:nombre, apellidos, NIF / DNI, pasaporte, información sobre el IVA, dirección postal, fecha y lugar de nacimiento, datos de la tarjeta bancaria, datos de cuenta bancaria, país de residencia.
¿Con qué finalidades, base legitimadora y conservación tratamos tus datos personales?
En el caso de que no te hayas registrado en nuestra página web o en nuestra aplicación, Trueketeo tratará la IP de tu dispositivo para las siguientes finalidades:

¿Cómo ejercitar tus derechos?
Puedes ejercitar tus derechos de acceso, rectificación, supresión, limitación, portabilidad y oposición enviando una solicitud a través de la dirección de correo electrónico Trueketeo@gmail.com indicando tu nombre, apellidos, una copia de un documento identificativo y la petición que quieras realizar. Responderemos a tu petición dentro de los plazos legales.

En el caso que no estés conforme con la respuesta recibida puedes dirigirte a la Agencia Española de Protección de Datos o a la autoridad de protección de datos competente en tu país.

Recuerda que puedes visitar esta página para consultar la política de privacidad actualizada.`;

  const paragraphs = texto.split('\n\n');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="container my-5">
        <h1 className="mb-4 fw-bold fs-2">Política y Privacidad</h1>
        <div className="lh-lg">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="text-muted fs-5">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default PoliticaPrivacidad;
