// services/authService.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/config');
const Visitor = require('../models/Visitor');
const Exhibitor = require('../models/Exhibitor');
const Admin = require('../models/Admin');

passport.use('visitor-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const visitor = await Visitor.findOne({ email });
        if (!visitor) {
            return done(null, false, { message: 'Incorrect email or password' });
        }
        const isMatch = await bcrypt.compare(password, visitor.password);
        if (isMatch) {
            return done(null, visitor);
        } else {
            return done(null, false, { message: 'Incorrect email or password' });
        }
    } catch (err) {
        return done(err);
    }
}));

passport.use('exhibitor-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const exhibitor = await Exhibitor.findOne({ email });
        if (!exhibitor) {
            return done(null, false, { message: 'Incorrect email or password' });
        }
        const isMatch = await bcrypt.compare(password, exhibitor.password);
        if (isMatch) {
            return done(null, exhibitor);
        } else {
            return done(null, false, { message: 'Incorrect email or password' });
        }
    } catch (err) {
        return done(err);
    }
}));

passport.use('admin-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return done(null, false, { message: 'Incorrect email or password' });
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (isMatch) {
            return done(null, admin);
        } else {
            return done(null, false, { message: 'Incorrect email or password' });
        }
    } catch (err) {
        return done(err);
    }
}));

passport.use('jwt-visitor', new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret
}, async (payload, done) => {
    try {
        const visitor = await Visitor.findById(payload.sub);
        if (visitor) {
            return done(null, visitor);
        } else {
            return done(null, false);
        }
    } catch (err) {
        return done(err, false);
    }
}));

// Similar strategies for Exhibitor and Admin

exports.generateJWT = (user) => {
    const payload = {
        sub: user._id,
        email: user.email
        // Add more user info if needed
    };
    return jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
};

exports.authenticateVisitor = (req, res, next) => {
    passport.authenticate('visitor-login', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (!user) {
            return res.status(401).json({ message: 'Incorrect email or password' });
        }
        req.user = user;
        next();
    })(req, res, next);
};

exports.authenticateExhibitor = (req, res, next) => {
    passport.authenticate('exhibitor-login', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (!user) {
            return res.status(401).json({ message: 'Incorrect email or password' });
        }
        req.user = user;
        next();
    })(req, res, next);
};

exports.authenticateAdmin = (req, res, next) => {
    passport.authenticate('admin-login', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (!user) {
            return res.status(401).json({ message: 'Incorrect email or password' });
        }
        req.user = user;
        next();
    })(req, res, next);
};
