import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight } from "@phosphor-icons/react";
import { FILM, HERO } from "@/content/landing.js";

/*
 * Portada scroll-world: el recorrido en video avanza con el scroll.
 *
 * - La sección mide varias pantallas; dentro, un contenedor fijo (sticky)
 *   muestra el video y el scroll decide en qué segundo está.
 * - El scroll se divide en tramos iguales, uno por transición. Dentro de cada
 *   tramo el tiempo se curva (linger) para que la cámara se detenga un poco en
 *   cada foto, justo cuando aparece su texto.
 * - El video se descarga como blob: así siempre se puede saltar a cualquier
 *   segundo aunque el servidor no admita rangos.
 * - Solo se pide un cuadro nuevo cuando cambia el cuadro y el decodificador
 *   terminó la búsqueda anterior: no se forman colas que congelen el video.
 * - En el teléfono el video es todo cuadros clave a 15 fps: cada búsqueda
 *   decodifica un solo cuadro.
 * - El suavizado depende del tiempo real entre cuadros (no de los Hz de la
 *   pantalla) y los estilos solo se escriben cuando cambian.
 * - Mientras carga, o con movimiento reducido, se ven los cuadros fijos.
 */

const SEGMENTS = FILM.scenes.length - 1;
const MOBILE = "(max-width: 860px), (pointer: coarse)";

const clamp01 = (v) => Math.min(Math.max(v, 0), 1);
const media = (q) => typeof window !== "undefined" && window.matchMedia(q).matches;

// En el teléfono la cámara se detiene menos en cada foto: la velocidad del
// video varía menos y el decodificador no tiene que dar saltos tan grandes.
function makeTimeAt(linger) {
  const curve = (u) => u - (linger * Math.sin(2 * Math.PI * u)) / (2 * Math.PI);
  return (progress) => {
    const x = clamp01(progress) * SEGMENTS;
    const k = Math.min(Math.floor(x), SEGMENTS - 1);
    const a = FILM.scenes[k].t;
    const b = FILM.scenes[k + 1].t;
    return a + (b - a) * curve(x - k);
  };
}

export function ScrollFilm() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const captionRefs = useRef([]);
  const scrimRef = useRef(null);
  const [reduced] = useState(() => media("(prefers-reduced-motion: reduce)"));
  const [mobile] = useState(() => media(MOBILE));
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(0);

  // Descarga el video como blob (no se hace con movimiento reducido)
  useEffect(() => {
    if (reduced) return;
    let url;
    const abort = new AbortController();
    fetch(mobile ? FILM.video.mobile : FILM.video.desktop, { signal: abort.signal })
      .then((r) => (r.ok ? r.blob() : Promise.reject(new Error(String(r.status)))))
      .then((blob) => {
        if (!videoRef.current) return;
        url = URL.createObjectURL(blob);
        videoRef.current.src = url;
      })
      .catch(() => {}); // si falla o se cancela, la portada sigue con los cuadros fijos
    return () => {
      abort.abort();
      if (url) URL.revokeObjectURL(url);
    };
  }, [reduced, mobile]);

  // iOS no pinta un video silenciado que nunca se reprodujo: se "despierta" al primer toque
  useEffect(() => {
    const prime = () => {
      const v = videoRef.current;
      if (v) v.play().then(() => v.pause()).catch(() => {});
    };
    window.addEventListener("touchstart", prime, { once: true, passive: true });
    return () => window.removeEventListener("touchstart", prime);
  }, []);

  // Bucle de animación: solo corre mientras la sección está en pantalla
  useEffect(() => {
    const section = sectionRef.current;
    const timeAt = makeTimeAt(mobile ? 0.3 : 0.5);
    const fps = mobile ? 15 : 24; // cuadros por segundo del archivo que se cargó
    const tau = mobile ? 0.11 : 0.08; // constante de suavizado, en segundos
    const last = FILM.scenes.map(() => ({ o: -1 }));
    let lastScrim = -1;
    let raf = 0;
    let prevTs = 0;
    let visible = false;
    let current = 0;
    let lastActive = -1;
    let lastFrame = -1;

    const tick = (ts) => {
      raf = 0;
      const dt = prevTs ? Math.min((ts - prevTs) / 1000, 0.1) : 1 / 60;
      prevTs = ts;

      const rect = section.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      const target = timeAt(span > 0 ? -rect.top / span : 0);

      current = reduced ? target : current + (target - current) * (1 - Math.exp(-dt / tau));
      if (Math.abs(target - current) < 0.003) current = target;

      // Búsqueda en el video: solo si cambió el cuadro y no hay otra en curso
      const v = videoRef.current;
      const frame = Math.round(current * fps);
      if (v && v.readyState >= 1 && !v.seeking && frame !== lastFrame) {
        lastFrame = frame;
        v.currentTime = Math.min(frame / fps, (v.duration || FILM.duration) - 0.05);
      }

      let nearest = 0;
      FILM.scenes.forEach((scene, i) => {
        const d = Math.abs(current - scene.t);
        if (d < Math.abs(current - FILM.scenes[nearest].t)) nearest = i;
        // Opacidad redondeada a 1/50: evita reescribir estilos por cambios invisibles
        const o = Math.round(clamp01(1 - (d - 0.6) / 1.4) * 50) / 50;
        const node = captionRefs.current[i];
        if (node && o !== last[i].o) {
          last[i].o = o;
          node.style.opacity = o;
          node.style.transform = `translate3d(0, ${((1 - o) * 24).toFixed(1)}px, 0)`;
          node.style.visibility = o === 0 ? "hidden" : "visible";
          node.style.pointerEvents = o > 0.5 ? "auto" : "none";
        }
        if (i === 0 && scrimRef.current && o !== lastScrim) {
          lastScrim = o;
          scrimRef.current.style.opacity = o;
        }
      });
      if (nearest !== lastActive) {
        lastActive = nearest;
        setActive(nearest);
      }

      if (visible || current !== target) raf = requestAnimationFrame(tick);
      else prevTs = 0;
    };

    // Si el decodificador terminó y el scroll ya se detuvo, pide el último cuadro
    const onSeeked = () => {
      lastFrame = -1;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const v = videoRef.current;
    v?.addEventListener("seeked", onSeeked);

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) kick();
    });
    observer.observe(section);
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    kick();
    return () => {
      observer.disconnect();
      v?.removeEventListener("seeked", onSeeked);
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      cancelAnimationFrame(raf);
    };
  }, [reduced, mobile]);

  const showVideo = ready && !reduced;

  return (
    <section
      id="inicio"
      ref={sectionRef}
      aria-label="Recorrido por el lote"
      className="relative h-[760svh] bg-field-deep"
    >
      {/* Anclas para saltar a cada escena: la escena k está al inicio de su tramo */}
      {FILM.scenes.map((_, i) => (
        <span
          key={i}
          id={`escena-${i + 1}`}
          aria-hidden="true"
          className="absolute left-0 h-px w-px"
          style={{ top: `calc(${i / SEGMENTS} * (100% - 100svh))`, scrollMarginTop: "-6rem" }}
        />
      ))}

      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Cuadros fijos: solo mientras carga el video o con movimiento reducido.
            Cuando el video está listo se quitan del DOM para no componer 7 capas. */}
        {!showVideo &&
          FILM.scenes.map((scene, i) => (
            <img
              key={scene.still}
              src={`/img/${scene.still}.webp`}
              alt=""
              aria-hidden="true"
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : undefined}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-fluid ${
                active === i ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}

        {!reduced && (
          <video
            ref={videoRef}
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            aria-hidden="true"
            onLoadedData={() => setReady(true)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-fluid ${
              showVideo ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        {/* Velo plano: más fuerte en la portada para leer el título */}
        <div className="absolute inset-0 bg-field-deep/20" aria-hidden="true" />
        <div ref={scrimRef} className="absolute inset-0 bg-field-deep/50" aria-hidden="true" />

        {/* Textos de cada escena, apilados en el mismo lugar */}
        <div className="absolute inset-x-0 bottom-0 mx-auto grid max-w-6xl px-6 pb-12 sm:pb-16">
          {FILM.scenes.map((scene, i) => (
            <div
              key={scene.still}
              ref={(el) => (captionRefs.current[i] = el)}
              className="self-end will-change-[opacity,transform] [grid-area:1/1]"
              style={{ opacity: i === 0 ? 1 : 0, visibility: i === 0 ? "visible" : "hidden" }}
            >
              {i === 0 ? <HeroCopy /> : <SceneCopy scene={scene} />}
            </div>
          ))}
        </div>

        {/* Riel de escenas */}
        <nav aria-label="Escenas del recorrido" className="absolute right-6 top-1/2 hidden -translate-y-1/2 md:block">
          <ol className="flex flex-col items-end gap-3">
            {FILM.scenes.map((scene, i) => (
              <li key={scene.still}>
                <a
                  href={`#escena-${i + 1}`}
                  aria-current={active === i ? "step" : undefined}
                  className="group flex items-center gap-3"
                >
                  <span
                    className={`text-xs font-semibold text-paper transition-opacity duration-500 ease-fluid ${
                      active === i ? "opacity-100" : "opacity-0 group-hover:opacity-80"
                    }`}
                  >
                    {scene.eyebrow ?? "Inicio"}
                  </span>
                  <span
                    className={`block h-2 rounded-full transition-all duration-500 ease-fluid ${
                      active === i ? "w-6 bg-straw" : "w-2 bg-paper/50 group-hover:bg-paper"
                    }`}
                  />
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </section>
  );
}

function HeroCopy() {
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-semibold uppercase tracking-widest text-straw-soft">{HERO.eyebrow}</p>
      <h1 className="mt-4 max-w-hero text-4xl font-bold tracking-tight text-paper sm:text-6xl">
        {HERO.title[0]}
        <br className="hidden sm:block" /> {HERO.title[1]}
      </h1>
      <p className="mt-4 max-w-xl text-base text-paper sm:mt-6 sm:text-lg">{HERO.subtitle}</p>
      <div className="mt-6 flex flex-wrap items-center gap-6 sm:mt-8">
        <a
          href={HERO.cta.href}
          className="group inline-flex items-center gap-2 rounded-full bg-straw px-6 py-3 text-base font-semibold text-ink transition-transform duration-500 ease-fluid hover:-translate-y-0.5 active:translate-y-px"
        >
          {HERO.cta.label}
          <ArrowDown weight="bold" className="h-4 w-4 transition-transform duration-500 ease-fluid group-hover:translate-y-0.5" />
        </a>
        <a
          href={HERO.secondary.href}
          className="group inline-flex items-center gap-2 text-base font-semibold text-paper underline-offset-8 hover:underline"
        >
          {HERO.secondary.label}
          <ArrowRight weight="bold" className="h-4 w-4 transition-transform duration-500 ease-fluid group-hover:translate-x-0.5" />
        </a>
      </div>
      <ul className="mt-10 hidden flex-wrap gap-x-8 gap-y-2 border-t border-paper/20 pt-5 text-sm text-paper/80 sm:flex">
        {HERO.proof.map((item) => (
          <li key={item} className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-straw" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
      <p className="mt-6 flex items-center gap-2 text-sm text-paper/70 sm:mt-8">
        <ArrowDown weight="bold" className="h-4 w-4" />
        {FILM.hint}
      </p>
    </div>
  );
}

function SceneCopy({ scene }) {
  // Sin desenfoque de fondo en el teléfono: sobre un video que cambia cada
  // cuadro, el desenfoque se recalcula siempre y es lo que más pesa en la GPU.
  return (
    <div className="max-w-md rounded-3xl bg-ink/85 p-6 text-paper sm:p-8 md:bg-ink/75 md:backdrop-blur-md">
      <p className="text-sm font-semibold uppercase tracking-widest text-straw">{scene.eyebrow}</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{scene.title}</h2>
      <p className="mt-3 text-base text-paper/80">{scene.body}</p>
      {scene.cta && (
        <a
          href={scene.cta.href}
          className="group mt-6 inline-flex items-center gap-2 rounded-full bg-straw px-5 py-2 text-base font-semibold text-ink transition-transform duration-500 ease-fluid hover:-translate-y-0.5 active:translate-y-px"
        >
          {scene.cta.label}
          <ArrowDown weight="bold" className="h-4 w-4" />
        </a>
      )}
    </div>
  );
}
