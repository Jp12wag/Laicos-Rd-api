const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const actividadController = require('../controllers/actividad.controller');

// Rutas CRUD
router.post('/actividades', actividadController.createActividad);
router.get('/actividades', auth, actividadController.getActividades);
router.get('/actividades/:id', auth, actividadController.getActividadById);
router.patch('/actividades/:id', auth, actividadController.updateActividad);
router.delete('/actividades/:id', auth, actividadController.deleteActividad);
// Ruta para inscribir a un miembro en una actividad
router.post('/actividades/:id/inscribir', auth, actividadController.inscribirMiembro);
// Ruta para cancelar inscripción
router.post('/actividades/:id/cancelar-inscripcion', auth, actividadController.cancelarInscripcion);


module.exports = router;
