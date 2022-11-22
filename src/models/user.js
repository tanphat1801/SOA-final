const { Schema, model } = require('mongoose');

const User = new Schema({
    name: String,
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'class', 'teacher'],
        default: 'class',
    },
});

module.exports = model('User', User);
