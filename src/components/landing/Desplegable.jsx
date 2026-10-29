import { useId, useState } from "react";
import { Plus } from "@phosphor-icons/react";

/**
 * Detalle que solo se abre si alguien pregunta: arranca cerrado para no
 * alargar el recorrido. Usa la misma apertura suave que las preguntas
 * (.faq-body en index.css). Pensado para fondos oscuros.
 */
export function Desplegable({ titulo, children, className = "" }) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <div className={`faq-item border-y border-paper/15 ${className}`} data-open={open}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={id}
        className="flex w-full items-center justify-between gap-6 py-5 text-left text-lg font-semibold text-paper transition-colors duration-500 ease-fluid hover:text-straw"
      >
        {titulo}
        <Plus weight="bold" className={`h-5 w-5 shrink-0 transition-transform duration-700 ease-fluid ${open ? "rotate-45" : ""}`} />
      </button>
      <div id={id} className="faq-body">
        <div className="overflow-hidden" inert={!open}>
          {children}
        </div>
      </div>
    </div>
  );
}
