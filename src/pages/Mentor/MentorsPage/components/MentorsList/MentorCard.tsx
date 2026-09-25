import { IconEye } from '@/components/icons/IconEye';
import { IconVerified } from '@/components/icons/IconVerified';
import { Button } from '@/components/ui/button';
import type { Mentor } from '@/types/mentor';

interface MentorCardProps {
  mentor: Mentor;
  handleOpenMentorDetailModal: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function MentorCard({
  mentor,
  handleOpenMentorDetailModal,
}: MentorCardProps) {
  return (
    <div className="border-dark relative rounded-lg border">
      <img
        src="/images/mentor-card-banner.webp"
        alt="Mentor Card Banner"
        className="h-40 w-full rounded-t-lg object-cover object-center"
      />

      <div className="relative px-7.5 pt-[82.66px] pb-25.25">
        <img
          src={mentor.avatarUrl}
          alt="Mentor Avatar"
          className="absolute top-0 left-7.5 h-30 w-30 -translate-y-1/2 rounded-full object-cover object-center"
        />

        <div className="mb-5 flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <p className="text-white-primary text-base leading-6 font-normal tracking-normal">{`${mentor.firstName} ${mentor.lastName}`}</p>
              <IconVerified />
            </div>
            <p className="text-blue text-sm leading-5 font-normal tracking-normal">
              {mentor.title}
            </p>
          </div>

          <img
            src={mentor.companyLogoUrl}
            alt="Company Logo"
            className="h-6 object-cover object-center"
          />
        </div>

        <p className="text-muted mb-5 text-sm leading-5 font-normal tracking-normal">
          {mentor.shortDescription}
        </p>

        <div className="space-y-2.5">
          <p className="text-white-primary text-sm leading-5 font-normal tracking-normal">
            Expertise
          </p>

          <div className="flex flex-wrap gap-2">
            {mentor.expertises?.map((exp) => (
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
      </div>

      <div className="border-dark absolute bottom-0 left-0 w-full border-t px-7.5 py-5">
        <Button
          variant="outline"
          onClick={handleOpenMentorDetailModal}
          data-value={mentor.id}
          className="flex w-full items-center gap-1.5"
        >
          <IconEye />
          <span>About Mentor</span>
        </Button>
      </div>
    </div>
  );
}
