import { SYSTEM } from "@/content/landing.js";

/*
 * Maqueta de la pantalla del operario (central/web/hmi.html del repositorio
 * config-ricevi) en un celular. Copia su estructura y sus colores: diagnóstico
 * por cámara, estado de la máquina con la edad de cada dato y nodos.
 *
 * Cumple la misma regla que la pantalla real: donde no hay modelo dice
 * «sin modelo», nunca un número. El único porcentaje es el de la tolva, y es
 * un resultado real del modelo v2. El resto son datos de ejemplo, y lo dice.
 */
const HMI = {
  fondo: "#10151b",
  panel: "#182028",
  linea: "#2a3642",
  texto: "#e8edf2",
  suave: "#93a3b4",
  bien: "#4ec97a",
  nulo: "#5a6b7c",
};

// «enFoto»: versión más baja para ir encima de la foto en pantallas anchas;
// la leyenda la pone quien la usa.
export function CabinaMovil({ enFoto = false }) {
  const C = SYSTEM.cabina;

  return (
    <figure className={`aparecer w-full ${enFoto ? "" : "mx-auto mt-6 max-w-[290px]"}`}>
      {/* Marco del teléfono */}
      <div className="rounded-[2.2rem] bg-[#06090c] p-2.5 shadow-[0_24px_60px_rgb(0_0_0/0.45)] ring-1 ring-paper/15">
        <div
          className="relative overflow-hidden rounded-[1.75rem] pb-3 text-[11px] leading-snug"
          style={{ background: HMI.fondo, color: HMI.texto, fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif" }}
        >
          <span className="absolute left-1/2 top-2 h-1.5 w-16 -translate-x-1/2 rounded-full bg-black/70" aria-hidden="true" />

          <header className="flex items-center gap-2 px-3 pb-2 pt-6" style={{ background: HMI.panel, borderBottom: `1px solid ${HMI.linea}` }}>
            <span className="text-[13px] font-semibold tracking-wide">RiceVi</span>
            <span style={{ color: HMI.suave }}>{C.session}</span>
            <span className="ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: HMI.bien, color: "#08130c" }}>
              {C.mode}
            </span>
          </header>

          <div className="space-y-2.5 p-2.5">
            {/* Diagnóstico por cámara */}
            <section className="rounded-lg p-2.5" style={{ background: HMI.panel, border: `1px solid ${HMI.linea}` }}>
              <h4 className="mb-2 text-[9px] font-semibold uppercase tracking-[0.12em]" style={{ color: HMI.suave }}>
                Diagnóstico por cámara
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {C.cams.map((c) => (
                  <div key={c.name}>
                    <p className="mb-1 text-[9px] font-semibold uppercase tracking-wider" style={{ color: HMI.suave }}>
                      {c.name}
                    </p>
                    <div className={`${enFoto ? "aspect-[16/9]" : "aspect-[4/3]"} overflow-hidden rounded`} style={{ border: `1px solid ${HMI.linea}` }}>
                      <img src={c.img} alt="" loading="lazy" className={`h-full w-full object-cover ${c.mirror ? "-scale-x-100" : ""}`} />
                    </div>
                    {c.value ? (
                      <p className="mt-1 text-[18px] font-semibold leading-none" style={{ color: HMI.bien }}>
                        {c.value}
                      </p>
                    ) : (
                      <p className="mt-1 text-[12px] font-semibold" style={{ color: HMI.nulo }}>
                        sin modelo
                      </p>
                    )}
                    {c.age && (
                      <p className="mt-0.5 text-[9px]" style={{ color: HMI.bien }}>
                        {c.age}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Estado de la máquina */}
            <section className="rounded-lg p-2.5" style={{ background: HMI.panel, border: `1px solid ${HMI.linea}` }}>
              <h4 className="mb-1 text-[9px] font-semibold uppercase tracking-[0.12em]" style={{ color: HMI.suave }}>
                Estado de la máquina
              </h4>
              <table className="w-full border-collapse">
                <tbody>
                  {C.machine.map(([que, valor, edad], i) => (
                    <tr key={que} style={i < C.machine.length - 1 ? { borderBottom: `1px solid ${HMI.linea}` } : undefined}>
                      <td className="py-1">{que}</td>
                      <td className="py-1 text-right tabular-nums">{valor}</td>
                      <td className="py-1 pl-2 text-right text-[9px]" style={{ color: HMI.bien }}>
                        {edad}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* Nodos */}
            <section className="flex items-center gap-2 rounded-lg px-2.5 py-2" style={{ background: HMI.panel, border: `1px solid ${HMI.linea}` }}>
              <span className="flex gap-1" aria-hidden="true">
                {Array.from({ length: 7 }, (_, i) => (
                  <span key={i} className="h-2 w-2 rounded-full" style={{ background: HMI.bien }} />
                ))}
              </span>
              <span>{C.nodes}</span>
            </section>
          </div>
        </div>
      </div>
      {!enFoto && <figcaption className="mt-4 text-center text-xs text-paper/60">{C.label}</figcaption>}
    </figure>
  );
}
