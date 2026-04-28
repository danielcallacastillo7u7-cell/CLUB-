const db = require('../config/db')

const getPerfil = async (req, res) => {
    try {
        const [rows] = await db.query(
        'SELECT id, nombre, apellido, dni, nro_socio, correo, estado FROM socios WHERE id = ?',
        [req.usuario.id]
        )
        if (rows.length === 0) return res.status(404).json({ error: 'Socio no encontrado' })
        res.json(rows[0])
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' })
    }
    }

    const getCuenta = async (req, res) => {
    try {
        const mes = new Date().getMonth() + 1
        const anio = new Date().getFullYear()

        const [consumos] = await db.query(
        'SELECT SUM(monto) as total FROM consumos WHERE socio_id = ? AND MONTH(fecha) = ? AND YEAR(fecha) = ?',
        [req.usuario.id, mes, anio]
        )

        const [pagos] = await db.query(
        'SELECT SUM(monto) as total FROM pagos WHERE socio_id = ? AND MONTH(fecha) = ? AND YEAR(fecha) = ? AND estado = "Confirmado"',
        [req.usuario.id, mes, anio]
        )

        const [cargos] = await db.query('SELECT SUM(monto) as total FROM cargos_fijos WHERE activo = TRUE')

        const consumosMes = consumos[0].total || 0
        const pagosRealizados = pagos[0].total || 0
        const cargosFijos = cargos[0].total || 0
        const totalPagar = consumosMes + cargosFijos
        const saldoPendiente = totalPagar - pagosRealizados

        res.json({
        mes: new Date().toLocaleString('es-PE', { month: 'long', year: 'numeric' }),
        consumosMes,
        cargosFijos,
        totalPagar,
        pagosRealizados,
        saldoPendiente
        })
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' })
    }
    }

    const getConsumos = async (req, res) => {
    try {
        const mes = new Date().getMonth() + 1
        const anio = new Date().getFullYear()
        const [rows] = await db.query(
        'SELECT * FROM consumos WHERE socio_id = ? AND MONTH(fecha) = ? AND YEAR(fecha) = ? ORDER BY fecha DESC',
        [req.usuario.id, mes, anio]
        )
        res.json(rows)
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' })
    }
    }

    const getPagos = async (req, res) => {
    try {
        const [rows] = await db.query(
        'SELECT * FROM pagos WHERE socio_id = ? ORDER BY fecha DESC',
        [req.usuario.id]
        )
        res.json(rows)
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' })
    }
    }

    const enviarPago = async (req, res) => {
    try {
        const { monto, metodo } = req.body
        const fecha = new Date().toISOString().split('T')[0]

        await db.query(
        'INSERT INTO pagos (socio_id, monto, metodo, fecha) VALUES (?, ?, ?, ?)',
        [req.usuario.id, monto, metodo, fecha]
        )

        res.json({ mensaje: 'Pago registrado, esperando confirmación del administrador' })
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' })
    }
    }

module.exports = { getPerfil, getCuenta, getConsumos, getPagos, enviarPago }
