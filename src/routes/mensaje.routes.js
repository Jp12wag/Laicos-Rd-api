const express = require('express');
const router = express.Router();
const { enviarMensaje, obtenerMensajes, marcarComoLeido } = require('../controllers/mensaje.controller');

// Ruta para enviar un mensaje
router.post('/enviar', enviarMensaje);

// Ruta para obtener los mensajes entre dos usuarios
router.get('/:emisorId/:receptorId', obtenerMensajes);

// Ruta para marcar un mensaje como leído
router.put('/:mensajeId/leido', marcarComoLeido);

module.exports = router;