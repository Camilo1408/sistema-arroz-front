import { ArrowDown, ArrowRight } from "@phosphor-icons/react";
import { HERO } from "@/content/landing.js";
import { Photo } from "./Photo.jsx";

/**
 * Portada a pantalla completa. Hoy usa una fotografía; cuando exista el
 * video del recorrido (scroll-world), se reemplaza el <Photo> por el
 * reproductor y el resto de la portada no cambia.
 */
export function Hero() {
  return (
    <section id="inicio" className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-field-deep">
      <Photo
        name="cosechadora_frente"
        alt="Cosechadora de arroz vista de frente, con el cabezal sobre el cultivo"
        eager
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="absolute inset-0 -z-10 h-full w-full object-cover object-[50%_40%] lg:left-auto lg:w-1/2"
      />
      {/* Móvil: velo plano sobre la foto. Escritorio: texto sobre fondo sólido a la izquierda */}
      <div className="absolute inset-0 -z-10 bg-field-deep/65 lg:hidden" aria-hidden="true" />

      <div className="mx-auto w-full max-w-6xl px-6 pb-16 pt-40 sm:pb-24 lg:pb-20">
        <div className="lg:max-w-md">
          <p className="text-sm font-semibold uppercase tracking-widest text-straw-soft">{HERO.eyebrow}</p>
          <h1 className="mt-4 max-w-hero text-4xl font-bold tracking-tight text-paper sm:text-6xl lg:text-5xl">
            {HERO.title[0]}
            <br className="hidden sm:block" /> {HERO.title[1]}
          </h1>
          <p className="mt-6 max-w-hero text-lg text-paper">{HERO.subtitle}</p>

          <div className="mt-10 flex flex-wrap items-center gap-6">
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

          <ul className="mt-16 flex flex-wrap gap-x-8 gap-y-2 border-t border-paper/20 pt-6 text-sm text-paper/75">
            {HERO.proof.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-straw" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
