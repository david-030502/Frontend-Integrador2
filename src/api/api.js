const URL_BASE = "http://127.0.0.1:8000/api"

function obtenerHeaders(){
  const token = localStorage.getItem("token");
  return{
    "Content-Type": "application/json",
    ...(token ? {"Authorization":`Bearer ${token}`}:{})
  };
}

//Iniciar sesión
export async function iniciar_sesion(email, contrasena) {
    const respuesta = await fetch(`${URL_BASE}/usuarios/login`,{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email:email, contrasena:contrasena}),
    });

    if (!respuesta.ok){
        throw new Error("Credenciales incorrectas")
    }
    return await respuesta.json();
}

//Listar camiones registrados
export async function listar_dispositivos() {
    const respuesta = await fetch(`${URL_BASE}/dispositivos/`, {
        method: "GET",
        headers: obtenerHeaders(),
    });
        
    if (!respuesta.ok){
        throw new Error("No se puede obtener la lista de camiones");
    }
    return await respuesta.json();
}

//Registrar camion
export async function crear_dispositivo(datos) {
  const respuesta = await fetch(`${URL_BASE}/dispositivos/`,{
      method: "POST",
      headers: obtenerHeaders(),
      body: JSON.stringify(datos),
  });
  if (!respuesta.ok){
    throw new Error("Error al registrar dispositivo");
  }
  return await respuesta.json();
}

//Obtener ultimo registro por camion
export async function obtener_ultimo_registro_byunidad(id_dispositivo) {
    const respuesta = await fetch(`${URL_BASE}/telemetria/dispositivo/${id_dispositivo}/ultima`,{
        method: "GET",
        headers: obtenerHeaders(),
    })
    if (!respuesta.ok){
        throw new Error("Sin lecturas de telemetria disponible");
    }
    return await respuesta.json();
}

//Obtener ultimos registros por camion
export async function obtener_lecturas_byunidad(id_dispositivo, limite=20) {
    const respuesta = await fetch(`${URL_BASE}/telemetria/dispositivo/${id_dispositivo}?limite=${limite}`,{
        method: "GET",
        headers: obtenerHeaders(),
    });
    if (!respuesta.ok){
        throw new Error("Error al consultar historial");
    }
    return await respuesta.json();
}

// Obtener alertas desde la API
export async function obtener_alertas_activas() {
  const respuesta = await fetch(`${URL_BASE}/alertas/`,{
        method: "GET",
        headers: obtenerHeaders(),
  });
  if (!respuesta.ok) {
    throw new Error("Error al obtener alertas");
  }
  const datos = await respuesta.json();

  // Filtramos para mostrar únicamente las alertas que aún no han sido atendidas (fecha_vista es null)
  if (Array.isArray(datos)) {
    return datos.filter((alerta) => !alerta.fecha_vista);
  }
  return [];
}

//Obtener todas las alertas para auditoria
export async function listar_historial_alertas(limite=50) {
  const respuesta = await fetch(`${URL_BASE}/alertas/?limite=${limite}`,{
      method: "GET",
      headers: obtenerHeaders(),
  });
  if (!respuesta.ok){
    throw new Error("Error al obtener historial de alertas");
  }
  return await respuesta.json();
}

// Marcar alerta como atendida
export async function atender_alerta(id_alerta, id_usuario) {
  const respuesta = await fetch(`${URL_BASE}/alertas/${id_alerta}/atender`, {
    method: "PUT",
    headers: obtenerHeaders(),
    body: JSON.stringify({id_usuario:Number(id_usuario)}),
  });

  if (!respuesta.ok) {
    throw new Error("Error al atender la alerta");
  }
  return await respuesta.json();
}

//Obtener usuarios registrados
export async function listar_usuarios() {
  const respuesta = await fetch(`${URL_BASE}/usuarios/`,{
      method: "GET",
      headers: obtenerHeaders(),
  });
  if (!respuesta.ok){
    throw new Error("Error al obtener usuarios");
  }
  return await respuesta.json();
}

//Registrar nuevo usuario 
export async function crear_usuario(datos) {
  const respuesta = await fetch(`${URL_BASE}/usuarios/`,{
    method: "POST",
    headers: obtenerHeaders(),
    body: JSON.stringify(datos),
  });
  if (!respuesta.ok){
    throw new Error("Error al registrar usuario");
  }      
  return await respuesta.json();
}
