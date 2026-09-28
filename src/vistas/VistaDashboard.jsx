// src/views/DashboardView.jsx
import React, { useState, useEffect } from "react";
import { 
  listar_dispositivos, 
  obtener_ultimo_registro_byunidad,
  obtener_lecturas_byunidad,
  obtener_alertas_activas,
  atender_alerta
} from "../api/api";
import { 
  ShieldCheck,
  Truck, 
  Thermometer, 
  Droplets, 
  Wind, 
  Battery, 
  LogOut, 
  RefreshCw,
  AlertTriangle
} from "lucide-react";
import MapaMonitoreo from "../componentes/mapa";
import GraficaMicroclima from "../componentes/grafica_clima";
import TablaAlertas from "../componentes/tabla_alertas";

export default function VistaDashboard({ usuario, onCerrarSesion, onIrAAdmin }) {
  // Variables que guardan los datos que vienen de PostgreSQL
  const [camiones, setCamiones] = useState([]);
  const [camionSeleccionado, setCamionSeleccionado] = useState(null);
  const [telemetria, setTelemetria] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [error, setError] = useState(null);

  // 1. Cargar la lista de camiones al abrir la página
  useEffect(() => {
    async function cargarFlota() {
      try {
        setError(null);
        const dataCamiones = await listar_dispositivos();
        setCamiones(dataCamiones);
        
        if (dataCamiones.length > 0) {
          setCamionSeleccionado(dataCamiones[0].id_dispositivo);
        }
      } catch (err) {
        setError("Error al cargar la flota de camiones");
      }
    }
    cargarFlota();
  }, []);

  // 2. Cargar telemetría e historial de la unidad seleccionada (se refresca cada 10 seg)
  useEffect(() => {
    if (!camionSeleccionado) return;

    async function cargarDatosUnidad() {
      // Pedir última lectura para las tarjetas y el mapa
      try {
        const dataUltima = await obtener_ultimo_registro_byunidad(camionSeleccionado);
        setTelemetria(dataUltima);
      } catch (err) {
        setTelemetria(null);
      }

      // Pedir historial para la gráfica
      try {
        const dataHistorial = await obtener_lecturas_byunidad(camionSeleccionado, 20);
        if (Array.isArray(dataHistorial)) {
          setHistorial([...dataHistorial].reverse());
        }
      } catch (err) {
        setHistorial([]);
      }
    }

    cargarDatosUnidad();
    const intervalo = setInterval(cargarDatosUnidad, 10000);
    return () => clearInterval(intervalo);
  }, [camionSeleccionado]);

  // 3. Consultar las alertas activas del sistema
  async function cargarAlertas() {
    try {
      const dataAlertas = await obtener_alertas_activas();
      if (Array.isArray(dataAlertas)) {
        setAlertas(dataAlertas);
      }
    } catch (err) {
      console.error("Error al consultar alertas:", err);
    }
  }

  useEffect(() => {
    cargarAlertas();
    const intervaloAlertas = setInterval(cargarAlertas, 10000);
    return () => clearInterval(intervaloAlertas);
  }, []);

  // 4. Acción al presionar el botón "Atender" en una alerta
  const manejarAtender = async (idAlerta) => {
    try {
      await atender_alerta(idAlerta);
      cargarAlertas(); // Refresca la tabla tras la atención
    } catch (err) {
      alert("No se pudo marcar la alerta como atendida");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      
      {/* Barra superior de usuario */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🐔</span>
          <div>
            <h1 className="font-bold text-lg text-white leading-tight">
              Monitoreo Avícola Los Andes
            </h1>
            <p className="text-xs text-slate-400">Control de Cadena de Frío y Transporte</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs font-semibold text-emerald-400">{usuario.nombre || usuario.email}</p>
            <p className="text-[10px] uppercase text-slate-400 tracking-wider">{usuario.rol}</p>
          </div>

          {/* Botón de acceso al Panel Admin (solo si es administrador) */}
          {onIrAAdmin && (
            <button
              onClick={onIrAAdmin}
              className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Panel Admin</span>
            </button>
          )}

          {/* Botón Salir al final */}
          <button
            onClick={onCerrarSesion}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border border-slate-700 hover:border-rose-500/30 rounded-xl text-xs font-medium transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Salir</span>
          </button>
        </div>
      </header>

      {/* Contenido general */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        
        {/* Selector de Camión */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Unidad de Transporte
              </label>
              <select
                value={camionSeleccionado || ""}
                onChange={(e) => setCamionSeleccionado(Number(e.target.value))}
                className="mt-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                {camiones.map((c) => (
                  <option key={c.id_dispositivo} value={c.id_dispositivo}>
                    {c.nombre || c.nombre_dispositivo || `Dispositivo ${c.id_dispositivo}`} {c.placa || c.placa_vehiculo ? `(${c.placa || c.placa_vehiculo})` : ""} - {c.estado}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Actualización activa (10s)
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl flex items-center gap-3 text-sm">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 1. Fila de tarjetas métricas */}
        {telemetria ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs uppercase font-semibold text-slate-400 tracking-wider">Temperatura</p>
                <h3 className="text-2xl font-bold text-white mt-1">
                  {telemetria.temperatura != null ? `${telemetria.temperatura} °C` : "N/D"}
                </h3>
                <span className="text-[11px] text-slate-500">Rango: 18 - 24 °C</span>
              </div>
              <div className="p-3 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl">
                <Thermometer className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs uppercase font-semibold text-slate-400 tracking-wider">Humedad</p>
                <h3 className="text-2xl font-bold text-white mt-1">
                  {telemetria.humedad != null ? `${telemetria.humedad} %` : "N/D"}
                </h3>
                <span className="text-[11px] text-slate-500">Rango: 50 - 70 %</span>
              </div>
              <div className="p-3 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-xl">
                <Droplets className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs uppercase font-semibold text-slate-400 tracking-wider">Nivel NH3 / Gases</p>
                <h3 className="text-2xl font-bold text-white mt-1">
                  {telemetria.gases != null ? `${telemetria.gases} ppm` : "N/D"}
                </h3>
                <span className="text-[11px] text-slate-500">Límite: &lt; 25 ppm</span>
              </div>
              <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
                <Wind className="w-6 h-6" />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center text-slate-400">
            <RefreshCw className="w-5 h-5 mx-auto mb-2 animate-spin text-slate-600" />
            <p className="text-xs">Sin telemetría reciente para esta unidad...</p>
          </div>
        )}

        {/* 2. Fila con Mapa y Gráfica */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MapaMonitoreo 
            latitud={telemetria?.latitud} 
            longitud={telemetria?.longitud} 
            identificador={camiones.find(c => c.id_dispositivo === camionSeleccionado)?.placa_vehiculo}
          />
          <GraficaMicroclima datos={historial} />
        </div>

        {/* 3. Fila con Tabla de Alertas */}
        <TablaAlertas 
          alertas={alertas} 
          onAtenderAlerta={manejarAtender} 
        />

      </main>
    </div>
  );
}