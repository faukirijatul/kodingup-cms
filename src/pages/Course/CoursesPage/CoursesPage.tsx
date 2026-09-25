import { useCallback, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { DashboardHeader } from '@/components/DashboardHeader';
import { CoursesTable } from './components/CoursesTable';
import { CreateCourseModal } from './components/modals/CreateCourseModal';

export function CoursesPage() {
  const [isCreateCourseModalOpen, setIsCreateCourseModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');

  const breadcrumbs = useMemo(() => [{ label: 'Courses' }], []);

  const handleOpenCreateCourseModal = useCallback(() => {
    setIsCreateCourseModalOpen(true);
  }, []);

  const handleOpenChange = (isOpen: boolean) => {
    setIsCreateCourseModalOpen(isOpen);
    if (!isOpen) {
      setSelectedCourseId('');
    }
  };

  return (
    <div className="flex w-full flex-col">
      <DashboardHeader breadcrumbs={breadcrumbs} />
      <div className="flex w-full flex-col px-6 pb-6">
        <PageHeader
          title="Courses"
          description="Manage course content, track progress, and schedule updates"
        >
          <Button type="button" onClick={handleOpenCreateCourseModal}>
            <Plus size={16} />
            Create Course
          </Button>
        </PageHeader>

        <CoursesTable
          open={isCreateCourseModalOpen}
          onOpenChange={handleOpenChange}
          selectedCourseId={selectedCourseId}
          setSelectedCourseId={setSelectedCourseId}
        />
      </div>

      {isCreateCourseModalOpen && (
        <CreateCourseModal
          key={selectedCourseId}
          open={isCreateCourseModalOpen}
          onOpenChange={handleOpenChange}
          selectedCourseId={selectedCourseId}
        />
      )}
    </div>
  );
}
