import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { DashboardHeader } from '@/components/DashboardHeader';
import { SectionDetailHero } from './components/SectionDetailHero';
import { CourseSectionModulesTable } from './components/CourseSectionModulesTable';

export function SectionDetailPage() {
  const { courseId, sectionPosition } = useParams<{
    courseId: string;
    sectionPosition: string;
  }>();

  const breadcrumbs = useMemo(
    () => [
      { label: 'Courses', href: '/courses' },
      { label: courseId || '', href: `/courses/${courseId}` },
      { label: 'Sections', href: `/courses/${courseId}` },
      { label: sectionPosition || '' },
    ],
    [courseId, sectionPosition],
  );

  return (
    <div className="flex w-full flex-col">
      <DashboardHeader breadcrumbs={breadcrumbs} />

      <SectionDetailHero
        courseId={courseId || ''}
        sectionPosition={sectionPosition || ''}
      />

      <div className="flex items-start justify-between gap-7.5 px-6 pb-6">
        <CourseSectionModulesTable
          courseId={courseId || ''}
          sectionPosition={sectionPosition || ''}
        />
      </div>
    </div>
  );
}
