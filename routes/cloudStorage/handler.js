const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const uploadImage = require("./helper");

exports.uploadImageHandler = async function (req, res) {
  try {
    const myFile = req.file ? req.file : JSON.parse(req.body.file);

    const imageUrl = await uploadImage.uploadS3Image(myFile);
    res.status(200).json({
      message: "Upload was successful",
      data: imageUrl,
    });
  } catch (error) {
    console.log(error);
    var jsonResp = {};
    jsonResp.Success = false;
    jsonResp.Data = error;
    res.status(400).send(jsonResp);
  }
};
exports.uploadImageOffer = async function (req, res) {
  console.log(req.file);
  try {
    const myFile = req.file;
    const imageUrl = await uploadImage(myFile);
    var jsonResp = {
      status: true,
      originalName: "demoImage.jpg",
      width: "1600px",
      height: "200px",
      generatedName: "demoImage.jpg",
      msg: "Image upload successful",
      imageUrl: imageUrl,
    };

    res.status(200).json(jsonResp);
  } catch (error) {
    var jsonResp = {};
    jsonResp.Success = false;
    jsonResp.Data = error;
    res.status(400).send(jsonResp);
  }
};
