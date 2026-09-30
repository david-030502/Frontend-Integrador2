// src/views/LoginView.jsx
import React, { useState } from "react";
import { iniciar_sesion } from "../api/api";
import { AlertCircle } from "lucide-react";

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
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-slate-50">
      
      {/* Panel Izquierdo: Marca / Banner gráfico */}
      <div className="relative w-full md:w-1/2 min-h-[280px] md:min-h-screen bg-slate-800 flex items-center justify-center p-8 overflow-hidden">
        {/* Capa de fondo con degradado azul translúcido (puedes reemplazar con tu imagen de fondo) */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/fondo-login.jpg')", // Coloca tu imagen en /public/fondo-login.jpg
            backgroundColor: "#1e3a5f" // Color de respaldo mientras carga la imagen
          }}
        />
        {/* Tinte azul semitransparente como en la maqueta */}
        <div className="absolute inset-0 bg-blue-900/60 backdrop-blur-[2px]" />

        {/* Textos institucionales */}
        <div className="relative z-10 text-center text-white px-4 max-w-md">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Sistema De Monitoreo
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold tracking-wider my-1">
            IoT
          </p>
          <p className="text-lg sm:text-xl font-light text-slate-200 mt-3">
            Avícola Los Andes S.A.C.
          </p>
        </div>
      </div>

      {/* Panel Derecho: Formulario de acceso */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-sm bg-white border border-slate-200 rounded-lg p-8 shadow-sm">
          
          <h1 className="text-xl font-bold text-slate-900 text-center mb-6">
            Iniciar Sesión
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label 
                htmlFor="input-usuario" 
                className="block text-xs font-normal text-slate-600 mb-1"
              >
                Usuario
              </label>
              <input
                id="input-usuario"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@andes.com.pe"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
              />
            </div>

            <div>
              <label 
                htmlFor="input-contrasena" 
                className="block text-xs font-normal text-slate-600 mb-1"
              >
                Contraseña
              </label>
              <input
                id="input-contrasena"
                type="password"
                required
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                id="recordar"
                type="checkbox"
                className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
              />
              <label 
                htmlFor="recordar" 
                className="text-xs text-slate-500 cursor-pointer select-none"
              >
                Recordar
              </label>
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded text-sm transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {cargando ? "Verificando..." : "Ingresar"}
            </button>
          </form>

        </div>
      </div>

    </div>
  );
}