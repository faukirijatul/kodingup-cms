import { useCallback } from 'react';
import { format, parseISO } from 'date-fns';
import { IconCalendar } from '@/components/icons/IconCalendar';
import { IconClock } from '@/components/icons/IconClock';
import { Button } from '@/components/ui/button';
import type { Assignment } from '@/types/assignment';

interface AssignmentCardProps {
  assignment: Assignment;
}

export function AssignmentCard({ assignment }: AssignmentCardProps) {
  const availableDate = parseISO(assignment.availableAt);
  const dueDate = parseISO(assignment.dueAt);

  const formattedAvailableDate = format(availableDate, 'EEE, MMM dd, yyyy');

  const formattedDueDate = format(dueDate, 'EEE, MMM dd, yyyy');
  const formattedTime = format(dueDate, 'hh:mm a');

  const handleViewAssignment = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const target = event.currentTarget as HTMLElement;
      const assignmentId = target.dataset.value;

      console.log(assignmentId);
    },
    [],
  );

  return (
    <div className="bg-bg-secondary/50 rounded-lg p-7.5">
      <div className="mb-6 flex items-center gap-2">
        <span className="h-4 w-4 rounded-full bg-[#FF6900]" />
        <p className="text-white-primary text-base leading-6 font-normal tracking-normal">
          Assignment
        </p>
      </div>

      <p className="text-white-primary mb-6 text-xl leading-7 font-medium tracking-normal">
        {assignment.title}
      </p>

      <div className="mb-3 flex items-center gap-1.5">
        <IconCalendar />
        <p className="text-sm leading-5 font-normal tracking-normal text-[#9A9CAE]">
          Available at {formattedAvailableDate}
        </p>
      </div>

      <div className="mb-6 flex items-center gap-1.5">
        <IconClock />
        <p className="text-sm leading-5 font-normal tracking-normal text-[#9A9CAE]">
          Due at {formattedDueDate} - {formattedTime}
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-2.5">
        <p className="text-white-primary text-xs leading-4 font-normal tracking-normal">
          Description:
        </p>
        <p className="text-sm leading-5 font-normal tracking-normal text-[#9A9CAE]">
          {assignment.shortDescription || assignment.longDescription}
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full bg-[#FF6900] hover:bg-[#FF6900]/80"
        onClick={handleViewAssignment}
        data-value={assignment.id}
      >
        View Assignment
      </Button>
    </div>
  );
}
