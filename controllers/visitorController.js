// controllers/visitorController.js
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Visitor = require('../models/Visitor');
const authService = require('../services/authService');
const { jwtSecret, base_url } = require('../config/config');
const schemaValidator = require('../validators/schemaValidator');
const { visitorSchema, visitorLoginSchema } = require('../validators/visitorValidator');
const { successResponse } = require('../utils/sendResponse');
const Exhibitor = require('../models/Exhibitor');
const Stall = require('../models/Stall');
const stripe = require('stripe')(process.env.STRIPE_SK_KEY);
const crypto = require('crypto'); // To generate OTP
const Otp = require('../models/otp');
const emailController = require('./emailController');
const { sendOtp } = require('../utils/otpService');

// Register a new visitor
exports.register = async (req, res) => {
    try {
        const { verification, email, phone, password } = req.body;

        // Check if verification method is email, and validate email and password presence
        if (verification === 'email') {
            if (!email || !password) {
                return res.status(400).json({ status: 0, message: 'Email and password are required for email verification' });
            }
        }

        // Check if verification method is SMS, and validate phone presence
        if (verification === 'sms') {
            if (!phone) {
                return res.status(400).json({ status: 0, message: 'Phone number is required for SMS verification' });
            }
        }

        // Validate the incoming request body based on the schema
        const validation = schemaValidator(visitorSchema, req.body);
        if (!validation.success) {
            return res.status(401).json({ message: validation.errors });
        }

        // Proceed with the logic after successful validation
        // Check if a visitor with the same email already exists
        if (email) {
            const existingVisitor = await Visitor.findOne({ email });
            if (existingVisitor) {
                return res.status(400).json({ status: 0, message: 'Email already exists' });
            }
        } else if (phone) {
            const existingVisitor = await Visitor.findOne({ phone });
            if (existingVisitor) {
                return res.status(400).json({ status: 0, message: 'Phone already exists' });
            }
        }

        // Hash the password if provided (only relevant for email verification)
        if (password) {
            req.body.password = await bcrypt.hash(password, 10);
        }

        // Create a new visitor entry
        const visitor = new Visitor(req.body);
        const visitorData = await visitor.save();

        // Send registration email if verification method is 'email'
        if (verification === 'email') {
            const baseUrl = req.protocol + '://' + req.get('host');
            await emailController.sendRegisteredMail(visitorData._id, baseUrl);
        }

        // Respond with a success message
        const successObj = successResponse('Visitor registered successfully', visitorData);
        res.status(successObj.status).send(successObj);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 0, message: 'Internal server error' });
    }
};

exports.verifyEmail = async (req, res) => {
    const { token } = req.query;

    try {
        // Find the visitor by the verification token
        const visitor = await Visitor.findOne({
            verificationToken: token,
            verificationTokenExpires: { $gt: Date.now() },
        });

        if (!visitor) {
            return res.status(400).send("Invalid or expired token");
        }

        // Update the visitor to mark email as verified
        visitor.isVerified = true;
        visitor.emailVerified = true;
        visitor.verificationToken = undefined; // Clear the token
        visitor.verificationTokenExpires = undefined;
        await visitor.save();

        const successObj = successResponse('Email verified successfully!', visitor)
        res.status(successObj.status).send(successObj);
    } catch (error) {
        console.error("Error verifying email:", error);
        res.status(500).send("An error occurred");
    }
}

// Login a visitor
exports.login = async (req, res) => {
    try {
        const validation = schemaValidator(visitorLoginSchema, req.body);

        if (validation.success) {
            const { email, password } = req.body;
            const visitor = await Visitor.findOne({ email, active: true, isVerified: true, emailVerified: true });

            if (!visitor) {
                return res.status(404).json({ status: 0, message: 'Email ID doesn’t exist. Please register.' });
            }

            const isMatch = await bcrypt.compare(password, visitor.password);
            if (isMatch) {
                const currentDate = new Date();
                const utcFormat = currentDate.toISOString();
                await Visitor.findByIdAndUpdate(visitor.id, {
                    loggedIn: true,
                    loggedInIP: req.body.loggedInIP,
                    loggedInTime: utcFormat
                }, { new: true });

                const payload = { id: visitor.id, email: visitor.email };
                jwt.sign(payload, jwtSecret, { expiresIn: '3650d' }, (err, token) => {
                    res.json({
                        success: true,
                        token: 'Bearer ' + token,
                        id: visitor.id,
                        name: visitor.name
                    });
                });
            } else {
                return res.status(400).json({ status: 0, message: 'Username/Password is incorrect' });
            }
        } else {
            res.status(401).json({ status: 0, message: validation.errors });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 0, message: 'Internal server error' });
    }
};

exports.loginByPhone = async (req, res) => {
    try {
        const { phone } = req.body;
        const visitor = await Visitor.findOne({ phone, active: true, isVerified: true, phoneVerified: true });

        if (!visitor) {
            return res.status(404).json({ status: 0, message: 'Your Phone Number is not yet verified. Please verify your phone to proceed.' });
        }

        const isMatch = phone == visitor.phone
        if (isMatch) {
            const currentDate = new Date();
            const utcFormat = currentDate.toISOString();
            await Visitor.findByIdAndUpdate(visitor.id, {
                loggedIn: true,
                loggedInIP: req.body.loggedInIP,
                loggedInTime: utcFormat
            }, { new: true });

            const payload = { id: visitor.id, phone: visitor.phone };
            jwt.sign(payload, jwtSecret, { expiresIn: '3650d' }, (err, token) => {
                res.json({
                    success: true,
                    token: 'Bearer ' + token,
                    id: visitor.id,
                    name: visitor.name
                });
            });
        } else {
            return res.status(400).json({ status: 0, message: 'Username/Phone is incorrect' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 0, message: 'Internal server error' });
    }
};


// Logout a loggedOut
exports.loggedOut = async (req, res) => {
    try {
        const loggedOutUpdate = await Visitor.findByIdAndUpdate(req.params.id, { loggedIn: false }, { new: true });
        if (loggedOutUpdate) {
            res.json({ success: true, message: "Logged out" });
        } else {
            res.status(401).json({ message: validation.errors });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getVisitorToVerify = async (req, res) => {
    try {
        const visitorId = req.params.id;
        const visitor = await Visitor.findById(visitorId);

        if (!visitor) {
            return res.status(404).json({ message: 'Visitor not found' });
        }

        // Checking if either email and password exist or phone exists
        const hasEmailAndPassword = visitor.email && visitor.password;
        const hasPhone = visitor.phone;

        const visitorData = {
            visitor,
            hasEmailAndPassword,
            hasPhone,
            isPhoneVerified: hasPhone && visitor.isVerified,  // Verification check
            isEmailVerified: hasEmailAndPassword && visitor.isVerified  // Verification check
        };
        const successObj = successResponse('Visitor Data', visitorData);
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching visitor data', error });
    }
};

exports.verifyVisitorProfile = async (req, res) => {
    try {
        const { email, phone, password } = req.body;
        const visitorId = req.params.id;

        // Fetch the visitor by ID
        const visitor = await Visitor.findById(visitorId);

        if (!visitor) {
            return res.status(404).json({ status: 0, message: 'Visitor not found' });
        }

        // Check if the email exists in the database for another visitor
        if (email) {
            const emailExists = await Visitor.findOne({ email, _id: { $ne: visitorId } });
            if (emailExists) {
                return res.status(400).json({ status: 0, message: 'Email already exists' });
            }
        }

        // Check if the phone number exists in the database for another visitor
        if (phone) {
            const phoneExists = await Visitor.findOne({ phone, _id: { $ne: visitorId } });
            if (phoneExists) {
                return res.status(400).json({ status: 0, message: 'Phone number already exists' });
            }
        }

        // Update the visitor's email and/or phone
        if (email) {
            visitor.email = email;

            // If password is provided, hash it and save
            if (password) {
                visitor.password = await bcrypt.hash(password, 10);
            }
        }

        if (phone) {
            visitor.phone = phone;
        }

        // Save the updated visitor
        const visitorData = await visitor.save();
        if (email) {
            const baseUrl = req.protocol + '://' + req.get('host');
            await emailController.sendRegisteredMail(visitorData._id, baseUrl);
        }
        const hasEmailAndPassword = visitor.email && visitor.password;
        const hasPhone = visitor.phone;

        const visitorInfo = {
            visitor,
            hasEmailAndPassword,
            hasPhone,
            isPhoneVerified: hasPhone && visitor.isVerified,  // Phone verification check
            isEmailVerified: hasEmailAndPassword && visitor.isVerified  // Email verification check
        };

        return res.status(200).send(successResponse('Visitor Data Updated Successfully', visitorInfo));
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error updating visitor data', error });
    }
};
exports.sendVerifyProfileEmailByLink = async (req, res) => {
    try {
        const baseUrl = req.protocol + '://' + req.get('host');
        await emailController.sendRegisteredMail(req.params.id, baseUrl);
        return res.status(200).json({ status: 1, message: 'Verification email sent.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error updating visitor data', error });
    }
}
// Get all visitors
exports.getAllVisitor = async (req, res) => {
    try {
        const visitors = await Visitor.find({});
        if (!visitors || visitors.length === 0) {
            return res.status(404).json({ message: 'No visitors found' });
        }
        const modifiedVisitors = visitors.map(visitor => ({
            _id: visitor._id,
            name: visitor.name,
            email: visitor.email,
            companyName: visitor.companyName,
        }));
        const successObj = successResponse('Visitor List', modifiedVisitors);
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllExhibitorHavingStall = async (req, res) => {
    try {
        // Find all stalls and get the unique list of exhibitor IDs
        const stalls = await Stall.find({}).select('exhibitor').lean();
        if (!stalls || stalls.length === 0) {
            return res.status(404).json({ message: 'No stalls found' });
        }

        const exhibitorIds = [...new Set(stalls.map(stall => stall.exhibitor))]; // Get unique exhibitor IDs

        // Find all exhibitors with the extracted IDs
        const exhibitors = await Exhibitor.find({ _id: { $in: exhibitorIds } });
        if (!exhibitors || exhibitors.length === 0) {
            return res.status(404).json({ message: 'No exhibitors found' });
        }

        const modifiedExhibitors = exhibitors.map(exhibitor => ({
            _id: exhibitor._id,
            name: exhibitor.name,
            email: exhibitor.email,
            companyName: exhibitor.companyName
        }));

        const successObj = successResponse('Exhibitor List', modifiedExhibitors);
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Get all visitors
exports.resetPassword = async (req, res) => {
    const { oldPassword, newPassword, visitorId } = req.body;

    try {
        // Find visitor by ID
        const visitor = await Visitor.findById(visitorId);
        if (!visitor) return res.status(404).json({ message: 'Visitor not found' });

        // Check if old password matches
        const isMatch = await bcrypt.compare(oldPassword, visitor.password);
        if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect' });


        const hashedPassword = await bcrypt.hash(newPassword, 10);
        // Update visitor's password
        visitor.password = hashedPassword;
        await visitor.save();

        res.status(200).json({ message: 'Password successfully reset' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

function generateRandomPassword(length = 8) {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specialChars = '!@#$%^&*()_+[]{}|;:,.<>?';

    let password = '';

    // Ensure at least one character from each required set
    password += uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
    password += lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += specialChars[Math.floor(Math.random() * specialChars.length)];

    // Fill the rest of the password length with random characters from all sets
    const allChars = uppercaseChars + lowercaseChars + numbers + specialChars;
    for (let i = password.length; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password to avoid predictable sequences
    password = password.split('').sort(() => 0.5 - Math.random()).join('');

    return password;
}

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if the email exists
        const visitor = await Visitor.findOne({ email });
        if (!visitor) {
            return res.status(404).json({ status: 0, message: 'Email not found' });
        }

        // Generate a random password
        const randomPassword = generateRandomPassword();

        // Hash the new password before saving (use bcrypt or similar)
        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        // Update the user's password
        visitor.password = hashedPassword;
        await visitor.save();

        // Send the new password to the user's email
        const forgot = await emailController.sendForgotPassword(visitor, randomPassword);
        // Respond with success message
        res.status(200).json({ status: 1, message: 'Password reset successfully. Please check your email.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 0, message: 'Internal server error' });
    }
};


// Get all chat visitors except the current visitor
exports.getAllChatVisitor = async (req, res) => {
    try {
        const visitors = await Visitor.find({ _id: { $ne: req.params.id }, active: true });
        if (!visitors || visitors.length === 0) {
            return res.status(404).json({ message: 'No visitors found' });
        }
        const modifiedVisitors = visitors.map(visitor => ({
            _id: visitor._id,
            name: visitor.name,
            email: visitor.email,
            companyName: visitor.companyName,
        }));
        const successObj = successResponse('Visitor List', modifiedVisitors);
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get count of all logged-in visitors
exports.getAllLoggedInVisitor = async (req, res) => {
    try {
        const visitorsCount = await Visitor.countDocuments({ loggedIn: true });
        const successObj = successResponse('Visitor Count', visitorsCount);
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get list of all logged-in visitors
exports.getAllLoggedInVisitorList = async (req, res) => {
    try {
        const visitors = await Visitor.find({ loggedIn: true });
        if (visitors.length === 0) {
            const successObj = notFoundResponse('No Visitor List');
            res.status(successObj.status).send(successObj);
            return;
        }
        const modifiedVisitors = visitors.map(visitor => ({
            _id: visitor._id,
            name: visitor.name,
            phone: visitor.phone,
            email: visitor.email,
            companyName: visitor.companyName,
            loggedInTime: visitor.loggedInTime,
            loggedInIP: visitor.loggedInIP
        }));
        const successObj = successResponse('Visitor List', modifiedVisitors);
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get list of all active (joined) visitors
exports.getAllJoinedVisitorList = async (req, res) => {
    try {
        const visitors = await Visitor.find({ active: true });
        if (visitors.length === 0) {
            const successObj = notFoundResponse('No Visitor List');
            res.status(successObj.status).send(successObj);
            return;
        }
        const modifiedVisitors = visitors.map(visitor => ({
            _id: visitor._id,
            name: visitor.name,
            phone: visitor.phone,
            email: visitor.email,
            companyName: visitor.companyName,
            loggedInTime: visitor.loggedInTime,
            loggedInIP: visitor.loggedInIP
        }));
        const successObj = successResponse('Visitor List', modifiedVisitors);
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get visitor by ID
exports.getVisitorById = async (req, res) => {
    try {
        const visitor = await Visitor.findById(req.params.id);
        if (!visitor) {
            return res.status(404).json({ message: 'Visitor entry not found' });
        }
        const modifiedVisitor = {
            _id: visitor._id,
            name: visitor.name,
            email: visitor.email,
            companyName: visitor.companyName,
        };
        res.status(200).json({ status: 1, visitor: modifiedVisitor });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getVisitorData = async (req, res) => {
    try {
        const visitor = await Visitor.find(req.body);
        if (visitor.length === 0) {
            return res.status(200).json({ status: 0, message: 'Visitor entry not found' });
        }
        res.status(200).json({ status: 1, visitor });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Request OTP for verification
exports.requestOtp = async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        if (!phoneNumber) {
            return res.status(400).json({ status: 0, message: 'Phone number is required' });
        }

        // Generate a random OTP (6 digits)
        const otp = crypto.randomInt(1000, 9999).toString();

        // Save OTP to the database
        const data = await Otp.findOneAndUpdate(
            { phoneNumber },
            { otp, createdAt: new Date() },
            { upsert: true, new: true }
        );
        if (data) {
            // Send OTP via SMS
            const result = await sendOtp(phoneNumber, otp);

            if (result.data.status == 'success') {
                return res.status(200).json({ status: 1, message: 'OTP sent successfully' });
            } else {
                return res.status(500).json({ status: 0, message: 'Something wrong' });
            }
        } else {
            return res.status(500).json({ status: 0, message: 'Something wrong' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 0, message: 'Internal server error' });
    }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
    try {
        const { phoneNumber, otp } = req.body;

        if (!phoneNumber || !otp) {
            return res.status(400).json({ status: 0, message: 'Phone number and OTP are required' });
        }

        // Retrieve OTP from the database
        const otpRecord = await Otp.findOne({ phoneNumber });

        if (!otpRecord) {
            return res.status(404).json({ status: 0, message: 'OTP record not found' });
        }

        if (otpRecord.otp === otp) {
            const visitor = await Visitor.findOne({
                phone: phoneNumber
            });

            if (!visitor) {
                return res.status(400).send("Invalid or expired token");
            }

            visitor.isVerified = true;
            visitor.phoneVerified = true;
            await visitor.save();
            return res.json({ status: 1, message: 'OTP verified successfully' });
        } else {
            return res.status(400).json({ status: 0, message: 'Invalid OTP' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 0, message: 'Internal server error' });
    }
};
