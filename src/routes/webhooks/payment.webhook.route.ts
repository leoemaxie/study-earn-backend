import {Router} from 'express';
import {handleSuccessfulPayment} from '../../webhooks/payment.webhook';

const router = Router();

router.post('/success', handleSuccessfulPayment);

export default router;
