import type { DayEvents } from '@/types/schedule';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { LiveSessionCard } from './LiveSessionCard';
import { AssignmentCard } from './AssignmentCard';

interface DayEventsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  events: DayEvents;
}

export function DayEventsModal({
  open,
  onOpenChange,
  events,
}: DayEventsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent position="right" className="rounded-md p-0">
        <div className="border-dark flex h-13.25 items-center border-b px-5">
          <p className="text-white-primary text-base leading-6 font-semibold tracking-normal">
            Activity
          </p>
        </div>

        <div className="space-y-5 px-5 py-4">
          {events.liveSessions.length > 0 &&
            events.liveSessions.map((liveSession) => (
              <LiveSessionCard key={liveSession.id} liveSession={liveSession} />
            ))}

          {events.assignments.length > 0 &&
            events.assignments.map((assignment) => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
