import { Router } from 'express';
import { pushController } from '../controllers/push.controller';

const router = Router();

router.post('/send', (req, res) => pushController.send(req, res));

export const pushRouter = router;
