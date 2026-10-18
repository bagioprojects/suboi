import { useMemo } from 'react';
import { useAppStore } from '@/core/store/app.store';

export function useDashboardController() {
  const { projects, milestones, triggerWebhookNotification } = useAppStore();

  const summary = useMemo(() => {
    const activeCount = projects.length;
    const pendingCount = milestones.filter(
      (m) => m.status === 'pending_approval'
    ).length;
    const approvedCount = milestones.filter(
      (m) => m.status === 'approved'
    ).length;
    const avgProgress = Math.round(
      projects.reduce((acc, p) => acc + p.progressPercentage, 0) /
        (activeCount || 1)
    );

    return {
      activeProjectsCount: activeCount,
      completedTasksCount: 40 + approvedCount,
      pendingApprovalsCount: pendingCount,
      averageProgress: avgProgress,
      weeklyVelocity: '+%18 Verimlilik Artışı',
    };
  }, [projects, milestones]);

  const simulateNewDeployWebhook = () => {
    triggerWebhookNotification(
      'Git Push: Canlıya Alındı (v2.4.1)',
      'NovaTech B2B portalında sepet performansı %35 artırıldı.',
      '/(tabs)/changelog',
      'commit'
    );
  };

  const simulateSeoReportWebhook = () => {
    triggerWebhookNotification(
      'AI GEO Uyarısı: ChatGPT Alıntı Artışı 📈',
      'ChatGPT yanıtlarında markanız bugün 42 kez tavsiye edildi.',
      '/(tabs)/analytics',
      'seo'
    );
  };

  return {
    summary,
    projects,
    loading: false,
    refreshing: false,
    onRefresh: () => {},
    simulateNewDeployWebhook,
    simulateSeoReportWebhook,
  };
}
