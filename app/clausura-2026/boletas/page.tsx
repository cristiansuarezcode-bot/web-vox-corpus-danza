import type { Metadata, Viewport } from "next";
import MapaPublico from "./MapaPublico";
import { clausura } from "../config";
import "../fondo.css";
import base from "../page.module.css";
import styles from "./boletas.module.css";

export const metadata: Metadata = {
  title: "Escoge tus sillas · El Legado | Vox Corpus Danza",
  description: "Mapa de sillas disponibles para El Legado, la clausura 2026 de Vox Corpus Danza.",
  alternates: { canonical: "/clausura-2026/boletas/" },
};

export const viewport: Viewport = { themeColor: "#000000" };

export default function BoletasPage() {
  return (
    <main className={`${base.pagina} ${styles.contenedor}`} data-clausura="">
      <header className={styles.cabecera}>
        <a href="/clausura-2026/" aria-label="Volver a la página de la clausura">
          <img src="/clausura-2026/vox-lockup.png" alt="Vox Corpus Danza" width={130} height={29} />
        </a>
        <p className={styles.antetitulo}>El Legado · Clausura 2026</p>
        <h1 className={styles.titulo}>Escoge tus sillas</h1>
        <p className={styles.bajada}>
          Mira cuáles están libres y dile a la persona de recepción la fila y el número que quieres.
        </p>
        <p className={styles.datos}>
          Sábado 28 de noviembre · 4:00 p.m. · {clausura.lugar.nombre}
        </p>
      </header>

      <MapaPublico />

      <ul className={styles.ayuda}>
        <li>La fila A es la más cercana al escenario.</li>
        <li>Las sillas reservadas son para el equipo de grabación del show.</li>
        <li>Los menores de 4 años no pagan boleta y van cargados, sin ocupar silla.</li>
      </ul>

      <a className={styles.volver} href="/clausura-2026/">
        Ver toda la información de la clausura
      </a>
    </main>
  );
}
