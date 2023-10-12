const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  channel: { type: String, required: true },
  type: { type: String, required: true, enum: ['text', 'image'] },
  imageUrl: { type: String }
}, { timestamps: true }); // Consider adding timestamps for sorting

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
