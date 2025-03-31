const mongoose = require('mongoose');

const BuyerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  budget: { type: Number, required: true }
});

module.exports = mongoose.model('Buyer', BuyerSchema);
