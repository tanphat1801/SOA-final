const catchAsync = require('../utils/catchAsync');
const { userService, teacherService, classService } = require('../services');

const teacherController = {
    index: catchAsync(async (req, res) => {
        const teachers = await teacherService.get(
            {},
            '',
            'account class subject'
        );
        res.json(teachers);
    }),

    create: catchAsync(async (req, res) => {
        const { name, subject } = req.body;
        if (!name || !subject)
            return res.status(500).send('Thêm giáo viên thất bại');
        const user = await userService
            .create({ name, role: 'teacher' })
            .catch((err) => {
                return res.status(500).send('Thêm giáo viên thất bại');
            });
        const teacher = await teacherService
            .create({
                ...req.body,
                class: req.body.class || null,
                account: user._id,
            })
            .catch(async (err) => {
                await userService.delete({ _id: user._id });
                return res.status(500).send('Thêm giáo viên thất bại');
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
                    return res.status(500).send('Thêm giáo viên thất bại');
                });
        }
        res.send('Thêm giáo viên thành công');
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
                return res.status(500).send('Cập nhật giáo viên thất bại');
            });
        await teacherService
            .update({ _id: req.body._id }, { class: classId })
            .catch((err) => {
                return res.status(500).send('Cập nhật giáo viên thất bại');
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
                    return res.status(500).send('Cập nhật giáo viên thất bại');
                });
        }
        res.send('Cập nhật giáo viên thành công');
    }),

    delete: catchAsync(async (req, res) => {
        const { id } = req.body;
        const teacher = await teacherService
            .delete({ _id: id })
            .catch((err) => {
                return res.status(500).send('Xoá giáo viên thất bại');
            });
        await userService.delete({ _id: teacher.account }).catch((err) => {
            return res.status(500).send('Xoá giáo viên thất bại');
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
                    return res.status(500).send('Xoá giáo viên thất bại');
                });
        }
        res.send('Xoá giáo viên thành công');
    }),
};

module.exports = teacherController;
