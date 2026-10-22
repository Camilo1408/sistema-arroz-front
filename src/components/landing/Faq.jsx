import { useState } from "react";
import { Plus } from "@phosphor-icons/react";
import { FAQ } from "@/content/landing.js";

export function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <dl className="divide-y divide-line border-y border-line">
      {FAQ.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className="faq-item" data-open={isOpen}>
            <dt>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                aria-controls={`faq-${i}`}
                className="flex w-full items-center justify-between gap-6 py-6 text-left text-lg font-semibold text-ink transition-colors duration-500 ease-fluid hover:text-field"
              >
                {item.q}
                <Plus
                  weight="bold"
                  className={`h-5 w-5 shrink-0 transition-transform duration-700 ease-fluid ${isOpen ? "rotate-45" : ""}`}
                />
              </button>
            </dt>
            <dd id={`faq-${i}`} className="faq-body">
              <div className="overflow-hidden">
                <p className="max-w-2xl pb-6 text-base text-ink-soft">{item.a}</p>
              </div>
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
