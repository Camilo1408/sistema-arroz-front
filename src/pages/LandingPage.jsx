import { ArrowUpRight, Check, CircleDashed, Circle } from "@phosphor-icons/react";
import { PROBLEM, IMPACT, COMPARE, PROCESS, DEMO, NEXT_CAMERAS, SYSTEM, PRINCIPLES, STATUS, TEAM, FOOTER } from "@/content/landing.js";
import { SiteNav } from "@/components/landing/SiteNav.jsx";
import { ScrollFilm } from "@/components/landing/ScrollFilm.jsx";
import { TaglineReveal } from "@/components/landing/TaglineReveal.jsx";
import { HarvesterMap } from "@/components/landing/HarvesterMap.jsx";
import { LossBar } from "@/components/landing/LossBar.jsx";
import { ImpactCalc } from "@/components/landing/ImpactCalc.jsx";
import { Faq } from "@/components/landing/Faq.jsx";
import { Reveal } from "@/components/landing/Reveal.jsx";
import { Photo } from "@/components/landing/Photo.jsx";
import { TolvaDemo } from "@/components/landing/TolvaDemo.jsx";
import { EjemplosCorte } from "@/components/landing/EjemplosCorte.jsx";
import { Comparativa } from "@/components/landing/Comparativa.jsx";
import { useAnclasSuaves } from "@/components/landing/useAnclasSuaves.js";

/* ── Encabezado de sección ───────────────────────────────────────── */
function SectionHead({ eyebrow, title, children, tone = "light" }) {
  const dark = tone === "dark";
  return (
    <Reveal className="max-w-3xl">
      <p className={`text-sm font-semibold uppercase tracking-widest ${dark ? "text-straw" : "text-field"}`}>
        {eyebrow}
      </p>
      <h2 className={`mt-3 text-3xl font-bold tracking-tight sm:text-5xl ${dark ? "text-paper" : "text-ink"}`}>
        {title}
      </h2>
      {children}
    </Reveal>
  );
}

const STATUS_ICON = {
  done: { Icon: Check, cls: "bg-field text-paper" },
  now: { Icon: CircleDashed, cls: "bg-straw text-ink" },
  next: { Icon: Circle, cls: "bg-paper-deep text-ink-soft" },
};

export default function LandingPage() {
  useAnclasSuaves();

  return (
    <>
      <a
        href="#contenido"
        className="sr-only z-[60] rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Saltar al contenido
      </a>
      <SiteNav />

      <main id="contenido">
        <ScrollFilm />

        {/* ── El problema ─────────────────────────────────────────── */}
        <section id="problema" className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <div className="grid gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-6">
              <p className="text-sm font-semibold uppercase tracking-widest text-field">{PROBLEM.eyebrow}</p>
              <h2 className="mt-3 tracking-tight">
                <span className="block text-7xl font-bold text-ink sm:text-8xl">{PROBLEM.total}</span>
                <span className="mt-2 block text-3xl font-bold text-ink sm:text-4xl">{PROBLEM.title}</span>
              </h2>
              <p className="mt-6 max-w-md text-lg text-ink-soft">{PROBLEM.lead}</p>
            </Reveal>
            <Reveal delay={120} className="space-y-6 text-lg text-ink-soft lg:col-span-5 lg:col-start-8 lg:pt-12">
              {PROBLEM.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </Reveal>
          </div>

          <Reveal className="mt-16">
            <LossBar />
            <p className="mt-6 text-xs text-ink-soft">{PROBLEM.source}</p>
          </Reveal>
        </section>

        <TaglineReveal />

        {/* ── Impacto ─────────────────────────────────────────────── */}
        <section id="impacto" className="bg-ink py-24 text-paper sm:py-32">
          <div className="mx-auto max-w-6xl px-6">
            <SectionHead eyebrow={IMPACT.eyebrow} title={IMPACT.title} tone="dark">
              <p className="mt-6 text-lg text-paper/75">{IMPACT.intro}</p>
            </SectionHead>
            <Reveal className="mt-12">
              <ImpactCalc />
            </Reveal>

            <div className="mt-20">
              <Reveal>
                <h3 className="text-2xl font-semibold tracking-tight text-paper sm:text-3xl">{IMPACT.beneficiaries.title}</h3>
              </Reveal>
              <ul className="mt-8 grid gap-px overflow-hidden rounded-3xl bg-paper/15 md:grid-cols-3">
                {IMPACT.beneficiaries.items.map((b, i) => (
                  <Reveal as="li" key={b.who} delay={i * 100} className="bg-ink p-6 sm:p-8">
                    <p className="text-sm font-semibold text-straw">{b.who}</p>
                    <p className="mt-3 text-4xl font-bold tracking-tight text-paper">{b.stat}</p>
                    <p className="mt-2 text-base text-paper/75">{b.text}</p>
                  </Reveal>
                ))}
              </ul>
              <p className="mt-4 text-xs text-paper/55">{IMPACT.beneficiaries.source}</p>
            </div>
            <Reveal className="mt-12 grid gap-6 border-t border-paper/15 pt-8 text-sm text-paper/60 md:grid-cols-2">
              <p>{IMPACT.indirect}</p>
              <p>{IMPACT.note}</p>
            </Reveal>
          </div>
        </section>

        {/* ── Por qué RiceVi: comparativa ──────────────────────────── */}
        <section id="comparativa" className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <SectionHead eyebrow={COMPARE.eyebrow} title={COMPARE.title}>
            <p className="mt-6 text-lg text-ink-soft">{COMPARE.intro}</p>
          </SectionHead>
          <Comparativa />
        </section>

        {/* ── Sistema ─────────────────────────────────────────────── */}
        <section id="sistema" className="bg-paper-deep/60 py-24 sm:py-32">
          <div className="mx-auto max-w-6xl px-6">
            <SectionHead eyebrow={SYSTEM.eyebrow} title={SYSTEM.title}>
              <p className="mt-6 text-lg text-ink-soft">{SYSTEM.intro}</p>
            </SectionHead>

            <Reveal className="mt-12">
              <HarvesterMap />
            </Reveal>

            <Reveal as="dl" className="mt-16 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-line pt-10 lg:grid-cols-4">
              {SYSTEM.facts.map((f) => (
                <div key={f.label}>
                  <dt className="text-3xl font-bold tracking-tight text-ink">{f.value}</dt>
                  <dd className="mt-2 text-sm text-ink-soft">{f.label}</dd>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ── Cómo funciona ───────────────────────────────────────── */}
        <section id="proceso" className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <SectionHead eyebrow={PROCESS.eyebrow} title={PROCESS.title} />

          <ol className="mt-16 divide-y divide-line border-y border-line">
            {PROCESS.steps.map((step, i) => (
              <Reveal as="li" key={step.n} delay={i * 80} className="grid gap-6 py-10 lg:grid-cols-12 lg:gap-8">
                <div className="lg:col-span-4">
                  <span className="font-mono text-sm text-field">{step.n}</span>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{step.title}</h3>
                </div>
                <div className="lg:col-span-7 lg:col-start-6">
                  <p className="text-lg text-ink-soft">{step.text}</p>
                  {step.points && (
                    <ul className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
                      {step.points.map((pt, k) => (
                        <li key={pt.label}>
                          <div className="overflow-hidden rounded-2xl bg-paper-deep">
                            <Photo
                              name={PROCESS.images[k].name}
                              alt={PROCESS.images[k].alt}
                              sizes="(min-width: 1024px) 220px, 33vw"
                              className="aspect-square w-full object-cover"
                            />
                          </div>
                          <p className="mt-3 text-sm font-semibold text-ink">{pt.label}</p>
                          <p className="text-xs text-ink-soft sm:text-sm">{pt.detail}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Reveal>
            ))}
          </ol>
        </section>

        {/* ── IA en vivo: el modelo de la tolva ───────────────────── */}
        <section id="ia" className="bg-field-deep py-24 text-paper sm:py-32">
          <div className="mx-auto max-w-6xl px-6">
            <SectionHead eyebrow={DEMO.eyebrow} title={DEMO.title} tone="dark">
              <p className="mt-6 text-lg text-paper/75">{DEMO.intro}</p>
            </SectionHead>
            <Reveal className="mt-10">
              <TolvaDemo />
            </Reveal>
          </div>
        </section>

        {/* ── Antes y después del corte: ejemplos sin modelo ──────── */}
        <section id="corte" className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <SectionHead eyebrow={NEXT_CAMERAS.eyebrow} title={NEXT_CAMERAS.title}>
            <p className="mt-6 text-lg text-ink-soft">{NEXT_CAMERAS.intro}</p>
          </SectionHead>
          <EjemplosCorte />
        </section>

        {/* ── Avance ──────────────────────────────────────────────── */}
        <section id="estado" className="bg-paper-deep/60">
          <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <SectionHead eyebrow={STATUS.eyebrow} title={STATUS.title}>
            <p className="mt-4 text-sm text-ink-soft">Actualizado a {STATUS.updated.toLowerCase()}</p>
          </SectionHead>

          <ol className="relative mt-16 space-y-10 before:absolute before:bottom-2 before:left-4 before:top-2 before:w-px before:bg-line">
            {STATUS.steps.map((step, i) => {
              const { Icon, cls } = STATUS_ICON[step.tone];
              return (
                <Reveal as="li" key={step.title} delay={i * 80} className="relative grid gap-2 pl-14 md:grid-cols-12 md:gap-8">
                  <span className={`absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full ${cls}`}>
                    <Icon weight="bold" className="h-4 w-4" />
                  </span>
                  <p className="pt-1 text-sm font-semibold text-field md:col-span-4">{step.when}</p>
                  <div className="md:col-span-8">
                    <h3 className={`text-xl font-semibold tracking-tight ${step.tone === "next" ? "text-ink-soft" : "text-ink"}`}>
                      {step.title}
                    </h3>
                    <p className="mt-1 text-base text-ink-soft">{step.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </ol>
          </div>
        </section>

        {/* ── Equipo ──────────────────────────────────────────────── */}
        <section id="equipo">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 sm:py-32 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHead eyebrow={TEAM.eyebrow} title={TEAM.title}>
                <p className="mt-6 text-lg text-ink-soft">{TEAM.intro}</p>
              </SectionHead>
              <Reveal as="ul" delay={120} className="mt-10 divide-y divide-line border-y border-line">
                {TEAM.members.map((m) => (
                  <li key={m.name} className="flex flex-wrap items-baseline justify-between gap-2 py-5">
                    <span className="text-xl font-semibold tracking-tight">{m.name}</span>
                    <span className="text-sm text-ink-soft">{m.role}</span>
                  </li>
                ))}
              </Reveal>
              <Reveal delay={160} className="mt-8 rounded-2xl bg-paper-deep/70 p-5">
                <p className="font-semibold text-ink">{TEAM.group.name}</p>
                <p className="mt-1 text-sm text-ink-soft">
                  {TEAM.group.lab} · {TEAM.group.university}
                </p>
              </Reveal>
            </div>
            <Reveal as="figure" delay={150} className="lg:col-span-6 lg:col-start-7">
              <div className="overflow-hidden rounded-3xl">
                <Photo
                  name="equipo"
                  alt="Integrantes del equipo dentro de la cabina de la cosechadora durante una salida de campo"
                  sizes="(min-width: 1024px) 550px, 100vw"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
              <figcaption className="mt-3 text-sm text-ink-soft">En la cabina de la cosechadora, durante una salida de campo.</figcaption>
            </Reveal>
          </div>
        </section>

        {/* ── Límites ─────────────────────────────────────────────── */}
        <section className="bg-ink py-24 text-paper sm:py-32" aria-labelledby="limites">
          <div className="mx-auto grid max-w-6xl gap-16 px-6 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Reveal>
                <p className="text-sm font-semibold uppercase tracking-widest text-straw">{PRINCIPLES.eyebrow}</p>
                <h2 id="limites" className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
                  {PRINCIPLES.title}
                </h2>
              </Reveal>
            </div>
            <ol className="grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:col-span-8">
              {PRINCIPLES.items.map((item, i) => (
                <Reveal as="li" key={item.title} delay={i * 100} className="border-t border-paper/15 pt-6">
                  <span className="font-mono text-sm text-straw">0{i + 1}</span>
                  <h3 className="mt-3 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-base text-paper/70">{item.text}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Preguntas ───────────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 py-24 sm:py-32" aria-labelledby="preguntas">
          <div className="grid gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-4">
              <p className="text-sm font-semibold uppercase tracking-widest text-field">Preguntas</p>
              <h2 id="preguntas" className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Lo que suelen preguntar
              </h2>
            </Reveal>
            <Reveal delay={120} className="lg:col-span-8">
              <Faq />
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="bg-field-deep text-paper">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-xl font-bold">
              <img src="/favicon.svg" alt="" className="h-7 w-7" />
              RiceVi
            </p>
            <p className="mt-3 max-w-md text-sm text-paper/70">{FOOTER.line}</p>
            <p className="mt-1 text-sm text-paper/70">Universidad Surcolombiana · Neiva, 2026</p>
          </div>
          <div className="flex flex-col gap-3 text-sm sm:items-end">
            <a
              href={FOOTER.repo.href}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 font-semibold text-paper hover:text-straw"
            >
              {FOOTER.repo.label}
              <ArrowUpRight weight="bold" className="h-4 w-4 transition-transform duration-500 ease-fluid group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <a href="#inicio" className="text-paper/70 hover:text-paper">
              Volver arriba
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
