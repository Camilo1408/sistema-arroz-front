import { useState } from "react";
import { IMPACT } from "@/content/landing.js";

/**
 * Cifras de recuperación por escenario. Un selector de dos opciones
 * cambia entre reducir a la mitad la pérdida del cabezal o eliminarla.
 */
export function ImpactCalc() {
  const [id, setId] = useState(IMPACT.scenarios[0].id);
  const s = IMPACT.scenarios.find((x) => x.id === id);

  return (
    <div>
      <div role="radiogroup" aria-label="Escenario de la pérdida del cabezal" className="inline-flex rounded-full bg-paper/10 p-1">
        {IMPACT.scenarios.map((x) => (
          <button
            key={x.id}
            type="button"
            role="radio"
            aria-checked={x.id === id}
            onClick={() => setId(x.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-500 ease-fluid ${
              x.id === id ? "bg-straw text-ink" : "text-paper/80 hover:text-paper"
            }`}
          >
            {x.label}
          </button>
        ))}
      </div>

      <dl className="mt-10 grid gap-px overflow-hidden rounded-3xl bg-paper/15 sm:grid-cols-3" aria-live="polite">
        {s.figures.map((f) => (
          <div key={f.scale} className="bg-ink p-6 sm:p-8">
            <dt className="text-sm text-paper/70">{f.scale}</dt>
            <dd className="mt-3 text-4xl font-bold tracking-tight text-paper sm:text-5xl">{f.amount}</dd>
            <dd className="mt-2 text-lg font-semibold text-straw">{f.money}</dd>
          </div>
        ))}
      </dl>

      <ul className="mt-8 grid gap-4 text-base text-paper/80 sm:grid-cols-2">
        <li>
          La pérdida total bajaría de 7,17 % a <span className="font-semibold text-paper">{s.totalAfter}</span>.
        </li>
        <li>
          {IMPACT.cost} Se pagaría en unas <span className="font-semibold text-paper">{s.payback} hectáreas</span> cosechadas.
        </li>
      </ul>
    </div>
  );
}
