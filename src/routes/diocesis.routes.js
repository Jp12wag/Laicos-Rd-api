const express = require('express');
const controllers = require('../controllers/diocesis.controller');

const router = new express.Router();

router.get('/', controllers.getDiocesis);
router.get('/:id', controllers.getDiocesisById);
router.post('/', controllers.createDiocesis);
router.put('/:id', controllers.updateDiocesis);
router.delete('/:id', controllers.deleteDiocesis);

module.exports = router;