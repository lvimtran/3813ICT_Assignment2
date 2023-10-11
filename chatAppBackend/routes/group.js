const express = require('express');
const groupController = require('../controllers/group');
const router = express.Router();
const Group = require('../models/group')

router.post('/create', groupController.createGroup);

router.get('/', async (req, res) => {
    try {
        const groups = await Group.find({});
        const groupNames = groups.map(group => group.name);
        res.json(groupNames);
    } catch(err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/:groupName/channels', async (req, res) => {
    try {
        const group = await Group.findOne({ name: req.params.groupName });
        if (!group) {
            return res.status(404).send('Group not found');
        }

        const channelNames = group.channels.map(channel => channel.name);
        res.json(channelNames);
    } catch(err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
