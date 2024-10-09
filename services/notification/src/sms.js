const twilio = require('twilio');
const consumeFromQueue = require('./queue');
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const queue = process.env.SMS_QUEUE || 'sms';
const client = twilio(accountSid, authToken);

async function sendSMS(message) {
  const { from, body, to } = JSON.parse(message.toString());
  const message = await client.messages.create({
    body,
    from,
    to
  });

  console.log(message.body);
}

async function startSMSConsumer() {
  await consumeFromQueue(queue, sendSMS);
  console.log('SMS consumer started');
}

module.exports = { startSMSConsumer };