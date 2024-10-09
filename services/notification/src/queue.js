const amqp =  require('amqplib');

let channel;

async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(
      process.env.RABBITMQ_URL || 'amqp://localhost'
    );

    channel = await connection.createChannel();
    console.log('Connected to RabbitMQ');

    return channel;
  } catch (error) {
    console.error('Failed to connect to RabbitMQ', error);
    throw error;
  }
}

async function consumeFromQueue(
  queue,
  callback,
) {
  if (!channel) {
    await connectRabbitMQ();
  }
  channel.assertQueue(queue, {durable: true});
  channel.consume(
    queue,
    async message => {
      if (message !== null) {
        await callback(message);
        channel.ack(message);
      }
    },
    {noAck: false}
  );
}

module.exports = { consumeFromQueue };