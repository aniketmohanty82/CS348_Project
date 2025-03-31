const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Car = require('../models/Car');
const Deal = require('../models/Deal'); // Import Deal model

// Create car
router.post('/', async (req, res) => {
  try {
    const car = new Car(req.body);
    await car.save();
    res.json(car);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read all cars (with owner info populated)
router.get('/', async (req, res) => {
  const cars = await Car.find().populate('curr_owner', 'name email');
  res.json(cars);
});

// Update car
router.put('/:id', async (req, res) => {
  const updated = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// Delete car with cascade deletion of related deals
router.delete('/:id', async (req, res) => {
  try {
    const carId = req.params.id;
    await Car.findByIdAndDelete(carId);
    // Delete all deals that reference this car
    await Deal.deleteMany({ car_id: new mongoose.Types.ObjectId(carId) });
    res.json({ message: 'Car and related deals deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
