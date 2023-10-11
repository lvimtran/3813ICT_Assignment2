// uploadController.js
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const path = require('path');

// Load environment variables
require('dotenv').config();
const YOUR_MONGO_URI = process.env.MONGO_URI;

const storage = new GridFsStorage({ 
  url: YOUR_MONGO_URI,
  file: (req, file) => {
    return {
      filename: `file_${Date.now()}`,
      bucketName: 'uploads'
    };
  }
});

// Validate file type
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
};

const upload = multer({ 
  storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5000000 } // limit file size to 5MB
}).single('image'); // accept single file upload with field name 'image'

exports.uploadImage = (req, res) => {
  upload(req, res, (err) => {
    if(err) {
      // Handle error
      res.status(400).json({ error: err });
    } else {
      if(req.file == undefined) {
        // Handle error if no file is selected
        res.status(400).json({ error: 'No File Selected' });
      } else {
        // Success
        res.status(200).json({ filename: req.file.filename });
      }
    }
  });
};
