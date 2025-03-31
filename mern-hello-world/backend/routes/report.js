const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.post('/', async (req, res) => {
  const { reportType, sellerName, buyerName, carMake, carModel, maxMileage, maxAmount } = req.body;
  const db = mongoose.connection.db;

  try {
    if (reportType === 'sellerCars' && sellerName) {
      // Look up seller by name
      const seller = await db.collection('sellers').findOne({ name: sellerName });
      if (!seller) return res.status(400).json({ error: 'Seller not found' });

      const pipeline = [
        { $match: { curr_owner: seller._id } },
        {
          $lookup: {
            from: 'sellers',
            localField: 'curr_owner',
            foreignField: '_id',
            as: 'owner'
          }
        },
        { $unwind: '$owner' },
        {
          $project: {
            _id: 1,
            make: 1,
            model: 1,
            price: 1,
            miles: 1,
            curr_owner: '$owner.name'
          }
        }
      ];

      const cars = await db.collection('cars').aggregate(pipeline).toArray();
      return res.json({ totalCars: cars.length, cars });
      
    } else if (reportType === 'buyerBudgetCars' && buyerName) {
      // Look up buyer by name
      const buyer = await db.collection('buyers').findOne({ name: buyerName });
      if (!buyer) return res.status(400).json({ error: 'Buyer not found' });
      const buyerBudget = buyer.budget;

      const pipeline = [
        { $match: { price: { $lte: buyerBudget } } },
        {
          $lookup: {
            from: 'sellers',
            localField: 'curr_owner',
            foreignField: '_id',
            as: 'owner'
          }
        },
        { $unwind: '$owner' },
        {
          $project: {
            _id: 1,
            make: 1,
            model: 1,
            price: 1,
            miles: 1,
            curr_owner: '$owner.name'
          }
        }
      ];

      const cars = await db.collection('cars').aggregate(pipeline).toArray();
      return res.json({ totalCars: cars.length, cars });
      
    } else if (reportType === 'mileageBudgetCars' && buyerName && maxMileage !== undefined) {
      // Look up buyer by name
      const buyer = await db.collection('buyers').findOne({ name: buyerName });
      if (!buyer) return res.status(400).json({ error: 'Buyer not found' });
      const buyerBudget = buyer.budget;

      const pipeline = [
        { 
          $match: { 
            miles: { $lte: Number(maxMileage) },
            price: { $lte: buyerBudget }
          } 
        },
        {
          $lookup: {
            from: 'sellers',
            localField: 'curr_owner',
            foreignField: '_id',
            as: 'owner'
          }
        },
        { $unwind: '$owner' },
        {
          $project: {
            _id: 1,
            make: 1,
            model: 1,
            price: 1,
            miles: 1,
            curr_owner: '$owner.name'
          }
        }
      ];

      const cars = await db.collection('cars').aggregate(pipeline).toArray();
      return res.json({ totalCars: cars.length, cars });
      
    } else if (reportType === 'dealsUnderAmount' && maxAmount !== undefined) {
      // Deals under a certain amount with lookups for buyer, seller, and car details
      const pipeline = [
        { $match: { deal_amt: { $lte: Number(maxAmount) } } },
        {
          $lookup: {
            from: 'buyers',
            localField: 'buyer_id',
            foreignField: '_id',
            as: 'buyer'
          }
        },
        { $unwind: '$buyer' },
        {
          $lookup: {
            from: 'sellers',
            localField: 'seller_id',
            foreignField: '_id',
            as: 'seller'
          }
        },
        { $unwind: '$seller' },
        {
          $lookup: {
            from: 'cars',
            localField: 'car_id',
            foreignField: '_id',
            as: 'car'
          }
        },
        { $unwind: '$car' },
        {
          $project: {
            _id: 1,
            deal_amt: 1,
            buyer: '$buyer.name',
            seller: '$seller.name',
            car: { make: '$car.make', model: '$car.model' }
          }
        }
      ];

      const deals = await db.collection('deals').aggregate(pipeline).toArray();
      return res.json({ totalDeals: deals.length, deals });
      
    } else if (reportType === 'carByModelMake' && carMake && carModel) {
      // Report: find a car by its make and model, with current owner name
      const pipeline = [
        { $match: { make: carMake, model: carModel } },
        {
          $lookup: {
            from: 'sellers',
            localField: 'curr_owner',
            foreignField: '_id',
            as: 'owner'
          }
        },
        { $unwind: '$owner' },
        {
          $project: {
            _id: 1,
            make: 1,
            model: 1,
            price: 1,
            miles: 1,
            curr_owner: '$owner.name'
          }
        }
      ];

      const car = await db.collection('cars').aggregate(pipeline).toArray();
      if (!car || car.length === 0) return res.status(400).json({ error: 'Car not found' });
      return res.json({ car: car[0] });
    } else {
      return res.status(400).json({ error: 'Invalid report parameters' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
