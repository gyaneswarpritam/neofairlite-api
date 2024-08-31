// controllers/FlashMessageController.js
const FlashMessage = require('../models/FlashMessage');
const flashMessageSchema = require('../validators/flashMessageValidator');
const schemaValidator = require('../validators/schemaValidator');
const { successResponse } = require('../utils/sendResponse');

exports.createFlashMessage = async (req, res) => {
    try {
        const validatedData = schemaValidator(flashMessageSchema, req.body);
        if (validatedData.success) {
            const flashMessage = await FlashMessage.create(validatedData.data);
            const successObj = successResponse('FlashMessage Created', flashMessage)
            res.status(successObj.status).send(successObj);
        } else {
            res.status(401).json({ message: validatedData.errors });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllFlashMessage = async (req, res) => {
    try {
        const flashMessage = await FlashMessage.find({});
        if (!flashMessage) {
            return res.status(404).json({ message: 'FlashMessage not found' });
        }
        const successObj = successResponse('FlashMessage List', flashMessage)
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getFlashMessageById = async (req, res) => {
    try {
        const flashMessage = await FlashMessage.findById(req.params.id);
        if (!flashMessage) {
            return res.status(404).json({ message: 'FlashMessage entry not found' });
        }
        const successObj = successResponse('FlashMessage Details', flashMessage)
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateFlashMessage = async (req, res) => {
    try {
        const validatedData = schemaValidator(flashMessageSchema, req.body);
        if (validatedData.success) {
            const flashMessage = await FlashMessage.findByIdAndUpdate(req.params.id, validatedData.data, { new: true });
            if (!flashMessage) {
                return res.status(404).json({ message: 'FlashMessage entry not found' });
            }
            const successObj = successResponse('FlashMessage updated', flashMessage)
            res.status(successObj.status).send(successObj);
        } else {
            res.status(401).json({ message: validatedData.errors });
        };
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteFlashMessage = async (req, res) => {
    try {
        const flashMessage = await FlashMessage.findByIdAndDelete(req.params.id);
        if (!flashMessage) {
            return res.status(404).json({ message: 'FlashMessage entry not found' });
        }
        res.json({ message: 'FlashMessage entry deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
