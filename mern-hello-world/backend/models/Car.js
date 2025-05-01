const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
  make: String,
  model: String,
  price: Number,
  miles: Number,
  curr_owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' } // FK to Seller
});

CarSchema.index({ curr_owner: 1 });
CarSchema.index({ price: 1 });
CarSchema.index({ miles: 1, price: 1 });

module.exports = mongoose.model('Car', CarSchema);
