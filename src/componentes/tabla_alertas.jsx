// src/components/TablaAlertas.jsx
import React from "react";
import { AlertCircle, CheckCircle2, ShieldAlert } from "lucide-react";

export default function TablaAlertas({ alertas, onAtenderAlerta }) {
  if (!alertas || alertas.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded p-6 flex flex-col items-center justify-center text-center">
        <CheckCircle2 className="w-8 h-8 text-emerald-600 mb-2 stroke-[1.75]" />
        <h3 className="text-slate-900 font-medium text-sm">Sin alertas pendientes</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Todos los parámetros de la flota se encuentran dentro de los rangos operativos.
        </p>
      </div>
    );
  }

  // Estilos según la severidad de la alerta
  const obtenerEstiloNivel = (nivel) => {
    switch (nivel?.toLowerCase()) {
      case "critica":
      case "critico":
        return "bg-red-50 text-red-700 border-red-200";
      case "advertencia":
        return "bg-amber-50 text-amber-800 border-amber-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded p-4 space-y-3">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-slate-500" />
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Alertas del Sistema
          </h2>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-red-50 text-red-700 font-medium border border-red-200">
          {alertas.length} {alertas.length === 1 ? "pendiente" : "pendientes"}
        </span>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto border border-slate-200 rounded">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3">Tipo / Nivel</th>
              <th className="py-2.5 px-3">Mensaje</th>
              <th className="py-2.5 px-3">Fecha y Hora</th>
              <th className="py-2.5 px-3 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {alertas.map((alerta) => (
              <tr key={alerta.id_alerta} className="hover:bg-slate-50 transition-colors">
                <td className="py-2.5 px-3 whitespace-nowrap">
                  <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium border ${obtenerEstiloNivel(alerta.nivel_alerta || alerta.tipo_alerta)}`}>
                    {alerta.tipo_alerta || "Alerta"}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-slate-800">
                  <div className="flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{alerta.mensaje || alerta.tipo_alerta || "Alerta registrada"}</span>
                  </div>
                </td>
                <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">
                  {alerta.fecha_hora 
                    ? new Date(alerta.fecha_hora).toLocaleString([], { dateStyle: "short", timeStyle: "short" }) 
                    : "Reciente"}
                </td>
                <td className="py-2.5 px-3 text-right whitespace-nowrap">
                  <button
                    onClick={() => onAtenderAlerta(alerta.id_alerta)}
                    className="px-2.5 py-1 bg-white border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    Atender
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}