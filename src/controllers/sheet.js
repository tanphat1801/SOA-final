const catchAsync = require('../utils/catchAsync');
const { classService, teacherService, subjectService } = require('../services');

const sheetController = {
    index: catchAsync(async (req, res) => {
        const message = {
            error: req.flash('error'),
            success: req.flash('success'),
        };
        const classes = await classService.get(
            {},
            '-account -__v',
            'sheets.subject sheets.teacher'
        );
        const subjects = await subjectService.get({});
        res.render('admin/sheet', {
            title: 'Danh sách giáo viên',
            layout: 'admin',
            message,
            classes,
            subjects,
            user: req.cookies.user,
        });
    }),

    updateView: catchAsync(async (req, res) => {
        const classObj = await classService.getOne(
            { _id: req.params.id },
            '-account -__v',
            'sheets.subject sheets.teacher'
        );
        console.log(classObj);
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
        res.render('admin/sheet/update', {
            title: classObj.name,
            layout: 'admin',
            class: classObj,
            user: req.cookies.user,
        });
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
                req.flash('error', 'Cập nhật thất bại');
                return res.redirect('/admin/sheet');
            });
        req.flash('success', 'Cập nhật thành công');
        res.redirect('/admin/sheet');
    }),
};

module.exports = sheetController;
