const express = require('express');
const multer = require('multer');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  }
});
const upload = multer({ storage });

router.post('/uploadAvatar', upload.single('avatar'), (req, res) => {
  try {
    res.send({ filePath: '/uploads/' + req.file.filename });
  } catch (error) {
    console.error(error);
    res.status(500).send('Upload failed');
  }
});

module.exports = router;
