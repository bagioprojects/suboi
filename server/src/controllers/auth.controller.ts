import { Request, Response } from 'express';

export class AuthController {
  public login(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_INPUT', message: 'Email and password required' },
      });
    }

    const mockUser = {
      id: 'usr_001',
      email,
      fullName: 'Ahmet Yılmaz',
      role: 'client_admin',
      token: 'jwt_mock_hubio_' + Buffer.from(email).toString('base64'),
      company: {
        id: 'cli-001',
        title: 'NovaTech Bilişim A.Ş.',
      },
    };

    return res.json({ success: true, data: mockUser });
  }

  public register(req: Request, res: Response) {
    const { email, fullName, companyTitle } = req.body;
    const newUser = {
      id: 'usr_' + Date.now().toString(36),
      email,
      fullName,
      role: 'client_admin',
      token: 'jwt_mock_new_client',
      company: {
        id: 'cli_' + Date.now().toString(36),
        title: companyTitle || 'Bireysel Müşteri',
      },
    };

    return res.status(201).json({ success: true, data: newUser });
  }

  public forgotPassword(req: Request, res: Response) {
    const { email } = req.body;
    return res.json({
      success: true,
      data: {
        message: 'OTP 6-haneli kod e-posta adresinize gönderildi',
        email,
        expiresInSeconds: 60,
      },
    });
  }
}

export const authController = new AuthController();
