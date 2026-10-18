import { useState, useEffect, useCallback } from 'react';
import { ChangelogItem, ChangeCategory } from '@/models/changelog.model';
import { changelogService } from '@/services/changelog.service';
import { notificationService } from '@/services/notification.service';

export function useChangelogController() {
  const [items, setItems] = useState<ChangelogItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchChangelog = useCallback(async () => {
    try {
      setLoading(true);
      const data = await changelogService.getChangelog();
      setItems(data);
    } catch (e) {
      console.warn('Changelog fetch error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChangelog();
  }, [fetchChangelog]);

  const filteredItems = items.filter((item) => {
    if (selectedCategory === 'ALL') return true;
    return item.category === selectedCategory;
  });

  const onOpenDeepLink = (path?: string) => {
    if (path) {
      notificationService.handleNotificationTap(path);
    }
  };

  return {
    items: filteredItems,
    allCount: items.length,
    selectedCategory,
    setSelectedCategory,
    loading,
    refresh: fetchChangelog,
    onOpenDeepLink,
  };
}
