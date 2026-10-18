import { router } from 'expo-router';

class NotificationService {
  /**
   * Deep links to target screen in response to a push notification or in-app trigger.
   */
  handleNotificationTap(targetPath: string) {
    try {
      if (targetPath) {
        router.push(targetPath as any);
      }
    } catch (e) {
      console.warn('Failed to route notification:', e);
    }
  }
}

export const notificationService = new NotificationService();
