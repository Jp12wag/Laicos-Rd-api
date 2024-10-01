const express = require('express');
const controllers = require('../controllers/administradores.controller');
const auth = require('../middleware/auth')
const router = express.Router();

router.get('/', auth,controllers.getAdministradores);
router.post('/', controllers.createAdministrador);
router.post('/login', controllers.loginAdministrador);
router.post('/verify-two-factor', controllers.verifyTwoFactor);
router.post('/logout', auth, controllers.logoutadministrador);
router.get('/:id',auth, controllers.getAdministradorById);
router.patch('/:id', auth, controllers.updateAdministrador);
router.delete('/:id',auth, controllers.deleteAdministrador);
router.post('/request-reset-password', controllers.requestResetPassword);
router.post('/reset-password/:token', controllers.resetPassword);

module.exports = router;