import { useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DashboardHeader } from '@/components/DashboardHeader';
import { PageHeader } from '@/components/PageHeader';
import { DataSelect } from '@/components/DataSelect';
import { DEFAULT_PAGE_SIZE } from '@/constants/pagination';
import { useOrganizationOptions } from '@/hooks/dataOptions/useOrganizationOptions';
import { ScheduleCalendarContainer } from './components/ScheduleCalendarContainer';

export function SchedulePage() {
  const breadcrumbs = useMemo(() => [{ label: 'Schedule' }], []);

  const [searchParams, setSearchParams] = useSearchParams();

  const selectedOrgId = useMemo(() => {
    return searchParams.get('org') || '';
  }, [searchParams]);

  const {
    organizationOptions,
    page,
    searchQuery: orgSearchQuery,
    setPage,
    handleSearchOrgChange,
    isOrgsLoading,
    totalOrgs,
  } = useOrganizationOptions({
    selectedOrgId,
  });

  useEffect(() => {
    if (
      !selectedOrgId &&
      organizationOptions &&
      organizationOptions.length > 0 &&
      !isOrgsLoading
    ) {
      setSearchParams(
        (prev) => {
          prev.set('org', organizationOptions[0]?.value);
          return prev;
        },
        { replace: true },
      );
    }
  }, [selectedOrgId, organizationOptions, setSearchParams, isOrgsLoading]);

  const handleOrgChange = useCallback(
    (orgId: string) => {
      setSearchParams(
        (prev) => {
          prev.set('org', orgId);
          return prev;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return (
    <div className="flex w-full flex-col">
      <DashboardHeader breadcrumbs={breadcrumbs} />

      <div className="flex w-full flex-col px-6">
        <PageHeader
          title="Schedule"
          description="Manage sessions, assignments, and events"
        >
          <DataSelect
            searchable
            options={organizationOptions}
            value={selectedOrgId}
            onValueChange={handleOrgChange}
            placeholder="Select organization"
            searchPlaceholder="Search organization..."
            searchQuery={orgSearchQuery}
            onSearchChange={handleSearchOrgChange}
            pagination={{
              page: page,
              pageSize: DEFAULT_PAGE_SIZE,
              total: totalOrgs,
              onPageChange: setPage,
            }}
            isLoading={isOrgsLoading}
            contentClassName="w-50"
            align="end"
          />
        </PageHeader>
      </div>

      <div className="flex w-full px-6 pb-6">
        <ScheduleCalendarContainer selectedOrgId={selectedOrgId} />
      </div>
    </div>
  );
}
