import { useState } from 'react';

export default function ModalBug({ abierto, alCerrar }) {
  const [enviando, setEnviando] = useState(false);
  const [estadoEnvio, setEstadoEnvio] = useState(null); // 'exito' | 'error' | null

  if (!abierto) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setEstadoEnvio(null);

    const form = e.target;
    const datos = new FormData(form);
    const titulo = datos.get("titulo");
    const email = datos.get("email");
    const descripcion = datos.get("descripcion");

    const contenidoMensaje = `
Reportado por: ${email}

Descripción del problema:
${descripcion}
    `.trim();

    try {
      const respuesta = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_KEY,
          subject: `[BUG] ${titulo}`,
          from_name: "Sistema de Monitoreo IoT",
          email: email,
          message: contenidoMensaje,
        }),
      });

      const data = await respuesta.json();

      if (data.success) {
        setEstadoEnvio('exito');
        form.reset();
        setTimeout(() => {
          setEstadoEnvio(null);
          alCerrar();
        }, 1800);
      } else {
        setEstadoEnvio('error');
      }
    } catch {
      setEstadoEnvio('error');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl border border-slate-100">
        
        {/* Cabecera */}
        <div className="flex justify-between items-start mb-5">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-slate-100 text-slate-700 mt-0.5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 leading-tight">
                Reportar Error del Sistema
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Complete los detalles del problema técnico detectado
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={alCerrar} 
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Notificaciones */}
        {estadoEnvio === 'exito' && (
          <div className="p-3 mb-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
            <span>✓</span> Reporte enviado directamente al equipo de soporte en Jira.
          </div>
        )}
        {estadoEnvio === 'error' && (
          <div className="p-3 mb-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2">
            <span>✕</span> Ocurrió un error al enviar. Revisa la clave o conexión.
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Título del Problema
            </label>
            <input
              type="text"
              name="titulo"
              required
              placeholder="Ej: No cargan los datos del sensor"
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-slate-800 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="carlos.m@losandes.com"
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-slate-800 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Descripción del Fallo
            </label>
            <textarea
              name="descripcion"
              required
              rows="3"
              placeholder="Explica qué error ocurrió..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-slate-800 focus:outline-none resize-none transition"
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 mt-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={alCerrar}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={enviando}
              className="px-5 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition disabled:opacity-50 shadow-sm"
            >
              {enviando ? 'Enviando...' : 'Enviar Reporte'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}