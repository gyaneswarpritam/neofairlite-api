// middleware/errorHandler.js
const ErrorLog = require('../models/ErrorLog');

const errorHandler = async (err, req, res, next) => {
    console.error(err);

    // Save error to MongoDB
    try {
        const errorLog = new ErrorLog({
            message: err.message,
            stack: err.stack
        });
        await errorLog.save();
    } catch (error) {
        console.error('Error saving error to MongoDB:', error);
    }

    // Send error response
    res.status(err.status || 500).json({ message: err.message });
};

module.exports = errorHandler;
