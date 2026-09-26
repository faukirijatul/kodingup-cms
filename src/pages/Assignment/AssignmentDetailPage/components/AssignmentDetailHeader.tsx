import type { Assignment } from '@/types/assignment';

interface AssignmentDetailHeaderProps {
  assignment?: Assignment;
}

export function AssignmentDetailHeader({
  assignment,
}: AssignmentDetailHeaderProps) {
  return (
    <section className="bg-bg-primary mb-7.5 w-full px-6">
      <h4 className="text-blue mb-5 text-base leading-6 font-semibold tracking-normal">
        Assignment
      </h4>
      <h2 className="text-white-primary mb-5 text-4xl leading-10 font-semibold tracking-normal">
        {assignment?.title}
      </h2>

      <h6 className="text-white-primary mb-2.5 text-base leading-6 font-semibold tracking-normal">
        Objective
      </h6>

      <p className="text-muted text-base leading-6 font-normal tracking-normal">
        {assignment?.shortDescription}
      </p>
    </section>
  );
}
