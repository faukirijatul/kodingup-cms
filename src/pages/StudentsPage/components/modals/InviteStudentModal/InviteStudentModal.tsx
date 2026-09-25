import { useCallback, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  DEFAULT_INVITE_STUDENT_FORM_VALUES,
  inviteStudentSchema,
  type InviteStudentFormInput,
  type InviteStudentFormOutput,
} from '@/schemas/inviteStudent';
import { useListOrganizations } from '@/hooks/organizations/useListOrganizations';
import { DataSelect } from '@/components/DataSelect';
import { useInviteStudent } from '@/hooks/studentInvitations/useInviteStudent';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@/constants/pagination';

interface InviteStudentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteStudentModal({
  open,
  onOpenChange,
}: InviteStudentModalProps) {
  const [orgPage, setOrgPage] = useState(DEFAULT_PAGE);
  const [orgSearch, setOrgSearch] = useState('');

  const { data: organizationsData, isLoading: isOrgsLoading } =
    useListOrganizations({
      query: orgSearch,
      offset: (orgPage - DEFAULT_PAGE) * DEFAULT_PAGE_SIZE,
      limit: DEFAULT_PAGE_SIZE,
    });

  const organizationOptions = useMemo(() => {
    const options = (organizationsData?.data || []).map((org) => ({
      value: String(org.id),
      label: org.name,
    }));
    return [...options];
  }, [organizationsData]);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<InviteStudentFormInput, unknown, InviteStudentFormOutput>({
    resolver: zodResolver(inviteStudentSchema),
    defaultValues: DEFAULT_INVITE_STUDENT_FORM_VALUES,
  });

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) {
        reset(DEFAULT_INVITE_STUDENT_FORM_VALUES);
      }
      onOpenChange(isOpen);
    },
    [onOpenChange, reset],
  );

  const { mutate: inviteStudent, isPending: isInviteStudentLoading } =
    useInviteStudent({
      onSuccess: () => {
        toast.success('Student invited successfully');
        reset(DEFAULT_INVITE_STUDENT_FORM_VALUES);
        onOpenChange(false);
      },
      onError: (error) => {
        console.error(error);
        toast.error('Failed to invited student');
      },
    });

  const handleSubmitForm = useCallback(
    async (data: InviteStudentFormOutput) => {
      inviteStudent({
        email: data.email,
        organizationId: data.organizationId,
      });
    },
    [inviteStudent],
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="min-w-xl">
        <DialogHeader>
          <DialogTitle>Invite Student</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleSubmitForm)}
          noValidate
          className="flex flex-col pt-2.5"
        >
          <div className="flex flex-col gap-2.5 pb-6">
            <Label htmlFor="email">Email</Label>
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <Input
                  id="email"
                  placeholder="email@email.com"
                  {...field}
                  className="h-9"
                />
              )}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2.5 pb-6">
            <Label>Organization</Label>
            <Controller
              control={control}
              name="organizationId"
              render={({ field }) => (
                <DataSelect
                  searchable
                  options={organizationOptions}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Select organization"
                  searchPlaceholder="Search organization..."
                  searchQuery={orgSearch}
                  onSearchChange={(query) => {
                    setOrgSearch(query);
                    setOrgPage(DEFAULT_PAGE);
                  }}
                  pagination={{
                    page: orgPage,
                    pageSize: DEFAULT_PAGE_SIZE,
                    total: organizationsData?.meta.total || 0,
                    onPageChange: setOrgPage,
                  }}
                  isLoading={isOrgsLoading}
                  className="w-full"
                />
              )}
            />
            {errors.organizationId && (
              <p className="text-xs text-red-500">
                {errors.organizationId.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2.5 pb-5">
            <Label htmlFor="message">Invitation Message</Label>
            <Controller
              control={control}
              name="message"
              render={({ field }) => (
                <Textarea
                  id="message"
                  placeholder="Write invitation message"
                  {...field}
                  className="min-h-15.75"
                />
              )}
            />
            {errors.message && (
              <p className="text-xs text-red-500">{errors.message.message}</p>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>

            <Button type="submit" disabled={isInviteStudentLoading}>
              {isInviteStudentLoading ? 'Sending...' : 'Send Invitation'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
