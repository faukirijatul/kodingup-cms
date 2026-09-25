import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal';
import { IconVideo } from '@/components/icons/IconVideo';
import { IconClock } from '@/components/icons/IconClock';
import { IconCalendar } from '@/components/icons/IconCalendar';
import { Button } from '@/components/ui/button';
import { useDeleteCourse } from '@/hooks/courses/useDeleteCourse';
import { useGetCourse } from '@/hooks/courses/useGetCourse';
import { useGetCourseTotals } from '@/hooks/courses/useGetCourseTotals';
import { CreateCourseModal } from '@/pages/Course/CoursesPage/components/modals/CreateCourseModal';
import { CourseHeroSkeleton } from './CourseHeroSkeleton';
import { formatSecondsToDHMS } from '@/lib/formatSecondsToDHMS';

interface CourseHeroProps {
  courseId: string;
}

export function CourseHero({ courseId }: CourseHeroProps) {
  const navigate = useNavigate();

  const [isEditCourseModalOpen, setIsEditCourseModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: course, isLoading: isCourseLoading } = useGetCourse(
    courseId || '',
    {
      enabled: !!courseId,
    },
  );

  const { data: courseTotals, isLoading: isCourseTotalsLoading } =
    useGetCourseTotals(courseId || '', {
      enabled: !!courseId,
    });

  const handleOpenEditCourseModal = useCallback(() => {
    setIsEditCourseModalOpen(true);
  }, []);

  const { mutate: deleteCourse, isPending: isDeleting } = useDeleteCourse({
    onSuccess: () => {
      toast.success('Course deleted successfully');
      setIsDeleteModalOpen(false);
      navigate('/courses', { replace: true });
    },
    onError: (error) => {
      console.error(error);
      toast.error('Failed to delete course');
    },
  });

  const handleOpenDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    deleteCourse(courseId);
  }, [courseId, deleteCourse]);

  const isDataLoading = isCourseLoading || isCourseTotalsLoading;

  return (
    <>
      {isDataLoading ? (
        <CourseHeroSkeleton />
      ) : (
        <section className="bg-bg-primary mb-7.5 flex w-full items-start justify-between gap-7.5 px-6 pt-5">
          <div className="flex flex-col gap-5">
            <h2 className="text-white-primary text-4xl leading-10 font-semibold tracking-normal">
              {course?.data.title}
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
                <p>{courseTotals?.data.totalModules} modules</p>
              </div>

              <div className="flex items-center gap-1.5">
                <IconClock />
                <p>
                  {formatSecondsToDHMS(courseTotals?.data.totalDuration || 0)}
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <IconCalendar />
                <p>
                  Updated {format(course?.data.updatedAt || '', 'yyyy-MM-dd')}
                </p>
              </div>

              {course?.data.organizationCourses &&
                course?.data.organizationCourses.map((org, idx) => (
                  <div
                    key={idx}
                    className="bg-dark border-dark flex h-7 items-center justify-center rounded-xl border px-2"
                  >
                    <span className="text-white-primary text-xs leading-4 font-medium tracking-normal">
                      {org.organization.name}
                    </span>
                  </div>
                ))}
            </div>

            <div className="flex h-8.5 items-center justify-start gap-2.5">
              <Button variant="secondary" onClick={handleOpenEditCourseModal}>
                Edit Course
              </Button>
              <Button
                variant="destructive-ghost"
                onClick={handleOpenDeleteModal}
              >
                Delete Course
              </Button>
            </div>
          </div>

          <img
            src={course?.data.thumbnailUrl}
            alt={course?.data.title}
            className="h-74 w-114 rounded-lg object-cover object-center"
          />

          {isEditCourseModalOpen && (
            <CreateCourseModal
              key={courseId}
              open={isEditCourseModalOpen}
              onOpenChange={setIsEditCourseModalOpen}
              selectedCourseId={courseId}
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
      )}
    </>
  );
}
