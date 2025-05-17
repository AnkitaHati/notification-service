// sendToQueue.js
const amqp = require('amqplib');

async function sendToQueue(notification) {
  try {
    const connection = await amqp.connect('amqp://guest:guest@localhost');
    const channel = await connection.createChannel();

    const queue = 'notifications';

    await channel.assertQueue(queue, { durable: true });

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(notification)), {
      persistent: true
    });

    console.log('📨 Sent to queue:', notification);

    // Close connection after a short delay
    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (err) {
    console.error('❌ Error sending to queue:', err);
  }
}

module.exports = sendToQueue;
