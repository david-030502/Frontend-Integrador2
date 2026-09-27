// src/components/TablaAlertas.jsx
import React from "react";
import { AlertCircle, CheckCircle2, ShieldAlert } from "lucide-react";

export default function TablaAlertas({ alertas, onAtenderAlerta }) {
  if (!alertas || alertas.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
        <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-2 opacity-80" />
        <h3 className="text-white font-semibold text-sm">Sin alertas críticas pendientes</h3>
        <p className="text-xs text-slate-500 mt-0.5">Todos los parámetros de la flota se encuentran en rangos seguros.</p>
      </div>
    );
  }

  // Estilos según la severidad de la alerta
  const obtenerEstiloNivel = (nivel) => {
    switch (nivel?.toLowerCase()) {
      case "critica":
      case "critico":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
      case "advertencia":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      default:
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-400" />
          <h2 className="text-base font-bold text-white">Alertas Activas del Sistema</h2>
        </div>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-semibold border border-rose-500/30">
          {alertas.length} {alertas.length === 1 ? "pendiente" : "pendientes"}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-800/60 text-slate-400 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-2.5 px-3 rounded-l-lg">Tipo / Nivel</th>
              <th className="py-2.5 px-3">Mensaje</th>
              <th className="py-2.5 px-3">Fecha y Hora</th>
              <th className="py-2.5 px-3 text-right rounded-r-lg">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {alertas.map((alerta) => (
              <tr key={alerta.id_alerta} className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-3 whitespace-nowrap">
                  <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${obtenerEstiloNivel(alerta.nivel_alerta || alerta.tipo_alerta)}`}>
                    {alerta.tipo_alerta || "Alerta"}
                  </span>
                </td>
                <td className="py-3 px-3 text-slate-200">
                    <div className="flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                        <span>{alerta.mensaje || alerta.tipo_alerta || "Alerta registrada"}</span>
                    </div>
                </td>
                <td className="py-3 px-3 text-slate-400 whitespace-nowrap">
                  {alerta.fecha_hora 
                    ? new Date(alerta.fecha_hora).toLocaleString([], { dateStyle: "short", timeStyle: "short" }) 
                    : "Reciente"}
                </td>
                <td className="py-3 px-3 text-right whitespace-nowrap">
                  <button
                    onClick={() => onAtenderAlerta(alerta.id_alerta)}
                    className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-medium transition-colors cursor-pointer"
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