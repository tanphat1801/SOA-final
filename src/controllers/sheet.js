const catchAsync = require('../utils/catchAsync');
const { classService, teacherService, subjectService } = require('../services');

const sheetController = {
    index: catchAsync(async (req, res) => {
        const classes = await classService.get(
            {},
            '-account -__v',
            'sheets.subject sheets.teacher'
        );
        res.json(classes);
    }),

    updateView: catchAsync(async (req, res) => {
        const classObj = await classService.getOne(
            { _id: req.params.id },
            '-account -__v',
            'sheets.subject sheets.teacher'
        );
        await Promise.all(
            classObj.sheets.map(async (sheet) => {
                sheet.subject.teachers = await teacherService.get(
                    {
                        subject: sheet.subject._id,
                    },
                    'name'
                );
            })
        );
        res.json(classObj);
    }),

    update: catchAsync(async (req, res) => {
        const sheets = [];
        for (let i = 0; i < req.body._id.length; i++) {
            sheets.push({
                _id: req.body._id[i],
                subject: req.body.subject[i],
                teacher: req.body.teacher[i],
                shift: req.body.shift[i],
            });
        }   
        await classService
            .update({ _id: req.params.id }, { sheets })
            .catch((err) => {
                return res.status(500).send('Cập nhật thất bại');
            });
        res.send('Cập nhật thành công');
    }),
};

module.exports = sheetController;
