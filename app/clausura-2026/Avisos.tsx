"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { clausura, faseEn, pesos, whatsappLink } from "./config";
import { diasRestantesPaquete, textoDiasRestantes } from "./PrecioPaquete";
import styles from "./page.module.css";

type Aviso = "preventa" | "general" | "paquete";

const PRIMERA_ESPERA_MS = 2000;
const SEGUNDA_ESPERA_MS = 1500;

const claveVisto = (aviso: Aviso) => `vox-clausura-2026-aviso-${aviso}`;

function yaVisto(aviso: Aviso) {
  try {
    return window.localStorage.getItem(claveVisto(aviso)) === "1";
  } catch {
    return false;
  }
}

function marcarVisto(aviso: Aviso) {
  try {
    window.localStorage.setItem(claveVisto(aviso), "1");
  } catch {
    // Sin almacenamiento (modo privado): el aviso puede volver a salir; no pasa nada.
  }
}

/**
 * Avisos que suben desde abajo: primero el de boletería y, cuando la persona
 * lo cierra, el del paquete audiovisual. Cada uno sale una sola vez por
 * celular. No salen desde que empieza el show.
 */
export default function Avisos() {
  const [visible, setVisible] = useState<Aviso | null>(null);
  const [ahora, setAhora] = useState<number | null>(null);
  const espera = useRef<number | undefined>(undefined);

  const siguiente = useCallback((despuesDe: Aviso | null, ms: number) => {
    const t = Date.now();
    const fase = faseEn(t);
    if (fase.showEmpezo) return;

    const cola: Aviso[] = [];
    cola.push(fase.preventaBoletas ? "preventa" : "general");
    if (fase.preventaPaquete) cola.push("paquete");

    const desde = despuesDe ? cola.indexOf(despuesDe) + 1 : 0;
    const proximo = cola.slice(desde).find((a) => !yaVisto(a));
    if (!proximo) return;

    window.clearTimeout(espera.current);
    espera.current = window.setTimeout(() => {
      setAhora(Date.now());
      setVisible(proximo);
    }, ms);
  }, []);

  useEffect(() => {
    siguiente(null, PRIMERA_ESPERA_MS);
    return () => window.clearTimeout(espera.current);
  }, [siguiente]);

  const cerrar = useCallback(() => {
    if (!visible) return;
    marcarVisto(visible);
    const cerrado = visible;
    setVisible(null);
    siguiente(cerrado, SEGUNDA_ESPERA_MS);
  }, [visible, siguiente]);

  useEffect(() => {
    if (!visible) return;
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrar();
    };
    window.addEventListener("keydown", alTeclear);
    return () => window.removeEventListener("keydown", alTeclear);
  }, [visible, cerrar]);

  if (!visible || ahora === null) return null;

  const b = clausura.boleteria;
  const p = clausura.paquete;
  const tituloId = `aviso-${visible}-titulo`;

  return (
    <div className={styles.aviso} role="dialog" aria-modal="false" aria-labelledby={tituloId}>
      <div className={styles.avisoCabecera}>
        <p className={styles.etiquetaDorada}>
          {visible === "preventa" && "Boletería · Preventa especial"}
          {visible === "general" && "Boletería · Venta general"}
          {visible === "paquete" && "Paquete audiovisual · Preventa"}
        </p>
        <button type="button" className={styles.avisoCerrar} onClick={cerrar} aria-label="Cerrar aviso">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      {visible === "preventa" && (
        <>
          <p className={styles.avisoTitulo} id={tituloId}>{b.preventaTexto}</p>
          <p className={styles.textoSuave}>
            {b.preventaHorario} · {b.preventaLugar}
          </p>
          <div className={`${styles.dosColumnas} ${styles.avisoPrecios}`}>
            <div>
              <p className={styles.textoMini}>Formación</p>
              <p className={styles.precioDorado}>{pesos(b.precioFormacion)}</p>
            </div>
            <div>
              <p className={styles.textoMini}>Competencia</p>
              <p className={styles.precioDorado}>{pesos(b.precioCompetencia)}</p>
            </div>
          </div>
          <div className={styles.avisoBotones}>
            <a className={styles.botonDorado} href="/clausura-2026/preventa-boletas.ics" onClick={cerrar}>
              Recordármelo
            </a>
            <button type="button" className={styles.botonBorde} onClick={cerrar}>
              Entendido
            </button>
          </div>
        </>
      )}

      {visible === "general" && (
        <>
          <p className={styles.avisoTitulo} id={tituloId}>Ya puedes separar tu boleta</p>
          <p className={styles.textoSuave}>
            {pesos(b.precioGeneral)} por persona · Según disponibilidad de sillas
          </p>
          <div className={styles.avisoBotones}>
            <a
              className={styles.botonDorado}
              href={whatsappLink("¡Hola! Quiero separar boletas para El Legado.")}
              onClick={cerrar}
            >
              Separar por WhatsApp
            </a>
            <button type="button" className={styles.botonBorde} onClick={cerrar}>
              Ahora no
            </button>
          </div>
        </>
      )}

      {visible === "paquete" && (
        <>
          <p className={styles.avisoTitulo} id={tituloId}>Llévate el recuerdo de su gran noche</p>
          <p className={styles.textoSuave}>
            Fotos familiar, individual, grupal y en escena, más el video de la clausura.
          </p>
          <div className={`${styles.precios} ${styles.avisoPrecios}`}>
            <s className={styles.precioTachado}>
              <span className={styles.oculto}>Antes </span>
              {pesos(p.precioNormal)}
            </s>
            <p className={styles.precioDorado}>{pesos(p.precioPreventa)}</p>
            <p className={styles.textoMiniFuerte}>
              Hasta el 26 nov
              {textoDiasRestantes(diasRestantesPaquete(ahora))
                ? ` · ${textoDiasRestantes(diasRestantesPaquete(ahora))}`
                : ""}
            </p>
          </div>
          <div className={styles.avisoBotones}>
            <a className={styles.botonDorado} href="#paquete" onClick={cerrar}>
              Ver el paquete
            </a>
            <button type="button" className={styles.botonBorde} onClick={cerrar}>
              Ahora no
            </button>
          </div>
        </>
      )}
    </div>
  );
}
