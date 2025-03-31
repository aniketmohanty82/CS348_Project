const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Buyer = require('../models/Buyer');
const Deal = require('../models/Deal'); // Import Deal model

// Create buyer
router.post('/', async (req, res) => {
  try {
    const buyer = new Buyer(req.body);
    await buyer.save();
    res.json(buyer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read all buyers
router.get('/', async (req, res) => {
  const buyers = await Buyer.find();
  res.json(buyers);
});

// Update buyer
router.put('/:id', async (req, res) => {
  const updated = await Buyer.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// Delete buyer with cascade deletion of related deals
router.delete('/:id', async (req, res) => {
  try {
    const buyerId = req.params.id;
    await Buyer.findByIdAndDelete(buyerId);
    // Delete all deals that reference this buyer
    //console.log(new mongoose.Types.ObjectId(buyerId));
    await Deal.deleteMany({ buyer_id: new mongoose.Types.ObjectId(buyerId) });
    res.json({ message: 'Buyer and related deals deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
