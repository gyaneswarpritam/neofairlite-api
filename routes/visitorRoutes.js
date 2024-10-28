const express = require('express');
const router = express.Router();
const passport = require('passport');
const { jwtSecret } = require('../config/config');

const visitorController = require('../controllers/visitorController');
const exhibitorController = require('../controllers/exhibitorController');
const settingController = require('../controllers/settingController');
const stallController = require('../controllers/stallController');
const VisitedStallController = require('../controllers/VisitedStallController');
const briefCaseController = require('../controllers/briefCaseController');
const trackController = require('../controllers/trackController');
const slotsController = require('../controllers/slotsController');
const instantMeetingController = require('../controllers/instantMeetingController');
const notificationController = require('../controllers/notificationController');
const likeController = require('../controllers/likeController');
const reviewController = require('../controllers/reviewController');
const emailController = require('../controllers/emailController');

// Configure JWT Strategy
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret
};

passport.use('jwt-visitor', new JwtStrategy(jwtOptions, (jwtPayload, done) => {
    // Extract the fields from the payload
    const { id, email, phone } = jwtPayload;

    // Check if either email or phone exists
    if (id && (email || phone)) {
        return done(null, jwtPayload); // Authentication successful
    } else {
        return done(null, false); // Authentication failed
    }
}));

router.post('/register', visitorController.register);
router.post('/login', visitorController.login);
router.post('/login-by-phone', visitorController.loginByPhone);
router.post('/logout', visitorController.loggedOut);
router.post('/verifyotp', visitorController.verifyOtp);
router.post('/requestotp', visitorController.requestOtp);
router.post('/verify-email', visitorController.verifyEmail);
router.post('/forgot-password', visitorController.forgotPassword);
router.post('/getVisitorData', visitorController.getVisitorData);

/*Exhibitor List Route*/
router.get('/exhibitorList', passport.authenticate('jwt-visitor', { session: false }), exhibitorController.getAllExhibitor);
router.get('/exhibitorListWithStall', passport.authenticate('jwt-visitor', { session: false }), visitorController.getAllExhibitorHavingStall);
router.get('/exhibitorChatList/:id', passport.authenticate('jwt-visitor', { session: false }), exhibitorController.getChatExhibitor);
router.get('/exhibitorById/:id', passport.authenticate('jwt-visitor', { session: false }), exhibitorController.getExhibitorById);

/*Exhibitor List Route*/
router.get('/visitorList', passport.authenticate('jwt-visitor', { session: false }), visitorController.getAllVisitor);
router.get('/visitorChatList/:id', passport.authenticate('jwt-visitor', { session: false }), visitorController.getAllChatVisitor);
router.get('/visitorById/:id', passport.authenticate('jwt-visitor', { session: false }), visitorController.getVisitorById);
router.get('/visitorByIdToVerify/:id', passport.authenticate('jwt-visitor', { session: false }), visitorController.getVisitorToVerify);
router.post('/verifyVisitorProfile/:id', passport.authenticate('jwt-visitor', { session: false }), visitorController.verifyVisitorProfile);
router.get('/sendVerifyProfileEmailByLink/:id', passport.authenticate('jwt-visitor', { session: false }), visitorController.sendVerifyProfileEmailByLink);

/*Settings Route*/
router.get('/settings', settingController.getAllSettings);

/*Stall Route*/
router.get('/all-stall', passport.authenticate('jwt-visitor', { session: false }), stallController.getAllStall);
router.get('/exhibitor-info', stallController.getAllStall);
router.get('/stall/:id/:visitorId', passport.authenticate('jwt-visitor', { session: false }), stallController.getByVisitorByStallById);

router.get('/loggedin-user', passport.authenticate('jwt-visitor', { session: false }), visitorController.getAllLoggedInVisitor);
router.get('/visited-stall/:visitorId', passport.authenticate('jwt-visitor', { session: false }), VisitedStallController.getAllVisitedStallForVisitor);
router.post('/visited-stall', passport.authenticate('jwt-visitor', { session: false }), VisitedStallController.createVisitedStall);
router.post('/increment-visited-product', passport.authenticate('jwt-visitor', { session: false }), VisitedStallController.incrementProductVisitCount);
router.post('/add-briefcase', passport.authenticate('jwt-visitor', { session: false }), briefCaseController.createBriefCase);
router.get('/briefcase/:visitorId', passport.authenticate('jwt-visitor', { session: false }), briefCaseController.getAllBriefcaseForVisitor);
router.put('/briefcase/:id', passport.authenticate('jwt-visitor', { session: false }), briefCaseController.updateBriefcase);

router.post('/trackVisitor', passport.authenticate('jwt-visitor', { session: false }), trackController.createTrackVisitor);
router.post('/trackMeeting', passport.authenticate('jwt-visitor', { session: false }), trackController.createTrackMeeting);
router.post('/book-slot', passport.authenticate('jwt-visitor', { session: false }), slotsController.bookSlot);
router.post('/book-slot-email', passport.authenticate('jwt-visitor', { session: false }), slotsController.sendBookingRequestMail);
router.get('/get-exhibitionDate', passport.authenticate('jwt-visitor', { session: false }), slotsController.getExhibitionDate);
router.get('/list-slots', passport.authenticate('jwt-visitor', { session: false }), slotsController.listSlots);
router.get('/list-booked-slots', passport.authenticate('jwt-visitor', { session: false }), slotsController.listBookedSlots);

router.post('/instant-meeting', passport.authenticate('jwt-visitor', { session: false }), instantMeetingController.createInstantMeeting);
router.get('/instant-meeting/:id', passport.authenticate('jwt-visitor', { session: false }), instantMeetingController.getInstantMeetingById);
router.get('/instant-meeting-by-stall/:stallId/:visitorId', passport.authenticate('jwt-visitor', { session: false }), instantMeetingController.getInstantMeetingByVisitorId);
router.put('/instant-meeting/:id', passport.authenticate('jwt-visitor', { session: false }), instantMeetingController.updateInstantMeeting);

router.post('/notification', passport.authenticate('jwt-visitor', { session: false }), notificationController.createExhibitorNotification);
router.get('/notification/:visitorId', passport.authenticate('jwt-visitor', { session: false }), notificationController.getVisitorNotification);

// Route to add a like
router.post('/add-like', passport.authenticate('jwt-visitor', { session: false }), likeController.addLike);

// Route to add a review
router.post('/review', passport.authenticate('jwt-visitor', { session: false }), reviewController.addReview);
router.post('/reset-password', passport.authenticate('jwt-visitor', { session: false }), visitorController.resetPassword);
router.post('/getStartEndTimeByDate/:dateParam', passport.authenticate('jwt-visitor', { session: false }), settingController.getStartEndTime);

router.post('/stall-visit', passport.authenticate('jwt-visitor', { session: false }), emailController.sendStallVisitSMS);
router.put('/notification/:visitorId', passport.authenticate('jwt-visitor', { session: false }), notificationController.markAllAsReadVisitor);
module.exports = router;
