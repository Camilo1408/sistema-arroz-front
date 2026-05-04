// src/components/shared/ImageCanvas.jsx
// Muestra una imagen con bounding boxes superpuestos en canvas.
// La imagen va en un <img> y los BB se dibujan en un <canvas> encima.

import { useEffect, useRef } from "react";

// Colores por clase de detección
const CLASS_COLORS = {
  panicula: {
    border: "#22c55e",
    fill: "rgba(34,197,94,0.15)",
    label: "#15803d",
  },
  cultivo_acamado: {
    border: "#ef4444",
    fill: "rgba(239,68,68,0.2)",
    label: "#b91c1c",
  },
  grano_integro: {
    border: "#22c55e",
    fill: "rgba(34,197,94,0.15)",
    label: "#15803d",
  },
  grano_roto: {
    border: "#f97316",
    fill: "rgba(249,115,22,0.15)",
    label: "#c2410c",
  },
  material_no_grano: {
    border: "#ef4444",
    fill: "rgba(239,68,68,0.15)",
    label: "#b91c1c",
  },
};

const DEFAULT_COLOR = {
  border: "#6366f1",
  fill: "rgba(99,102,241,0.15)",
  label: "#4338ca",
};

/**
 * @param {object} props
 * @param {string} [props.imageUrl] - URL de la imagen a mostrar
 * @param {import('@/types/models').Detection[]} props.detections - Array de detecciones
 * @param {number} [props.imageWidth] - Ancho original de la imagen procesada (para escalar BB)
 * @param {number} [props.imageHeight] - Alto original de la imagen procesada
 */
export function ImageCanvas({
  imageUrl,
  detections = [],
  imageWidth = 640,
  imageHeight = 640,
}) {
  const imgRef = useRef(null);
  const canvasRef = useRef(null);

  // Dibuja los bounding boxes cada vez que cambian las detecciones
  useEffect(() => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Espera a que la imagen cargue para conocer sus dimensiones reales en pantalla
    const draw = () => {
      const displayW = img.clientWidth;
      const displayH = img.clientHeight;

      // El canvas debe tener el mismo tamaño que la imagen en pantalla
      canvas.width = displayW;
      canvas.height = displayH;

      // Factor de escala: los BB vienen en coordenadas de la imagen original (640x640)
      // pero la imagen se muestra más pequeña en pantalla
      const scaleX = displayW / imageWidth;
      const scaleY = displayH / imageHeight;

      ctx.clearRect(0, 0, displayW, displayH);

      detections.forEach((det) => {
        const [x1, y1, x2, y2] = det.bbox;
        const colors = CLASS_COLORS[det.class] || DEFAULT_COLOR;

        // Escalar coordenadas
        const sx1 = x1 * scaleX;
        const sy1 = y1 * scaleY;
        const sw = (x2 - x1) * scaleX;
        const sh = (y2 - y1) * scaleY;

        // Fondo semitransparente del bounding box
        ctx.fillStyle = colors.fill;
        ctx.fillRect(sx1, sy1, sw, sh);

        // Borde del bounding box
        ctx.strokeStyle = colors.border;
        ctx.lineWidth = 2;
        ctx.strokeRect(sx1, sy1, sw, sh);

        // Etiqueta con clase y confianza
        const label = `${det.class} ${(det.confidence * 100).toFixed(0)}%`;
        const fontSize = 11;
        ctx.font = `bold ${fontSize}px sans-serif`;
        const textW = ctx.measureText(label).width;

        // Fondo de la etiqueta
        ctx.fillStyle = colors.border;
        ctx.fillRect(sx1 - 1, sy1 - fontSize - 5, textW + 8, fontSize + 6);

        // Texto de la etiqueta
        ctx.fillStyle = "#ffffff";
        ctx.fillText(label, sx1 + 3, sy1 - 4);
      });
    };

    if (img.complete) {
      draw();
    } else {
      img.addEventListener("load", draw);
      return () => img.removeEventListener("load", draw);
    }
  }, [detections, imageUrl, imageWidth, imageHeight]);

  return (
    <div className="relative w-full bg-gray-900 rounded-lg overflow-hidden">
      {imageUrl ? (
        <>
          <img
            ref={imgRef}
            src={imageUrl}
            alt="Frame analizado"
            className="w-full h-auto block"
            style={{ maxHeight: "400px", objectFit: "contain" }}
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
            style={{ pointerEvents: "none" }}
          />
        </>
      ) : (
        // Placeholder cuando no hay imagen cargada
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-3">
            <span className="text-2xl">🌾</span>
          </div>
          <p className="text-sm">Carga una imagen para analizar</p>
          <p className="text-xs text-gray-600 mt-1">Formatos: JPG, PNG</p>
        </div>
      )}
    </div>
  );
}
