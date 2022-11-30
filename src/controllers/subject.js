const catchAsync = require('../utils/catchAsync');
const { subjectService } = require('../services');

const subjectController = {
    index: catchAsync(async (req, res) => {
        const subjects = await subjectService.get({});
        res.json(subjects);
    }),

    create: catchAsync(async (req, res) => {
        if (!req.body.name)
            return res.status(500).send('Thêm môn học thất bại');
        await subjectService.create({ ...req.body }).catch((err) => {
            return res.status(500).send('Thêm môn học thất bại');
        });
        res.send('Thêm môn học thành công');
    }),

    delete: catchAsync(async (req, res) => {
        await subjectService.delete({ _id: req.body.id }).catch((err) => {
            return res.status(500).send('Xoá môn học thất bại');
        });
        res.send('Xoá môn học thành công');
    }),
};

module.exports = subjectController;
