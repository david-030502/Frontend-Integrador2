// src/vistas/VistaAdmin.jsx
import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  LogOut,
  Truck,
  Users,
  AlertTriangle,
  Activity,
  UserPlus,
  PlusCircle,
  RefreshCw,
  X,
  CheckCircle2,
  AlertCircle,
  Check
} from "lucide-react";
import { 
  listar_usuarios, 
  crear_usuario, 
  listar_dispositivos, 
  crear_dispositivo,
  listar_historial_alertas,
  atender_alerta
} from "../api/api";

export default function VistaAdmin({ usuario, onCerrarSesion, onIrADashboard }) {
  // Pestañas disponibles: 'usuarios' | 'dispositivos' | 'alertas'
  const [seccionActiva, setSeccionActiva] = useState("usuarios");

  // Estados de Usuarios
  const [usuarios, setUsuarios] = useState([]);
  const [cargandoUsuarios, setCargandoUsuarios] = useState(false);
  const [mostrarModalUsuario, setMostrarModalUsuario] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [emailUsuario, setEmailUsuario] = useState("");
  const [contrasenaUsuario, setContrasenaUsuario] = useState("");
  const [guardandoUsuario, setGuardandoUsuario] = useState(false);

  // Estados de Dispositivos
  const [dispositivos, setDispositivos] = useState([]);
  const [cargandoDispositivos, setCargandoDispositivos] = useState(false);
  const [mostrarModalDispositivo, setMostrarModalDispositivo] = useState(false);
  const [placa, setPlaca] = useState("");
  const [nombreChofer, setNombreChofer] = useState("");
  const [estadoDispositivo, setEstadoDispositivo] = useState("Activo");
  const [guardandoDispositivo, setGuardandoDispositivo] = useState(false);

  // Estados de Alertas
  const [alertas, setAlertas] = useState([]);
  const [cargandoAlertas, setCargandoAlertas] = useState(false);
  const [atendiendoId, setAtendiendoId] = useState(null);

  // Notificaciones y errores
  const [mensajeExito, setMensajeExito] = useState("");
  const [errorGlobal, setErrorGlobal] = useState("");
  const [errorModal, setErrorModal] = useState("");

  // Carga de datos
  const cargarUsuarios = async () => {
    setCargandoUsuarios(true);
    setErrorGlobal("");
    try {
      const data = await listar_usuarios();
      setUsuarios(data);
    } catch (err) {
      setErrorGlobal(err.message || "Error al obtener usuarios.");
    } finally {
      setCargandoUsuarios(false);
    }
  };

  const cargarDispositivos = async () => {
    setCargandoDispositivos(true);
    setErrorGlobal("");
    try {
      const data = await listar_dispositivos();
      setDispositivos(data);
    } catch (err) {
      setErrorGlobal(err.message || "Error al obtener dispositivos.");
    } finally {
      setCargandoDispositivos(false);
    }
  };

  const cargarAlertas = async () => {
    setCargandoAlertas(true);
    setErrorGlobal("");
    try {
      const data = await listar_historial_alertas(50);
      setAlertas(data);
    } catch (err) {
      setErrorGlobal(err.message || "Error al obtener el historial de alertas.");
    } finally {
      setCargandoAlertas(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
    cargarDispositivos();
    cargarAlertas();
  }, []);

  // Registrar Usuario
  const handleSubmitUsuario = async (e) => {
    e.preventDefault();
    setErrorModal("");
    setGuardandoUsuario(true);

    try {
      await crear_usuario({
        nombre: nombreUsuario,
        email: emailUsuario,
        contrasena: contrasenaUsuario,
        rol: "operador",
      });

      setMensajeExito(`Operador "${nombreUsuario}" registrado con éxito.`);
      setMostrarModalUsuario(false);
      setNombreUsuario("");
      setEmailUsuario("");
      setContrasenaUsuario("");
      cargarUsuarios();
      setTimeout(() => setMensajeExito(""), 4000);
    } catch (err) {
      setErrorModal(err.message || "No se pudo registrar el usuario.");
    } finally {
      setGuardandoUsuario(false);
    }
  };

  // Registrar Dispositivo
  const handleSubmitDispositivo = async (e) => {
    e.preventDefault();
    setErrorModal("");
    setGuardandoDispositivo(true);

    try {
      await crear_dispositivo({
        placa: placa.toUpperCase().trim(),
        nombre_chofer: nombreChofer.trim(),
        estado: estadoDispositivo,
      });

      setMensajeExito(`Vehículo [${placa.toUpperCase()}] registrado correctamente.`);
      setMostrarModalDispositivo(false);
      setPlaca("");
      setNombreChofer("");
      setEstadoDispositivo("Activo");
      cargarDispositivos();
      setTimeout(() => setMensajeExito(""), 4000);
    } catch (err) {
      setErrorModal(err.message || "No se pudo registrar el dispositivo.");
    } finally {
      setGuardandoDispositivo(false);
    }
  };

  // Resolver / Atender Alerta
  const handleAtenderAlerta = async (idAlerta) => {
    setAtendiendoId(idAlerta);
    setErrorGlobal("");
    try {
      await atender_alerta(idAlerta, usuario.id_usuario);
      setMensajeExito(`Alerta #${idAlerta} marcada como atendida.`);
      await cargarAlertas();
      setTimeout(() => setMensajeExito(""), 4000);
    } catch (err) {
      setErrorGlobal(err.message || "No se pudo actualizar la alerta.");
    } finally {
      setAtendiendoId(null);
    }
  };

  // Formateador de fechas
  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return "-";
    const fecha = new Date(fechaStr);
    return isNaN(fecha.getTime()) ? fechaStr : fecha.toLocaleString();
  };

  const alertasPendientes = alertas.filter((a) => !a.fecha_vista).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      {/* Barra superior */}
      <header className="flex flex-wrap justify-between items-center pb-6 border-b border-slate-800 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Panel de Administración
            </h1>
            <p className="text-xs text-slate-400">
              Monitoreo Avícola Los Andes — Control de accesos, flota y trazabilidad
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block mr-2">
            <p className="text-sm font-medium text-white">{usuario.nombre}</p>
            <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
              Rol: {usuario.rol}
            </p>
          </div>

          <button
            onClick={onIrADashboard}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
          >
            <Activity className="w-4 h-4" />
            <span>Monitoreo en Vivo</span>
          </button>

          <button
            onClick={onCerrarSesion}
            className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Salir</span>
          </button>
        </div>
      </header>

      {/* Pestañas / Tarjetas interactivas */}
      <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pestaña Usuarios */}
        <div
          onClick={() => setSeccionActiva("usuarios")}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            seccionActiva === "usuarios"
              ? "bg-slate-900 border-cyan-500/50 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/30"
              : "bg-slate-900/60 border-slate-800 hover:border-slate-700 opacity-75 hover:opacity-100"
          }`}
        >
          <div className="flex items-center gap-3 text-cyan-400 mb-2">
            <Users className="w-5 h-5" />
            <h2 className="font-semibold text-white">Gestión de Usuarios</h2>
          </div>
          <p className="text-xs text-slate-400">
            {usuarios.length} operadores y administradores en sistema.
          </p>
        </div>

        {/* Pestaña Dispositivos y Flota */}
        <div
          onClick={() => setSeccionActiva("dispositivos")}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            seccionActiva === "dispositivos"
              ? "bg-slate-900 border-emerald-500/50 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30"
              : "bg-slate-900/60 border-slate-800 hover:border-slate-700 opacity-75 hover:opacity-100"
          }`}
        >
          <div className="flex items-center gap-3 text-emerald-400 mb-2">
            <Truck className="w-5 h-5" />
            <h2 className="font-semibold text-white">Dispositivos y Flota</h2>
          </div>
          <p className="text-xs text-slate-400">
            {dispositivos.length} unidades telemáticas registradas.
          </p>
        </div>

        {/* Pestaña Histórico de Alertas */}
        <div
          onClick={() => setSeccionActiva("alertas")}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            seccionActiva === "alertas"
              ? "bg-slate-900 border-amber-500/50 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/30"
              : "bg-slate-900/60 border-slate-800 hover:border-slate-700 opacity-75 hover:opacity-100"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
              <h2 className="font-semibold text-white">Histórico de Alertas</h2>
            </div>
            {alertasPendientes > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {alertasPendientes} activas
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">
            Auditoría y trazabilidad de contingencias operativas.
          </p>
        </div>
      </section>

      {/* Alertas informativas */}
      {mensajeExito && (
        <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-3 text-emerald-400 text-sm">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{mensajeExito}</span>
        </div>
      )}

      {errorGlobal && (
        <div className="mt-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-3 text-rose-400 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorGlobal}</span>
        </div>
      )}

      {/* 1. SECCIÓN DE USUARIOS */}
      {seccionActiva === "usuarios" && (
        <section className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                Cuentas Registradas
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Personal autorizado para operar el sistema
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={cargarUsuarios}
                disabled={cargandoUsuarios}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 text-sm transition-colors cursor-pointer"
                title="Recargar"
              >
                <RefreshCw className={`w-4 h-4 ${cargandoUsuarios ? "animate-spin text-cyan-400" : ""}`} />
              </button>

              <button
                onClick={() => {
                  setErrorModal("");
                  setMostrarModalUsuario(true);
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-sm transition-colors cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                <UserPlus className="w-4 h-4" />
                <span>Nuevo Usuario</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/60 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-6">ID</th>
                  <th className="py-3.5 px-6">Nombre Completo</th>
                  <th className="py-3.5 px-6">Correo Electrónico</th>
                  <th className="py-3.5 px-6">Rol de Sistema</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {cargandoUsuarios && usuarios.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-10 text-slate-500">Cargando usuarios...</td>
                  </tr>
                ) : usuarios.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-10 text-slate-500">No hay usuarios registrados.</td>
                  </tr>
                ) : (
                  usuarios.map((u) => (
                    <tr key={u.id_usuario} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-6 font-mono text-xs text-slate-500">#{u.id_usuario}</td>
                      <td className="py-4 px-6 font-medium text-white">{u.nombre}</td>
                      <td className="py-4 px-6 text-slate-400">{u.email}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${
                            u.rol?.toLowerCase() === "admin"
                              ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          }`}
                        >
                          {u.rol}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 2. SECCIÓN DE DISPOSITIVOS */}
      {seccionActiva === "dispositivos" && (
        <section className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-400" />
                Unidades de Transporte y Sensores
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Dispositivos IoT asignados al monitoreo de la cadena de frío
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={cargarDispositivos}
                disabled={cargandoDispositivos}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 text-sm transition-colors cursor-pointer"
                title="Recargar"
              >
                <RefreshCw className={`w-4 h-4 ${cargandoDispositivos ? "animate-spin text-emerald-400" : ""}`} />
              </button>

              <button
                onClick={() => {
                  setErrorModal("");
                  setMostrarModalDispositivo(true);
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition-colors cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Nuevo Dispositivo</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/60 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-6">ID Dispositivo</th>
                  <th className="py-3.5 px-6">Placa del Vehículo</th>
                  <th className="py-3.5 px-6">Conductor Asignado</th>
                  <th className="py-3.5 px-6">Estado Operativo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {cargandoDispositivos && dispositivos.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-10 text-slate-500">Cargando dispositivos...</td>
                  </tr>
                ) : dispositivos.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-10 text-slate-500">No hay dispositivos registrados en la flota.</td>
                  </tr>
                ) : (
                  dispositivos.map((d) => (
                    <tr key={d.id_dispositivo} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-6 font-mono text-xs text-slate-500">#{d.id_dispositivo}</td>
                      <td className="py-4 px-6 font-semibold text-white tracking-wider">
                        <span className="px-2.5 py-1 bg-slate-800 rounded-md border border-slate-700">
                          {d.placa}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-300">{d.nombre_chofer}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${
                            d.estado?.toLowerCase() === "activo"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                              : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                          }`}
                        >
                          {d.estado}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 3. SECCIÓN HISTÓRICO DE ALERTAS */}
      {seccionActiva === "alertas" && (
        <section className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                Historial y Auditoría de Contingencias
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Registro cronológico de advertencias telemáticas generadas durante el trayecto
              </p>
            </div>

            <button
              onClick={cargarAlertas}
              disabled={cargandoAlertas}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 text-sm transition-colors cursor-pointer"
              title="Recargar alertas"
            >
              <RefreshCw className={`w-4 h-4 ${cargandoAlertas ? "animate-spin text-amber-400" : ""}`} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/60 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-6">ID</th>
                  <th className="py-3.5 px-6">Tipo / Causa de Alerta</th>
                  <th className="py-3.5 px-6">Fecha y Hora</th>
                  <th className="py-3.5 px-6">Lectura Ref.</th>
                  <th className="py-3.5 px-6">Estado de Atención</th>
                  <th className="py-3.5 px-6 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {cargandoAlertas && alertas.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-slate-500">Cargando historial de alertas...</td>
                  </tr>
                ) : alertas.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-slate-500">No se registran contingencias en el sistema.</td>
                  </tr>
                ) : (
                  alertas.map((a) => {
                    const estaAtendida = !!a.fecha_vista;
                    return (
                      <tr key={a.id_alerta} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-4 px-6 font-mono text-xs text-slate-500">#{a.id_alerta}</td>
                        <td className="py-4 px-6 font-medium text-white">
                          <span className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${estaAtendida ? "bg-slate-500" : "bg-rose-500 animate-pulse"}`} />
                            {a.tipo_alerta}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-slate-400 text-xs">
                          {formatearFecha(a.fecha_hora)}
                        </td>
                        <td className="py-4 px-6 font-mono text-xs text-slate-400">
                          Lectura #{a.id_lectura}
                        </td>
                        <td className="py-4 px-6">
                          {estaAtendida ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                              <Check className="w-3 h-3" />
                              Atendida ({formatearFecha(a.fecha_vista)})
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                              <AlertCircle className="w-3 h-3" />
                              Pendiente
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right">
                          {!estaAtendida ? (
                            <button
                              onClick={() => handleAtenderAlerta(a.id_alerta)}
                              disabled={atendiendoId === a.id_alerta}
                              className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 border border-emerald-500/40 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer"
                            >
                              {atendiendoId === a.id_alerta ? "Procesando..." : "Atender"}
                            </button>
                          ) : (
                            <span className="text-xs text-slate-500">Resuelta</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* MODAL REGISTRAR USUARIO */}
      {mostrarModalUsuario && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setMostrarModalUsuario(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-cyan-400" />
              Registrar Nuevo Operador
            </h3>
            <p className="text-xs text-slate-400 mb-6">Complete los datos del personal operativo</p>

            {errorModal && (
              <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2 text-rose-400 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorModal}</span>
              </div>
            )}

            <form onSubmit={handleSubmitUsuario} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  value={nombreUsuario}
                  onChange={(e) => setNombreUsuario(e.target.value)}
                  placeholder="Ej: Carlos Mendoza"
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  required
                  value={emailUsuario}
                  onChange={(e) => setEmailUsuario(e.target.value)}
                  placeholder="carlos.m@losandes.com"
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Contraseña Temporal
                </label>
                <input
                  type="password"
                  required
                  value={contrasenaUsuario}
                  onChange={(e) => setContrasenaUsuario(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Rol Asignado
                </label>
                <input
                  type="text"
                  value="Operador"
                  readOnly
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-emerald-400 font-medium text-sm cursor-not-allowed focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setMostrarModalUsuario(false)}
                  className="w-1/2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-sm transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardandoUsuario}
                  className="w-1/2 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-sm transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-cyan-500/20"
                >
                  {guardandoUsuario ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL REGISTRAR DISPOSITIVO */}
      {mostrarModalDispositivo && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setMostrarModalDispositivo(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Truck className="w-5 h-5 text-emerald-400" />
              Registrar Nuevo Dispositivo
            </h3>
            <p className="text-xs text-slate-400 mb-6">Vincular hardware GPS y sensores a un camión avícola</p>

            {errorModal && (
              <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2 text-rose-400 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorModal}</span>
              </div>
            )}

            <form onSubmit={handleSubmitDispositivo} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Placa del Vehículo (Máx. 7 caracteres)
                </label>
                <input
                  type="text"
                  required
                  maxLength={7}
                  value={placa}
                  onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                  placeholder="Ej: ABC-123"
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm font-mono uppercase focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Nombre del Conductor (Máx. 70 caracteres)
                </label>
                <input
                  type="text"
                  required
                  maxLength={70}
                  value={nombreChofer}
                  onChange={(e) => setNombreChofer(e.target.value)}
                  placeholder="Ej: Roberto Quispe"
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Estado Operativo
                </label>
                <select
                  value={estadoDispositivo}
                  onChange={(e) => setEstadoDispositivo(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="Activo">Activo (En ruta / Disponible)</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setMostrarModalDispositivo(false)}
                  className="w-1/2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-sm transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardandoDispositivo}
                  className="w-1/2 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  {guardandoDispositivo ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}