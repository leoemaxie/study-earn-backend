import {Router} from 'express';
import * as paymentController from '@controllers/paymentMethod.controller';

const router = Router();

router.post('', paymentController.addPaymentMethod);
router.get('', paymentController.getPaymentMethod);
router.patch('', paymentController.updatePaymentMethod);
router.delete('', paymentController.deletePaymentMethod);

export default router;
