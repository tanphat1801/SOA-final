const express = require('express');
const router = express.Router();

const { classController } = require('../controllers');

// Current path: /admin/class
router.get('/', classController.index);
router.post('/create', classController.create);
router.post('/delete', classController.delete);

module.exports = router;
