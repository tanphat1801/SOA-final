const express = require('express');
const router = express.Router();

const { clientController } = require('../controllers');

// Current path: /
router.get('/class/:id', clientController.getClassTimeTable);
router.get('/teacher/:id', clientController.getTeacherTimeTable);

module.exports = router;
