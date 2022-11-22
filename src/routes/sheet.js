const express = require('express');
const router = express.Router();

const { sheetController } = require('../controllers');

// Current path: /admin/sheet
router.get('/', sheetController.index);
router.get('/:id', sheetController.updateView);
router.post('/:id', sheetController.update);

module.exports = router;
