// src/components/shared/FileUpload.jsx
// Zona de drag-and-drop para cargar imágenes o videos.

import { useState, useRef } from "react";
import { Upload, Image, Film } from "lucide-react";
import clsx from "clsx";

/**
 * @param {object} props
 * @param {(file: File) => void} props.onFileSelected - Callback cuando se selecciona un archivo
 * @param {'image'|'video'|'both'} [props.accept] - Tipos de archivo aceptados
 * @param {boolean} [props.isLoading] - Si está procesando un archivo
 */
export function FileUpload({
  onFileSelected,
  accept = "both",
  isLoading = false,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState(null);
  const inputRef = useRef(null);

  const acceptAttr = {
    image: "image/jpeg,image/png,image/jpg",
    video: "video/mp4,video/webm",
    both: "image/jpeg,image/png,image/jpg,video/mp4,video/webm",
  }[accept];

  const handleFile = (file) => {
    if (!file) return;
    setFileName(file.name);
    onFileSelected(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  return (
    <div
      className={clsx(
        "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all",
        isDragging
          ? "border-blue-400 bg-blue-50"
          : "border-gray-300 hover:border-blue-300 hover:bg-gray-50",
        isLoading && "opacity-50 pointer-events-none",
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={acceptAttr}
        onChange={handleChange}
        className="hidden"
      />

      {isLoading ? (
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-blue-600 font-medium">
            Procesando con IA...
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-2 text-gray-400">
            {(accept === "image" || accept === "both") && <Image size={24} />}
            {(accept === "video" || accept === "both") && <Film size={24} />}
            {accept === "both" && <Upload size={20} />}
          </div>
          <p className="text-sm text-gray-600">
            {fileName ? (
              <span className="text-blue-600 font-medium">{fileName}</span>
            ) : (
              <>
                Arrastra aquí o{" "}
                <span className="text-blue-600 underline">
                  haz clic para seleccionar
                </span>
              </>
            )}
          </p>
          <p className="text-xs text-gray-400">
            {accept === "image"
              ? "JPG, PNG"
              : accept === "video"
                ? "MP4, WebM"
                : "JPG, PNG, MP4"}{" "}
            · Máx. 50 MB
          </p>
        </div>
      )}
    </div>
  );
}
