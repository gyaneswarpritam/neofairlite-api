// controllers/settingController.js
const Setting = require('../models/Setting');
const { successResponse } = require('../utils/sendResponse');
const settingSchema = require('../validators/settingValidator');
const schemaValidator = require('../validators/schemaValidator');
const moment = require('moment-timezone');
const slots = require('../models/slots');

exports.createSetting = async (req, res) => {
    try {
        const validatedData = schemaValidator(settingSchema, req.body);
        if (validatedData.success) {
            // Convert startDateTime and endDateTime to UTC
            validatedData.data.startDateTime = new Date(req.body.startDateTime).toISOString();
            validatedData.data.endDateTime = new Date(req.body.endDateTime).toISOString();

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

exports.getAllSettings = async (req, res) => {
    try {
        const settings = await Setting.find({});
        if (!settings) {
            return res.status(404).json({ message: 'Settings not found' });
        }

        // Adjust startDateTime and endDateTime based on the timezone field
        const adjustedSettings = settings.map(setting => {
            const { timezone, startDateTime, endDateTime } = setting;

            // Convert UTC times to the specified timezone
            const startDateTimeInTimezone = moment(startDateTime).tz(timezone).format();
            const endDateTimeInTimezone = moment(endDateTime).tz(timezone).format();

            // Return the adjusted setting object with modified times
            return {
                ...setting._doc, // Include all other fields
                startDateTime: startDateTimeInTimezone,
                endDateTime: endDateTimeInTimezone,
            };
        });

        const successObj = successResponse('Setting List', adjustedSettings);
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

        const { timezone, startDateTime, endDateTime } = setting;

        // Set a default timezone if not provided
        const userTimezone = timezone || 'UTC';

        // Convert UTC times to the specified timezone
        const startDateTimeInTimezone = moment(startDateTime).tz(userTimezone).format();
        const endDateTimeInTimezone = moment(endDateTime).tz(userTimezone).format();

        // Adjust the setting object with the converted times
        const adjustedSetting = {
            ...setting._doc, // Include all other fields
            startDateTime: startDateTimeInTimezone,
            endDateTime: endDateTimeInTimezone,
        };

        const successObj = successResponse('Setting Details', adjustedSetting);
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateSetting = async (req, res) => {
    try {
        // Check if startDateTime and endDateTime are provided in the request
        const updateData = { ...req.body };

        if (req.body.startDateTime) {
            updateData.startDateTime = new Date(req.body.startDateTime).toISOString();
        }

        if (req.body.endDateTime) {
            updateData.endDateTime = new Date(req.body.endDateTime).toISOString();
        }

        // Update the setting by its ID
        const setting = await Setting.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!setting) {
            return res.status(404).json({ message: 'Setting not found' });
        }
        await slots.deleteMany({});
        // Respond with success message
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
