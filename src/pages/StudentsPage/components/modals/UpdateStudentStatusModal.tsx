import { useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod.js';
import {
  updateStudentStatusSchema,
  type UpdateStudentStatusFormValues,
} from '@/schemas/updateStudentStatus';
import { STUDENT_STATUS2, STUDENT_STATUS_STYLES } from '@/constants/student';
import { StatusBadge } from '@/components/StatusBadge';

interface UpdateStudentStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateStudentStatusModal({
  open,
  onOpenChange,
}: UpdateStudentStatusModalProps) {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateStudentStatusFormValues>({
    resolver: zodResolver(updateStudentStatusSchema),
    defaultValues: {
      newStatus: '',
    },
  });

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) {
        reset();
      }
      onOpenChange(isOpen);
    },
    [onOpenChange, reset],
  );

  const handleSubmitForm = useCallback(async () => {
    reset();
    onOpenChange(false);
  }, [onOpenChange, reset]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="min-w-xl">
        <DialogHeader>
          <DialogTitle>Update Status</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleSubmitForm)}
          className="flex flex-col pt-2.5"
        >
          <div className="flex flex-col gap-2.5 pb-6">
            <Label>Change status</Label>
            <Controller
              name="newStatus"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-9">
                    {field.value && STUDENT_STATUS_STYLES[field.value] ? (
                      <StatusBadge
                        status={field.value}
                        statusStyle={STUDENT_STATUS_STYLES[field.value]}
                      >
                        <SelectValue />
                      </StatusBadge>
                    ) : (
                      <SelectValue placeholder="Select status" />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {STUDENT_STATUS2.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.newStatus && (
              <p className="text-xs text-red-500">{errors.newStatus.message}</p>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Close
              </Button>
            </DialogClose>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
