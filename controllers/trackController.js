
const TrackExhibitor = require('../models/TrackExhibitor');
const TrackVisitor = require('../models/TrackVisitor');
const { successResponse, successResponseWithRecordCount } = require('../utils/sendResponse');

exports.createTrackVisitor = async (req, res) => {
    try {
        const trackDetails = await TrackVisitor.create(req.body);
        const successObj = successResponse('Visitor Track Created', trackDetails)
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.createTrackExhibitor = async (req, res) => {
    try {
        const trackDetails = await TrackExhibitor.create(req.body);
        const successObj = successResponse('Visitor Track Created', trackDetails)
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getTrackVisitor = async (req, res) => {
    try {
        // Extract limit and offset from query parameters
        // const { limit = 10, offset = 0 } = req.query;

        const visitedStalls = await TrackVisitor.find({})
            .populate({
                path: 'visitor',
                select: 'name companyName email phone' // Select only the fields you need
            })
            // .skip(Number(offset)) // Skip the specified number of documents
            // .limit(Number(limit)) // Limit the number of documents returned
            .sort({ createdAt: -1 })
            .exec();
        const totalCount = await TrackVisitor.countDocuments();
        // const totalPages = Math.ceil(totalCount / limit);
        // const currentPage = Math.ceil(offset / limit) + 1;
        const successObj = successResponseWithRecordCount('Track Visitor List', visitedStalls, totalCount);
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


