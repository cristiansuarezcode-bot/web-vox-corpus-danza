"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

type Foto = { src: string; alt: string; tipo: string };

const VISIBLES_AL_INICIO = 6;

/**
 * Galería del paquete audiovisual: muestra las primeras fotos, un botón para
 * ver todas y, al tocar una, la abre en grande para pasar con el dedo o con
 * las flechas.
 */
export default function Galeria({ fotos }: { fotos: Foto[] }) {
  const [todas, setTodas] = useState(false);
  const [abierta, setAbierta] = useState<number | null>(null);
  const dialogo = useRef<HTMLDialogElement>(null);
  const inicioToque = useRef<number | null>(null);

  const visibles = todas ? fotos : fotos.slice(0, VISIBLES_AL_INICIO);
  const faltan = fotos.length - VISIBLES_AL_INICIO;

  const mover = (paso: number) =>
    setAbierta((i) => (i === null ? i : (i + paso + fotos.length) % fotos.length));

  useEffect(() => {
    const d = dialogo.current;
    if (!d) return;
    if (abierta !== null && !d.open) {
      d.showModal();
      document.documentElement.style.overflow = "hidden";
    }
    if (abierta === null && d.open) d.close();
  }, [abierta]);

  useEffect(() => {
    if (abierta === null) return;
    const teclas = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") mover(1);
      if (e.key === "ArrowLeft") mover(-1);
    };
    window.addEventListener("keydown", teclas);
    return () => window.removeEventListener("keydown", teclas);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abierta === null]);

  const cerrar = () => {
    document.documentElement.style.overflow = "";
    setAbierta(null);
  };

  const foto = abierta === null ? null : fotos[abierta];

  return (
    <div>
      <p className={styles.subtitulo}>Así se ven los recuerdos</p>
      <div className={styles.galeria}>
        {visibles.map((f, i) => (
          <button
            key={f.src}
            type="button"
            className={styles.galeriaFoto}
            onClick={() => setAbierta(i)}
            aria-label={`Ver en grande: ${f.alt}`}
          >
            <img src={f.src} alt={f.alt} loading="lazy" width={800} height={1000} />
            <span className={styles.galeriaTipo}>{f.tipo}</span>
          </button>
        ))}
      </div>

      {!todas && faltan > 0 ? (
        <button
          type="button"
          className={`${styles.botonBorde} ${styles.galeriaMas}`}
          onClick={() => setTodas(true)}
        >
          Ver todas las fotos ({fotos.length})
        </button>
      ) : null}

      <dialog
        ref={dialogo}
        className={styles.visor}
        aria-label="Fotos de la clausura 2025"
        onClose={cerrar}
        onClick={(e) => {
          if (e.target === e.currentTarget) cerrar();
        }}
        onTouchStart={(e) => {
          inicioToque.current = e.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(e) => {
          const inicio = inicioToque.current;
          const fin = e.changedTouches[0]?.clientX;
          inicioToque.current = null;
          if (inicio === null || fin === undefined) return;
          if (fin - inicio < -40) mover(1);
          if (fin - inicio > 40) mover(-1);
        }}
      >
        {foto ? (
          <div className={styles.visorContenido}>
            <div className={styles.visorBarra}>
              <span>
                {foto.tipo} · {(abierta ?? 0) + 1} de {fotos.length}
              </span>
              <button type="button" className={styles.visorBoton} onClick={cerrar} aria-label="Cerrar">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <img className={styles.visorImagen} src={foto.src} alt={foto.alt} />
            <div className={styles.visorFlechas}>
              <button type="button" className={styles.visorBoton} onClick={() => mover(-1)} aria-label="Foto anterior">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M15 5l-7 7 7 7" />
                </svg>
              </button>
              <button type="button" className={styles.visorBoton} onClick={() => mover(1)} aria-label="Foto siguiente">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        ) : null}
      </dialog>
    </div>
  );
}
