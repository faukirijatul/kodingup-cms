import { useCallback, useMemo, useState } from 'react';
import { STUDENT_STATUS } from '@/constants/student';
import { EnrolledStudentsTable } from '../EnrolledStudentsTable';
import { PendingStudentsTable } from '../PendingStudentsTable';
import { UpdateStudentStatusModal } from '../modals/UpdateStudentStatusModal';
import { DetailProfileStudentModal } from '../modals/DetailProfileStudentModal';

interface StudentsTableProps {
  selectedStatus: number;
}

export function StudentsTable({ selectedStatus }: StudentsTableProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');

  const [isDetailProfileModalOpen, setIsDetailProfileModalOpen] =
    useState(false);
  const [isUpdateStudentModalOpen, setIsUpdateStudentModalOpen] =
    useState(false);

  const isEnrolledTab = useMemo(() => {
    return selectedStatus === STUDENT_STATUS.ENROLLED;
  }, [selectedStatus]);

  const tableTitle = useMemo(() => {
    if (isEnrolledTab) {
      return 'Students';
    } else {
      return 'Pending Invitations';
    }
  }, [isEnrolledTab]);

  const handleOpenDetailProfileModal = useCallback((event: Event) => {
    const target = event.currentTarget as HTMLElement;
    const studentId = target.dataset.value;
    setSelectedStudentId(String(studentId));
    setIsDetailProfileModalOpen(true);
  }, []);

  const handleOpenUpdateStudentModal = useCallback((event: Event) => {
    const target = event.currentTarget as HTMLElement;
    const studentId = target.dataset.value;
    setSelectedStudentId(String(studentId));
    setIsUpdateStudentModalOpen(true);
  }, []);

  return (
    <section className="border-dark w-full rounded-lg border">
      {isEnrolledTab ? (
        <EnrolledStudentsTable
          tableTitle={tableTitle}
          handleOpenDetailProfileModal={handleOpenDetailProfileModal}
          handleOpenUpdateStudentModal={handleOpenUpdateStudentModal}
        />
      ) : (
        <PendingStudentsTable
          tableTitle={tableTitle}
          handleOpenUpdateStudentModal={handleOpenUpdateStudentModal}
        />
      )}

      {isDetailProfileModalOpen && (
        <DetailProfileStudentModal
          key={selectedStudentId}
          open={isDetailProfileModalOpen}
          onOpenChange={setIsDetailProfileModalOpen}
          selectedStudentId={selectedStudentId}
        />
      )}

      {isUpdateStudentModalOpen && (
        <UpdateStudentStatusModal
          key={selectedStudentId}
          open={isUpdateStudentModalOpen}
          onOpenChange={setIsUpdateStudentModalOpen}
        />
      )}
    </section>
  );
}
