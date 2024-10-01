const express = require('express');
const controllers = require('../controllers/clero.controller');

const router = new express.Router();

router.get('/', controllers.getClero);
router.get('/:id', controllers.getCleroById);
router.post('/', controllers.createClero);
router.put('/:id', controllers.updateClero);
router.delete('/:id', controllers.deleteClero);

module.exports = router;