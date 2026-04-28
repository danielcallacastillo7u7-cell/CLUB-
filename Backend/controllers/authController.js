require('dotenv').config({ path: '../.env' }); // IMPORTANTE: Ajusta la ruta si es necesario
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const db = require('../config/db')


// Login socio
const loginSocio = async (req, res) => {
    try {
        const { correo, contrasena } = req.body;
        console.log("Intentando login para:", correo); // Debug

        const [rows] = await db.query('SELECT * FROM socios WHERE correo = ?', [correo]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
        }

        const socio = rows[0];
        const valido = await bcrypt.compare(contrasena, socio.contrasena);

        if (!valido) {
            return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
        }

        // --- EL CAMBIO ESTÁ AQUÍ ---
        // Si JWT_SECRET no carga del .env, usamos uno de respaldo para que no explote
        const secreto = process.env.JWT_SECRET || 'clave_temporal_de_emergencia_123';

        const token = jwt.sign(
            { id: socio.id, correo: socio.correo, rol: 'socio' },
            secreto,
            { expiresIn: '8h' }
        );

        res.json({
            token,
            id: socio.id,
            nombre: socio.nombre,
            correo: socio.correo,
            rol: 'socio'
        });
        
    } catch (error) {
        console.error("❌ ERROR EN LOGIN:", error.message);
        res.status(500).json({ error: 'Error interno: ' + error.message });
    }
};

    // Login admin
    const loginAdmin = async (req, res) => {
    try {
        const { usuario, dni, contrasena } = req.body
        const [rows] = await db.query(
        'SELECT * FROM administradores WHERE usuario = ? AND dni = ?',
        [usuario, dni]
        )

        if (rows.length === 0) {
        return res.status(401).json({ error: 'Credenciales incorrectas' })
        }

        const admin = rows[0]
        const valido = await bcrypt.compare(contrasena, admin.contrasena)

        if (!valido) {
        return res.status(401).json({ error: 'Credenciales incorrectas' })
        }

        // Generar código de verificación
        const codigo = Math.floor(100000 + Math.random() * 900000).toString()
        const expira = new Date(Date.now() + 10 * 60 * 1000) // 10 minutos

        await db.query(
        'INSERT INTO codigos_verificacion (admin_id, codigo, expira_at) VALUES (?, ?, ?)',
        [admin.id, codigo, expira]
        )

        // Enviar código por correo
        const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
        })

        await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: admin.correo,
        subject: 'Código de verificación - Club Catarindo',
        html: `<h2>Tu código de verificación es: <strong>${codigo}</strong></h2>
                <p>Este código expira en 10 minutos.</p>`
    })

    res.json({ mensaje: 'Código enviado al correo', adminId: admin.id })
    } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' })
    }
}

// Verificar código admin
const verificarCodigo = async (req, res) => {
    try {
    const { codigo, adminId } = req.body
    const [rows] = await db.query(
      'SELECT * FROM codigos_verificacion WHERE admin_id = ? AND codigo = ? AND usado = FALSE AND expira_at > NOW() ORDER BY created_at DESC LIMIT 1',
        [adminId, codigo]
    )

    if (rows.length === 0) {
        return res.status(401).json({ error: 'Código inválido o expirado' })
    }

    await db.query('UPDATE codigos_verificacion SET usado = TRUE WHERE id = ?', [rows[0].id])

    const [admin] = await db.query('SELECT * FROM administradores WHERE id = ?', [adminId])

    const token = jwt.sign(
        { id: admin[0].id, correo: admin[0].correo, rol: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
        )

        res.json({
        token,
        id: admin[0].id,
        nombre: admin[0].usuario,
        correo: admin[0].correo,
        rol: 'admin'
        })
    } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' })
    }
}

// Registro socio
const registrarSocio = async (req, res) => {
    try {
    const { nombre, apellido, dni, nroSocio, correo, contrasena } = req.body

    const [existe] = await db.query(
        'SELECT id FROM socios WHERE correo = ? OR dni = ? OR nro_socio = ?',
        [correo, dni, nroSocio]
    )

    if (existe.length > 0) {
        return res.status(400).json({ error: 'Ya existe un socio con ese correo, DNI o número de socio' })
    }

    const hash = await bcrypt.hash(contrasena, 10)

    await db.query(
        'INSERT INTO socios (nombre, apellido, dni, nro_socio, correo, contrasena) VALUES (?, ?, ?, ?, ?, ?)',
        [nombre, apellido, dni, nroSocio, correo, hash]
    )

    res.json({ mensaje: 'Socio registrado correctamente' })
    } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' })
    }
}
// Solicitar recuperación de contraseña
const solicitarRecuperacion = async (req, res) => {
    try {
        const { correo } = req.body;
        console.log("1. Intentando recuperar para:", correo);

        const [rows] = await db.query('SELECT id FROM socios WHERE correo = ?', [correo]);
        
        if (rows.length === 0) {
            console.log("2. El correo no existe en la DB");
            return res.status(404).json({ error: 'No existe una cuenta con ese correo' });
        }

        const socioId = rows[0].id; 
        const codigo = Math.floor(100000 + Math.random() * 900000).toString();
        const expira = new Date(Date.now() + 10 * 60 * 1000);

        console.log("3. Insertando código en la tabla...");
        await db.query(
            'INSERT INTO codigos_recuperacion (socio_id, codigo, expira_at) VALUES (?, ?, ?)',
            [socioId, codigo, expira]
        );
        // En authController.js dentro de solicitarRecuperacion
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'danielcallacastillo7u7@gmail.com',
        pass: 'eqwwhweqfiilwtbe'
    }
});

        console.log("5. Enviando correo...");
        await transporter.sendMail({
            from: `"Club Catarindo" <${process.env.EMAIL_USER}>`,
            to: correo,
            subject: 'Recuperación de contraseña',
            text: `Tu código es: ${codigo}`
        });

        console.log("✅ TODO OK. Enviando respuesta al cliente.");
        res.json({ mensaje: 'Código enviado al correo', socioId: socioId });

    } catch (error) {
        // ESTO ES LO MÁS IMPORTANTE: Mira tu terminal de Node.js
        console.error("❌ ERROR DETECTADO:");
        console.error("Mensaje:", error.message);
        console.error("Stack:", error.stack);
        res.status(500).json({ error: 'Error interno: ' + error.message });
    }
};
    // Verificar código de recuperación
    const verificarCodigoRecuperacion = async (req, res) => {
    try {
        const { codigo, socioId } = req.body

        const [rows] = await db.query(
        'SELECT * FROM codigos_recuperacion WHERE socio_id = ? AND codigo = ? AND usado = FALSE AND expira_at > NOW() ORDER BY created_at DESC LIMIT 1',
        [socioId, codigo]
        )

        if (rows.length === 0) {
        return res.status(401).json({ error: 'Código inválido o expirado' })
        }

        res.json({ mensaje: 'Código válido', codigoId: rows[0].id })
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' })
    }
    }

    // Cambiar contraseña
    const cambiarContrasena = async (req, res) => {
    try {
        const { socioId, codigoId, nuevaContrasena } = req.body

        const hash = await bcrypt.hash(nuevaContrasena, 10)

        await db.query('UPDATE socios SET contrasena = ? WHERE id = ?', [hash, socioId])
        await db.query('UPDATE codigos_recuperacion SET usado = TRUE WHERE id = ?', [codigoId])

        res.json({ mensaje: 'Contraseña actualizada correctamente' })
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' })
    }
}

module.exports = { loginSocio, loginAdmin, verificarCodigo, registrarSocio ,solicitarRecuperacion,
verificarCodigoRecuperacion,
cambiarContrasena }