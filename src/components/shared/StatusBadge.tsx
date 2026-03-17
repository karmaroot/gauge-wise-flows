import { cn } from '@/lib/utils';
import { REPORT_STATUS_CONFIG, OBSERVATION_STATUS_CONFIG } from '@/lib/constants';
import type { ReportStatus, ObservationStatus } from '@/types/database';

interface StatusBadgeProps {
  status: ReportStatus | ObservationStatus;
  type?: 'report' | 'observation';
}

export function StatusBadge({ status, type = 'report' }: StatusBadgeProps) {
  const config = type === 'report'
    ? REPORT_STATUS_CONFIG[status as ReportStatus]
    : OBSERVATION_STATUS_CONFIG[status as ObservationStatus];

  if (!config) return null;

  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', config.className)}>
      {config.label}
    </span>
  );
}
