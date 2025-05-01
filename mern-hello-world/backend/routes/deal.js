// routes/deal.js
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Deal = require('../models/Deal');

// --- CONCURRENT‐SAFE CREATE ---
router.post('/', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { buyer_id, seller_id, car_id, deal_amt } = req.body;

    // 1) inside txn, check if a deal already exists for this car
    const existingDeal = await Deal.findOne({ car_id }).session(session);
    if (existingDeal) {
      throw new Error('This car is already involved in another deal.');
    }

    // 2) create the deal
    const [deal] = await Deal.create(
      [{ buyer_id, seller_id, car_id, deal_amt }],
      { session }
    );

    await session.commitTransaction();
    res.json(deal);

  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ error: err.message });
  } finally {
    session.endSession();
  }
});

// --- READ ALL (unchanged) ---
router.get('/', async (req, res) => {
  const deals = await Deal.find()
    .populate('buyer_id', 'name budget')
    .populate('seller_id', 'name email')
    .populate('car_id', 'make model price');
  res.json(deals);
});

// --- UPDATE (unchanged) ---
router.put('/:id', async (req, res) => {
  const updated = await Deal.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// --- DELETE (unchanged) ---
router.delete('/:id', async (req, res) => {
  await Deal.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deal deleted' });
});

module.exports = router;
