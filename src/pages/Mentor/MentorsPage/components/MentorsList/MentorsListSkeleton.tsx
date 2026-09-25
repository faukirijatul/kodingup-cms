import { MentorCardSkeleton } from './MentorCardSkeleton';

export function MentorsListSkeleton() {
  return (
    <section className="grid grid-cols-2 gap-6.25">
      <MentorCardSkeleton />
      <MentorCardSkeleton />
      <MentorCardSkeleton />
      <MentorCardSkeleton />
    </section>
  );
}
