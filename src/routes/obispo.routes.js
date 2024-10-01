const express = require('express');
const controllers = require('../controllers/obispo.controller');

const router = new express.Router();

router.get('/', controllers.getObispos);
router.get('/:id', controllers.getObispoById);
router.post('/', controllers.createObispo);
router.put('/:id', controllers.updateObispo);
router.delete('/:id', controllers.deleteObispo);

module.exports = router;
const express = require('express');
const controllers = require('../controllers/obispo.controller');

const router = new express.Router();

router.get('/', controllers.getObispos);
router.get('/:id', controllers.getObispoById);
router.post('/', controllers.createObispo);
router.put('/:id', controllers.updateObispo);
router.delete('/:id', controllers.deleteObispo);

module.exports = router;