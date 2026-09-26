import { RichTextContent } from '@/components/RichTextEditor/RichTextContent';
import type { Assignment } from '@/types/assignment';

interface AssignmentDetailContentProps {
  assignment?: Assignment;
}

export function AssignmentDetailContent({
  assignment,
}: AssignmentDetailContentProps) {
  const assignmentContent = assignment?.longDescription;
  return (
    <div className="flex-1">
      <RichTextContent content={assignmentContent} />
    </div>
  );
}
