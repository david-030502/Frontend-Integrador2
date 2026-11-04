// src/App.jsx
import { useState } from "react";
import VistaLogin from "./vistas/VistaLogin";
import VistaDashboard from "./vistas/VistaDashboard";
import VistaAdmin from "./vistas/VistaAdmin";

function leerSesionGuardada() {
  const sesionGuardada = localStorage.getItem("usuario_sesion");
  if (!sesionGuardada) return null;
  try {
    return JSON.parse(sesionGuardada);
  } catch {
    localStorage.removeItem("usuario_sesion");
    return null;
  }
}

export default function App() {
  const [usuarioActivo, setUsuarioActivo] = useState(leerSesionGuardada);
  const [vistaActual, setVistaActual] = useState(() => {
    const datos = leerSesionGuardada();
    if (!datos) return "admin";
    return datos.rol?.toLowerCase() === "admin" ? "admin" : "dashboard";
  });

  const manejarLoginExitoso = (datos) => {
    setUsuarioActivo(datos);
    setVistaActual(datos.rol?.toLowerCase() === "admin" ? "admin" : "dashboard");
  };

  const cerrarSesion = () => {
    localStorage.removeItem("usuario_sesion");
    setUsuarioActivo(null);
    setVistaActual("admin");
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