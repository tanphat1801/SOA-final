const express = require('express');
const router = express.Router();

const { subjectController } = require('../controllers');

// Current path: /admin/subject
router.get('/', subjectController.index);
router.post('/create', subjectController.create);
router.post('/delete', subjectController.delete);

module.exports = router;
