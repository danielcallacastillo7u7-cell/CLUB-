const express = require('express');
const router = express.Router();
const { enviarMensaje } = require('../controllers/contactoController');

// Esta ruta será pública (no necesita middleware de auth)
router.post('/', enviarMensaje);

module.exports = router;