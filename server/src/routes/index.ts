import { Router } from 'express';
import { projectRouter } from './project.routes';
import { documentRouter } from './document.routes';
import { authRouter } from './auth.routes';
import { orderRouter } from './order.routes';
import { pushRouter } from './push.routes';

const masterRouter = Router();

masterRouter.use('/projects', projectRouter);
masterRouter.use('/documents', documentRouter);
masterRouter.use('/auth', authRouter);
masterRouter.use('/orders', orderRouter);
masterRouter.use('/push', pushRouter);

export const apiV1Router = masterRouter;
