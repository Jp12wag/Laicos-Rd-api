const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  diocese: { type: String, required: true },
  parish: { type: String, required: true },
  movement: { type: String, required: true },
});

const Member = mongoose.model('Member', memberSchema);

module.exports = Member;
