const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const { jwtSecret } = require('../config/config');
// controllers/adminController.js
const Visitor = require('../models/Visitor');
const Exhibitor = require('../models/Exhibitor');
const { sendEmail } = require('../utils/emailService');
const { sendSMS } = require('../utils/smsService');
const adminSchema = require('../validators/adminValidator');
const schemaValidator = require('../validators/schemaValidator');
const emailController = require("./emailController");
const Stall = require('../models/Stall');
const ProductsList = require('../models/ProductsList');
const Review = require('../models/Review');
const Like = require('../models/Like');
const ProductVisited = require('../models/ProductVisited');
const { successResponse } = require('../utils/sendResponse');

exports.register = async (req, res) => {
    try {
        const validation = schemaValidator(adminSchema, req.body);
        if (validation.success) {
            const { email, password, username } = req.body;

            // Check if email is already registered
            const existingAdmin = await Admin.findOne({ email });
            if (existingAdmin) {
                return res.status(400).json({ message: 'Email already exists' });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create a new admin
            const admin = new Admin({
                email,
                password: hashedPassword,
                username,
            });

            // Save the admin to the database
            await admin.save();

            // Respond with success message
            res.status(201).json({ message: 'Admin registered successfully' });
        } else {
            res.status(401).json({ message: validation.errors });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const validation = schemaValidator(adminSchema, req.body);
        if (validation.success) {
            const { email, password } = req.body;

            // Find admin by email
            const admin = await Admin.findOne({ email, active: true });
            if (!admin) {
                return res.status(404).json({ message: 'Admin not found' });
            }

            // Check password
            const isMatch = await bcrypt.compare(password, admin.password);
            if (isMatch) {
                // Create JWT Payload
                const payload = {
                    id: admin.id,
                    email: admin.email
                };

                // Sign token
                jwt.sign(
                    payload,
                    jwtSecret,
                    { expiresIn: '3650d' },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: 'Bearer ' + token
                        });
                    }
                );
            } else {
                return res.status(400).json({ message: 'Username/Password is incorrect' });
            }
        } else {
            res.status(401).json({ message: validation.errors });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.fetchAllVisitor = async (req, res) => {
    try {
        const reqBody = req.body;
        const { active, blocked, reject } = req.query;
        const resultsPerPage =
            reqBody["itemPerPage"] > 0 ? reqBody["itemPerPage"] : 10;
        const page = reqBody["page"] >= 1 ? reqBody["page"] : 1;
        const skip = resultsPerPage * (page - 1);
        const search = {};
        search["_id"] = { $ne: req.authID };
        search["deleted"] = { $ne: true };
        if (reqBody["email"]) {
            search["email"] = reqBody["email"];
        }
        if (reqBody["name"]) {
            search["name"] = { $regex: reqBody["name"], $options: "i" };
        }
        if (reqBody["phone"]) {
            search["phone"] = reqBody["phone"];
        }
        if (active !== undefined) {
            search["active"] = active;
        }
        if (blocked !== undefined) {
            search["blocked"] = blocked;
        }
        if (reject !== undefined) {
            search["reject"] = reject;
        }
        const totalrecords = await Visitor.countDocuments(search);
        const records = await Visitor.find(search)
            .skip(skip)
            .limit(resultsPerPage)
            .lean();
        resp = {
            status: 200,
            message: "List of Visitors",
            data: records,
            totalCount: totalrecords,
            totalPages: parseInt(Math.ceil(totalrecords / resultsPerPage)),
        };
        res.status(resp.status).send(resp);
        // const allVisitors = await Visitor.find();
        // res.json({ data: allVisitors });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.fetchAllExhibitor = async (req, res) => {
    try {
        const reqBody = req.body;
        const { active, blocked, reject } = req.query;
        console.log(req.query, "itemPerPage")
        const resultsPerPage =
            reqBody["itemPerPage"] > 0 ? reqBody["itemPerPage"] : 10;
        const page = reqBody["page"] >= 1 ? reqBody["page"] : 1;
        const skip = resultsPerPage * (page - 1);
        const search = {};
        search["_id"] = { $ne: req.authID };
        search["deleted"] = { $ne: true };
        if (reqBody["email"]) {
            search["email"] = reqBody["email"];
        }
        if (reqBody["name"]) {
            search["name"] = { $regex: reqBody["name"], $options: "i" };
        }
        if (reqBody["phone"]) {
            search["phone"] = reqBody["phone"];
        }
        if (active !== undefined) {
            search["active"] = active;
        }
        if (blocked !== undefined) {
            search["blocked"] = blocked;
        }
        if (reject !== undefined) {
            search["reject"] = reject;
        }
        const totalrecords = await Exhibitor.countDocuments(search);
        const records = await Exhibitor.find(search)
            .skip(skip)
            .limit(resultsPerPage)
            .lean();
        resp = {
            status: 200,
            message: "List of Exhibitors",
            data: records,
            totalCount: totalrecords,
            totalPages: parseInt(Math.ceil(totalrecords / resultsPerPage)),
        };
        res.status(resp.status).send(resp);

        // const allExhibitors = await Exhibitor.find();
        // res.json({ data: allExhibitors });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.approveVisitor = async (req, res) => {
    const { visitorId } = req.params;
    try {
        const visitor = await Visitor.findByIdAndUpdate(visitorId, req.body, { new: true });
        if (!visitor) {
            return res.status(404).json({ message: 'Visitor not found' });
        }
        const emailData = await emailController.sendApprovalVisitorMail(visitor, passwordData);
        // await sendEmail(visitor.email, 'Approval Notification', 'Your registration has been approved.');
        // await sendSMS(visitor.phoneNumber, 'Congratulations! Your registration has been approved.');
        res.json({ message: 'Visitor approved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.approveExhibitor = async (req, res) => {
    const { exhibitorId } = req.params;
    try {
        const exhibitor = await Exhibitor.findByIdAndUpdate(exhibitorId, req.body, { new: true });
        if (!exhibitor) {
            return res.status(404).json({ message: 'Exhibitor not found' });
        }
        const emailData = await emailController.sendApprovalExhibitorMail(exhibitor);
        // await sendEmail(exhibitor.email, 'Approval Notification', 'Your registration has been approved.');
        // await sendSMS(exhibitor.phoneNumber, 'Congratulations! Your registration has been approved.');
        res.json({ message: 'Exhibitor approved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAllExhibitorsWithProductDetails = async (req, res) => {
    try {
        // Fetch all stalls
        const stalls = await Stall.find({});

        // For each stall, find all product lists and their details
        const productsWithDetails = await Promise.all(
            stalls.map(async (stall) => {
                // Find all product lists associated with the stall
                const productLists = await ProductsList.find({ stall: stall._id });

                // For each product list, calculate like count, average review, and total visit count
                return Promise.all(
                    productLists.map(async (productList) => {
                        // Count likes
                        const likeCount = await Like.countDocuments({ productList: productList._id });

                        // Calculate average review rating
                        const reviews = await Review.find({ productList: productList._id });
                        const reviewSum = reviews.reduce((sum, review) => sum + review.review, 0);
                        const reviewCount = reviews.length;
                        const averageReview = reviewCount > 0 ? reviewSum / reviewCount : 0;

                        // Calculate total visit count
                        const visits = await ProductVisited.find({ productList: productList._id });
                        const totalVisitCount = visits.reduce((sum, visit) => sum + visit.visitedCount, 0);

                        return {
                            ...productList._doc,
                            stallName: stall.stallName,
                            like: likeCount,
                            review: averageReview,
                            totalVisitCount
                        };
                    })
                );
            })
        );

        // Flatten the array of arrays
        const flattenedProductsWithDetails = productsWithDetails.flat();

        const successObj = successResponse('Products with details', flattenedProductsWithDetails);
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products with details', error });
    }
};


// exports.getAllExhibitorsWithProductDetails = async (req, res) => {
//     try {
//         // Fetch all exhibitors
//         const exhibitors = await Exhibitor.find({});

//         // For each exhibitor, fetch their respective stall and product details
//         const exhibitorsWithProductDetails = await Promise.all(
//             exhibitors.map(async (exhibitor) => {
//                 // Find the stall associated with the exhibitor
//                 const stall = await Stall.findOne({ exhibitor: exhibitor._id });

//                 // If no stall is found, skip to the next exhibitor
//                 if (!stall) {
//                     return {
//                         ...exhibitor._doc,
//                         products: []
//                     };
//                 }

//                 // Find all product lists associated with the stall
//                 const productLists = await ProductsList.find({ stall: stall._id });

//                 // For each product list, calculate like count, average review, and total visit count
//                 const productsWithDetails = await Promise.all(
//                     productLists.map(async (productList) => {
//                         // Count likes
//                         const likeCount = await Like.countDocuments({ productList: productList._id });

//                         // Calculate average review rating
//                         const reviews = await Review.find({ productList: productList._id });
//                         const reviewSum = reviews.reduce((sum, review) => sum + review.review, 0);
//                         const reviewCount = reviews.length;
//                         const averageReview = reviewCount > 0 ? reviewSum / reviewCount : 0;

//                         // Calculate total visit count
//                         const visits = await ProductVisited.find({ productList: productList._id });
//                         const totalVisitCount = visits.reduce((sum, visit) => sum + visit.visitedCount, 0);

//                         return {
//                             ...productList._doc,
//                             like: likeCount,
//                             review: averageReview,
//                             totalVisitCount
//                         };
//                     })
//                 );

//                 return {
//                     ...exhibitor._doc,
//                     products: productsWithDetails
//                 };
//             })
//         );

//         const successObj = successResponse('Exhibitors with product details', exhibitorsWithProductDetails);
//         res.status(successObj.status).send(successObj);
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: 'Error fetching exhibitors with product details', error });
//     }
// };