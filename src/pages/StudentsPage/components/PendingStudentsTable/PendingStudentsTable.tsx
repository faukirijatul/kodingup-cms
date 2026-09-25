import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MoreVertical } from 'lucide-react';
import { format } from 'date-fns';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { IconUpdateStatus } from '@/components/icons/IconUpdateStatus';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useListStudentInvitations } from '@/hooks/studentInvitations/useListStudentInvitations';
import { useDebounce } from '@/hooks/useDebounce';
import { Pagination } from '@/components/Pagination';
import { EmptyTableRow } from '@/components/EmptyTableRow';
import { PendingStudentsTableSkeleton } from './PendingStudentsTableSkeleton';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@/constants/pagination';
import { StudentsTableFilters } from '../StudentsTableFilters';

interface PendingStudentsTableProps {
  tableTitle: string;
  handleOpenUpdateStudentModal: (event: Event) => void;
}

export function PendingStudentsTable({
  tableTitle,
  handleOpenUpdateStudentModal,
}: PendingStudentsTableProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = useMemo(() => {
    const pageParam = searchParams.get('psPage');
    return pageParam ? Number(pageParam) : DEFAULT_PAGE;
  }, [searchParams]);

  const pageSize = useMemo(() => {
    const pageSizeParam = searchParams.get('psPageSize');
    return pageSizeParam ? Number(pageSizeParam) : DEFAULT_PAGE_SIZE;
  }, [searchParams]);

  const selectedOrgId = useMemo(() => {
    return searchParams.get('psOrg') || '';
  }, [searchParams]);

  const handleOrgChange = useCallback(
    (orgId: string) => {
      setSearchParams(
        (prev) => {
          if (orgId) {
            prev.set('psOrg', orgId);
          } else {
            prev.delete('psOrg');
          }
          return prev;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const searchQuery = useMemo(() => {
    const query = searchParams.get('psQuery') || '';
    return query;
  }, [searchParams]);

  const debouncedSearchQuery = useDebounce(searchQuery);

  const handleSearchValueChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const query = event.target.value;
      setSearchParams(
        (prev) => {
          if (query) {
            prev.set('psQuery', query);
          } else {
            prev.delete('psQuery');
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
          prev.set('psPage', String(page));
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
          prev.set('psPageSize', String(pageSize));
          prev.set('psPage', String(DEFAULT_PAGE));
          return prev;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const { data: pendingStudentsData, isLoading: isPendingStudentsLoading } =
    useListStudentInvitations({
      query: debouncedSearchQuery,
      organizationId: selectedOrgId,
      offset: (page - DEFAULT_PAGE) * pageSize,
      limit: pageSize,
      accepted: false,
    });

  const totalPendingStudents = useMemo(() => {
    return pendingStudentsData?.meta.total || 0;
  }, [pendingStudentsData]);

  const totalPendingStudentPages = useMemo(() => {
    return Math.ceil(totalPendingStudents / pageSize);
  }, [totalPendingStudents, pageSize]);

  return (
    <>
      <div className="border-dark flex h-18.75 w-full items-center justify-between rounded-t-lg border-b p-5">
        <p className="text-white-primary text-sm leading-5 font-normal">
          {tableTitle} ({totalPendingStudents})
        </p>

        <StudentsTableFilters
          searchQuery={searchQuery}
          handleSearchValueChange={handleSearchValueChange}
          selectedOrgId={selectedOrgId}
          handleOrgChange={handleOrgChange}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-[13px]">Email</TableHead>
            <TableHead className="border-dark border-l text-[13px]">
              Organization Name
            </TableHead>
            <TableHead className="border-dark border-l text-[13px]">
              Invited Date
            </TableHead>
            <TableHead className="border-dark border-l text-[13px]">
              Expires At
            </TableHead>
            <TableHead className="border-dark border-l text-[13px]">
              Accepted At
            </TableHead>
            <TableHead className="border-dark w-12 border-l" />
          </TableRow>
        </TableHeader>

        {isPendingStudentsLoading ? (
          <PendingStudentsTableSkeleton rowCount={pageSize} />
        ) : (
          <TableBody>
            {pendingStudentsData?.data.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="text-white-primary">
                  {student.email}
                </TableCell>
                <TableCell>{student.organization.name}</TableCell>
                <TableCell>
                  {format(student.createdAt, 'yyyy-MM-dd h:mm a')}
                </TableCell>
                <TableCell>
                  {format(student.expiresAt, 'yyyy-MM-dd h:mm a')}
                </TableCell>
                <TableCell className="text-muted">-</TableCell>
                <TableCell>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <button
                        type="button"
                        className="hover:text-white-primary text-muted hover:bg-dark flex h-8 w-8 items-center justify-center rounded-md"
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
                          onSelect={handleOpenUpdateStudentModal}
                          data-value={student.id}
                          className="text-white-primary hover:bg-dark focus:bg-dark flex cursor-pointer items-center gap-2 rounded-[6px] px-2 py-1.5 text-sm leading-5 transition-colors outline-none"
                        >
                          <IconUpdateStatus />
                          Update Status
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </TableCell>
              </TableRow>
            ))}

            {pendingStudentsData?.data.length === 0 && (
              <EmptyTableRow colSpan={6} message="No pending students found." />
            )}
          </TableBody>
        )}
      </Table>

      <Pagination
        currentPage={page}
        totalPages={totalPendingStudentPages}
        totalItems={pendingStudentsData?.meta.total || 0}
        rowsPerPage={pageSize}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handlePageSizeChange}
      />
    </>
  );
}
