const express = require('express');
const controllers = require('../controllers/administradores.controller');
const auth = require('../middleware/auth')
const router = express.Router();

router.get('/', auth,controllers.getAdministradores);
router.post('/', controllers.createAdministrador)
router.post('/login', controllers.loginAdministrador)
router.post('/verify-two-factor', controllers.verifyTwoFactor)
router.post('/logout', auth, controllers.logoutadministrador)
router.get('/:id',auth, controllers.getAdministradorById);
router.put('/:id',auth, controllers.updateAdministrador);
router.delete('/:id',auth, controllers.deleteAdministrador);

module.exports = router;