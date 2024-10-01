const express = require('express');
const controllers = require('../controllers/miembros.controller');
const auth = require('../middleware/auth')
const router = new express.Router();

router.get('/', auth, controllers.getMiembros);
router.get('/:id', auth, controllers.getMiembroById);
router.post('/', auth, controllers.createMiembro);
router.patch('/:id', auth,controllers.updateMiembro);
router.delete('/:id',auth, controllers.deleteMiembro);
router.patch('/:id', auth,controllers.actualizarMiembro);

module.exports = router;