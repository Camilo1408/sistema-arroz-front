import { NEXT_CAMERAS } from "@/content/landing.js";
import { Reveal } from "@/components/landing/Reveal.jsx";

/*
 * Antes y después del corte: todavía sin modelo. Fotos reales del lote con
 * las zonas marcadas a mano, para mostrar qué tendrán que ver esas cámaras.
 * Los recuadros son HTML encima de la foto (en % de la imagen) y se dibujan
 * al entrar en pantalla (ver .zona en index.css).
 */
export function EjemplosCorte() {
  return (
    <ol className="mt-16 space-y-20 sm:space-y-24">
      {NEXT_CAMERAS.items.map((item, i) => (
        <li key={item.id} className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
          <Reveal as="figure" className={`lg:col-span-7 ${i % 2 ? "lg:order-2 lg:col-start-6" : ""}`}>
            <div className="relative overflow-hidden rounded-3xl bg-paper-deep" style={{ aspectRatio: item.ratio }}>
              <img
                src={`/img/ejemplos/${item.img}-1600.webp`}
                srcSet={`/img/ejemplos/${item.img}-800.webp 800w, /img/ejemplos/${item.img}-1600.webp 1600w`}
                sizes="(min-width: 1024px) 640px, 100vw"
                alt={item.alt}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
              {item.boxes.map((b, k) => (
                <span
                  key={k}
                  className="zona absolute rounded-lg border-2 border-straw"
                  style={{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%`, "--zona-delay": `${300 + k * 220}ms` }}
                  aria-hidden="true"
                >
                  <span className="absolute -top-px left-0 -translate-y-full rounded-t-md bg-straw px-2 py-0.5 text-xs font-semibold text-ink">
                    {b.label}
                  </span>
                </span>
              ))}
              <span className="absolute right-3 top-3 rounded-full bg-ink/80 px-3 py-1 text-xs font-semibold text-paper sm:right-4 sm:top-4">
                {NEXT_CAMERAS.badge}
              </span>
            </div>
            <figcaption className="mt-3 text-sm text-ink-soft">{item.note}</figcaption>
          </Reveal>

          <Reveal delay={120} className={`lg:col-span-5 ${i % 2 ? "lg:order-1 lg:col-start-1" : "lg:col-start-8"}`}>
            <p className="font-mono text-sm text-field">
              {item.cam} · {item.tag}
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{item.title}</h3>
            <p className="mt-4 text-lg text-ink-soft">{item.text}</p>
            <p className="mt-6 border-t border-line pt-4 text-base text-ink">
              <span className="font-semibold">El modelo tendrá que: </span>
              {item.task}
            </p>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
