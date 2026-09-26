import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { ASSIGNMENT_STATUS_STYLES } from '@/constants/assignment';
import type { Assignment } from '@/types/assignment';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface AssignmentStatusProps {
  assignment?: Assignment;
  isSubmitting: boolean;
}

export function AssignmentStatus({
  assignment,
  isSubmitting,
}: AssignmentStatusProps) {
  const navigate = useNavigate();

  const handleClickCancel = useCallback(() => {
    navigate('/assignments');
  }, [navigate]);

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
              status={
                assignment && assignment?.publishedAt
                  ? 'Published'
                  : 'Unpublished'
              }
              statusStyle={
                ASSIGNMENT_STATUS_STYLES[
                  assignment && assignment?.publishedAt
                    ? 'Published'
                    : 'Unpublished'
                ]
              }
            />
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
        <Button variant="outline" onClick={handleClickCancel}>
          Cancel
        </Button>
        <Button type="submit" form="assignment-form">
          {isSubmitting ? 'Saving...' : assignment ? 'Update' : 'Save Draft'}
        </Button>
      </div>
    </div>
  );
}
