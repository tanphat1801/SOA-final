const { Schema, model } = require('mongoose');

const Teacher = new Schema({
    name: String,
    gender: String,
    account: { type: Schema.Types.ObjectId, ref: 'User' },
    class: { type: Schema.Types.ObjectId, ref: 'Class' },
    subject: { type: Schema.Types.ObjectId, ref: 'Subject' },
    standardPeriod: Number,
});

module.exports = model('Teacher', Teacher);
