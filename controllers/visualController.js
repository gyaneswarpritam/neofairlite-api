// controllers/visualController.js
const Visual = require('../models/Visual');
const visualSchema = require('../validators/visualValidator');
const schemaValidator = require('../validators/schemaValidator');
const { successResponse } = require('../utils/sendResponse');

exports.createVisual = async (req, res) => {
    try {
        const validatedData = schemaValidator(visualSchema, req.body);
        if (validatedData.success) {
            const visual = await Visual.create(req.body);
            const successObj = successResponse('Visual Created', visual)
            res.status(successObj.status).send(successObj);
        } else {
            res.status(401).json({ message: validatedData.errors });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllVisual = async (req, res) => {
    try {
        const visual = await Visual.find({});
        if (!visual) {
            return res.status(404).json({ message: 'Visual not found' });
        }
        const successObj = successResponse('Visual List', visual)
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getVisualById = async (req, res) => {
    try {
        const visual = await Visual.findById(req.params.id);
        if (!visual) {
            return res.status(404).json({ message: 'Visual entry not found' });
        }
        res.json(visual);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateVisual = async (req, res) => {
    try {
        const validatedData = schemaValidator(visualSchema, req.body);
        if (validatedData.success) {
            const visual = await Visual.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!visual) {
                return res.status(404).json({ message: 'Visual entry not found' });
            }
            const successObj = successResponse('Visual updated', visual)
            res.status(successObj.status).send(successObj);
        } else {
            res.status(401).json({ message: validatedData.errors });
        };
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteVisual = async (req, res) => {
    try {
        const visual = await Visual.findByIdAndDelete(req.params.id);
        if (!visual) {
            return res.status(404).json({ message: 'Visual entry not found' });
        }
        res.json({ message: 'Visual entry deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
