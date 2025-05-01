const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Seller = require('../models/Seller');
const Deal   = require('../models/Deal');

// Create seller
router.post('/', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const [seller] = await Seller.create([req.body], { session });
    await session.commitTransaction();
    res.json(seller);
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ error: err.message });
  } finally {
    session.endSession();
  }
});

// Read all sellers
router.get('/', async (req, res) => {
  const sellers = await Seller.find();
  res.json(sellers);
});

// Update seller
router.put('/:id', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const updated = await Seller.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, session }
    );
    if (!updated) throw new Error('Seller not found');
    await session.commitTransaction();
    res.json(updated);
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ error: err.message });
  } finally {
    session.endSession();
  }
});

// Delete seller with cascade deletion of related deals
router.delete('/:id', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const sellerId = req.params.id;
    const deleted = await Seller.findByIdAndDelete(sellerId, { session });
    if (!deleted) throw new Error('Seller not found');
    await Deal.deleteMany(
      { seller_id: new mongoose.Types.ObjectId(sellerId) },
      { session }
    );
    await session.commitTransaction();
    res.json({ message: 'Seller and related deals deleted' });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ error: err.message });
  } finally {
    session.endSession();
  }
});

module.exports = router;
