import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MoreVertical } from 'lucide-react';
import { IconUpdateStatus } from '@/components/icons/IconUpdateStatus';
import { IconUser } from '@/components/icons/IconUser';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getInitials } from '@/lib/getInitials';
import * as Avatar from '@radix-ui/react-avatar';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useDebounce } from '@/hooks/useDebounce';
import { useListStudents } from '@/hooks/students/useListStudents';
import { Pagination } from '@/components/Pagination';
import { EmptyTableRow } from '@/components/EmptyTableRow';
import { EnrolledStudentsTableSkeleton } from './EnrolledStudentsTableSkeleton';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@/constants/pagination';
import { StudentsTableFilters } from '../StudentsTableFilters';

interface EnrolledStudentsTableProps {
  tableTitle: string;
  handleOpenDetailProfileModal: (event: Event) => void;
  handleOpenUpdateStudentModal: (event: Event) => void;
}

export function EnrolledStudentsTable({
  tableTitle,
  handleOpenDetailProfileModal,
  handleOpenUpdateStudentModal,
}: EnrolledStudentsTableProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = useMemo(() => {
    const pageParam = searchParams.get('esPage');
    return pageParam ? Number(pageParam) : DEFAULT_PAGE;
  }, [searchParams]);

  const pageSize = useMemo(() => {
    const pageSizeParam = searchParams.get('esPageSize');
    return pageSizeParam ? Number(pageSizeParam) : DEFAULT_PAGE_SIZE;
  }, [searchParams]);

  const selectedOrgId = useMemo(() => {
    return searchParams.get('esOrg') || '';
  }, [searchParams]);

  const handleOrgChange = useCallback(
    (orgId: string) => {
      setSearchParams(
        (prev) => {
          if (orgId) {
            prev.set('esOrg', orgId);
          } else {
            prev.delete('esOrg');
          }
          return prev;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const searchQuery = useMemo(() => {
    const query = searchParams.get('esQuery') || '';
    return query;
  }, [searchParams]);

  const debouncedSearchQuery = useDebounce(searchQuery);

  const handleSearchValueChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const query = event.target.value;
      setSearchParams(
        (prev) => {
          if (query) {
            prev.set('esQuery', query);
          } else {
            prev.delete('esQuery');
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
          prev.set('esPage', String(page));
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
          prev.set('esPageSize', String(pageSize));
          prev.set('esPage', String(DEFAULT_PAGE));
          return prev;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const { data: enrolledStudentsData, isLoading: isEnrolledStudentsLoading } =
    useListStudents({
      query: debouncedSearchQuery,
      organizationId: selectedOrgId,
      offset: (page - DEFAULT_PAGE) * pageSize,
      limit: pageSize,
    });

  const totalEnrolledStudents = useMemo(() => {
    return enrolledStudentsData?.meta.total || 0;
  }, [enrolledStudentsData]);

  const totalEnrolledStudentPages = useMemo(() => {
    return Math.ceil(totalEnrolledStudents / pageSize);
  }, [pageSize, totalEnrolledStudents]);

  return (
    <>
      <div className="border-dark flex h-18.75 w-full items-center justify-between rounded-t-lg border-b p-5">
        <p className="text-white-primary text-sm leading-5 font-normal">
          {tableTitle} ({totalEnrolledStudents})
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
            <TableHead className="text-[13px]">Student ID</TableHead>
            <TableHead className="border-dark border-l text-[13px]">
              Student
            </TableHead>
            <TableHead className="border-dark border-l text-[13px]">
              Organization Name
            </TableHead>
            <TableHead className="border-dark w-12 border-l" />
          </TableRow>
        </TableHeader>

        {isEnrolledStudentsLoading ? (
          <EnrolledStudentsTableSkeleton rowCount={pageSize} />
        ) : (
          <TableBody>
            {enrolledStudentsData?.data?.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.code}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar.Root className="inline-flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full">
                      {student.profileUrl && (
                        <Avatar.Image
                          className="border-dark h-full w-full rounded-full border object-cover"
                          src={student.profileUrl}
                          alt={`${student.firstName} ${student.lastName}`}
                        />
                      )}
                      <Avatar.Fallback className="text-white-primary bg-bg-secondary border-dark flex h-full w-full items-center justify-center rounded-full border text-sm font-medium">
                        {getInitials(
                          `${student.firstName} ${student.lastName}`,
                        )}
                      </Avatar.Fallback>
                    </Avatar.Root>

                    <div className="min-w-0 flex-1">
                      <p className="text-white-primary truncate text-sm font-medium">
                        {`${student.firstName} ${student.lastName}`}
                      </p>
                      <p className="text-muted truncate text-sm">
                        {student.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{student.organization.name}</TableCell>
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
                          onSelect={handleOpenDetailProfileModal}
                          data-value={student.id}
                          className="text-white-primary hover:bg-dark focus:bg-dark flex cursor-pointer items-center gap-2 rounded-[6px] px-2 py-1.5 text-sm leading-5 transition-colors outline-none"
                        >
                          <IconUser />
                          View Profile
                        </DropdownMenu.Item>
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

            {enrolledStudentsData?.data?.length === 0 && (
              <EmptyTableRow
                colSpan={4}
                message="No enrolled students found."
              />
            )}
          </TableBody>
        )}
      </Table>

      <Pagination
        currentPage={page}
        totalPages={totalEnrolledStudentPages}
        totalItems={enrolledStudentsData?.meta.total || 0}
        rowsPerPage={pageSize}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handlePageSizeChange}
      />
    </>
  );
}
