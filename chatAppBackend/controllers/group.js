const Group = require('../models/group');

exports.createGroup = (req, res) => {
  const newGroup = new Group(req.body);
  newGroup.save((err, group) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(group);
  });
};