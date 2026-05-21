// src/services/api.ts
// ============================================================
// CLIENTE HTTP PARA LA API REST DEL BACKEND
// ============================================================

import type { InferenceResult, SystemStatus, HistoryRecord } from '@/types/models';
import {
  mockS1Result, mockS2Result, mockS3Result,
  mockSystemStatus, mockS1History, mockS2History, mockS3History,
} from '@/data/mockData';

// URL base del backend.
// Durante desarrollo apunta al backend local.
// En producción, cambiar a la URL del servidor.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// ─── FLAG DE MODO MOCK ───────────────────────────────────────
// Cambia a false cuando el backend esté disponible
const USE_MOCK = false;

// ─── FUNCIÓN DE DELAY PARA SIMULAR LATENCIA DE RED ──────────
const fakeDelay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

// ─── FUNCIÓN AUXILIAR PARA PETICIONES HTTP ──────────────────
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const rawBody = await response.text();
    let detail = rawBody;
    try {
      const parsed = JSON.parse(rawBody);
      detail = parsed.detail ?? rawBody;
    } catch { /* body is not JSON */ }
    console.error(`[API] ${options?.method ?? 'GET'} ${url} → ${response.status}`, detail);
    throw new Error(`Error HTTP ${response.status}: ${detail}`);
  }

  return response.json() as Promise<T>;
}

// ─── ENDPOINTS PÚBLICOS ──────────────────────────────────────

/**
 * Obtiene el estado resumido de todos los subsistemas.
 * Usado en el Dashboard General.
 */
export async function getSystemStatus(): Promise<SystemStatus> {
  if (USE_MOCK) {
    await fakeDelay(600);
    return mockSystemStatus;
  }
  return fetchAPI<SystemStatus>('/status');
}

/**
 * Envía una imagen al backend para análisis.
 * Retorna el resultado de inferencia del subsistema especificado.
 *
 * @param subsystem - 'corte' | 'trilla' | 'limpieza'
 * @param imageFile - El archivo de imagen seleccionado por el usuario
 */
export async function analyzeImage(
  subsystem: 'corte' | 'trilla' | 'limpieza',
  imageFile: File
): Promise<InferenceResult> {
  if (USE_MOCK) {
    await fakeDelay(1200); // Simula tiempo de inferencia del modelo
    const mockResults = { corte: mockS1Result, trilla: mockS2Result, limpieza: mockS3Result };
    return mockResults[subsystem];
  }

  // En producción: envía el archivo como FormData
  const formData = new FormData();
  formData.append('image', imageFile);

  return fetchAPI<InferenceResult>(`/infer/${subsystem}`, {
    method: 'POST',
    headers: {}, // No incluir Content-Type — el browser lo pone automáticamente con FormData
    body: formData,
  });
}

/**
 * Obtiene el historial de diagnósticos de un subsistema.
 * Usado en las gráficas de tendencia de cada vista.
 */
export async function getHistory(
  subsystem: 'corte' | 'trilla' | 'limpieza',
  limit = 30
): Promise<HistoryRecord[]> {
  if (USE_MOCK) {
    await fakeDelay(400);
    const histories = { corte: mockS1History, trilla: mockS2History, limpieza: mockS3History };
    return histories[subsystem].slice(-limit);
  }
  return fetchAPI<HistoryRecord[]>(`/history/${subsystem}?limit=${limit}`);
}

/**
 * Exporta el diagnóstico actual a CSV.
 * Descarga el archivo automáticamente en el navegador.
 */
export async function exportDiagnosticCSV(subsystem: 'corte' | 'trilla' | 'limpieza'): Promise<void> {
  if (USE_MOCK) {
    // En modo mock, genera un CSV básico con los datos locales
    const histories = { corte: mockS1History, trilla: mockS2History, limpieza: mockS3History };
    const data = histories[subsystem];
    const csvContent = [
      'timestamp,subsystem,latency_ms,alert_count',
      ...data.map(r => `${r.timestamp},${r.subsystem},${r.latency_ms},${r.alert_count}`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `diagnostico_${subsystem}_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    return;
  }

  const response = await fetch(`${BASE_URL}/history/export?subsystem=${subsystem}`);
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `diagnostico_${subsystem}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

// src/services/api.ts — AGREGA estas funciones nuevas al final

/**
 * Obtiene el historial persistente de la BD.
 */
export async function getHistoryFromDB(
  subsystem?: 'corte' | 'trilla' | 'limpieza',
  limit = 30,
  offset = 0
): Promise<{ total: number; records: any[] }> {
  if (USE_MOCK) {
    await fakeDelay(400);
    const histories = { corte: mockS1History, trilla: mockS2History, limpieza: mockS3History };
    const all = subsystem ? histories[subsystem] : [...mockS1History, ...mockS2History, ...mockS3History];
    return { total: all.length, records: all.slice(offset, offset + limit) };
  }

  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
  if (subsystem) params.append('subsystem', subsystem);
  return fetchAPI(`/history?${params}`);
}

/**
 * Obtiene estadísticas resumidas de un subsistema desde la BD.
 */
export async function getSubsystemStats(
  subsystem: 'corte' | 'trilla' | 'limpieza'
): Promise<any> {
  if (USE_MOCK) {
    await fakeDelay(300);
    return { count: 30, critical_count: 3, avg_broken_pct: 0.4 };
  }
  return fetchAPI(`/history/stats/${subsystem}`);
}

export interface OperationalThresholds {
  s2_broken_warning: number;
  s2_broken_critical: number;
  s3_non_grain_warning: number;
  s3_non_grain_critical: number;
}

/**
 * Lee los umbrales operativos desde el backend (fuente única de verdad: config.py).
 * Fallback: valores del documento [6] si el backend no está disponible.
 */
export async function getOperationalThresholds(): Promise<OperationalThresholds> {
  const FALLBACK: OperationalThresholds = {
    s2_broken_warning:    0.3,
    s2_broken_critical:   0.5,  // Liu et al. [6]: rotura < 0.5 %
    s3_non_grain_warning:  1.5,
    s3_non_grain_critical: 2.0, // Liu et al. [13]: impurezas < 2 %
  };
  if (USE_MOCK) return FALLBACK;
  try {
    const health = await fetchAPI<{ thresholds?: OperationalThresholds }>('/health');
    return health.thresholds ?? FALLBACK;
  } catch {
    return FALLBACK;
  }
}

/**
 * Elimina un análisis específico del historial.
 */
export async function deleteAnalysis(id: number): Promise<void> {
  if (USE_MOCK) {
    await fakeDelay(200);
    return;
  }
  return fetchAPI(`/history/record/${id}`, { method: 'DELETE' });
}