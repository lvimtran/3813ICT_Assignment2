// const express = require('express');
// const router = express.Router();
// const { Group } = require('../models/group');

// // Get all groups
// router.get('/api/groups', async (req, res) => {
//   try {
//     const groups = await Group.find();
//     res.status(200).json(groups.map(group => group.name));
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Internal Server Error');
//   }
// });

// // Create a new group
// router.post('/api/groups', async (req, res) => {
//   try {
//     const newGroup = new Group(req.body);
//     const group = await newGroup.save();
//     res.status(201).json(group);
//   } catch (error) {
//     console.error('Error creating group:', error);
//     res.status(500).send('Server Error');
//   }
// });

// // Get channels of a group
// router.get('/api/groups/:groupName/channels', async (req, res) => {
//   try {
//     const group = await Group.findOne({ name: req.params.groupName });
//     if (!group) {
//       return res.status(404).send('Group not found');
//     }
//     res.status(200).json(group.channels);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Internal Server Error');
//   }
// });

// // Create a new channel in a group
// router.post('/api/groups/:groupName/channels', async (req, res) => {
//   try {
//     const group = await Group.findOne({ name: req.params.groupName });
//     if (!group) {
//       return res.status(404).send('Group not found');
//     }
//     group.channels.push(req.body.name);
//     await group.save();
//     res.status(201).json(group.channels);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Internal Server Error');
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();

// Basic data structure for storing groups and channels
const groups = {
    "General": ["Channel1", "Channel2"]
    // ... other groups
};

router.get('/', (req, res) => {
    res.json(Object.keys(groups));
});

router.post('/', (req, res) => {
    const { name } = req.body;
    if (groups[name]) {
        return res.status(400).json({ error: 'Group already exists' });
    }
    groups[name] = [];
    res.status(201).json({ message: 'Group created' });
});

router.get('/:groupName/channels', (req, res) => {
    const { groupName } = req.params;
    res.json(groups[groupName] || []);
});

router.post('/:groupName/channels/create', (req, res) => {
    const { groupName } = req.params;
    const { name } = req.body;

    if (!groups[groupName]) {
        return res.status(400).json({ error: 'Group does not exist' });
    }

    if (groups[groupName].includes(name)) {
        return res.status(400).json({ error: 'Channel already exists in the group' });
    }

    groups[groupName].push(name);
    res.status(201).json({ message: 'Channel created' });
});

module.exports = router;
