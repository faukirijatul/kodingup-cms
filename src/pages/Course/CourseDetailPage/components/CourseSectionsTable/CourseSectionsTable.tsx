import { Button } from '@/components/ui/button';
import { MoreVertical, Plus } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pagination } from '@/components/Pagination';
import { useListCourseSections } from '@/hooks/courseSections/useListCourseSections';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCallback, useMemo, useState } from 'react';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@/constants/pagination';
import { EmptyTableRow } from '@/components/EmptyTableRow';
import { CourseSectionsTableSkeleton } from './CourseSectionsTableSkeleton';
import { IconTrash } from '@/components/icons/IconTrash';
import { IconPencilLine } from '@/components/icons/IconPencilLine';
import { IconEye } from '@/components/icons/IconEye';
import { toast } from 'sonner';
import { useDeleteCourseSection } from '@/hooks/courseSections/useDeleteCourseSection';
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal';

interface CourseTableProps {
  courseId: string;
}

export function CourseSectionsTable({ courseId }: CourseTableProps) {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sectionToDeletePosition, setSectionToDeletePosition] =
    useState<string>('');

  const page = useMemo(() => {
    const pageParam = searchParams.get('page');
    return pageParam ? Number(pageParam) : DEFAULT_PAGE;
  }, [searchParams]);

  const pageSize = useMemo(() => {
    const pageSizeParam = searchParams.get('pageSize');
    return pageSizeParam ? Number(pageSizeParam) : DEFAULT_PAGE_SIZE;
  }, [searchParams]);

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

  const { data: courseSections, isLoading: isCourseSectionsLoading } =
    useListCourseSections({
      courseId,
      offset: (page - DEFAULT_PAGE) * pageSize,
      limit: pageSize,
    });

  const totalCourseSections = useMemo(() => {
    return courseSections?.meta.total || 0;
  }, [courseSections]);

  const totalCourseSectionsPages = useMemo(() => {
    return Math.ceil(totalCourseSections / pageSize);
  }, [pageSize, totalCourseSections]);

  const handleViewSection = useCallback(
    (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      const sectionPosition = target.dataset.value;
      navigate(`sections/${sectionPosition}`);
    },
    [navigate],
  );

  const { mutate: deleteSection, isPending: isDeleting } =
    useDeleteCourseSection({
      onSuccess: () => {
        toast.success('Section deleted successfully');
        setIsDeleteModalOpen(false);
      },
      onError: (error) => {
        console.error(error);
        toast.error('Failed to delete section');
      },
    });

  const handleOpenDeleteModal = useCallback((e: Event) => {
    const target = e.currentTarget as HTMLElement;
    const sectionPosition = target.dataset.value;
    if (sectionPosition) {
      setSectionToDeletePosition(String(sectionPosition));
      setIsDeleteModalOpen(true);
    }
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (sectionToDeletePosition) {
      deleteSection({ courseId, sectionPosition: sectionToDeletePosition });
    }
  }, [sectionToDeletePosition, courseId, deleteSection]);

  return (
    <section className="border-dark w-full rounded-lg border">
      <div className="border-dark flex h-18.75 items-center justify-between rounded-t-lg border-b p-5">
        <p className="text-white-primary text-sm leading-5 font-normal">
          Sections (2)
        </p>

        <Button variant="outline">
          <Plus className="h-4 w-4" /> Create Section
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-30 text-[13px]">Position</TableHead>
            <TableHead className="border-dark border-l text-[13px]">
              Name
            </TableHead>
            <TableHead className="border-dark w-45 border-l text-[13px]">
              Modules
            </TableHead>
            <TableHead className="border-dark w-12 border-l" />
          </TableRow>
        </TableHeader>

        {isCourseSectionsLoading ? (
          <CourseSectionsTableSkeleton rowCount={pageSize} />
        ) : (
          <TableBody>
            {courseSections?.data?.map((section) => (
              <TableRow key={section.name} className="h-18.25">
                <TableCell>{section.position}</TableCell>
                <TableCell>{section.name}</TableCell>
                <TableCell>5 Modules</TableCell>

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
                          onSelect={handleViewSection}
                          data-value={section.position}
                          className="text-white-primary hover:bg-dark focus:bg-dark flex cursor-pointer items-center gap-2 rounded-[6px] px-2 py-1.5 text-sm leading-5 transition-colors outline-none"
                        >
                          <IconEye />
                          View Section
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          // onSelect={handleOpenUpdateCourseModal}
                          data-value={section.position}
                          className="text-white-primary hover:bg-dark focus:bg-dark flex cursor-pointer items-center gap-2 rounded-[6px] px-2 py-1.5 text-sm leading-5 transition-colors outline-none"
                        >
                          <IconPencilLine />
                          Edit Section
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          onSelect={handleOpenDeleteModal}
                          data-value={section.position}
                          className="text-red hover:bg-dark focus:bg-dark flex cursor-pointer items-center gap-2 rounded-[6px] px-2 py-1.5 text-sm leading-5 transition-colors outline-none"
                        >
                          <IconTrash />
                          Remove Section
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </TableCell>
              </TableRow>
            ))}

            {courseSections?.data?.length === 0 && (
              <EmptyTableRow colSpan={4} message="No sections found." />
            )}
          </TableBody>
        )}
      </Table>

      <Pagination
        currentPage={page}
        totalPages={totalCourseSectionsPages}
        totalItems={courseSections?.meta.total || 0}
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
          title="Delete Section"
          description="Are you sure you want to delete this section? This action cannot be undone."
        />
      )}
    </section>
  );
}
