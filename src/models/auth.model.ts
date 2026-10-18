import { z } from 'zod';

export type UserType = 'individual' | 'corporate';

export const LoginSchema = z.object({
  email: z.string().email('Geçerli bir kurumsal e-posta adresi giriniz'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
});

export const RegisterSchema = z.object({
  userType: z.enum(['individual', 'corporate']),
  fullName: z.string().min(3, 'Yetkili adı ve soyadı zorunludur'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
  phone: z.string().min(10, 'Geçerli bir telefon numarası giriniz'),
  // Kurumsal zorunlu alanlar
  companyTitle: z.string().optional(),
  taxNumber: z.string().optional(),
  authorizedPersonTitle: z.string().optional(),
}).refine((data) => {
  if (data.userType === 'corporate') {
    return !!data.companyTitle && data.companyTitle.length >= 3;
  }
  return true;
}, {
  message: 'Kurumsal firma unvanı zorunludur',
  path: ['companyTitle'],
}).refine((data) => {
  if (data.userType === 'corporate') {
    return !!data.taxNumber && data.taxNumber.length >= 10;
  }
  return true;
}, {
  message: 'Vergi kimlik numarası en az 10 haneli olmalıdır',
  path: ['taxNumber'],
});

export type LoginFormValues = z.infer<typeof LoginSchema>;
export type RegisterFormValues = z.infer<typeof RegisterSchema>;

export interface AuthUser {
  id: string;
  userType: UserType;
  fullName: string;
  email: string;
  phone: string;
  companyTitle?: string;
  taxNumber?: string;
  authorizedPersonTitle?: string;
  avatarUrl?: string;
  token: string;
}

export function mapUserDTO(raw: any, token: string): AuthUser {
  return {
    id: String(raw.id || 'usr_default'),
    userType: raw.userType === 'corporate' ? 'corporate' : 'individual',
    fullName: raw.fullName || 'Misafir Müşteri',
    email: raw.email || '',
    phone: raw.phone || '',
    companyTitle: raw.companyTitle,
    taxNumber: raw.taxNumber,
    authorizedPersonTitle: raw.authorizedPersonTitle || 'Yönetici',
    avatarUrl: raw.avatarUrl,
    token,
  };
}
