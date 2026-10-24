// src/components/shared/VideoUpload.jsx
// Frame-by-frame video analysis: loads a video file, extracts frames at
// a configurable FPS using an off-screen canvas, and calls onFrameReady(blob)
// with each JPEG frame blob — same signature as FileUpload's onFileSelected.

import { useState, useRef, useCallback, useEffect } from "react";
import { Upload, Video, Play, Square, Cpu, XCircle, Film } from "lucide-react";
import clsx from "clsx";

const ACCEPT = "video/mp4,video/webm,video/ogg,video/quicktime,.avi,.mov";
const DEFAULT_FPS = 1;   // frames analysed per second of video
const MIN_FPS   = 0.5;
const MAX_FPS   = 4;

export function VideoUpload({ onFrameReady, isProcessing = false }) {
  const [videoUrl,   setVideoUrl]   = useState(null);
  const [fileName,   setFileName]   = useState(null);
  const [rejectMsg,  setRejectMsg]  = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // playback state
  const [isRunning,   setIsRunning]   = useState(false);
  const [frameIndex,  setFrameIndex]  = useState(0);   // frames sent so far
  const [fps,         setFps]         = useState(DEFAULT_FPS);

  const inputRef   = useRef(null);
  const videoRef   = useRef(null);
  const canvasRef  = useRef(null);
  const timerRef   = useRef(null);  // setInterval handle
  const busyRef    = useRef(false); // prevent overlapping inference calls

  // Clean up blob URL on unmount or new file
  useEffect(() => () => { if (videoUrl) URL.revokeObjectURL(videoUrl); }, [videoUrl]);

  const stopLoop = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = null;
    setIsRunning(false);
    busyRef.current = false;
  }, []);

  const captureFrame = useCallback(async () => {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || busyRef.current) return;

    // Stop when video ends
    if (video.ended || video.paused) {
      stopLoop();
      return;
    }

    busyRef.current = true;
    const ctx = canvas.getContext("2d");
    canvas.width  = video.videoWidth  || 640;
    canvas.height = video.videoHeight || 640;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      if (blob) {
        setFrameIndex(n => n + 1);
        try {
          await onFrameReady(blob);
        } catch (_) {
          // error displayed by parent
        }
      }
      busyRef.current = false;
    }, "image/jpeg", 0.92);
  }, [onFrameReady, stopLoop]);

  const startLoop = useCallback(() => {
    const video = videoRef.current;
    if (!video || !videoUrl) return;

    video.play();
    setIsRunning(true);
    setFrameIndex(0);
    busyRef.current = false;

    const intervalMs = Math.round(1000 / fps);
    timerRef.current = setInterval(captureFrame, intervalMs);
  }, [videoUrl, fps, captureFrame]);

  const handleStop = useCallback(() => {
    videoRef.current?.pause();
    stopLoop();
  }, [stopLoop]);

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("video/") && !file.name.match(/\.(mp4|webm|avi|mov|ogv)$/i)) {
      setRejectMsg("Solo se permiten archivos de video (MP4, WebM, AVI, MOV).");
      return;
    }
    if (timerRef.current) stopLoop();
    setRejectMsg(null);
    setFrameIndex(0);
    setIsRunning(false);
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setFileName(file.name);
  };

  // When video metadata loads, show the first frame as thumbnail
  const handleLoadedData = () => {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width  = video.videoWidth  || 640;
    canvas.height = video.videoHeight || 640;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
  };

  const durationLabel = videoRef.current?.duration
    ? `${videoRef.current.duration.toFixed(1)}s`
    : null;

  return (
    <div className="space-y-3">
      {/* ── Drop zone ──────────────────────────────────────── */}
      <div
        className={clsx(
          "relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 overflow-hidden",
          isDragging
            ? "border-blue-500 bg-blue-50 scale-[1.01]"
            : fileName
              ? "border-blue-300 bg-blue-50/50 hover:border-blue-400"
              : "border-stone-300 bg-stone-50/50 hover:border-blue-400 hover:bg-blue-50/30",
          isProcessing && "opacity-60 pointer-events-none"
        )}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]); }}
        onClick={() => !fileName && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          onChange={(e) => handleFile(e.target.files?.[0])}
          className="hidden"
        />

        {!fileName ? (
          <div className="flex flex-col items-center gap-3 py-1">
            <div className="flex items-center gap-2 text-stone-400">
              <Film className="w-6 h-6" />
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-stone-600">
                Arrastra aquí o{" "}
                <span className="text-blue-600 font-semibold underline underline-offset-2">selecciona un video</span>
              </p>
              <p className="text-xs text-stone-400 mt-1">MP4, WebM, AVI, MOV · Máx. 500 MB</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-1">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Video className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-700 truncate max-w-48">{fileName}</p>
              <p className="text-xs text-stone-400 mt-0.5">
                {durationLabel && `${durationLabel} · `}
                <button
                  type="button"
                  className="text-blue-500 underline underline-offset-1"
                  onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                >
                  cambiar video
                </button>
              </p>
            </div>
          </div>
        )}
      </div>

      {rejectMsg && (
        <div className="flex items-center gap-2 text-red-600 text-xs">
          <XCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {rejectMsg}
        </div>
      )}

      {/* ── Hidden video + canvas elements ─────────────────── */}
      {videoUrl && (
        <>
          <video
            ref={videoRef}
            src={videoUrl}
            muted
            playsInline
            preload="auto"
            className="hidden"
            onLoadedData={handleLoadedData}
            onEnded={stopLoop}
          />
          {/* Off-screen canvas used for frame capture */}
          <canvas ref={canvasRef} className="hidden" />
        </>
      )}

      {/* ── Controls (only shown once a video is loaded) ───── */}
      {videoUrl && (
        <div className="space-y-3 pt-1">
          {/* FPS selector */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-medium text-stone-500 w-28 flex-shrink-0">
              Velocidad de análisis
            </label>
            <input
              type="range"
              min={MIN_FPS}
              max={MAX_FPS}
              step={0.5}
              value={fps}
              disabled={isRunning}
              onChange={(e) => setFps(Number(e.target.value))}
              className="flex-1 accent-blue-500 disabled:opacity-40"
            />
            <span className="text-xs font-mono font-bold text-blue-700 w-14 text-right">
              {fps} fps
            </span>
          </div>

          {/* Play / Stop */}
          <div className="flex items-center gap-3">
            {!isRunning ? (
              <button
                type="button"
                onClick={startLoop}
                disabled={isProcessing}
                className={clsx(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all",
                  "bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                <Play className="w-4 h-4" />
                Iniciar análisis
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStop}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition-all"
              >
                <Square className="w-4 h-4" />
                Detener
              </button>
            )}

            {/* Status indicator */}
            <div className="flex items-center gap-2 text-xs text-stone-500">
              {isRunning && (
                <>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span>Analizando…</span>
                </>
              )}
              {isProcessing && (
                <>
                  <div className="relative w-4 h-4">
                    <div className="absolute inset-0 border-2 border-blue-200 rounded-full" />
                    <div className="absolute inset-0 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                  <Cpu className="w-3 h-3 text-blue-500" />
                  <span>Inferencia…</span>
                </>
              )}
              {frameIndex > 0 && !isRunning && (
                <span className="text-green-600 font-medium">{frameIndex} frames procesados</span>
              )}
              {frameIndex > 0 && isRunning && (
                <span className="font-mono text-stone-400">{frameIndex} frames</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
