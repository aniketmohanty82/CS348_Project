const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Schema and Model
const MessageSchema = new mongoose.Schema({ text: String });
const Message = mongoose.model('Message', MessageSchema);
const buyerRoutes = require('./routes/buyer');
const sellerRoutes = require('./routes/seller');
const carRoutes = require('./routes/car');
const dealRoutes = require('./routes/deal');
const reportRoutes = require('./routes/report');

app.use('/api/report', reportRoutes);
app.use('/api/buyers', buyerRoutes);
app.use('/api/sellers', sellerRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/deals', dealRoutes);

// API to fetch message
app.get('/', async (req, res) => {
  try {
    let message = await Message.findOne();
    if (!message) {
      message = new Message({ text: 'Hello World from MongoDB!' });
      await message.save();
    }
    res.json({ message: message.text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Server Listening
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
