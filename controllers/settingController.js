const Setting = require('../models/Setting');
const { successResponse } = require('../utils/sendResponse');
const settingSchema = require('../validators/settingValidator');
const schemaValidator = require('../validators/schemaValidator');
const slots = require('../models/slots');
const moment = require('moment-timezone'); // Import moment-timezone

exports.createSetting = async (req, res) => {
    try {
        const validatedData = schemaValidator(settingSchema, req.body);
        if (validatedData.success) {
            const { startDateTime, endDateTime, timezone } = validatedData.data;

            // Convert startDateTime and endDateTime from the provided timezone to UTC
            const startUTC = moment.tz(startDateTime, timezone).utc().toDate();
            const endUTC = moment.tz(endDateTime, timezone).utc().toDate();

            // Generate an array of dates from startUTC to endUTC (inclusive), handling DST shifts
            const currentDate = moment.tz(startDateTime, timezone);
            const endDate = moment.tz(endDateTime, timezone);

            const dateList = [];
            while (currentDate.isSameOrBefore(endDate, 'day')) {
                // Clone the current date for both start and end times, and handle DST
                const dayStart = moment.tz(currentDate, timezone).toDate(); // Start time in original timezone
                const dayEnd = moment.tz(currentDate, timezone).set({
                    hour: moment(endDateTime).get('hour'),
                    minute: moment(endDateTime).get('minute'),
                    second: moment(endDateTime).get('second'),
                    millisecond: moment(endDateTime).get('millisecond'),
                }).toDate(); // End time for the same day in original timezone

                // Convert both start and end times to UTC before storing
                dateList.push({
                    startTime: moment(dayStart).utc().toDate(),
                    endTime: moment(dayEnd).utc().toDate(),
                });

                currentDate.add(1, 'day'); // Move to the next day
            }

            // Save the generated dateList along with the start and end UTC dates
            validatedData.data.startDateTime = startUTC;
            validatedData.data.endDateTime = endUTC;
            validatedData.data.dateList = dateList;

            await slots.deleteMany({});
            const setting = await Setting.create(validatedData.data);
            const successObj = successResponse('Setting Created', setting);
            res.status(successObj.status).send(successObj);
        } else {
            res.status(401).json({ message: validatedData.errors });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateSetting = async (req, res) => {
    try {
        const { startDateTime, endDateTime, timezone } = req.body;

        if (startDateTime && endDateTime && timezone) {
            // Convert startDateTime and endDateTime from the provided timezone to UTC
            const startUTC = moment.tz(startDateTime, timezone).utc().toDate();
            const endUTC = moment.tz(endDateTime, timezone).utc().toDate();

            // Generate an array of dates from startUTC to endUTC (inclusive), handling DST shifts
            const currentDate = moment.tz(startDateTime, timezone);
            const endDate = moment.tz(endDateTime, timezone);

            const dateList = [];
            while (currentDate.isSameOrBefore(endDate, 'day')) {
                // Clone the current date for both start and end times, and handle DST
                const dayStart = moment.tz(currentDate, timezone).toDate(); // Start time in original timezone
                const dayEnd = moment.tz(currentDate, timezone).set({
                    hour: moment(endDateTime).get('hour'),
                    minute: moment(endDateTime).get('minute'),
                    second: moment(endDateTime).get('second'),
                    millisecond: moment(endDateTime).get('millisecond'),
                }).toDate(); // End time for the same day in original timezone

                // Convert both start and end times to UTC before storing
                dateList.push({
                    startTime: moment(dayStart).utc().toDate(),
                    endTime: moment(dayEnd).utc().toDate(),
                });

                currentDate.add(1, 'day'); // Move to the next day
            }

            // Update the request body with the new dateList and UTC dates
            req.body.startDateTime = startUTC;
            req.body.endDateTime = endUTC;
            req.body.dateList = dateList;
        }

        // Update the setting with the modified UTC dates and other data
        const setting = await Setting.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!setting) {
            return res.status(404).json({ message: 'Setting not found' });
        }

        // If dates or timezone were updated, delete the slots
        if (startDateTime || endDateTime || timezone) {
            await slots.deleteMany({});
        }

        res.status(200).json({ data: setting, message: 'Setting updated successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getStartEndTime = async (req, res) => {
    try {
        const { dateParam } = req.params; // Expecting a date in string format, e.g., '2024-10-17'

        // Fetch the first setting document (assuming you want the first one from the collection)
        const setting = await Setting.findOne().sort({ _id: 1 }); // Retrieves the first document
        if (!setting) {
            return res.status(404).json({ message: 'No settings found' });
        }

        // Check if there is a dateList and if it has at least one entry
        if (!setting.dateList || setting.dateList.length === 0) {
            return res.status(404).json({ message: 'dateList is empty' });
        }

        // Parse the dateParam into a moment date object (assuming the dateParam is in YYYY-MM-DD format)
        const targetDate = moment(dateParam, "YYYY-MM-DD");

        // Access the first index in the dateList
        const firstDateEntry = setting.dateList[0];

        // Check if the startTime in the first index matches the targetDate (ignoring time part)
        const startTime = moment(firstDateEntry.startTime).startOf('day');

        if (startTime.isSame(targetDate, 'day')) {
            // Return the startTime and endTime for the first date in the array
            res.status(200).json({
                startTime: firstDateEntry.startTime,
                endTime: firstDateEntry.endTime,
                message: 'Date found in first index',
            });
        } else {
            res.status(404).json({ message: 'No matching date found in the first index of dateList' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};



// exports.createSetting = async (req, res) => {
//     try {
//         const validatedData = schemaValidator(settingSchema, req.body);
//         if (validatedData.success) {
//             const { startDateTime, endDateTime, timezone } = validatedData.data;

//             // Convert startDateTime and endDateTime from the provided timezone to UTC
//             const startUTC = moment.tz(startDateTime, timezone).utc().toDate();
//             const endUTC = moment.tz(endDateTime, timezone).utc().toDate();

//             // Update the validated data with the UTC dates
//             validatedData.data.startDateTime = startUTC;
//             validatedData.data.endDateTime = endUTC;

//             await slots.deleteMany({});
//             const setting = await Setting.create(validatedData.data);
//             const successObj = successResponse('Setting Created', setting)
//             res.status(successObj.status).send(successObj);
//         } else {
//             res.status(401).json({ message: validatedData.errors });
//         }
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

// exports.updateSetting = async (req, res) => {
//     try {
//         const { startDateTime, endDateTime, timezone } = req.body;
//         if (startDateTime || endDateTime || timezone) {
//             // Convert startDateTime and endDateTime from the provided timezone to UTC
//             const startUTC = moment.tz(startDateTime, timezone).utc().toDate();
//             const endUTC = moment.tz(endDateTime, timezone).utc().toDate();

//             // Update the request body with the UTC dates
//             req.body.startDateTime = startUTC;
//             req.body.endDateTime = endUTC;
//         }
//         const setting = await Setting.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         if (!setting) {
//             return res.status(404).json({ message: 'Setting not found' });
//         }
//         if (startDateTime || endDateTime || timezone) {
//             await slots.deleteMany({});
//         }

//         res.status(200).json({ data: setting, message: 'Setting updated successfully' });
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };


// exports.createSetting = async (req, res) => {
//     try {
//         const validatedData = schemaValidator(settingSchema, req.body);
//         if (validatedData.success) {
//             const setting = await Setting.create(validatedData.data);
//             const successObj = successResponse('Setting Created', setting)
//             res.status(successObj.status).send(successObj);
//         } else {
//             res.status(401).json({ message: validatedData.errors });
//         }
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

// exports.updateSetting = async (req, res) => {
//     try {
//         // const validatedData = schemaValidator(settingSchema, req.body);
//         // if (validatedData.success) {
//         const setting = await Setting.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         if (!setting) {
//             return res.status(404).json({ message: 'Setting not found' });
//         }

//         // Respond with success message
//         res.status(200).json({ data: setting, message: 'Setting updated successfully' });
//         // } else {
//         //     res.status(401).json({ message: validatedData.errors });
//         // }
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

exports.getAllSettings = async (req, res) => {
    try {
        const settings = await Setting.find({});
        if (!settings || settings.length === 0) {
            return res.status(404).json({ message: 'Settings not found' });
        }

        // Convert startDateTime and endDateTime to the specified timezone for each setting
        const convertedSettings = settings.map(setting => {
            const timezone = setting.timezone;
            return {
                ...setting.toObject(), // Convert the Mongoose document to a plain JavaScript object
                startDateTime: moment(setting.startDateTime).tz(timezone).format(), // Format it to desired timezone
                endDateTime: moment(setting.endDateTime).tz(timezone).format(),     // Format it to desired timezone
            };
        });

        const successObj = successResponse('Setting List', convertedSettings);
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getSettingById = async (req, res) => {
    try {
        const setting = await Setting.findById(req.params.id);
        if (!setting) {
            return res.status(404).json({ message: 'Setting not found' });
        }

        // Convert startDateTime and endDateTime to the specified timezone
        const timezone = setting.timezone;
        const convertedSetting = {
            ...setting.toObject(), // Convert the Mongoose document to a plain JavaScript object
            startDateTime: moment(setting.startDateTime).tz(timezone).format(), // Format to the specified timezone
            endDateTime: moment(setting.endDateTime).tz(timezone).format(),     // Format to the specified timezone
        };

        const successObj = successResponse('Setting Details', convertedSetting);
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteSetting = async (req, res) => {
    try {
        const setting = await Setting.findByIdAndDelete(req.params.id);
        if (!setting) {
            return res.status(404).json({ message: 'Setting not found' });
        }
        res.json({ message: 'Setting deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
