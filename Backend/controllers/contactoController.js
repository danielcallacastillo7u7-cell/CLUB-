const db = require('../config/db');

const enviarMensaje = async (req, res) => {
    try {
        const { nombre, email, asunto, mensaje } = req.body;

        if (!nombre || !email || !mensaje) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }

        // Creamos la fecha actual en formato YYYY-MM-DD
        const fechaActual = new Date().toISOString().split('T')[0];

        // Agregamos 'fecha' a la consulta y un quinto '?'
        await db.query(
            'INSERT INTO mensajes (nombre, email, asunto, mensaje, fecha) VALUES (?, ?, ?, ?, ?)',
            [nombre, email, asunto, mensaje, fechaActual]
        );

        res.status(200).json({ mensaje: 'Mensaje enviado correctamente' });
        
    } catch (error) {
        // REVISA AQUÍ: Esta consola te dirá el error exacto en tu terminal
        console.error("--- ERROR EN MYSQL ---");
        console.error("Mensaje:", error.message);
        console.error("Código:", error.code); // Ejemplo: 'ER_NO_SUCH_TABLE'
        console.error("-----------------------");
        
        res.status(500).json({ error: 'Error interno: ' + error.message });
    }
};

module.exports = { enviarMensaje };