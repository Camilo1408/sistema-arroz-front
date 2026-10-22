import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/content/landing.js";

/* Isla de navegación flotante. En móvil, la hamburguesa se transforma
   en una X y abre una capa a pantalla completa con los enlaces. */
export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  // Marca la sección visible en la navegación
  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.slice(1));
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
          else setActive((cur) => (cur === e.target.id ? "" : cur));
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4">
      <nav
        aria-label="Principal"
        className="relative z-50 mt-6 flex w-full max-w-max items-center gap-2 rounded-full border border-line/70 bg-paper/95 py-2 pl-4 pr-2 shadow-[0_8px_32px_rgb(27_38_28/0.10)] lg:bg-paper/80 lg:backdrop-blur-xl"
      >
        <a href="#inicio" className="mr-2 flex items-center gap-2 text-base font-bold tracking-tight text-ink">
          <img src="/favicon.svg" alt="" className="h-6 w-6" />
          RiceVi
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive = active === link.href.slice(1);
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={isActive ? "true" : undefined}
                  className={`rounded-full px-3 py-2 text-sm font-semibold transition-colors duration-500 ease-fluid ${
                    isActive ? "bg-ink text-paper" : "text-ink-soft hover:bg-paper-deep hover:text-ink"
                  }`}
                >
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="menu-movil"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          className="relative ml-auto h-10 w-10 rounded-full transition-transform duration-500 ease-fluid hover:bg-paper-deep active:scale-95 lg:hidden"
        >
          <span
            className={`absolute left-3 right-3 h-0.5 rounded-full bg-ink transition-all duration-700 ease-fluid ${
              open ? "top-1/2 rotate-45" : "top-[15px]"
            }`}
          />
          <span
            className={`absolute left-3 right-3 h-0.5 rounded-full bg-ink transition-all duration-700 ease-fluid ${
              open ? "top-1/2 -rotate-45" : "top-[23px]"
            }`}
          />
        </button>
      </nav>

      <div
        id="menu-movil"
        className={`fixed inset-0 z-40 transition-opacity duration-700 ease-fluid lg:hidden ${
          open ? "bg-paper/80 opacity-100 backdrop-blur-3xl" : "pointer-events-none bg-paper opacity-0"
        }`}
        aria-hidden={!open}
      >
        <ul className="flex h-full flex-col justify-center gap-2 px-8">
          {NAV_LINKS.map((link, i) => (
            <li key={link.href} className="overflow-hidden">
              <a
                href={link.href}
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
                style={{ transitionDelay: open ? `${100 + i * 50}ms` : "0ms" }}
                className={`block py-2 text-4xl font-semibold tracking-tight text-ink transition-all duration-700 ease-fluid ${
                  open ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
