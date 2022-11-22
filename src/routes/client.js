const express = require('express');
const router = express.Router();

const { clientController } = require('../controllers');

// Current path: /
router.get('/', clientController.getClassTimeTable);
router.get('/teacher', clientController.getTeacherTimeTable);

module.exports = router;
