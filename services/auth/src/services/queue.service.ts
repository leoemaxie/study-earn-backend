import amqp from 'amqplib';

let channel: amqp.Channel;

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

async function sendToQueue(queue: string, message: string) {
  if (!channel) {
    await connectRabbitMQ();
  }
  channel.assertQueue(queue, {durable: true});
  channel.sendToQueue(queue, Buffer.from(message), {persistent: true});
  console.log(`Message sent to queue ${queue}: ${message}`);
}

interface ConsumeCallback {
  (message: amqp.ConsumeMessage): Promise<void>;
}

async function consumeFromQueue(
  queue: string,
  callback: ConsumeCallback
): Promise<void> {
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

export {sendToQueue, consumeFromQueue};
