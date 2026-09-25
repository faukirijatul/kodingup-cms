import { DashboardHeader } from '@/components/DashboardHeader';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { OrganizationsTable } from './components/OrganizationsTable';
import { CreateOrganizationModal } from './components/CreateOrganizationModal';

export function OrganizationsPage() {
  const [isCreateOrganizationModalOpen, setIsCreateOrganizationModalOpen] =
    useState(false);
  const [selectedOrganizationId, setSelectedOrganizationId] =
    useState<string>('');

  const breadcrumbs = useMemo(() => [{ label: 'Organizations' }], []);

  const handleOpenCreateOrganizationModal = useCallback(() => {
    setIsCreateOrganizationModalOpen(true);
  }, []);

  const handleOpenChange = (isOpen: boolean) => {
    setIsCreateOrganizationModalOpen(isOpen);
    if (!isOpen) {
      setSelectedOrganizationId('');
    }
  };

  return (
    <div className="flex w-full flex-col">
      <DashboardHeader breadcrumbs={breadcrumbs} />
      <div className="flex w-full flex-col px-6 pb-6">
        <PageHeader
          title="Organization"
          description="Manage and update organization"
        >
          <Button type="button" onClick={handleOpenCreateOrganizationModal}>
            <Plus size={16} />
            Create Organization
          </Button>
        </PageHeader>

        <OrganizationsTable
          open={isCreateOrganizationModalOpen}
          onOpenChange={handleOpenChange}
          selectedOrganizationId={selectedOrganizationId}
          setSelectedOrganizationId={setSelectedOrganizationId}
        />
      </div>

      {isCreateOrganizationModalOpen && (
        <CreateOrganizationModal
          key={selectedOrganizationId}
          open={isCreateOrganizationModalOpen}
          onOpenChange={handleOpenChange}
          selectedOrganizationId={selectedOrganizationId}
        />
      )}
    </div>
  );
}
