const { Schema, model } = require('mongoose');

const Class = new Schema({
    name: String,
    grade: Number,
    account: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    sheets: [
        {
            subject: { type: Schema.Types.ObjectId, ref: 'Subject' },
            teacher: { type: Schema.Types.ObjectId, ref: 'Teacher' },
            shift: { type: Number, default: 1 },
        },
    ],
    timetable: {
        monday: [
            {
                teacher: String,
                subject: String,
            },
        ],
        tuesday: [
            {
                teacher: String,
                subject: String,
            },
        ],
        wednesday: [
            {
                teacher: String,
                subject: String,
            },
        ],
        thursday: [
            {
                teacher: String,
                subject: String,
            },
        ],
        friday: [
            {
                teacher: String,
                subject: String,
            },
        ],
        saturday: [
            {
                teacher: String,
                subject: String,
            },
        ],
        expire: Date,
        term: String,
        createdAt: Date,
    },
});

module.exports = model('Class', Class);
