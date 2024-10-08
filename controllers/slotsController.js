const moment = require("moment");
const momentTimeZone = require("moment-timezone");
const { EXB_DURATION_IN_MINUTES_PER_SLOT, EXB_END_TIME_IN_UTC, EXB_FROM_IN_UTC, EXB_START_TIME_IN_UTC, EXB_TIME_ZONE, EXB_TO_IN_UTC } = require("../constants.js");
const Slots = require("../models/slots.js");
const Visitor = require("../models/Visitor.js");
const Exhibitor = require("../models/Exhibitor.js");
const Setting = require("../models/Setting.js");
const { successResponse } = require("../utils/sendResponse.js");

exports.listExhibitors = async (req, res) => {
  try {
    const exhibitors = await Exhibitor.find({}, ["companyName"]);

    return res.status(200).json({ success: true, data: { exhibitors } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err });
  }
};

exports.listSlots = async (req, res) => {
  try {
    const { id, timeZone: requestedTimeZone, date: requestedDate, duration, startDate, endDate } = req.query;
    const EXB_START_TIME_IN_UTCq = moment(startDate).utc().format("HH:mm"); // UTC time in 24-hour format
    const EXB_END_TIME_IN_UTCq = moment(endDate).utc().format("HH:mm");
    const slotStartDateTimeInRequestedTimeZone = momentTimeZone(
      `${requestedDate}T${EXB_START_TIME_IN_UTCq}:00Z`
    )
      .tz(requestedTimeZone)
      .format("YYYY-MM-DDTHH:mm:ssZ");
    const slotStartDateTimeInUTC = moment
      .tz(slotStartDateTimeInRequestedTimeZone, "UTC")
      .format("YYYY-MM-DDTHH:mm:ssZ");

    const slotEndDateTimeInRequestedTimeZone = momentTimeZone(
      `${requestedDate}T${EXB_END_TIME_IN_UTCq}:00Z`
    )
      .tz(requestedTimeZone)
      .format("YYYY-MM-DDTHH:mm:ssZ");
    const slotEndDateTimeInUTC = moment
      .tz(slotEndDateTimeInRequestedTimeZone, "UTC")
      .format("YYYY-MM-DDTHH:mm:ssZ");

    const response = await Slots.findOne({ eid: id });
    const parsedResponse = JSON.parse(JSON.stringify(response));
    let slotInfo = parsedResponse;
    let newDates = slotInfo?.dates?.length
      ? JSON.parse(JSON.stringify(slotInfo?.dates))
      : [];
    if (parsedResponse == null) {
      const exhibitorInfoResponse = await Exhibitor.findOne({ _id: id });
      const parsedExbInfo = JSON.parse(JSON.stringify(exhibitorInfoResponse));
      const exbInfo = {
        eid: parsedExbInfo?._id,
        companyName: parsedExbInfo?.companyName,
        dates: [
          //previous day
          {
            from: moment(slotStartDateTimeInUTC).subtract(1, "days"),
            to: moment(slotEndDateTimeInUTC).subtract(1, "days"),
            durationInMinutes: +duration,
            slots: [],
          },
          {
            from: slotStartDateTimeInUTC,
            to: slotEndDateTimeInUTC,
            durationInMinutes: +duration,
            slots: [],
          },
          //next day
          {
            from: moment(slotStartDateTimeInUTC).add(1, "days"),
            to: moment(slotEndDateTimeInUTC).add(1, "days"),
            durationInMinutes: +duration,
            slots: [],
          },
        ],
      };
      const response = await Slots.insertMany(exbInfo);
      const parsedResponse = JSON.parse(JSON.stringify(response));
      slotInfo = parsedResponse[0];
      newDates = [...newDates, ...exbInfo.dates];
    } else {
      const exhibitorInfoResponse = await Exhibitor.findOne({ _id: id });
      const parsedExbInfo = JSON.parse(JSON.stringify(exhibitorInfoResponse));
      const exbInfo = {
        eid: parsedExbInfo?._id,
        companyName: parsedExbInfo?.companyName,
        dates: [
          //previous day
          {
            from: moment(slotStartDateTimeInUTC).subtract(1, "days"),
            to: moment(slotEndDateTimeInUTC).subtract(1, "days"),
            durationInMinutes: +duration,
            slots: [],
          },
          {
            from: slotStartDateTimeInUTC,
            to: slotEndDateTimeInUTC,
            durationInMinutes: +duration,
            slots: [],
          },
          //next day
          {
            from: moment(slotStartDateTimeInUTC).add(1, "days"),
            to: moment(slotEndDateTimeInUTC).add(1, "days"),
            durationInMinutes: +duration,
            slots: [],
          },
        ],
      };
      for (let data of exbInfo?.dates || []) {
        const existingDate = slotInfo?.dates.find((item) => {
          const a = moment(data?.to).format("YYYY-MM-DD");
          const b = moment(item?.to).format("YYYY-MM-DD");
          const c = moment(data?.from).format("YYYY-MM-DD");
          const d = moment(item?.from).format("YYYY-MM-DD");
          //TODO
          return a === b && c === d;
        });
        if (!existingDate) {
          newDates.push(data);
        }
      }
    }
    const updateResponse = await Slots.updateOne(
      { eid: id },
      {
        $set: {
          dates: newDates,
        },
      }
    );
    const matchedDateInfo = newDates?.filter((data) => {
      const from = momentTimeZone(data?.from)
        .tz(requestedTimeZone)
        .format("YYYY-MM-DD");
      const to = momentTimeZone(data?.to)
        .tz(requestedTimeZone)
        .format("YYYY-MM-DD");

      if (
        moment(from).isSame(requestedDate, "day") ||
        moment(to).isSame(requestedDate, "day")
      )
        return true;
      return false;
    });
    if (!matchedDateInfo?.length)
      return res.status(200).json({
        success: true,
        message: "No Event in the selected Date",
      });

    let exbDurationInMinutes;

    let exbStartDateTimeInLocalZone = momentTimeZone(matchedDateInfo[0]?.from)
      .tz(requestedTimeZone)
      .format("YYYY-MM-DDTHH:mm:ssZ");

    let exbEndDateTimeInLocalZone = momentTimeZone(
      matchedDateInfo[matchedDateInfo.length - 1]?.to
    )
      .tz(requestedTimeZone)
      .format("YYYY-MM-DDTHH:mm:ssZ");

    exbStartDateTimeInLocalZone = moment(exbStartDateTimeInLocalZone);
    exbEndDateTimeInLocalZone = moment(exbEndDateTimeInLocalZone);
    exbDurationInMinutes = moment(matchedDateInfo[0].to).diff(
      moment(matchedDateInfo[0].from),
      "minutes"
    );

    const totalSlots = exbDurationInMinutes / duration;

    const slotTimeListInLocalZone = [];
    let currentDateTimeSlot = moment(matchedDateInfo[0].from);
    for (let i = 0; i < totalSlots; i++) {
      const currentTime = moment(currentDateTimeSlot).format("HH:mm");
      slotTimeListInLocalZone.push(currentTime);
      currentDateTimeSlot = moment(currentDateTimeSlot).add(
        duration,
        "minutes"
      );
      // if (currentTime == "16:30") break;
    }
    const allSlotTimings = slotTimeListInLocalZone.map((item) => {
      const time = moment
        .tz(moment(`${requestedDate}T${item}:00`), requestedTimeZone)
        .format("HH:mm");
      return time;
    });

    let exbSlotList = [];
    for (let item of matchedDateInfo) {
      exbSlotList = [...exbSlotList, ...item?.slots];
    }

    const formattedExbSlotList = [];
    for (let item of allSlotTimings) {
      let slot = null;
      const isSlotExistsInDB = exbSlotList?.find((data) => {
        const time = momentTimeZone(data?.time)
          .tz(requestedTimeZone)
          .format("HH:mm");
        slot = { ...data };

        return item == time;
      });

      if (isSlotExistsInDB) {
        const slotStartTimeInLocal = moment(slot?.time)
          .tz(requestedTimeZone)
          .format("HH:mm");
        const slotStartDateInLocal = momentTimeZone(slot?.time)
          .tz(requestedTimeZone)
          .format("YYYY-MM-DD");
        const slotTiming = `${slotStartTimeInLocal} - ${moment(
          slotStartTimeInLocal,
          "HH:mm"
        )
          .add(+duration, "m")
          .format("HH:mm")}`;

        if (moment(slotStartDateInLocal).isSame(requestedDate, "day"))
          formattedExbSlotList.push({
            slotStartTimeInLocal,
            slotTiming,
            status: slot?.status,
            visitorId: slot?.visitorId,
            slotDate: exbStartDateTimeInLocalZone,
            durationInMinutes: +duration,
            time: slot?.time,
            slotId: slot?._id,
          });
      } else {
        const slotStartTimeInLocal = moment(
          `${requestedDate}T${item}:00`
        ).format("HH:mm");

        const slotStartDateInLocal = moment(
          `${requestedDate}T${item}:00`
        ).format("YYYY-MM-DD");

        const slotTiming = `${slotStartTimeInLocal} - ${moment(
          slotStartTimeInLocal,
          "HH:mm"
        )
          .add(slot?.durationInMinutes || 30, "m")
          .format("HH:mm")}`;

        const slotDateTimeInLocalZone = moment
          .tz(`${requestedDate}T${item}:00`, requestedTimeZone)
          .format("YYYY-MM-DDTHH:mm:ssZ");
        const slotStartDateTimeInUTC = moment
          .tz(slotDateTimeInLocalZone, "UTC")
          .format("YYYY-MM-DDTHH:mm:ssZ");

        if (moment(slotStartDateInLocal).isSame(requestedDate, "day"))
          formattedExbSlotList.push({
            slotStartTimeInLocal,
            slotTiming,
            status: "available",
            time: slotStartDateTimeInUTC,

            slotDate: exbStartDateTimeInLocalZone,
            durationInMinutes: +duration,
          });
      }
    }

    return res
      .status(200)
      .json({ success: true, data: { slots: formattedExbSlotList } });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, error: err?.message || "Something went wrong" });
  }
};

exports.bookSlot = async (req, res) => {
  try {
    let { slotDate, eId, visitorId, time, duration, timeZone, status, startDate, endDate } =
      req.body;
    const EXB_START_TIME_IN_UTCq = moment(startDate).utc().format("HH:mm"); // UTC time in 24-hour format
    const EXB_END_TIME_IN_UTCq = moment(endDate).utc().format("HH:mm");
    const slotId = req.body?.slotId;

    const visitorInfo = await Visitor.findOne({ _id: visitorId });

    const parsedVisitorInfo = JSON.parse(JSON.stringify(visitorInfo));

    const slot = {
      visitorId,
      visitorName: parsedVisitorInfo?.name,
      durationInMinutes: duration,
      status,
      bookedTimeZone: timeZone,
      time,
    };

    slotDate = moment(time).format("YYYY-MM-DD");

    const slotStartDateTimeInRequestedTimeZone = momentTimeZone(
      `${slotDate}T${EXB_START_TIME_IN_UTCq}:00Z`
    )
      .tz(timeZone)
      .format("YYYY-MM-DDTHH:mm:ssZ");
    const slotStartDateTimeInUTC = moment
      .tz(slotStartDateTimeInRequestedTimeZone, "UTC")
      .format("YYYY-MM-DDTHH:mm:ssZ");

    const slotEndDateTimeInRequestedTimeZone = momentTimeZone(
      `${slotDate}T${EXB_END_TIME_IN_UTCq}:00Z`
    )
      .tz(timeZone)
      .format("YYYY-MM-DDTHH:mm:ssZ");
    const slotEndDateTimeInUTC = moment
      .tz(slotEndDateTimeInRequestedTimeZone, "UTC")
      .format("YYYY-MM-DDTHH:mm:ssZ");

    const dates = await Slots.aggregate([{ $unwind: { path: "$dates" } }]);
    const isDateExists = dates.find((data) => {
      return (
        moment(data?.dates?.from).format("YYYY-MM-DD") ==
        moment(slotStartDateTimeInUTC).format("YYYY-MM-DD")
      );
    });
    if (!isDateExists && status === "pending") {
      const date = {
        to: slotEndDateTimeInUTC,
        from: slotStartDateTimeInUTC,
        slots: slot,
      };
      const response = await Slots.findOneAndUpdate(
        {
          eid: eId,
        },
        {
          $push: {
            dates: date,
          },
        },
        { new: true }
      );
      const successObj = successResponse('Slot Booked', response);
      res.status(successObj.status).send(successObj);
    } else if (status === "pending") {
      const response = await Slots.findOneAndUpdate(
        {
          eid: eId,
        },
        {
          $push: {
            "dates.$[element].slots": slot,
          },
        },
        {
          arrayFilters: [{ "element.from": slotStartDateTimeInUTC }],
          upsert: true,
          strict: false,
          new: true
        }
      );
      const successObj = successResponse('Slot Booked', response);
      res.status(successObj.status).send(successObj);
    } else {
      // slotStartDateTimeInUTC
      const response = await Slots.findOneAndUpdate(
        {
          eid: eId,
          dates: {
            $elemMatch: {
              from: slotStartDateTimeInUTC,
              "slots._id": slotId,
            },
          },
        },
        {
          $pull: {
            "dates.$[element].slots": {
              _id: slotId,
            },
          },
        },
        {
          arrayFilters: [
            { "element.from": slotStartDateTimeInUTC },
            // { "slot._id": slotId },
          ],
          upsert: true,
          strict: false,
          new: true
        }
      );
      const successObj = successResponse('Slot Booked', response);
      res.status(successObj.status).send(successObj);
    }

    // res.status(200).json({ success: true, message: "Slot Booked" });
  } catch (err) {
    console.log(err);
    res
      .status(200)
      .status(500)
      .json({
        success: false,
        message: err?.message || "Something went wrong",
      });
  }
};

exports.listBookedSlots = async (req, res) => {
  try {
    const { visitorId } = req.query;
    const slots = await Slots.aggregate([
      { $unwind: { path: "$dates" } },
      { $unwind: { path: "$dates.slots" } },
      { $match: { "dates.slots.visitorId": visitorId } },
      { $project: { slot: "$dates.slots", companyName: "$companyName" } },
    ]);
    if (!slots) return res.status(200).json({ success: true, slots: [] });
    let SerialNo = 0;
    const formattedSlots = slots.map((item) => {
      const dateInBookedTimeZone = momentTimeZone(item?.slot?.time)
        .tz(item.slot?.bookedTimeZone)
        .format("YYYY-MM-DD");
      const timeInBookedTimeZone = momentTimeZone(item?.slot?.time)
        .tz(item.slot?.bookedTimeZone)
        .format("HH:mm");
      SerialNo++;
      return {
        SerialNo,
        Date: dateInBookedTimeZone,
        Time: timeInBookedTimeZone,
        Timezone: item?.slot.bookedTimeZone,
        ExhibitorCompanyName: item?.companyName,
        Status: item?.slot?.status,
        MeetingLink: item?.slot?.meetingLink,
      };
    });

    return res.status(200).json({ success: true, data: formattedSlots });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: err?.message || "Something went wrong",
    });
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
    const response = await Slots.aggregate([
      {
        $match: { eid: id },
      },
      {
        $unwind: { path: "$dates" },
      },
      {
        $unwind: { path: "$dates.slots" },
      },
      {
        $project: {
          name: "$dates.slots.visitorName",
          visitorId: "$dates.slots.visitorId",
          bookedTimeZone: "$dates.slots.bookedTimeZone",
          status: "$dates.slots.status",
          time: "$dates.slots.time",
          dateId: "$dates._id",
          slotId: "$dates.slots._id",
          meetingLink: "$dates.slots.meetingLink",
        },
      },
    ]);
    if (response) {
      let SerialNo = 0;
      const formattedReponse = response.map((item) => {
        const dateInBookedTimeZone = momentTimeZone(item?.time)
          .tz(item?.bookedTimeZone)
          .format("YYYY-MM-DD");
        const timeInBookedTimeZone = momentTimeZone(item?.time)
          .tz(item?.bookedTimeZone)
          .format("HH:mm");
        SerialNo++;
        const result = {
          SerialNo,
          name: item?.name,
          visitorId: item?.visitorId,
          bookedTimeZone: item?.bookedTimeZone,
          status: item?.status,
          time: timeInBookedTimeZone,
          date: dateInBookedTimeZone,
          dateTime: item?.time,
          dateId: item?.dateId,
          slotId: item?.slotId,
          meetingLink: item?.meetingLink,
        };
        return result;
      });
      return res.status(200).json({ success: true, data: formattedReponse });
    } else {
      return res.status(200).json({ success: true, data: [] });
    }
  } catch (err) {
    console.log(er);
    return res.status(500).json({
      success: false,
      message: err?.message || "Something went wrong",
    });
  }
};

exports.changeStatus = async (req, res) => {
  try {
    const { eId, slotId, dateId, status } = req.body;
    if (status == "rejected") {
      //todo if rejected delete the collection
      const response = await Slots.findOneAndUpdate(
        {
          eid: eId,
          dates: {
            $elemMatch: {
              _id: dateId,
              "slots._id": slotId,
            },
          },
        },
        {
          $pull: {
            "dates.$[element].slots": {
              _id: slotId,
            },
          },
        },
        {
          arrayFilters: [
            { "element._id": dateId },
            // { "slot._id": slotId },
          ],
          upsert: true,
          strict: false,
          new: true
        }
      );
      const successObj = successResponse('Slot Status Changes', response);
      res.status(successObj.status).send(successObj);
    } else {
      const response = await Slots.findOneAndUpdate(
        {
          eid: eId,
        },
        {
          $set: {
            "dates.$[element].slots.$[j].status": status,
          },
        },
        {
          arrayFilters: [{ "element._id": dateId }, { "j._id": slotId }],
          upsert: true,
          strict: false,
          new: true
        }
      );
      const successObj = successResponse('Slot Status Changes', response);
      res.status(successObj.status).send(successObj);
    }
    // }else{

    // }
    // return res
    //   .status(200)
    //   .json({ success: true, message: "Status updated successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: err?.message || "Something went wrong",
    });
  }
};

exports.updateMeetingLink = async (req, res) => {
  try {
    const { eId, slotId, dateId, meetingLink } = req.body;

    const response = await Slots.updateOne(
      {
        eid: eId,
        dates: {
          $elemMatch: {
            _id: dateId,
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
        arrayFilters: [{ "element._id": dateId }, { "j._id": slotId }],
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
