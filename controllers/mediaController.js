// controllers/mediaController.js
const Media = require('../models/Media');
const { successResponse } = require('../utils/sendResponse');
const mediaSchema = require('../validators/mediaValidator');
const schemaValidator = require('../validators/schemaValidator');

exports.createMedia = async (req, res) => {
    try {
        const validatedData = schemaValidator(mediaSchema, req.body);
        if (validatedData.success) {
            const media = await Media.create(validatedData.data);
            const successObj = successResponse('Media Created', media)
            res.status(successObj.status).send(successObj);
        } else {
            res.status(401).json({ message: validatedData.errors });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllMedia = async (req, res) => {
    try {
        const media = await Media.find({});
        if (!media) {
            return res.status(404).json({ message: 'Media not found' });
        }
        const successObj = successResponse('Media List', media)
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMediaById = async (req, res) => {
    try {
        const media = await Media.findById(req.params.id);
        if (!media) {
            return res.status(404).json({ message: 'Media entry not found' });
        }
        const successObj = successResponse('Media List', media)
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateMedia = async (req, res) => {
    try {
        const validatedData = schemaValidator(mediaSchema, req.body);
        if (validatedData.success) {
            const media = await Media.findByIdAndUpdate(req.params.id, validatedData.data, { new: true });
            if (!media) {
                return res.status(404).json({ message: 'Media entry not found' });
            }
            const successObj = successResponse('Media updated', media)
            res.status(successObj.status).send(successObj);
        } else {
            res.status(401).json({ message: validatedData.errors });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteMedia = async (req, res) => {
    try {
        const media = await Media.findByIdAndDelete(req.params.id);
        if (!media) {
            return res.status(404).json({ message: 'Media entry not found' });
        }
        res.json({ message: 'Media entry deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
