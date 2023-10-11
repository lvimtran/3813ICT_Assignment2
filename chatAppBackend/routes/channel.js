const express = require('express');
const channelController = require('../controllers/channel');
const router = express.Router();

router.post('/create', channelController.createChannel);

// Additional routes (GET, PUT, DELETE) for channels to be defined here.

module.exports = router;
