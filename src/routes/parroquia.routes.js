const express = require('express');
const controllers = require('../controllers/parroquia.controller');

const router = new express.Router();

router.get('/', controllers.getParroquias);
router.get('/:id', controllers.getParroquiaById);
router.post('/', controllers.createParroquia);
router.put('/:id', controllers.updateParroquia);
router.delete('/:id', controllers.deleteParroquia);

module.exports = router;
const express = require('express');
const controllers = require('../controllers/parroquia.controller');

const router = new express.Router();

router.get('/', controllers.getParroquias);
router.get('/:id', controllers.getParroquiaById);
router.post('/', controllers.createParroquia);
router.put('/:id', controllers.updateParroquia);
router.delete('/:id', controllers.deleteParroquia);

module.exports = router;