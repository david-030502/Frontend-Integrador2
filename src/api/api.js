const URL_BASE = "http://127.0.0.1:8000/api"
const NOMBRE_COOKIE = "token"

function leer_payload_jwt(token) {
    const partes = token.split(".");
    if (partes.length < 2) return null;

    try {
        const payload_base64 = partes[1].replace(/-/g, "+").replace(/_/g, "/");
        const relleno = "=".repeat((4 - (payload_base64.length % 4)) % 4);
        const payload_json = atob(payload_base64 + relleno);
        return JSON.parse(payload_json);
    } catch {
        return null;
    }
}

function atributos_cookie(token) {
    const atributos = ["path=/", "SameSite=Lax"];

    if (typeof window !== "undefined" && window.location.protocol === "https:") {
        atributos.push("Secure");
    }

    const payload = leer_payload_jwt(token);
    if (payload?.exp) {
        const segundos_restantes = Math.max(0, payload.exp - Math.floor(Date.now() / 1000));
        if (segundos_restantes > 0) {
            atributos.push(`Max-Age=${segundos_restantes}`);
        }
    }

    return atributos.join("; ");
}

function obtener_token() {
    const cookie = document.cookie
        .split("; ")
        .find((entrada) => entrada.startsWith(`${NOMBRE_COOKIE}=`));

    if (!cookie) return null;

    const valor = cookie.slice(NOMBRE_COOKIE.length + 1);
    if (!valor) return null;

    return decodeURIComponent(valor);
}

function guardar_token(token) {
    document.cookie = `${NOMBRE_COOKIE}=${encodeURIComponent(token)}; ${atributos_cookie(token)}`;
}

export function eliminar_token() {
    const seguro = typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${NOMBRE_COOKIE}=; path=/; Max-Age=0; SameSite=Lax${seguro}`;
}

function headers_autenticados(con_contenido = false) {
    const headers = {};
    if (con_contenido) headers["Content-Type"] = "application/json";
    const token = obtener_token();
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
}

export async function iniciar_sesion(email, contrasena) {
    const respuesta = await fetch(`${URL_BASE}/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, contrasena }),
    });

    if (!respuesta.ok) {
        throw new Error("Credenciales incorrectas");
    }
    const datos = await respuesta.json();
    guardar_token(datos.access_token);
    return datos;
}

export async function listar_dispositivos() {
    const respuesta = await fetch(`${URL_BASE}/dispositivos/`, {
        headers: headers_autenticados(),
    });
    if (!respuesta.ok) {
        throw new Error("No se puede obtener la lista de camiones");
    }
    return await respuesta.json();
}

export async function crear_dispositivo(datos) {
    const respuesta = await fetch(`${URL_BASE}/dispositivos/register`, {
        method: "POST",
        headers: headers_autenticados(true),
        body: JSON.stringify(datos),
    });
    if (!respuesta.ok) {
        throw new Error("Error al registrar dispositivo");
    }
    return await respuesta.json();
}

export async function obtener_ultimo_registro_byunidad(id_dispositivo) {
    const respuesta = await fetch(`${URL_BASE}/telemetria/dispositivo/${id_dispositivo}/ultima`, {
        headers: headers_autenticados(),
    });
    if (!respuesta.ok) {
        throw new Error("Sin lecturas de telemetria disponible");
    }
    return await respuesta.json();
}

export async function obtener_lecturas_byunidad(id_dispositivo, limite = 20) {
    const respuesta = await fetch(`${URL_BASE}/telemetria/dispositivo/${id_dispositivo}?limite=${limite}`, {
        headers: headers_autenticados(),
    });
    if (!respuesta.ok) {
        throw new Error("Error al consultar historial");
    }
    return await respuesta.json();
}

export async function obtener_alertas_activas() {
    const respuesta = await fetch(`${URL_BASE}/alertas/`, {
        headers: headers_autenticados(),
    });
    if (!respuesta.ok) {
        throw new Error("Error al obtener alertas");
    }
    const datos = await respuesta.json();
    if (Array.isArray(datos)) {
        return datos.filter((alerta) => !alerta.fecha_vista);
    }
    return [];
}

export async function listar_historial_alertas(limite = 50) {
    const respuesta = await fetch(`${URL_BASE}/alertas/?limite=${limite}`, {
        headers: headers_autenticados(),
    });
    if (!respuesta.ok) {
        throw new Error("Error al obtener historial de alertas");
    }
    return await respuesta.json();
}

export async function atender_alerta(id_alerta) {
    const respuesta = await fetch(`${URL_BASE}/alertas/${id_alerta}/atender`, {
        method: "PUT",
        headers: headers_autenticados(),
    });
    if (!respuesta.ok) {
        throw new Error("Error al atender la alerta");
    }
    return await respuesta.json();
}

export async function listar_usuarios() {
    const respuesta = await fetch(`${URL_BASE}/usuarios/`, {
        headers: headers_autenticados(),
    });
    if (!respuesta.ok) {
        throw new Error("Error al obtener usuarios");
    }
    return await respuesta.json();
}

export async function crear_usuario(datos) {
    const respuesta = await fetch(`${URL_BASE}/usuarios/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
    });
    if (!respuesta.ok) {
        throw new Error("Error al registrar usuario");
    }
    return await respuesta.json();
}
