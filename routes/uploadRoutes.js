const express = require('express');
const router = express.Router();
const multer = require('multer')
const cloudUploadHandler = require('./cloudStorage/handler');

const multerMid = multer({
    storage: multer.memoryStorage(),
    // limits: {
    //     // no larger than 11mb.
    //     fileSize: 11 * 1024 * 1024,
    // },
});

//router.get('/', aboutUsHandler.aboutUsDetailsHotel)

router.post('/uploadFile', multerMid.single('file'), cloudUploadHandler.uploadImageHandler)


module.exports = router;