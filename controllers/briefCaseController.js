// controllers/stallController.js
const Briefcase = require('../models/Briefcase');
const { successResponse, notFoundResponse } = require('../utils/sendResponse');

exports.createBriefCase = async (req, res) => {
    try {
        const { stall, visitor, exhibitor, product } = req.body;

        // Check if the combination already exists
        const existingData = await Briefcase.findOne({ stall, visitor, exhibitor, product });

        if (existingData) {
            const successObj = successResponse('Already Added', []);
            return res.status(successObj.status).send(successObj);
        }

        // If not, create new data
        const BriefcaseData = await Briefcase.create(req.body);
        const successObj = successResponse('Stall Created', BriefcaseData);
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


exports.getAllBriefcaseForVisitor = async (req, res) => {
    try {
        const Briefcases = await Briefcase.find({ visitor: req.params.visitorId })
            .populate({
                path: 'exhibitor',
                select: 'name companyName email phone'
            })
            .populate({
                path: 'stall',
                select: 'stallName'
            })
            .populate({
                path: 'product',
                select: 'title url locked like review active deleted' // Adjust fields as needed
            })
            .exec();
        if (!Briefcases || Briefcases.length === 0) {
            const notFoundObj = notFoundResponse('No Briefcase data for this visitor');
            return res.status(notFoundObj.status).send(notFoundObj);
        }

        const stallList = Briefcases.map(stall => ({
            exhibitor: stall.exhibitor.name,
            companyName: stall.exhibitor.companyName,
            exhibitorEmail: stall.exhibitor.email,
            exhibitorPhone: stall.exhibitor.phone,
            stallName: stall.stall.stallName,
            productName: stall.product.title,
            productUrl: stall.product.url,
            productLocked: stall.product.locked,
            productLike: stall.product.like,
            productReview: stall.product.review,
            productActive: stall.product.active,
            productDeleted: stall.product.deleted,
            catalog: stall.catalog,
            id: stall._id,
            updatedAt: stall.updatedAt
        }));
        const successObj = successResponse('Visited Stall List', stallList);
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAllBriefcaseForExhibitor = async (req, res) => {
    try {
        const Briefcases = await Briefcase.find({ exhibitor: req.params.exhibitorId, catalog: true })
            .populate({
                path: 'visitor',
                select: 'name companyName email phone',
                options: { strictPopulate: false }
            })
            .populate({
                path: 'stall',
                select: 'stallName',
                options: { strictPopulate: false }
            })
            .populate({
                path: 'product',
                select: 'title url locked like review active deleted', // Adjust fields as needed
                options: { strictPopulate: false }
            })
            .exec();
        if (!Briefcases || Briefcases.length === 0) {
            const notFoundObj = notFoundResponse('No Briefcase data for this visitor');
            return res.status(notFoundObj.status).send(notFoundObj);
        }

        // Filter out entries where the visitor is null (due to deletion)
        const filteredStalls = Briefcases.filter(stall => stall.visitor !== null);

        const stallList = filteredStalls.map(stall => ({
            visitor: stall.visitor.name,
            companyName: stall.visitor.companyName,
            visitorEmail: stall.visitor.email,
            visitorPhone: stall.visitor.phone,
            stallName: stall.stall.stallName,
            productName: stall.product.title,
            productUrl: stall.product.url,
            productLocked: stall.product.locked,
            productLike: stall.product.like,
            productReview: stall.product.review,
            productActive: stall.product.active,
            productDeleted: stall.product.deleted,
            catalog: stall.catalog,
            id: stall._id,
            updatedAt: stall.updatedAt
        }));
        const successObj = successResponse('Visited Stall List', stallList);
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAllBriefcaseAdmin = async (req, res) => {
    try {
        const Briefcases = await Briefcase.find({ catalog: true })
            .populate({
                path: 'visitor',
                select: 'name companyName email phone'
            })
            .populate({
                path: 'exhibitor',
                select: 'name companyName email phone'
            })
            .populate({
                path: 'stall',
                select: 'stallName'
            })
            .populate({
                path: 'product',
                select: 'title url locked like review active deleted' // Adjust fields as needed
            })
            .exec();
        if (!Briefcases || Briefcases.length === 0) {
            const notFoundObj = notFoundResponse('No Briefcase data for this visitor');
            return res.status(notFoundObj.status).send(notFoundObj);
        }

        const stallList = Briefcases.map(stall => ({
            visitor: stall.visitor.name,
            visitorCompanyName: stall.visitor.companyName,
            visitorEmail: stall.visitor.email,
            visitorPhone: stall.visitor.phone,
            exhibitor: stall.exhibitor.name,
            exhibitorCompanyName: stall.exhibitor.companyName,
            exhibitorEmail: stall.exhibitor.email,
            exhibitorPhone: stall.exhibitor.phone,
            stallName: stall.stall.stallName,
            productName: stall.product.title,
            productUrl: stall.product.url,
            productLocked: stall.product.locked,
            productLike: stall.product.like,
            productReview: stall.product.review,
            productActive: stall.product.active,
            productDeleted: stall.product.deleted,
            catalog: stall.catalog,
            id: stall._id,
            updatedAt: stall.updatedAt
        }));
        const successObj = successResponse('Visited Stall List', stallList);
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateBriefcase = async (req, res) => {
    try {
        const briefCase = await Briefcase.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!briefCase) {
            return res.status(404).json({ message: 'BriefCase entry not found' });
        }
        const successObj = successResponse('briefCase updated', briefCase)
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

