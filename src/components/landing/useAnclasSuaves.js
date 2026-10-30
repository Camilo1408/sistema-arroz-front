import { useEffect } from "react";

const DURACION = 900;
const suavizar = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/*
 * Desplazamiento suave para todos los enlaces internos (#problema, #ia…).
 *
 * Si el destino está a más de una pantalla, primero se acerca sin animar y
 * anima solo el último tramo. Así, al saltar desde la portada, el recorrido en
 * video no se reproduce a toda velocidad y el salto siempre dura lo mismo.
 *
 * Con «reducir movimiento» activado en el sistema, salta sin animar.
 */
export function useAnclasSuaves() {
  useEffect(() => {
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;

    const detener = () => cancelAnimationFrame(raf);

    const alHacerClic = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const enlace = e.target.closest?.('a[href^="#"]');
      if (!enlace) return;
      const id = decodeURIComponent(enlace.getAttribute("href").slice(1));
      const destino = id && document.getElementById(id);
      if (!destino) return;
      e.preventDefault();
      detener();

      // Respeta el espacio de la barra de navegación (scroll-padding-top) y el
      // scroll-margin-top propio del destino, igual que el salto nativo.
      const margen =
        (parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0) +
        (parseFloat(getComputedStyle(destino).scrollMarginTop) || 0);
      const maximo = document.documentElement.scrollHeight - window.innerHeight;
      const final = Math.min(maximo, Math.max(0, destino.getBoundingClientRect().top + window.scrollY - margen));
      history.replaceState(null, "", `#${id}`);

      if (reducido.matches) {
        window.scrollTo({ top: final, behavior: "instant" });
        return;
      }

      let inicio = window.scrollY;
      const tramo = window.innerHeight;
      if (Math.abs(final - inicio) > tramo) {
        inicio = final - Math.sign(final - inicio) * tramo;
        window.scrollTo({ top: inicio, behavior: "instant" });
      }
      const t0 = performance.now();
      const paso = (t) => {
        const p = Math.min(1, (t - t0) / DURACION);
        window.scrollTo({ top: inicio + (final - inicio) * suavizar(p), behavior: "instant" });
        if (p < 1) raf = requestAnimationFrame(paso);
      };
      raf = requestAnimationFrame(paso);
    };

    document.addEventListener("click", alHacerClic);
    // Si la persona mueve la rueda o toca la pantalla, manda ella.
    window.addEventListener("wheel", detener, { passive: true });
    window.addEventListener("touchstart", detener, { passive: true });
    window.addEventListener("keydown", detener);
    return () => {
      detener();
      document.removeEventListener("click", alHacerClic);
      window.removeEventListener("wheel", detener);
      window.removeEventListener("touchstart", detener);
      window.removeEventListener("keydown", detener);
    };
  }, []);
}
