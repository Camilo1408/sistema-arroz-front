import { useState } from "react";
import { PROBLEM } from "@/content/landing.js";

const fmt = (v) => v.toLocaleString("es-CO", { minimumFractionDigits: 2 }) + " %";

/**
 * Barra apilada de la pérdida total (7,17 %) y, en la misma escala, la
 * franja de referencia con operario entrenado. Cada tramo lleva su
 * nombre y valor visibles en la leyenda (el dorado tiene poco contraste
 * con el fondo, así que el color nunca va solo) y un aviso al pasar el
 * cursor o enfocar con teclado.
 */
export function LossBar() {
  const { parts, reference } = PROBLEM;
  const total = parts.reduce((s, p) => s + p.value, 0);
  const [hover, setHover] = useState(null);
  const pct = (v) => `${(v / total) * 100}%`;

  return (
    <figure>
      <div className="relative">
        <div className="flex h-12 gap-0.5" role="img" aria-label={`Pérdida total ${fmt(total)}`}>
          {parts.map((p, i) => (
            <button
              key={p.label}
              type="button"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              aria-label={`${p.label}, ${fmt(p.value)}`}
              style={{ width: pct(p.value), backgroundColor: p.color }}
              className={`h-full transition-opacity duration-300 ease-fluid first:rounded-l last:rounded-r ${
                hover !== null && hover !== i ? "opacity-40" : "opacity-100"
              }`}
            />
          ))}
        </div>
        {hover !== null && (
          <div
            role="tooltip"
            className="pointer-events-none absolute -top-12 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink px-3 py-1.5 text-sm text-paper shadow-lg"
            style={{
              left: pct(parts.slice(0, hover).reduce((s, p) => s + p.value, 0) + parts[hover].value / 2),
            }}
          >
            {parts[hover].label} <span className="font-semibold">{fmt(parts[hover].value)}</span>
          </div>
        )}
      </div>

      {/* Referencia en la misma escala */}
      <div className="mt-3">
        <div className="relative h-3 rounded bg-paper-deep">
          <div
            className="absolute inset-y-0 rounded bg-field/70"
            style={{ left: pct(reference.min), width: pct(reference.max - reference.min) }}
          />
        </div>
        <p className="mt-2 text-sm text-ink-soft">
          {reference.label}, la pérdida no debería pasar de{" "}
          <span className="font-semibold text-ink">
            {reference.min.toLocaleString("es-CO")}–{reference.max.toLocaleString("es-CO")} %
          </span>
        </p>
      </div>

      {/* Leyenda con valores: etiquetas directas y vista de tabla a la vez */}
      <figcaption>
        <dl className="mt-8 grid gap-4 border-t border-line pt-6 sm:grid-cols-3">
          {parts.map((p) => (
            <div key={p.label} className="flex items-start gap-3">
              <span className="mt-1.5 h-3 w-3 shrink-0 rounded-sm" style={{ backgroundColor: p.color }} aria-hidden="true" />
              <div>
                <dt className="text-sm text-ink-soft">{p.label}</dt>
                <dd className="text-2xl font-bold tracking-tight text-ink">{fmt(p.value)}</dd>
                {p.focus && <dd className="text-xs font-semibold uppercase tracking-widest text-field">RiceVi empieza aquí</dd>}
              </div>
            </div>
          ))}
        </dl>
      </figcaption>
    </figure>
  );
}
