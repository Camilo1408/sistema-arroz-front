// Tamaños generados en public/img/ (ver README: cómo añadir fotos).
const SIZES = {
  cosechadora_frente: [1280, 2400],
  arrocera: [1000, 2000],
  cosechadora_cerca: [1000, 2000],
  vista_frontal: [900, 1800],
  arrocera_cosechada: [800, 1400],
  equipo: [800, 1400],
  tolva: [800, 1400],
};

/**
 * Foto responsiva: el navegador elige el archivo según el ancho real.
 * `sizes` describe cuánto ocupa la imagen en pantalla.
 */
export function Photo({ name, alt, sizes = "100vw", className = "", eager = false, ...rest }) {
  const widths = SIZES[name];
  const srcSet = widths.map((w) => `/img/${name}-${w}.webp ${w}w`).join(", ");
  return (
    <img
      src={`/img/${name}-${widths[0]}.webp`}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : undefined}
      decoding="async"
      className={className}
      {...rest}
    />
  );
}
