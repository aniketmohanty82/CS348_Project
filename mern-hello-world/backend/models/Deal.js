const mongoose = require('mongoose');

const DealSchema = new mongoose.Schema({
  buyer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Buyer', required: true },
  seller_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  car_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true, unique: true },
  deal_amt: { type: Number, required: true }
});

module.exports = mongoose.model('Deal', DealSchema);
