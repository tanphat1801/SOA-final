const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect(
            'mongodb+srv://soa-final:123@cluster0.mjnnjsy.mongodb.net/?retryWrites=true&w=majority',
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            },
        );
        console.log('Connect db successfully');
    } catch (error) {
        console.log('Fail to connect db');
    }
}

module.exports = { connect };
