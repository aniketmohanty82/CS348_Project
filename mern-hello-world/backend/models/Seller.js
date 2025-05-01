const mongoose = require('mongoose');

const SellerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  phone: String
});

SellerSchema.index({ name: 1 });

module.exports = mongoose.model('Seller', SellerSchema);
