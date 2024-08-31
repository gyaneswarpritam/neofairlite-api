const express = require('express');
const router = express.Router();
const passport = require('passport');
const { jwtSecret } = require('../config/config');

const hallController = require('../controllers/hallController');
const visitorController = require('../controllers/visitorController');
const exhibitorController = require('../controllers/exhibitorController');
const settingController = require('../controllers/settingController');
const locationChargesController = require('../controllers/locationChargesController');
const stallController = require('../controllers/stallController');
const directoryController = require('../controllers/directoryController');
const visualController = require('../controllers/visualController');
const mediaController = require('../controllers/mediaController');
const faqController = require('../controllers/faqController');
const liveController = require('../controllers/liveController');
const activityController = require('../controllers/activityController');
const webinarController = require('../controllers/webinarController');
const VisitedStallController = require('../controllers/VisitedStallController');
const briefCaseController = require('../controllers/briefCaseController');
const trackController = require('../controllers/trackController');
const slotsController = require('../controllers/slotsController');
const instantMeetingController = require('../controllers/instantMeetingController');
const notificationController = require('../controllers/notificationController');
const auditoriumController = require('../controllers/auditoriumController');
const flashMessageController = require('../controllers/flashMessageController');
const likeController = require('../controllers/likeController');
const reviewController = require('../controllers/reviewController');

// Configure JWT Strategy
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret
};

passport.use('jwt-visitor', new JwtStrategy(jwtOptions, (jwtPayload, done) => {
    // Extract the fields from the payload
    const { id, email } = jwtPayload;

    // Here you can add additional checks if needed
    if (id && email) {
        return done(null, jwtPayload); // Authentication successful
    } else {
        return done(null, false); // Authentication failed
    }
}));

router.post('/register', visitorController.register);
router.post('/login', visitorController.login);
router.post('/logout', visitorController.loggedOut);
router.post('/verifyotp', visitorController.verifyOtp);
router.post('/requestotp', visitorController.requestOtp);
router.post('/verify-email', visitorController.verifyEmail);
router.post('/forgot-password', visitorController.forgotPassword);

/*Hall Route*/
router.get('/hall', passport.authenticate('jwt-visitor', { session: false }), hallController.getAllHall);
router.get('/hall/:id', passport.authenticate('jwt-visitor', { session: false }), hallController.getHallById);

/*Exhibitor List Route*/
router.get('/exhibitorList', passport.authenticate('jwt-visitor', { session: false }), exhibitorController.getAllExhibitor);
router.get('/exhibitorChatList/:id', passport.authenticate('jwt-visitor', { session: false }), exhibitorController.getChatExhibitor);
router.get('/exhibitorById/:id', passport.authenticate('jwt-visitor', { session: false }), exhibitorController.getExhibitorById);

/*Exhibitor List Route*/
router.get('/visitorList', passport.authenticate('jwt-visitor', { session: false }), visitorController.getAllVisitor);
router.get('/visitorChatList/:id', passport.authenticate('jwt-visitor', { session: false }), visitorController.getAllChatVisitor);
router.get('/visitorById/:id', passport.authenticate('jwt-visitor', { session: false }), visitorController.getVisitorById);

/*Settings Route*/
router.get('/settings', settingController.getAllSettings);

/*Stall Route*/
router.get('/all-stall', passport.authenticate('jwt-visitor', { session: false }), stallController.getAllStall);
router.get('/exhibitor-info', stallController.getAllStall);
router.get('/stall/:id/:visitorId', passport.authenticate('jwt-visitor', { session: false }), stallController.getByVisitorByStallById);

/*location Charges Route*/
router.get('/location-charges', locationChargesController.getAllLocationCharges);
/*Resource Center Route*/
router.get('/directory', passport.authenticate('jwt-visitor', { session: false }), directoryController.getAllDirectory);
router.get('/visual', passport.authenticate('jwt-visitor', { session: false }), visualController.getAllVisual);
router.get('/media', passport.authenticate('jwt-visitor', { session: false }), mediaController.getAllMedia);
router.get('/faq', passport.authenticate('jwt-visitor', { session: false }), faqController.getAllFaq);

router.get('/webinar', passport.authenticate('jwt-visitor', { session: false }), webinarController.getAllWebinar);
router.get('/live', passport.authenticate('jwt-visitor', { session: false }), liveController.getAllLive);
router.get('/activity', passport.authenticate('jwt-visitor', { session: false }), activityController.getAllActivities);


router.get('/loggedin-user', passport.authenticate('jwt-visitor', { session: false }), visitorController.getAllLoggedInVisitor);
router.get('/visited-stall/:visitorId', passport.authenticate('jwt-visitor', { session: false }), VisitedStallController.getAllVisitedStallForVisitor);
router.post('/visited-stall', passport.authenticate('jwt-visitor', { session: false }), VisitedStallController.createVisitedStall);
router.post('/increment-visited-product', passport.authenticate('jwt-visitor', { session: false }), VisitedStallController.incrementProductVisitCount);
router.post('/add-briefcase', passport.authenticate('jwt-visitor', { session: false }), briefCaseController.createBriefCase);
router.get('/briefcase/:visitorId', passport.authenticate('jwt-visitor', { session: false }), briefCaseController.getAllBriefcaseForVisitor);
router.put('/briefcase/:id', passport.authenticate('jwt-visitor', { session: false }), briefCaseController.updateBriefcase);

router.post('/trackVisitor', passport.authenticate('jwt-visitor', { session: false }), trackController.createTrackVisitor);
router.post('/book-slot', passport.authenticate('jwt-visitor', { session: false }), slotsController.bookSlot);
router.get('/get-exhibitionDate', passport.authenticate('jwt-visitor', { session: false }), slotsController.getExhibitionDate);
router.get('/list-slots', passport.authenticate('jwt-visitor', { session: false }), slotsController.listSlots);
router.get('/list-booked-slots', passport.authenticate('jwt-visitor', { session: false }), slotsController.listBookedSlots);

router.post('/instant-meeting', passport.authenticate('jwt-visitor', { session: false }), instantMeetingController.createInstantMeeting);
router.get('/instant-meeting/:id', passport.authenticate('jwt-visitor', { session: false }), instantMeetingController.getInstantMeetingById);
router.get('/instant-meeting-by-stall/:stallId/:visitorId', passport.authenticate('jwt-visitor', { session: false }), instantMeetingController.getInstantMeetingByVisitorId);
router.put('/instant-meeting/:id', passport.authenticate('jwt-visitor', { session: false }), instantMeetingController.updateInstantMeeting);

router.post('/notification', passport.authenticate('jwt-visitor', { session: false }), notificationController.createExhibitorNotification);
router.get('/notification/:visitorId', passport.authenticate('jwt-visitor', { session: false }), notificationController.getVisitorNotification);

router.get('/auditorium', passport.authenticate('jwt-visitor', { session: false }), auditoriumController.getAllAuditorium);
router.get('/flashMessage', passport.authenticate('jwt-visitor', { session: false }), flashMessageController.getAllFlashMessage);

// Route to add a like
router.post('/add-like', passport.authenticate('jwt-visitor', { session: false }), likeController.addLike);

// Route to add a review
router.post('/review', passport.authenticate('jwt-visitor', { session: false }), reviewController.addReview);
router.post('/reset-password', passport.authenticate('jwt-visitor', { session: false }), visitorController.resetPassword);

module.exports = router;
