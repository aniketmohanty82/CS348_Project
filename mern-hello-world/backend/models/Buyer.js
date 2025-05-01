const mongoose = require('mongoose');

const BuyerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  budget: { type: Number, required: true }
});

BuyerSchema.index({ name: 1 });

module.exports = mongoose.model('Buyer', BuyerSchema);
