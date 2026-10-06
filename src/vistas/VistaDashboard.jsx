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
  LogOut, 
  AlertTriangle
} from "lucide-react";
import MapaMonitoreo from "../componentes/mapa";
import GraficaMicroclima from "../componentes/grafica_clima";
import TablaAlertas from "../componentes/tabla_alertas";

export default function VistaDashboard({ usuario, onCerrarSesion, onIrAAdmin }) {
  const [camiones, setCamiones] = useState([]);
  const [camionSeleccionado, setCamionSeleccionado] = useState(null);
  const [telemetria, setTelemetria] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [error, setError] = useState(null);

  // 1. Cargar la flota
  useEffect(() => {
    async function cargarFlota() {
      try {
        setError(null);
        const data = await listar_dispositivos();
        setCamiones(data || []);
        if (data?.length > 0) {
          setCamionSeleccionado(data[0].id_dispositivo);
        }
      } catch (err) {
        setError("Error al cargar la flota de camiones");
      }
    }
    cargarFlota();
  }, []);

  // 2. Cargar telemetría e historial de la unidad seleccionada
  useEffect(() => {
    if (!camionSeleccionado) return;

    async function cargarDatosUnidad() {
      try {
        const dataUltima = await obtener_ultimo_registro_byunidad(camionSeleccionado);
        setTelemetria(dataUltima);
      } catch (err) {
        setTelemetria(null);
      }

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

  // 3. Consultar alertas activas
  async function cargarAlertas() {
    try {
      const data = await obtener_alertas_activas();
      if (Array.isArray(data)) {
        setAlertas(data);
      }
    } catch (err) {
      console.error("Error al consultar alertas:", err);
    }
  }

  useEffect(() => {
    cargarAlertas();
    const intervalo = setInterval(cargarAlertas, 10000);
    return () => clearInterval(intervalo);
  }, []);

  // 4. Atender alerta
  const manejarAtender = async (idAlerta) => {
    try {
      const idUsuarioActual = usuario?.id_usuario || 1;
      await atender_alerta(idAlerta, idUsuarioActual);
      cargarAlertas();
    } catch (err) {
      alert("No se pudo marcar la alerta como atendida");
    }
  };

  const unidadActual = camiones.find((c) => c.id_dispositivo === camionSeleccionado);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Barra de navegación superior */}
      <header className="bg-white border-b border-slate-200 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-slate-900">
              Avícola Los Andes
            </h1>
            <p className="text-xs text-slate-500">Control de Cadena de Frío y Transporte</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right text-xs">
              <span className="font-medium text-slate-900 block">
                {usuario?.nombre || usuario?.email || "Usuario"}
              </span>
              <span className="text-slate-500 uppercase text-[10px] tracking-wide">
                {usuario?.rol || "Operador"}
              </span>
            </div>

            {onIrAAdmin && (
              <button
                onClick={onIrAAdmin}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-slate-500" />
                Panel Admin
              </button>
            )}

            <button
              onClick={onCerrarSesion}
              className="flex items-center gap-1 text-xs text-slate-600 hover:text-red-600 transition-colors px-2 py-1.5 font-medium"
            >
              <LogOut className="w-3.5 h-3.5" />
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        
        {/* Selector de unidad */}
        <div className="bg-white border border-slate-200 rounded p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-slate-600" />
            <div>
              <label htmlFor="select-camion" className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                Unidad de Transporte
              </label>
              <select
                id="select-camion"
                value={camionSeleccionado || ""}
                onChange={(e) => setCamionSeleccionado(Number(e.target.value))}
                className="mt-1 bg-white border border-slate-300 rounded px-2.5 py-1 text-sm text-slate-900 focus:outline-none focus:border-slate-500"
              >
                {camiones.map((c) => (
                  <option key={c.id_dispositivo} value={c.id_dispositivo}>
                    {c.nombre || c.nombre_dispositivo || `Dispositivo ${c.id_dispositivo}`} {c.placa || c.placa_vehiculo ? `(${c.placa || c.placa_vehiculo})` : ""} - {c.estado}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            Actualización cada 10s
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Tarjetas métricas */}
        {telemetria ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded p-4">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Temperatura</span>
                <Thermometer className="w-4 h-4" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-2">
                {telemetria.temperatura != null ? `${telemetria.temperatura} °C` : "N/D"}
              </div>
              <p className="text-xs text-slate-500 mt-1">Rango: 22 - 32 °C</p>
            </div>

            <div className="bg-white border border-slate-200 rounded p-4">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Humedad</span>
                <Droplets className="w-4 h-4" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-2">
                {telemetria.humedad != null ? `${telemetria.humedad} %` : "N/D"}
              </div>
              <p className="text-xs text-slate-500 mt-1">Rango: 40 - 70 %</p>
            </div>

            <div className="bg-white border border-slate-200 rounded p-4">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Nivel NH3 / Gases</span>
                <Wind className="w-4 h-4" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-2">
                {telemetria.gases != null ? `${telemetria.gases} ppm` : "N/D"}
              </div>
              <p className="text-xs text-slate-500 mt-1">Límite: &lt; 1600 ppm</p>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded p-6 text-center text-slate-500 text-sm">
            Sin telemetría reciente para esta unidad.
          </div>
        )}

        {/* Mapa y Gráfica */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded overflow-hidden p-4">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Ubicación en tiempo real
            </h2>
            <MapaMonitoreo 
              latitud={telemetria?.latitud} 
              longitud={telemetria?.longitud} 
              identificador={unidadActual?.placa_vehiculo || unidadActual?.placa}
            />
          </div>

          <div className="bg-white border border-slate-200 rounded overflow-hidden p-4">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Historial de Microclima
            </h2>
            <GraficaMicroclima datos={historial} />
          </div>
        </div>

        {/* Tabla de Alertas */}
        <div className="bg-white border border-slate-200 rounded p-4">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Alertas del sistema
          </h2>
          <TablaAlertas 
            alertas={alertas} 
            onAtenderAlerta={manejarAtender} 
          />
        </div>

      </main>
    </div>
  );
}