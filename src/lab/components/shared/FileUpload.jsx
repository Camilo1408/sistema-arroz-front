import { useState, useRef } from "react";
import { Upload, ImageIcon, CheckCircle2, Cpu, XCircle } from "lucide-react";
import clsx from "clsx";

const ACCEPT = "image/jpeg,image/png,image/jpg,image/webp";

export function FileUpload({ onFileSelected, isLoading = false }) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName]     = useState(null);
  const [rejectMsg, setRejectMsg]   = useState(null);
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setRejectMsg("Solo se permiten imágenes (JPG, PNG). Los archivos de video no son compatibles.");
      return;
    }
    setRejectMsg(null);
    setFileName(file.name);
    onFileSelected(file);
  };

  return (
    <div>
      <div
        className={clsx(
          "relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 overflow-hidden",
          isDragging
            ? "border-green-500 bg-green-50 scale-[1.01]"
            : fileName
              ? "border-green-300 bg-green-50/50 hover:border-green-400"
              : "border-stone-300 bg-stone-50/50 hover:border-green-400 hover:bg-green-50/30",
          isLoading && "opacity-60 pointer-events-none"
        )}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]); }}
        onClick={() => inputRef.current?.click()}
      >
        {isDragging && <div className="absolute inset-0 animate-shimmer pointer-events-none" />}

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          onChange={(e) => handleFile(e.target.files?.[0])}
          className="hidden"
        />

        {isLoading ? (
          <div className="flex flex-col items-center gap-3 py-2">
            <div className="relative">
              <div className="w-10 h-10 border-2 border-green-200 rounded-full" />
              <div className="absolute inset-0 w-10 h-10 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
              <Cpu className="absolute inset-0 m-auto w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-green-700">Procesando con IA...</p>
              <p className="text-xs text-green-500 mt-0.5">Inferencia en curso</p>
            </div>
          </div>
        ) : fileName ? (
          <div className="flex flex-col items-center gap-2 py-1">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-green-700 truncate max-w-48">{fileName}</p>
              <p className="text-xs text-stone-400 mt-0.5">Clic para cambiar imagen</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-1">
            <div className="flex items-center gap-2 text-stone-400">
              <ImageIcon className="w-6 h-6" />
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-stone-600">
                Arrastra aquí o{" "}
                <span className="text-green-600 font-semibold underline underline-offset-2">selecciona una imagen</span>
              </p>
              <p className="text-xs text-stone-400 mt-1">JPG, PNG · Máx. 50 MB</p>
            </div>
          </div>
        )}
      </div>

      {rejectMsg && (
        <div className="flex items-center gap-2 mt-2 text-red-600 text-xs">
          <XCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {rejectMsg}
        </div>
      )}
    </div>
  );
}
