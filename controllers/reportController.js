const { successResponse, notFoundResponse } = require('../utils/sendResponse');
const Visitor = require('../models/Visitor');
const Exhibitor = require('../models/Exhibitor');
const VisitedStall = require('../models/VisitedStall');

exports.visitorReport = async (req, res) => {
    try {
        const visitor = await Visitor.find({})

        if (!visitor) {
            return res.status(404).json({ message: 'Visitor entry not found' });
        }

        const successObj = successResponse('Visitor List', visitor);
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.exhibitorReport = async (req, res) => {
    try {
        const exhibitors = await Exhibitor.find({});

        if (!exhibitors || exhibitors.length === 0) {
            const notFound = notFoundResponse('Exhibitor entries not found');
            res.status(notFound.status).send(notFound);
            return;
        }

        const successObj = successResponse('Exhibitor List', exhibitors);
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllVisitedStall = async (req, res) => {
    try {
        const visitedStalls = await VisitedStall.find()
            .populate({
                path: 'exhibitor',
                select: 'name companyName email phone', // Select only the fields you need
                options: { strictPopulate: false }
            })
            .populate({
                path: 'visitor',
                select: 'name companyName email phone', // Select only the fields you need
                options: { strictPopulate: false }
            })
            .populate({
                path: 'stall',
                select: 'stallName', // Select only the fields you need
                options: { strictPopulate: false }
            })
            .exec();
        if (!visitedStalls || visitedStalls.length === 0) {
            const successObj = successResponse('No visited stalls found for this visitor', []);
            return res.status(successObj.status).send(successObj);
        }

        // Map the visited stalls to extract required information
        const stallList = visitedStalls.map(stall => ({
            exhibitor: stall.exhibitor?.name || null,
            exhibitorCompanyName: stall.exhibitor?.companyName || null,
            exhibitorEmail: stall.exhibitor?.email || null,
            exhibitorPhone: stall.exhibitor?.phone || null,
            visitor: stall.visitor?.name || null,
            visitorCompanyName: stall.visitor?.companyName || null,
            visitorEmail: stall.visitor?.email || null,
            visitorPhone: stall.visitor?.phone || null,
            stallName: stall.stall?.stallName || null,
            updatedAt: stall.updatedAt
        }));

        const successObj = successResponse('Visited Stall List', stallList);
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



