// controllers/instantMeetingController.js
const InstantMeeting = require('../models/InstantMeeting');
const { successResponse } = require('../utils/sendResponse');

exports.createInstantMeeting = async (req, res) => {
    try {
        const { visitor, stallId, exhibitor } = req.body;

        // Check if an instant meeting exists with the provided combination
        let instantMeeting = await InstantMeeting.findOne({ visitor, stallId, exhibitor });

        if (instantMeeting) {
            // If it exists, update the existing instant meeting
            const updatedMeeting = await InstantMeeting.findByIdAndUpdate(instantMeeting._id, req.body, { new: true });
            const successObj = successResponse('InstantMeeting Updated', updatedMeeting);
            res.status(successObj.status).send(successObj);
        } else {
            // If it doesn't exist, create a new instant meeting
            instantMeeting = await InstantMeeting.create(req.body);
            const successObj = successResponse('InstantMeeting Created', instantMeeting);
            res.status(successObj.status).send(successObj);
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


exports.getAllInstantMeeting = async (req, res) => {
    try {
        const instantMeeting = await InstantMeeting.find({});
        if (!instantMeeting) {
            return res.status(404).json({ message: 'InstantMeeting not found' });
        }
        const successObj = successResponse('InstantMeeting List', instantMeeting)
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getInstantMeetingById = async (req, res) => {
    try {
        const instantMeeting = await InstantMeeting.find({ _id: req.params.id, approve: true, cancelled: false });
        if (!instantMeeting) {
            return res.status(404).json({ message: 'InstantMeeting not found' });
        }
        const successObj = successResponse('InstantMeeting Details', instantMeeting)
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getInstantMeetingByVisitorId = async (req, res) => {
    try {
        const instantMeeting = await InstantMeeting.find({
            visitor: req.params.visitorId,
            stallId: req.params.stallId,
        });
        if (!instantMeeting) {
            return res.status(404).json({ message: 'InstantMeeting not found' });
        }
        const successObj = successResponse('InstantMeeting Details', instantMeeting)
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getInstantMeetingByExhibitorId = async (req, res) => {
    try {
        const instantMeeting = await InstantMeeting.find({
            exhibitor: req.params.exhibitorId,
            approve: false,
            cancelled: false,
            rejected: false,
            completed: false
        });
        if (!instantMeeting) {
            return res.status(404).json({ message: 'InstantMeeting not found' });
        }
        const successObj = successResponse('InstantMeeting Details', instantMeeting)
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateInstantMeeting = async (req, res) => {
    try {

        const instantMeeting = await InstantMeeting.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!instantMeeting) {
            return res.status(404).json({ message: 'instantMeeting not found' });
        }
        const successObj = successResponse('instantMeeting updated', instantMeeting)
        res.status(successObj.status).send(successObj);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

