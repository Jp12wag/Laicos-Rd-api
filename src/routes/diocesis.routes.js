const express = require('express');
const router = express.Router();
const controladoresDiocesis = require('../controllers/diocesis.controller');

// Rutas para Diócesis
router.get('/', controladoresDiocesis.getDiocesis);

// Crear una nueva parroquia dentro de una diócesis
router.post('/parroquia', controladoresDiocesis.crearParroquia);

// Actualizar una parroquia
router.put('/parroquia/:id', controladoresDiocesis.actualizarParroquia);

// Eliminar una parroquia
router.delete('/parroquia/:id', controladoresDiocesis.eliminarParroquia);

// Crear un nuevo miembro del clero dentro de una parroquia
router.post('/clero', controladoresDiocesis.crearClero);

// Actualizar un miembro del clero
router.put('/clero/:id', controladoresDiocesis.actualizarClero);

// Eliminar un miembro del clero
router.delete('/clero/:id', controladoresDiocesis.eliminarClero);

module.exports = router;
