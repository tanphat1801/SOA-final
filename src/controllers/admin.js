const catchAsync = require('../utils/catchAsync');
const { classService } = require('../services');

function shuffle(array) {
    for (let i = 0; i < array.length; i++) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

const adminController = {
    index: catchAsync(async (req, res) => {
        const classes = await classService.get({}, 'name timetable');
        classes.map((item) => {
            item.timetable.expire =
                item.timetable.expire.toLocaleDateString('vi-VN');
            item.timetable.createdAt =
                item.timetable.createdAt.toLocaleDateString('vi-VN');
        });
        res.json(classes);
    }),

    createTimetable: catchAsync(async (req, res) => {
        const { expire, term } = req.body;
        if (!expire || !term)
            return res.status(500).send('Dữ liệu không hợp lệ');
        const classes = await classService.get(
            {},
            'sheets name',
            'sheets.subject sheets.teacher'
        );
        classes.map(async (classObj) => {
            const array = [];
            classObj.sheets.map((sheet) => {
                while (sheet.shift > 0) {
                    array.push({
                        teacher: sheet.teacher.name,
                        subject: sheet.subject.name,
                    });
                    sheet.shift--;
                }
            });
            const table = {
                monday: [{ teacher: '', subject: 'Chào cờ' }],
                tuesday: [],
                wednesday: [],
                thursday: [],
                friday: [],
                saturday: [],
            };
            const keys = Object.keys(table);
            let i = 0;
            shuffle(array).map((item) => {
                table[keys[i]].push(item);
                if (table[keys[i]].length == 5) i++;
            });
            table.saturday.push({
                teacher: '',
                subject: 'SHCN',
            });
            await classService
                .update(
                    { _id: classObj._id },
                    {
                        timetable: {
                            ...table,
                            expire,
                            term,
                            createdAt: Date.now(),
                        },
                    }
                )
                .catch((err) => {
                    return res.status(500).send('Tạo thời khoá biểu thất bại');
                });
        });
        res.send('Tạo thời khoá biểu thành công');
    }),
};

module.exports = adminController;
