const moment = require("moment");
const momentTimeZone = require("moment-timezone");
const { EXB_DURATION_IN_MINUTES_PER_SLOT, EXB_END_TIME_IN_UTC, EXB_FROM_IN_UTC, EXB_START_TIME_IN_UTC, EXB_TIME_ZONE, EXB_TO_IN_UTC } = require("../constants.js");
const Slots = require("../models/slots.js");
const Visitor = require("../models/Visitor.js");
const Exhibitor = require("../models/Exhibitor.js");
const Setting = require("../models/Setting.js");
const { successResponse } = require("../utils/sendResponse.js");
const Booking = require("../models/Booking.js");
const mongoose = require("mongoose");

const generateSlotsForDate = (selectedDate, startTime, endTime, duration, timeZone) => {
  const slots = [];

  // Create start time for the day based on the input time zone
  const startOfDay = moment.tz(selectedDate, timeZone).set({
    hour: startTime.hour(),
    minute: startTime.minute(),
    second: 0,
    millisecond: 0
  });

  // Create end time for the day, initially in the same day
  let endOfDay = moment.tz(selectedDate, timeZone).set({
    hour: endTime.hour(),
    minute: endTime.minute(),
    second: 0,
    millisecond: 0
  });

  // If end time is earlier than start time, move endOfDay to the next day
  if (endOfDay.isBefore(startOfDay)) {
    endOfDay.add(1, 'day');
  }

  console.log(startOfDay, `#########`, endOfDay);
  let currentTime = startOfDay.clone();

  // Loop to generate slots
  while (currentTime.isBefore(endOfDay) || currentTime.isSame(endOfDay)) {
    const slotEnd = currentTime.clone().add(duration, 'minutes');

    // Add slot only if the slot end time is within the range
    if (slotEnd.isSame(endOfDay) || slotEnd.isBefore(endOfDay)) {
      const slotDate = currentTime.clone().tz(timeZone).format('YYYY-MM-DD'); // Store the local date
      slots.push({
        slotStartTimeInLocal: currentTime.format('HH:mm'),
        slotTiming: `${currentTime.format('HH:mm')} - ${slotEnd.format('HH:mm')}`,
        status: 'available',
        time: currentTime.toISOString(), // Store the complete date and time in ISO format
        slotDate, // Store the date in local time format
        durationInMinutes: duration
      });
    }

    // Move to the next slot based on the duration
    currentTime.add(duration, 'minutes');
  }

  return slots;
};
exports.listSlots = async (req, res) => {
  try {
    const { timeZone, id, date, startDate, endDate, duration, visitorId } = req.query;

    // Validate required parameters
    if (!timeZone || !id || !date || !startDate || !endDate || !duration || !visitorId) {
      return res.status(400).json({ success: false, message: 'Missing required query parameters' });
    }

    const slotDuration = parseInt(duration, 10);

    // Convert startDate and endDate from UTC to the target timezone
    const startDateInTimezone = moment.tz(startDate, 'UTC').tz(timeZone);
    const endDateInTimezone = moment.tz(endDate, 'UTC').tz(timeZone);

    // Extract the start and end times from the provided dates
    const startTime = startDateInTimezone.clone();
    const endTime = endDateInTimezone.clone();

    // Log start and end times for debugging
    console.log(`Start Time: ${startTime.format()}, End Time: ${endTime.format()}`);

    // Check the date for which slots are being generated
    const selectedDateMoment = moment.tz(date, timeZone);
    console.log(`Selected Date: ${selectedDateMoment.format()}`);

    // Generate slots for the selected date using dynamic start and end times
    let slots = generateSlotsForDate(selectedDateMoment, startTime, endTime, slotDuration, timeZone);

    // Check existing bookings for conflicts (Assuming `Booking` is a model)
    const existingBookings = await Booking.find({
      exhibitorId: id,
      slotTime: {
        $gte: startDateInTimezone.toDate(),
        $lt: endDateInTimezone.toDate()
      }
    });

    // Log existing bookings for debugging
    console.log(`Existing Bookings: ${JSON.stringify(existingBookings)}`);

    // Mark booked slots based on existing bookings
    slots = slots.map(slot => {
      const existingBooking = existingBookings.find(booking => moment(booking.slotTime).isSame(slot.time));

      // Determine status based on existing bookings
      if (existingBooking) {
        if (existingBooking.visitorId.toString() === visitorId && existingBooking.status === 'pending') {
          return {
            ...slot,
            visitorId: existingBooking.visitorId, // Include visitorId
            status: 'pending' // If this booking belongs to the visitor and is pending
          };
        }
        else if (existingBooking.visitorId.toString() === visitorId && existingBooking.status === 'rejected') {
          return {
            ...slot,
            visitorId: existingBooking.visitorId, // Include visitorId
            status: 'rejected' // If this booking belongs to the visitor and is pending
          };
        }
        return {
          ...slot,
          visitorId: existingBooking.visitorId, // Include visitorId
          status: 'booked' // If the booking is booked by someone else
        };
      }
      return {
        ...slot,
        visitorId: null, // Slot is available, no visitor booked
        status: 'available' // Slot is available
      };
    });

    res.json({ success: true, data: { slots } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// exports.listSlots = async (req, res) => {
//   try {
//     const { timeZone, id, date, startDate, endDate, duration, visitorId } = req.query;

//     // Validate required parameters
//     if (!timeZone || !id || !date || !startDate || !endDate || !duration || !visitorId) {
//       return res.status(400).json({ success: false, message: 'Missing required query parameters' });
//     }

//     const slotDuration = parseInt(duration, 10);

//     // Convert startDate and endDate from UTC to the target timezone
//     const startDateInTimezone = moment.tz(startDate, 'UTC').tz(timeZone);
//     const endDateInTimezone = moment.tz(endDate, 'UTC').tz(timeZone);

//     // Extract the start and end times from the provided dates
//     const startTime = startDateInTimezone.clone();
//     const endTime = endDateInTimezone.clone();

//     // Log start and end times for debugging
//     console.log(`Start Time: ${startTime.format()}, End Time: ${endTime.format()}`);

//     // Check the date for which slots are being generated
//     const selectedDateMoment = moment.tz(date, timeZone);
//     console.log(`Selected Date: ${selectedDateMoment.format()}`);

//     // Generate slots for the selected date using dynamic start and end times
//     let slots = generateSlotsForDate(selectedDateMoment, startTime, endTime, slotDuration, timeZone);

//     // Check existing bookings for conflicts (Assuming `Booking` is a model)
//     const existingBookings = await Booking.find({
//       exhibitorId: id,
//       slotTime: {
//         $gte: startDateInTimezone.toDate(),
//         $lt: endDateInTimezone.toDate()
//       }
//     });

//     // Log existing bookings for debugging
//     console.log(`Existing Bookings: ${JSON.stringify(existingBookings)}`);

//     // Mark booked slots based on existing bookings
//     slots = slots.map(slot => {
//       const existingBooking = existingBookings.find(booking => moment(booking.slotTime).isSame(slot.time));

//       // Determine status based on existing bookings
//       if (existingBooking) {
//         if (existingBooking.visitorId === visitorId && existingBooking.status === 'pending') {
//           return {
//             ...slot,
//             status: 'pending' // If this booking belongs to the visitor and is pending
//           };
//         }
//         return {
//           ...slot,
//           status: 'booked' // If the booking is booked by someone else
//         };
//       }
//       return {
//         ...slot,
//         status: 'available' // Slot is available
//       };
//     });

//     res.json({ success: true, data: { slots } });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// };

exports.bookSlot = async (req, res) => {
  try {
    const { visitorId, exhibitorId, slotDate, time, status, timeZone } = req.body;

    if (!visitorId || !exhibitorId || !slotDate || !time || !timeZone) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Convert slotDate to the beginning of the day for consistent comparison (ignores time)
    const startOfDay = new Date(slotDate);
    startOfDay.setUTCHours(0, 0, 0, 0); // Ensure the time is reset to 00:00:00 for comparison
    const endOfDay = new Date(startOfDay);
    endOfDay.setUTCDate(startOfDay.getUTCDate() + 1);

    // Check if a booking already exists for this day
    const existingBooking = await Booking.findOne({
      visitorId,
      exhibitorId: exhibitorId,
      slotTime: { $gte: startOfDay, $lt: endOfDay }, // Find a booking for this day
      timeZone: timeZone
    });

    if (existingBooking) {
      if (existingBooking.status === 'booked') {
        // Slot is already booked for this day, return an error
        return res.status(400).json({ success: false, message: 'You already have a booked slot for this day.' });
      } else if (existingBooking.status === 'pending') {
        // Slot is in pending state, update it with the new time
        existingBooking.slotTime = time;
        existingBooking.status = status || 'pending'; // Update status if provided, else default to 'pending'
        await existingBooking.save();
        return res.json({ success: true, message: 'Slot updated successfully.' });
      }
    }

    // If no existing booking, create a new one
    const newBooking = new Booking({
      visitorId,
      exhibitorId: exhibitorId,
      slotTime: time,
      status: status || 'pending', // Default to pending if not provided
      timeZone: timeZone
    });

    await newBooking.save();
    res.json({ success: true, message: 'Slot booked successfully.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.listBookedSlots = async (req, res) => {
  try {
    // Extract visitorId from the query parameters
    const { visitorId } = req.query;

    // Validate that visitorId is provided
    if (!visitorId) {
      return res.status(400).json({ success: false, message: 'visitorId is required' });
    }

    // Find all bookings for the visitor
    const bookedSlots = await Booking.find({ visitorId }).populate('exhibitorId', 'companyName'); // Assuming exhibitorId references an exhibitor model with companyName field

    // If no slots are found, return an empty list
    if (!bookedSlots.length) {
      return res.json({ success: true, data: [], message: 'No booked slots found for this visitor.' });
    }

    // Map bookedSlots to the desired response structure
    const responseData = bookedSlots.map((slot, index) => {
      const timezone = slot.timeZone; // Use a default timezone if not available

      // Convert and format slot time based on the stored timezone
      const formattedDate = moment(slot.slotTime).tz(timezone).format('YYYY-MM-DD');
      const formattedTime = moment(slot.slotTime).tz(timezone).format('HH:mm A');

      return {
        SerialNo: index + 1,
        Date: formattedDate,
        Time: formattedTime,
        Timezone: timezone,
        ExhibitorCompanyName: slot.exhibitorId.companyName || 'N/A', // Default to 'N/A' if company name is unavailable
        Status: slot.status || 'N/A', // Default to 'N/A' if status is unavailable
        MeetingLink: slot.meetingLink || '' // Default to empty if meeting link is not available
      };
    });

    // Respond with the formatted data
    res.json({ success: true, data: responseData });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.getExhibitionDate = (req, res) => {
  const { timeZone } = req.query;

  // Fetch settings from the database
  Setting.findOne({ active: true, deleted: false })
    .then(setting => {
      if (!setting) {
        return res.status(404).json({
          success: false,
          message: "Settings not found"
        });
      }

      const { startDateTime, endDateTime, duration } = setting;

      // Convert startDateTime and endDateTime to requested timeZone
      // const slotStartDateTimeInRequestedTimeZone = momentTimeZone(startDateTime)
      //   .tz(timeZone)
      //   .format("YYYY-MM-DD");

      // const slotEndDateTimeInRequestedTimeZone = momentTimeZone(endDateTime)
      //   .tz(timeZone)
      //   .format("YYYY-MM-DD");

      return res.status(200).json({
        success: true,
        data: {
          startDate: startDateTime,
          endDate: endDateTime,
          duration
        },
      });
    })
    .catch(err => {
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    });
};

exports.getVisitorsList = async (req, res) => {
  try {
    const { id } = req.query;

    // Use aggregation to match bookings based on exhibitorId
    const response = await Booking.aggregate([
      {
        $match: { exhibitorId: new mongoose.Types.ObjectId(id) }, // Ensure new is used here
      },
      {
        $project: {
          visitorId: 1,
          status: 1,
          slotTime: 1,
          timeZone: 1,
          meetingLink: 1,
        },
      },
      {
        $lookup: {
          from: "visitors", // Assuming there is a 'visitors' collection
          localField: "visitorId",
          foreignField: "_id",
          as: "visitorDetails",
        },
      },
      {
        $unwind: { path: "$visitorDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          visitorName: "$visitorDetails.name",
          visitorId: 1,
          timeZone: 1,
          status: 1,
          slotTime: 1,
          meetingLink: 1,
        },
      },
    ]);

    if (response && response.length > 0) {
      let SerialNo = 0;
      const formattedResponse = response.map((item) => {
        SerialNo++;
        // Convert slotTime to the visitor's booked timezone
        const dateInBookedTimeZone = momentTimeZone(item?.slotTime)
          .tz(item?.timeZone)
          .format("YYYY-MM-DD");
        const timeInBookedTimeZone = momentTimeZone(item?.slotTime)
          .tz(item?.timeZone)
          .format("HH:mm");

        return {
          SerialNo,
          name: item?.visitorName || "N/A",
          visitorId: item?.visitorId,
          bookedTimeZone: item?.timeZone,
          status: item?.status || "N/A",
          time: timeInBookedTimeZone,
          date: dateInBookedTimeZone,
          dateTime: item?.slotTime,
          meetingId: item?._id, // Ensure this corresponds to your model's structure
          meetingLink: item?.meetingLink || "",
        };
      });

      return res.status(200).json({ success: true, data: formattedResponse });
    } else {
      return res.status(200).json({ success: true, data: [] });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err?.message || "Something went wrong",
    });
  }
};

exports.changeStatus = async (req, res) => {
  try {
    const { exhibitorId, meetingId, status } = req.body;

    // if (status === "rejected") {
    //   // If the status is rejected, delete the booking
    //   const response = await Booking.findOneAndDelete({
    //     _id: meetingId,
    //     exhibitorId: exhibitorId,
    //   });

    //   if (!response) {
    //     return res.status(404).json({ success: false, message: "Booking not found" });
    //   }

    //   const successObj = successResponse('Slot Rejected and Booking Deleted', response);
    //   return res.status(successObj.status).send(successObj);
    // } else {
    // If status is not rejected, update the booking status
    const response = await Booking.findOneAndUpdate(
      {
        _id: meetingId,
        exhibitorId: exhibitorId,
      },
      {
        $set: {
          status: status,
        },
      },
      {
        new: true,
      }
    );

    if (!response) {
      return res.status(404).json({ success: false, message: "Booking not found or already deleted" });
    }

    const successObj = successResponse('Slot Status Updated', response);
    return res.status(successObj.status).send(successObj);
    // }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err?.message || "Something went wrong",
    });
  }
};


exports.updateMeetingLink = async (req, res) => {
  try {
    const { exhibitorId, slotId, meetingId, meetingLink } = req.body;

    const response = await Slots.updateOne(
      {
        exhibitorId: exhibitorId,
        dates: {
          $elemMatch: {
            _id: meetingId,
            "slots._id": slotId,
          },
        },
      },
      {
        $set: {
          "dates.$[element].slots.$[j].meetingLink": meetingLink,
        },
      },
      {
        arrayFilters: [{ "element._id": meetingId }, { "j._id": slotId }],
        upsert: true,
        strict: false,
      }
    );

    return res
      .status(200)
      .json({ success: true, message: "Meeting link updated successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: err?.message || "Something went wrong",
    });
  }
};
