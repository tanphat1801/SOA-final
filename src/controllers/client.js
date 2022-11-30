const catchAsync = require('../utils/catchAsync');
const { classService, teacherService } = require('../services');

const clientController = {
    getClassTimeTable: catchAsync(async (req, res) => {
        const timetable = (
            await classService.getOne(
                { account: req.params.id },
                'timetable account'
            )
        ).timetable;
        timetable.expire = timetable.expire.toLocaleDateString('vi-VN');
        timetable.createdAt = timetable.createdAt.toLocaleDateString('vi-VN');
        res.json(timetable);
    }),

    getTeacherTimeTable: catchAsync(async (req, res) => {
        const teacher = await teacherService.getOne(
            { account: req.params.id },
            'name'
        );
        const classes = await classService.get({}, 'name timetable');
        const timetable = {
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: [],
            expire: classes[0].timetable.expire.toLocaleDateString('vi-VN'),
            createdAt:
                classes[0].timetable.createdAt.toLocaleDateString('vi-VN'),
            term: classes[0].timetable.term,
        };
        classes.map((item) => {
            Object.keys(item.timetable).forEach(function (key, i) {
                if (i > 5) return;
                console.log(item.timetable[key], i);
                item.timetable[key].map((cell) => {
                    if (cell.teacher == teacher.name)
                        timetable[key].push(item.name);
                    else timetable[key].push('');
                });
            });
        });
        res.json(timetable);
    }),
};

module.exports = clientController;
