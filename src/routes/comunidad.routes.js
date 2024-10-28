const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const comunidadController = require('../controllers/comunidad.controller');

// Crear una comunidad (solo administradores autenticados)
router.post('/', auth, comunidadController.crearComunidad);

// Añadir un miembro a la comunidad (solo administradores autenticados)
router.post('/agregar-miembro', auth, comunidadController.agregarMiembro);

// Listar comunidades
router.get('/comunidades', auth, comunidadController.listarComunidades);

// Ruta para actualizar comunidad
router.put('/comunidades/:comunidadId', auth, comunidadController.actualizarComunidad);

// Ruta para eliminar comunidad
router.delete('/comunidades/:comunidadId', auth, comunidadController.eliminarComunidad);

module.exports = router;
