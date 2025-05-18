const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const Notification = require('./models/notification'); // Mongoose model
const sendToQueue = require('./sendToQueue'); // RabbitMQ producer
require('dotenv').config(); // Load environment variables from .env

const app = express();
const port = 3000;

app.use(bodyParser.json());

// ✅ Secure MongoDB connection string
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ Could not connect to MongoDB:', err));

// POST /notifications - Add to queue
app.post('/notifications', async (req, res) => {
  const { userId, type, message } = req.body;

  if (!userId || !type || !message) {
    return res.status(400).json({ error: 'userId, type, and message are required.' });
  }

  const validTypes = ['email', 'sms', 'in-app'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ error: 'Invalid notification type.' });
  }

  const notification = {
    userId,
    type,
    message,
    status: 'pending',
    timestamp: new Date().toISOString()
  };

  try {
    await sendToQueue(notification);
    res.status(201).json({
      message: 'Notification added to queue.',
      notification
    });
  } catch (err) {
    console.error('❌ Failed to send to queue:', err);
    res.status(500).json({ error: 'Failed to enqueue notification.' });
  }
});

// GET /users/:id/notifications - Fetch from MongoDB
app.get('/users/:id/notifications', async (req, res) => {
  try {
    const userId = req.params.id;
    const userNotifications = await Notification.find({ userId });

    res.status(200).json({
      userId,
      notifications: userNotifications,
    });
  } catch (error) {
    console.error('❌ Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Health check
app.get('/', (req, res) => {
  res.send('✅ Notification Service Running');
});

// Start server
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
