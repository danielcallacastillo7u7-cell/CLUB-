
const API = '[https://club-production-ed73.up.railway.app/]'; // Ajusta si tu ruta base de admin es diferente

// Función auxiliar para armar los headers con el token
const getHeaders = (token) => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
});

export const getSocios = async (token) => {
    try {
        const res = await fetch(`${API}/admin/socios`, { headers: getHeaders(token) });
        return await res.json();
    // eslint-disable-next-line no-unused-vars
    } catch (error) { return { error: 'Error al conectar con el servidor' }; }
};

export const crearSocio = async (token, socioData) => {
    try {
        const res = await fetch(`${API}/admin/socios`, {
            method: 'POST',
            headers: getHeaders(token),
            body: JSON.stringify(socioData)
        });
        return await res.json();
    // eslint-disable-next-line no-unused-vars
    } catch (error) { return { error: 'Error al conectar con el servidor' }; }
};

export const editarSocio = async (token, id, socioData) => {
    try {
        const res = await fetch(`${API}/admin/socios/${id}`, {
            method: 'PUT',
            headers: getHeaders(token),
            body: JSON.stringify(socioData)
        });
        return await res.json();
    // eslint-disable-next-line no-unused-vars
    } catch (error) { return { error: 'Error al conectar con el servidor' }; }
};

export const eliminarSocio = async (token, id) => {
    try {
        const res = await fetch(`${API}/admin/socios/${id}`, {
            method: 'DELETE',
            headers: getHeaders(token)
        });
        return await res.json();
    // eslint-disable-next-line no-unused-vars
    } catch (error) { return { error: 'Error al conectar con el servidor' }; }
};

export const getFinanzas = async (token) => {
    try {
        const res = await fetch(`${API}/admin/finanzas`, { headers: getHeaders(token) });
        return await res.json();
    // eslint-disable-next-line no-unused-vars
    } catch (error) { return { error: 'Error al conectar con el servidor' }; }
};

export const getMorosos = async (token) => {
    try {
        const res = await fetch(`${API}/admin/morosos`, { headers: getHeaders(token) });
        return await res.json();
    // eslint-disable-next-line no-unused-vars
    } catch (error) { return { error: 'Error al conectar con el servidor' }; }
};

export const getSolicitudesPago = async (token) => {
    try {
        const res = await fetch(`${API}/admin/solicitudes`, { headers: getHeaders(token) });
        return await res.json();
    // eslint-disable-next-line no-unused-vars
    } catch (error) { return { error: 'Error al conectar con el servidor' }; }
};

export const confirmarSolicitud = async (token, id) => {
    try {
        const res = await fetch(`${API}/admin/solicitudes/${id}/confirmar`, {
            method: 'PUT',
            headers: getHeaders(token)
        });
        return await res.json();
    // eslint-disable-next-line no-unused-vars
    } catch (error) { return { error: 'Error al conectar con el servidor' }; }
};

export const rechazarSolicitud = async (token, id) => {
    try {
        const res = await fetch(`${API}/admin/solicitudes/${id}/rechazar`, {
            method: 'PUT',
            headers: getHeaders(token)
        });
        return await res.json();
    // eslint-disable-next-line no-unused-vars
    } catch (error) { return { error: 'Error al conectar con el servidor' }; }
};