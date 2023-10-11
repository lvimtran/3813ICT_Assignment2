const Channel = require('../models/channel');

exports.createChannel = (req, res) => {
  const newChannel = new Channel(req.body);
  newChannel.save((err, channel) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(channel);
  });
};