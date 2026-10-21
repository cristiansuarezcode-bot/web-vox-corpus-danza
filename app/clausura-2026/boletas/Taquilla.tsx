"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { pesos } from "../config";
import {
  BOLETERIA_API,
  enviar,
  ordenarSillas,
  pedirMapa,
  type Entrada,
  type Venta,
} from "./boleteria";
import MapaSillas, { Leyenda } from "./MapaSillas";
import styles from "./boletas.module.css";

const CLAVE_GUARDADA = "vox-taquilla-clave";
const CADA_MS = 10000;

function leerClave() {
  try {
    return window.sessionStorage.getItem(CLAVE_GUARDADA) ?? "";
  } catch {
    return "";
  }
}
function guardarClave(c: string | null) {
  try {
    if (c) window.sessionStorage.setItem(CLAVE_GUARDADA, c);
    else window.sessionStorage.removeItem(CLAVE_GUARDADA);
  } catch {
    // Sin almacenamiento: tocará escribir la clave de nuevo al recargar.
  }
}

type Detalle = { tipo: string };
type Aviso = { tipo: "bien" | "mal"; texto: string } | null;

export default function Taquilla() {
  const [clave, setClave] = useState("");
  const [entrada, setEntrada] = useState<Entrada | null>(null);
  const [cargando, setCargando] = useState(false);
  const [aviso, setAviso] = useState<Aviso>(null);

  const entrar = useCallback(async (c: string) => {
    setCargando(true);
    setAviso(null);
    try {
      const r = await enviar<Entrada>({ accion: "entrar", clave: c });
      if (r.ok) {
        setEntrada(r);
        setClave(c);
        guardarClave(c);
      } else {
        guardarClave(null);
        setAviso({ tipo: "mal", texto: r.error });
      }
    } catch {
      setAviso({ tipo: "mal", texto: "No hay conexión con la boletería. Revisa el internet e intenta de nuevo." });
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    const c = leerClave();
    if (c && BOLETERIA_API) entrar(c);
  }, [entrar]);

  const salir = () => {
    guardarClave(null);
    setEntrada(null);
    setClave("");
  };

  if (!BOLETERIA_API) {
    return <p className={styles.estado}>La boletería aún no está conectada con la hoja de cálculo.</p>;
  }

  if (!entrada) {
    return (
      <form
        className={styles.ingreso}
        onSubmit={(e) => {
          e.preventDefault();
          const c = String(new FormData(e.currentTarget).get("clave") ?? "").trim();
          if (c) entrar(c);
        }}
      >
        <label className={styles.campo}>
          <span>Clave de vendedor</span>
          <input name="clave" type="password" autoComplete="current-password" required placeholder="VOX-XXXXXX" />
        </label>
        <button className={styles.botonDorado} type="submit" disabled={cargando}>
          {cargando ? "Entrando…" : "Entrar"}
        </button>
        {aviso ? <p className={styles.avisoError} role="alert">{aviso.texto}</p> : null}
      </form>
    );
  }

  return <Panel entrada={entrada} clave={clave} salir={salir} />;
}

function Panel({ entrada, clave, salir }: { entrada: Entrada; clave: string; salir: () => void }) {
  const [pestana, setPestana] = useState<"vender" | "ventas">("vender");
  const [ocupadas, setOcupadas] = useState<Set<string>>(new Set());
  const bloqueadas = useMemo(() => new Set(entrada.bloqueos.map((b) => b.id)), [entrada.bloqueos]);

  const refrescar = useCallback(async () => {
    try {
      const r = await pedirMapa();
      if (r.ok) setOcupadas(new Set(r.ocupadas));
    } catch {
      // Se reintenta en el siguiente ciclo.
    }
  }, []);

  useEffect(() => {
    refrescar();
    const t = window.setInterval(() => {
      if (document.visibilityState === "visible") refrescar();
    }, CADA_MS);
    return () => window.clearInterval(t);
  }, [refrescar]);

  return (
    <div className={styles.panel}>
      <div className={styles.barraPanel}>
        <p>
          Vendedor: <strong>{entrada.vendedor}</strong>
        </p>
        <button type="button" className={styles.botonBorde} onClick={salir}>
          Salir
        </button>
      </div>

      <div className={styles.pestanas} role="tablist">
        <button type="button" role="tab" aria-selected={pestana === "vender"} onClick={() => setPestana("vender")}>
          Vender
        </button>
        <button type="button" role="tab" aria-selected={pestana === "ventas"} onClick={() => setPestana("ventas")}>
          Ventas registradas
        </button>
      </div>

      {pestana === "vender" ? (
        <Vender entrada={entrada} clave={clave} ocupadas={ocupadas} bloqueadas={bloqueadas} refrescar={refrescar} salir={salir} setOcupadas={setOcupadas} />
      ) : (
        <Ventas clave={clave} teatro={entrada.teatro} refrescar={refrescar} salir={salir} />
      )}
    </div>
  );
}

function Vender({
  entrada,
  clave,
  ocupadas,
  bloqueadas,
  refrescar,
  salir,
  setOcupadas,
}: {
  entrada: Entrada;
  clave: string;
  ocupadas: Set<string>;
  bloqueadas: Set<string>;
  refrescar: () => Promise<void>;
  salir: () => void;
  setOcupadas: (s: Set<string>) => void;
}) {
  const tipos = Object.keys(entrada.precios);
  const [tipoGeneral, setTipoGeneral] = useState(tipos[0] ?? "");
  const [elegidas, setElegidas] = useState<Record<string, Detalle>>({});
  const [estudiante, setEstudiante] = useState("");
  const [pago, setPago] = useState("");
  const [nota, setNota] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [aviso, setAviso] = useState<Aviso>(null);

  const ids = ordenarSillas(Object.keys(elegidas), entrada.teatro);
  const seleccion = useMemo(() => new Set(Object.keys(elegidas)), [elegidas]);
  const total = ids.reduce((a, id) => a + (entrada.precios[elegidas[id].tipo] ?? 0), 0);

  // Si alguien más vendió una silla que tenía seleccionada, se quita de la selección.
  useEffect(() => {
    const tomadas = Object.keys(elegidas).filter((id) => ocupadas.has(id));
    if (tomadas.length) {
      setElegidas((prev) => {
        const n = { ...prev };
        tomadas.forEach((id) => delete n[id]);
        return n;
      });
      setAviso({ tipo: "mal", texto: `Otro vendedor acaba de vender: ${tomadas.join(", ")}. La quité de tu selección.` });
    }
  }, [ocupadas, elegidas]);

  const tocar = (id: string) => {
    setAviso(null);
    setElegidas((prev) => {
      const n = { ...prev };
      if (n[id]) delete n[id];
      else n[id] = { tipo: tipoGeneral };
      return n;
    });
  };

  const cambiarTipoGeneral = (t: string) => {
    setTipoGeneral(t);
    setElegidas((prev) => Object.fromEntries(Object.entries(prev).map(([id, d]) => [id, { ...d, tipo: t }])));
  };

  const registrar = async () => {
    setAviso(null);
    if (!ids.length) return setAviso({ tipo: "mal", texto: "Toca en el mapa las sillas que la familia escogió." });
    if (!estudiante.trim()) return setAviso({ tipo: "mal", texto: "Escribe el nombre del estudiante." });
    if (!pago) return setAviso({ tipo: "mal", texto: "Escoge si pagó en efectivo o por transferencia." });

    setEnviando(true);
    try {
      const r = await enviar<{ idVenta: string; total: number; sillas: string[] }>({
        accion: "vender",
        clave,
        estudiante: estudiante.trim(),
        pago,
        nota: nota.trim(),
        sillas: ids.map((id) => {
          const [fila, silla] = id.split("-");
          return { fila, silla: Number(silla), tipo: elegidas[id].tipo, boleta: id }; // la boleta se identifica por fila y silla
        }),
      });
      if (r.ok) {
        setAviso({
          tipo: "bien",
          texto: `Venta registrada para ${estudiante.trim()}: ${r.sillas.join(", ")} · Total ${pesos(r.total)} (${pago.toLowerCase()}).`,
        });
        setElegidas({});
        setEstudiante("");
        setPago("");
        setNota("");
        await refrescar();
      } else {
        if (r.clave === false) return salir();
        if (r.ocupadas) setOcupadas(new Set(r.ocupadas));
        setAviso({ tipo: "mal", texto: r.error });
      }
    } catch {
      setAviso({ tipo: "mal", texto: "No se pudo guardar por la conexión. Revisa en “Ventas registradas” antes de intentar otra vez." });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className={styles.vender}>
      <Leyenda conElegidas />
      <p className={styles.pista}>Desliza el mapa hacia los lados para ver toda la fila.</p>
      <MapaSillas teatro={entrada.teatro} ocupadas={ocupadas} bloqueadas={bloqueadas} seleccionadas={seleccion} alTocar={tocar} tamano="grande" />

      <section className={styles.formulario} aria-label="Datos de la venta">
        <h2 className={styles.subtitulo}>
          {ids.length ? `${ids.length} ${ids.length === 1 ? "silla seleccionada" : "sillas seleccionadas"}` : "Toca las sillas en el mapa"}
        </h2>

        <label className={styles.campo}>
          <span>Nombre del estudiante</span>
          <input value={estudiante} onChange={(e) => { setEstudiante(e.target.value); setAviso(null); }} autoComplete="off" placeholder="Nombre y apellido" />
        </label>

        <label className={styles.campo}>
          <span>Tipo de boleta para toda la compra</span>
          <select value={tipoGeneral} onChange={(e) => cambiarTipoGeneral(e.target.value)}>
            {tipos.map((t) => (
              <option key={t} value={t}>
                {t} · {pesos(entrada.precios[t])}
              </option>
            ))}
          </select>
        </label>

        {ids.length ? (
          <>
            <ul className={styles.listaElegidas}>
              {ids.map((id) => (
                <li key={id}>
                  <strong className={styles.idSilla}>{id}</strong>
                  <select
                    aria-label={`Tipo de boleta de ${id}`}
                    value={elegidas[id].tipo}
                    onChange={(e) => setElegidas((p) => ({ ...p, [id]: { ...p[id], tipo: e.target.value } }))}
                  >
                    {tipos.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <button type="button" className={styles.quitar} onClick={() => tocar(id)} aria-label={`Quitar ${id}`}>
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : null}

        <fieldset className={styles.pagos}>
          <legend>Forma de pago</legend>
          {entrada.pagos.map((p) => (
            <label key={p}>
              <input type="radio" name="pago" value={p} checked={pago === p} onChange={() => { setPago(p); setAviso(null); }} /> {p}
            </label>
          ))}
        </fieldset>

        <label className={styles.campo}>
          <span>Nota (opcional)</span>
          <input value={nota} onChange={(e) => setNota(e.target.value)} placeholder="Ej. paga la mamá, falta comprobante…" />
        </label>

        <p className={styles.total}>
          Total: <strong>{pesos(total)}</strong>
        </p>

        {aviso ? (
          <p className={aviso.tipo === "bien" ? styles.avisoBien : styles.avisoError} role="status">
            {aviso.texto}
          </p>
        ) : null}

        <button type="button" className={`${styles.botonDorado} ${styles.botonAncho}`} onClick={registrar} disabled={enviando}>
          {enviando ? "Guardando…" : "Registrar venta"}
        </button>
      </section>
    </div>
  );
}

function Ventas({
  clave,
  teatro,
  refrescar,
  salir,
}: {
  clave: string;
  teatro: Entrada["teatro"];
  refrescar: () => Promise<void>;
  salir: () => void;
}) {
  const [ventas, setVentas] = useState<Venta[] | null>(null);
  const [buscar, setBuscar] = useState("");
  const [pendiente, setPendiente] = useState<{ idVenta: string; sillas?: string[] } | null>(null);
  const [aviso, setAviso] = useState<Aviso>(null);
  const [trabajando, setTrabajando] = useState(false);

  const cargar = useCallback(async () => {
    try {
      const r = await enviar<{ ventas: Venta[] }>({ accion: "ventas", clave });
      if (r.ok) setVentas(r.ventas);
      else if (r.clave === false) salir();
      else setAviso({ tipo: "mal", texto: r.error });
    } catch {
      setAviso({ tipo: "mal", texto: "No se pudieron cargar las ventas. Revisa la conexión." });
    }
  }, [clave, salir]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const anular = async () => {
    if (!pendiente) return;
    setTrabajando(true);
    try {
      const r = await enviar<{ anuladas: string[] }>({ accion: "anular", clave, ...pendiente });
      if (r.ok) {
        setPendiente(null);
        await Promise.all([cargar(), refrescar()]);
        setAviso({ tipo: "bien", texto: `Anuladas: ${r.anuladas.join(", ")}. Esas sillas quedan libres.` });
      } else setAviso({ tipo: "mal", texto: r.error });
    } catch {
      setAviso({ tipo: "mal", texto: "No se pudo anular por la conexión. Intenta de nuevo." });
    } finally {
      setTrabajando(false);
    }
  };

  const q = buscar.trim().toLowerCase();
  const filtradas = (ventas ?? []).filter(
    (v) =>
      !q ||
      v.estudiante.toLowerCase().includes(q) ||
      v.idVenta.toLowerCase().includes(q) ||
      v.sillas.some((s) => s.id.toLowerCase() === q),
  );
  const activas = (ventas ?? []).reduce((a, v) => a + v.sillas.filter((s) => s.estado === "Vendida").length, 0);

  return (
    <div className={styles.ventas}>
      <div className={styles.buscador}>
        <label className={styles.campo}>
          <span>Buscar por estudiante o silla (F-8)</span>
          <input value={buscar} onChange={(e) => setBuscar(e.target.value)} placeholder="Buscar…" />
        </label>
        <button type="button" className={styles.botonBorde} onClick={cargar}>
          Actualizar
        </button>
      </div>
      <p className={styles.nota}>{ventas ? `${activas} ${activas === 1 ? "boleta vendida" : "boletas vendidas"} en ${ventas.length} ${ventas.length === 1 ? "venta" : "ventas"}.` : "Cargando ventas…"}</p>
      {aviso ? <p className={aviso.tipo === "bien" ? styles.avisoBien : styles.avisoError} role="status">{aviso.texto}</p> : null}

      <ul className={styles.listaVentas}>
        {filtradas.map((v) => {
          const vivas = v.sillas.filter((s) => s.estado === "Vendida");
          return (
            <li key={v.idVenta} className={styles.tarjetaVenta}>
              <div className={styles.cabezaVenta}>
                <strong>{v.estudiante}</strong>
                <span>{pesos(v.total)}</span>
              </div>
              <p className={styles.metaVenta}>
                {v.fecha} · {v.pago} · {v.vendedor} · {v.idVenta}
              </p>
              {v.nota ? <p className={styles.metaVenta}>Nota: {v.nota}</p> : null}
              <ul className={styles.chipsSillas}>
                {ordenarSillas(v.sillas.map((s) => s.id), teatro).map((id) => {
                  const s = v.sillas.find((x) => x.id === id)!;
                  const anulada = s.estado !== "Vendida";
                  return (
                    <li key={id} className={anulada ? styles.chipAnulado : styles.chip}>
                      {id} · {s.tipo}
                      {!anulada && vivas.length > 1 ? (
                        <button type="button" onClick={() => setPendiente({ idVenta: v.idVenta, sillas: [id] })} aria-label={`Anular solo ${id}`}>
                          ×
                        </button>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
              {vivas.length ? (
                pendiente?.idVenta === v.idVenta ? (
                  <div className={styles.confirmar}>
                    <p>
                      ¿Anular {pendiente.sillas ? pendiente.sillas.join(", ") : "toda la venta"}? Las sillas quedan libres.
                    </p>
                    <button type="button" className={styles.botonPeligro} onClick={anular} disabled={trabajando}>
                      {trabajando ? "Anulando…" : "Sí, anular"}
                    </button>
                    <button type="button" className={styles.botonBorde} onClick={() => setPendiente(null)}>
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button type="button" className={styles.botonTexto} onClick={() => setPendiente({ idVenta: v.idVenta })}>
                    Anular venta
                  </button>
                )
              ) : (
                <p className={styles.metaVenta}>Venta anulada</p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
