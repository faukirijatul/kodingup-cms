import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal';
import { Pagination } from '@/components/Pagination';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@/constants/pagination';
import { useDeleteAssignment } from '@/hooks/assignments/useDeleteAssignment';
import { useListAssignments } from '@/hooks/assignments/useListAssignments';
import { useDebounce } from '@/hooks/useDebounce';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { AssignmentsTableFilters } from './AssignmentsTableFilters';
import { format, parseISO } from 'date-fns';
import { MoreVertical } from 'lucide-react';
import { IconEye } from '@/components/icons/IconEye';
import { IconPencilLine } from '@/components/icons/IconPencilLine';
import { EmptyTableRow } from '@/components/EmptyTableRow';
import { IconTrash } from '@/components/icons/IconTrash';
import { StatusBadge } from '@/components/StatusBadge';
import { AssignmentsTableSkeleton } from './AssignmentsTableSkeleton';
import { ASSIGNMENT_STATUS_STYLES } from '@/constants/assignment';

export function AssignmentsTable() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [assignmentToDeleteId, setAssignmentToDeleteId] = useState<string>('');

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

  const { data: assignments, isLoading: isAssignmentsLoading } =
    useListAssignments({
      query: debouncedSearchQuery,
      organizationId: selectedOrgId,
      offset: (page - DEFAULT_PAGE) * pageSize,
      limit: pageSize,
    });

  const totalAssignments = useMemo(() => {
    return assignments?.meta.total || 0;
  }, [assignments]);

  const totalAssignmentsPages = useMemo(() => {
    return Math.ceil(totalAssignments / pageSize);
  }, [pageSize, totalAssignments]);

  const { mutate: deleteAssignment, isPending: isDeleting } =
    useDeleteAssignment({
      onSuccess: () => {
        toast.success('Assignment deleted successfully');
        setIsDeleteModalOpen(false);
      },
      onError: (error) => {
        console.error(error);
        toast.error('Failed to delete assignment');
      },
    });

  const handleOpenDeleteModal = useCallback((e: Event) => {
    const target = e.currentTarget as HTMLElement;
    const assignmentId = target.dataset.value;
    if (assignmentId) {
      setAssignmentToDeleteId(String(assignmentId));
      setIsDeleteModalOpen(true);
    }
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (assignmentToDeleteId) {
      deleteAssignment(assignmentToDeleteId);
    }
  }, [assignmentToDeleteId, deleteAssignment]);

  const handleClickViewAssignment = useCallback(
    (event: Event) => {
      const target = event.currentTarget as HTMLElement;
      const assignmentId = target.dataset.value;

      navigate('/assignments/' + assignmentId);
    },
    [navigate],
  );

  const handleClickEditAssignment = useCallback(
    (event: Event) => {
      const target = event.currentTarget as HTMLElement;
      const assignmentId = target.dataset.value;

      navigate('/assignments/form?assignmentId=' + assignmentId);
    },
    [navigate],
  );

  return (
    <section className="border-dark w-full rounded-lg border">
      <div className="border-dark flex h-18.75 w-full items-center justify-between rounded-t-lg border-b p-5">
        <p className="text-white-primary text-sm leading-5 font-normal">
          Assignments ({totalAssignments})
        </p>

        <AssignmentsTableFilters
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
            <TableHead className="text-[13px]">Assignment</TableHead>
            <TableHead className="border-dark w-35 border-l text-[13px]">
              Organization
            </TableHead>
            <TableHead className="border-dark w-40 border-l text-[13px]">
              Available Date
            </TableHead>
            <TableHead className="border-dark w-60 border-l text-[13px]">
              Due Date
            </TableHead>
            <TableHead className="border-dark w-35 border-l text-[13px]">
              Status
            </TableHead>
            <TableHead className="border-dark w-12 border-l" />
          </TableRow>
        </TableHeader>

        {isAssignmentsLoading ? (
          <AssignmentsTableSkeleton rowCount={pageSize} />
        ) : (
          <TableBody>
            {assignments?.data?.map((assignment) => {
              const availableDate = parseISO(assignment.availableAt);
              const dueDate = parseISO(assignment.dueAt);

              return (
                <TableRow key={assignment.id}>
                  <TableCell>{assignment.title}</TableCell>
                  <TableCell>
                    <div className="bg-dark flex h-7 items-center justify-center rounded-xl px-2">
                      <span className="text-white-primary truncate text-xs leading-4 font-medium">
                        {assignment.organization.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(availableDate, 'EEE, MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    {format(dueDate, 'EEE, MMM dd, yyyy - hh:mm a')}
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      status={
                        assignment.publishedAt ? 'Published' : 'Unpublished'
                      }
                      statusStyle={
                        ASSIGNMENT_STATUS_STYLES[
                          assignment.publishedAt ? 'Published' : 'Unpublished'
                        ]
                      }
                    />
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
                            onSelect={handleClickViewAssignment}
                            data-value={assignment.id}
                            className="text-white-primary hover:bg-dark focus:bg-dark flex cursor-pointer items-center gap-2 rounded-[6px] px-2 py-1.5 text-sm leading-5 transition-colors outline-none"
                          >
                            <IconEye />
                            View Assignment
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            onSelect={handleClickEditAssignment}
                            data-value={assignment.id}
                            className="text-white-primary hover:bg-dark focus:bg-dark flex cursor-pointer items-center gap-2 rounded-[6px] px-2 py-1.5 text-sm leading-5 transition-colors outline-none"
                          >
                            <IconPencilLine />
                            Edit Assignment
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            onSelect={handleOpenDeleteModal}
                            data-value={assignment.id}
                            className="text-red hover:bg-dark focus:bg-dark flex cursor-pointer items-center gap-2 rounded-[6px] px-2 py-1.5 text-sm leading-5 transition-colors outline-none"
                          >
                            <IconTrash />
                            Remove Assignment
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </TableCell>
                </TableRow>
              );
            })}

            {assignments?.data?.length === 0 && (
              <EmptyTableRow colSpan={6} message="No assignments found." />
            )}
          </TableBody>
        )}
      </Table>

      <Pagination
        currentPage={page}
        totalPages={totalAssignmentsPages}
        totalItems={assignments?.meta.total || 0}
        rowsPerPage={pageSize}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handlePageSizeChange}
      />

      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          onConfirm={handleConfirmDelete}
          isLoading={isDeleting}
          title="Delete Assignment"
          description="Are you sure you want to delete this assignment? This action cannot be undone."
        />
      )}
    </section>
  );
}
