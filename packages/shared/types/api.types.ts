/**
 * Hubio Enterprise Monorepo - Shared API Contract Types
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    timestamp: string;
    executionTimeMs?: number;
  };
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface PushNotificationPayload {
  to?: string | string[]; // Expo Push Token or audience
  title: string;
  body: string;
  data?: {
    targetPath?: string;
    category?: 'commit' | 'seo' | 'approval' | 'system';
    [key: string]: any;
  };
  sound?: 'default' | 'success' | 'double_beep';
  badge?: number;
}
