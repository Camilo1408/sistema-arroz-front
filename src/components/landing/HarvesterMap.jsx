import { useState } from "react";
import { SYSTEM } from "@/content/landing.js";
import { Photo } from "./Photo.jsx";

/**
 * Foto lateral de la cosechadora con marcadores numerados. Al elegir un
 * marcador (o un elemento de la lista) se resalta su par y se muestra
 * la explicación. En móvil la lista queda debajo de la foto.
 */
export function HarvesterMap() {
  const [current, setCurrent] = useState(1);
  const spot = SYSTEM.hotspots.find((h) => h.n === current);

  return (
    <div className="grid gap-8 lg:grid-cols-[2.1fr_1fr] lg:items-start">
      <figure className="relative overflow-hidden rounded-3xl bg-paper-deep">
        <Photo
          name="cosechadora_cerca"
          alt="Cosechadora de arroz vista de lado, con los puntos donde se instalan las cámaras y los sensores"
          sizes="(min-width: 1280px) 820px, (min-width: 1024px) 65vw, 100vw"
          className="aspect-[4/3] w-full object-cover"
        />
        {SYSTEM.hotspots.map((h) => (
          <button
            key={h.n}
            type="button"
            aria-pressed={h.n === current}
            aria-label={`${h.n}. ${h.title}`}
            onClick={() => setCurrent(h.n)}
            onMouseEnter={() => setCurrent(h.n)}
            style={{ left: `${h.x}%`, top: `${h.y}%` }}
            className={`hotspot-ring absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full font-mono text-xs font-medium sm:h-8 sm:w-8 sm:text-sm shadow-[0_4px_16px_rgb(27_38_28/0.35)] transition-all duration-500 ease-fluid hover:scale-110 active:scale-95 ${
              h.n === current ? "bg-straw text-ink" : "bg-ink/85 text-paper"
            }`}
          >
            {h.n}
          </button>
        ))}
        <figcaption className="absolute bottom-3 left-4 rounded-full bg-ink/70 px-3 py-1 text-xs text-paper/90 backdrop-blur">
          Ubicaciones aproximadas
        </figcaption>
      </figure>

      <div>
        <div className="rounded-3xl bg-ink p-8 text-paper" aria-live="polite">
          <p className="font-mono text-sm text-straw">{spot.ids}</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight">{spot.title}</h3>
          <p className="mt-3 text-base text-paper/80">{spot.text}</p>
        </div>

        <ol className="mt-4 divide-y divide-line border-y border-line">
          {SYSTEM.hotspots.map((h) => (
            <li key={h.n}>
              <button
                type="button"
                onClick={() => setCurrent(h.n)}
                aria-pressed={h.n === current}
                className={`flex w-full items-center gap-4 py-3 text-left text-sm font-semibold transition-colors duration-500 ease-fluid ${
                  h.n === current ? "text-ink" : "text-ink-soft hover:text-ink"
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-xs transition-colors duration-500 ease-fluid ${
                    h.n === current ? "bg-straw text-ink" : "bg-paper-deep"
                  }`}
                >
                  {h.n}
                </span>
                {h.title}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
