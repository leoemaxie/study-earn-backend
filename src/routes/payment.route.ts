import {Router} from 'express';
import * as paymentController from '@controllers/payment-method.controller';

const router = Router();

router.post('', paymentController.addPaymentMethod);
router.get(':id', paymentController.getPaymentMethod);
router.patch(':id', paymentController.updatePaymentMethod);
router.delete(':id', paymentController.deletePaymentMethod);

export default router;
