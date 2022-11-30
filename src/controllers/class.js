const catchAsync = require('../utils/catchAsync');
const { userService, classService, subjectService } = require('../services');

const classController = {
    index: catchAsync(async (req, res) => {
        await classService.update({}, { 'timetable.isExtra': false });
        const classes = await classService.get({}, '', 'account');
        res.json(classes);
    }),

    create: catchAsync(async (req, res) => {
        const { name, grade } = req.body;
        if (!name || !grade)
            return res.status(500).send('Dữ liệu không hợp lệ');
        const user = await userService
            .create({ name, role: 'class' })
            .catch((err) => {
                return res.status(500).send('Thêm lớp học thất bại');
            });
        const subjects = await subjectService.get({});
        const array = subjects.map((subject) => ({
            subject: subject._id,
        }));
        await classService
            .create({ ...req.body, sheets: array, account: user._id })
            .catch(async (err) => {
                await userService.delete({ _id: user._id });
                return res.status(500).send('Thêm lớp học thất bại');
            });
        return res.send('Thêm lớp học thành công');
    }),

    delete: catchAsync(async (req, res) => {
        const { id } = req.body;
        const classObj = await classService.delete({ _id: id }).catch((err) => {
            return res.status(500).send('Xoá lớp học thất bại');
        });
        await userService.delete({ _id: classObj.account }).catch((err) => {
            return res.status(500).send('Xoá lớp học thất bại');
        });
        res.send('Xoá lớp học thành công');
    }),
};

module.exports = classController;
