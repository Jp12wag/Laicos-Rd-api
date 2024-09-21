const express = require('express');
const controllers = require('../controllers/unidadEpiscopal.controller');

const router = new express.Router();

router.get('/', controllers.getUnidadesEpiscopales);
router.get('/:id', controllers.getUnidadEpiscopalById);
router.post('/', controllers.createUnidadEpiscopal);
router.put('/:id', controllers.updateUnidadEpiscopal);
router.delete('/:id', controllers.deleteUnidadEpiscopal);

module.exports = router;