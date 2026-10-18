import { Request, Response } from 'express';
import { pushService } from '../services/push.service';

export class PushController {
  public async send(req: Request, res: Response) {
    const { to, title, body, data, sound, badge } = req.body;
    if (!title || !body) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_PAYLOAD', message: 'Title and body are required' },
      });
    }

    const result = await pushService.sendNotification({
      to,
      title,
      body,
      data,
      sound,
      badge,
    });

    return res.json({ success: true, data: result });
  }
}

export const pushController = new PushController();
