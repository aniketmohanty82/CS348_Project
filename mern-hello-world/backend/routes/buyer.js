const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Buyer = require('../models/Buyer');
const Deal  = require('../models/Deal');

// Create buyer
router.post('/', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const [buyer] = await Buyer.create([req.body], { session });
    await session.commitTransaction();
    res.json(buyer);
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ error: err.message });
  } finally {
    session.endSession();
  }
});

// Read all buyers
router.get('/', async (req, res) => {
  const buyers = await Buyer.find();
  res.json(buyers);
});

// Update buyer
router.put('/:id', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const updated = await Buyer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, session }
    );
    if (!updated) throw new Error('Buyer not found');
    await session.commitTransaction();
    res.json(updated);
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ error: err.message });
  } finally {
    session.endSession();
  }
});

// Delete buyer with cascade deletion of related deals
router.delete('/:id', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const buyerId = req.params.id;
    const deleted = await Buyer.findByIdAndDelete(buyerId, { session });
    if (!deleted) throw new Error('Buyer not found');
    await Deal.deleteMany(
      { buyer_id: new mongoose.Types.ObjectId(buyerId) },
      { session }
    );
    await session.commitTransaction();
    res.json({ message: 'Buyer and related deals deleted' });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ error: err.message });
  } finally {
    session.endSession();
  }
});

module.exports = router;
