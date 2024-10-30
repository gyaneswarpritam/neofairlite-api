// controllers/auditoriumController.js
const Auditorium = require('../models/Auditorium');
const { successResponse } = require('../utils/sendResponse');
const auditoriumSchema = require('../validators/auditoriumValidator');
const schemaValidator = require('../validators/schemaValidator');

exports.createAuditorium = async (req, res) => {
    try {
        const validatedData = schemaValidator(auditoriumSchema, req.body);
        if (validatedData.success) {
            const auditorium = await Auditorium.create(validatedData.data);
            const successObj = successResponse('Auditorium created', auditorium)
            res.status(successObj.status).send(successObj);
        } else {
            res.status(401).json({ message: validatedData.errors });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllAuditorium = async (req, res) => {
    try {
        const auditorium = await Auditorium.find({});
        if (!auditorium) {
            return res.status(404).json({ message: 'Auditorium not found' });
        }
        const successObj = successResponse('Auditorium List', auditorium)
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAuditoriumById = async (req, res) => {
    try {
        const auditorium = await Auditorium.findById(req.params.id);
        if (!auditorium) {
            return res.status(404).json({ message: 'Auditorium not found' });
        }
        res.json(auditorium);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateAuditorium = async (req, res) => {
    try {
        const validatedData = schemaValidator(auditoriumSchema, req.body);
        if (validatedData.success) {
            const auditorium = await Auditorium.findByIdAndUpdate(req.params.id, validatedData.data, { new: true });
            if (!auditorium) {
                return res.status(404).json({ message: 'Auditorium not found' });
            }
            const successObj = successResponse('Auditorium updated', auditorium)
            res.status(successObj.status).send(successObj);
        } else {
            res.status(401).json({ message: validatedData.errors });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteAuditorium = async (req, res) => {
    try {
        const auditorium = await Auditorium.findByIdAndDelete(req.params.id);
        if (!auditorium) {
            return res.status(404).json({ message: 'Auditorium not found' });
        }
        res.json({ message: 'Auditorium deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
