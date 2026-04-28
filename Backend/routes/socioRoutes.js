const express = require('express')
const router = express.Router()
const { getPerfil, getCuenta, getConsumos, getPagos, enviarPago } = require('../controllers/socioController')
const verificarToken = require('../middlewares/authMiddleware')

router.get('/perfil', verificarToken, getPerfil)
router.get('/cuenta', verificarToken, getCuenta)
router.get('/consumos', verificarToken, getConsumos)
router.get('/pagos', verificarToken, getPagos)
router.post('/pago', verificarToken, enviarPago)

module.exports = router