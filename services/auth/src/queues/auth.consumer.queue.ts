import {consumeFromQueue, sendToQueue} from '../services/queue.service';
import 'dotenv/config';
import * as jwtService from '../services/jwt.service';

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
  error?: { code: number, message: string };
}

async function validateToken(message: {content: Buffer}) {
  const content: TokenValidationMessage = JSON.parse(
    message.content.toString()
  );

  try {
    const {token, requestId} = content;
    const {sub, role} = await jwtService.verifyToken(token);

    // If token is valid, send a success response
    const successResponse: ValidationResponse = {
      requestId,
      status: 'success',
      user: {sub: sub.toString(), role },
    };
    await sendToQueue(RESPONSE_QUEUE, JSON.stringify(successResponse));

    console.log('Token validated successfully');
  } catch (error: any) {
    const errorResponse: ValidationResponse = {
      requestId: content.requestId,
      status: 'error',
      error: { message: error.message, code: 401 },
    };
    await sendToQueue(RESPONSE_QUEUE, JSON.stringify(errorResponse));

    console.error('Token validation failed:', error.message);
  }
}

async function startAuthConsumer() {
  await consumeFromQueue(AUTH_QUEUE, validateToken);
  console.log(`Listening for token validation requests on ${AUTH_QUEUE}`);
}

export default startAuthConsumer;
