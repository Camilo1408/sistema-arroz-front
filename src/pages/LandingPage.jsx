import { ArrowUpRight, Check, CircleDashed, Circle } from "@phosphor-icons/react";
import {
  PROBLEM,
  OBSERVES,
  SYSTEM,
  PHASES,
  PRINCIPLES,
  STATUS,
  TEAM,
  FOOTER,
} from "@/content/landing.js";
import { SiteNav } from "@/components/landing/SiteNav.jsx";
import { ScrollFilm } from "@/components/landing/ScrollFilm.jsx";
import { TaglineReveal } from "@/components/landing/TaglineReveal.jsx";
import { HarvesterMap } from "@/components/landing/HarvesterMap.jsx";
import { Faq } from "@/components/landing/Faq.jsx";
import { Reveal } from "@/components/landing/Reveal.jsx";
import { Photo } from "@/components/landing/Photo.jsx";

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

function DeviceTags({ devices }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {devices.map((d) => (
        <li key={d} className="rounded-full border border-line px-3 py-0.5 font-mono text-xs text-ink-soft">
          {d}
        </li>
      ))}
    </ul>
  );
}

/* ── Una zona observada: foto + qué hace + qué produce ───────────── */
function Zone({ zone, sizes, imgClass }) {
  return (
    <article>
      <div className="overflow-hidden rounded-3xl bg-paper-deep">
        <Photo name={zone.image} alt={zone.alt} sizes={sizes} className={`w-full object-cover ${imgClass}`} />
      </div>
      <div className="mt-6 space-y-3">
        <DeviceTags devices={zone.devices} />
        <h3 className="text-2xl font-semibold tracking-tight">{zone.title}</h3>
        <p className="text-base text-ink-soft">{zone.text}</p>
        <p className="flex items-baseline gap-3 border-t border-line pt-3 text-sm">
          <span className="shrink-0 font-semibold text-field">Resultado</span>
          <span className="text-ink">{zone.output}</span>
        </p>
      </div>
    </article>
  );
}

const STATUS_ICON = {
  done: { Icon: Check, cls: "bg-field text-paper" },
  now: { Icon: CircleDashed, cls: "bg-straw text-ink" },
  next: { Icon: Circle, cls: "bg-paper-deep text-ink-soft" },
};

export default function LandingPage() {
  const [preCorte, postCorte, tolva] = OBSERVES.zones;

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

        {/* ── El proyecto ─────────────────────────────────────────── */}
        <section id="proyecto" className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <SectionHead eyebrow={PROBLEM.eyebrow} title={PROBLEM.title} />
            </div>
            <Reveal delay={120} className="space-y-6 text-lg text-ink-soft lg:col-span-5 lg:col-start-8 lg:pt-10">
              {PROBLEM.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </Reveal>
          </div>

          <Reveal as="figure" className="mt-16">
            <div className="overflow-hidden rounded-3xl">
              <Photo
                name="arrocera"
                alt="Lote de arroz listo para cosechar bajo un cielo nublado, con una cosechadora al fondo"
                sizes="(min-width: 1152px) 1104px, 100vw"
                className="aspect-[16/9] w-full object-cover object-[50%_70%] sm:aspect-[21/9]"
              />
            </div>
            <figcaption className="mt-4 max-w-2xl text-sm text-ink-soft">
              <span className="font-semibold text-ink">Alcance honesto. </span>
              {PROBLEM.note}
            </figcaption>
          </Reveal>
        </section>

        <TaglineReveal />

        {/* ── Qué observa ─────────────────────────────────────────── */}
        <section id="observa" className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <SectionHead eyebrow={OBSERVES.eyebrow} title={OBSERVES.title} />

          <div className="mt-16">
            <Reveal className="flex items-center gap-4">
              <span className="text-sm font-semibold uppercase tracking-widest text-ink">Corte</span>
              <span className="h-px flex-1 bg-line" aria-hidden="true" />
            </Reveal>
            <div className="mt-8 grid gap-12 lg:grid-cols-12 lg:gap-8">
              <Reveal className="lg:col-span-7">
                <Zone zone={preCorte} sizes="(min-width: 1024px) 640px, 100vw" imgClass="aspect-[16/10]" />
              </Reveal>
              <Reveal delay={150} className="lg:col-span-5">
                <Zone zone={postCorte} sizes="(min-width: 1024px) 450px, 100vw" imgClass="aspect-[16/10] lg:aspect-[4/3] object-[50%_65%]" />
              </Reveal>
            </div>
          </div>

          <div className="mt-24">
            <Reveal className="flex items-center gap-4">
              <span className="text-sm font-semibold uppercase tracking-widest text-ink">Tolva</span>
              <span className="h-px flex-1 bg-line" aria-hidden="true" />
            </Reveal>
            <div className="mt-8 grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
              <Reveal className="lg:col-span-5">
                <div className="overflow-hidden rounded-3xl bg-paper-deep">
                  <Photo
                    name={tolva.image}
                    alt={tolva.alt}
                    sizes="(min-width: 1024px) 450px, 100vw"
                    className="aspect-[4/5] w-full object-cover"
                  />
                </div>
              </Reveal>
              <Reveal delay={150} className="space-y-4 lg:col-span-6 lg:col-start-7">
                <DeviceTags devices={tolva.devices} />
                <h3 className="text-3xl font-semibold tracking-tight sm:text-4xl">{tolva.title}</h3>
                <p className="text-lg text-ink-soft">{tolva.text}</p>
                <p className="flex items-baseline gap-3 border-t border-line pt-4 text-base">
                  <span className="shrink-0 font-semibold text-field">Resultado</span>
                  <span>{tolva.output}</span>
                </p>
              </Reveal>
            </div>
          </div>

          <Reveal as="p" className="mt-24 max-w-3xl border-l-0 text-2xl font-medium tracking-tight text-ink">
            {OBSERVES.context}
          </Reveal>
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

        {/* ── Fases ───────────────────────────────────────────────── */}
        <section id="fases" className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <SectionHead eyebrow={PHASES.eyebrow} title={PHASES.title} />

          <Reveal as="ol" className="mt-12 flex flex-wrap items-center gap-x-3 gap-y-3 text-sm font-semibold">
            {PHASES.flow.map((step, i) => (
              <li key={step} className="flex items-center gap-3">
                <span className="rounded-full bg-ink px-4 py-2 text-paper">{step}</span>
                {i < PHASES.flow.length - 1 && <span className="text-ink-soft" aria-hidden="true">→</span>}
              </li>
            ))}
          </Reveal>

          <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-2">
            {PHASES.items.map((phase, i) => (
              <Reveal key={phase.tag} delay={i * 150} className="bg-paper p-8 sm:p-12">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono text-sm text-field">{phase.tag}</span>
                  <span className="rounded-full bg-paper-deep px-3 py-1 text-xs font-semibold text-ink-soft">{phase.status}</span>
                </div>
                <h3 className="mt-8 text-3xl font-semibold tracking-tight">{phase.title}</h3>
                <p className="mt-4 text-base text-ink-soft">{phase.text}</p>
              </Reveal>
            ))}
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

        {/* ── Estado ──────────────────────────────────────────────── */}
        <section id="estado" className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <SectionHead eyebrow={STATUS.eyebrow} title={STATUS.title}>
            <p className="mt-4 text-sm text-ink-soft">Actualizado: {STATUS.updated}</p>
          </SectionHead>

          <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
            {STATUS.columns.map((col, i) => {
              const { Icon, cls } = STATUS_ICON[col.tone];
              return (
                <Reveal key={col.label} delay={i * 120}>
                  <h3 className="flex items-center gap-3 text-lg font-semibold">
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full ${cls}`}>
                      <Icon weight="bold" className="h-4 w-4" />
                    </span>
                    {col.label}
                  </h3>
                  <ul className="mt-6 space-y-4 border-t border-line pt-6">
                    {col.items.map((item) => (
                      <li key={item} className={`text-base ${col.tone === "next" ? "text-ink-soft" : "text-ink"}`}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* ── Preguntas ───────────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 pb-24 sm:pb-32" aria-labelledby="preguntas">
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

        {/* ── Equipo ──────────────────────────────────────────────── */}
        <section id="equipo" className="bg-paper-deep/60">
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
      </main>

      <footer className="bg-field-deep text-paper">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-xl font-bold">
              <img src="/favicon.svg" alt="" className="h-7 w-7" />
              RiceVi
            </p>
            <p className="mt-3 max-w-md text-sm text-paper/70">{FOOTER.line}</p>
            <p className="mt-1 text-sm text-paper/70">Universidad Surcolombiana · 2026</p>
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
