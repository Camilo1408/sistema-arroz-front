import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Play, Stop, UploadSimple } from "@phosphor-icons/react";
import { DEMO } from "@/content/landing.js";

/*
 * Demo del modelo de la tolva.
 *
 * - En vivo: llama al servicio de la Raspberry Pi (tolva_poc/ia_demo, puerto 8001),
 *   que pasa un cuadro de prueba por el modelo y devuelve el porcentaje y las imágenes.
 * - Guardado: si la Pi no responde, o la página se abre por https (el navegador
 *   bloquea llamar a http desde https), muestra resultados calculados antes por el
 *   mismo modelo (public/demo-tolva). Cada resultado dice de dónde salió.
 *
 * La dirección del servicio se puede cambiar con ?demo=http://host:puerto o con
 * VITE_DEMO_API al construir.
 */

const GUARDADO = "/demo-tolva";
const AUTO_MS = 6000;

const fmt = (v, d = 2) =>
  v == null ? "—" : Number(v).toLocaleString("es-CO", { minimumFractionDigits: d, maximumFractionDigits: d });

function apiBase() {
  const q = new URLSearchParams(window.location.search).get("demo");
  return (q || import.meta.env.VITE_DEMO_API || DEMO.api).replace(/\/$/, "");
}

const bloqueadoPorHttps = (base) => window.location.protocol === "https:" && base.startsWith("http:");

// Lugar donde corrió el modelo, dicho en palabras: solo «Raspberry Pi» si es ARM.
function dondeCorre(equipo) {
  if (!equipo) return "la central";
  return /^(aarch64|arm)/i.test(equipo.arquitectura) ? "la Raspberry Pi" : `el equipo ${equipo.nombre}`;
}

function desdeGuardado(c, modelo) {
  return {
    clave: `g-${c.base}`,
    fuente: "guardado",
    nombre: c.nombre,
    porcentaje: c.porcentaje,
    ancho: c.ancho,
    alto: c.alto,
    zona: c.zona,
    zoomOriginal: `${GUARDADO}/${c.base}-zoom-original.webp`,
    zoomModelo: `${GUARDADO}/${c.base}-zoom-modelo.webp`,
    completo: `${GUARDADO}/${c.base}-completo.webp`,
    modelo,
  };
}

function desdeApi(base, r, estado) {
  const u = (t) => `${base}/api/imagen/${r.id}/${t}.jpg`;
  return {
    clave: `v-${r.id}`,
    fuente: r.fuente === "subida" ? "subida" : "vivo",
    nombre: r.nombre,
    porcentaje: r.porcentaje,
    ancho: r.ancho,
    alto: r.alto,
    zona: r.zona,
    latencia: r.latencia_ms,
    donde: dondeCorre(estado?.equipo),
    zoomOriginal: u("zoom_original"),
    zoomModelo: u("zoom_resultado"),
    completo: u("original"),
    modelo: { ...r.modelo, carpeta: estado?.modelo?.carpeta },
  };
}

export function TolvaDemo() {
  const baseRef = useRef("");
  const [modo, setModo] = useState("buscando"); // buscando | vivo | guardado
  const [estado, setEstado] = useState(null); // /api/estado de la Pi
  const estadoRef = useRef(null); // el mismo, para leerlo al terminar una petición
  const [manifiesto, setManifiesto] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [ocupado, setOcupado] = useState(false);
  const [aviso, setAviso] = useState("");
  const [auto, setAuto] = useState(false);
  const indiceGuardado = useRef(0);
  const ocupadoRef = useRef(false);

  // Resultados guardados: siempre se cargan, son el respaldo
  useEffect(() => {
    fetch(`${GUARDADO}/manifiesto.json`)
      .then((r) => r.json())
      .then((m) => {
        setManifiesto(m);
        const inicial = m.cuadros.findIndex((c) => c.nombre === DEMO.firstFrame);
        indiceGuardado.current = Math.max(inicial, 0);
        setResultado((cur) => cur ?? desdeGuardado(m.cuadros[indiceGuardado.current], m.modelo));
      })
      .catch(() => {});
  }, []);

  // ¿Responde la Pi? Se vuelve a preguntar cada 10 s
  const comprobar = useCallback(async () => {
    const base = baseRef.current;
    if (bloqueadoPorHttps(base)) {
      setModo("guardado");
      return;
    }
    try {
      const r = await fetch(`${base}/api/estado`, { signal: AbortSignal.timeout(2500) });
      const e = await r.json();
      estadoRef.current = e;
      setEstado(e);
      setModo(e.modelo && e.repeticion ? "vivo" : "guardado");
    } catch {
      estadoRef.current = null;
      setEstado(null);
      setModo("guardado");
    }
  }, []);

  useEffect(() => {
    baseRef.current = apiBase();
    comprobar();
    if (bloqueadoPorHttps(baseRef.current)) return;
    const t = setInterval(() => !ocupadoRef.current && comprobar(), 10000);
    return () => clearInterval(t);
  }, [comprobar]);

  const siguienteGuardado = useCallback(() => {
    if (!manifiesto) return;
    indiceGuardado.current = (indiceGuardado.current + 1) % manifiesto.cuadros.length;
    setResultado(desdeGuardado(manifiesto.cuadros[indiceGuardado.current], manifiesto.modelo));
  }, [manifiesto]);

  const pedir = useCallback(
    async (ruta, opciones = {}) => {
      if (ocupadoRef.current) return;
      ocupadoRef.current = true;
      setOcupado(true);
      setAviso("");
      try {
        const res = await fetch(`${baseRef.current}${ruta}`, { method: "POST", ...opciones });
        const j = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(j.detail || `error ${res.status}`);
        if (j.estado !== "valido") {
          setAviso(j.estado === "sin_modelo" ? "Sin modelo cargado: no se muestra ningún número." : j.motivo || "Imagen no evaluable.");
          return;
        }
        // Precarga las imágenes antes de cambiar, para que el cambio sea limpio
        const nuevo = desdeApi(baseRef.current, j, estadoRef.current);
        await Promise.all(
          [nuevo.zoomOriginal, nuevo.zoomModelo].map(
            (src) => new Promise((ok) => Object.assign(new Image(), { onload: ok, onerror: ok, src })),
          ),
        );
        setResultado(nuevo);
      } catch (e) {
        if (e instanceof TypeError) {
          // No hubo respuesta: se sigue con lo guardado
          setModo("guardado");
          setAviso("La Raspberry Pi no respondió. Se muestra un resultado guardado del mismo modelo.");
          siguienteGuardado();
        } else {
          setAviso(e.message);
        }
      } finally {
        ocupadoRef.current = false;
        setOcupado(false);
      }
    },
    [siguienteGuardado],
  );

  const siguiente = useCallback(() => {
    if (modo === "vivo") pedir("/api/inferir/repeticion");
    else siguienteGuardado();
  }, [modo, pedir, siguienteGuardado]);

  // Automático: un cuadro cada 6 s
  const siguienteRef = useRef(siguiente);
  siguienteRef.current = siguiente;
  useEffect(() => {
    if (!auto) return;
    siguienteRef.current();
    const t = setInterval(() => siguienteRef.current(), AUTO_MS);
    return () => clearInterval(t);
  }, [auto]);

  const subir = (e) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    const fd = new FormData();
    fd.append("foto", f);
    pedir("/api/inferir/subir", { body: fd });
  };

  const cambiarVersion = async (v) => {
    if (ocupadoRef.current || estado?.modelo?.carpeta === v) return;
    ocupadoRef.current = true;
    setOcupado(true);
    try {
      await fetch(`${baseRef.current}/api/modelo/${encodeURIComponent(v)}`, { method: "POST" });
      await comprobar();
    } finally {
      ocupadoRef.current = false;
      setOcupado(false);
    }
    pedir("/api/inferir/repeticion");
  };

  const vivo = modo === "vivo";
  const modeloActual = vivo ? estado.modelo : manifiesto?.modelo;
  const metricas = vivo
    ? [estado.modelo.metricas_prueba_modelo, estado.modelo.metricas_prueba_regla_color]
    : manifiesto && [manifiesto.metricas_modelo, manifiesto.metricas_regla_color];

  return (
    <div>
      <EstadoConexion modo={modo} estado={estado} https={baseRef.current && bloqueadoPorHttps(baseRef.current)} />

      <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <Comparador resultado={resultado} ocupado={ocupado} donde={vivo ? dondeCorre(estado?.equipo) : null} />
        </div>

        <div className="flex flex-col lg:col-span-5">
          <Cuadro resultado={resultado} />

          <p className="mt-8 text-7xl font-bold tracking-tight text-straw sm:text-8xl" aria-live="polite">
            {resultado ? `${fmt(resultado.porcentaje)} %` : "—"}
          </p>
          <p className="mt-2 text-lg font-semibold text-paper">{DEMO.measure}</p>
          <p className="text-sm text-paper/60">{DEMO.measureNote}</p>

          <p className="mt-6 border-t border-paper/15 pt-4 text-sm text-paper/75">
            <Origen resultado={resultado} />
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={siguiente}
              disabled={ocupado || !resultado}
              className="group inline-flex items-center gap-2 rounded-full bg-straw px-6 py-3 text-base font-semibold text-ink transition-transform duration-500 ease-fluid hover:-translate-y-0.5 active:translate-y-px disabled:cursor-wait disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {ocupado ? "Analizando…" : vivo ? DEMO.actions.next : DEMO.actions.nextSaved}
              <ArrowRight weight="bold" className="h-4 w-4 transition-transform duration-500 ease-fluid group-hover:translate-x-0.5" />
            </button>
            <button
              type="button"
              onClick={() => setAuto((a) => !a)}
              aria-pressed={auto}
              className={`inline-flex items-center gap-2 rounded-full border px-5 py-3 text-base font-semibold transition-colors duration-500 ease-fluid ${
                auto ? "border-straw bg-straw/15 text-straw" : "border-paper/30 text-paper hover:border-paper"
              }`}
            >
              {auto ? <Stop weight="fill" className="h-4 w-4" /> : <Play weight="fill" className="h-4 w-4" />}
              {auto ? DEMO.actions.stop : DEMO.actions.auto}
            </button>
          </div>

          {vivo && (
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
              {estado.versiones.length > 1 && (
                <div role="radiogroup" aria-label="Versión del modelo" className="inline-flex rounded-full bg-paper/10 p-1">
                  {estado.versiones.map((v) => (
                    <button
                      key={v}
                      type="button"
                      role="radio"
                      aria-checked={estado.modelo.carpeta === v}
                      disabled={ocupado}
                      onClick={() => cambiarVersion(v)}
                      className={`rounded-full px-4 py-1.5 font-semibold transition-colors duration-500 ease-fluid ${
                        estado.modelo.carpeta === v ? "bg-paper text-ink" : "text-paper/75 hover:text-paper"
                      }`}
                    >
                      Modelo {v}
                    </button>
                  ))}
                </div>
              )}
              <label className="inline-flex cursor-pointer items-center gap-2 font-semibold text-paper/80 underline-offset-8 hover:text-paper hover:underline">
                <UploadSimple weight="bold" className="h-4 w-4" />
                {DEMO.actions.upload}
                <input type="file" accept="image/*" className="sr-only" onChange={subir} disabled={ocupado} />
              </label>
            </div>
          )}

          <p className="mt-4 min-h-[1.25rem] text-sm text-straw-soft" role="status">
            {aviso || (resultado?.fuente === "subida" ? DEMO.uploadNote : "")}
          </p>
        </div>
      </div>

      {metricas?.[0] && metricas?.[1] && <Metricas modelo={metricas[0]} regla={metricas[1]} version={modeloActual} />}
    </div>
  );
}

/* ── Píldora de conexión ─────────────────────────────────────────── */
function EstadoConexion({ modo, estado, https }) {
  const texto =
    modo === "vivo"
      ? `En vivo desde ${dondeCorre(estado?.equipo)}`
      : modo === "buscando"
        ? "Buscando la Raspberry Pi…"
        : https
          ? DEMO.status.public
          : DEMO.status.offline;
  return (
    <p className="inline-flex items-center gap-3 rounded-full border border-paper/15 bg-paper/5 py-2 pl-3 pr-4 text-sm font-semibold text-paper/85">
      <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
        {modo === "vivo" && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#7BD88F] opacity-60" />}
        <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${modo === "vivo" ? "bg-[#7BD88F]" : "bg-straw"}`} />
      </span>
      {texto}
      {modo === "vivo" && estado?.modelo && (
        <span className="font-mono text-xs font-normal text-paper/55">
          {estado.modelo.carpeta} · {estado.modelo.sha256}
        </span>
      )}
    </p>
  );
}

/* ── Antes y después: se arrastra para comparar ──────────────────── */
function Comparador({ resultado, ocupado, donde }) {
  const [pos, setPos] = useState(50);
  const [animando, setAnimando] = useState(false);
  const clave = resultado?.clave;

  // Con cada resultado nuevo el modelo «pinta» de derecha a izquierda hasta la mitad
  useEffect(() => {
    if (!clave || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setAnimando(false);
    setPos(100);
    const t = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setAnimando(true);
        setPos(50);
      }),
    );
    const fin = setTimeout(() => setAnimando(false), 1300);
    return () => {
      cancelAnimationFrame(t);
      clearTimeout(fin);
    };
  }, [clave]);

  const trans = animando ? "transition-all duration-[1200ms] ease-fluid" : "";

  return (
    <figure>
      <div className="relative aspect-square w-full select-none overflow-hidden rounded-3xl bg-ink">
        {resultado && (
          <>
            <img src={resultado.zoomModelo} alt="Resultado del modelo: hojas detectadas en naranja" className="absolute inset-0 h-full w-full object-cover" draggable="false" />
            <img
              src={resultado.zoomOriginal}
              alt="Imagen original de la tolva"
              className={`absolute inset-0 h-full w-full object-cover ${trans}`}
              style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
              draggable="false"
            />
            <div className={`pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-straw ${trans}`} style={{ left: `${pos}%` }}>
              <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-straw text-ink shadow-[0_8px_24px_rgb(0_0_0/0.35)]">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
                </svg>
              </span>
            </div>
            <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-ink/75 px-3 py-1 text-xs font-semibold text-paper">Imagen</span>
            <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-ink/75 px-3 py-1 text-xs font-semibold text-paper">
              Modelo · <span className="text-[#FF9A4D]">hojas en naranja</span>
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={pos}
              onChange={(e) => {
                setAnimando(false);
                setPos(Number(e.target.value));
              }}
              aria-label="Deslizar para comparar la imagen con el resultado del modelo"
              className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
            />
          </>
        )}

        {ocupado && (
          <div className="pointer-events-none absolute inset-0 bg-ink/35" aria-hidden="true">
            <div className="scan-line absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-straw/35 to-transparent" />
            <p className="absolute inset-x-0 bottom-6 text-center text-sm font-semibold text-paper">
              Analizando en {donde ?? "el modelo"}…
            </p>
          </div>
        )}
      </div>
      <figcaption className="mt-3 text-sm text-paper/60">{DEMO.zoomCaption}</figcaption>
    </figure>
  );
}

/* ── Cuadro completo con la zona del acercamiento marcada ────────── */
function Cuadro({ resultado }) {
  if (!resultado?.zona) return null;
  const { x, y, lado } = resultado.zona;
  return (
    <div className="flex items-center gap-5">
      <div className="relative w-20 shrink-0 overflow-hidden rounded-xl bg-ink" style={{ aspectRatio: `${resultado.ancho} / ${resultado.alto}` }}>
        <img src={resultado.completo} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <span
          className="absolute rounded-sm border-2 border-straw shadow-[0_0_0_9999px_rgb(24_44_29/0.45)]"
          style={{
            left: `${(100 * x) / resultado.ancho}%`,
            top: `${(100 * y) / resultado.alto}%`,
            width: `${(100 * lado) / resultado.ancho}%`,
            height: `${(100 * lado) / resultado.alto}%`,
          }}
          aria-hidden="true"
        />
      </div>
      <div className="text-sm text-paper/70">
        <p className="font-mono text-paper">{resultado.nombre}</p>
        <p className="mt-1">{DEMO.frameNote}</p>
      </div>
    </div>
  );
}

function Origen({ resultado }) {
  if (!resultado) return null;
  const m = resultado.modelo;
  const version = m ? `modelo ${m.carpeta ?? ""} ${m.version ? `(${m.version})` : ""}`.replace(/\s+/g, " ").trim() : "";
  if (resultado.fuente === "guardado") {
    return (
      <>
        <span className="font-semibold text-paper">Resultado guardado</span>, calculado antes por el mismo {version}.
      </>
    );
  }
  return (
    <>
      <span className="font-semibold text-paper">Calculado ahora en {resultado.donde}</span> en {fmt(resultado.latencia / 1000, 1)} s, sin
      internet · {version} · umbral {fmt(m?.umbral, 1)}
    </>
  );
}

/* ── Modelo frente a la regla de color, en la misma prueba ───────── */
function Metricas({ modelo, regla, version }) {
  return (
    <div className="mt-16">
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
        <h3 className="text-2xl font-semibold tracking-tight text-paper sm:text-3xl">{DEMO.metricsTitle}</h3>
        {version && <p className="font-mono text-xs text-paper/55">modelo {version.carpeta} · {version.version}</p>}
      </div>
      <dl className="mt-6 grid gap-px overflow-hidden rounded-3xl bg-paper/15 sm:grid-cols-3">
        {DEMO.metrics.map((k) => {
          const a = modelo[k.key];
          const b = regla[k.key];
          const v = (x) => (k.pct ? `${fmt(100 * x, 0)} %` : fmt(x, 2));
          return (
            <div key={k.key} className="bg-field-deep p-6 sm:p-8">
              <dt className="text-sm text-paper/70">{k.label}</dt>
              <dd className="mt-3 text-4xl font-bold tracking-tight text-paper sm:text-5xl">
                {v(a)}
                {k.unit && <span className="ml-2 text-lg font-semibold text-paper/70">{k.unit}</span>}
              </dd>
              <dd className="mt-2 text-base text-paper/60">
                Regla de color: <span className="font-semibold text-straw">{v(b)}</span>
              </dd>
            </div>
          );
        })}
      </dl>
      <div className="mt-8 grid gap-6 border-t border-paper/15 pt-8 text-sm text-paper/60 md:grid-cols-2">
        <p>{DEMO.honest}</p>
        <p>{DEMO.test}</p>
      </div>
    </div>
  );
}
