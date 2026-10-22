import { useEffect, useRef, useState } from "react";
import { TAGLINE } from "@/content/landing.js";

// Palabras que se encienden en amarillo en vez de blanco
const ACCENT = new Set(["verla.", "datos"]);

/**
 * Frase grande que se ilumina palabra por palabra mientras la sección
 * cruza la pantalla. Un solo listener de scroll, limitado con
 * requestAnimationFrame y pasivo.
 */
export function TaglineReveal() {
  const ref = useRef(null);
  const words = TAGLINE.split(" ");
  const [lit, setLit] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLit(words.length);
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 cuando el bloque asoma abajo; 1 cuando llega al tercio superior
      const progress = (vh * 0.85 - rect.top) / (vh * 0.85 - vh * 0.3 + rect.height * 0.5);
      const clamped = Math.min(Math.max(progress, 0), 1);
      setLit(Math.round(clamped * words.length));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [words.length]);

  return (
    <section aria-label="Idea central" className="bg-field-deep px-6 py-24 sm:py-32">
      <p ref={ref} className="mx-auto max-w-4xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl sm:leading-tight">
        {words.map((word, i) => (
          <span
            key={i}
            className={`tagline-word ${i < lit ? "is-on" : ""} ${ACCENT.has(word) ? "is-accent" : ""}`}
          >
            {word}{" "}
          </span>
        ))}
      </p>
    </section>
  );
}
