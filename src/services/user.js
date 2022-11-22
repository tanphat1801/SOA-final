const { userModel } = require('../models');
const generator = require('generate-password');

const userService = {
    getOne: async (payloads, field) => {
        return await userModel.findOne(payloads, field).lean();
    },

    get: async (payloads, field) => {
        return await userModel.find(payloads, field).lean();
    },

    create: async (payloads) => {
        let username = payloads.name.replace(/\s/g, '').toLowerCase();
        username = username.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const user = await userModel.findOne({ username });
        if (user) throw new Error('Tên đăng nhập đã tồn tại');
        const password = generator.generate({
            length: 6,
            numbers: true,
        });
        return await userModel.create({ ...payloads, username, password });
    },

    update: async (conditions, payloads) => {
        return await userModel.findOneAndUpdate(conditions, payloads);
    },

    delete: async (conditions) => {
        return await userModel.findOneAndDelete(conditions);
    },
};

module.exports = userService;
