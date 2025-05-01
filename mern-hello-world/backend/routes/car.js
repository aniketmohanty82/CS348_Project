const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Car = require('../models/Car');
const Deal = require('../models/Deal');

// Create car
router.post('/', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const car = await Car.create([req.body], { session });
    await session.commitTransaction();
    res.json(car[0]);
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ error: err.message });
  } finally {
    session.endSession();
  }
});

// Read all cars (with owner info populated)
router.get('/', async (req, res) => {
  const cars = await Car.find()
    .populate('curr_owner', 'name email');
  res.json(cars);
});

// Update car
router.put('/:id', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const updated = await Car.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, session }
    );
    if (!updated) throw new Error('Car not found');
    await session.commitTransaction();
    res.json(updated);
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ error: err.message });
  } finally {
    session.endSession();
  }
});

// Delete car with cascade deletion of related deals
router.delete('/:id', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const carId = req.params.id;
    // 1. Delete the car
    const deleted = await Car.findByIdAndDelete(carId, { session });
    if (!deleted) throw new Error('Car not found');
    // 2. Cascade delete any deals referencing this car
    await Deal.deleteMany({ car_id: new mongoose.Types.ObjectId(carId) }, { session });
    await session.commitTransaction();
    res.json({ message: 'Car and related deals deleted' });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ error: err.message });
  } finally {
    session.endSession();
  }
});

module.exports = router;
