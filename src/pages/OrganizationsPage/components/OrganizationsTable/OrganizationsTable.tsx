import React, { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MoreVertical, Search } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pagination } from '@/components/Pagination';
import { useListOrganizations } from '@/hooks/organizations/useListOrganizations';
import { EmptyTableRow } from '@/components/EmptyTableRow';
import { useDeleteOrganization } from '@/hooks/organizations/useDeleteOrganization';
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@/constants/pagination';
import { IconTrash } from '@/components/icons/IconTrash';
import { IconPencilLine } from '@/components/icons/IconPencilLine';
import { CreateOrganizationModal } from '../CreateOrganizationModal';
import { OrganizationsTableSkeleton } from './OrganizationsTableSkeleton';

interface OrganizationTableProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedOrganizationId: string;
  setSelectedOrganizationId: (organizationId: string) => void;
}

export function OrganizationsTable({
  open,
  onOpenChange,
  selectedOrganizationId,
  setSelectedOrganizationId,
}: OrganizationTableProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [organizationToDeleteId, setOrganizationToDeleteId] =
    useState<string>('');

  const page = useMemo(() => {
    const pageParam = searchParams.get('page');
    return pageParam ? Number(pageParam) : DEFAULT_PAGE;
  }, [searchParams]);

  const pageSize = useMemo(() => {
    const pageSizeParam = searchParams.get('pageSize');
    return pageSizeParam ? Number(pageSizeParam) : DEFAULT_PAGE_SIZE;
  }, [searchParams]);

  const searchQuery = useMemo(() => {
    const query = searchParams.get('query') || '';
    return query;
  }, [searchParams]);

  const debouncedSearchQuery = useDebounce(searchQuery);

  const handleSearchValueChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const query = event.target.value;
      setSearchParams(
        (prev) => {
          if (query) {
            prev.set('query', query);
          } else {
            prev.delete('query');
          }
          return prev;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setSearchParams(
        (prev) => {
          prev.set('page', String(page));
          return prev;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const handlePageSizeChange = useCallback(
    (pageSize: number) => {
      setSearchParams(
        (prev) => {
          prev.set('pageSize', String(pageSize));
          prev.set('page', String(DEFAULT_PAGE));
          return prev;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const { data: organizations, isLoading: isOrganizationsLoading } =
    useListOrganizations({
      query: debouncedSearchQuery,
      offset: (page - DEFAULT_PAGE) * pageSize,
      limit: pageSize,
    });

  const totalOrganizations = useMemo(() => {
    return organizations?.meta.total || 0;
  }, [organizations]);

  const totalOrganizationPages = useMemo(() => {
    return Math.ceil(totalOrganizations / pageSize);
  }, [pageSize, totalOrganizations]);

  const handleOpenUpdateOrganizationModal = useCallback(
    (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      const organizationId = target.dataset.value;
      setSelectedOrganizationId(String(organizationId));
      onOpenChange(true);
    },
    [onOpenChange, setSelectedOrganizationId],
  );

  const { mutate: deleteOrganization, isPending: isDeleting } =
    useDeleteOrganization({
      onSuccess: () => {
        toast.success('Organization deleted successfully');
        setIsDeleteModalOpen(false);
      },
      onError: (error) => {
        console.error(error);
        toast.error('Failed to delete organization');
      },
    });

  const handleOpenDeleteModal = useCallback((e: Event) => {
    const target = e.currentTarget as HTMLElement;
    const organizationId = target.dataset.value;
    if (organizationId) {
      setOrganizationToDeleteId(String(organizationId));
      setIsDeleteModalOpen(true);
    }
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (organizationToDeleteId) {
      deleteOrganization(organizationToDeleteId);
    }
  }, [organizationToDeleteId, deleteOrganization]);

  return (
    <section className="border-dark rounded-lg border">
      <div className="border-dark flex h-18.75 items-center justify-between rounded-t-lg border-b p-5">
        <p className="text-white-primary text-sm leading-5 font-normal">
          Organizations ({totalOrganizations})
        </p>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search by name"
              value={searchQuery}
              onChange={handleSearchValueChange}
              className="h-8.5 w-68 pl-8.25 text-[13px]"
            />
            <Search className="text-muted absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          </div>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-90 text-[13px]">
              Organization Name
            </TableHead>
            <TableHead className="border-dark w-35 border-l text-[13px]">
              Created date
            </TableHead>
            <TableHead className="border-dark w-12 border-l" />
          </TableRow>
        </TableHeader>

        {isOrganizationsLoading ? (
          <OrganizationsTableSkeleton rowCount={pageSize} />
        ) : (
          <TableBody>
            {organizations?.data?.map((organization) => (
              <TableRow key={organization.id} className="h-18.25">
                <TableCell>{organization.name}</TableCell>

                <TableCell>
                  {format(organization.createdAt, 'EEE, MMM dd, yyyy')}
                </TableCell>
                <TableCell>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <button
                        type="button"
                        className="hover:text-white-primary text-muted hover:bg-dark flex h-8 w-8 cursor-pointer items-center justify-center rounded-md"
                        aria-label="More actions"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                      <DropdownMenu.Content
                        align="end"
                        sideOffset={8}
                        className="bg-bg-primary border-dark z-50 min-w-38 overflow-hidden rounded-lg border p-2 shadow-lg"
                      >
                        <DropdownMenu.Item
                          onSelect={handleOpenUpdateOrganizationModal}
                          data-value={organization.id}
                          className="text-white-primary hover:bg-dark focus:bg-dark flex cursor-pointer items-center gap-2 rounded-[6px] px-2 py-1.5 text-sm leading-5 transition-colors outline-none"
                        >
                          <IconPencilLine />
                          Edit Organization
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          onSelect={handleOpenDeleteModal}
                          data-value={organization.id}
                          className="text-red hover:bg-dark focus:bg-dark flex cursor-pointer items-center gap-2 rounded-[6px] px-2 py-1.5 text-sm leading-5 transition-colors outline-none"
                        >
                          <IconTrash />
                          Remove Organization
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </TableCell>
              </TableRow>
            ))}

            {organizations?.data?.length === 0 && (
              <EmptyTableRow colSpan={4} message="No organizations found." />
            )}
          </TableBody>
        )}
      </Table>

      <Pagination
        currentPage={page}
        totalPages={totalOrganizationPages}
        totalItems={organizations?.meta.total || 0}
        rowsPerPage={pageSize}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handlePageSizeChange}
      />

      {open && (
        <CreateOrganizationModal
          key={selectedOrganizationId}
          open={open}
          onOpenChange={onOpenChange}
          selectedOrganizationId={selectedOrganizationId}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          onConfirm={handleConfirmDelete}
          isLoading={isDeleting}
          title="Delete Organization"
          description="Are you sure you want to delete this organization? This action cannot be undone."
        />
      )}
    </section>
  );
}
