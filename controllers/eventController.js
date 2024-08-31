// controllers/eventController.js
const Event = require('../models/Event');
const { convertToUTC } = require('../utils/dateService');
const { successResponse } = require('../utils/sendResponse');
const eventSchema = require('../validators/eventValidator');
const schemaValidator = require('../validators/schemaValidator');

exports.createEvent = async (req, res) => {
    try {
        const event = req.body;
        event.startDateTime = convertToUTC(event.startDateTime);
        event.endDateTime = convertToUTC(event.endDateTime);

        const validatedData = schemaValidator(eventSchema, event);
        if (validatedData.success) {
            const event = await Event.create(validatedData.data);
            const successObj = successResponse('Event Created', event)
            res.status(successObj.status).send(successObj);
        } else {
            res.status(401).json({ message: validatedData.errors });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllEvent = async (req, res) => {
    try {
        const event = await Event.find({});
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        const successObj = successResponse('Event List', event)
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const validatedData = schemaValidator(eventSchema, req.body);
        if (validatedData.success) {
            const event = await Event.findByIdAndUpdate(req.params.id, validatedData.data, { new: true });
            if (!event) {
                return res.status(404).json({ message: 'Event not found' });
            }
            const successObj = successResponse('Event updated', event)
            res.status(successObj.status).send(successObj);
        } else {
            res.status(401).json({ message: validatedData.errors });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json({ message: 'Event deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
