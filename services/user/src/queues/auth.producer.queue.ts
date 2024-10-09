import dotenv from 'dotenv';
import { randomUUID } from 'crypto';
import { sendToQueue, consumeFromQueue } from '../services/queue.service';
import { Unauthorized } from '../utils/error';

dotenv.config();


const AUTH_QUEUE = process.env.AUTH_QUEUE || '';
const RESPONSE_QUEUE = process.env.RESPONSE_QUEUE || '';

interface TokenValidationMessage {
  token: string;
  requestId: string;
}

interface ValidationResponse {
  requestId: string;
  status: 'success' | 'error';
  user?: { sub: string, role: string };
  errors?: { code: number, message: string };
}

async function requestTokenValidation(token: string, cb: (user: ValidationResponse["user"]) => void) {
  const requestId = randomUUID();
  const message: TokenValidationMessage = { token, requestId };

  await sendToQueue(AUTH_QUEUE, JSON.stringify(message));
  console.log(`Sent token validation request with requestId: ${requestId}`);

  await consumeFromQueue(RESPONSE_QUEUE, async (msg: { content: Buffer }) => {
    const response: ValidationResponse = JSON.parse(msg.content.toString());

    if (response.requestId === requestId) {
      if (response.status === 'success') {
        console.log('Token validated successfully:', response);
        cb(response.user);
      } else {
        throw new Unauthorized(response.errors?.message);
      }
    }
  });
}

export default requestTokenValidation;