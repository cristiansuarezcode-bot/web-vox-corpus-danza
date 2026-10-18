"use client";

import { faseEn } from "./config";
import styles from "./page.module.css";
import { useAhora } from "./useAhora";

export default function ChipPaquete({ compilado }: { compilado: number }) {
  const ahora = useAhora(compilado, 60_000);
  const { preventaPaquete } = faseEn(ahora);

  return (
    <a className={styles.chip} href="#paquete">
      {preventaPaquete ? <span className={styles.chipNuevo}>Nuevo</span> : null}
      <span>
        {preventaPaquete ? "Paquete audiovisual en preventa" : "Paquete audiovisual de la clausura"}
      </span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </a>
  );
}
