const express = require('express');
const groupController = require('../controllers/group');
const router = express.Router();

router.post('/create', groupController.createGroup);

// Additional routes (GET, PUT, DELETE) for groups to be defined here.

module.exports = router;
