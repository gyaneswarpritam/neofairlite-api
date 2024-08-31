const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
    {
        stall: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Stall",
            required: true
        },
        productList: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ProductsList",
            required: true
        },
        visitor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Visitor",
            required: true
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Like", likeSchema);
