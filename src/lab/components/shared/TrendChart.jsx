import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Area, AreaChart
} from "recharts";
import { TrendingUp } from "lucide-react";

const CustomTooltip = ({ active, payload, label, unit, formatX }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-stone-900 border border-stone-700 text-stone-100 rounded-xl px-3 py-2 shadow-xl text-xs">
      <p className="text-stone-400 mb-1">{formatX(label)}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-mono font-semibold">
          {p.name}: {typeof p.value === "number" ? p.value.toFixed(2) : p.value}{unit}
        </p>
      ))}
    </div>
  );
};

export function TrendChart({ data, dataKey, label, color = "#16a34a", threshold, unit = "%", xKey = "timestamp", filled = false }) {
  const safeData = Array.isArray(data) ? data.filter(d => d && typeof d === "object") : [];

  const formatX = (val) => {
    try {
      return new Date(val).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
    } catch {
      return String(val).slice(-5);
    }
  };

  if (safeData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 rounded-xl border border-dashed border-stone-200 bg-stone-50/50 gap-2 text-stone-400">
        <TrendingUp className="w-8 h-8 opacity-30" />
        <p className="text-sm font-medium">Sin datos históricos</p>
        <p className="text-xs">Carga imágenes para ver la tendencia</p>
      </div>
    );
  }

  const ChartComponent = filled ? AreaChart : LineChart;
  const commonProps = {
    data: safeData,
    margin: { top: 8, right: 12, left: -8, bottom: 0 },
  };

  return (
    <ResponsiveContainer width="100%" height={190}>
      <ChartComponent {...commonProps}>
        <defs>
          <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={color} stopOpacity={0.18} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
        <XAxis
          dataKey={xKey}
          tickFormatter={formatX}
          tick={{ fontSize: 10, fill: "#a8a29e" }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 10, fill: "#a8a29e" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={v => `${v}${unit}`}
          width={44}
        />
        <Tooltip content={<CustomTooltip unit={unit} formatX={formatX} />} />
        {threshold !== undefined && (
          <ReferenceLine
            y={threshold}
            stroke="#ef4444"
            strokeDasharray="4 4"
            strokeWidth={1.5}
            label={{ value: `Umbral ${threshold}${unit}`, position: "insideTopRight", fill: "#ef4444", fontSize: 10 }}
          />
        )}
        {filled ? (
          <>
            <Area
              type="monotone"
              dataKey={dataKey}
              name={label}
              stroke={color}
              strokeWidth={2}
              fill={`url(#grad-${dataKey})`}
              dot={false}
              activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
              animationDuration={400}
            />
          </>
        ) : (
          <Line
            type="monotone"
            dataKey={dataKey}
            name={label}
            stroke={color}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
            animationDuration={400}
            connectNulls={false}
          />
        )}
      </ChartComponent>
    </ResponsiveContainer>
  );
}
