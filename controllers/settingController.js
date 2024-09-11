const Setting = require('../models/Setting');
const { successResponse } = require('../utils/sendResponse');
const settingSchema = require('../validators/settingValidator');
const schemaValidator = require('../validators/schemaValidator');
const slots = require('../models/slots');
const moment = require('moment-timezone'); // Import moment-timezone

exports.createSetting = async (req, res) => {
    try {
        const validatedData = schemaValidator(settingSchema, req.body);
        if (validatedData.success) {
            const { startDateTime, endDateTime, timezone } = validatedData.data;

            // Convert startDateTime and endDateTime from the provided timezone to UTC
            const startUTC = moment.tz(startDateTime, timezone).utc().toDate();
            const endUTC = moment.tz(endDateTime, timezone).utc().toDate();

            // Update the validated data with the UTC dates
            validatedData.data.startDateTime = startUTC;
            validatedData.data.endDateTime = endUTC;

            await slots.deleteMany({});
            const setting = await Setting.create(validatedData.data);
            const successObj = successResponse('Setting Created', setting)
            res.status(successObj.status).send(successObj);
        } else {
            res.status(401).json({ message: validatedData.errors });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateSetting = async (req, res) => {
    try {
        const { startDateTime, endDateTime, timezone } = req.body;

        // Convert startDateTime and endDateTime from the provided timezone to UTC
        const startUTC = moment.tz(startDateTime, timezone).utc().toDate();
        const endUTC = moment.tz(endDateTime, timezone).utc().toDate();

        // Update the request body with the UTC dates
        req.body.startDateTime = startUTC;
        req.body.endDateTime = endUTC;

        const setting = await Setting.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!setting) {
            return res.status(404).json({ message: 'Setting not found' });
        }
        await slots.deleteMany({});
        res.status(200).json({ data: setting, message: 'Setting updated successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllSettings = async (req, res) => {
    try {
        const settings = await Setting.find({});
        if (!settings) {
            return res.status(404).json({ message: 'Settings not found' });
        }
        const successObj = successResponse('Setting List', settings)
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getSettingById = async (req, res) => {
    try {
        const setting = await Setting.findById(req.params.id);
        if (!setting) {
            return res.status(404).json({ message: 'Setting not found' });
        }
        const successObj = successResponse('Setting Details', setting)
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteSetting = async (req, res) => {
    try {
        const setting = await Setting.findByIdAndDelete(req.params.id);
        if (!setting) {
            return res.status(404).json({ message: 'Setting not found' });
        }
        res.json({ message: 'Setting deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
