const verificarAdmin = (req, res, next) => {
    if (req.usuario.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado — se requiere rol admin' })
    }
    next()
}

module.exports = verificarAdmin