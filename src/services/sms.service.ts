import { Message } from "../types/message";
import twilio from 'twilio';
import 'dotenv/config';

const accountSid = process.env.TWILIO_ACCOUNT_SID as string;
const authToken = process.env.TWILIO_AUTH_TOKEN as string;
const from = process.env.SMS_FROM as string;
const client = twilio(accountSid, authToken);

async function sendSMS(message: Message): Promise<void> {
    const { body, to } = JSON.parse(message.toString());
    const response = await client.messages.create({
        body,
        from,
        to
    });

    console.log(response.body);
}

export { sendSMS };
