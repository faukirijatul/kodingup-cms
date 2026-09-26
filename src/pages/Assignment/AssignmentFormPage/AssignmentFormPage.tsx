import { DashboardHeader } from '@/components/DashboardHeader';
import { PageHeader } from '@/components/PageHeader';
import { useGetAssignment } from '@/hooks/assignments/useGetAssignment';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AssignmentForm } from './components/AssignmentForm';
import { AssignmentFormSkeleton } from './components/AssignmentFormSkeleton';

export function AssignmentFormPage() {
  const [searchParams] = useSearchParams();

  const assignmentId = useMemo(
    () => searchParams.get('assignmentId'),
    [searchParams],
  );

  const breadcrumbs = useMemo(
    () => [
      { label: 'Assignments', href: '/assignments' },
      ...(assignmentId
        ? [
            {
              label: String(assignmentId),
              href: '/assignments/' + assignmentId,
            },
          ]
        : []),
      { label: assignmentId ? 'Edit' : 'Create' },
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

      {isAssignmentLoading && assignmentId ? (
        <AssignmentFormSkeleton />
      ) : (
        <>
          <div className="flex w-full flex-col px-6">
            <PageHeader
              title={assignmentId ? 'Edit assignment' : 'Create assignment'}
              description={
                assignmentId
                  ? 'Update assignment details and content.'
                  : 'Track your coursework progress and submissions.'
              }
            />
          </div>

          <AssignmentForm assignment={assignment?.data} />
        </>
      )}
    </div>
  );
}
