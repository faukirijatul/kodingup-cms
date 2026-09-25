import { useCallback, useState } from 'react';
import { useListMentors } from '@/hooks/mentors/useListMentors';
import { MentorCard } from './MentorCard';
import { MentorsListSkeleton } from './MentorsListSkeleton';
import type { Mentor } from '@/types/mentor';
import { toast } from 'sonner';
import { MentorDetailModal } from '../MentorDetailModal/MentorDetailModal';

const OFFSET = 0;
const LIMIT = 50;

export function MentorsList() {
  const [isMentorDetailModalOpen, setIsMentorDetailModalOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);

  const { data: mentors, isLoading: isMentorsLoading } = useListMentors({
    offset: OFFSET,
    limit: LIMIT,
  });

  const handleOpenMentorDetailModal = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const target = e.currentTarget as HTMLElement;
      const mentorId = target.dataset.value;

      const mentor = mentors?.data?.find((mentor) => mentor.id === mentorId);

      if (!mentor) {
        toast.error('Mentor not found');
        return;
      }

      setSelectedMentor(mentor);
      setIsMentorDetailModalOpen(true);
    },
    [setIsMentorDetailModalOpen, setSelectedMentor, mentors?.data],
  );

  if (isMentorsLoading) {
    return <MentorsListSkeleton />;
  }

  return (
    <section className="grid grid-cols-2 gap-6.25">
      {mentors?.data.map((mentor) => (
        <MentorCard
          key={mentor.id}
          mentor={mentor}
          handleOpenMentorDetailModal={handleOpenMentorDetailModal}
        />
      ))}

      {isMentorDetailModalOpen && (
        <MentorDetailModal
          key={selectedMentor?.id}
          open={isMentorDetailModalOpen}
          onOpenChange={setIsMentorDetailModalOpen}
          mentor={selectedMentor}
        />
      )}
    </section>
  );
}
