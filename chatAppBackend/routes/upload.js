// routers/upload.js
const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

const storage = multer.memoryStorage();  // Using memory storage. Consider using diskStorage for actual file storage.
const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } });  // Limiting file size to 5MB as an example.

router.post('/', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }

        const image = req.file.buffer.toString('base64');  
        res.status(200).json({ message: 'Image uploaded successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
