const mongoose = require('mongoose');
const { userModel, subjectModel } = require('../src/models');
const user = require('./user');
const subject = require('./subject');

const importData = async () => {
    await userModel.create(user);
    await subjectModel.create(subject);
};

const deleteData = async () => {
    await mongoose.connection.collections.users.drop();
    await mongoose.connection.collections.subjects.drop();
};

const resetData = async () => {
    await deleteData();
    await importData();
};

(async () => {
    try {
        await mongoose.connect(
            'mongodb+srv://soa-final:123@cluster0.mjnnjsy.mongodb.net/?retryWrites=true&w=majority',
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );
        await resetData();
        console.log('Reset successfully');
    } catch (err) {
        console.error(err);
    } finally {
        mongoose.disconnect();
    }
})();
