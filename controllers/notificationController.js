
const ExhibitorNotification = require('../models/ExhibitorNotification');
const VisitorNotification = require('../models/VisitorNotification');
const { successResponse, successResponseWithRecordCount } = require('../utils/sendResponse');

exports.createVisitorNotification = async (req, res) => {
    try {
        const notificationDetails = await VisitorNotification.create(req.body);
        const successObj = successResponse('Visitor Notification Created', notificationDetails)
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.createExhibitorNotification = async (req, res) => {
    try {
        const notificationDetails = await ExhibitorNotification.create(req.body);
        const successObj = successResponse('Exhibitor Notification Created', notificationDetails)
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getVisitorNotification = async (req, res) => {
    try {
        const visitorNotify = await VisitorNotification.find({ visitor: req.params.visitorId, unread: false })
            .populate({
                path: 'exhibitor',
                select: 'name companyName email phone' // Select only the fields you need
            })
            .sort({ createdAt: -1 })
            .exec();
        const totalCount = await VisitorNotification.countDocuments();
        const successObj = successResponseWithRecordCount('Visitor Notification List', visitorNotify, totalCount);
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getExhibitorNotification = async (req, res) => {
    try {
        const exhibitorNotify = await ExhibitorNotification.find({ exhibitor: req.params.exhibitorId, unread: false })
            .populate({
                path: 'visitor',
                select: 'name companyName email phone'
            })
            .sort({ createdAt: -1 })
            .exec();
        const totalCount = await ExhibitorNotification.countDocuments();
        const successObj = successResponseWithRecordCount('Exhibitor Notification List', exhibitorNotify, totalCount);
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


