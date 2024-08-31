const StallVideoList = require('../models/StallVideoList'); // Adjust the import to the correct model
const { successResponse } = require('../utils/sendResponse');
const stallVideoSchema = require('../validators/stallVideoValidator'); // Use appropriate schema
const schemaValidator = require('../validators/schemaValidator');

exports.createStallVideo = async (req, res) => {
    try {
        const validatedData = schemaValidator(stallVideoSchema, req.body);
        if (validatedData.success) {
            const stallVideo = await StallVideoList.create(validatedData.data);
            const successObj = successResponse('Stall Video Created', stallVideo);
            res.status(successObj.status).send(successObj);
        } else {
            res.status(401).json({ message: validatedData.errors });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getStallVideoById = async (req, res) => {
    try {
        const stallVideo = await StallVideoList.findById(req.params.id).populate('stall');
        if (!stallVideo) {
            return res.status(404).json({ message: 'Stall video entry not found' });
        }
        const successObj = successResponse('Stall Video', stallVideo);
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateStallVideo = async (req, res) => {
    try {
        const validatedData = schemaValidator(stallVideoSchema, req.body);
        if (validatedData.success) {
            const stallVideo = await StallVideoList.findByIdAndUpdate(req.params.id, validatedData.data, { new: true });
            if (!stallVideo) {
                return res.status(404).json({ message: 'Stall video entry not found' });
            }
            const successObj = successResponse('Stall Video updated', stallVideo);
            res.status(successObj.status).send(successObj);
        } else {
            res.status(401).json({ message: validatedData.errors });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteStallVideo = async (req, res) => {
    try {
        const stallVideo = await StallVideoList.findByIdAndDelete(req.params.id);
        if (!stallVideo) {
            return res.status(404).json({ message: 'Stall video entry not found' });
        }
        const successObj = successResponse('Stall video entry deleted', stallVideo);
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
