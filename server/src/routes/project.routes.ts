import { Router } from 'express';
import { projectController } from '../controllers/project.controller';

const router = Router();

router.get('/', (req, res) => projectController.getAll(req, res));
router.get('/:id', (req, res) => projectController.getById(req, res));
router.get('/:id/vault', (req, res) => projectController.getFullVaultGraph(req, res));

export const projectRouter = router;
