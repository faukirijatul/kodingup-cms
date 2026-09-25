import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { DashboardHeader } from '@/components/DashboardHeader';
import { PageHeader } from '@/components/PageHeader';
import { SegmentedControl } from '@/components/SegmentedControl';
import { Button } from '@/components/ui/button';
import { STUDENT_STATUS } from '@/constants/student';
import { InviteStudentModal } from './components/modals/InviteStudentModal';
import { StudentsTable } from './components/StudentsTable';

const STATUSES = [
  { label: 'Enrolled', value: STUDENT_STATUS.ENROLLED },
  { label: 'Pending', value: STUDENT_STATUS.PENDING },
];

export function StudentsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  useEffect(() => {
    if (!searchParams.get('status')) {
      setSearchParams(
        (prev) => {
          prev.set('status', String(STUDENT_STATUS.ENROLLED));
          return prev;
        },
        { replace: true },
      );
    }
  }, [searchParams, setSearchParams]);

  const selectedStatus = useMemo(() => {
    const statusParam = searchParams.get('status');
    return statusParam ? Number(statusParam) : STUDENT_STATUS.ENROLLED;
  }, [searchParams]);

  const currentStatusLabel = useMemo(() => {
    const status = STATUSES.find((s) => s.value === selectedStatus);
    return status ? status.label : 'Enrolled';
  }, [selectedStatus]);

  const breadcrumbs = useMemo(
    () => [
      { label: 'Students', href: '/students' },
      { label: currentStatusLabel },
    ],
    [currentStatusLabel],
  );

  const handleSelectSegmentOnStatusSegmentControl = useCallback(
    (status: number) => {
      setSearchParams(
        (prev) => {
          prev.set('status', String(status));
          return prev;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const handleOpenInviteModal = useCallback(() => {
    setIsInviteModalOpen(true);
  }, []);

  return (
    <div className="flex w-full flex-col">
      <DashboardHeader breadcrumbs={breadcrumbs} />
      <div className="flex w-full flex-col px-6 pb-6">
        <PageHeader
          title="Students"
          description="Track student progress and update student profiles"
        >
          <Button type="button" onClick={handleOpenInviteModal}>
            <Plus size={16} />
            Invite Student
          </Button>
        </PageHeader>

        <div className="flex w-full flex-col gap-10">
          <SegmentedControl
            segments={STATUSES}
            selectedSegment={selectedStatus}
            onSelectSegment={handleSelectSegmentOnStatusSegmentControl}
          />

          <StudentsTable selectedStatus={selectedStatus} />
        </div>
      </div>

      {isInviteModalOpen && (
        <InviteStudentModal
          open={isInviteModalOpen}
          onOpenChange={setIsInviteModalOpen}
        />
      )}
    </div>
  );
}
