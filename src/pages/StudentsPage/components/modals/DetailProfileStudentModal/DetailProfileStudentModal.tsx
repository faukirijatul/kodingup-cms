import { useState } from 'react';
import { endOfMonth, format, startOfMonth } from 'date-fns';
import * as Avatar from '@radix-ui/react-avatar';
import { IconVerified } from '@/components/icons/IconVerified';
import { IconIdCard } from '@/components/icons/IconIdCard';
import { IconMapPin } from '@/components/icons/IconMapPin';
import { IconCalendar } from '@/components/icons/IconCalendar';
import { IconBriefcase } from '@/components/icons/IconBriefcase';
import { StatusBadge } from '@/components/StatusBadge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { STUDENT_STATUS_STYLES } from '@/constants/student';
import { useGetStudentAttendances } from '@/hooks/students/useGetStudentAttendances';
import { getInitials } from '@/lib/getInitials';
import { useGetStudent } from '@/hooks/students/useGetStudent';
import { useGetOrganization } from '@/hooks/organizations/useGetOrganization';
import { AttendanceCalendar } from './AttendanceCalendar';
import { DetailProfileStudentModalSkeleton } from './DetailProfileStudentModalSkeleton';
import { AttendanceCalendarSkeleton } from './AttendanceCalendarSkeleton';

interface DetailProfileStudentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedStudentId: string;
}

export function DetailProfileStudentModal({
  open,
  onOpenChange,
  selectedStudentId,
}: DetailProfileStudentModalProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const startAt = startOfMonth(currentMonth).toISOString();
  const endAt = endOfMonth(currentMonth).toISOString();

  const { data: student, isLoading: isStudentLoading } =
    useGetStudent(selectedStudentId);

  const { data: organization, isLoading: isOrgLoading } = useGetOrganization(
    student?.data.organizationId || '',
  );

  const { data: attendances, isLoading: isAttendancesLoading } =
    useGetStudentAttendances({
      studentId: selectedStudentId,
      startAt,
      endAt,
    });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-200">
        {isStudentLoading || isOrgLoading ? (
          <DetailProfileStudentModalSkeleton />
        ) : (
          <>
            <div className="flex flex-col items-center pt-9">
              <Avatar.Root className="mb-5 inline-flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full">
                {student?.data.profileUrl && (
                  <Avatar.Image
                    className="border-dark h-full w-full rounded-full border object-cover"
                    src={student?.data.profileUrl}
                    alt={`${student?.data.firstName} ${student?.data.lastName}`}
                  />
                )}
                <Avatar.Fallback className="text-white-primary bg-bg-secondary border-dark flex h-full w-full items-center justify-center rounded-full border text-[36px] leading-10 font-semibold tracking-normal">
                  {getInitials(
                    `${student?.data.firstName} ${student?.data.lastName}`,
                  )}
                </Avatar.Fallback>
              </Avatar.Root>

              <StatusBadge
                status={'Ongoing'}
                statusStyle={STUDENT_STATUS_STYLES['Ongoing']}
                className="mb-3.5"
              />

              <div className="mb-3.5 flex h-7 items-center gap-1">
                <span className="text-white-primary text-lg leading-7 font-semibold tracking-normal">
                  {`${student?.data.firstName} ${student?.data.lastName}`}
                </span>
                <IconVerified />
              </div>
            </div>

            <div className="mb-9 flex h-5 items-center justify-center gap-4.5">
              <div className="flex h-5 items-center gap-1.5">
                <IconIdCard />
                <span className="text-white-primary text-sm leading-5 font-normal tracking-normal">
                  {student?.data.code}
                </span>
              </div>
              <div className="flex h-5 items-center gap-1.5">
                <IconMapPin />
                <span className="text-white-primary text-sm leading-5 font-normal tracking-normal">
                  {'Indonesia'}
                </span>
              </div>
              <div className="flex h-5 items-center gap-1.5">
                <IconCalendar />
                <span className="text-white-primary text-sm leading-5 font-normal tracking-normal">
                  Enrolled At{' '}
                  {student?.data.createdAt
                    ? format(new Date(student.data.createdAt), 'yyyy-MM-dd')
                    : '-'}
                </span>
              </div>
              <div className="flex h-5 items-center gap-1.5">
                <IconBriefcase />
                <span className="text-white-primary text-sm leading-5 font-normal tracking-normal">
                  {organization?.data.name}
                </span>
              </div>
            </div>
          </>
        )}

        <div className="border-dark flex flex-col rounded-xl border">
          <div className="border-dark flex h-14 items-center border-b px-5">
            <p className="text-shadow-white-primary text-[16px] leading-4 font-semibold">
              Course Calendar & Session Logs
            </p>
          </div>
          {isAttendancesLoading ? (
            <AttendanceCalendarSkeleton />
          ) : (
            <AttendanceCalendar
              attendances={attendances?.data}
              currentMonth={currentMonth}
              onMonthChange={setCurrentMonth}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
