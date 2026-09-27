// src/components/GraficaMicroclima.jsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function GraficaMicroclima({ datos }) {
  // Si no hay datos todavía
  if (!datos || datos.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-center h-80 text-slate-500 text-sm">
        Cargando historial de lecturas...
      </div>
    );
  }

  // Preparamos los datos formateando la hora para que sea legible
  const datosFormateados = datos.map((d, index) => {
    let hora = `P${index + 1}`;
    if (d.fecha_hora) {
      const fecha = new Date(d.fecha_hora);
      hora = fecha.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return {
      hora: hora,
      temperatura: d.temperatura,
      humedad: d.humedad,
    };
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white">Historial de Microclima</h2>
          <p className="text-xs text-slate-400">Tendencia de Temperatura (°C) y Humedad (%)</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-orange-400">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-400 inline-block"></span> Temp
          </span>
          <span className="flex items-center gap-1 text-cyan-400">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block"></span> Hum
          </span>
        </div>
      </div>

      {/* Contenedor responsivo de la gráfica */}
      <div className="h-80 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={datosFormateados}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="hora" stroke="#94a3b8" fontSize={11} />
            <YAxis stroke="#94a3b8" fontSize={11} domain={['auto', 'auto']} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#334155",
                borderRadius: "0.75rem",
                color: "#fff",
                fontSize: "12px",
              }}
            />
            <Line
              type="monotone"
              dataKey="temperatura"
              stroke="#fb923c"
              strokeWidth={2}
              dot={{ r: 3, fill: "#fb923c" }}
              name="Temperatura (°C)"
            />
            <Line
              type="monotone"
              dataKey="humedad"
              stroke="#22d3ee"
              strokeWidth={2}
              dot={{ r: 3, fill: "#22d3ee" }}
              name="Humedad (%)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}