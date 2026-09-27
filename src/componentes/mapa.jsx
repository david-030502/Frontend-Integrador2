// src/components/MapaMonitoreo.jsx
import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

// Reparar iconos de Leaflet para Vite
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Componente auxiliar para centrar el mapa cuando cambian las coordenadas
function CentrarMapa({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], 14);
    }
  }, [lat, lng, map]);
  return null;
}

export default function MapaMonitoreo({ latitud, longitud, identificador }) {
  // Coordenadas por defecto (Centro del Perú / Lima) si no hay GPS aún
  const latValida = latitud != null ? Number(latitud) : -12.046374;
  const lngValida = longitud != null ? Number(longitud) : -77.042793;
  const tieneGps = latitud != null && longitud != null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white">Ubicación GPS en Tiempo Real</h2>
          <p className="text-xs text-slate-400">
            {tieneGps 
              ? `Coordenadas: ${latValida.toFixed(4)}, ${lngValida.toFixed(4)}` 
              : "Sin coordenadas GPS registradas en la última lectura"}
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-mono">
          OpenStreetMap
        </span>
      </div>

      {/* Contenedor del mapa */}
      <div className="h-80 w-full rounded-xl overflow-hidden border border-slate-800 relative z-0">
        <MapContainer
          center={[latValida, lngValida]}
          zoom={13}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {tieneGps && (
            <Marker position={[latValida, lngValida]}>
              <Popup>
                <div className="text-slate-900 text-xs">
                  <p className="font-bold">{identificador || "Camión en ruta"}</p>
                  <p>Posición actualizada</p>
                </div>
              </Popup>
            </Marker>
          )}

          <CentrarMapa lat={latValida} lng={lngValida} />
        </MapContainer>
      </div>
    </div>
  );
}