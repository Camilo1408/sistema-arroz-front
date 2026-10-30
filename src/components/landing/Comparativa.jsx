import { Check, CircleHalf, Minus } from "@phosphor-icons/react";
import { COMPARE } from "@/content/landing.js";
import { Reveal } from "@/components/landing/Reveal.jsx";

/*
 * Por qué RiceVi: el precio a escala real (la barra de RiceVi es la proporción
 * verdadera frente a la máquina nueva) y qué mira cada sistema. En escritorio
 * es una tabla; en el teléfono, una tarjeta por sistema con los mismos datos.
 */
const MARCA = {
  si: { Icon: Check, sr: "Sí", cls: "bg-field text-paper", clsUs: "bg-straw text-ink" },
  parcial: { Icon: CircleHalf, sr: "En parte", cls: "bg-straw-soft text-ink", clsUs: "bg-straw-soft text-ink" },
  no: { Icon: Minus, sr: "No", cls: "bg-paper-deep text-ink-soft", clsUs: "bg-paper/15 text-paper/70" },
};

function Marca({ celda, us }) {
  const [valor, texto] = celda;
  const { Icon, sr, cls, clsUs } = MARCA[valor];
  return (
    <div className="flex items-start gap-2.5">
      <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${us ? clsUs : cls}`}>
        <Icon weight="bold" className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="sr-only">{sr}</span>
      </span>
      <span className={`text-sm ${us ? "text-paper/85" : "text-ink-soft"}`}>{texto || sr}</span>
    </div>
  );
}

export function Comparativa() {
  const { price, columns, rows } = COMPARE;

  return (
    <>
      {/* ── Precio a escala ─────────────────────────────────────── */}
      <Reveal className="mt-14 rounded-3xl border border-line bg-paper p-6 sm:p-10">
        <dl className="space-y-8">
          {[
            { ...price.them, ancho: "100%", barra: "bg-ink/80", valor: "text-ink" },
            { ...price.us, ancho: `max(${(price.share * 100).toFixed(2)}%, 6px)`, barra: "bg-straw", valor: "text-field" },
          ].map((p) => (
            <div key={p.label}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <dt className="text-base font-semibold text-ink">{p.label}</dt>
                <dd className={`text-3xl font-bold tracking-tight sm:text-4xl ${p.valor}`}>{p.value}</dd>
              </div>
              <div className="mt-3 h-4 overflow-hidden rounded-full bg-paper-deep" aria-hidden="true">
                <div className={`barra h-full rounded-full ${p.barra}`} style={{ width: p.ancho }} />
              </div>
              <dd className="mt-2 text-sm text-ink-soft">{p.note}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-8 border-t border-line pt-6 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          {price.ratio}
          <span className="text-straw">.</span>
        </p>
      </Reveal>

      {/* ── Qué mira cada uno: tabla en escritorio ──────────────── */}
      <Reveal className="mt-10 hidden overflow-hidden rounded-3xl border border-line md:block">
        <table className="w-full table-fixed text-left">
          <caption className="sr-only">Qué mira cada sistema</caption>
          <thead className="bg-paper-deep/70">
            <tr>
              <th scope="col" className="w-[20%] p-4 text-sm font-semibold text-ink-soft">
                Sistema
              </th>
              {columns.map((c) => (
                <th key={c.key} scope="col" className="p-4 text-sm font-semibold text-ink">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((r) => (
              <tr key={r.name} className={r.us ? "bg-field-deep" : "bg-paper"}>
                <th scope="row" className="p-4 align-top font-normal">
                  <span className={`block text-base font-semibold ${r.us ? "text-paper" : "text-ink"}`}>{r.name}</span>
                  <span className={`mt-1 block text-xs ${r.us ? "text-straw" : "text-ink-soft"}`}>{r.kind}</span>
                </th>
                {columns.map((c) => (
                  <td key={c.key} className="p-4 align-top">
                    <Marca celda={r.cells[c.key]} us={r.us} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>

      {/* ── Lo mismo en el teléfono: una tarjeta por sistema ────── */}
      <ul className="mt-10 space-y-4 md:hidden">
        {rows.map((r) => (
          <Reveal as="li" key={r.name} className={`rounded-3xl p-5 ${r.us ? "bg-field-deep" : "border border-line bg-paper"}`}>
            <p className={`text-lg font-semibold ${r.us ? "text-paper" : "text-ink"}`}>{r.name}</p>
            <p className={`text-xs ${r.us ? "text-straw" : "text-ink-soft"}`}>{r.kind}</p>
            <dl className="mt-4 space-y-3">
              {columns.map((c) => (
                <div key={c.key}>
                  <dt className={`mb-1 text-xs font-semibold uppercase tracking-wider ${r.us ? "text-paper/60" : "text-ink-soft"}`}>
                    {c.label}
                  </dt>
                  <dd>
                    <Marca celda={r.cells[c.key]} us={r.us} />
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        ))}
      </ul>

      <Reveal className="mt-10">
        <p className="max-w-3xl text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{COMPARE.verdict}</p>
      </Reveal>

      <Reveal as="ul" className="mt-10 grid gap-8 border-t border-line pt-8 sm:grid-cols-3">
        {COMPARE.points.map((pt) => (
          <li key={pt.title}>
            <p className="font-semibold text-ink">{pt.title}</p>
            <p className="mt-2 text-base text-ink-soft">{pt.text}</p>
          </li>
        ))}
      </Reveal>

      <p className="mt-10 text-xs text-ink-soft">{COMPARE.note}</p>
    </>
  );
}
