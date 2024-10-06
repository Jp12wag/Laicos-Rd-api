const express = require('express');
const controllers = require('../controllers/parroquia.controller');

const router = new express.Router();

router.get('/', controllers.getParroquias);
router.get('/:id', controllers.getParroquiaById);
router.post('/parroquia', controllers.createParroquia);
router.put('/:id', controllers.updateParroquia);
router.delete('/:id', controllers.deleteParroquia);

module.exports = router;