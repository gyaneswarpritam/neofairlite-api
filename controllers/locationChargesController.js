// controllers/settingController.js
const LocationCharges = require('../models/LocationCharges');
const { successResponse } = require('../utils/sendResponse');
const locationChargesSchema = require('../validators/locationChargesValidator');
const schemaValidator = require('../validators/schemaValidator');

exports.createLocationCharges = async (req, res) => {
    try {
        const validatedData = schemaValidator(locationChargesSchema, req.body);
        if (validatedData.success) {
            const locationCharges = await LocationCharges.create(validatedData.data);
            const successObj = successResponse('Location Charges Created', locationCharges)
            res.status(successObj.status).send(successObj);
        } else {
            res.status(401).json({ message: validatedData.errors });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllLocationCharges = async (req, res) => {
    try {
        const settings = await LocationCharges.find({});
        if (!settings) {
            return res.status(404).json({ message: 'Location Charges not found' });
        }
        const successObj = successResponse('Location Charges List', settings)
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getLocationChargesById = async (req, res) => {
    try {
        const locationCharges = await LocationCharges.findById(req.params.id);
        if (!locationCharges) {
            return res.status(404).json({ message: 'Location Charges not found' });
        }
        res.json(locationCharges);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateLocationCharges = async (req, res) => {
    try {
        // const validatedData = schemaValidator(locationChargesSchema, req.body);
        // if (validatedData.success) {
        const locationCharges = await LocationCharges.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!locationCharges) {
            return res.status(404).json({ message: 'LocationCharges not found' });
        }

        // Respond with success message
        res.status(200).json({ data: locationCharges, message: 'LocationCharges updated successfully' });
        // } else {
        //     res.status(401).json({ message: validatedData.errors });
        // }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteLocationCharges = async (req, res) => {
    try {
        const locationCharges = await LocationCharges.findByIdAndDelete(req.params.id);
        if (!locationCharges) {
            return res.status(404).json({ message: 'Location Charges not found' });
        }
        res.json({ message: 'Location Charges deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
