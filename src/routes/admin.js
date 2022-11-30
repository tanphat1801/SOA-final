const express = require('express');
const router = express.Router();

const { adminController } = require('../controllers');
const subjectRouter = require('./subject');
const classRouter = require('./class');
const teacherRouter = require('./teacher');
const sheetRouter = require('./sheet');
const isAdmin = require('../middlewares/isAdmin');

// Current path: /admin
router.get('/', adminController.index);
router.post('/timetable/create', adminController.createTimetable);
router.use('/class', classRouter);
router.use('/teacher', teacherRouter);
router.use('/sheet', sheetRouter);
router.use('/subject', subjectRouter);

module.exports = router;
