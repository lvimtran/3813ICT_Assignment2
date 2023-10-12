// routers/upload.js
const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } });

const {io} = require('../server')

router.post('/', upload.single('image'), (req, res) => {
  try {
      if (!req.file) {
          return res.status(400).json({ error: 'No file uploaded.' });
      }

      const image = req.file.buffer.toString('base64');
      const imageUrl = `data:${req.file.mimetype};base64,${image}`;

      // Ensure io is defined and emit event if applicable
      if (io) {
          io.emit('imageUploaded', { imageUrl });
      } else {
          console.error('io is undefined');
      }

      // Send response
      return res.status(200).json({ imageUrl });

  } catch (err) {
      console.error(err);
      
      // Ensure no response has been sent before sending error response
      if (!res.headersSent) {
          return res.status(500).json({ error: 'Server error' });
      }
  }
});



module.exports = router;
