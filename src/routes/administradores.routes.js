const express = require('express');
const controllers = require('../controllers/administradores.controller');

const router = express.Router();

router.get('/', controllers.getAdministradores);
router.get('/:id', controllers.getAdministradorById);
router.post('/', controllers.createAdministrador);
router.put('/:id', controllers.updateAdministrador);
router.delete('/:id', controllers.deleteAdministrador);

module.exports = router;