import 'dotenv/config';
import {Message} from '../types/message';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID || 'ACXXXXXXXXXXXX';
const authToken = process.env.TWILIO_AUTH_TOKEN || '';
const from = process.env.SMS_FROM as string;
const client = twilio(accountSid, authToken);

export async function sendSMS(message: Message): Promise<void> {
  const {body, to} = JSON.parse(message.toString());
  await client.messages.create({
    body,
    from,
    to,
  });
}
