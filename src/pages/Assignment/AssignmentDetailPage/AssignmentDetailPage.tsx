import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { DashboardHeader } from '@/components/DashboardHeader';
import { useGetAssignment } from '@/hooks/assignments/useGetAssignment';
import { AssignmentDetailHeader } from './components/AssignmentDetailHeader';
import { AssignmentDetailContent } from './components/AssignmentDetailContent';
import { AssignmentDetailSkeleton } from './components/AssignmentDetailSkeleton';
import { AssignmentStatus } from './components/AssignmentStatus';

export function AssignmentDetailPage() {
  const { assignmentId } = useParams<{ assignmentId: string }>();

  const breadcrumbs = useMemo(
    () => [
      { label: 'Assignments', href: '/assignments' },
      { label: assignmentId || '' },
    ],
    [assignmentId],
  );

  const { data: assignment, isLoading: isAssignmentLoading } = useGetAssignment(
    assignmentId || '',
    {
      enabled: !!assignmentId,
    },
  );

  return (
    <div className="flex w-full flex-col">
      <DashboardHeader breadcrumbs={breadcrumbs} />

      {isAssignmentLoading ? (
        <AssignmentDetailSkeleton />
      ) : (
        <>
          <AssignmentDetailHeader assignment={assignment?.data} />

          <div className="flex w-full items-start justify-between gap-7.5 px-6 pb-6">
            <AssignmentDetailContent assignment={assignment?.data} />
            <AssignmentStatus assignment={assignment?.data} />
          </div>
        </>
      )}
    </div>
  );
}
