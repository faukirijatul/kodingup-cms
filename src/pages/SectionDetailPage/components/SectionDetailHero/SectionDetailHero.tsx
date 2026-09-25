import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal';
import { IconCalendar } from '@/components/icons/IconCalendar';
import { IconClock } from '@/components/icons/IconClock';
import { IconVideo } from '@/components/icons/IconVideo';
import { Button } from '@/components/ui/button';
import { useGetCourse } from '@/hooks/courses/useGetCourse';
import { useDeleteCourseSection } from '@/hooks/courseSections/useDeleteCourseSection';
import { useGetCourseSection } from '@/hooks/courseSections/useGetCourseSection';
import { useGetCourseSectionTotals } from '@/hooks/courseSections/useGetCourseSectionTotals';
import { formatSecondsToDHMS } from '@/lib/formatSecondsToDHMS';
import { CourseHeroSkeleton } from '@/pages/Course/CourseDetailPage/components/CourseHero/CourseHeroSkeleton';

interface SectionDetailHeroProps {
  courseId: string;
  sectionPosition: string;
}

export function SectionDetailHero({
  courseId,
  sectionPosition,
}: SectionDetailHeroProps) {
  const navigate = useNavigate();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: course, isLoading: isCourseLoading } = useGetCourse(
    courseId || '',
    {
      enabled: !!courseId,
    },
  );

  const { data: section, isLoading: isSectionLoading } = useGetCourseSection(
    { courseId, sectionPosition },
    {
      enabled: !!sectionPosition,
    },
  );

  const { data: sectionTotals, isLoading: isSectionTotalsLoading } =
    useGetCourseSectionTotals(
      { courseId, sectionPosition },
      {
        enabled: !!sectionPosition,
      },
    );

  const { mutate: deleteSection, isPending: isDeleting } =
    useDeleteCourseSection({
      onSuccess: () => {
        toast.success('Section deleted successfully');
        setIsDeleteModalOpen(false);
        navigate(`/courses/${courseId}`, { replace: true });
      },
      onError: (error) => {
        console.error(error);
        toast.error('Failed to delete section');
      },
    });

  const handleOpenDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    deleteSection({ courseId, sectionPosition });
  }, [sectionPosition, deleteSection, courseId]);

  const isDataLoading =
    isCourseLoading || isSectionLoading || isSectionTotalsLoading;
  return (
    <>
      {isDataLoading ? (
        <CourseHeroSkeleton />
      ) : (
        <section className="bg-bg-primary mb-7.5 flex w-full items-start justify-between gap-7.5 px-6 pt-5">
          <div className="flex flex-col gap-5">
            <h2 className="text-white-primary text-4xl leading-10 font-semibold tracking-normal">
              {section?.data.name}
            </h2>

            <div className="flex flex-col gap-2.5">
              <p className="text-white-primary text-base leading-6 font-semibold tracking-normal">
                Course Description
              </p>
              <p className="text-muted text-base leading-6 font-normal tracking-normal">
                {course?.data.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4.5">
              <div className="flex items-center gap-1.5">
                <IconVideo />
                <p>{sectionTotals?.data.totalModules} modules</p>
              </div>

              <div className="flex items-center gap-1.5">
                <IconClock />
                <p>
                  {formatSecondsToDHMS(sectionTotals?.data.totalDuration || 0)}
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <IconCalendar />
                <p>
                  Updated {format(section?.data.updatedAt || '', 'yyyy-MM-dd')}
                </p>
              </div>
            </div>

            <div className="flex h-8.5 items-center justify-start gap-2.5">
              <Button variant="secondary">Edit Section</Button>
              <Button
                variant="destructive-ghost"
                onClick={handleOpenDeleteModal}
              >
                Delete Section
              </Button>
            </div>
          </div>

          <img
            src={course?.data.thumbnailUrl}
            alt={section?.data.name}
            className="h-74 w-114 rounded-lg object-cover object-center"
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
      )}
    </>
  );
}
