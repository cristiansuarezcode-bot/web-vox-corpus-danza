"use client";

import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { Camera, Pencil } from "lucide-react";
import { pesos } from "../config";
import {
  BOLETERIA_API,
  enviar,
  ordenarSillas,
  pedirMapa,
  type Entrada,
  type FilaResumen,
  type Venta,
} from "./boleteria";
import Finanzas from "./Finanzas";
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
  const [pestana, setPestana] = useState<"vender" | "ventas" | "resumen" | "finanzas">("vender");
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
        {entrada.verResumen ? (
          <button type="button" role="tab" aria-selected={pestana === "resumen"} onClick={() => setPestana("resumen")}>
            Resumen
          </button>
        ) : null}
        {entrada.verResumen ? (
          <button type="button" role="tab" aria-selected={pestana === "finanzas"} onClick={() => setPestana("finanzas")}>
            Finanzas
          </button>
        ) : null}
      </div>

      {pestana === "vender" ? (
        <Vender entrada={entrada} clave={clave} ocupadas={ocupadas} bloqueadas={bloqueadas} refrescar={refrescar} salir={salir} setOcupadas={setOcupadas} />
      ) : pestana === "ventas" ? (
        <Ventas clave={clave} teatro={entrada.teatro} refrescar={refrescar} salir={salir} />
      ) : pestana === "resumen" ? (
        <Resumen clave={clave} salir={salir} />
      ) : (
        <Finanzas clave={clave} salir={salir} />
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
  const [pago, setPago] = useState(""); // "Efectivo", "Transferencia" o MIXTO
  const [cuenta, setCuenta] = useState("");
  const [efectivoMixto, setEfectivoMixto] = useState(""); // solo dígitos
  const [paquetes, setPaquetes] = useState(0);
  const [ventasHechas, setVentasHechas] = useState(0); // reinicia el buscador después de cada venta
  const [nota, setNota] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [aviso, setAviso] = useState<Aviso>(null);

  const ids = ordenarSillas(Object.keys(elegidas), entrada.teatro);
  const seleccion = useMemo(() => new Set(Object.keys(elegidas)), [elegidas]);
  const totalSillas = ids.reduce((a, id) => a + (entrada.precios[elegidas[id].tipo] ?? 0), 0);
  const paquete = entrada.paquete && entrada.paquete.precio > 0 ? entrada.paquete : null;
  const totalPaquetes = paquete ? paquetes * paquete.precio : 0;
  const total = totalSillas + totalPaquetes;
  const enEfectivo = Number(efectivoMixto) || 0;
  const enTransferencia = Math.max(total - enEfectivo, 0);

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

  const cuentas = entrada.cuentas ?? [];
  const pideCuenta = (pago === "Transferencia" || pago === MIXTO) && cuentas.length > 0;

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
    if (!ids.length && !paquetes) return setAviso({ tipo: "mal", texto: "Toca en el mapa las sillas que la familia escogió, o agrega el paquete audiovisual." });
    if (!estudiante.trim()) return setAviso({ tipo: "mal", texto: "Busca y selecciona el estudiante." });
    if (!pago) return setAviso({ tipo: "mal", texto: "Escoge cómo pagó." });
    if (pago === MIXTO && total > 0 && !(enEfectivo > 0 && enEfectivo < total)) {
      return setAviso({ tipo: "mal", texto: `Escribe cuánto pagó en efectivo: debe ser más de $0 y menos de ${pesos(total)}.` });
    }
    if (pideCuenta && !cuenta) return setAviso({ tipo: "mal", texto: "Escoge a qué cuenta llegó la transferencia." });

    const pagos =
      total === 0
        ? []
        : pago === MIXTO
          ? [
              { forma: "Efectivo", valor: enEfectivo },
              { forma: "Transferencia", cuenta, valor: enTransferencia },
            ]
          : [{ forma: pago, cuenta: pideCuenta ? cuenta : "", valor: total }];

    setEnviando(true);
    try {
      const r = await enviar<{ idVenta: string; total: number; sillas: string[]; paquetes?: number }>({
        accion: "vender",
        clave,
        estudiante: estudiante.trim(),
        pago: pago === MIXTO ? "Efectivo" : pago, // por si el programa de Google aún es el anterior
        cuenta: pideCuenta ? cuenta : "",
        pagos,
        paquetes,
        nota: nota.trim(),
        sillas: ids.map((id) => {
          const [fila, silla] = id.split("-");
          return { fila, silla: Number(silla), tipo: elegidas[id].tipo, boleta: id }; // la boleta se identifica por fila y silla
        }),
      });
      if (r.ok) {
        const partes = [
          r.sillas.length ? r.sillas.join(", ") : "",
          paquetes ? (paquetes === 1 ? "paquete audiovisual" : `${paquetes} paquetes audiovisuales`) : "",
        ].filter(Boolean);
        const comoPago =
          pago === MIXTO
            ? `${pesos(enEfectivo)} en efectivo y ${pesos(enTransferencia)} por transferencia a ${cuenta}`
            : `${pago.toLowerCase()}${pideCuenta ? ` a ${cuenta}` : ""}`;
        setAviso({
          tipo: "bien",
          texto: `Venta registrada para ${estudiante.trim()}: ${partes.join(" + ")} · Total ${pesos(r.total)} (${comoPago}).`,
        });
        setElegidas({});
        setEstudiante("");
        setPago("");
        setCuenta("");
        setEfectivoMixto("");
        setPaquetes(0);
        setVentasHechas((n) => n + 1);
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
          {ids.length
            ? `${ids.length} ${ids.length === 1 ? "silla seleccionada" : "sillas seleccionadas"}`
            : paquetes
              ? "Solo paquete audiovisual"
              : "Toca las sillas en el mapa"}
        </h2>

        <BuscadorEstudiante
          key={ventasHechas}
          estudiantes={entrada.estudiantes ?? []}
          valor={estudiante}
          alCambiar={(n) => { setEstudiante(n); setAviso(null); }}
        />

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

        {paquete ? (
          <div className={styles.paquete}>
            <div>
              <strong>Paquete audiovisual</strong>
              <span>
                {pesos(paquete.precio)} c/u
                {paquete.enPreventa ? ` · preventa hasta el ${fechaCorta(paquete.finPreventa)}` : ""}
              </span>
            </div>
            <div className={styles.contador} role="group" aria-label="Cantidad de paquetes audiovisuales">
              <button type="button" onClick={() => { setPaquetes((n) => Math.max(n - 1, 0)); setAviso(null); }} disabled={!paquetes} aria-label="Quitar un paquete">
                −
              </button>
              <output aria-live="polite">{paquetes}</output>
              <button type="button" onClick={() => { setPaquetes((n) => Math.min(n + 1, 10)); setAviso(null); }} disabled={paquetes >= 10} aria-label="Agregar un paquete">
                +
              </button>
            </div>
          </div>
        ) : null}

        <fieldset className={styles.pagos}>
          <legend>Forma de pago</legend>
          {entrada.pagos.map((p) => (
            <label key={p}>
              <input type="radio" name="pago" value={p} checked={pago === p} onChange={() => { setPago(p); setAviso(null); }} /> {p}
            </label>
          ))}
          <label>
            <input type="radio" name="pago" value={MIXTO} checked={pago === MIXTO} onChange={() => { setPago(MIXTO); setAviso(null); }} /> Una parte y otra parte
          </label>
        </fieldset>

        {pago === MIXTO ? (
          <div className={styles.mixto}>
            <label className={styles.campo}>
              <span>¿Cuánto pagó en efectivo?</span>
              <input
                inputMode="numeric"
                value={efectivoMixto ? pesos(enEfectivo) : ""}
                onChange={(e) => { setEfectivoMixto(e.target.value.replace(/\D/g, "").slice(0, 9)); setAviso(null); }}
                placeholder="$0"
              />
            </label>
            <p>
              Por transferencia: <strong>{pesos(enTransferencia)}</strong>
            </p>
          </div>
        ) : null}

        {pideCuenta ? (
          <fieldset className={styles.pagos}>
            <legend>{pago === MIXTO ? "¿A qué cuenta llegó la parte de transferencia?" : "¿A qué cuenta llegó la transferencia?"}</legend>
            {cuentas.map((c) => (
              <label key={c}>
                <input type="radio" name="cuenta" value={c} checked={cuenta === c} onChange={() => { setCuenta(c); setAviso(null); }} /> {c}
              </label>
            ))}
          </fieldset>
        ) : null}

        <label className={styles.campo}>
          <span>Nota (opcional)</span>
          <input value={nota} onChange={(e) => setNota(e.target.value)} placeholder="Ej. paga la mamá, falta comprobante…" />
        </label>

        <p className={styles.total}>
          Total: <strong>{pesos(total)}</strong>
          {totalPaquetes && totalSillas ? (
            <span className={styles.desglose}>
              Boletas {pesos(totalSillas)} + paquete{paquetes > 1 ? "s" : ""} {pesos(totalPaquetes)}
            </span>
          ) : null}
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
  const [pendiente, setPendiente] = useState<{ idVenta: string; sillas?: string[]; paquete?: boolean } | null>(null);
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
      const r = await enviar<{ anuladas: string[]; devolucion?: number }>({ accion: "anular", clave, ...pendiente });
      if (r.ok) {
        setPendiente(null);
        await Promise.all([cargar(), refrescar()]);
        const devolucion = r.devolucion ? ` Quedó registrada una devolución de ${pesos(r.devolucion)}.` : "";
        setAviso({ tipo: "bien", texto: `Anulado: ${r.anuladas.join(", ")}.${devolucion}` });
      } else setAviso({ tipo: "mal", texto: r.error });
    } catch {
      setAviso({ tipo: "mal", texto: "No se pudo anular por la conexión. Intenta de nuevo." });
    } finally {
      setTrabajando(false);
    }
  };

  const q = sinTildes(buscar.trim());
  const filtradas = (ventas ?? []).filter(
    (v) =>
      !q ||
      sinTildes(v.estudiante).includes(q) ||
      v.idVenta.toLowerCase().includes(q) ||
      v.sillas.some((s) => s.id.toLowerCase() === q),
  );
  const activas = (ventas ?? []).reduce((a, v) => a + v.sillas.filter((s) => s.estado === "Vendida").length, 0);
  const paquetesVendidos = (ventas ?? []).reduce((a, v) => a + (v.paquetes?.estado === "Vendido" ? v.paquetes.cantidad : 0), 0);

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
      <p className={styles.nota}>
        {ventas
          ? `${activas} ${activas === 1 ? "boleta vendida" : "boletas vendidas"} y ${paquetesVendidos} ${paquetesVendidos === 1 ? "paquete" : "paquetes"} en ${ventas.length} ${ventas.length === 1 ? "venta" : "ventas"}.`
          : "Cargando ventas…"}
      </p>
      {aviso ? <p className={aviso.tipo === "bien" ? styles.avisoBien : styles.avisoError} role="status">{aviso.texto}</p> : null}

      <ul className={styles.listaVentas}>
        {filtradas.map((v) => {
          const vivas = v.sillas.filter((s) => s.estado === "Vendida");
          const paqVivo = v.paquetes?.estado === "Vendido" && v.paquetes.cantidad > 0;
          const partesVivas = vivas.length + (paqVivo ? 1 : 0);
          const detallePago = describirPagos(v);
          return (
            <li key={v.idVenta} className={styles.tarjetaVenta}>
              <div className={styles.cabezaVenta}>
                <strong>{v.estudiante}</strong>
                <span>{pesos(v.total)}</span>
              </div>
              <p className={styles.metaVenta}>
                {v.fecha} · {v.vendedor} · {v.idVenta}
              </p>
              <p className={styles.metaVenta}>{detallePago || `${v.pago}${v.cuenta ? ` (${v.cuenta})` : ""}`}</p>
              {v.nota ? <p className={styles.metaVenta}>Nota: {v.nota}</p> : null}
              <ul className={styles.chipsSillas}>
                {ordenarSillas(v.sillas.map((s) => s.id), teatro).map((id) => {
                  const s = v.sillas.find((x) => x.id === id)!;
                  const anulada = s.estado !== "Vendida";
                  return (
                    <li key={id} className={anulada ? styles.chipAnulado : styles.chip}>
                      {id} · {s.tipo}
                      {!anulada && partesVivas > 1 ? (
                        <button type="button" onClick={() => setPendiente({ idVenta: v.idVenta, sillas: [id] })} aria-label={`Anular solo ${id}`}>
                          ×
                        </button>
                      ) : null}
                    </li>
                  );
                })}
                {v.paquetes && v.paquetes.cantidad ? (
                  <li className={paqVivo ? `${styles.chip} ${styles.chipPaquete}` : styles.chipAnulado}>
                    <Camera size={13} aria-hidden="true" />
                    {v.paquetes.cantidad === 1 ? "Paquete audiovisual" : `${v.paquetes.cantidad} paquetes audiovisuales`}
                    {paqVivo && partesVivas > 1 ? (
                      <button type="button" onClick={() => setPendiente({ idVenta: v.idVenta, paquete: true })} aria-label="Anular solo el paquete">
                        ×
                      </button>
                    ) : null}
                  </li>
                ) : null}
              </ul>
              {partesVivas ? (
                pendiente?.idVenta === v.idVenta ? (
                  <div className={styles.confirmar}>
                    <p>
                      {pendiente.paquete
                        ? "¿Anular solo el paquete audiovisual? Queda registrada la devolución."
                        : pendiente.sillas
                          ? `¿Anular ${pendiente.sillas.join(", ")}? La silla queda libre y se registra la devolución.`
                          : "¿Anular toda la venta? Las sillas quedan libres."}
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

/** Minúsculas y sin tildes, para que "maria" encuentre "María". */
function sinTildes(t: string) {
  return t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

const MAX_RESULTADOS = 8;

/**
 * Busca el estudiante en la lista de la hoja y lo deja seleccionado.
 * Si no está, se puede escribir el nombre a mano.
 */
function BuscadorEstudiante({
  estudiantes,
  valor,
  alCambiar,
}: {
  estudiantes: string[];
  valor: string;
  alCambiar: (nombre: string) => void;
}) {
  const id = useId();
  const [texto, setTexto] = useState("");
  const [activo, setActivo] = useState(0);
  const [aMano, setAMano] = useState(false);

  const indice = useMemo(() => estudiantes.map((n) => ({ nombre: n, clave: sinTildes(n) })), [estudiantes]);
  const palabras = sinTildes(texto.trim()).split(/\s+/).filter(Boolean);
  const resultados = palabras.length
    ? indice.filter((e) => palabras.every((p) => e.clave.includes(p))).slice(0, MAX_RESULTADOS)
    : [];
  // Al final de los resultados va la opción de escribir el nombre a mano (null).
  const opciones = resultados.length ? [...resultados.map((r) => r.nombre), null] : [];
  const sinCoincidencias = palabras.length > 0 && !resultados.length;

  // Sin lista en la hoja: casilla normal, como antes.
  if (!estudiantes.length || aMano) {
    return (
      <label className={styles.campo}>
        <span>Nombre del estudiante</span>
        <input value={valor} onChange={(e) => alCambiar(e.target.value)} autoComplete="off" placeholder="Nombre y apellido" autoFocus={aMano} />
        {aMano ? (
          <button type="button" className={styles.botonCambiar} onClick={() => { setAMano(false); alCambiar(""); }}>
            Volver a buscar en la lista
          </button>
        ) : null}
      </label>
    );
  }

  if (valor) {
    return (
      <div className={styles.campo}>
        <span>Estudiante</span>
        <div className={styles.estudianteElegido}>
          <strong>{valor}</strong>
          <button type="button" className={styles.botonCambiar} onClick={() => { alCambiar(""); setTexto(""); }}>
            Cambiar
          </button>
        </div>
      </div>
    );
  }

  const irAMano = () => {
    setAMano(true);
    alCambiar(texto.trim());
  };

  const elegir = (i: number) => {
    const o = opciones[i];
    if (o === undefined) return;
    if (o === null) irAMano();
    else alCambiar(o);
  };

  return (
    <div className={styles.campo}>
      <label htmlFor={`${id}-q`}>Estudiante</label>
      <input
        id={`${id}-q`}
        value={texto}
        onChange={(e) => { setTexto(e.target.value); setActivo(0); }}
        onKeyDown={(e) => {
          if (sinCoincidencias && e.key === "Enter") { e.preventDefault(); irAMano(); return; }
          if (!opciones.length) return;
          if (e.key === "ArrowDown") { e.preventDefault(); setActivo((a) => Math.min(a + 1, opciones.length - 1)); }
          else if (e.key === "ArrowUp") { e.preventDefault(); setActivo((a) => Math.max(a - 1, 0)); }
          else if (e.key === "Enter") { e.preventDefault(); elegir(activo); }
        }}
        role="combobox"
        aria-expanded={opciones.length > 0}
        aria-controls={`${id}-lista`}
        aria-activedescendant={opciones.length ? `${id}-${activo}` : undefined}
        autoComplete="off"
        placeholder="Escribe nombre o apellido…"
      />
      {opciones.length ? (
        <ul id={`${id}-lista`} role="listbox" className={styles.resultados}>
          {opciones.map((o, i) => (
            <li
              key={o ?? "__a-mano"}
              id={`${id}-${i}`}
              role="option"
              aria-selected={i === activo}
              className={o === null ? styles.resultadoAMano : undefined}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => elegir(i)}
            >
              {o ?? (
                <>
                  <Pencil size={14} aria-hidden="true" /> No está en la lista: escribir «{texto.trim()}» a mano
                </>
              )}
            </li>
          ))}
        </ul>
      ) : null}
      {sinCoincidencias ? (
        <div className={styles.sinResultados} role="status">
          <p>No encontramos «{texto.trim()}» en la lista. Revisa cómo lo escribiste o busca por el apellido.</p>
          <button type="button" className={styles.botonAMano} onClick={irAMano}>
            <Pencil size={14} aria-hidden="true" /> Si no está, escribir el nombre a mano
          </button>
        </div>
      ) : null}
    </div>
  );
}

const MIXTO = "Mixto";

/** "2026-11-26" → "26 de noviembre". */
function fechaCorta(iso: string) {
  const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const [, m, d] = iso.split("-").map(Number);
  return m && d ? `${d} de ${meses[m - 1]}` : iso;
}

/** "Pagó $100.000 en efectivo + $150.000 por transferencia (Cuenta Liz)", con devoluciones si las hay. */
function describirPagos(v: Venta) {
  const validos = (v.pagos ?? []).filter((p) => p.estado === "Válido");
  if (!validos.length) return "";
  const parte = (p: { forma: string; cuenta: string; valor: number }) =>
    `${pesos(Math.abs(p.valor))} ${p.forma === "Efectivo" ? "en efectivo" : "por transferencia"}${p.cuenta ? ` (${p.cuenta})` : ""}`;
  const pagos = validos.filter((p) => p.valor > 0).map(parte);
  const devoluciones = validos.filter((p) => p.valor < 0).map(parte);
  return [pagos.length ? `Pagó ${pagos.join(" + ")}` : "", devoluciones.length ? `Devuelto ${devoluciones.join(" + ")}` : ""]
    .filter(Boolean)
    .join(" · ");
}

/** Cifras principales arriba; el resto, en la lista completa. */
const DESTACADOS = ["Recaudo total (pagos recibidos)", "Boletas vendidas", "Sillas disponibles", "Paquetes audiovisuales vendidos"];
const NOMBRE_CORTO: Record<string, string> = {
  "Recaudo total (pagos recibidos)": "Recaudo total",
  "Paquetes audiovisuales vendidos": "Paquetes",
};

/** El resumen de la hoja, solo para los directores. */
function Resumen({ clave, salir }: { clave: string; salir: () => void }) {
  const [filas, setFilas] = useState<FilaResumen[] | null>(null);
  const [actualizado, setActualizado] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError("");
    try {
      const r = await enviar<{ filas: FilaResumen[]; actualizado: string }>({ accion: "resumen", clave });
      if (r.ok) {
        setFilas(r.filas);
        setActualizado(r.actualizado);
      } else if (r.clave === false) salir();
      else setError(r.error);
    } catch {
      setError("No se pudo cargar el resumen. Revisa la conexión.");
    } finally {
      setCargando(false);
    }
  }, [clave, salir]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const valor = (f: FilaResumen) => (f.dinero ? pesos(f.valor) : f.valor.toLocaleString("es-CO"));
  const destacados = DESTACADOS.map((c) => filas?.find((f) => f.concepto === c)).filter((f): f is FilaResumen => !!f);
  const resto = (filas ?? []).filter((f) => !DESTACADOS.includes(f.concepto));

  return (
    <div className={styles.resumen}>
      <div className={styles.barraResumen}>
        <p className={styles.nota}>{actualizado ? `Actualizado: ${actualizado.slice(11, 16)}` : "Cargando…"}</p>
        <button type="button" className={styles.botonBorde} onClick={cargar} disabled={cargando}>
          {cargando ? "Cargando…" : "Actualizar"}
        </button>
      </div>
      {error ? <p className={styles.avisoError} role="alert">{error}</p> : null}

      {destacados.length ? (
        <div className={styles.cifras}>
          {destacados.map((f) => (
            <div key={f.concepto} className={styles.cifra}>
              <span>{NOMBRE_CORTO[f.concepto] ?? f.concepto}</span>
              <strong>{valor(f)}</strong>
            </div>
          ))}
        </div>
      ) : null}

      {resto.length ? (
        <dl className={styles.tablaResumen}>
          {resto.map((f) => {
            const alerta = /debe ser 0/i.test(f.concepto) && f.valor !== 0;
            return (
              <div key={f.concepto} className={alerta ? styles.filaAlerta : undefined}>
                <dt>{f.concepto}</dt>
                <dd>{valor(f)}</dd>
              </div>
            );
          })}
        </dl>
      ) : null}
    </div>
  );
}
