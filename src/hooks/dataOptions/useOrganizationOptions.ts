import { useCallback, useMemo, useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import { organizationHttpKeys } from '@/configs/httpKeys';
import { HttpService } from '@/services/http';
import { useListOrganizations } from '../organizations/useListOrganizations';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@/constants/pagination';

interface UseOrganizationOptionsProps {
  selectedOrgId?: string;
  selectedOrgIds?: string[];
  includeAllOption?: boolean;
}

export function useOrganizationOptions({
  selectedOrgId,
  selectedOrgIds = [],
  includeAllOption = false,
}: UseOrganizationOptionsProps = {}) {
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [searchQuery, setSearchQuery] = useState('');

  const normalizedSelectedIds = useMemo(() => {
    const ids = [...selectedOrgIds];
    if (selectedOrgId) {
      ids.push(selectedOrgId);
    }
    return Array.from(new Set(ids));
  }, [selectedOrgId, selectedOrgIds]);

  const { data: organizationsData, isLoading: isOrgsLoading } =
    useListOrganizations({
      query: searchQuery,
      offset: (page - DEFAULT_PAGE) * DEFAULT_PAGE_SIZE,
      limit: DEFAULT_PAGE_SIZE,
    });

  const list = useMemo(
    () => organizationsData?.data || [],
    [organizationsData],
  );

  const missingOrgIds = useMemo(() => {
    if (!normalizedSelectedIds.length) return [];
    const currentIds = new Set(list.map((org) => org.id));
    return normalizedSelectedIds.filter((id) => id && !currentIds.has(id));
  }, [list, normalizedSelectedIds]);

  const missingOrgsQueries = useQueries({
    queries: missingOrgIds.map((id) => ({
      queryKey: organizationHttpKeys.getOrganization(id),
      queryFn: () => HttpService.getOrganization(id),
      enabled: !!id,
    })),
  });

  const isMissingOrgsLoading = missingOrgsQueries.some(
    (query) => query.isLoading,
  );

  const missingOrgsData = useMemo(() => {
    return missingOrgsQueries
      .map((query) => query.data?.data)
      .filter((org): org is NonNullable<typeof org> => Boolean(org));
  }, [missingOrgsQueries]);

  const organizationOptions = useMemo(() => {
    let mergedList = [...list];

    if (missingOrgsData.length > 0) {
      const existingIds = new Set(mergedList.map((org) => org.id));
      const extraOrgs = missingOrgsData.filter(
        (org) => !existingIds.has(org.id),
      );
      mergedList = [...extraOrgs, ...mergedList];
    }

    const options = mergedList.map((org) => ({
      value: org.id,
      label: org.name,
    }));

    if (includeAllOption) {
      return [{ value: '', label: 'All Organizations' }, ...options];
    }

    return options;
  }, [list, missingOrgsData, includeAllOption]);

  const handleSearchOrgChange = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(DEFAULT_PAGE);
  }, []);

  return {
    organizationOptions,
    page,
    searchQuery,
    setPage,
    handleSearchOrgChange,
    isOrgsLoading: isOrgsLoading || isMissingOrgsLoading,
    totalOrgs: organizationsData?.meta.total || 0,
  };
}
