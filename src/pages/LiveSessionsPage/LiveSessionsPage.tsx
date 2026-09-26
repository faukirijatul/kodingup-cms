import { DashboardHeader } from '@/components/DashboardHeader';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { LiveSessionsTable } from './components/LiveSessionsTable';
import { CreateLiveSessionModal } from './components/modals/CreateLiveSessionModal';

export function LiveSessionsPage() {
  const [isCreateLiveSessionModalOpen, setIsCreateLiveSessionModalOpen] =
    useState(false);
  const [selectedLiveSessionId, setSelectedLiveSessionId] = useState('');

  const breadcrumbs = useMemo(() => [{ label: 'Live Sessions' }], []);

  const handleOpenCreateLiveSessionModal = useCallback(() => {
    setIsCreateLiveSessionModalOpen(true);
  }, []);

  const handleOpenChange = (isOpen: boolean) => {
    setIsCreateLiveSessionModalOpen(isOpen);
    if (!isOpen) {
      setSelectedLiveSessionId('');
    }
  };

  return (
    <div className="flex w-full flex-col">
      <DashboardHeader breadcrumbs={breadcrumbs} />
      <div className="flex w-full flex-col px-6 pb-6">
        <PageHeader
          title="Live Sessions"
          description="Manage and update live sessions"
        >
          <Button type="button" onClick={handleOpenCreateLiveSessionModal}>
            <Plus size={16} />
            Create Live Session
          </Button>
        </PageHeader>

        <LiveSessionsTable
          open={isCreateLiveSessionModalOpen}
          onOpenChange={handleOpenChange}
          selectedLiveSessionId={selectedLiveSessionId}
          setSelectedLiveSessionId={setSelectedLiveSessionId}
        />
      </div>

      {isCreateLiveSessionModalOpen && (
        <CreateLiveSessionModal
          key={selectedLiveSessionId}
          open={isCreateLiveSessionModalOpen}
          onOpenChange={handleOpenChange}
          selectedLiveSessionId={selectedLiveSessionId}
        />
      )}
    </div>
  );
}
