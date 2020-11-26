// require
require('dotenv').config();

const AWS = require('aws-sdk');
const Multer = require('multer');
const MulterS3 = require('multer-s3');


const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: "ap-northeast-2",
});

const upload = Multer({
    storage: MulterS3({
        s3,
        bucket: 'almosdare',
        acl: 'public-read',
        metadata(req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key(req, file, cb) {
            cb(null, Date.now().toString() + '.jpg');
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
}).single('profileImage');

module.exports = upload;