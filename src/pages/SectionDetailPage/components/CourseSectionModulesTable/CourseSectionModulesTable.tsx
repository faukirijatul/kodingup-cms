import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@/constants/pagination';
import { useListCourseSectionModules } from '@/hooks/courseSectionModules/useListCourseSectionModules';
import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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
import { Button } from '@/components/ui/button';
import { IconEye } from '@/components/icons/IconEye';
import { IconPencilLine } from '@/components/icons/IconPencilLine';
import { IconTrash } from '@/components/icons/IconTrash';
import { EmptyTableRow } from '@/components/EmptyTableRow';
import { useDeleteCourseSectionModule } from '@/hooks/courseSectionModules/useDeleteCourseSectionModule';
import { toast } from 'sonner';
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal';
import { formatSecondsToDHMS } from '@/lib/formatSecondsToDHMS';
import { CourseSectionsTableSkeleton } from '@/pages/Course/CourseDetailPage/components/CourseSectionsTable/CourseSectionsTableSkeleton';

interface CourseSectionModulesTableProps {
  courseId: string;
  sectionPosition: string;
}
export function CourseSectionModulesTable({
  courseId,
  sectionPosition,
}: CourseSectionModulesTableProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [moduleToDeletePosition, setModuleToDeletePosition] =
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

  const {
    data: courseSectionModules,
    isLoading: isCourseSectionModulesLoading,
  } = useListCourseSectionModules({
    courseId,
    sectionPosition: Number(sectionPosition),
    offset: (page - DEFAULT_PAGE) * pageSize,
    limit: pageSize,
  });

  const totalCourseSectionModules = useMemo(() => {
    return courseSectionModules?.meta.total || 0;
  }, [courseSectionModules]);

  const totalCourseSectionModulesPages = useMemo(() => {
    return Math.ceil(totalCourseSectionModules / pageSize);
  }, [totalCourseSectionModules, pageSize]);

  const { mutate: deleteModule, isPending: isDeleting } =
    useDeleteCourseSectionModule({
      onSuccess: () => {
        toast.success('Module deleted successfully');
        setIsDeleteModalOpen(false);
      },
      onError: (error) => {
        console.error(error);
        toast.error('Failed to delete module');
      },
    });

  const handleOpenDeleteModal = useCallback((e: Event) => {
    const target = e.currentTarget as HTMLElement;
    const modulePosition = target.dataset.value;
    if (modulePosition) {
      setModuleToDeletePosition(String(modulePosition));
      setIsDeleteModalOpen(true);
    }
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (moduleToDeletePosition) {
      deleteModule({
        courseId,
        sectionPosition,
        modulePosition: moduleToDeletePosition,
      });
    }
  }, [moduleToDeletePosition, courseId, sectionPosition, deleteModule]);

  return (
    <section className="border-dark w-full rounded-lg border">
      <div className="border-dark flex h-18.75 items-center justify-between rounded-t-lg border-b p-5">
        <p className="text-white-primary text-sm leading-5 font-normal">
          Sections (2)
        </p>

        <Button variant="outline">
          <Plus className="h-4 w-4" /> Create Module
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-30 text-[13px]">Position</TableHead>
            <TableHead className="border-dark border-l text-[13px]">
              Title
            </TableHead>
            <TableHead className="border-dark w-45 border-l text-[13px]">
              Type
            </TableHead>
            <TableHead className="border-dark w-45 border-l text-[13px]">
              Duration
            </TableHead>
            <TableHead className="border-dark w-45 border-l text-[13px]">
              Preview
            </TableHead>
            <TableHead className="border-dark w-12 border-l" />
          </TableRow>
        </TableHeader>

        {isCourseSectionModulesLoading ? (
          <CourseSectionsTableSkeleton rowCount={pageSize} />
        ) : (
          <TableBody>
            {courseSectionModules?.data?.map((module) => (
              <TableRow key={module.courseSectionId} className="h-18.25">
                <TableCell>{module.position}</TableCell>
                <TableCell>{module.title}</TableCell>
                <TableCell className="capitalize">{module.type}</TableCell>
                <TableCell>{formatSecondsToDHMS(module.duration)}</TableCell>
                <TableCell>
                  <Button variant="outline">Preview</Button>
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
                          // onSelect={handleViewSection}
                          data-value={module.position}
                          className="text-white-primary hover:bg-dark focus:bg-dark flex cursor-pointer items-center gap-2 rounded-[6px] px-2 py-1.5 text-sm leading-5 transition-colors outline-none"
                        >
                          <IconEye />
                          View Module
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          // onSelect={handleOpenUpdateCourseModal}
                          data-value={module.position}
                          className="text-white-primary hover:bg-dark focus:bg-dark flex cursor-pointer items-center gap-2 rounded-[6px] px-2 py-1.5 text-sm leading-5 transition-colors outline-none"
                        >
                          <IconPencilLine />
                          Edit Module
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          onSelect={handleOpenDeleteModal}
                          data-value={module.position}
                          className="text-red hover:bg-dark focus:bg-dark flex cursor-pointer items-center gap-2 rounded-[6px] px-2 py-1.5 text-sm leading-5 transition-colors outline-none"
                        >
                          <IconTrash />
                          Remove Module
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </TableCell>
              </TableRow>
            ))}

            {courseSectionModules?.data?.length === 0 && (
              <EmptyTableRow colSpan={6} message="No modules found." />
            )}
          </TableBody>
        )}
      </Table>

      <Pagination
        currentPage={page}
        totalPages={totalCourseSectionModulesPages}
        totalItems={courseSectionModules?.meta.total || 0}
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
          title="Delete Module"
          description="Are you sure you want to delete this module? This action cannot be undone."
        />
      )}
    </section>
  );
}
