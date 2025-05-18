// worker.js
const amqp = require('amqplib');
const mongoose = require('mongoose');
const Notification = require('./models/notification');

// MongoDB connection
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Worker connected to MongoDB');
  startWorker(); // Start consuming once connected
}).catch(err => {
  console.error('❌ Worker MongoDB connection error:', err);
});

// Start RabbitMQ worker
async function startWorker() {
  try {
    const connection = await amqp.connect('amqp://guest:guest@localhost');
    const channel = await connection.createChannel();
    const queue = 'notifications';

    await channel.assertQueue(queue, { durable: true });
    console.log('👷 Worker is waiting for messages...');

    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const data = JSON.parse(msg.content.toString());
        console.log('📩 Received from queue:', data);

        try {
          // Uncomment to simulate a failure
          //throw new Error('Simulated failure');

          const savedNotification = new Notification({
            userId: data.userId,
            type: data.type,
            message: data.message,
            status: 'sent',
            timestamp: new Date()
          });

          await savedNotification.save();

          // Simulate sending
          switch (data.type) {
            case 'email':
              console.log(`📧 [Email] Sent to User ${data.userId}: ${data.message}`);
              break;
            case 'sms':
              console.log(`📱 [SMS] Sent to User ${data.userId}: ${data.message}`);
              break;
            case 'in-app':
              console.log(`💬 [In-App] Notification stored for User ${data.userId}`);
              break;
          }

          channel.ack(msg); // Success: mark message as processed
        } catch (err) {
          console.error('❌ Error processing message:', err.message);

          // Retry up to 3 times using custom header
          const retryCount = msg.properties.headers['x-retry'] || 0;

          if (retryCount < 3) {
            console.log(`🔁 Retrying... attempt ${retryCount + 1}`);

            // Re-queue message with incremented retry count
            channel.sendToQueue(queue, msg.content, {
              headers: { 'x-retry': retryCount + 1 },
              persistent: true
            });
          } else {
            console.error('⛔ Max retries reached. Discarding message.');
            // Optional: Save failed job to a "dead letter" database/collection
          }

          channel.ack(msg); // Acknowledge the original message either way
        }
      }
    }, { noAck: false });
  } catch (err) {
    console.error('❌ Worker failed to start:', err);
  }
}
