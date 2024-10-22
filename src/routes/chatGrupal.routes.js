const express = require('express');
const controllers = require('../controllers/chatGrrupal.controller');
const auth = require('../middleware/auth')

const router = new express.Router();

router.post('/buscarCrearGrupo', auth, controllers.buscarGrupo)
router.post('/enviarMensajeGrupo',auth, controllers.EnviarMensajeGrupo)
  

module.exports = router;