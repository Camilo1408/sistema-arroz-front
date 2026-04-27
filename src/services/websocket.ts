// src/services/websocket.ts
// ============================================================
// CLIENTE WEBSOCKET PARA ANÁLISIS EN TIEMPO REAL
// ============================================================
// Cuando el usuario carga un video, este servicio envía frame
// a frame al backend y recibe los resultados en tiempo real.

import type { InferenceResult } from '@/types/models';
import { mockS1Result, mockS2Result, mockS3Result } from '@/data/mockData';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws';
const USE_MOCK = true;

type MessageHandler = (result: InferenceResult) => void;
type ErrorHandler = (error: Event) => void;

/**
 * Crea una conexión WebSocket para un subsistema.
 * Retorna funciones para enviar frames y cerrar la conexión.
 */
export function createSubsystemSocket(
  subsystem: 'corte' | 'trilla' | 'limpieza',
  onMessage: MessageHandler,
  onError?: ErrorHandler
) {
  if (USE_MOCK) {
    // En modo mock: simula resultados llegando cada 1.5 segundos
    const mockResults = { corte: mockS1Result, trilla: mockS2Result, limpieza: mockS3Result };
    let interval: ReturnType<typeof setInterval> | null = null;
    let isActive = false;

    return {
      start: () => {
        isActive = true;
        interval = setInterval(() => {
          if (isActive) {
            // Genera pequeña variación en los datos para simular análisis en tiempo real
            const baseResult = mockResults[subsystem];
            const variedResult = {
              ...baseResult,
              frame_id: new Date().toISOString(),
              latency_ms: baseResult.latency_ms + (Math.random() - 0.5) * 3,
            };
            onMessage(variedResult);
          }
        }, 1500);
      },
      stop: () => {
        isActive = false;
        if (interval) clearInterval(interval);
      },
      sendFrame: (_frame: Blob) => { /* No-op en mock */ },
    };
  }

  // ── Implementación real con WebSocket ──
  const ws = new WebSocket(`${WS_URL}/infer/${subsystem}`);

  ws.onmessage = (event) => {
    try {
      const result: InferenceResult = JSON.parse(event.data);
      onMessage(result);
    } catch (e) {
      console.error('Error parseando mensaje WebSocket:', e);
    }
  };

  if (onError) ws.onerror = onError;

  return {
    start: () => { /* La conexión ya está activa */ },
    stop: () => ws.close(),
    sendFrame: (frame: Blob) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(frame);
      }
    },
  };
}