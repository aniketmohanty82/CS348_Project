const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Deal = require('../models/Deal');

router.post('/', async (req, res) => {
  try {
    // Check if there's already a deal with this car_id
    const existingDeal = await Deal.findOne({ car_id: req.body.car_id });
    if (existingDeal) {
      return res.status(400).json({ error: 'This car is already involved in another deal.' });
    }
    
    const deal = new Deal(req.body);
    await deal.save();
    res.json(deal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read all deals with populated buyer, seller, and car
router.get('/', async (req, res) => {
  const deals = await Deal.find()
    .populate('buyer_id', 'name budget')
    .populate('seller_id', 'name email')
    .populate('car_id', 'make model price');
  res.json(deals);
});

// Update deal
router.put('/:id', async (req, res) => {
  const updated = await Deal.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// Delete deal
router.delete('/:id', async (req, res) => {
  await Deal.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deal deleted' });
});

module.exports = router;
