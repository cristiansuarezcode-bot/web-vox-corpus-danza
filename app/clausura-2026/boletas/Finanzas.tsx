"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { pesos } from "../config";
import { enviar, type Finanzas as DatosFinanzas, type GastoFin, type RubroFin } from "./boleteria";
import styles from "./boletas.module.css";

type Aviso = { tipo: "bien" | "mal"; texto: string } | null;
type Seccion = "balance" | "nuevo" | "gastos" | "presupuesto";

const SECCIONES: { id: Seccion; nombre: string }[] = [
  { id: "balance", nombre: "Balance" },
  { id: "nuevo", nombre: "Nuevo gasto" },
  { id: "gastos", nombre: "Gastos" },
  { id: "presupuesto", nombre: "Presupuesto" },
];

function hoyBogota() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Bogota" });
}

/** "2026-10-25" → "25 oct". */
function fechaCorta(iso: string) {
  const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const [, m, d] = iso.split("-").map(Number);
  return m && d ? `${d} ${meses[m - 1]}` : iso;
}

/** Casilla de plata: guarda solo dígitos y muestra $1.234.567. */
function Monto({ valor, alCambiar, etiqueta, placeholder = "$0" }: { valor: string; alCambiar: (v: string) => void; etiqueta: string; placeholder?: string }) {
  return (
    <label className={styles.campo}>
      <span>{etiqueta}</span>
      <input
        inputMode="numeric"
        value={valor ? pesos(Number(valor)) : ""}
        onChange={(e) => alCambiar(e.target.value.replace(/\D/g, "").slice(0, 10))}
        placeholder={placeholder}
      />
    </label>
  );
}

/** Finanzas de la clausura: lo que entra (boletas y paquetes) y lo que se gasta. Solo Cristian y Liz. */
export default function Finanzas({ clave, salir }: { clave: string; salir: () => void }) {
  const [datos, setDatos] = useState<DatosFinanzas | null>(null);
  const [seccion, setSeccion] = useState<Seccion>("balance");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const pedir = useCallback(
    async <T,>(accion: string, extra: Record<string, unknown> = {}) => {
      const r = await enviar<T>({ accion, clave, ...extra });
      if (!r.ok && r.clave === false) salir();
      return r;
    },
    [clave, salir],
  );

  const cargar = useCallback(async () => {
    setCargando(true);
    setError("");
    try {
      const r = await pedir<DatosFinanzas>("finanzas");
      if (r.ok) setDatos(r);
      else setError(r.error);
    } catch {
      setError("No se pudieron cargar las finanzas. Revisa la conexión.");
    } finally {
      setCargando(false);
    }
  }, [pedir]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return (
    <div className={styles.resumen}>
      <div className={styles.barraResumen}>
        <p className={styles.nota}>{datos ? `Actualizado: ${datos.actualizado.slice(11, 16)}` : "Cargando…"}</p>
        <button type="button" className={styles.botonBorde} onClick={cargar} disabled={cargando}>
          {cargando ? "Cargando…" : "Actualizar"}
        </button>
      </div>

      <div className={styles.segmentos} role="tablist" aria-label="Secciones de finanzas">
        {SECCIONES.map((s) => (
          <button key={s.id} type="button" role="tab" aria-selected={seccion === s.id} onClick={() => setSeccion(s.id)}>
            {s.nombre}
          </button>
        ))}
      </div>

      {error ? <p className={styles.avisoError} role="alert">{error}</p> : null}

      {datos ? (
        seccion === "balance" ? (
          <Balance datos={datos} />
        ) : seccion === "nuevo" ? (
          <NuevoGasto datos={datos} pedir={pedir} recargar={cargar} />
        ) : seccion === "gastos" ? (
          <ListaGastos datos={datos} pedir={pedir} recargar={cargar} />
        ) : (
          <Presupuesto datos={datos} pedir={pedir} recargar={cargar} />
        )
      ) : null}
    </div>
  );
}

type Pedir = <T>(accion: string, extra?: Record<string, unknown>) => Promise<(T & { ok: true }) | { ok: false; error: string; clave?: false }>;

function Balance({ datos }: { datos: DatosFinanzas }) {
  const t = datos.totales;
  const rubros = datos.rubros.filter((r) => r.activo || r.pagado);
  return (
    <>
      <div className={`${styles.cifras} ${styles.cifrasFin}`}>
        <div className={styles.cifra}>
          <span>Ingresos (boletas y paquetes)</span>
          <strong>{pesos(t.ingresos)}</strong>
          <small>
            Boletas {pesos(t.boletas)} · Paquetes {pesos(t.paquetes)}
          </small>
        </div>
        <div className={styles.cifra}>
          <span>Gastado</span>
          <strong>{pesos(t.gastado)}</strong>
        </div>
        <div className={styles.cifra}>
          <span>Disponible</span>
          <strong className={t.disponible < 0 ? styles.negativo : undefined}>{pesos(t.disponible)}</strong>
        </div>
        <div className={styles.cifra}>
          <span>Por pagar</span>
          <strong>{pesos(t.porPagar)}</strong>
        </div>
      </div>

      <p className={`${styles.alFinal} ${t.alFinal < 0 ? styles.alFinalMal : ""}`}>
        Si se paga todo lo presupuestado, quedarían <strong>{pesos(t.alFinal)}</strong>
        {t.alFinal < 0 ? ". Faltaría plata para cubrir el presupuesto." : "."}
      </p>

      <section className={styles.bloqueFin}>
        <h3>¿Dónde está la plata?</h3>
        <div className={styles.tablaOrigen}>
          <div className={styles.cabezaOrigen}>
            <span />
            <span>Entró</span>
            <span>Salió</span>
            <span>Queda</span>
          </div>
          {datos.porOrigen.map((o) => (
            <div key={o.origen}>
              <span>{o.origen}</span>
              <span>{pesos(o.entro)}</span>
              <span>{pesos(o.salio)}</span>
              <strong className={o.queda < 0 ? styles.negativo : undefined}>{pesos(o.queda)}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.bloqueFin}>
        <h3>Por rubro</h3>
        {rubros.length ? (
          <ul className={styles.rubros}>
            {rubros.map((r) => (
              <BarraRubro key={r.rubro} r={r} />
            ))}
          </ul>
        ) : (
          <p className={styles.nota}>Todavía no hay rubros.</p>
        )}
      </section>
    </>
  );
}

function BarraRubro({ r }: { r: RubroFin }) {
  const pasado = r.presupuestado > 0 && r.pagado > r.presupuestado;
  const pct = r.presupuestado > 0 ? Math.min((r.pagado / r.presupuestado) * 100, 100) : r.pagado ? 100 : 0;
  const detalle = r.presupuestado
    ? pasado
      ? `Se pasó por ${pesos(r.pagado - r.presupuestado)}`
      : `Faltan ${pesos(r.presupuestado - r.pagado)}`
    : r.pagado
      ? "Sin presupuesto"
      : "Sin presupuesto ni gastos";
  return (
    <li>
      <div className={styles.rubroCabeza}>
        <strong>
          {r.rubro}
          {!r.activo ? <em> (quitado)</em> : null}
        </strong>
        <span>
          {pesos(r.pagado)}
          {r.presupuestado ? ` de ${pesos(r.presupuestado)}` : ""}
        </span>
      </div>
      <div className={styles.barra} aria-hidden="true">
        <div className={pasado ? styles.barraPasada : undefined} style={{ width: `${pct}%` }} />
      </div>
      <small className={pasado ? styles.negativo : undefined}>{detalle}</small>
    </li>
  );
}

function NuevoGasto({ datos, pedir, recargar }: { datos: DatosFinanzas; pedir: Pedir; recargar: () => Promise<void> }) {
  const activos = datos.rubros.filter((r) => r.activo);
  const [fecha, setFecha] = useState(hoyBogota());
  const [rubro, setRubro] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [aQuien, setAQuien] = useState("");
  const [valor, setValor] = useState("");
  const [desde, setDesde] = useState("");
  const [nota, setNota] = useState("");
  const [aviso, setAviso] = useState<Aviso>(null);
  const [enviando, setEnviando] = useState(false);

  const guardar = async () => {
    setAviso(null);
    if (!rubro) return setAviso({ tipo: "mal", texto: "Escoge el rubro." });
    if (!descripcion.trim()) return setAviso({ tipo: "mal", texto: "Escribe en qué se gastó." });
    if (!(Number(valor) > 0)) return setAviso({ tipo: "mal", texto: "Escribe el valor." });
    if (!desde) return setAviso({ tipo: "mal", texto: "Escoge de dónde salió la plata." });
    setEnviando(true);
    try {
      const r = await pedir<{ id: string }>("gasto", {
        fecha,
        rubro,
        descripcion: descripcion.trim(),
        aQuien: aQuien.trim(),
        valor: Number(valor),
        pagadoDesde: desde,
        nota: nota.trim(),
      });
      if (r.ok) {
        setAviso({ tipo: "bien", texto: `Gasto registrado: ${descripcion.trim()} · ${pesos(Number(valor))} (${rubro}, ${desde}).` });
        setDescripcion("");
        setAQuien("");
        setValor("");
        setNota("");
        await recargar();
      } else setAviso({ tipo: "mal", texto: r.error });
    } catch {
      setAviso({ tipo: "mal", texto: "No se pudo guardar por la conexión. Revisa en “Gastos” antes de intentar otra vez." });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className={styles.formulario} aria-label="Registrar gasto">
      <div className={styles.dosColumnas}>
        <label className={styles.campo}>
          <span>Fecha del pago</span>
          <input type="date" value={fecha} max={hoyBogota()} onChange={(e) => setFecha(e.target.value)} />
        </label>
        <label className={styles.campo}>
          <span>Rubro</span>
          <select value={rubro} onChange={(e) => { setRubro(e.target.value); setAviso(null); }}>
            <option value="">Escoge…</option>
            {activos.map((r) => (
              <option key={r.rubro} value={r.rubro}>
                {r.rubro}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className={styles.campo}>
        <span>¿En qué se gastó?</span>
        <input value={descripcion} onChange={(e) => { setDescripcion(e.target.value); setAviso(null); }} placeholder="Ej. abono del teatro, telas para vestuario…" />
      </label>
      <div className={styles.dosColumnas}>
        <label className={styles.campo}>
          <span>¿A quién se le pagó? (opcional)</span>
          <input value={aQuien} onChange={(e) => setAQuien(e.target.value)} placeholder="Proveedor o persona" />
        </label>
        <Monto etiqueta="Valor" valor={valor} alCambiar={(v) => { setValor(v); setAviso(null); }} />
      </div>
      <fieldset className={styles.pagos}>
        <legend>¿De dónde salió la plata?</legend>
        {datos.origenes.map((o) => (
          <label key={o}>
            <input type="radio" name="desde" value={o} checked={desde === o} onChange={() => { setDesde(o); setAviso(null); }} /> {o}
          </label>
        ))}
      </fieldset>
      <label className={styles.campo}>
        <span>Nota (opcional)</span>
        <input value={nota} onChange={(e) => setNota(e.target.value)} placeholder="Ej. falta la factura, segundo abono…" />
      </label>
      {aviso ? (
        <p className={aviso.tipo === "bien" ? styles.avisoBien : styles.avisoError} role="status">
          {aviso.texto}
        </p>
      ) : null}
      <button type="button" className={`${styles.botonDorado} ${styles.botonAncho}`} onClick={guardar} disabled={enviando}>
        {enviando ? "Guardando…" : "Registrar gasto"}
      </button>
    </section>
  );
}

function ListaGastos({ datos, pedir, recargar }: { datos: DatosFinanzas; pedir: Pedir; recargar: () => Promise<void> }) {
  const [filtro, setFiltro] = useState("");
  const [pendiente, setPendiente] = useState("");
  const [aviso, setAviso] = useState<Aviso>(null);
  const [trabajando, setTrabajando] = useState(false);
  const rubros = useMemo(() => [...new Set(datos.gastos.map((g) => g.rubro))].sort((a, b) => a.localeCompare(b, "es")), [datos.gastos]);
  const lista = datos.gastos.filter((g) => !filtro || g.rubro === filtro);
  const total = lista.filter((g) => g.estado === "Válido").reduce((a, g) => a + g.valor, 0);

  const anular = async (g: GastoFin) => {
    setTrabajando(true);
    try {
      const r = await pedir("anularGasto", { id: g.id });
      if (r.ok) {
        setPendiente("");
        await recargar();
        setAviso({ tipo: "bien", texto: `Anulado: ${g.descripcion} (${pesos(g.valor)}).` });
      } else setAviso({ tipo: "mal", texto: r.error });
    } catch {
      setAviso({ tipo: "mal", texto: "No se pudo anular por la conexión. Intenta de nuevo." });
    } finally {
      setTrabajando(false);
    }
  };

  return (
    <div className={styles.ventas}>
      <label className={styles.campo}>
        <span>Rubro</span>
        <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
          <option value="">Todos</option>
          {rubros.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </label>
      <p className={styles.nota}>
        {lista.length ? `${lista.filter((g) => g.estado === "Válido").length} gastos · ${pesos(total)}` : "Todavía no hay gastos registrados."}
      </p>
      {aviso ? <p className={aviso.tipo === "bien" ? styles.avisoBien : styles.avisoError} role="status">{aviso.texto}</p> : null}
      <ul className={styles.listaVentas}>
        {lista.map((g) => {
          const anulado = g.estado !== "Válido";
          return (
            <li key={g.id} className={`${styles.tarjetaVenta} ${anulado ? styles.gastoAnulado : ""}`}>
              <div className={styles.cabezaVenta}>
                <strong>{g.descripcion}</strong>
                <span>{pesos(g.valor)}</span>
              </div>
              <p className={styles.metaVenta}>
                {fechaCorta(g.fecha)} · {g.rubro} · {g.pagadoDesde}
                {g.aQuien ? ` · A: ${g.aQuien}` : ""}
              </p>
              <p className={styles.metaVenta}>
                Registró {g.registradoPor}
                {g.nota ? ` · ${g.nota}` : ""}
              </p>
              {anulado ? (
                <p className={styles.metaVenta}>Gasto anulado</p>
              ) : pendiente === g.id ? (
                <div className={styles.confirmar}>
                  <p>¿Anular este gasto? Deja de contar en el balance.</p>
                  <button type="button" className={styles.botonPeligro} onClick={() => anular(g)} disabled={trabajando}>
                    {trabajando ? "Anulando…" : "Sí, anular"}
                  </button>
                  <button type="button" className={styles.botonBorde} onClick={() => setPendiente("")}>
                    Cancelar
                  </button>
                </div>
              ) : (
                <button type="button" className={styles.botonTexto} onClick={() => setPendiente(g.id)}>
                  Anular gasto
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Presupuesto({ datos, pedir, recargar }: { datos: DatosFinanzas; pedir: Pedir; recargar: () => Promise<void> }) {
  const [aviso, setAviso] = useState<Aviso>(null);
  const [editando, setEditando] = useState("");
  const [quitando, setQuitando] = useState("");
  const [trabajando, setTrabajando] = useState(false);
  const [nuevo, setNuevo] = useState("");
  const [nuevoMonto, setNuevoMonto] = useState("");

  const activos = datos.rubros.filter((r) => r.activo);
  const quitados = datos.rubros.filter((r) => !r.activo);

  const operar = async (extra: Record<string, unknown>, bien: string) => {
    setTrabajando(true);
    setAviso(null);
    try {
      const r = await pedir("rubro", extra);
      if (r.ok) {
        setEditando("");
        setQuitando("");
        await recargar();
        setAviso({ tipo: "bien", texto: bien });
        return true;
      }
      setAviso({ tipo: "mal", texto: r.error });
    } catch {
      setAviso({ tipo: "mal", texto: "No se pudo guardar por la conexión. Intenta de nuevo." });
    } finally {
      setTrabajando(false);
    }
    return false;
  };

  const agregar = async () => {
    if (!nuevo.trim()) return setAviso({ tipo: "mal", texto: "Escribe el nombre del rubro." });
    const ok = await operar({ operacion: "crear", rubro: nuevo.trim(), presupuestado: nuevoMonto ? Number(nuevoMonto) : "" }, `Rubro agregado: ${nuevo.trim()}.`);
    if (ok) {
      setNuevo("");
      setNuevoMonto("");
    }
  };

  return (
    <div className={styles.ventas}>
      <p className={styles.nota}>
        Presupuesto total {pesos(datos.totales.presupuesto)} · Pagado {pesos(datos.totales.gastado)}
      </p>
      {aviso ? <p className={aviso.tipo === "bien" ? styles.avisoBien : styles.avisoError} role="status">{aviso.texto}</p> : null}

      <ul className={styles.listaVentas}>
        {activos.map((r) =>
          editando === r.rubro ? (
            <EditarRubro key={r.rubro} r={r} trabajando={trabajando} cancelar={() => setEditando("")} guardar={(cambios) => operar({ operacion: "editar", rubro: r.rubro, ...cambios }, `Rubro actualizado: ${cambios.nuevoNombre || r.rubro}.`)} />
          ) : (
            <li key={r.rubro} className={styles.tarjetaVenta}>
              <ul className={styles.rubros}>
                <BarraRubro r={r} />
              </ul>
              {r.nota ? <p className={styles.metaVenta}>{r.nota}</p> : null}
              {quitando === r.rubro ? (
                <div className={styles.confirmar}>
                  <p>
                    ¿Quitar {r.rubro}? {r.gastos ? "Sus gastos siguen contando en el balance; solo deja de aparecer para gastos nuevos." : "Deja de aparecer para gastos nuevos."}
                  </p>
                  <button type="button" className={styles.botonPeligro} onClick={() => operar({ operacion: "quitar", rubro: r.rubro }, `Rubro quitado: ${r.rubro}.`)} disabled={trabajando}>
                    {trabajando ? "Quitando…" : "Sí, quitar"}
                  </button>
                  <button type="button" className={styles.botonBorde} onClick={() => setQuitando("")}>
                    Cancelar
                  </button>
                </div>
              ) : (
                <div className={styles.accionesRubro}>
                  <button type="button" className={styles.botonCambiar} onClick={() => { setEditando(r.rubro); setQuitando(""); }}>
                    Editar
                  </button>
                  <button type="button" className={styles.botonTexto} onClick={() => { setQuitando(r.rubro); setEditando(""); }}>
                    Quitar
                  </button>
                </div>
              )}
            </li>
          ),
        )}
      </ul>

      <section className={styles.formulario} aria-label="Agregar rubro">
        <h3 className={styles.subtitulo}>Agregar rubro</h3>
        <div className={styles.dosColumnas}>
          <label className={styles.campo}>
            <span>Nombre</span>
            <input value={nuevo} onChange={(e) => setNuevo(e.target.value)} placeholder="Ej. Hidratación" />
          </label>
          <Monto etiqueta="Presupuesto (opcional)" valor={nuevoMonto} alCambiar={setNuevoMonto} />
        </div>
        <button type="button" className={`${styles.botonBorde} ${styles.botonAncho}`} onClick={agregar} disabled={trabajando}>
          Agregar rubro
        </button>
      </section>

      {quitados.length ? (
        <section className={styles.bloqueFin}>
          <h3>Rubros quitados</h3>
          <ul className={styles.listaQuitados}>
            {quitados.map((r) => (
              <li key={r.rubro}>
                <span>
                  {r.rubro}
                  {r.pagado ? ` · ${pesos(r.pagado)} gastados` : ""}
                </span>
                <button type="button" className={styles.botonCambiar} onClick={() => operar({ operacion: "crear", rubro: r.rubro }, `${r.rubro} vuelve a estar disponible.`)} disabled={trabajando}>
                  Volver a usar
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function EditarRubro({
  r,
  trabajando,
  cancelar,
  guardar,
}: {
  r: RubroFin;
  trabajando: boolean;
  cancelar: () => void;
  guardar: (cambios: { nuevoNombre?: string; presupuestado: number; nota: string }) => void;
}) {
  const [nombre, setNombre] = useState(r.rubro);
  const [monto, setMonto] = useState(r.presupuestado ? String(r.presupuestado) : "");
  const [nota, setNota] = useState(r.nota);
  return (
    <li className={`${styles.tarjetaVenta} ${styles.formulario}`}>
      <div className={styles.dosColumnas}>
        <label className={styles.campo}>
          <span>Nombre</span>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </label>
        <Monto etiqueta="Presupuesto" valor={monto} alCambiar={setMonto} />
      </div>
      <label className={styles.campo}>
        <span>Nota (opcional)</span>
        <input value={nota} onChange={(e) => setNota(e.target.value)} placeholder="Ej. acordado con el teatro, incluye técnico" />
      </label>
      <div className={styles.confirmar}>
        <button
          type="button"
          className={styles.botonDorado}
          disabled={trabajando || !nombre.trim()}
          onClick={() => guardar({ nuevoNombre: nombre.trim() !== r.rubro ? nombre.trim() : undefined, presupuestado: Number(monto) || 0, nota: nota.trim() })}
        >
          {trabajando ? "Guardando…" : "Guardar"}
        </button>
        <button type="button" className={styles.botonBorde} onClick={cancelar}>
          Cancelar
        </button>
      </div>
    </li>
  );
}
