// src/App.jsx
import React, { useState, useEffect } from "react";
import VistaLogin from "./vistas/VistaLogin";
import VistaDashboard from "./vistas/VistaDashboard";
import VistaAdmin from "./vistas/VistaAdmin";
import { eliminar_token } from "./api/api.js";

export default function App() {
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const [vistaActual, setVistaActual] = useState("admin"); // 'admin' o 'dashboard'

  // Comprobar si ya había iniciado sesión previamente
  useEffect(() => {
    const sesionGuardada = localStorage.getItem("usuario_sesion");
    if (sesionGuardada) {
      try {
        const datos = JSON.parse(sesionGuardada);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUsuarioActivo(datos);
        setVistaActual(datos.rol?.toLowerCase() === "admin" ? "admin" : "dashboard");
      } catch (e) {
        console.log(e);
        localStorage.removeItem("usuario_sesion");
      }
    }
  }, []);

  const manejarLoginExitoso = (datos) => {
    setUsuarioActivo(datos);
    setVistaActual(datos.rol?.toLowerCase() === "admin" ? "admin" : "dashboard");
  };

  const cerrarSesion = () => {
    localStorage.removeItem("usuario_sesion");
    setUsuarioActivo(null);
    setVistaActual("admin");
    eliminar_token();
  };

  // 1. Si no hay sesión, mostrar Login
  if (!usuarioActivo) {
    return <VistaLogin onLoginExitoso={manejarLoginExitoso} />;
  }

  const esAdmin = usuarioActivo.rol?.toLowerCase() === "admin";

  // 2. Si es admin y eligió ver el panel administrativo
  if (esAdmin && vistaActual === "admin") {
    return (
      <VistaAdmin
        usuario={usuarioActivo}
        onCerrarSesion={cerrarSesion}
        onIrADashboard={() => setVistaActual("dashboard")}
      />
    );
  }

  // 3. Monitoreo en vivo (operadores o admin alternando)
  return (
    <VistaDashboard
      usuario={usuarioActivo}
      onCerrarSesion={cerrarSesion}
      onIrAAdmin={esAdmin ? () => setVistaActual("admin") : null}
    />
  );
}