const mongoose = require('mongoose');

const ColorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hex: { type: String, required: true }, // e.g. #ff9900
});

module.exports = mongoose.models.Color || mongoose.model('Color', ColorSchema);
