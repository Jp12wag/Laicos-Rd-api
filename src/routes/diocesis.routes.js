const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const diocesisController = require('../controllers/diocesis.controller');


router.post('/',auth, diocesisController.createDiocesis);
router.get('/',auth, diocesisController.getAllDiocesis);
router.get('/:id', auth,diocesisController.getDiocesisById);
router.put('/:id', auth,diocesisController.updateDiocesis);
router.delete('/:id', auth,diocesisController.deleteDiocesis);

module.exports = router;