import { Pagination } from '@/components/Pagination';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@/constants/pagination';
import { useDebounce } from '@/hooks/useDebounce';
import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useListLiveSessions } from '@/hooks/liveSessions/useListLiveSessions';
import { MoreVertical } from 'lucide-react';
import { IconEye } from '@/components/icons/IconEye';
import { IconPencilLine } from '@/components/icons/IconPencilLine';
import { IconTrash } from '@/components/icons/IconTrash';
import { EmptyTableRow } from '@/components/EmptyTableRow';
import { LiveSessionTableFilters } from './LiveSessionTableFilters';
import { format, parseISO } from 'date-fns';
import { LiveSessionsTableSkeleton } from './LiveSessionsTableSkeleton';
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal';
import { useDeleteLiveSession } from '@/hooks/liveSessions/useDeleteLiveSession';
import { toast } from 'sonner';
import { CreateLiveSessionModal } from '../modals/CreateLiveSessionModal';

interface LiveSessionsTableProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedLiveSessionId: string;
  setSelectedLiveSessionId: (liveSessionId: string) => void;
}

export function LiveSessionsTable({
  open,
  onOpenChange,
  selectedLiveSessionId,
  setSelectedLiveSessionId,
}: LiveSessionsTableProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [liveSessionToDeleteId, setLiveSessionToDeleteId] =
    useState<string>('');

  const page = useMemo(() => {
    const pageParam = searchParams.get('page');
    return pageParam ? Number(pageParam) : DEFAULT_PAGE;
  }, [searchParams]);

  const pageSize = useMemo(() => {
    const pageSizeParam = searchParams.get('pageSize');
    return pageSizeParam ? Number(pageSizeParam) : DEFAULT_PAGE_SIZE;
  }, [searchParams]);

  const selectedOrgId = useMemo(() => {
    return searchParams.get('org') || '';
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

  const handleOrgChange = useCallback(
    (orgId: string) => {
      setSearchParams(
        (prev) => {
          if (orgId) {
            prev.set('org', orgId);
          } else {
            prev.delete('org');
          }
          return prev;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const { data: liveSessions, isLoading: isLiveSessionsLoading } =
    useListLiveSessions({
      query: debouncedSearchQuery,
      organizationId: selectedOrgId,
      offset: (page - DEFAULT_PAGE) * pageSize,
      limit: pageSize,
    });

  const totalLiveSessions = useMemo(() => {
    return liveSessions?.meta.total || 0;
  }, [liveSessions]);

  const totalLiveSessionsPages = useMemo(() => {
    return Math.ceil(totalLiveSessions / pageSize);
  }, [pageSize, totalLiveSessions]);

  const { mutate: deleteLiveSession, isPending: isDeleting } = useDeleteLiveSession({
    onSuccess: () => {
      toast.success('Live session deleted successfully');
      setIsDeleteModalOpen(false);
    },
    onError: (error) => {
      console.error(error);
      toast.error('Failed to delete live session');
    },
  });

  const handleOpenUpdateLiveSessionModal = useCallback(
    (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      const liveSessionId = target.dataset.value;
      setSelectedLiveSessionId(String(liveSessionId));
      onOpenChange(true);
    },
    [onOpenChange, setSelectedLiveSessionId],
  );

  const handleOpenDeleteModal = useCallback((e: Event) => {
    const target = e.currentTarget as HTMLElement;
    const liveSessionId = target.dataset.value;
    if (liveSessionId) {
      setLiveSessionToDeleteId(String(liveSessionId));
      setIsDeleteModalOpen(true);
    }
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (liveSessionToDeleteId) {
      deleteLiveSession(liveSessionToDeleteId);
    }
  }, [liveSessionToDeleteId, deleteLiveSession]);

  return (
    <section className="border-dark w-full rounded-lg border">
      <div className="border-dark flex h-18.75 w-full items-center justify-between rounded-t-lg border-b p-5">
        <p className="text-white-primary text-sm leading-5 font-normal">
          Live Sessions ({totalLiveSessions})
        </p>

        <LiveSessionTableFilters
          setSearchParams={setSearchParams}
          searchQuery={searchQuery}
          handleSearchValueChange={handleSearchValueChange}
          selectedOrgId={selectedOrgId}
          handleOrgChange={handleOrgChange}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-[13px]">Title</TableHead>
            <TableHead className="border-dark w-35 border-l text-[13px]">
              Organization
            </TableHead>
            <TableHead className="border-dark w-35 border-l text-[13px]">
              Date
            </TableHead>
            <TableHead className="border-dark w-35 border-l text-[13px]">
              Start
            </TableHead>
            <TableHead className="border-dark w-35 border-l text-[13px]">
              End
            </TableHead>
            <TableHead className="border-dark w-12 border-l" />
          </TableRow>
        </TableHeader>

        {isLiveSessionsLoading ? (
          <LiveSessionsTableSkeleton rowCount={pageSize} />
        ) : (
          <TableBody>
            {liveSessions?.data?.map((liveSession) => {
              const startDate = parseISO(liveSession.startAt);
              const endDate = parseISO(liveSession.endAt);

              return (
                <TableRow key={liveSession.id}>
                  <TableCell>{liveSession.title}</TableCell>
                  <TableCell>{liveSession.organization.name}</TableCell>
                  <TableCell>{format(startDate, 'yyyy-MM-dd')}</TableCell>
                  <TableCell>{format(startDate, 'hh:mm a')}</TableCell>
                  <TableCell>{format(endDate, 'hh:mm a')}</TableCell>
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
                            // onSelect={handleViewLiveSession}
                            // data-value={liveSession.id}
                            className="text-white-primary hover:bg-dark focus:bg-dark flex cursor-pointer items-center gap-2 rounded-[6px] px-2 py-1.5 text-sm leading-5 transition-colors outline-none"
                          >
                            <IconEye />
                            View Live Session
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            onSelect={handleOpenUpdateLiveSessionModal}
                            data-value={liveSession.id}
                            className="text-white-primary hover:bg-dark focus:bg-dark flex cursor-pointer items-center gap-2 rounded-[6px] px-2 py-1.5 text-sm leading-5 transition-colors outline-none"
                          >
                            <IconPencilLine />
                            Edit Live Session
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            onSelect={handleOpenDeleteModal}
                            data-value={liveSession.id}
                            className="text-red hover:bg-dark focus:bg-dark flex cursor-pointer items-center gap-2 rounded-[6px] px-2 py-1.5 text-sm leading-5 transition-colors outline-none"
                          >
                            <IconTrash />
                            Remove Live Session
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </TableCell>
                </TableRow>
              );
            })}

            {liveSessions?.data?.length === 0 && (
              <EmptyTableRow colSpan={6} message="No live sessions found." />
            )}
          </TableBody>
        )}
      </Table>

      <Pagination
        currentPage={page}
        totalPages={totalLiveSessionsPages}
        totalItems={liveSessions?.meta.total || 0}
        rowsPerPage={pageSize}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handlePageSizeChange}
      />

      {open && (
        <CreateLiveSessionModal
          key={selectedLiveSessionId}
          open={open}
          onOpenChange={onOpenChange}
          selectedLiveSessionId={selectedLiveSessionId}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          onConfirm={handleConfirmDelete}
          isLoading={isDeleting}
          title="Delete Live Session"
          description="Are you sure you want to delete this live session? This action cannot be undone."
        />
      )}
    </section>
  );
}
