const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const controllers = require('../controllers/coversacion.controller');

// Ruta para obtener los mensajes entre dos usuarios
router.get('conversaciones-recientes', auth,controllers.obtenerConversaciones);
module.exports = router;