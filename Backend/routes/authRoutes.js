const express = require('express')
const router = express.Router()
const {
    loginSocio,
    loginAdmin,
    verificarCodigo,
    registrarSocio,
    solicitarRecuperacion,
    verificarCodigoRecuperacion,
    cambiarContrasena
} = require('../controllers/authController')

router.post('/login', loginSocio)
router.post('/login-admin', loginAdmin)
router.post('/verificar-codigo', verificarCodigo)
router.post('/registro', registrarSocio)
router.post('/recuperar', solicitarRecuperacion)
router.post('/recuperar/verificar', verificarCodigoRecuperacion)
router.post('/recuperar/cambiar', cambiarContrasena)

module.exports = router