const express = require('express')
const router = express.Router()
const { crearSolicitud, getSolicitudes, confirmarSolicitud, rechazarSolicitud } = require('../controllers/pagoController')
const verificarToken = require('../middlewares/authMiddleware')
const verificarAdmin = require('../middlewares/adminMiddleware')
const upload = require('../middlewares/uploadMiddleware')

router.post('/solicitud', verificarToken, upload.single('comprobante'), crearSolicitud)
router.get('/solicitudes', verificarToken, verificarAdmin, getSolicitudes)
router.put('/solicitudes/:id/confirmar', verificarToken, verificarAdmin, confirmarSolicitud)
router.put('/solicitudes/:id/rechazar', verificarToken, verificarAdmin, rechazarSolicitud)

module.exports = router