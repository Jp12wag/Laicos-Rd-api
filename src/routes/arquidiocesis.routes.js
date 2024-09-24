const express = require('express');
const controllers = require('../controllers/arquidiocesis.controller');

const router = express.Router();

router.get('/', controllers.getArquidiocesis);
router.get('/:id', controllers.getArquidiocesisById);
router.post('/', controllers.createArquidiocesis);
router.put('/:id', controllers.updateArquidiocesis);
router.delete('/:id', controllers.deleteArquidiocesis);

module.exports = router;