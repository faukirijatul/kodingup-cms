import { IconCalendar } from '@/components/icons/IconCalendar';
import { IconClock } from '@/components/icons/IconClock';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { ASSIGNMENT_STATUS_STYLES } from '@/constants/assignment';
import type { Assignment } from '@/types/assignment';
import { differenceInDays, format, parseISO } from 'date-fns';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface AssignmentStatusProps {
  assignment?: Assignment;
}

export function AssignmentStatus({ assignment }: AssignmentStatusProps) {
  const navigate = useNavigate();
  const durationInDays =
    assignment?.availableAt && assignment?.dueAt
      ? differenceInDays(
          parseISO(assignment.dueAt),
          parseISO(assignment.availableAt),
        )
      : 0;

  const handleClickEditAssignment = useCallback(() => {
    navigate('/assignments/form?assignmentId=' + assignment?.id);
  }, [navigate, assignment?.id]);

  return (
    <div className="border-dark w-90 rounded-lg border">
      <div className="border-dark w-full border-b p-5">
        <p className="text-white-primary text-base leading-6 font-semibold">
          Assignment Status
        </p>
      </div>

      <div className="border-dark flex w-full flex-col gap-5 border-b p-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-white-primary text-sm leading-5 font-normal tracking-normal">
              Publication Status
            </p>

            <StatusBadge
              status={assignment?.publishedAt ? 'Published' : 'Unpublished'}
              statusStyle={
                ASSIGNMENT_STATUS_STYLES[
                  assignment?.publishedAt ? 'Published' : 'Unpublished'
                ]
              }
            />
          </div>

          <div className="bg-dark flex h-7 w-fit items-center justify-center rounded-xl px-2">
            <span className="text-white-primary truncate text-xs leading-4 font-medium">
              {assignment?.organization.name}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <IconClock />
            <p className="text-white-primary text-sm leading-5 font-normal tracking-normal">
              {durationInDays} days duration
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <IconCalendar />
            <p className="text-white-primary text-sm leading-5 font-normal tracking-normal">
              Due date:{' '}
              {format(assignment?.dueAt || '', 'EEE, MMM dd, yyyy - hh:mm a')}
            </p>
          </div>
        </div>

        <div className="bg-bg-secondary rounded-lg p-4">
          <p className="text-white-primary mb-2 text-sm leading-5 font-normal tracking-normal">
            Ready to Launch?
          </p>
          <p className="text-muted text-xs leading-4 font-normal tracking-normal">
            Publish your Assignment to make it available to students. You can
            always unpublish or modify content later.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2.5 rounded-b-lg p-5">
        <Button variant="outline" onClick={handleClickEditAssignment}>
          Edit Content
        </Button>
        <Button variant="destructive">Unpublish</Button>
      </div>
    </div>
  );
}
