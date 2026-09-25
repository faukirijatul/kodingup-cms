import { Search } from 'lucide-react';
import { DataSelect } from '@/components/DataSelect';
import { Input } from '@/components/ui/input';
import { useOrganizationOptions } from '@/hooks/dataOptions/useOrganizationOptions';
import { DEFAULT_PAGE_SIZE } from '@/constants/pagination';

interface StudentsTableFiltersProps {
  searchQuery: string;
  handleSearchValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedOrgId: string;
  handleOrgChange: (value: string) => void;
}

export function StudentsTableFilters({
  searchQuery,
  handleSearchValueChange,
  selectedOrgId,
  handleOrgChange,
}: StudentsTableFiltersProps) {
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
    includeAllOption: true,
  });

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search by name or email"
          value={searchQuery}
          onChange={handleSearchValueChange}
          className="h-8.5 w-68 pl-8.25 text-[13px]"
        />
        <Search className="text-muted absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
      </div>

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
    </div>
  );
}
