const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
  make: String,
  model: String,
  price: Number,
  miles: Number,
  curr_owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' } // FK to Seller
});

module.exports = mongoose.model('Car', CarSchema);
