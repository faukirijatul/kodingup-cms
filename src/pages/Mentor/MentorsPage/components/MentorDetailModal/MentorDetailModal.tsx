import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useCallback } from 'react';
import type { Mentor } from '@/types/mentor';
import { IconVerified } from '@/components/icons/IconVerified';
import { useNavigate } from 'react-router-dom';
import { RichTextContent } from '@/components/RichTextEditor/RichTextContent';

interface MentorDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mentor: Mentor | null;
}

export function MentorDetailModal({
  open,
  onOpenChange,
  mentor,
}: MentorDetailModalProps) {
  const navigate = useNavigate();

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      onOpenChange(isOpen);
    },
    [onOpenChange],
  );

  const handleClickEditButton = useCallback(() => {
    navigate('form?mentorId=' + mentor?.id);
  }, [navigate, mentor?.id]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="min-w-250 p-0">
        <img
          src="/images/mentor-detail-banner.webp"
          alt="Mentor Detail Banner"
          className="h-40 w-full rounded-t-lg object-cover object-center"
        />

        <div className="relative px-7.5 pt-[82.66px] pb-5">
          <img
            src={mentor?.avatarUrl}
            alt="Mentor Avatar"
            className="absolute top-0 left-7.5 h-30 w-30 -translate-y-1/2 rounded-full object-cover object-center"
          />

          <div className="mb-5 flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <p className="text-white-primary text-base leading-6 font-normal tracking-normal">
                  {mentor ? `${mentor.firstName} ${mentor.lastName}` : ''}
                </p>
                <IconVerified />
              </div>
              <p className="text-blue text-sm leading-5 font-normal tracking-normal">
                {mentor?.title}
              </p>
            </div>

            <img
              src={mentor?.companyLogoUrl}
              alt="Company Logo"
              className="h-6 object-cover object-center"
            />
          </div>

          <p className="text-muted mb-5 text-sm leading-5 font-normal tracking-normal">
            {mentor?.shortDescription}
          </p>

          <div className="mb-5 space-y-2.5">
            <p className="text-white-primary text-sm leading-5 font-normal tracking-normal">
              Expertise
            </p>

            <div className="flex flex-wrap gap-2">
              {mentor?.expertises?.map((exp) => (
                <div
                  key={exp}
                  className="bg-dark flex h-6 min-w-6 items-center justify-center rounded-[6px] px-[7.2px]"
                >
                  <p className="text-white-primary text-xs leading-4 font-medium tracking-normal">
                    {exp}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-white-primary mb-3.5 text-sm leading-5 font-normal tracking-normal">
            About this mentor
          </p>

          <RichTextContent content={mentor?.longDescription} />
        </div>

        <DialogFooter className="px-6 pb-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleClickEditButton}
          >
            Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
