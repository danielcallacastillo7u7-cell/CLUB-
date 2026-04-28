const db = require('../config/db')
const nodemailer = require('nodemailer')

    const crearSolicitud = async (req, res) => {
    try {
        const {
            nroCasa,
            nroPersonas,
            tipoSocio,
            servicio,
            monto,
            metodoPago,
            nroOperacion,
            fechaOperacion,
            horaOperacion,
            montoDetectado,
            fechaSubida
        } = req.body;

        const comprobante = req.file ? req.file.filename : null;

        if (!comprobante) {
            return res.status(400).json({ error: 'El comprobante es obligatorio' });
        }

        const fechaSubidaFinal = fechaSubida ? new Date(fechaSubida) : new Date();

        await db.query(
            `INSERT INTO solicitudes_pago 
            (socio_id, nro_casa, titular, tipo_socio, nro_personas, servicio, monto, metodo_pago, 
            nro_operacion, fecha_operacion, hora_operacion, monto_detectado, fecha_subida, comprobante) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                req.usuario.id,
                nroCasa,
                '',                    // titular vacío por ahora
                tipoSocio,
                nroPersonas,
                servicio,
                monto,
                metodoPago || 'Transferencia bancaria',
                nroOperacion || null,
                fechaOperacion || null,
                horaOperacion || null,
                montoDetectado || null,
                fechaSubidaFinal,
                comprobante
            ]
        );

        res.json({ mensaje: 'Solicitud enviada correctamente.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

// Obtener solicitudes
const getSolicitudes = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM solicitudes_pago ORDER BY fecha_subida DESC')
        res.json(rows)
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener solicitudes' })
    }
}

// Confirmar
const confirmarSolicitud = async (req, res) => {
    try {
        const { observaciones } = req.body

        // Obtener datos de la solicitud y del socio
        const [rows] = await db.query(
        `SELECT sp.*, s.correo, s.nombre, s.apellido 
        FROM solicitudes_pago sp 
        JOIN socios s ON sp.socio_id = s.id 
        WHERE sp.id = ?`,
        [req.params.id]
        )

        if (rows.length === 0) {
        return res.status(404).json({ error: 'Solicitud no encontrada' })
        }

        const solicitud = rows[0]

        // Actualizar estado
        await db.query(
        'UPDATE solicitudes_pago SET estado = "Confirmado", observaciones = ? WHERE id = ?',
        [observaciones || null, req.params.id]
        )

        // Enviar correo al socio
        const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
        })

        await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: solicitud.correo,
        subject: '✅ Pago confirmado - Club Catarindo',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #1a1a2e; padding: 24px; text-align: center;">
                <h1 style="color: #e2b96f; margin: 0;">Club Catarindo</h1>
            </div>
            <div style="padding: 32px; background-color: #f9f9f9;">
                <h2 style="color: #1a1a2e;">✅ Tu pago ha sido confirmado</h2>
                <p>Hola <strong>${solicitud.nombre} ${solicitud.apellido}</strong>,</p>
                <p>Nos complace informarte que tu pago ha sido <strong style="color: #1d9e75;">confirmado</strong> exitosamente.</p>
                
                <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #1d9e75;">
                <h3 style="color: #1a1a2e; margin-top: 0;">Detalles del pago</h3>
                <p><strong>Servicio:</strong> ${solicitud.servicio}</p>
                <p><strong>Monto:</strong> S/ ${Number(solicitud.monto).toFixed(2)}</p>
                <p><strong>Casa N°:</strong> ${solicitud.nro_casa}</p>
                <p><strong>Fecha de transferencia:</strong> ${solicitud.fecha_operacion ? new Date(solicitud.fecha_operacion).toLocaleDateString('es-PE') : '—'}</p>
                <p><strong>N° de operación:</strong> ${solicitud.nro_operacion || '—'}</p>
                ${observaciones ? `<p><strong>Observaciones:</strong> ${observaciones}</p>` : ''}
                </div>

                <p>Gracias por tu pago puntual.</p>
                <p style="color: #888; font-size: 13px;">Este es un correo automático, por favor no respondas a este mensaje.</p>
            </div>
            <div style="background-color: #1a1a2e; padding: 16px; text-align: center;">
                <p style="color: #888; font-size: 12px; margin: 0;">© 2026 Club Catarindo — Mollendo, Arequipa</p>
            </div>
            </div>
        `
        })

        res.json({ mensaje: 'Pago confirmado y socio notificado por correo' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error en el servidor' })
    }
    }

    const rechazarSolicitud = async (req, res) => {
    try {
        const { observaciones } = req.body

        const [rows] = await db.query(
        `SELECT sp.*, s.correo, s.nombre, s.apellido 
        FROM solicitudes_pago sp 
        JOIN socios s ON sp.socio_id = s.id 
        WHERE sp.id = ?`,
        [req.params.id]
        )

        if (rows.length === 0) {
        return res.status(404).json({ error: 'Solicitud no encontrada' })
        }

        const solicitud = rows[0]

        await db.query(
        'UPDATE solicitudes_pago SET estado = "Rechazado", observaciones = ? WHERE id = ?',
        [observaciones || null, req.params.id]
        )

        const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
        })

        await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: solicitud.correo,
        subject: '❌ Pago rechazado - Club Catarindo',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #1a1a2e; padding: 24px; text-align: center;">
                <h1 style="color: #e2b96f; margin: 0;">Club Catarindo</h1>
            </div>
            <div style="padding: 32px; background-color: #f9f9f9;">
                <h2 style="color: #1a1a2e;">❌ Tu pago ha sido rechazado</h2>
                <p>Hola <strong>${solicitud.nombre} ${solicitud.apellido}</strong>,</p>
                <p>Lamentamos informarte que tu pago ha sido <strong style="color: #a32d2d;">rechazado</strong>.</p>

                <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #a32d2d;">
                <h3 style="color: #1a1a2e; margin-top: 0;">Detalles del pago rechazado</h3>
                <p><strong>Servicio:</strong> ${solicitud.servicio}</p>
                <p><strong>Monto:</strong> S/ ${Number(solicitud.monto).toFixed(2)}</p>
                <p><strong>Casa N°:</strong> ${solicitud.nro_casa}</p>
                ${observaciones ? `<p><strong>Motivo del rechazo:</strong> ${observaciones}</p>` : '<p><strong>Motivo:</strong> Comprobante no válido o datos incorrectos.</p>'}
                </div>

                <p>Por favor vuelve a enviar tu comprobante o contáctanos para más información.</p>
                <p style="color: #888; font-size: 13px;">Este es un correo automático, por favor no respondas a este mensaje.</p>
            </div>
            <div style="background-color: #1a1a2e; padding: 16px; text-align: center;">
                <p style="color: #888; font-size: 12px; margin: 0;">© 2026 Club Catarindo — Mollendo, Arequipa</p>
            </div>
            </div>
        `
        })

        res.json({ mensaje: 'Pago rechazado y socio notificado por correo' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error en el servidor' })
    }
}

// 👇 SIEMPRE AL FINAL
module.exports = {
    crearSolicitud,
    getSolicitudes,
    confirmarSolicitud,
    rechazarSolicitud
}