"use client";

import { useEffect, useRef } from "react";
import { idSilla, type FilaTeatro } from "./boleteria";
import styles from "./boletas.module.css";

type Props = {
  teatro: FilaTeatro[];
  ocupadas: Set<string>;
  bloqueadas: Set<string>;
  seleccionadas?: Set<string>;
  /** Solo en el panel del vendedor: tocar una silla libre la selecciona. */
  alTocar?: (id: string) => void;
  tamano?: "fluido" | "grande";
};

/**
 * Mapa del teatro visto desde la silla: el escenario arriba, la fila A
 * primero y la silla 1 a la derecha (igual que el plano del teatro, girado).
 */
export default function MapaSillas({ teatro, ocupadas, bloqueadas, seleccionadas, alTocar, tamano = "fluido" }: Props) {
  const maximo = Math.max(1, ...teatro.map((t) => t.sillas));
  const marco = useRef<HTMLDivElement>(null);

  // En el celular el mapa es más ancho que la pantalla: arranca centrado.
  useEffect(() => {
    const el = marco.current;
    if (el && el.scrollWidth > el.clientWidth) el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
  }, [teatro.length]);

  return (
    <div ref={marco} className={`${styles.mapaMarco} ${tamano === "grande" ? styles.mapaGrande : ""}`}>
      <div className={styles.mapa} style={{ ["--sillas" as string]: maximo }}>
        <div className={styles.escenario}>Escenario</div>
        {teatro.map((t) => {
          const numeros = Array.from({ length: t.sillas }, (_, i) => t.sillas - i); // 1 queda a la derecha
          return (
            <div key={t.fila} className={styles.filaMapa}>
              <span className={`${styles.letra} ${styles.letraIzq}`} aria-hidden="true">{t.fila}</span>
              <div className={styles.sillas} role="group" aria-label={`Fila ${t.fila}`}>
                {numeros.map((n) => {
                  const id = idSilla(t.fila, n);
                  const estado = bloqueadas.has(id)
                    ? "reservada"
                    : ocupadas.has(id)
                      ? "vendida"
                      : seleccionadas?.has(id)
                        ? "elegida"
                        : "libre";
                  const clase = `${styles.silla} ${styles[estado]}`;
                  const texto = `Fila ${t.fila}, silla ${n}: ${
                    estado === "libre" ? "disponible" : estado === "elegida" ? "seleccionada" : estado
                  }`;
                  if (alTocar && (estado === "libre" || estado === "elegida")) {
                    return (
                      <button
                        key={id}
                        type="button"
                        className={clase}
                        onClick={() => alTocar(id)}
                        aria-pressed={estado === "elegida"}
                        aria-label={texto}
                      >
                        {n}
                      </button>
                    );
                  }
                  return (
                    <span key={id} className={clase} role="img" aria-label={texto}>
                      {tamano === "grande" ? n : ""}
                    </span>
                  );
                })}
              </div>
              <span className={`${styles.letra} ${styles.letraDer}`} aria-hidden="true">{t.fila}</span>
            </div>
          );
        })}
        <div className={styles.fondoSala}>Entrada · Sala de proyecciones</div>
      </div>
    </div>
  );
}

export function Leyenda({ conElegidas = false }: { conElegidas?: boolean }) {
  return (
    <ul className={styles.leyenda}>
      <li><span className={`${styles.muestra} ${styles.libre}`} aria-hidden="true" /> Disponible</li>
      {conElegidas ? <li><span className={`${styles.muestra} ${styles.elegida}`} aria-hidden="true" /> Seleccionada</li> : null}
      <li><span className={`${styles.muestra} ${styles.vendida}`} aria-hidden="true" /> Vendida</li>
      <li><span className={`${styles.muestra} ${styles.reservada}`} aria-hidden="true" /> Reservada</li>
    </ul>
  );
}
