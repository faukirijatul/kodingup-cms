import { IconExternalLink } from '@/components/icons/IconExternalLink';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { COURSE_STATUS_STYLES } from '@/constants/course';

interface CourseStatusProps {
  courseId: string;
}

export function CourseStatus({ courseId }: CourseStatusProps) {
  console.log(courseId);

  return (
    <section className="border-dark w-89.5 rounded-lg border">
      <div className="border-dark flex h-14 items-center rounded-t-lg border-b p-5">
        <p className="text-white-primary text-base leading-4 font-semibold">
          Course Status
        </p>
      </div>

      <div className="border-dark space-y-5 border-b p-5">
        <div className="flex h-7 items-center justify-between">
          <p className="text-white-primary text-sm leading-4 font-normal tracking-normal">
            Publication Status
          </p>
          <StatusBadge
            status={'Published'}
            statusStyle={COURSE_STATUS_STYLES['Published']}
          />
        </div>
        <div className="flex h-7 items-center justify-between">
          <div className="flex items-center gap-1.5">
            <p className="text-white-primary text-sm leading-4 font-normal tracking-normal">
              Visit
            </p>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <IconExternalLink />
            </a>
          </div>

          <Button variant="destructive">Unpublish</Button>
        </div>
      </div>

      <div className="rounded-b-lg p-5">
        <div className="bg-bg-secondary flex flex-col gap-2 rounded-lg p-4">
          <p className="text-white-primary text-sm leading-5 font-normal tracking-normal">
            Ready to Launch?
          </p>
          <p className="text-muted text-xs leading-4 font-normal tracking-normal">
            Publish your course to make it available to students. You can always
            unpublish or modify content later.
          </p>
        </div>
      </div>
    </section>
  );
}
