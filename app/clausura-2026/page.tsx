import type { Metadata, Viewport } from "next";
import Avisos from "./Avisos";
import Boleteria from "./Boleteria";
import ChipPaquete from "./ChipPaquete";
import CuentaRegresiva from "./CuentaRegresiva";
import Galeria from "./Galeria";
import PrecioPaquete from "./PrecioPaquete";
import { INSTAGRAM, WHATSAPP_VISIBLE, clausura, whatsappLink } from "./config";
import "./fondo.css";
import styles from "./page.module.css";

const titulo = "El Legado · Clausura 2026 | Vox Corpus Danza";
const descripcion =
  "Sábado 28 de noviembre, 4:00 p.m., Teatro Universidad de Envigado. La novena clausura de Vox Corpus Danza, un homenaje al legado de Michael Jackson.";

export const metadata: Metadata = {
  title: titulo,
  description: descripcion,
  alternates: { canonical: "/clausura-2026/" },
  openGraph: {
    type: "website",
    url: "/clausura-2026/",
    title: "El Legado · Clausura 2026",
    description: "Sábado 28 de noviembre · 4:00 p.m. · Teatro Universidad de Envigado",
    images: [
      {
        url: "/clausura-2026/og-clausura-2026.jpg",
        width: 1200,
        height: 630,
        alt: "El Legado, Clausura 2026 de Vox Corpus Danza",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "El Legado · Clausura 2026",
    description: "Sábado 28 de noviembre · 4:00 p.m. · Teatro Universidad de Envigado",
    images: ["/clausura-2026/og-clausura-2026.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

const mapa = (modo: "driving" | "transit") =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    clausura.lugar.destinoMapa,
  )}&travelmode=${modo}`;

const iconos = {
  familia: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 19.5c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M16 13.7c2.9.3 5 2.3 5 5.3" />
    </>
  ),
  persona: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.9 3.1-6.5 7-6.5s7 2.6 7 6.5" />
    </>
  ),
  grupo: (
    <>
      <circle cx="6" cy="9" r="2.4" />
      <circle cx="12" cy="7.5" r="2.6" />
      <circle cx="18" cy="9" r="2.4" />
      <path d="M2.5 19c0-2.6 1.6-4.3 3.5-4.3M21.5 19c0-2.6-1.6-4.3-3.5-4.3M7.5 19.5c0-3 2-5 4.5-5s4.5 2 4.5 5" />
    </>
  ),
  camara: (
    <>
      <path d="M4 8h3l2-2.5h6L17 8h3v11H4z" />
      <circle cx="12" cy="13.5" r="3.5" />
    </>
  ),
  video: (
    <>
      <rect x="3" y="6.5" width="13" height="11" rx="2" />
      <path d="M16 11l5-3v8l-5-3z" />
    </>
  ),
};

const iconoIncluye = [iconos.familia, iconos.persona, iconos.grupo, iconos.camara, iconos.video];

function Icono({ children, size = 26 }: { children: React.ReactNode; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export default function Clausura2026Page() {
  // Hora de compilación: el HTML estático se genera con ella y, al abrir la
  // página, los componentes pasan a la hora real del celular.
  const compilado = Date.now();
  const { lugar, paquete } = clausura;

  return (
    <main className={styles.pagina} data-clausura="">
      {/* ENTRADA */}
      <header className={styles.hero}>
        <a href="/" aria-label="Ir al inicio de Vox Corpus Danza">
          <img className={styles.logoVox} src="/clausura-2026/vox-lockup.png" alt="Vox Corpus Danza" width={150} height={34} />
        </a>
        <p className={styles.presenta}>Presenta</p>
        <p className={styles.clausuraAnio}>Clausura 2026</p>
        <h1 className={styles.h1}>
          <img
            className={styles.tituloLegado}
            src="/clausura-2026/el-legado-titulo.jpg"
            alt="El Legado, celebrando el legado de Michael Jackson"
            width={1368}
            height={752}
          />
        </h1>

        <CuentaRegresiva compilado={compilado} />

        <div className={styles.fechaLugar}>
          <p className={styles.fecha}>Sábado 28 de noviembre · 4:00 p.m.</p>
          <p className={styles.lugarDorado}>{lugar.nombre}</p>
        </div>

        <ChipPaquete compilado={compilado} />

        <img
          className={styles.emblema}
          src="/clausura-2026/emblema-mj.jpg"
          alt=""
          width={900}
          height={788}
        />
      </header>

      {/* MENSAJE */}
      <section className={`${styles.seccion} ${styles.mensaje}`} aria-label="El show">
        <p className={styles.antetitulo}>
          {clausura.numero} clausura · Vox Corpus Danza
        </p>
        <p className={styles.frase}>Todos tenemos una huella por dejar.</p>
        <div className={styles.divisor} aria-hidden="true">
          <span />
          <i />
          <span />
        </div>
        <p className={styles.parrafo}>
          Un año entero de clases, ensayos y esfuerzo se convierte en una sola noche. Este 28 de
          noviembre, nuestros estudiantes suben al escenario para rendir homenaje al legado de
          Michael Jackson y dejar, también, su propia huella.
        </p>
      </section>

      {/* MOMENTOS */}
      <section className={`${styles.seccion} ${styles.fondoAlterno}`} aria-labelledby="momentos-titulo">
        <div className={styles.encabezado}>
          <p className={styles.antetitulo}>Lo que te espera</p>
          <h2 className={styles.titulo} id="momentos-titulo">
            Momentos imperdibles
          </h2>
        </div>
        <ol className={styles.momentos}>
          {clausura.momentos.map((m, i) => (
            <li key={m.titulo} className={`${styles.momento} ${m.destacado ? styles.momentoDestacado : ""}`}>
              <span className={styles.momentoNumero} aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className={styles.momentoTitulo}>{m.titulo}</h3>
                <p className={styles.momentoTexto}>{m.texto}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className={styles.fraseSorpresas}>Y muchas sorpresas más… no te lo vas a querer perder.</p>
      </section>

      {/* BOLETERÍA (cambia sola según la fecha) */}
      <Boleteria compilado={compilado} />

      {/* PAQUETE AUDIOVISUAL */}
      <section id="paquete" className={`${styles.seccion} ${styles.paquete}`} aria-labelledby="paquete-titulo">
        <div className={styles.encabezado}>
          <p className={styles.antetitulo}>Paquete audiovisual</p>
          <h2 className={styles.titulo} id="paquete-titulo">
            Llévate el recuerdo de su gran noche
          </h2>
          <p className={styles.parrafo}>
            Disfruta el show sin estar pendiente del celular: nosotros guardamos el recuerdo por ti,
            desde el backstage hasta el escenario.
          </p>
        </div>

        <PrecioPaquete compilado={compilado} />

        <div>
          <p className={styles.subtitulo}>Incluye</p>
          <ul className={styles.incluye}>
            {paquete.incluye.map((item, i) => (
              <li key={item}>
                <Icono>{iconoIncluye[i] ?? iconos.camara}</Icono>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {paquete.fotosEjemplo.length > 0 ? <Galeria fotos={paquete.fotosEjemplo} /> : null}

        <a
          className={`${styles.botonDorado} ${styles.botonGrande}`}
          href={whatsappLink(
            "¡Hola! Quiero reservar el paquete audiovisual de El Legado para mi hijo(a): ",
          )}
        >
          Reservar mi paquete
        </a>
        <p className={styles.notaCentro}>{paquete.mediosPago}</p>
      </section>

      {/* EL DÍA DEL SHOW */}
      <section className={styles.seccion} aria-labelledby="dia-titulo">
        <div className={styles.encabezado}>
          <p className={styles.antetitulo}>Ten en cuenta</p>
          <h2 className={styles.titulo} id="dia-titulo">
            El día del show
          </h2>
        </div>

        <div className={`${styles.tarjeta} ${styles.filaIcono}`}>
          <Icono size={28}>
            <rect x="3.5" y="5" width="17" height="15" rx="2" />
            <path d="M3.5 10h17M8 3v4M16 3v4" />
          </Icono>
          <div>
            <p className={styles.textoMini}>Fecha</p>
            <p className={styles.textoFuerte}>Sábado 28 de noviembre de 2026</p>
          </div>
        </div>

        <div className={styles.dosColumnas}>
          <div className={styles.tarjeta}>
            <p className={styles.textoMini}>Apertura de puertas</p>
            <p className={styles.precio}>3:00 p.m.</p>
          </div>
          <div className={`${styles.tarjeta} ${styles.tarjetaDorada}`}>
            <p className={styles.textoMini}>Inicio del show</p>
            <p className={styles.precioDorado}>4:00 p.m.</p>
          </div>
        </div>

        <div className={styles.tarjeta}>
          <div className={styles.filaIcono}>
            <Icono size={28}>
              <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
              <circle cx="12" cy="10" r="2.4" />
            </Icono>
            <div>
              <p className={styles.textoMini}>Lugar</p>
              <p className={styles.textoFuerte}>{lugar.nombre}</p>
              <p className={styles.textoSuave}>{lugar.direccion}</p>
            </div>
          </div>
          <div className={styles.dosColumnas}>
            <a className={styles.botonBorde} href={mapa("driving")}>
              En carro
            </a>
            <a className={styles.botonBorde} href={mapa("transit")}>
              Transporte público
            </a>
          </div>
          <div className={styles.notas}>
            <p>
              <strong>Parqueadero:</strong> {lugar.parqueadero.toLowerCase()}
            </p>
            {lugar.transportePublico ? (
              <p>
                <strong>En transporte público:</strong> {lugar.transportePublico}
              </p>
            ) : null}
          </div>
        </div>

        <a className={styles.botonBorde} href="/clausura-2026/el-legado-28-noviembre.ics">
          Agregar el show a mi calendario
        </a>
        <p className={styles.notaCentro}>Por respeto a los artistas, te esperamos con puntualidad.</p>
      </section>

      {/* PREGUNTAS */}
      <section className={`${styles.seccion} ${styles.fondoAlterno}`} aria-labelledby="preguntas-titulo">
        <div className={styles.encabezado}>
          <p className={styles.antetitulo}>Para las familias</p>
          <h2 className={styles.titulo} id="preguntas-titulo">
            Preguntas frecuentes
          </h2>
        </div>
        <div className={styles.preguntas}>
          {clausura.preguntas.map((q) => (
            <details key={q.pregunta} className={styles.pregunta}>
              <summary>
                <span>{q.pregunta}</span>
                <span className={styles.signo} aria-hidden="true" />
              </summary>
              <p>{q.respuesta}</p>
            </details>
          ))}
        </div>
      </section>

      {/* PIE */}
      <footer className={styles.pie}>
        <img src="/clausura-2026/vox-circulo.png" alt="" width={84} height={85} />
        <p className={styles.pieTitulo}>{clausura.numero} clausura</p>
        <p className={styles.textoSuave}>
          Vox Corpus Danza · Formando bailarines desde {clausura.desde}
        </p>
        <div className={styles.pieEnlaces}>
          <a href={`https://www.instagram.com/${INSTAGRAM}/`}>@{INSTAGRAM}</a>
          <a href={whatsappLink()}>WhatsApp {WHATSAPP_VISIBLE}</a>
        </div>
        <a className={styles.pieInicio} href="/">
          Conoce Vox Corpus Danza
        </a>
      </footer>

      <Avisos />
    </main>
  );
}
