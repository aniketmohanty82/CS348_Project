const express = require('express');
const router = express.Router();
const Seller = require('../models/Seller');
const Deal = require('../models/Deal'); // Import Deal model

// Create seller
router.post('/', async (req, res) => {
  try {
    const seller = new Seller(req.body);
    await seller.save();
    res.json(seller);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read all sellers
router.get('/', async (req, res) => {
  const sellers = await Seller.find();
  res.json(sellers);
});

// Update seller
router.put('/:id', async (req, res) => {
  const updated = await Seller.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// Delete seller with cascade deletion of related deals and update cars if needed
router.delete('/:id', async (req, res) => {
  try {
    const sellerId = req.params.id;
    await Seller.findByIdAndDelete(sellerId);
    // Delete all deals that reference this seller
    await Deal.deleteMany({ seller_id: new mongoose.Types.ObjectId(sellerId) });
    res.json({ message: 'Seller and related deals deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
