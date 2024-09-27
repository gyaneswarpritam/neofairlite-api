// controllers/stallController.js
const ProductVisited = require('../models/ProductVisited');
const VisitedStall = require('../models/VisitedStall');
const { successResponse, notFoundResponse } = require('../utils/sendResponse');

exports.createVisitedStall = async (req, res) => {
    try {
        const { stall, visitor, exhibitor } = req.body;

        // Check if the combination already exists
        const existingData = await VisitedStall.findOne({ stall, visitor, exhibitor });

        if (existingData) {
            // If it exists, update the timestamp only
            existingData.updatedAt = new Date();
            await existingData.save();
            const successObj = successResponse('Stall Updated', existingData);
            return res.status(successObj.status).send(successObj);
        }

        // If not, create new data
        const visitedStallData = await VisitedStall.create(req.body);
        const successObj = successResponse('Stall Created', visitedStallData);
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


exports.getAllVisitedStallForVisitor = async (req, res) => {
    try {
        const visitedStalls = await VisitedStall.find({ visitor: req.params.visitorId })
            .populate({
                path: 'exhibitor',
                select: 'name companyName email phone' // Select only the fields you need
            })
            .populate({
                path: 'stall',
                select: 'stallName' // Select only the fields you need
            })
            .exec();
        if (!visitedStalls || visitedStalls.length === 0) {
            const successObj = successResponse('No visited stalls found for this visitor', []);
            res.status(successObj.status).send(successObj);
            return;
        }

        // Map the visited stalls to extract required information
        const stallList = visitedStalls.map(stall => ({
            exhibitor: stall.exhibitor.name,
            companyName: stall.exhibitor.companyName,
            exhibitorEmail: stall.exhibitor.email,
            exhibitorPhone: stall.exhibitor.phone,
            stallName: stall.stall.stallName,
            updatedAt: stall.updatedAt
        }));

        const successObj = successResponse('Visited Stall List', stallList);
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAllVisitedStallForExhibitor = async (req, res) => {
    try {
        const visitedStalls = await VisitedStall.find({ exhibitor: req.params.exhibitorId })
            .populate({
                path: 'visitor',
                select: 'name companyName email phone', // Select only the fields you need
                options: { strictPopulate: false }
            })
            .populate({
                path: 'stall',
                select: 'stallName', // Select only the fields you need
                options: { strictPopulate: false }
            })
            .exec();
        if (!visitedStalls || visitedStalls.length === 0) {
            const successObj = successResponse('No visited stalls found for this exhibitor', []);
            res.status(successObj.status).send(successObj);
            return;
        }
        // Filter out entries where the visitor is null (due to deletion)
        const filteredStalls = visitedStalls.filter(stall => stall.visitor !== null);

        // Map the visited stalls to extract required information
        const stallList = filteredStalls.map(stall => ({
            visitor: stall.visitor.name,
            companyName: stall.visitor.companyName,
            visitorEmail: stall.visitor.email,
            visitorPhone: stall.visitor.phone,
            updatedAt: stall.updatedAt
        }));

        const successObj = successResponse('Visited Stall List', stallList);
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getLiveVisitedStallForExhibitor = async (req, res) => {
    try {
        const visitedStalls = await VisitedStall.find({ exhibitor: req.params.exhibitorId })
            .populate({
                path: 'visitor',
                select: 'name companyName email phone loggedIn',
                match: { loggedIn: true } // Filter to retrieve only visitors who are logged in
            })
            .populate({
                path: 'stall',
                select: 'stallName'
            })
            .exec();

        if (!visitedStalls || visitedStalls.length === 0) {
            const successObj = successResponse('No visited stalls found for this exhibitor', []);
            res.status(successObj.status).send(successObj);
        }

        // Map the visited stalls to extract required information
        const stallList = visitedStalls.map(stall => ({
            visitor: stall.visitor.name,
            companyName: stall.visitor.companyName,
            visitorEmail: stall.visitor.email,
            visitorPhone: stall.visitor.phone,
            updatedAt: stall.updatedAt
        }));

        const successObj = successResponse('Visited Stall List', stallList);
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



exports.getStallById = async (req, res) => {
    try {
        const stall = await Stall.findById(req.params.id)

        if (!stall) {
            const notFoundObj = notFoundResponse('Stall entry not found for this exhibitor');
            res.status(notFoundObj.status).send(notFoundObj);
        } else {
            const productsList = await ProductsListModel.find({ stall: stall._id });
            const companyProfileList = await CompanyProfileListModel.find({ stall: stall._id });
            const galleryImageList = await GalleryImageListModel.find({ stall: stall._id });
            const galleryVideoList = await GalleryVideoListModel.find({ stall: stall._id });
            const stallVideoList = await StallVideoListModel.find({ stall: stall._id });

            const successObj = successResponse('Stall List', { stall, productsList, companyProfileList, galleryImageList, galleryVideoList, stallVideoList });
            res.status(successObj.status).send(successObj);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getStallByExhibitor = async (req, res) => {
    try {
        const stall = await Stall.findOne({ exhibitor: req.params.exhibitor })

        if (!stall) {
            const notFoundObj = notFoundResponse('Stall entry not found for this exhibitor');
            res.status(notFoundObj.status).send(notFoundObj);
        } else {
            const productsList = await ProductsListModel.find({ stall: stall._id });
            const companyProfileList = await CompanyProfileListModel.find({ stall: stall._id });
            const galleryImageList = await GalleryImageListModel.find({ stall: stall._id });
            const galleryVideoList = await GalleryVideoListModel.find({ stall: stall._id });
            const stallVideoList = await StallVideoListModel.find({ stall: stall._id });

            const successObj = successResponse('Stall List', { stall, productsList, companyProfileList, galleryImageList, galleryVideoList, stallVideoList });
            res.status(successObj.status).send(successObj);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateStall = async (req, res) => {
    try {
        const validatedData = schemaValidator(stallSchema, req.body);
        if (validatedData.success) {
            // Update stall
            const stall = await Stall.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!stall) {
                return res.status(404).json({ message: 'Stall entry not found' });
            }

            // Update products list
            await ProductsListModel.updateMany({ stall: stall._id }, { $set: { stall: stall._id } });

            // Update company profile list
            await CompanyProfileListModel.updateMany({ stall: stall._id }, { $set: { stall: stall._id } });

            // Update gallery image list
            await GalleryImageListModel.updateMany({ stall: stall._id }, { $set: { stall: stall._id } });

            // Update gallery video list
            await GalleryVideoListModel.updateMany({ stall: stall._id }, { $set: { stall: stall._id } });

            // Update stall video list
            await StallVideoListModel.updateMany({ stall: stall._id }, { $set: { stall: stall._id } });

            const successObj = successResponse('Stall updated', stall);
            res.status(successObj.status).send(successObj);
        } else {
            res.status(401).json({ message: validatedData.errors });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.updateStallPosition = async (req, res) => {
    try {
        // Update stall
        const stall = await Stall.findByIdAndUpdate(req.params.id, { position: req.body.position }, { new: true });
        if (!stall) {
            return res.status(404).json({ message: 'Stall entry not found' });
        }
        const successObj = successResponse('Stall updated', stall);
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


exports.deleteStall = async (req, res) => {
    try {
        const stall = await Stall.findByIdAndDelete(req.params.id);
        if (!stall) {
            return res.status(404).json({ message: 'Stall entry not found' });
        }

        // Delete associated collections
        await Promise.all([
            ProductsListModel.deleteMany({ stall: stall._id }),
            CompanyProfileListModel.deleteMany({ stall: stall._id }),
            GalleryImageListModel.deleteMany({ stall: stall._id }),
            GalleryVideoListModel.deleteMany({ stall: stall._id }),
            StallVideoListModel.deleteMany({ stall: stall._id })
        ]);

        res.json({ message: 'Stall entry and associated data deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.incrementProductVisitCount = async (req, res) => {
    const { stallId, productId, visitorId } = req.body;

    // Log incoming data for debugging
    console.log('Incoming Data:', { stallId, productId, visitorId });

    try {
        // Check if an entry already exists
        let visitEntry = await ProductVisited.findOne({
            stall: stallId,
            productList: productId,
            visitor: visitorId
        });

        if (visitEntry) {
            // If it exists, increment the visitedCount
            visitEntry.visitedCount += 1;
            await visitEntry.save();
        } else {
            // If it doesn't exist, create a new entry with visitedCount = 1
            visitEntry = new ProductVisited({
                stall: stallId,
                productList: productId,
                visitor: visitorId,
                visitedCount: 1
            });
            await visitEntry.save();
        }

        // Assuming successResponse is a utility function to format responses
        const successObj = successResponse('Product Visited', visitEntry);
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: 'Error updating visit count', error });
    }
};

