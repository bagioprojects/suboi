import { Request, Response } from 'express';
import { backendDb } from '../services/database.service';

export class ProjectController {
  public getAll(req: Request, res: Response) {
    const projects = backendDb.getAllProjects();
    return res.json({
      success: true,
      data: projects,
      meta: { total: projects.length, timestamp: new Date().toISOString() },
    });
  }

  public getById(req: Request, res: Response) {
    const id = String(req.params.id);
    const project = backendDb.getProjectById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: `Project ${id} not found` },
      });
    }
    return res.json({ success: true, data: project });
  }

  public getFullVaultGraph(req: Request, res: Response) {
    const id = String(req.params.id);
    const graph = backendDb.getProjectFullGraph(id);
    if (!graph) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: `Vault graph for project ${id} not found` },
      });
    }
    return res.json({ success: true, data: graph });
  }
}

export const projectController = new ProjectController();
