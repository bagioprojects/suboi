import { Router } from 'express';
import { documentController } from '../controllers/document.controller';

const router = Router();

router.get('/project/:projectId', (req, res) => documentController.getByProject(req, res));
router.post('/:id/sign', (req, res) => documentController.sign(req, res));
router.post('/:id/download', (req, res) => documentController.incrementDownload(req, res));

export const documentRouter = router;
