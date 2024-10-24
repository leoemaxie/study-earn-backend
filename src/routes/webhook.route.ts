import {Router} from 'express';
import * as calendlyWebhook from '@webhooks/calendly.webhook';
import * as paymentWebhook from '@webhooks/payment.webhook';

const router = Router();

router.post('/calendly', calendlyWebhook.calendlyWebhook);
router.post('/payment/success', paymentWebhook.handleSuccessfulPayment);

export default router;
