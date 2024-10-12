const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');  // Middleware de autenticación
const solicitudAmistadController = require('../controllers/solicitudAmistad.controller');

// Rutas para manejar solicitudes de amistad

// Enviar una nueva solicitud de amistad
router.post('/enviar', auth, solicitudAmistadController.SolicitudAmistad);

// Aceptar una solicitud de amistad
router.post('/aceptar', auth, solicitudAmistadController.AceptarSolicitud);

// Rechazar una solicitud de amistad
router.post('/rechazar', auth, solicitudAmistadController.RecharSolicitud);

// Opcional: obtener todas las solicitudes de amistad pendientes para un usuario
router.get('/pendientes', auth, solicitudAmistadController.getSolicitudesPendientes);

// Opcional: obtener la lista de amigos aceptados
router.get('/aceptadas', auth, solicitudAmistadController.getAmigos);

module.exports = router;
