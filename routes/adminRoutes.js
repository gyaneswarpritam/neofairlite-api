// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const adminController = require('../controllers/adminController');
const activityController = require('../controllers/activityController');
const auditoriumController = require('../controllers/auditoriumController');
const brochureController = require('../controllers/brochureController');
const directoryController = require('../controllers/directoryController');
const eventController = require('../controllers/eventController');
const faqController = require('../controllers/faqController');
const hallController = require('../controllers/hallController');
const liveController = require('../controllers/liveController');
const visualController = require('../controllers/visualController');
const webinarController = require('../controllers/webinarController');
const mediaController = require('../controllers/mediaController');
const flashMessageController = require('../controllers/flashMessageController');
const settingController = require('../controllers/settingController');
const locationChargesController = require('../controllers/locationChargesController');
const stallController = require('../controllers/stallController');
const reportController = require('../controllers/reportController');
const visitorController = require('../controllers/visitorController');
const exhibitorController = require('../controllers/exhibitorController');
const briefCaseController = require('../controllers/briefCaseController');
const trackController = require('../controllers/trackController');

const { jwtSecret } = require('../config/config');
const Visitor = require('../models/Visitor');

// Configure JWT Strategy
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret
};

passport.use('jwt-admin', new JwtStrategy(jwtOptions, (jwtPayload, done) => {
    // Extract the fields from the payload
    const { id, email } = jwtPayload;

    // Here you can add additional checks if needed
    if (id && email) {
        return done(null, jwtPayload); // Authentication successful
    } else {
        return done(null, false); // Authentication failed
    }
}));

router.post('/register', adminController.register);
router.post('/login', adminController.login);
router.post('/fetch-all-visitor', passport.authenticate('jwt-admin', { session: false }),
    adminController.fetchAllVisitor);
router.post('/fetch-all-exhibitor', passport.authenticate('jwt-admin', { session: false }),
    adminController.fetchAllExhibitor);
router.put('/approve-visitor/:visitorId', passport.authenticate('jwt-admin', { session: false }),
    adminController.approveVisitor);
router.put('/approve-exhibitor/:exhibitorId', passport.authenticate('jwt-admin', { session: false }),
    adminController.approveExhibitor);

/*Activity Route*/
router.post('/activity', passport.authenticate('jwt-admin', { session: false }), activityController.createActivity);
router.get('/activity', passport.authenticate('jwt-admin', { session: false }), activityController.getAllActivities);
router.get('/activity/:id', passport.authenticate('jwt-admin', { session: false }), activityController.getActivityById);
router.put('/activity/:id', passport.authenticate('jwt-admin', { session: false }), activityController.updateActivity);
router.delete('/activity/:id', passport.authenticate('jwt-admin', { session: false }), activityController.deleteActivity);

/*Auditorium Route*/
router.post('/auditorium', passport.authenticate('jwt-admin', { session: false }), auditoriumController.createAuditorium);
router.get('/auditorium', passport.authenticate('jwt-admin', { session: false }), auditoriumController.getAllAuditorium);
router.get('/auditorium/:id', passport.authenticate('jwt-admin', { session: false }), auditoriumController.getAuditoriumById);
router.put('/auditorium/:id', passport.authenticate('jwt-admin', { session: false }), auditoriumController.updateAuditorium);
router.delete('/auditorium/:id', passport.authenticate('jwt-admin', { session: false }), auditoriumController.deleteAuditorium);

/*Brochure Route*/
router.post('/brochure', passport.authenticate('jwt-admin', { session: false }), brochureController.createBrochure);
router.get('/brochure', passport.authenticate('jwt-admin', { session: false }), brochureController.getAllBrochure);
router.get('/brochure/:id', passport.authenticate('jwt-admin', { session: false }), brochureController.getBrochureById);
router.put('/brochure/:id', passport.authenticate('jwt-admin', { session: false }), brochureController.updateBrochure);
router.delete('/brochure/:id', passport.authenticate('jwt-admin', { session: false }), brochureController.deleteBrochure);

/*Directory Route*/
router.post('/directory', passport.authenticate('jwt-admin', { session: false }), directoryController.createDirectory);
router.get('/directory', passport.authenticate('jwt-admin', { session: false }), directoryController.getAllDirectory);
router.get('/directory/:id', passport.authenticate('jwt-admin', { session: false }), directoryController.getDirectoryById);
router.put('/directory/:id', passport.authenticate('jwt-admin', { session: false }), directoryController.updateDirectory);
router.delete('/directory/:id', passport.authenticate('jwt-admin', { session: false }), directoryController.deleteDirectory);

/*Event Route*/
router.post('/event', passport.authenticate('jwt-admin', { session: false }), eventController.createEvent);
router.get('/event', passport.authenticate('jwt-admin', { session: false }), eventController.getAllEvent);
router.get('/event/:id', passport.authenticate('jwt-admin', { session: false }), eventController.getEventById);
router.put('/event/:id', passport.authenticate('jwt-admin', { session: false }), eventController.updateEvent);
router.delete('/event/:id', passport.authenticate('jwt-admin', { session: false }), eventController.deleteEvent);

/*Faq Route*/
router.post('/faq', passport.authenticate('jwt-admin', { session: false }), faqController.createFaq);
router.get('/faq', passport.authenticate('jwt-admin', { session: false }), faqController.getAllFaq);
router.get('/faq/:id', passport.authenticate('jwt-admin', { session: false }), faqController.getFaqById);
router.put('/faq/:id', passport.authenticate('jwt-admin', { session: false }), faqController.updateFaq);
router.delete('/faq/:id', passport.authenticate('jwt-admin', { session: false }), faqController.deleteFaq);

/*Hall Route*/
router.post('/hall', passport.authenticate('jwt-admin', { session: false }), hallController.createHall);
router.get('/hall', passport.authenticate('jwt-admin', { session: false }), hallController.getAllHall);
router.get('/hall/:id', passport.authenticate('jwt-admin', { session: false }), hallController.getHallById);
router.put('/hall/:id', passport.authenticate('jwt-admin', { session: false }), hallController.updateHall);
router.delete('/hall/:id', passport.authenticate('jwt-admin', { session: false }), hallController.deleteHall);

/*Live Route*/
router.post('/live', passport.authenticate('jwt-admin', { session: false }), liveController.createLive);
router.get('/live', passport.authenticate('jwt-admin', { session: false }), liveController.getAllLive);
router.get('/live/:id', passport.authenticate('jwt-admin', { session: false }), liveController.getLiveById);
router.put('/live/:id', passport.authenticate('jwt-admin', { session: false }), liveController.updateLive);
router.delete('/live/:id', passport.authenticate('jwt-admin', { session: false }), liveController.deleteLive);

/*Live Route*/
router.post('/media', passport.authenticate('jwt-admin', { session: false }), mediaController.createMedia);
router.get('/media', passport.authenticate('jwt-admin', { session: false }), mediaController.getAllMedia);
router.get('/media/:id', passport.authenticate('jwt-admin', { session: false }), mediaController.getMediaById);
router.put('/media/:id', passport.authenticate('jwt-admin', { session: false }), mediaController.updateMedia);
router.delete('/media/:id', passport.authenticate('jwt-admin', { session: false }), mediaController.deleteMedia);

/*Media Route*/
router.post('/visual', passport.authenticate('jwt-admin', { session: false }), visualController.createVisual);
router.get('/visual', passport.authenticate('jwt-admin', { session: false }), visualController.getAllVisual);
router.get('/visual/:id', passport.authenticate('jwt-admin', { session: false }), visualController.getVisualById);
router.put('/visual/:id', passport.authenticate('jwt-admin', { session: false }), visualController.updateVisual);
router.delete('/visual/:id', passport.authenticate('jwt-admin', { session: false }), visualController.deleteVisual);

/*Webinar Route*/
router.post('/webinar', passport.authenticate('jwt-admin', { session: false }), webinarController.createWebinar);
router.get('/webinar', passport.authenticate('jwt-admin', { session: false }), webinarController.getAllWebinar);
router.get('/webinar/:id', passport.authenticate('jwt-admin', { session: false }), webinarController.getWebinarById);
router.put('/webinar/:id', passport.authenticate('jwt-admin', { session: false }), webinarController.updateWebinar);
router.delete('/webinar/:id', passport.authenticate('jwt-admin', { session: false }), webinarController.deleteWebinar);

/*Flash message Route*/
router.post('/flashMessage', passport.authenticate('jwt-admin', { session: false }), flashMessageController.createFlashMessage);
router.get('/flashMessage', passport.authenticate('jwt-admin', { session: false }), flashMessageController.getAllFlashMessage);
router.get('/flashMessage/:id', passport.authenticate('jwt-admin', { session: false }), flashMessageController.getFlashMessageById);
router.put('/flashMessage/:id', passport.authenticate('jwt-admin', { session: false }), flashMessageController.updateFlashMessage);
router.delete('/flashMessage/:id', passport.authenticate('jwt-admin', { session: false }), flashMessageController.deleteFlashMessage);

/*Settings Route*/
router.post('/settings', passport.authenticate('jwt-admin', { session: false }), settingController.createSetting);
router.get('/settings', passport.authenticate('jwt-admin', { session: false }), settingController.getAllSettings);
router.get('/settings/:id', passport.authenticate('jwt-admin', { session: false }), settingController.getSettingById);
router.put('/settings/:id', passport.authenticate('jwt-admin', { session: false }), settingController.updateSetting);
router.delete('/settings/:id', passport.authenticate('jwt-admin', { session: false }), settingController.deleteSetting);

/*Settings Route*/
router.post('/location-charges', passport.authenticate('jwt-admin', { session: false }), locationChargesController.createLocationCharges);
router.get('/location-charges', passport.authenticate('jwt-admin', { session: false }), locationChargesController.getAllLocationCharges);
router.get('/location-charges/:id', passport.authenticate('jwt-admin', { session: false }), locationChargesController.getLocationChargesById);
router.put('/location-charges/:id', passport.authenticate('jwt-admin', { session: false }), locationChargesController.updateLocationCharges);
router.delete('/location-charges/:id', passport.authenticate('jwt-admin', { session: false }), locationChargesController.deleteLocationCharges);

/*Stall Route*/
router.get('/all-stall', passport.authenticate('jwt-admin', { session: false }), stallController.getAllStall);
router.get('/stall/:id', passport.authenticate('jwt-admin', { session: false }), stallController.getStallById);
router.put('/stall-position/:id', passport.authenticate('jwt-admin', { session: false }), stallController.updateStallPosition);

/*Reports*/
router.get('/visitor-report', passport.authenticate('jwt-admin', { session: false }), reportController.visitorReport);
router.get('/exhibitor-report', passport.authenticate('jwt-admin', { session: false }), reportController.exhibitorReport);
router.get('/visited-stall-report', passport.authenticate('jwt-admin', { session: false }), reportController.getAllVisitedStall);
router.get('/logged-visitor-report', passport.authenticate('jwt-admin', { session: false }), visitorController.getAllLoggedInVisitorList);
router.get('/logged-exhibitor-report', passport.authenticate('jwt-admin', { session: false }), exhibitorController.getAllLoggedInExhibitorList);
router.get('/joined-visitor-report', passport.authenticate('jwt-admin', { session: false }), visitorController.getAllJoinedVisitorList);
router.get('/joined-exhibitor-report', passport.authenticate('jwt-admin', { session: false }), exhibitorController.getAllJoinedExhibitorList);
router.get('/catalogue-report', passport.authenticate('jwt-admin', { session: false }), briefCaseController.getAllBriefcaseAdmin);
router.get('/visitor-tracking-report', passport.authenticate('jwt-admin', { session: false }), trackController.getTrackVisitor);
// router.get('/exhibitor-tracking-report', passport.authenticate('jwt-admin', { session: false }), reportController.getAllStall);
router.get('/catalogue-visit-report', passport.authenticate('jwt-admin', { session: false }), adminController.getAllExhibitorsWithProductDetails);

module.exports = router;
