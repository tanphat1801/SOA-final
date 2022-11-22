const { Schema, model } = require('mongoose');

const Subject = new Schema({
    name: String,
    isDouble: { type: Boolean, default: false },
});

module.exports = model('Subject', Subject);
