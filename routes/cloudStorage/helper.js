const AWS = require("aws-sdk");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
});

const uploadS3Image = (file) => {
  return new Promise((resolve, reject) => {
    const { originalname, buffer, mimetype } = file;
    var params = {
      Body: buffer,
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${uuidv4()}_${originalname}`,
    };
    s3.upload(params, (err, data) => {
      if (err) console.log(err, err.stack); // an error occurred
      else {
        resolve(data.Location);
      }
    });
  });
};

module.exports = { uploadS3Image };
