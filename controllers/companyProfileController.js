// controllers/companyProfileController.js
const CompanyProfileList = require('../models/CompanyProfileList');
const { successResponse } = require('../utils/sendResponse');
const companyProfileSchema = require('../validators/companyProfileValidator');
const schemaValidator = require('../validators/schemaValidator');

exports.createCompanyProfile = async (req, res) => {
    try {
        const validatedData = schemaValidator(companyProfileSchema, req.body);
        if (validatedData.success) {
            const companyProfile = await CompanyProfileList.create(validatedData.data);
            const successObj = successResponse('Company Profile Created', companyProfile)
            res.status(successObj.status).send(successObj);
        } else {
            res.status(401).json({ message: validatedData.errors });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getCompanyProfileById = async (req, res) => {
    try {
        const companyProfile = await CompanyProfileList.findById(req.params.id);
        if (!companyProfile) {
            return res.status(404).json({ message: 'Company profile not found' });
        }
        const successObj = successResponse('CompanyProfile List', companyProfile)
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateCompanyProfile = async (req, res) => {
    try {
        // const validatedData = schemaValidator(companyProfileSchema, req.body);
        // if (validatedData.success) {
        const companyProfile = await CompanyProfileList.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!companyProfile) {
            return res.status(404).json({ message: 'Company profile not found' });
        }
        const successObj = successResponse('Company profile updated', companyProfile)
        res.status(successObj.status).send(successObj);
        // } else {
        //     res.status(401).json({ message: validatedData.errors });
        // }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteCompanyProfile = async (req, res) => {
    try {
        const companyProfile = await CompanyProfileList.findByIdAndDelete(req.params.id);
        if (!companyProfile) {
            return res.status(404).json({ message: 'Company profile not found' });
        }
        const successObj = successResponse('Company profile deleted', companyProfile)
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
