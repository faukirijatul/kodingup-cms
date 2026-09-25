import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DashboardHeader } from '@/components/DashboardHeader';
import { MentorForm } from './components/MentorForm';

export function MentorFormPage() {
  const [searchParams] = useSearchParams();

  const mentorId = useMemo(() => searchParams.get('mentorId'), [searchParams]);

  const breadcrumbs = useMemo(
    () => [
      { label: 'Mentors', href: '/mentors' },
      { label: mentorId ? 'Edit' : 'Create' },
    ],
    [mentorId],
  );

  return (
    <div className="flex w-full flex-col">
      <DashboardHeader breadcrumbs={breadcrumbs} />

      <MentorForm mentorId={mentorId!} />
    </div>
  );
}
