import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { MoreVertical, Search } from 'lucide-react';
import { toast } from 'sonner';
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
import { useListCourses } from '@/hooks/courses/useListCourses';
import { EmptyTableRow } from '@/components/EmptyTableRow';
import { StatusBadge } from '@/components/StatusBadge';
import { COURSE_STATUS_STYLES } from '@/constants/course';
import { CoursesTableSkeleton } from './CoursesTableSkeleton';
import { CreateCourseModal } from '../modals/CreateCourseModal';
import { useDeleteCourse } from '@/hooks/courses/useDeleteCourse';
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@/constants/pagination';
import { IconTrash } from '@/components/icons/IconTrash';
import { IconPencilLine } from '@/components/icons/IconPencilLine';
import { IconEye } from '@/components/icons/IconEye';

interface CourseTableProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCourseId: string;
  setSelectedCourseId: (courseId: string) => void;
}

export function CoursesTable({
  open,
  onOpenChange,
  selectedCourseId,
  setSelectedCourseId,
}: CourseTableProps) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [courseToDeleteId, setCourseToDeleteId] = useState<string>('');

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

  const { data: courses, isLoading: isCoursesLoading } = useListCourses({
    query: debouncedSearchQuery,
    published: undefined,
    offset: (page - DEFAULT_PAGE) * pageSize,
    limit: pageSize,
  });

  const totalCourses = useMemo(() => {
    return courses?.meta.total || 0;
  }, [courses]);

  const totalCoursePages = useMemo(() => {
    return Math.ceil(totalCourses / pageSize);
  }, [pageSize, totalCourses]);

  const handleViewCourse = useCallback(
    (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      const courseId = target.dataset.value;
      navigate(`/courses/${courseId}`, { replace: true, state: { courseId } });
    },
    [navigate],
  );

  const handleOpenUpdateCourseModal = useCallback(
    (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      const courseId = target.dataset.value;
      setSelectedCourseId(String(courseId));
      onOpenChange(true);
    },
    [onOpenChange, setSelectedCourseId],
  );

  const { mutate: deleteCourse, isPending: isDeleting } = useDeleteCourse({
    onSuccess: () => {
      toast.success('Course deleted successfully');
      setIsDeleteModalOpen(false);
    },
    onError: (error) => {
      console.error(error);
      toast.error('Failed to delete course');
    },
  });

  const handleOpenDeleteModal = useCallback((e: Event) => {
    const target = e.currentTarget as HTMLElement;
    const courseId = target.dataset.value;
    if (courseId) {
      setCourseToDeleteId(String(courseId));
      setIsDeleteModalOpen(true);
    }
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (courseToDeleteId) {
      deleteCourse(courseToDeleteId);
    }
  }, [courseToDeleteId, deleteCourse]);

  return (
    <section className="border-dark rounded-lg border">
      <div className="border-dark flex h-18.75 items-center justify-between rounded-t-lg border-b p-5">
        <p className="text-white-primary text-sm leading-5 font-normal">
          Courses ({totalCourses})
        </p>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search by title or description"
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
            <TableHead className="w-90 text-[13px]">Title</TableHead>
            <TableHead className="border-dark border-l text-[13px]">
              Description
            </TableHead>
            <TableHead className="border-dark w-30 border-l text-[13px]">
              Modules
            </TableHead>
            <TableHead className="border-dark w-40 border-l text-[13px]">
              Organization
            </TableHead>
            <TableHead className="border-dark w-35 border-l text-[13px]">
              Status
            </TableHead>
            <TableHead className="border-dark w-12 border-l" />
          </TableRow>
        </TableHeader>

        {isCoursesLoading ? (
          <CoursesTableSkeleton rowCount={pageSize} />
        ) : (
          <TableBody>
            {courses?.data?.map((course) => (
              <TableRow key={course.id} className="h-18.25">
                <TableCell>
                  <div className="flex items-center justify-start gap-3">
                    <img
                      src={course.thumbnailUrl}
                      className="h-12 max-w-22 rounded-md object-cover object-center"
                      alt={course.title}
                    />
                    <p className="max-w-50 truncate" title={course.title}>
                      {course.title}
                    </p>
                  </div>
                </TableCell>
                <TableCell
                  className="max-w-100 truncate"
                  title={course.description}
                >
                  {course.description}
                </TableCell>
                <TableCell className="truncate">
                  {course.organizationCourses.length} Modules
                </TableCell>
                <TableCell>
                  <div className="flex flex-col items-start gap-2">
                    {course.organizationCourses.map((organizationCourse) => (
                      <div
                        key={organizationCourse.id}
                        className="bg-dark flex h-7 items-center justify-center rounded-xl px-2"
                      >
                        <span className="text-white-primary truncate text-xs leading-4 font-medium">
                          {organizationCourse.organization.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge
                    status={'Published'}
                    statusStyle={COURSE_STATUS_STYLES['Published']}
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
                          onSelect={handleViewCourse}
                          data-value={course.id}
                          className="text-white-primary hover:bg-dark focus:bg-dark flex cursor-pointer items-center gap-2 rounded-[6px] px-2 py-1.5 text-sm leading-5 transition-colors outline-none"
                        >
                          <IconEye />
                          View Course
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          onSelect={handleOpenUpdateCourseModal}
                          data-value={course.id}
                          className="text-white-primary hover:bg-dark focus:bg-dark flex cursor-pointer items-center gap-2 rounded-[6px] px-2 py-1.5 text-sm leading-5 transition-colors outline-none"
                        >
                          <IconPencilLine />
                          Edit Course
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          onSelect={handleOpenDeleteModal}
                          data-value={course.id}
                          className="text-red hover:bg-dark focus:bg-dark flex cursor-pointer items-center gap-2 rounded-[6px] px-2 py-1.5 text-sm leading-5 transition-colors outline-none"
                        >
                          <IconTrash />
                          Remove Course
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </TableCell>
              </TableRow>
            ))}

            {courses?.data?.length === 0 && (
              <EmptyTableRow colSpan={4} message="No courses found." />
            )}
          </TableBody>
        )}
      </Table>

      <Pagination
        currentPage={page}
        totalPages={totalCoursePages}
        totalItems={courses?.meta.total || 0}
        rowsPerPage={pageSize}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handlePageSizeChange}
      />

      {open && (
        <CreateCourseModal
          key={selectedCourseId}
          open={open}
          onOpenChange={onOpenChange}
          selectedCourseId={selectedCourseId}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          onConfirm={handleConfirmDelete}
          isLoading={isDeleting}
          title="Delete Course"
          description="Are you sure you want to delete this course? This action cannot be undone."
        />
      )}
    </section>
  );
}
