// controllers/galleryController.js
const Gallery = require('../models/Gallery');
const { successResponse } = require('../utils/sendResponse');
const gallerySchema = require('../validators/galleryValidator');
const schemaValidator = require('../validators/schemaValidator');

exports.createGallery = async (req, res) => {
    try {
        const validatedData = schemaValidator(gallerySchema, req.body);
        if (validatedData.success) {
            const gallery = await Gallery.create(validatedData.data);
            const successObj = successResponse('Gallery Created', gallery)
            res.status(successObj.status).send(successObj);
        } else {
            res.status(401).json({ message: validatedData.errors });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getGalleryById = async (req, res) => {
    try {
        const gallery = await Gallery.findById(req.params.id);
        if (!gallery) {
            return res.status(404).json({ message: 'Gallery entry not found' });
        }
        const successObj = successResponse('Gallery List', gallery)
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateGallery = async (req, res) => {
    try {
        const validatedData = schemaValidator(gallerySchema, req.body);
        if (validatedData.success) {
            const gallery = await Gallery.findByIdAndUpdate(req.params.id, validatedData.data, { new: true });
            if (!gallery) {
                return res.status(404).json({ message: 'Gallery entry not found' });
            }
            const successObj = successResponse('Gallery updated', gallery)
            res.status(successObj.status).send(successObj);
        } else {
            res.status(401).json({ message: validatedData.errors });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteGallery = async (req, res) => {
    try {
        const gallery = await Gallery.findByIdAndDelete(req.params.id);
        if (!gallery) {
            return res.status(404).json({ message: 'Gallery entry not found' });
        }
        res.json({ message: 'Gallery entry deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
