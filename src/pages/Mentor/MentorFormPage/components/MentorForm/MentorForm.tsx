import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  createMentorSchema,
  type CreateMentorFormValues,
} from '@/schemas/createMentor';
import { zodResolver } from '@hookform/resolvers/zod';
import type { CreateMentorFormValues as ICreateMentorFormValues } from '@/types/mentor';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useCreateMentor } from '@/hooks/mentors/useCreateMentor';
import { toast } from 'sonner';
import { useUpdateMentor } from '@/hooks/mentors/useUpdateMentor';
import { useGetMentor } from '@/hooks/mentors/useGetMentor';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { HttpService } from '@/services/http';
import { RichTextEditor } from '@/components/RichTextEditor/RichTextEditor';
import { MentorFormSkeleton } from './MentorFormSkeleton';
import { AvatarUploader } from '../AvatarUploader';
import { CompanyLogoUploader } from '../CompanyLogoUploader';

const DEFAULT_FORM_VALUES: CreateMentorFormValues = {
  firstName: '',
  lastName: '',
  title: '',
  companyLogoUrl: '',
  shortDescription: '',
  longDescription: '',
  avatarUrl: '',
  expertises: '',
};

interface MentorFormProps {
  mentorId: string;
}

export function MentorForm({ mentorId }: MentorFormProps) {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);

  const { data: mentor, isLoading: isMentorLoading } = useGetMentor(
    mentorId || '',
    {
      enabled: !!mentorId,
    },
  );

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateMentorFormValues>({
    resolver: zodResolver(createMentorSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  useEffect(() => {
    if (mentor?.data) {
      reset({
        firstName: mentor?.data.firstName || '',
        lastName: mentor?.data.lastName || '',
        title: mentor?.data.title || '',
        companyLogoUrl: mentor?.data.companyLogoUrl || '',
        shortDescription: mentor?.data.shortDescription || '',
        longDescription: mentor?.data.longDescription || '',
        avatarUrl: mentor?.data.avatarUrl || '',
        expertises: mentor?.data.expertises?.join(', ') || '',
      });
    } else {
      reset(DEFAULT_FORM_VALUES);
    }
  }, [mentor?.data, reset]);

  const { mutate: createMentor, isPending: isCreateMentorLoading } =
    useCreateMentor({
      onSuccess: () => {
        toast.success('Mentor created successfully');
      },
      onError: (error) => {
        console.error(error);
        toast.error('Failed to create mentor');
      },
    });

  const { mutate: updateMentor, isPending: isUpdateMentorLoading } =
    useUpdateMentor({
      onSuccess: () => {
        toast.success('Mentor updated successfully');
      },
      onError: (error) => {
        console.error(error);
        toast.error('Failed to update mentor');
      },
    });

  const isSubmitting = isCreateMentorLoading || isUpdateMentorLoading;

  const handleSubmitForm = useCallback(
    async (data: CreateMentorFormValues) => {
      try {
        setIsUploading(true);
        let avatarUrl = data.avatarUrl;
        let companyLogoUrl = data.companyLogoUrl;

        if (data.avatarUrl instanceof File) {
          avatarUrl = await HttpService.uploadToImageKit(data.avatarUrl);
        }

        if (data.companyLogoUrl instanceof File) {
          companyLogoUrl = await HttpService.uploadToImageKit(
            data.companyLogoUrl,
          );
        }

        const payload: ICreateMentorFormValues = {
          ...data,
          avatarUrl,
          companyLogoUrl,
          expertises:
            data.expertises.split(', ').map((exp) => exp.trim()) || [],
        };

        if (mentor?.data.id) {
          updateMentor({
            mentorId: mentor?.data.id,
            payload,
          });
        } else {
          createMentor(payload);
        }
      } finally {
        setIsUploading(false);
      }
    },
    [createMentor, mentor?.data.id, updateMentor],
  );

  const handleClickCancelButton = useCallback(() => {
    navigate('/mentors');
  }, [navigate]);

  if (isMentorLoading && mentorId) {
    <MentorFormSkeleton />;
  }

  return (
    <div className="flex w-full flex-col px-6">
      <PageHeader
        title={mentorId ? 'Edit mentor' : 'Create mentor'}
        description={
          mentorId ? 'Update mentor profile' : 'Create a new mentor profile'
        }
      >
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            onClick={handleClickCancelButton}
            disabled={isSubmitting || isUploading}
          >
            Cancel
          </Button>
          <Button type="submit" form="mentor-form" disabled={isSubmitting}>
            {isUploading
              ? 'Uploading...'
              : isSubmitting
                ? 'Saving...'
                : mentorId
                  ? 'Update'
                  : 'Create'}
          </Button>
        </div>
      </PageHeader>

      <form
        id="mentor-form"
        onSubmit={handleSubmit(handleSubmitForm)}
        className="-mt-7.5 w-full"
      >
        <div className="mb-5 flex flex-col items-center gap-2.5">
          <Controller
            control={control}
            name="avatarUrl"
            render={({ field }) => (
              <AvatarUploader value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.avatarUrl && (
            <p className="text-xs text-red-500">{errors.avatarUrl.message}</p>
          )}
        </div>

        <div className="grid grid-cols-3 items-start gap-5">
          <div className="flex flex-col gap-2.5 pb-6">
            <Label htmlFor="firstName">First Name</Label>
            <Controller
              control={control}
              name="firstName"
              render={({ field }) => (
                <Input
                  id="firstName"
                  placeholder="Enter first name"
                  {...field}
                  className="h-9"
                />
              )}
            />
            {errors.firstName && (
              <p className="text-xs text-red-500">{errors.firstName.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2.5 pb-6">
            <Label htmlFor="lastName">Last Name</Label>
            <Controller
              control={control}
              name="lastName"
              render={({ field }) => (
                <Input
                  id="lastName"
                  placeholder="Enter last name"
                  {...field}
                  className="h-9"
                />
              )}
            />
            {errors.lastName && (
              <p className="text-xs text-red-500">{errors.lastName.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2.5 pb-6">
            <Label>Company Thumbnail</Label>
            <Controller
              control={control}
              name="companyLogoUrl"
              render={({ field }) => (
                <CompanyLogoUploader
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.companyLogoUrl && (
              <p className="text-xs text-red-500">
                {errors.companyLogoUrl.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 items-start gap-5">
          <div className="flex flex-col gap-2.5 pb-6">
            <Label htmlFor="title">Title</Label>
            <Controller
              control={control}
              name="title"
              render={({ field }) => (
                <Input
                  id="title"
                  placeholder="Enter title"
                  {...field}
                  className="h-9"
                />
              )}
            />
            {errors.title && (
              <p className="text-xs text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2.5 pb-6">
            <Label htmlFor="expertises">Expertises</Label>
            <Controller
              control={control}
              name="expertises"
              render={({ field }) => (
                <Input
                  id="expertises"
                  placeholder="Enter expertises"
                  {...field}
                  className="h-9"
                />
              )}
            />
            {errors.expertises && (
              <p className="text-xs text-red-500">
                {errors.expertises.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2.5 pb-5">
          <Label htmlFor="shortDescription">Description</Label>
          <Controller
            control={control}
            name="shortDescription"
            render={({ field }) => (
              <Textarea
                id="shortDescription"
                placeholder="Enter description"
                {...field}
                className="min-h-29.5"
              />
            )}
          />
          {errors.shortDescription && (
            <p className="text-xs text-red-500">
              {errors.shortDescription.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2.5 pb-5">
          <Label>Content</Label>
          <Controller
            control={control}
            name="longDescription"
            render={({ field }) => (
              <RichTextEditor value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.longDescription && (
            <p className="text-xs text-red-500">
              {errors.longDescription.message}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
