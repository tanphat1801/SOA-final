const express = require('express');
const router = express.Router();

const { teacherController } = require('../controllers');

// Current path: /admin/teacher
router.get('/', teacherController.index);
router.post('/create', teacherController.create);
router.post('/update', teacherController.update);
router.post('/delete', teacherController.delete);

module.exports = router;
