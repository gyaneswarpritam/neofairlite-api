const Setting = require('../models/Setting');
const { successResponse } = require('../utils/sendResponse');
const settingSchema = require('../validators/settingValidator');
const schemaValidator = require('../validators/schemaValidator');
const slots = require('../models/slots');

exports.createSetting = async (req, res) => {
    try {
        const validatedData = schemaValidator(settingSchema, req.body);
        if (validatedData.success) {
            // Convert startDateTime and endDateTime to UTC before saving
            validatedData.data.startDateTime = new Date(validatedData.data.startDateTime).toISOString();
            validatedData.data.endDateTime = new Date(validatedData.data.endDateTime).toISOString();

            // Clear previous slots and create new setting
            await slots.deleteMany({});
            const setting = await Setting.create(validatedData.data);
            const successObj = successResponse('Setting Created', setting);
            res.status(successObj.status).send(successObj);
        } else {
            res.status(401).json({ message: validatedData.errors });
        }
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

        // Convert dates to UTC in response
        const settingsWithUTC = settings.map(setting => ({
            ...setting.toObject(),
            startDateTime: setting.startDateTime.toISOString(),
            endDateTime: setting.endDateTime.toISOString()
        }));

        const successObj = successResponse('Setting List', settingsWithUTC);
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

        // Convert dates to UTC in response
        const settingWithUTC = {
            ...setting.toObject(),
            startDateTime: setting.startDateTime.toISOString(),
            endDateTime: setting.endDateTime.toISOString()
        };

        const successObj = successResponse('Setting Details', settingWithUTC);
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateSetting = async (req, res) => {
    try {
        // Convert startDateTime and endDateTime to UTC before saving
        if (req.body.startDateTime) {
            req.body.startDateTime = new Date(req.body.startDateTime).toISOString();
        }
        if (req.body.endDateTime) {
            req.body.endDateTime = new Date(req.body.endDateTime).toISOString();
        }

        const setting = await Setting.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!setting) {
            return res.status(404).json({ message: 'Setting not found' });
        }

        // Clear previous slots and respond with success
        await slots.deleteMany({});
        res.status(200).json({ data: setting, message: 'Setting updated successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
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
