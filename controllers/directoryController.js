// controllers/directoryController.js
const Directory = require('../models/Directory');
const { successResponse } = require('../utils/sendResponse');
const directorySchema = require('../validators/directoryValidator');
const schemaValidator = require('../validators/schemaValidator');

exports.createDirectory = async (req, res) => {
    try {
        const validatedData = schemaValidator(directorySchema, req.body);
        if (validatedData.success) {
            const directory = await Directory.create(validatedData.data);
            const successObj = successResponse('Directory Created', directory)
            res.status(successObj.status).send(successObj);
        } else {
            res.status(401).json({ message: validatedData.errors });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllDirectory = async (req, res) => {
    try {
        const directory = await Directory.find({});
        if (!directory) {
            return res.status(404).json({ message: 'Directory not found' });
        }
        const successObj = successResponse('Directory List', directory)
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getDirectoryById = async (req, res) => {
    try {
        const directory = await Directory.findById(req.params.id);
        if (!directory) {
            return res.status(404).json({ message: 'Directory entry not found' });
        }
        res.json(directory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateDirectory = async (req, res) => {
    try {
        const validatedData = schemaValidator(directorySchema, req.body);
        if (validatedData.success) {
            const directory = await Directory.findByIdAndUpdate(req.params.id, validatedData.data, { new: true });
            if (!directory) {
                return res.status(404).json({ message: 'Directory entry not found' });
            }
            const successObj = successResponse('Directory updated', directory)
            res.status(successObj.status).send(successObj);
        } else {
            res.status(401).json({ message: validatedData.errors });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteDirectory = async (req, res) => {
    try {
        const directory = await Directory.findByIdAndDelete(req.params.id);
        if (!directory) {
            return res.status(404).json({ message: 'Directory entry not found' });
        }
        res.json({ message: 'Directory entry deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
