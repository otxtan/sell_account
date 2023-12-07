const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
// import {v2 as cloudinary} from 'cloudinary';

cloudinary.config({
  cloud_name: 'dkjmpndg5',
  api_key: '781124361327325',
  api_secret: '5uWGWbwQDbVxvr0iZWGaZVX3vsk'
});
          


const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ['jpg', 'png'],
  filename: function (req, file, cb) {
    cb(null, file.originalname); 
  }
});
console.log()

const uploadCloud = multer({ storage });

module.exports = uploadCloud;
