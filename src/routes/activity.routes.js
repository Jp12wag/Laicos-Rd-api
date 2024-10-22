const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const actividadController = require('../controllers/actividad.controller');

// Rutas CRUD
router.post('/', actividadController.createActividad);
router.get('/', auth, actividadController.getActividades);
router.get('/actividades/:id',actividadController.getActividadById);
router.patch('/actividades/:id', auth, actividadController.updateActividad);
router.delete('/:id', auth, actividadController.deleteActividad);

// Ruta para inscribir a un miembro en una actividad
router.post('/:id/inscribir', auth, actividadController.inscribirMiembro);
// Ruta para cancelar inscripción
router.post('/:id/cancelar-inscripcion', auth, actividadController.cancelarInscripcion);


module.exports = router;
