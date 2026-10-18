import { useMemo } from 'react';
import { ProjectMilestone, UpdatePeriod } from '@/models/project.model';
import { useAppStore } from '@/core/store/app.store';

export function useProjectTrackerController() {
  const {
    milestones,
    selectedPeriod,
    setSelectedPeriod,
    approveMilestone,
    requestRevision,
  } = useAppStore();

  const filteredMilestones = useMemo(() => {
    return milestones.filter((m) => m.period === selectedPeriod);
  }, [milestones, selectedPeriod]);

  const onApproveMilestone = (id: string) => {
    approveMilestone(id);
  };

  const onRequestRevision = (id: string, note: string) => {
    requestRevision(id, note);
  };

  return {
    selectedPeriod,
    setSelectedPeriod,
    milestones: filteredMilestones,
    allMilestones: milestones,
    loading: false,
    actionLoadingId: null,
    onApproveMilestone,
    onRequestRevision,
    refresh: () => {},
  };
}
