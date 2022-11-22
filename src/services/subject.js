const { subjectModel } = require('../models');

const subjectService = {
	getOne: async (payloads, field) => {
		return await subjectModel.findOne(payloads, field).lean();
	},

    get: async (payloads, field) => {
		return await subjectModel.find(payloads, field).lean();
	},

	create: async (payloads) => {
		return await subjectModel.create(payloads);
	},

	update: async (conditions, payloads) => {
		return await subjectModel.findOneAndUpdate(conditions, payloads);
	},

	delete: async (conditions) => {
		return await subjectModel.findOneAndDelete(conditions);
	},
};

module.exports = subjectService;
