"use client";

import { useEffect, useState } from "react";

// Avisos de la clausura 2026 en la página principal. Se ocultan solos después
// de esta fecha; para la próxima clausura basta con cambiar textos y fecha.
const VISIBLE_HASTA = new Date("2026-12-15T23:59:59-05:00").getTime();

function useVisible() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    setVisible(Date.now() <= VISIBLE_HASTA);
  }, []);
  return visible;
}

/** Franja delgada arriba del menú, en todas las pantallas. */
export function AvisoClausura() {
  const visible = useVisible();
  if (!visible) return null;
  return (
    <a className="clausura-aviso" href="/clausura-2026/">
      <strong>El Legado · Clausura 2026</strong>
      <span className="clausura-aviso-fecha">Sábado 28 de noviembre · 4:00 p.m.</span>
      <span className="clausura-aviso-ir">
        Ver información <span aria-hidden="true">→</span>
      </span>
    </a>
  );
}

/** Enlace del menú. */
export function EnlaceClausura({ className }: { className?: string }) {
  const visible = useVisible();
  if (!visible) return null;
  return (
    <a className={className} href="/clausura-2026/">
      Clausura 2026
    </a>
  );
}

/** Sección destacada después de la portada. */
export function SeccionClausura() {
  const visible = useVisible();
  if (!visible) return null;
  return (
    <section className="clausura-home" aria-labelledby="clausura-home-titulo">
      <div className="clausura-home-copia">
        <p className="clausura-home-etiqueta">Novena clausura · Vox Corpus Danza</p>
        <h2 id="clausura-home-titulo" className="clausura-home-titulo">
          <img
            src="/clausura-2026/el-legado-titulo.jpg"
            alt="El Legado, celebrando el legado de Michael Jackson"
            width={1368}
            height={752}
          />
        </h2>
        <p className="clausura-home-datos">
          Sábado 28 de noviembre · 4:00 p.m.
          <br />
          Teatro Universidad de Envigado
        </p>
        <div className="clausura-home-botones">
          <a className="clausura-boton clausura-boton-dorado" href="/clausura-2026/">
            Toda la información <span aria-hidden="true">→</span>
          </a>
          <a className="clausura-boton clausura-boton-borde" href="/clausura-2026/boletas/">
            Ver sillas disponibles
          </a>
        </div>
      </div>
    </section>
  );
}
