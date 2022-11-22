const catchAsync = require('../utils/catchAsync');
const { userService, classService, subjectService } = require('../services');

const classController = {
    index: catchAsync(async (req, res) => {
        const message = {
            error: req.flash('error'),
            success: req.flash('success'),
        };
        const classes = await classService.get({}, '', 'account');
        res.render('admin/class', {
            title: 'Danh sách lớp học',
            layout: 'admin',
            message,
            classes,
            user: req.cookies.user,
        });
    }),

    create: catchAsync(async (req, res) => {
        const { name, grade } = req.body;
        if (!name || !grade) {
            req.flash('error', 'Thêm thất bại');
            return res.redirect('back');
        }
        const user = await userService
            .create({ name, role: 'class' })
            .catch((err) => {
                req.flash('error', 'Thêm thất bại');
                return res.redirect('back');
            });
        const subjects = await subjectService.get({});
        const array = subjects.map((subject) => ({
            subject: subject._id,
        }));
        await classService
            .create({ ...req.body, sheets: array, account: user._id })
            .catch(async (err) => {
                await userService.delete({ _id: user._id });
                req.flash('error', 'Thêm thất bại');
                return res.redirect('back');
            });
        req.flash('success', 'Thêm thành công');
        res.redirect('back');
    }),

    delete: catchAsync(async (req, res) => {
        const { id } = req.body;
        const classObj = await classService.delete({ _id: id }).catch((err) => {
            req.flash('error', 'Xoá thất bại');
            return res.redirect('back');
        });
        await userService.delete({ _id: classObj.account }).catch((err) => {
            req.flash('error', 'Xoá thất bại');
            return res.redirect('back');
        });
        req.flash('success', 'Xoá thành công');
        res.redirect('back');
    }),
};

module.exports = classController;
