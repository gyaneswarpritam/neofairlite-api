// controllers/hallController.js
const Hall = require('../models/Hall');
const { successResponse } = require('../utils/sendResponse');
const hallSchema = require('../validators/hallValidator');
const schemaValidator = require('../validators/schemaValidator');

exports.createHall = async (req, res) => {
    try {
        const validatedData = schemaValidator(hallSchema, req.body);
        if (validatedData.success) {
            const hall = await Hall.create(validatedData.data);
            const successObj = successResponse('Hall Created', hall)
            res.status(successObj.status).send(successObj);
        } else {
            res.status(401).json({ message: validatedData.errors });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllHall = async (req, res) => {
    try {
        const hall = await Hall.find({});
        if (!hall) {
            return res.status(404).json({ message: 'Hall not found' });
        }
        const successObj = successResponse('Hall List', hall)
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getHallById = async (req, res) => {
    try {
        const hall = await Hall.findById(req.params.id);
        if (!hall) {
            return res.status(404).json({ message: 'Hall entry not found' });
        }
        const successObj = successResponse('Hall Details', hall)
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateHall = async (req, res) => {
    try {
        const validatedData = schemaValidator(hallSchema, req.body);
        if (validatedData.success) {
            const hall = await Hall.findByIdAndUpdate(req.params.id, validatedData.data, { new: true });
            if (!hall) {
                return res.status(404).json({ message: 'Hall entry not found' });
            }
            const successObj = successResponse('Hall updated', hall)
            res.status(successObj.status).send(successObj);
        } else {
            res.status(401).json({ message: validatedData.errors });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteHall = async (req, res) => {
    try {
        const hall = await Hall.findByIdAndDelete(req.params.id);
        if (!hall) {
            return res.status(404).json({ message: 'Hall entry not found' });
        }
        res.json({ message: 'Hall entry deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
