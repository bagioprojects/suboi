import {
  AuthUser,
  LoginFormValues,
  RegisterFormValues,
  mapUserDTO,
} from '@/models/auth.model';
import { appStorage } from '@/core/storage/storage';
import { userRepository } from './database/repositories/user.repository';
import { apiClient } from './api.client';

const USER_STORAGE_KEY = 'hubio_current_user';
const TOKEN_STORAGE_KEY = 'hubio_auth_token';

class AuthService {
  async getCurrentUser(): Promise<AuthUser | null> {
    const cachedUser = appStorage.getObject<AuthUser>(USER_STORAGE_KEY);
    if (cachedUser) return cachedUser;

    // Default corporate demo user from database if available
    const dbUser = userRepository.findByEmail('yonetim@novatech.com.tr');
    if (dbUser) {
      const defaultUser: AuthUser = {
        id: dbUser.id,
        userType: dbUser.userType,
        fullName: dbUser.fullName,
        email: dbUser.email,
        phone: dbUser.phone || '+90 532 100 2030',
        companyTitle: dbUser.companyTitle,
        taxNumber: dbUser.taxNumber,
        authorizedPersonTitle: 'Genel Müdür / CTO',
        avatarUrl: dbUser.avatarUrl,
        token: 'jwt_hubio_corp_session_2026',
      };
      appStorage.setObject(USER_STORAGE_KEY, defaultUser);
      appStorage.setString(TOKEN_STORAGE_KEY, defaultUser.token);
      return defaultUser;
    }

    const fallbackUser: AuthUser = {
      id: 'usr_corp_99',
      userType: 'corporate',
      fullName: 'Ahmet Yılmaz',
      email: 'ahmet.yilmaz@novatech.com.tr',
      phone: '+90 532 100 2030',
      companyTitle: 'NovaTech Bilişim & E-Ticaret A.Ş.',
      taxNumber: '6310928374',
      authorizedPersonTitle: 'Genel Müdür / CTO',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      token: 'jwt_hubio_corp_session_2026',
    };
    appStorage.setObject(USER_STORAGE_KEY, fallbackUser);
    appStorage.setString(TOKEN_STORAGE_KEY, fallbackUser.token);
    return fallbackUser;
  }

  async login(form: LoginFormValues): Promise<AuthUser> {
    // Check if user exists in database
    const existing = userRepository.findByEmail(form.email);
    const token = 'jwt_session_' + Math.random().toString(36).substring(2);

    if (existing) {
      const user = mapUserDTO({
        id: existing.id,
        userType: existing.userType,
        fullName: existing.fullName,
        email: existing.email,
        phone: existing.phone,
        companyTitle: existing.companyTitle,
        taxNumber: existing.taxNumber,
        authorizedPersonTitle: 'Yetkili Yönetici',
        avatarUrl: existing.avatarUrl,
      }, token);

      appStorage.setObject(USER_STORAGE_KEY, user);
      appStorage.setString(TOKEN_STORAGE_KEY, token);
      return apiClient.simulateRequest(user, 30);
    }

    const raw = {
      id: 'usr_' + Date.now(),
      userType: form.email.includes('firma') || form.email.includes('tech') ? 'corporate' : 'individual',
      fullName: 'Demir Kaan',
      email: form.email,
      phone: '+90 541 234 5678',
      companyTitle: 'Kaan Medya Grubu',
      taxNumber: '9840192834',
      authorizedPersonTitle: 'Kurucu Ortak',
    };

    // Save to local database
    userRepository.create({
      clientId: 'cli-001',
      email: raw.email,
      fullName: raw.fullName,
      companyTitle: raw.companyTitle,
      userType: raw.userType as any,
      taxNumber: raw.taxNumber,
      phone: raw.phone,
      role: 'client_admin',
    });

    const user = mapUserDTO(raw, token);
    appStorage.setObject(USER_STORAGE_KEY, user);
    appStorage.setString(TOKEN_STORAGE_KEY, token);

    return apiClient.simulateRequest(user, 30);
  }

  async register(form: RegisterFormValues): Promise<AuthUser> {
    const raw = {
      id: 'usr_' + Date.now(),
      userType: form.userType,
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      companyTitle: form.companyTitle,
      taxNumber: form.taxNumber,
      authorizedPersonTitle: form.authorizedPersonTitle || 'Yetkili',
    };

    // Save to local database
    userRepository.create({
      clientId: 'cli-001',
      email: raw.email,
      fullName: raw.fullName,
      companyTitle: raw.companyTitle,
      userType: raw.userType,
      taxNumber: raw.taxNumber,
      phone: raw.phone,
      role: 'client_admin',
    });

    const token = 'jwt_session_' + Math.random().toString(36).substring(2);
    const user = mapUserDTO(raw, token);

    appStorage.setObject(USER_STORAGE_KEY, user);
    appStorage.setString(TOKEN_STORAGE_KEY, token);

    return apiClient.simulateRequest(user, 30);
  }

  async logout(): Promise<void> {
    appStorage.delete(USER_STORAGE_KEY);
    appStorage.delete(TOKEN_STORAGE_KEY);
  }
}

export const authService = new AuthService();
