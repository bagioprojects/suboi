/**
 * Hubio Enterprise Monorepo - Shared API Constants
 */

export const API_CONSTANTS = {
  DEFAULT_PORT: 5000,
  API_PREFIX: '/api/v1',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      ME: '/auth/me',
      FORGOT_PASSWORD: '/auth/forgot-password',
      VERIFY_OTP: '/auth/verify-otp',
      RESET_PASSWORD: '/auth/reset-password',
    },
    PROJECTS: {
      LIST: '/projects',
      DETAIL: (id: string) => `/projects/${id}`,
      FULL_GRAPH: (id: string) => `/projects/${id}/vault`,
      CREATE: '/projects',
      UPDATE: (id: string) => `/projects/${id}`,
      PROGRESS: (id: string) => `/projects/${id}/progress`,
    },
    DOCUMENTS: {
      LIST: '/documents',
      BY_PROJECT: (projectId: string) => `/projects/${projectId}/documents`,
      SIGN: (id: string) => `/documents/${id}/sign`,
      DOWNLOAD: (id: string) => `/documents/${id}/download`,
    },
    MEDIA: {
      LIST: '/media',
      BY_PROJECT: (projectId: string) => `/projects/${projectId}/media`,
    },
    ORDERS: {
      LIST: '/orders',
      CREATE: '/orders',
      UPDATE_STATUS: (id: string) => `/orders/${id}/status`,
    },
    PUSH: {
      SEND: '/push/send',
      AUDIENCES: '/push/audiences',
    },
    HEALTH: '/health',
  },
};
