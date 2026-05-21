// src/data/mockData.ts
// ============================================================
// DATOS FALSOS PARA DESARROLLO
// ============================================================
// Estos datos simulan exactamente lo que el backend enviará
// a través de la API REST o WebSocket.
// Cuando el backend esté listo, simplemente se reemplaza la
// fuente de datos en los hooks de `src/hooks/`.
// Los componentes NO necesitan cambiar.

import type {
  InferenceResult,
  SystemStatus,
  Alert,
  S1Indicators,
  S2Indicators,
  S3Indicators,
  HistoryRecord,
  OperationalThresholds,
} from '@/types/models';

// ─── ALERTAS DE EJEMPLO ─────────────────────────────────────

export const mockAlerts: Alert[] = [
  {
    id: 'a1',
    level: 'CRITICO',
    message: 'Cultivo acamado detectado en zona noreste',
    action: 'Reducir velocidad de avance de la cosechadora',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    subsystem: 'corte',
  },
  {
    id: 'a2',
    level: 'CRITICO',
    message: 'Material no-grano supera umbral: 13.1%',
    action: 'Verificar velocidad del ventilador y apertura de cribas',
    timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    subsystem: 'limpieza',
  },
  {
    id: 'a3',
    level: 'ATENCION',
    message: 'Densidad de panículas muy alta — posible sobrecarga de trilla',
    action: 'Monitorear activamente el flujo de trilla',
    timestamp: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
    subsystem: 'corte',
  },
  {
    id: 'a4',
    level: 'CRITICO',
    message: 'Porcentaje de grano roto excede 0.5% (S2)',
    action: 'Reducir velocidad del cilindro de trilla',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    subsystem: 'trilla',
  },
];

// ─── ESTADO DEL SISTEMA (DASHBOARD GENERAL) ─────────────────

export const mockSystemStatus: SystemStatus = {
  s1: {
    status: 'CRITICO',
    last_panicle_count: 47,
    lodging_detected: true,
    last_latency_ms: 13.5,
  },
  s2: {
    status: 'CRITICO',
    broken_grain_pct: 3.1,
    intact_grain_pct: 72.3,
    last_latency_ms: 42.0,
  },
  s3: {
    status: 'CRITICO',
    non_grain_pct: 13.1,
    intact_grain_pct: 84.1,
    last_latency_ms: 13.5,
  },
  recent_alerts: mockAlerts,
  session_start: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
};

// ─── RESULTADO S1 — CABEZAL DE CORTE ────────────────────────

const s1Indicators: S1Indicators = {
  panicle_count: 47,
  density_level: 'alto',
  lodging_detected: true,
  lodging_conf: 0.87,
  recommended_action: 'Reducir velocidad de avance. Cultivo acamado detectado.',
};

export const mockS1Result: InferenceResult = {
  subsystem: 'corte',
  frame_id: new Date().toISOString(),
  latency_ms: 13.5,
  detections: [
    { id: 'd1', class: 'panicula', confidence: 0.92, bbox: [120, 45, 180, 110] },
    { id: 'd2', class: 'panicula', confidence: 0.88, bbox: [200, 60, 265, 125] },
    { id: 'd3', class: 'panicula', confidence: 0.95, bbox: [310, 30, 375, 95] },
    { id: 'd4', class: 'cultivo_acamado', confidence: 0.87, bbox: [300, 60, 480, 200] },
    { id: 'd5', class: 'panicula', confidence: 0.79, bbox: [50, 120, 115, 185] },
    { id: 'd6', class: 'panicula', confidence: 0.91, bbox: [400, 80, 460, 145] },
  ],
  indicators: s1Indicators,
  alerts: [mockAlerts[0], mockAlerts[2]],
};

// ─── RESULTADO S2 — ZONA DE TRILLA ──────────────────────────

const s2Indicators: S2Indicators = {
  intact_grain_pct: 72.3,
  broken_grain_pct: 3.1,
  straw_pct: 24.6,
  overload_detected: false,
};

export const mockS2Result: InferenceResult = {
  subsystem: 'trilla',
  frame_id: new Date().toISOString(),
  latency_ms: 42.0,
  detections: [], // S2 usa segmentación, no bounding boxes
  indicators: s2Indicators,
  alerts: [mockAlerts[3]],
};

// ─── RESULTADO S3 — SISTEMA DE LIMPIEZA ─────────────────────

const s3Indicators: S3Indicators = {
  intact_grain_pct: 84.1,
  broken_grain_pct: 2.8,
  non_grain_pct: 13.1,
  total_detections: 156,
  recommended_action: 'Verificar velocidad del ventilador. Material no-grano excede 2%.',
};

export const mockS3Result: InferenceResult = {
  subsystem: 'limpieza',
  frame_id: new Date().toISOString(),
  latency_ms: 13.5,
  detections: [
    { id: 'p1', class: 'grano_integro', confidence: 0.94, bbox: [50, 80, 70, 100] },
    { id: 'p2', class: 'grano_integro', confidence: 0.91, bbox: [100, 120, 120, 140] },
    { id: 'p3', class: 'grano_roto', confidence: 0.85, bbox: [200, 60, 215, 72] },
    { id: 'p4', class: 'material_no_grano', confidence: 0.89, bbox: [300, 180, 330, 210] },
    { id: 'p5', class: 'grano_integro', confidence: 0.97, bbox: [400, 100, 420, 120] },
    { id: 'p6', class: 'material_no_grano', confidence: 0.82, bbox: [150, 250, 185, 285] },
  ],
  indicators: s3Indicators,
  alerts: [mockAlerts[1]],
};

// ─── HISTORIAL PARA GRÁFICAS ─────────────────────────────────
// Genera 30 puntos de datos históricos simulando variación realista

function generateHistory(
  subsystem: 'corte' | 'trilla' | 'limpieza',
  count: number = 30
): HistoryRecord[] {
  return Array.from({ length: count }, (_, i) => {
    const timestamp = new Date(Date.now() - (count - i) * 2000).toISOString();
    const base = { id: i + 1, subsystem, timestamp, latency_ms: 13 + Math.random() * 5, alert_count: 0 };

    if (subsystem === 'corte') {
      return { ...base, panicle_count: 30 + Math.floor(Math.random() * 30), lodging_detected: i > 20 };
    }
    if (subsystem === 'trilla') {
      return { ...base, broken_grain_pct: 0.2 + Math.random() * 4, alert_count: i > 15 ? 1 : 0 };
    }
    // limpieza
    return { ...base, non_grain_pct: 1 + Math.random() * 15, broken_grain_pct: 1 + Math.random() * 4 };
  });
}

export const mockS1History = generateHistory('corte');
export const mockS2History = generateHistory('trilla');
export const mockS3History = generateHistory('limpieza');

// ─── UMBRALES POR DEFECTO ────────────────────────────────────

export const defaultThresholds: OperationalThresholds = {
  s1_lodging_alert: true,
  s2_broken_grain_warning: 0.3,
  s2_broken_grain_critical: 0.5,
  s3_non_grain_warning: 1.5,
  s3_non_grain_critical: 2.0,
};