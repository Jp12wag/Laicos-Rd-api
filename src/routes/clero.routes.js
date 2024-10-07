const express = require('express');
const controllers = require('../controllers/clero.controller');
const auth = require('../middleware/auth')

const router = new express.Router();

router.get('/', controllers.getClero);
router.get('/:id', controllers.getCleroById);
router.post('/', controllers.createClero);
router.put('/:id', controllers.updateClero);
router.delete('/:id', controllers.deleteClero);
router.put('/cleros/asignar-parroquia',auth, controllers.asignarParroquiaClero);

module.exports = router;