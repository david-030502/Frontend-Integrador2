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
  Check,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { 
  listar_usuarios, 
  crear_usuario,
  actualizar_usuario,
  eliminar_usuario,
  listar_dispositivos, 
  crear_dispositivo,
  actualizar_dispositivo,
  eliminar_dispositivo,
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

  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [nombreEditar, setNombreEditar] = useState("");
  const [emailEditar, setEmailEditar] = useState("");
  const [contrasenaEditar, setContrasenaEditar] = useState("");
  const [rolEditar, setRolEditar] = useState("operador");
  const [guardandoEdicion, setGuardandoEdicion] = useState(false);

  // Estados de Dispositivos
  const [dispositivos, setDispositivos] = useState([]);
  const [cargandoDispositivos, setCargandoDispositivos] = useState(false);
  const [mostrarModalDispositivo, setMostrarModalDispositivo] = useState(false);
  const [placa, setPlaca] = useState("");
  const [nombreChofer, setNombreChofer] = useState("");
  const [estadoDispositivo, setEstadoDispositivo] = useState("Activo");
  const [guardandoDispositivo, setGuardandoDispositivo] = useState(false);
  const [dispositivoEditando, setDispositivoEditando] = useState(null);

  // Estados de Alertas
  const [alertas, setAlertas] = useState([]);
  const [cargandoAlertas, setCargandoAlertas] = useState(false);
  const [atendiendoId, setAtendiendoId] = useState(null);

  // Notificaciones y errores
  const [mensajeExito, setMensajeExito] = useState("");
  const [errorGlobal, setErrorGlobal] = useState("");
  const [errorModal, setErrorModal] = useState("");

  //Paginacion
  const [paginaAlertas, setPaginaAlertas] = useState(1);
  const elementosPorPaginaAlertas = 15;

  const listaAlertas = Array.isArray(alertas)
    ? alertas
    : (alertas?.alertas || []);

  const totalAlertas = alertas?.total ?? 0;
  const totalPaginasAlertas = alertas?.total_paginas ?? 0;

  const indiceInicioAlertas =
    totalAlertas === 0
      ? 0
      : (paginaAlertas - 1) * elementosPorPaginaAlertas;

  const alertasVisibles = listaAlertas;
  // Carga de datos
  const cargarUsuarios = async () => {
    setCargandoUsuarios(true);
    setErrorGlobal("");
    try {
      const data = await listar_usuarios();
      setUsuarios(data || []);
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
      setDispositivos(data || []);
    } catch (err) {
      setErrorGlobal(err.message || "Error al obtener dispositivos.");
    } finally {
      setCargandoDispositivos(false);
    }
  };

  const cargarAlertas = async (pagina = paginaAlertas) => {
    setCargandoAlertas(true);
    setErrorGlobal("");

    try {
      const data = await listar_historial_alertas(
        pagina,
        elementosPorPaginaAlertas
      );

      setAlertas(data || {});
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

  const handleEditarUsuario = (usuario) => {
    setUsuarioEditando(usuario);
    setNombreEditar(usuario.nombre);
    setEmailEditar(usuario.email);
    setContrasenaEditar("");
    setRolEditar(usuario.rol?.toLowerCase() || "operador");
    setMostrarModalEditar(true);
  };

  //Actualizar usuario
  const handleGuardarEdicion = async() => {
    setErrorGlobal("");
    try{
      setGuardandoEdicion(true);
      const datos = {
        nombre: nombreEditar,
        email: emailEditar,
        rol: rolEditar,
      };
      if (contrasenaEditar.trim() != ""){
        datos.contrasena = contrasenaEditar;
      }
      await actualizar_usuario(usuarioEditando.id_usuario, datos);
      setMensajeExito("Usuario actualizado correctamente");
      setMostrarModalEditar(false);
      setUsuarioEditando(null);

      await cargarUsuarios()
      setTimeout(() => setMensajeExito(""), 4000); 
      } catch (err){
        setErrorGlobal(err.message || "No se puede actualizar el usuario");
      } finally{
        setGuardandoEdicion(false);
      }
    }

  //Elimiar usuario
  const handleEliminarUsuario = async(usuario) => {
    const confirmar = window.confirm(`¿Está seguro de eliminar al usuario "${usuario.nombre}"?`);
    if (!confirmar){
      return;
    }
    setErrorGlobal("");
    try{
      await eliminar_usuario(usuario.id_usuario);
      setMensajeExito("Usuario eliminado correctamente");
      await cargarUsuarios();
      setTimeout(() => setMensajeExito(""), 4000);
    }
    catch (err){
      setErrorGlobal(err.message || "No se puede eliminar al usuario");
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

  //Editar dispositivo
  const handleGuardarEdicionDispositivo = async () => {
    if (!dispositivoEditando) {
      return;
    }

    setGuardandoDispositivo(true);
    setErrorGlobal("");

    try {
      await actualizar_dispositivo(
        dispositivoEditando.id_dispositivo,
        {
          placa: dispositivoEditando.placa,
          nombre_chofer: dispositivoEditando.nombre_chofer,
          estado: dispositivoEditando.estado,
        }
      );

      setDispositivoEditando(null);
      setMensajeExito("Dispositivo actualizado correctamente");

      await cargarDispositivos();

      setTimeout(() => setMensajeExito(""), 4000);

    } catch (err) {
      setErrorGlobal(
        err.message || "Error al actualizar dispositivo"
      );
    } finally {
      setGuardandoDispositivo(false);
    }
  };

  //Eliminar dispositivo
  const handleEliminarDispositivo = async (dispositivo) => {
    const confirmar = window.confirm(
      `¿Está seguro de eliminar el dispositivo "${dispositivo.placa}"?`
    );

    if (!confirmar) {
      return;
    }

    setErrorGlobal("");

    try {
      await eliminar_dispositivo(dispositivo.id_dispositivo);
      setMensajeExito("Dispositivo eliminado correctamente");
      await cargarDispositivos();
      setTimeout(() => setMensajeExito(""), 4000);
    } catch (err) {
      setErrorGlobal(err.message || "No se puede eliminar el dispositivo");
    }
  };
  

  // Resolver / Atender Alerta
  const handleAtenderAlerta = async (idAlerta) => {
    setAtendiendoId(idAlerta);
    setErrorGlobal("");
    try {
      await atender_alerta(idAlerta, usuario?.id_usuario || 1);
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

  const alertasPendientes = (alertas.alertas || []).filter((a) => !a.fecha_vista).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Barra superior de navegación */}
      <header className="bg-white border-b border-slate-200 px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-base font-semibold text-slate-900 leading-tight">
                Panel de Administración
              </h1>
              <p className="text-xs text-slate-500">
                Avícola Los Andes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right text-xs hidden sm:block">
              <span className="font-medium text-slate-900 block">{usuario?.nombre || "Administrador"}</span>
              <span className="text-slate-500 uppercase text-[10px] tracking-wide">
                Rol: {usuario?.rol || "Admin"}
              </span>
            </div>

            {onIrADashboard && (
              <button
                onClick={onIrADashboard}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Activity className="w-4 h-4 text-slate-500" />
                <span>Monitoreo en Vivo</span>
              </button>
            )}

            <button
              onClick={onCerrarSesion}
              className="flex items-center gap-1 text-xs text-slate-600 hover:text-red-600 transition-colors px-2 py-1.5 font-medium"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        
        {/* Pestañas de sección */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Pestaña Usuarios */}
          <button
            type="button"
            onClick={() => setSeccionActiva("usuarios")}
            className={`p-4 rounded border text-left transition-colors ${
              seccionActiva === "usuarios"
                ? "bg-white border-slate-400 ring-1 ring-slate-400"
                : "bg-white border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center gap-2 text-slate-700 mb-1">
              <Users className="w-4 h-4 text-slate-500" />
              <h2 className="font-semibold text-sm text-slate-900">Gestión de Usuarios</h2>
            </div>
            <p className="text-xs text-slate-500">
              {usuarios.length} operadores y administradores en sistema
            </p>
          </button>

          {/* Pestaña Dispositivos */}
          <button
            type="button"
            onClick={() => setSeccionActiva("dispositivos")}
            className={`p-4 rounded border text-left transition-colors ${
              seccionActiva === "dispositivos"
                ? "bg-white border-slate-400 ring-1 ring-slate-400"
                : "bg-white border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center gap-2 text-slate-700 mb-1">
              <Truck className="w-4 h-4 text-slate-500" />
              <h2 className="font-semibold text-sm text-slate-900">Gestión de Dispositivos</h2>
            </div>
            <p className="text-xs text-slate-500">
              {dispositivos.length} unidades registradas
            </p>
          </button>

          {/* Pestaña Histórico de Alertas */}
          <button
            type="button"
            onClick={() => setSeccionActiva("alertas")}
            className={`p-4 rounded border text-left transition-colors ${
              seccionActiva === "alertas"
                ? "bg-white border-slate-400 ring-1 ring-slate-400"
                : "bg-white border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 text-slate-700">
                <AlertTriangle className="w-4 h-4 text-slate-500" />
                <h2 className="font-semibold text-sm text-slate-900">Historial de Alertas</h2>
              </div>
              {alertasPendientes > 0 && (
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-red-50 text-red-700 border border-red-200">
                  {alertasPendientes} activas
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Auditoría y trazabilidad de alertas operativas
            </p>
          </button>
        </section>

        {/* Notificaciones */}
        {mensajeExito && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
            <span>{mensajeExito}</span>
          </div>
        )}

        {errorGlobal && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
            <span>{errorGlobal}</span>
          </div>
        )}

        {/* 1. SECCIÓN DE USUARIOS */}
        {seccionActiva === "usuarios" && (
          <section className="bg-white border border-slate-200 rounded overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
              <div>
                <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Cuentas Registradas
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Personal autorizado para operar el sistema
                </p>
              </div>

              <div className="flex items-center gap-2">

                <button
                  onClick={() => {
                    setErrorModal("");
                    setMostrarModalUsuario(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium transition-colors"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Nuevo Usuario</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">ID</th>
                    <th className="py-2.5 px-4">Nombre Completo</th>
                    <th className="py-2.5 px-4">Correo Electrónico</th>
                    <th className="py-2.5 px-4">Rol de Sistema</th>
                    <th className="py-2.5 px-4">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {cargandoUsuarios && usuarios.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-8 text-slate-400">Cargando usuarios...</td>
                    </tr>
                  ) : usuarios.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-8 text-slate-400">No hay usuarios registrados.</td>
                    </tr>
                  ) : (
                    usuarios.map((u) => (
                      <tr key={u.id_usuario} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 px-4 font-mono text-slate-400">#{u.id_usuario}</td>
                        <td className="py-2.5 px-4 font-medium text-slate-800">{u.nombre}</td>
                        <td className="py-2.5 px-4 text-slate-600">{u.email}</td>
                        <td className="py-2.5 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium border ${
                              u.rol?.toLowerCase() === "admin"
                                ? "bg-slate-100 text-slate-800 border-slate-300"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200"
                            }`}
                          >
                            {u.rol}
                          </span>
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditarUsuario(u)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium transition-colors"
                            >Editar</button>
                            <button onClick={() => handleEliminarUsuario(u)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                            >Eliminar</button>
                          </div>
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
          <section className="bg-white border border-slate-200 rounded overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
              <div>
                <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Unidades de Transporte y Sensores
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Dispositivos IoT instalados para monitoreo
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setErrorModal("");
                    setMostrarModalDispositivo(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Nuevo Dispositivo</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">ID Dispositivo</th>
                    <th className="py-2.5 px-4">Placa del Vehículo</th>
                    <th className="py-2.5 px-4">Conductor Asignado</th>
                    <th className="py-2.5 px-4">Estado Operativo</th>
                    <th className="py-2.5 px-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {cargandoDispositivos && dispositivos.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-slate-400">Cargando dispositivos...</td>
                    </tr>
                  ) : dispositivos.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-slate-400">No hay dispositivos registrados en la flota.</td>
                    </tr>
                  ) : (
                    dispositivos.map((d) => (
                      <tr key={d.id_dispositivo} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 px-4 font-mono text-slate-400">#{d.id_dispositivo}</td>
                        <td className="py-2.5 px-4 font-semibold text-slate-800 tracking-wider">
                          <span className="px-2 py-0.5 bg-slate-100 rounded border border-slate-200 font-mono text-[11px]">
                            {d.placa}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-slate-700">{d.nombre_chofer}</td>
                        <td className="py-2.5 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium border ${
                              d.estado?.toLowerCase() === "activo"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-slate-100 text-slate-600 border-slate-200"
                            }`}
                          >
                            {d.estado}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => setDispositivoEditando(d)}
                            className="px-2.5 py-1 mr-2 bg-white border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleEliminarDispositivo(d)}
                            className="px-2.5 py-1 bg-white border border-red-300 rounded text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                          >
                            Eliminar
                          </button>
                          
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
          <section className="bg-white border border-slate-200 rounded overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
              <div>
                <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Historial y Auditoría de alertas
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Registro de alertas generadas durante el transporte
                </p>
              </div>

              <span className="text-xs px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium border border-slate-200">
                Total: {totalAlertas} {totalAlertas === 1 ? "registro" : "registros"}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">ID</th>
                    <th className="py-2.5 px-4">Tipo / Causa de Alerta</th>
                    <th className="py-2.5 px-4">Vehículo</th>
                    <th className="py-2.5 px-4">Fecha y Hora</th>
                    <th className="py-2.5 px-4">Lectura Ref.</th>
                    <th className="py-2.5 px-4">Estado de Atención</th>
                    <th className="py-2.5 px-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {cargandoAlertas && totalAlertas === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-8 text-slate-400"> {/* <-- CAMBIAR A 7 */}
                        Cargando historial de alertas...
                      </td>
                    </tr>
                  ) : totalAlertas === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-8 text-slate-400"> {/* <-- CAMBIAR A 7 */}
                        No se registran contingencias en el sistema.
                      </td>
                    </tr>
                  ) : (
                    alertasVisibles.map((a) => {
                      const estaAtendida = !!a.fecha_vista;
                      return (
                        <tr key={a.id_alerta} className="hover:bg-slate-50 transition-colors">
                          <td className="py-2.5 px-4 font-mono text-slate-400">#{a.id_alerta}</td>
                          <td className="py-2.5 px-4 font-medium text-slate-800">
                            <span className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${estaAtendida ? "bg-slate-300" : "bg-red-500"}`} />
                              {a.tipo_alerta}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 whitespace-nowrap text-slate-700">
                          {a.placa || `Dispositivo ${a.id_dispositivo}`}
                        </td>
                          <td className="py-2.5 px-4 text-slate-500 whitespace-nowrap">
                            {formatearFecha(a.fecha_hora)}
                          </td>
                          <td className="py-2.5 px-4 font-mono text-slate-400">
                            Lectura #{a.id_lectura}
                          </td>
                          <td className="py-2.5 px-4">
                            {estaAtendida ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <Check className="w-3 h-3" />
                                Atendida ({formatearFecha(a.fecha_vista)})
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-red-50 text-red-700 border border-red-200">
                                <AlertCircle className="w-3 h-3" />
                                Pendiente
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-4 text-right whitespace-nowrap">
                            {!estaAtendida ? (
                              <button
                                onClick={() => handleAtenderAlerta(a.id_alerta)}
                                disabled={atendiendoId === a.id_alerta}
                                className="px-2.5 py-1 bg-white border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
                              >
                                {atendiendoId === a.id_alerta ? "Procesando..." : "Atender"}
                              </button>
                            ) : (
                              <span className="text-xs text-slate-400">Resuelta</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Barra de paginación */}
            {totalPaginasAlertas > 1 && (
              <div className="flex items-center justify-between p-3.5 border-t border-slate-200 bg-slate-50/50 text-xs text-slate-500">
                <span>
                  Mostrando {indiceInicioAlertas + 1} - {Math.min(indiceInicioAlertas + elementosPorPaginaAlertas, totalAlertas)} de {totalAlertas}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      const nuevaPagina = Math.max(paginaAlertas - 1, 1);
                      setPaginaAlertas(nuevaPagina);
                      cargarAlertas(nuevaPagina);
                    }}
                    disabled={paginaAlertas === 1}
                    className="p-1 border border-slate-300 rounded bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    title="Página anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-2 font-medium text-slate-700">
                    {paginaAlertas} / {totalPaginasAlertas}
                  </span>
                  <button
                    onClick={() => {
                      const nuevaPagina = Math.min(
                        paginaAlertas + 1,
                        totalPaginasAlertas
                      );
                      setPaginaAlertas(nuevaPagina);
                      cargarAlertas(nuevaPagina);
                    }}
                    disabled={paginaAlertas === totalPaginasAlertas}
                    className="p-1 border border-slate-300 rounded bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    title="Página siguiente"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

      </main>

      {/* MODAL REGISTRAR USUARIO */}
      {mostrarModalUsuario && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-lg w-full max-w-md p-6 shadow-xl relative">
            <button
              onClick={() => setMostrarModalUsuario(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-sm font-semibold text-slate-900 mb-0.5 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-slate-600" />
              Registrar Nuevo Operador
            </h3>
            <p className="text-xs text-slate-500 mb-4">Complete los datos del personal operativo</p>

            {errorModal && (
              <div className="mb-4 p-2.5 bg-red-50 border border-red-200 rounded text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorModal}</span>
              </div>
            )}

            <form onSubmit={handleSubmitUsuario} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  value={nombreUsuario}
                  onChange={(e) => setNombreUsuario(e.target.value)}
                  placeholder="Ej: Carlos Mendoza"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-sm focus:outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  required
                  value={emailUsuario}
                  onChange={(e) => setEmailUsuario(e.target.value)}
                  placeholder="carlos.m@losandes.com"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-sm focus:outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Contraseña Temporal
                </label>
                <input
                  type="password"
                  required
                  value={contrasenaUsuario}
                  onChange={(e) => setContrasenaUsuario(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-sm focus:outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Rol Asignado
                </label>
                <input
                  type="text"
                  value="Operador"
                  readOnly
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-slate-500 font-medium text-sm cursor-not-allowed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setMostrarModalUsuario(false)}
                  className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 font-medium rounded text-xs hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardandoUsuario}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded text-xs transition-colors disabled:opacity-50"
                >
                  {guardandoUsuario ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* MODAL EDITAR USUARIO */}
      {mostrarModalEditar && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-lg w-full max-w-md p-6 shadow-xl relative">

            <button
              onClick={() => setMostrarModalEditar(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-sm font-semibold text-slate-900 mb-0.5 flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-600" />
              Editar Usuario
            </h3>

            <p className="text-xs text-slate-500 mb-4">
              Modifique los datos del usuario seleccionado
            </p>

            {errorGlobal && (
              <div className="mb-4 p-2.5 bg-red-50 border border-red-200 rounded text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorGlobal}</span>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleGuardarEdicion();
              }}
              className="space-y-3"
            >

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nombre Completo
                </label>

                <input
                  type="text"
                  required
                  maxLength={70}
                  value={nombreEditar}
                  onChange={(e) => setNombreEditar(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-sm focus:outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Correo Electrónico
                </label>

                <input
                  type="email"
                  required
                  maxLength={120}
                  value={emailEditar}
                  onChange={(e) => setEmailEditar(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-sm focus:outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nueva Contraseña
                </label>

                <input
                  type="password"
                  minLength={8}
                  maxLength={30}
                  value={contrasenaEditar}
                  onChange={(e) => setContrasenaEditar(e.target.value)}
                  placeholder="Dejar vacío para mantener la actual"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-sm focus:outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Rol Asignado
                </label>

                <select
                  value={rolEditar}
                  onChange={(e) => setRolEditar(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-sm focus:outline-none focus:border-slate-500"
                >
                  <option value="operador">Operador</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">

                <button
                  type="button"
                  onClick={() => setMostrarModalEditar(false)}
                  className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 font-medium rounded text-xs hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={guardandoEdicion}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded text-xs transition-colors disabled:opacity-50"
                >
                  {guardandoEdicion ? "Guardando..." : "Guardar cambios"}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL REGISTRAR DISPOSITIVO */}
      {mostrarModalDispositivo && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-lg w-full max-w-md p-6 shadow-xl relative">
            <button
              onClick={() => setMostrarModalDispositivo(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-sm font-semibold text-slate-900 mb-0.5 flex items-center gap-2">
              <Truck className="w-4 h-4 text-slate-600" />
              Registrar Nuevo Dispositivo
            </h3>
            <p className="text-xs text-slate-500 mb-4">Vincular hardware GPS y sensores a un camión avícola</p>

            {errorModal && (
              <div className="mb-4 p-2.5 bg-red-50 border border-red-200 rounded text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorModal}</span>
              </div>
            )}

            <form onSubmit={handleSubmitDispositivo} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Placa del Vehículo (Máx. 7 caracteres)
                </label>
                <input
                  type="text"
                  required
                  maxLength={7}
                  value={placa}
                  onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                  placeholder="Ej: ABC-123"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-sm font-mono uppercase focus:outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nombre del Conductor (Máx. 70 caracteres)
                </label>
                <input
                  type="text"
                  required
                  maxLength={70}
                  value={nombreChofer}
                  onChange={(e) => setNombreChofer(e.target.value)}
                  placeholder="Ej: Roberto Quispe"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-sm focus:outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Estado Operativo
                </label>
                <select
                  value={estadoDispositivo}
                  onChange={(e) => setEstadoDispositivo(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-sm focus:outline-none focus:border-slate-500"
                >
                  <option value="Activo">Activo (En ruta / Disponible)</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setMostrarModalDispositivo(false)}
                  className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 font-medium rounded text-xs hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardandoDispositivo}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded text-xs transition-colors disabled:opacity-50"
                >
                  {guardandoDispositivo ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* MODAL EDITAR DISPOSITIVO */}
      {dispositivoEditando && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-lg w-full max-w-md p-6 shadow-xl relative">

            <button
              onClick={() => setDispositivoEditando(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-sm font-semibold text-slate-900 mb-0.5">
              Editar Dispositivo
            </h3>

            <p className="text-xs text-slate-500 mb-4">
              Modifique los datos del dispositivo seleccionado
            </p>

            {errorGlobal && (
              <div className="mb-4 p-2.5 bg-red-50 border border-red-200 rounded text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorGlobal}</span>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleGuardarEdicionDispositivo();
              }}
              className="space-y-3"
            >

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Placa del Vehículo
                </label>

                <input
                  type="text"
                  maxLength={7}
                  value={dispositivoEditando.placa}
                  onChange={(e) =>
                    setDispositivoEditando({
                      ...dispositivoEditando,
                      placa: e.target.value,
                    })
                  }
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-sm focus:outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Conductor Asignado
                </label>

                <input
                  type="text"
                  maxLength={70}
                  value={dispositivoEditando.nombre_chofer}
                  onChange={(e) =>
                    setDispositivoEditando({
                      ...dispositivoEditando,
                      nombre_chofer: e.target.value,
                    })
                  }
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-sm focus:outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Estado Operativo
                </label>

                <select
                  value={dispositivoEditando.estado}
                  onChange={(e) =>
                    setDispositivoEditando({
                      ...dispositivoEditando,
                      estado: e.target.value,
                    })
                  }
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-sm focus:outline-none focus:border-slate-500"
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">

                <button
                  type="button"
                  onClick={() => setDispositivoEditando(null)}
                  className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 font-medium rounded text-xs hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={guardandoDispositivo}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded text-xs transition-colors disabled:opacity-50"
                >
                  {guardandoDispositivo ? "Guardando..." : "Guardar cambios"}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}