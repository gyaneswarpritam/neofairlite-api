// controllers/brochureController.js
const Brochure = require('../models/Brochure');
const { successResponse } = require('../utils/sendResponse');
const brochureSchema = require('../validators/brochureValidator');
const schemaValidator = require('../validators/schemaValidator');

exports.createBrochure = async (req, res) => {
    try {
        const validatedData = schemaValidator(brochureSchema, req.body);
        if (validatedData.success) {
            const brochure = await Brochure.create(validatedData.data);
            const successObj = successResponse('Brochure Created', brochure)
            res.status(successObj.status).send(successObj);
        } else {
            res.status(401).json({ message: validatedData.errors });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllBrochure = async (req, res) => {
    try {
        const brochure = await Brochure.find({});
        if (!brochure) {
            return res.status(404).json({ message: 'Brochure not found' });
        }
        const successObj = successResponse('Brochure List', brochure)
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getBrochureById = async (req, res) => {
    try {
        const brochure = await Brochure.findById(req.params.id);
        if (!brochure) {
            return res.status(404).json({ message: 'Brochure not found' });
        }
        const successObj = successResponse('Brochure Details', brochure)
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateBrochure = async (req, res) => {
    try {
        const validatedData = schemaValidator(brochureSchema, req.body);
        if (validatedData.success) {
            const brochure = await Brochure.findByIdAndUpdate(req.params.id, validatedData.data, { new: true });
            if (!brochure) {
                return res.status(404).json({ message: 'Brochure not found' });
            }
            const successObj = successResponse('Brochure updated', brochure)
            res.status(successObj.status).send(successObj);
        } else {
            res.status(401).json({ message: validatedData.errors });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteBrochure = async (req, res) => {
    try {
        const brochure = await Brochure.findByIdAndDelete(req.params.id);
        if (!brochure) {
            return res.status(404).json({ message: 'Brochure not found' });
        }
        res.json({ message: 'Brochure deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
