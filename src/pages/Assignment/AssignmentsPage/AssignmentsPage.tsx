import { DashboardHeader } from '@/components/DashboardHeader';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AssignmentsTable } from './components/AssignmentsTable';

export function AssignmentsPage() {
  const navigate = useNavigate();
  const breadcrumbs = useMemo(() => [{ label: 'Assignments' }], []);

  const handleClickCreateAssignmentButton = useCallback(() => {
    navigate('form');
  }, [navigate]);

  return (
    <div className="flex w-full flex-col">
      <DashboardHeader breadcrumbs={breadcrumbs} />
      <div className="flex w-full flex-col px-6 pb-6">
        <PageHeader
          title="Assignments"
          description="Track your coursework progress and submissions"
        >
          <Button type="button" onClick={handleClickCreateAssignmentButton}>
            <Plus size={16} />
            Create Assignment
          </Button>
        </PageHeader>

        <AssignmentsTable />
      </div>
    </div>
  );
}
