const { classModel } = require('../models');

const classService = {
    getOne: async (payloads, field, populate = false) => {
        const res = classModel.findOne(payloads, field);
        if (!populate) return await res.lean();
        return await res.populate(populate).lean();
    },

    get: async (payloads, field, populate = false) => {
        const res = classModel.find(payloads, field);
        if (!populate) return await res.lean();
        return await res.populate(populate).lean();
    },

    create: async (payloads) => {
        return await classModel.create(payloads);
    },

    update: async (conditions, payloads) => {
        return await classModel.updateMany(conditions, payloads);
    },

    delete: async (conditions) => {
        return await classModel.findOneAndDelete(conditions);
    },
};

module.exports = classService;
