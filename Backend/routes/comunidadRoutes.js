const express = require('express');
const router = express.Router();
const comunidadController = require('../controllers/comunidadController');

router.get('/', comunidadController.obtenerPosts);
router.post('/', comunidadController.crearPost);
router.put('/like', comunidadController.agregarLike);

module.exports = router;