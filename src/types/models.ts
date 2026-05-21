// src/types/models.ts
// ============================================================
// DEFINICIONES DE TIPOS GLOBALES DEL SISTEMA
// ============================================================
// Todos los archivos del proyecto importan sus tipos desde aquí.
// Cuando el backend cambie la estructura del JSON de respuesta,
// solo hay que actualizar este archivo y TypeScript indicará
// todos los lugares que necesitan actualizarse.

// ─── TIPOS GENERALES ────────────────────────────────────────

/**
 * Los tres subsistemas del sistema de diagnóstico.
 * TypeScript garantiza que ningún código puede usar un valor
 * diferente a estos tres exactos.
 */
export type Subsystem = 'corte' | 'trilla' | 'limpieza';

/**
 * Los tres niveles de alerta del sistema operativo.
 * - NORMAL: dentro de umbrales seguros
 * - ATENCION: cerca del umbral (80–100% del máximo)
 * - CRITICO: umbral superado, requiere acción inmediata
 */
export type AlertLevel = 'NORMAL' | 'ATENCION' | 'CRITICO';

/**
 * Una alerta generada por el sistema de diagnóstico.
 */
export interface Alert {
  id: string;            // Identificador único
  level: AlertLevel;     // Severidad
  message: string;       // Descripción del problema
  action?: string;       // Acción recomendada (opcional)
  timestamp: string;     // Cuándo ocurrió (ISO 8601)
  subsystem: Subsystem;  // Qué subsistema la generó
}

/**
 * Un bounding box de detección de objeto.
 * [x1, y1, x2, y2] en píxeles de la imagen procesada.
 * (x1,y1) = esquina superior izquierda
 * (x2,y2) = esquina inferior derecha
 */
export type BoundingBox = [number, number, number, number];

/**
 * Una detección individual de objeto (S1 y S3).
 */
export interface Detection {
  id: string;
  class: string;             // Nombre de la clase detectada
  confidence: number;        // Confianza entre 0 y 1
  bbox: BoundingBox;         // Coordenadas del bounding box
}

// ─── TIPOS ESPECÍFICOS POR SUBSISTEMA ───────────────────────

/**
 * Indicadores operativos del Subsistema 1 (Cabezal de Corte).
 * El backend calcula estos valores a partir de las detecciones.
 */
export interface S1Indicators {
  panicle_count: number;                      // Conteo total de panículas detectadas
  density_level: 'bajo' | 'normal' | 'alto'; // Nivel global de densidad (backend: s1_inference.py)
  lodging_detected: boolean;                  // ¿Hay cultivo acamado?
  lodging_conf?: number;                      // Confianza máxima de la detección de acame
  recommended_action?: string;               // Sugerencia de ajuste operativo
}

/**
 * Indicadores operativos del Subsistema 2 (Zona de Trilla).
 * Proporciones calculadas sobre el mapa de segmentación.
 */
export interface S2Indicators {
  intact_grain_pct: number;   // % grano íntegro (objetivo: maximizar)
  broken_grain_pct: number;   // % grano roto (umbral crítico: < 0.5%)
  straw_pct: number;          // % paja
  overload_detected: boolean; // ¿Flujo saturado de material?
  segmentation_map_url?: string; // URL de la imagen del mapa de segmentación
}

/**
 * Indicadores operativos del Subsistema 3 (Sistema de Limpieza).
 * Proporciones calculadas por área de bounding box ponderada.
 */
export interface S3Indicators {
  intact_grain_pct: number;    // % grano íntegro (debe dominar)
  broken_grain_pct: number;    // % grano roto (calidad degradada si alto)
  non_grain_pct: number;       // % material no-grano (umbral crítico: < 2%)
  total_detections: number;    // Total de partículas detectadas en el frame
  recommended_action?: string; // Sugerencia de ajuste (ventilador/cribas)
}

// ─── TIPO RESULTADO DE INFERENCIA ───────────────────────────

/**
 * Respuesta completa del backend para un frame analizado.
 * Este es el objeto principal que fluye desde el backend
 * a través del WebSocket o la API REST.
 */
export interface InferenceResult {
  subsystem: Subsystem;
  frame_id: string;        // Timestamp del frame procesado
  latency_ms: number;      // Tiempo de inferencia en milisegundos
  image_url?: string;      // URL de la imagen original (opcional)
  detections: Detection[]; // Lista de objetos detectados
  indicators: S1Indicators | S2Indicators | S3Indicators; // Según subsistema
  alerts: Alert[];         // Alertas generadas en este frame
}

// ─── TIPO HISTORIAL ─────────────────────────────────────────

/**
 * Un registro histórico almacenado en la base de datos.
 * Contiene la misma información que InferenceResult pero
 * persistida para consultas posteriores.
 */
export interface HistoryRecord {
  id: number;
  subsystem: Subsystem;
  timestamp: string;
  latency_ms: number;
  broken_grain_pct?: number;  // Para S2 y S3
  non_grain_pct?: number;     // Para S3
  panicle_count?: number;     // Para S1
  lodging_detected?: boolean; // Para S1
  alert_count: number;
}

// ─── TIPO CONFIGURACIÓN DE UMBRALES ─────────────────────────

/**
 * Umbrales operativos configurables por el supervisor.
 * Los valores por defecto provienen de la literatura científica
 * (documentada en el proyecto de investigación).
 */
export interface OperationalThresholds {
  // S1
  s1_lodging_alert: boolean;         // Siempre crítico si detectado
  // S2
  s2_broken_grain_warning: number;   // Advertencia (default: 0.3%)
  s2_broken_grain_critical: number;  // Crítico (default: 0.5%)
  // S3
  s3_non_grain_warning: number;      // Advertencia (default: 1.5%)
  s3_non_grain_critical: number;     // Crítico (default: 2.0%)
}

// ─── TIPO ESTADO DEL SISTEMA ─────────────────────────────────

/**
 * Estado resumido de todos los subsistemas para el Dashboard General.
 */
export interface SystemStatus {
  s1: {
    status: AlertLevel;
    last_panicle_count: number;
    lodging_detected: boolean;
    last_latency_ms: number;
  };
  s2: {
    status: AlertLevel;
    broken_grain_pct: number;
    intact_grain_pct: number;
    last_latency_ms: number;
  };
  s3: {
    status: AlertLevel;
    non_grain_pct: number;
    intact_grain_pct: number;
    last_latency_ms: number;
  };
  recent_alerts: Alert[];
  session_start: string;
}