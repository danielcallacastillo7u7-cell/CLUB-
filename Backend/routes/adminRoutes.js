const express = require('express')
const router = express.Router()
const { 
    getSocios,
    crearSocio,
    editarSocio,
    eliminarSocio,
    getFinanzas,
    getMorosos,
    confirmarPago,
    loginAdmin,        // <--- Asegúrate de importar esta
    verificarCodigo    // <--- Asegúrate de importar esta
} = require('../controllers/adminController')

const verificarToken = require('../middlewares/authMiddleware')
const verificarAdmin = require('../middlewares/adminMiddleware')

// --- RUTAS DE ACCESO (PÚBLICAS PARA EL ADMIN) ---
// Estas NO llevan verificarToken porque son para entrar
router.post('/login', loginAdmin)
router.post('/verificar-codigo', verificarCodigo)

// --- RUTAS DE GESTIÓN (PROTEGIDAS) ---
router.get('/socios', verificarToken, verificarAdmin, getSocios)
router.post('/socios', verificarToken, verificarAdmin, crearSocio)
router.put('/socios/:id', verificarToken, verificarAdmin, editarSocio)
router.delete('/socios/:id', verificarToken, verificarAdmin, eliminarSocio)
router.get('/finanzas', verificarToken, verificarAdmin, getFinanzas)
router.get('/morosos', verificarToken, verificarAdmin, getMorosos)
router.put('/pagos/:id/confirmar', verificarToken, verificarAdmin, confirmarPago)

module.exports = router