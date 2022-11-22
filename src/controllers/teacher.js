const catchAsync = require('../utils/catchAsync');
const {
    userService,
    teacherService,
    classService,
    subjectService,
} = require('../services');

const teacherController = {
    index: catchAsync(async (req, res) => {
        const message = {
            error: req.flash('error'),
            success: req.flash('success'),
        };
        const teachers = await teacherService.get(
            {},
            '',
            'account class subject'
        );
        const subjects = await subjectService.get({});
        let chosenClasses = await teacherService.get({}, 'class -_id');
        chosenClasses = chosenClasses.map((item) => {
            return item.class;
        });
        const classes = await classService.get({
            _id: { $nin: chosenClasses },
        });
        res.render('admin/teacher', {
            title: 'Danh sách giáo viên',
            layout: 'admin',
            message,
            teachers,
            classes,
            subjects,
            user: req.cookies.user,
        });
    }),

    create: catchAsync(async (req, res) => {
        const { name, subject } = req.body;
        if (!name || !subject) {
            req.flash('error', 'Thêm thất bại');
            return res.redirect('back');
        }
        const user = await userService
            .create({ name, role: 'teacher' })
            .catch((err) => {
                req.flash('error', 'Thêm thất bại' + err);
                return res.redirect('back');
            });
        const teacher = await teacherService
            .create({
                ...req.body,
                class: req.body.class || null,
                account: user._id,
            })
            .catch(async (err) => {
                await userService.delete({ _id: user._id });
                req.flash('error', 'Thêm thất bại');
                return res.redirect('back');
            });
        if (teacher.class) {
            await classService
                .update(
                    { _id: teacher.class, 'sheets.subject': teacher.subject },
                    {
                        $set: {
                            'sheets.$.teacher': teacher._id,
                        },
                    }
                )
                .catch(async (err) => {
                    await userService.delete({ _id: user._id });
                    req.flash('error', 'Thêm thất bại' + err);
                    return res.redirect('back');
                });
        }
        req.flash('success', 'Thêm thành công');
        res.redirect('back');
    }),

    update: catchAsync(async (req, res) => {
        const classId = req.body.class || null;
        const teacher = await teacherService.getOne({ _id: req.body._id });
        await classService
            .update(
                { _id: teacher.class, 'sheets.subject': teacher.subject },
                {
                    $set: {
                        'sheets.$.teacher': null,
                    },
                }
            )
            .catch((err) => {
                req.flash('error', 'Cập nhật thất bại');
                return res.redirect('back');
            });
        await teacherService
            .update({ _id: req.body._id }, { class: classId})
            .catch((err) => {
                req.flash('error', 'Cập nhật thất bại');
                return res.redirect('back');
            });
        if (classId) {
            await classService
                .update(
                    { _id: classId, 'sheets.subject': teacher.subject },
                    {
                        $set: {
                            'sheets.$.teacher': teacher._id,
                        },
                    }
                )
                .catch((err) => {
                    req.flash('error', 'Cập nhật thất bại');
                    return res.redirect('back');
                });
        }
        req.flash('success', 'Cập nhật thành công');
        res.redirect('back');
    }),

    delete: catchAsync(async (req, res) => {
        const { id } = req.body;
        const teacher = await teacherService
            .delete({ _id: id })
            .catch((err) => {
                req.flash('error', 'Xoá thất bại');
                return res.redirect('back');
            });
        await userService.delete({ _id: teacher.account }).catch((err) => {
            req.flash('error', 'Xoá thất bại');
            return res.redirect('back');
        });
        if (teacher.class) {
            await classService
                .update(
                    { _id: teacher.class, 'sheets.subject': teacher.subject },
                    {
                        $set: {
                            'sheets.$.teacher': null,
                        },
                    }
                )
                .catch((err) => {
                    req.flash('error', 'Xoá thất bại');
                    return res.redirect('back');
                });
        }
        req.flash('success', 'Xoá thành công');
        res.redirect('back');
    }),
};

module.exports = teacherController;
