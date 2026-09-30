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
  // Estado vacío / cargando
  if (!datos || datos.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded p-4 flex items-center justify-center h-80 text-slate-400 text-sm">
        Cargando historial de lecturas...
      </div>
    );
  }

  // Mapeo original intacto
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
    <div className="bg-white border border-slate-200 rounded p-4 space-y-3">
      {/* Encabezado y leyenda */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Historial de Microclima
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Tendencia de Temperatura (°C) y Humedad (%)
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-600"></span> Temp
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-600"></span> Hum
          </span>
        </div>
      </div>

      {/* Contenedor responsivo de la gráfica */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={datosFormateados} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            {/* Cuadrícula tenue */}
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            
            {/* Ejes con tipografía sobria */}
            <XAxis 
              dataKey="hora" 
              stroke="#cbd5e1" 
              tick={{ fill: "#64748b", fontSize: 11 }} 
              tickLine={false} 
            />
            <YAxis 
              stroke="#cbd5e1" 
              tick={{ fill: "#64748b", fontSize: 11 }} 
              tickLine={false} 
              domain={['auto', 'auto']} 
            />
            
            {/* Tooltip claro */}
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderColor: "#e2e8f0",
                borderRadius: "4px",
                color: "#0f172a",
                fontSize: "12px",
                boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)"
              }}
            />

            {/* Líneas con tonos estándar de alta legibilidad */}
            <Line
              type="monotone"
              dataKey="temperatura"
              stroke="#d97706"
              strokeWidth={1.5}
              dot={{ r: 2.5, fill: "#d97706" }}
              activeDot={{ r: 4 }}
              name="Temperatura (°C)"
            />
            <Line
              type="monotone"
              dataKey="humedad"
              stroke="#0284c7"
              strokeWidth={1.5}
              dot={{ r: 2.5, fill: "#0284c7" }}
              activeDot={{ r: 4 }}
              name="Humedad (%)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}