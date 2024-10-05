// routes/arquidiocesisRoutes.js
const express = require('express');
const router = express.Router();
const arquidiocesisController = require('../controllers/arquidiocesis.controller');

router.get('/', arquidiocesisController.getArquidiocesis);
router.get('/:id', arquidiocesisController.getArquidiocesisById);
router.post('/', arquidiocesisController.createArquidiocesis);
router.put('/:id', arquidiocesisController.updateArquidiocesis);
router.delete('/:id', arquidiocesisController.deleteArquidiocesis);

module.exports = router;
