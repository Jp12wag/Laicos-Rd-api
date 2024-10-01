const express = require('express');
const controllers = require('../controllers/miembros.controller');
const auth = require('../middleware/auth')
const router = new express.Router();

router.get('/',  controllers.getMiembros);
router.get('/:id', controllers.getMiembroById);
router.post('/', controllers.createMiembro);
router.put('/:id', controllers.updateMiembro);
router.delete('/:id', controllers.deleteMiembro);


module.exports = router;