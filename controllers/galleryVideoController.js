const GalleryVideoList = require('../models/GalleryVideoList'); // Adjust the import to the correct model
const { successResponse } = require('../utils/sendResponse');
const gallerySchema = require('../validators/galleryValidator'); // Use appropriate schema
const schemaValidator = require('../validators/schemaValidator');

exports.createGalleryVideo = async (req, res) => {
    try {
        const validatedData = schemaValidator(gallerySchema, req.body);
        if (validatedData.success) {
            const galleryVideo = await GalleryVideoList.create(validatedData.data);
            const successObj = successResponse('Gallery Video Created', galleryVideo);
            res.status(successObj.status).send(successObj);
        } else {
            res.status(401).json({ message: validatedData.errors });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getGalleryVideoById = async (req, res) => {
    try {
        const galleryVideo = await GalleryVideoList.findById(req.params.id).populate('stall');
        if (!galleryVideo) {
            return res.status(404).json({ message: 'Gallery video entry not found' });
        }
        const successObj = successResponse('Gallery Video', galleryVideo);
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateGalleryVideo = async (req, res) => {
    try {
        const validatedData = schemaValidator(gallerySchema, req.body);
        if (validatedData.success) {
            const galleryVideo = await GalleryVideoList.findByIdAndUpdate(req.params.id, validatedData.data, { new: true });
            if (!galleryVideo) {
                return res.status(404).json({ message: 'Gallery video entry not found' });
            }
            const successObj = successResponse('Gallery Video updated', galleryVideo);
            res.status(successObj.status).send(successObj);
        } else {
            res.status(401).json({ message: validatedData.errors });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteGalleryVideo = async (req, res) => {
    try {
        const galleryVideo = await GalleryVideoList.findByIdAndDelete(req.params.id);
        if (!galleryVideo) {
            return res.status(404).json({ message: 'Gallery video entry not found' });
        }
        const successObj = successResponse('Gallery video entry deleted', galleryVideo);
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
