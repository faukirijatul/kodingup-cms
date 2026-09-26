import { useCallback } from 'react';
import { format, parseISO } from 'date-fns';
import { IconCalendar } from '@/components/icons/IconCalendar';
import { IconClock } from '@/components/icons/IconClock';
import { Button } from '@/components/ui/button';
import type { LiveSession } from '@/types/liveSession';

interface LiveSessionCardProps {
  liveSession: LiveSession;
}

export function LiveSessionCard({ liveSession }: LiveSessionCardProps) {
  const startDate = parseISO(liveSession.startAt);
  const endDate = parseISO(liveSession.endAt);

  const formattedDate = format(startDate, 'EEE, MMM dd, yyyy');

  const formattedTime = `${format(startDate, 'hh:mm a')} - ${format(endDate, 'hh:mm a')}`;

  const handleJoinMeeting = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const target = event.currentTarget as HTMLElement;
      const zoomUrl = target.dataset.value;

      if (zoomUrl) {
        window.open(zoomUrl, '_blank', 'noopener,noreferrer');
      }
    },
    [],
  );

  return (
    <div className="bg-bg-secondary/50 rounded-lg p-7.5">
      <div className="mb-6 flex items-center gap-2">
        <span className="h-4 w-4 rounded-full bg-[#2B7FFF]" />
        <p className="text-white-primary text-base leading-6 font-normal tracking-normal">
          Live Session
        </p>
      </div>

      <p className="text-white-primary mb-6 text-xl leading-7 font-medium tracking-normal">
        {liveSession.title}
      </p>

      <div className="mb-3 flex items-center gap-1.5">
        <IconCalendar />
        <p className="text-sm leading-5 font-normal tracking-normal text-[#9A9CAE]">
          {formattedDate}
        </p>
      </div>

      <div className="mb-6 flex items-center gap-1.5">
        <IconClock />
        <p className="text-sm leading-5 font-normal tracking-normal text-[#9A9CAE]">
          {formattedTime}
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-2.5">
        <p className="text-white-primary text-xs leading-4 font-normal tracking-normal">
          Description:
        </p>
        <p className="text-sm leading-5 font-normal tracking-normal text-[#9A9CAE]">
          {liveSession.description}
        </p>
      </div>

      <Button
        type="button"
        className="w-full"
        onClick={handleJoinMeeting}
        data-value={liveSession.zoomJoinUrl}
      >
        Join Meeting
      </Button>
    </div>
  );
}
