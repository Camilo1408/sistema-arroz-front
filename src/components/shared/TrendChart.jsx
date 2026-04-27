// src/components/shared/TrendChart.jsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

export function TrendChart({
  data,
  dataKey,
  label,
  color = "#3b82f6",
  threshold,
  unit = "%",
  xKey = "timestamp",
}) {
  // PROTECCIÓN: Recharts falla si data no es array válido
  const safeData = Array.isArray(data)
    ? data.filter((d) => d && typeof d === "object")
    : [];

  if (safeData.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg border border-dashed border-gray-200">
        <div className="text-center text-gray-400">
          <p className="text-sm">Sin datos históricos aún</p>
          <p className="text-xs mt-1">Carga imágenes para ver la tendencia</p>
        </div>
      </div>
    );
  }

  const formatXAxis = (value) => {
    try {
      return new Date(value).toLocaleTimeString("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return String(value).slice(-5);
    }
  };

  const formatTooltip = (value) => {
    const num = typeof value === "number" ? value : parseFloat(value);
    return isNaN(num) ? ["—", label] : [`${num.toFixed(2)}${unit}`, label];
  };

  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart
        data={safeData}
        margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey={xKey}
          tickFormatter={formatXAxis}
          tick={{ fontSize: 11, fill: "#64748b" }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#64748b" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${v}${unit}`}
          width={45}
        />
        <Tooltip
          formatter={formatTooltip}
          labelFormatter={formatXAxis}
          contentStyle={{
            backgroundColor: "#1e293b",
            border: "none",
            borderRadius: "8px",
            color: "#f1f5f9",
            fontSize: "12px",
          }}
        />
        {threshold !== undefined && (
          <ReferenceLine
            y={threshold}
            stroke="#ef4444"
            strokeDasharray="4 4"
            label={{
              value: `Umbral: ${threshold}${unit}`,
              position: "insideTopRight",
              fill: "#ef4444",
              fontSize: 10,
            }}
          />
        )}
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: color }}
          animationDuration={300}
          connectNulls={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
