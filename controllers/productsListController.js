// controllers/productsListController.js
const ProductsList = require('../models/ProductsList');
const { successResponse } = require('../utils/sendResponse');
const productSchema = require('../validators/productValidator');
const schemaValidator = require('../validators/schemaValidator');

exports.createProduct = async (req, res) => {
    try {
        const validatedData = schemaValidator(productSchema, req.body);
        if (validatedData.success) {
            const product = await ProductsList.create(validatedData.data);
            const successObj = successResponse('Product Created', product);
            res.status(successObj.status).send(successObj);
        } else {
            res.status(401).json({ message: validatedData.errors });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await ProductsList.find({});
        if (!products) {
            return res.status(404).json({ message: 'No products found' });
        }
        const successObj = successResponse('Products List', products);
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await ProductsList.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        // const validatedData = schemaValidator(productSchema, req.body);
        // if (validatedData.success) {
        const product = await ProductsList.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const successObj = successResponse('Products Updated', product);
        res.status(successObj.status).send(successObj);
        // } else {
        //     res.status(401).json({ message: validatedData.errors });
        // }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await ProductsList.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const successObj = successResponse('Product deleted', product);
        res.status(successObj.status).send(successObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
