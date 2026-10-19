/**
 * Clausura 2026 "El Legado" — todo el contenido de la página en un solo lugar.
 *
 * Para cambiar un texto, un precio o una fecha, edita este archivo.
 * Las fechas van en hora de Colombia (-05:00). La página cambia sola de
 * fase según la fecha del celular de quien la abre:
 *
 *   - Hasta el cierre de la preventa de boletas: aviso de preventa.
 *   - Después: aviso de venta general.
 *   - Hasta el cierre de la preventa del paquete: precio de preventa tachando el normal.
 *   - Después: solo el precio normal.
 *   - Desde el inicio del show: se ocultan cuenta regresiva y avisos.
 *   - Desde `finShow`: mensaje de agradecimiento y, si hay enlace, la encuesta.
 */

export const WHATSAPP = "573112710369";
export const WHATSAPP_VISIBLE = "311 271 0369";
export const INSTAGRAM = "vox_corpusdanza";

export const whatsappLink = (mensaje?: string) =>
  mensaje
    ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensaje)}`
    : `https://wa.me/${WHATSAPP}`;

export const clausura = {
  numero: "Novena",
  desde: 2013,

  fechas: {
    preventaBoletasInicio: "2026-10-24T08:00:00-05:00",
    preventaBoletasFin: "2026-10-24T15:00:00-05:00",
    paqueteFinPreventa: "2026-11-26T23:59:59-05:00",
    aperturaPuertas: "2026-11-28T15:00:00-05:00",
    inicioShow: "2026-11-28T16:00:00-05:00",
    finShow: "2026-11-28T19:00:00-05:00",
  },

  lugar: {
    nombre: "Teatro Universidad de Envigado",
    direccion: "Carrera 27B #39A Sur-57, Envigado",
    destinoMapa:
      "Institución Universitaria de Envigado, Carrera 27B #39A Sur-57, Envigado",
    parqueadero: "La universidad cuenta con parqueadero.",
    // Cuando tengas las indicaciones de metro y bus, escríbelas aquí.
    // Mientras sea null, la página solo muestra el botón de la ruta en Google Maps.
    transportePublico: null as string | null,
  },

  boleteria: {
    preventaTexto: "Sábado 24 de octubre",
    preventaHorario: "8:00 a.m. a 3:00 p.m.",
    preventaLugar: "En la academia",
    precioFormacion: 60000,
    precioCompetencia: 50000,
    precioGeneral: 70000,
  },

  paquete: {
    precioPreventa: 60000,
    precioNormal: 90000,
    finPreventaTexto: "jueves 26 de noviembre",
    incluye: [
      "Foto familiar",
      "Foto individual en backstage",
      "Foto grupal",
      "Fotos en escena de cada estudiante",
      "Video de la clausura",
    ],
    mediosPago:
      "Paga en efectivo en recepción o por transferencia, enviando el comprobante al WhatsApp 311 271 0369.",
    // Fotos de clausuras anteriores para "Así se ven los recuerdos".
    // Sube los archivos a public/clausura-2026/ y agrégalos aquí.
    // Mientras la lista esté vacía, ese bloque no se muestra.
    fotosEjemplo: [] as { src: string; alt: string }[],
  },

  // Enlace del formulario de la encuesta (por ejemplo, un Formulario de Google).
  // Solo aparece después del show y solo si hay enlace.
  encuestaUrl: null as string | null,

  momentos: [
    {
      titulo: "Show de profesores",
      texto:
        "Los profes de Vox Corpus se suben al escenario. Créenos: no te lo puedes perder.",
      destacado: false,
    },
    {
      titulo: "Shows principales",
      texto:
        "Las coreografías centrales del homenaje, con nuestros grupos dándolo todo en escena.",
      destacado: false,
    },
    {
      titulo: "Niños, jóvenes y adultos en escena",
      texto:
        "Toda la familia Vox en el escenario, desde los más pequeños hasta nuestros adultos.",
      destacado: false,
    },
  ],

  preguntas: [
    {
      pregunta: "¿Cuándo y dónde compro mi boleta?",
      respuesta:
        "La preventa especial es el sábado 24 de octubre, de 8:00 a.m. a 3:00 p.m., en la academia. Después se abre la venta general a $70.000, según la disponibilidad de sillas del teatro.",
    },
    {
      pregunta: "¿Los niños pagan boleta?",
      respuesta:
        "Los estudiantes de Vox Corpus que se presentan no pagan boleta. Los niños espectadores pagan boleta a partir de los 4 años. Los menores de 4 años no pagan, pero deben ir cargados, sin ocupar silla.",
    },
    {
      pregunta: "¿A qué hora debo llegar al teatro?",
      respuesta:
        "Las puertas abren a las 3:00 p.m. y el show empieza a las 4:00 p.m. Por respeto a los artistas, te pedimos llegar con tiempo.",
    },
    {
      pregunta: "¿Cómo pago el paquete audiovisual?",
      respuesta:
        "En efectivo en la recepción de la academia o por transferencia, enviando el comprobante al WhatsApp 311 271 0369. En preventa cuesta $60.000 hasta el 26 de noviembre; después, $90.000.",
    },
    {
      pregunta: "¿Se puede grabar durante el show?",
      respuesta:
        "Sí puedes usar el celular, pero te recomendamos no grabar para no incomodar a quienes están detrás de ti. Además, el material del paquete audiovisual es tomado por profesionales, desde el backstage y el escenario: no se compara con un video desde la silla.",
    },
    {
      pregunta: "¿Hay parqueadero?",
      respuesta: "Sí, la universidad cuenta con parqueadero.",
    },
  ],
};

export const pesos = (valor: number) =>
  `$${String(valor).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;

export type Fase = {
  preventaBoletas: boolean;
  preventaPaquete: boolean;
  showEmpezo: boolean;
  showTermino: boolean;
};

export function faseEn(ahora: number): Fase {
  const f = clausura.fechas;
  return {
    preventaBoletas: ahora < Date.parse(f.preventaBoletasFin),
    preventaPaquete: ahora <= Date.parse(f.paqueteFinPreventa),
    showEmpezo: ahora >= Date.parse(f.inicioShow),
    showTermino: ahora >= Date.parse(f.finShow),
  };
}
