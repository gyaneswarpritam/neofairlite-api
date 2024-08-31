// controllers/likeController.js
const Like = require("../models/Like");
const ProductsList = require("../models/ProductsList");
const Stall = require("../models/Stall");
const { successResponse } = require("../utils/sendResponse");

exports.addLike = async (req, res) => {
    try {
        const { stallId, productListId, visitorId } = req.body;
        const like = await Like.findOneAndUpdate(
            { stall: stallId, productList: productListId, visitor: visitorId },
            { stall: stallId, productList: productListId, visitor: visitorId },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        res.status(201).json(like);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProductsAndLikeCounts = async (req, res) => {
    const { exhibitorId } = req.params;

    try {
        // Find the stall associated with the exhibitor
        const stall = await Stall.findOne({ exhibitor: exhibitorId });

        // If no stall is found, return an empty array
        if (!stall) {
            return res.status(200).json([]);
        }

        // Find all product lists associated with the stall
        const productLists = await ProductsList.find({ stall: stall._id });

        // If no product lists found, return an empty array
        if (!productLists || productLists.length === 0) {
            return res.status(200).json([]);
        }

        // For each product list, count the number of likes
        const productListsWithLikeCounts = await Promise.all(
            productLists.map(async (productList) => {
                const likeCount = await Like.countDocuments({ productList: productList._id });
                return {
                    ...productList._doc,
                    like: likeCount,
                };
            })
        );

        const successObj = successResponse('Like count', productListsWithLikeCounts)
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products and like counts', error });
    }
};
