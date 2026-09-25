import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { DashboardHeader } from '@/components/DashboardHeader';
import { CourseHero } from './components/CourseHero';
import { CourseSectionsTable } from './components/CourseSectionsTable';
import { CourseStatus } from './components/CourseStatus';

export function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();

  const breadcrumbs = useMemo(
    () => [{ label: 'Courses', href: '/courses' }, { label: courseId || '' }],
    [courseId],
  );

  return (
    <div className="flex w-full flex-col">
      <DashboardHeader breadcrumbs={breadcrumbs} />

      <CourseHero courseId={courseId || ''} />

      <div className="flex items-start justify-between gap-7.5 px-6 pb-6">
        <CourseSectionsTable courseId={courseId || ''} />
        <CourseStatus courseId={courseId || ''} />
      </div>
    </div>
  );
}
