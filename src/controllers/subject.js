const catchAsync = require('../utils/catchAsync');
const { subjectService } = require('../services');

const subjectController = {
    index: catchAsync(async (req, res) => {
        const message = {
            error: req.flash('error'),
            success: req.flash('success'),
        };
        const subjects = await subjectService.get({});
        res.render('admin/subject', {
            title: 'Danh sách môn học',
            layout: 'admin',
            message,
            subjects,
            user: req.cookies.user,
        });
    }),

    create: catchAsync(async (req, res) => {
        if (!req.body.name) {
            req.flash('error', 'Thêm môn học thất bại');
            return res.redirect('back');
        }
        await subjectService.create({ ...req.body }).catch((err) => {
            req.flash('error', 'Thêm môn học thất bại');
            return res.redirect('back');
        });
        req.flash('success', 'Thêm môn học thành công');
        res.redirect('back');
    }),

    delete: catchAsync(async (req, res) => {
        await subjectService.delete({ _id: req.body.id }).catch((err) => {
            req.flash('error', 'Xoá môn học thất bại');
            return res.redirect('back');
        });
        req.flash('success', 'Xoá môn học thành công');
        res.redirect('back');
    }),
};

module.exports = subjectController;
