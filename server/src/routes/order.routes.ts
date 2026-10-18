import { Router } from 'express';
import { orderController } from '../controllers/order.controller';

const router = Router();

router.get('/', (req, res) => orderController.getByClient(req, res));
router.post('/', (req, res) => orderController.create(req, res));

export const orderRouter = router;
