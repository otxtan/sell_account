
var router = require("express").Router();
const fileUploader = require('../config/cloudinary.config');

router.post('/cloudinary-upload', fileUploader.single('file'), (req, res, next) => {
  if (!req.file) {
    next(new Error('No file uploaded!'));
    return;
  }
 
  res.send({ secure_url: req.file.path });
});
router.get('/cloudinary-upload1', (req, res) => {
    res.send('hehe')
  });

module.exports = router;
