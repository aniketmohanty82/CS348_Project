const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// Import your models
const Buyer = require('./models/Buyer');
const Seller = require('./models/Seller');
const Car = require('./models/Car');
const Deal = require('./models/Deal');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB for seeding'))
.catch(err => console.error('MongoDB connection error:', err));

async function seedDatabase() {
  try {
    // Clear existing data
    await Buyer.deleteMany({});
    await Seller.deleteMany({});
    await Car.deleteMany({});
    await Deal.deleteMany({});

    // Insert sample Buyers
    const buyers = await Buyer.insertMany([
      { name: "Alice", budget: 30000 },
      { name: "Bob", budget: 25000 }
    ]);
    console.log('Buyers seeded:', buyers);

    // Insert sample Sellers
    const sellers = await Seller.insertMany([
      { name: "CarCo", email: "contact@carco.com", phone: "555-1234" },
      { name: "AutoMart", email: "info@automart.com", phone: "555-5678" }
    ]);
    console.log('Sellers seeded:', sellers);

    // Insert sample Cars (assigning current owner from sellers)
    const cars = await Car.insertMany([
      { make: "Toyota", model: "Corolla", price: 20000, miles: 30000, curr_owner: sellers[0]._id },
      { make: "Honda", model: "Civic", price: 22000, miles: 25000, curr_owner: sellers[1]._id }
    ]);
    console.log('Cars seeded:', cars);

    // Insert sample Deals linking buyers, sellers, and cars
    const deals = await Deal.insertMany([
      { buyer_id: buyers[0]._id, seller_id: sellers[0]._id, car_id: cars[0]._id, deal_amt: 19500 },
      { buyer_id: buyers[1]._id, seller_id: sellers[1]._id, car_id: cars[1]._id, deal_amt: 21000 }
    ]);
    console.log('Deals seeded:', deals);

    console.log('Database seeded successfully!');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    mongoose.connection.close();
  }
}

seedDatabase();
