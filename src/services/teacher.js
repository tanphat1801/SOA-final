const { teacherModel } = require('../models');

const teacherService = {
    getOne: async (payloads, field, populate = false) => {
        const res = teacherModel.findOne(payloads, field);
        if (!populate) return await res.lean();
        return await res.populate(populate).lean();
    },

    get: async (payloads, field, populate = false) => {
        const res = teacherModel.find(payloads, field);
        if (!populate) return await res.lean();
        return await res.populate(populate).lean();
    },

    create: async (payloads) => {
        return await teacherModel.create(payloads);
    },

    update: async (conditions, payloads) => {
        return await teacherModel.findOneAndUpdate(conditions, payloads);
    },

    delete: async (conditions) => {
        return await teacherModel.findOneAndDelete(conditions);
    },
};

module.exports = teacherService;
