// src/views/LoginView.jsx
import React, { useState } from "react";
import { iniciar_sesion } from "../api/api";
import { Mail, Lock, AlertCircle } from "lucide-react";

export default function LoginView({ onLoginExitoso }) {
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      // Enviamos email y contraseña
      const datos = await iniciar_sesion(email, contrasena);

      localStorage.setItem("token", datos.access_token);
      localStorage.setItem("usuario_sesion", JSON.stringify(datos));
      onLoginExitoso(datos);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🐔</div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Monitoreo Avícola
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Control de Flota y Microclima en Transporte
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@losandes.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-emerald-500/20"
          >
            {cargando ? "Verificando..." : "Ingresar al Sistema"}
          </button>
        </form>

      </div>
    </div>
  );
}