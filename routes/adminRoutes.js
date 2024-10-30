// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const adminController = require('../controllers/adminController');
const settingController = require('../controllers/settingController');
const stallController = require('../controllers/stallController');
const reportController = require('../controllers/reportController');
const visitorController = require('../controllers/visitorController');
const exhibitorController = require('../controllers/exhibitorController');
const briefCaseController = require('../controllers/briefCaseController');
const trackController = require('../controllers/trackController');
const auditoriumController = require('../controllers/auditoriumController');

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

/*Settings Route*/
router.post('/settings', passport.authenticate('jwt-admin', { session: false }), settingController.createSetting);
router.get('/settings', passport.authenticate('jwt-admin', { session: false }), settingController.getAllSettings);
router.get('/settings/:id', passport.authenticate('jwt-admin', { session: false }), settingController.getSettingById);
router.put('/settings/:id', passport.authenticate('jwt-admin', { session: false }), settingController.updateSetting);
router.delete('/settings/:id', passport.authenticate('jwt-admin', { session: false }), settingController.deleteSetting);

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
router.get('/meeting-tracking-report', passport.authenticate('jwt-admin', { session: false }), trackController.getTrackMeeting);
// router.get('/exhibitor-tracking-report', passport.authenticate('jwt-admin', { session: false }), reportController.getAllStall);
router.get('/catalogue-visit-report', passport.authenticate('jwt-admin', { session: false }), adminController.getAllExhibitorsWithProductDetails);


/*Auditorium Route*/
router.post('/auditorium', passport.authenticate('jwt-admin', { session: false }), auditoriumController.createAuditorium);
router.get('/auditorium', passport.authenticate('jwt-admin', { session: false }), auditoriumController.getAllAuditorium);
router.get('/auditorium/:id', passport.authenticate('jwt-admin', { session: false }), auditoriumController.getAuditoriumById);
router.put('/auditorium/:id', passport.authenticate('jwt-admin', { session: false }), auditoriumController.updateAuditorium);
router.delete('/auditorium/:id', passport.authenticate('jwt-admin', { session: false }), auditoriumController.deleteAuditorium);


module.exports = router;
