import { Request, Response } from 'express';
import { backendDb } from '../services/database.service';

export class DocumentController {
  public getByProject(req: Request, res: Response) {
    const projectId = String(req.params.projectId);
    const docs = backendDb.getDocumentsByProject(projectId);
    return res.json({ success: true, data: docs });
  }

  public sign(req: Request, res: Response) {
    const id = String(req.params.id);
    const { signedBy } = req.body;
    const updated = backendDb.signDocument(id, signedBy || 'Müşteri Yetkilisi');
    if (!updated) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Document not found' },
      });
    }
    return res.json({ success: true, data: updated });
  }

  public incrementDownload(req: Request, res: Response) {
    const id = String(req.params.id);
    const updated = backendDb.incrementDownload(id);
    if (!updated) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Document not found' },
      });
    }
    return res.json({ success: true, data: updated });
  }
}

export const documentController = new DocumentController();
