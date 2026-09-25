import { DashboardHeader } from '@/components/DashboardHeader';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { MentorsList } from './components/MentorsList';
import { useNavigate } from 'react-router-dom';

export function MentorsPage() {
  const navigate = useNavigate();

  const breadcrumbs = useMemo(() => [{ label: 'Mentors' }], []);

  const handleClickCreateButton = useCallback(() => {
    navigate('form');
  }, [navigate]);

  return (
    <div className="flex w-full flex-col">
      <DashboardHeader breadcrumbs={breadcrumbs} />
      <div className="flex w-full flex-col px-6 pb-6">
        <PageHeader title="Mentor" description="Manage and update mentor">
          <Button type="button" onClick={handleClickCreateButton}>
            <Plus size={16} />
            Create Mentor
          </Button>
        </PageHeader>

        <MentorsList />
      </div>
    </div>
  );
}
