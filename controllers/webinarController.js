// controllers/webinarController.js
const Webinar = require('../models/Webinar');
const webinarSchema = require('../validators/webinarValidator');
const schemaValidator = require('../validators/schemaValidator');
const { successResponse } = require('../utils/sendResponse');

exports.createWebinar = async (req, res) => {
    try {
        const validatedData = schemaValidator(webinarSchema, req.body);
        if (validatedData.success) {
            const webinar = await Webinar.create(validatedData.data);
            const successObj = successResponse('Webinar Created', webinar)
            res.status(successObj.status).send(successObj);
        } else {
            res.status(401).json({ message: validatedData.errors });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllWebinar = async (req, res) => {
    try {
        const webinar = await Webinar.find({});
        if (!webinar) {
            return res.status(404).json({ message: 'Webinar not found' });
        }
        const successObj = successResponse('Webinar List', webinar)
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getWebinarById = async (req, res) => {
    try {
        const webinar = await Webinar.findById(req.params.id);
        if (!webinar) {
            return res.status(404).json({ message: 'Webinar entry not found' });
        }
        const successObj = successResponse('Webinar Details', webinar)
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateWebinar = async (req, res) => {
    try {
        const validatedData = schemaValidator(webinarSchema, req.body);
        if (validatedData.success) {
            const webinar = await Webinar.findByIdAndUpdate(req.params.id, validatedData.data, { new: true });
            if (!webinar) {
                return res.status(404).json({ message: 'Webinar entry not found' });
            }
            const successObj = successResponse('Webinar updated', webinar)
            res.status(successObj.status).send(successObj);
        } else {
            res.status(401).json({ message: validatedData.errors });
        };
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteWebinar = async (req, res) => {
    try {
        const webinar = await Webinar.findByIdAndDelete(req.params.id);
        if (!webinar) {
            return res.status(404).json({ message: 'Webinar entry not found' });
        }
        res.json({ message: 'Webinar entry deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
