import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateCourseModal } from './CreateCourseModal';
import { useGetCourse } from '@/hooks/courses/useGetCourse';
import { useListMentors } from '@/hooks/mentors/useListMentors';
import { useOrganizationOptions } from '@/hooks/dataOptions/useOrganizationOptions';
import { useCreateCourse } from '@/hooks/courses/useCreateCourse';
import { useUpdateCourse } from '@/hooks/courses/useUpdateCourse';
import { HttpService } from '@/services/http';

vi.mock('@/hooks/courses/useGetCourse');
vi.mock('@/hooks/mentors/useListMentors');
vi.mock('@/hooks/dataOptions/useOrganizationOptions');
vi.mock('@/hooks/courses/useCreateCourse');
vi.mock('@/hooks/courses/useUpdateCourse');
vi.mock('@/services/http');

vi.mock('../ThumbnailUploader', () => ({
  ThumbnailUploader: ({
    onChange,
  }: {
    value: unknown;
    onChange: (val: unknown) => void;
  }) => (
    <div data-testid="thumbnail-uploader">
      <button
        type="button"
        onClick={() =>
          onChange(new File(['dummy'], 'test.png', { type: 'image/png' }))
        }
      >
        Upload Fake File
      </button>
      <button
        type="button"
        onClick={() => onChange('https://example.com/existing.png')}
      >
        Set String URL
      </button>
    </div>
  ),
}));

vi.mock('@/components/DataSelect', () => ({
  DataSelect: ({
    value,
    onValueChange,
  }: {
    value: string;
    onValueChange: (val: string) => void;
  }) => (
    <select
      data-testid="data-select-mentor"
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
    >
      <option value="">Select mentor</option>
      <option value="1">John Doe</option>
    </select>
  ),
}));

vi.mock('@/components/MultiDataSelect', () => ({
  MultiDataSelect: ({
    value,
    onValueChange,
  }: {
    value: string[];
    onValueChange: (val: string[]) => void;
  }) => (
    <button
      type="button"
      data-testid="multi-data-select-org"
      onClick={() => onValueChange(['1', '2'])}
    >
      Select Organizations ({value?.length || 0})
    </button>
  ),
}));

describe('CreateCourseModal', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    selectedCourseId: '',
  };

  const mockCreateMutate = vi.fn();
  const mockUpdateMutate = vi.fn();

  beforeEach(() => {
    vi.mocked(useGetCourse).mockReturnValue({
      data: undefined,
      isLoading: false,
    } as ReturnType<typeof useGetCourse>);

    vi.mocked(useListMentors).mockReturnValue({
      data: {
        data: [
          {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
          },
        ],
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useListMentors>);

    vi.mocked(useOrganizationOptions).mockReturnValue({
      organizationOptions: [{ value: '1', label: 'Organization 1' }],
      page: 1,
      searchQuery: '',
      setPage: vi.fn(),
      handleSearchOrgChange: vi.fn(),
      isOrgsLoading: false,
      totalOrgs: 1,
    });

    vi.mocked(useCreateCourse).mockReturnValue({
      mutate: mockCreateMutate,
      isPending: false,
    } as unknown as ReturnType<typeof useCreateCourse>);

    vi.mocked(useUpdateCourse).mockReturnValue({
      mutate: mockUpdateMutate,
      isPending: false,
    } as unknown as ReturnType<typeof useUpdateCourse>);
  });

  describe('Create Mode (New Course)', () => {
    it('renders "Add Course" title and empty form fields correctly', () => {
      render(<CreateCourseModal {...defaultProps} />);

      expect(
        screen.getByRole('heading', { name: 'Add Course' }),
      ).toBeInTheDocument();
      expect(
        screen.getByText('Fill in the course details to create a new course.'),
      ).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter title')).toHaveValue('');
      expect(screen.getByPlaceholderText('Enter description')).toHaveValue('');
      expect(
        screen.getByRole('button', { name: 'Create' }),
      ).toBeInTheDocument();
    });

    it('submits form with text URL thumbnail', async () => {
      const user = userEvent.setup();
      render(<CreateCourseModal {...defaultProps} />);

      await user.click(screen.getByText('Set String URL'));
      await user.selectOptions(screen.getByTestId('data-select-mentor'), '1');
      await user.type(
        screen.getByPlaceholderText('Enter title'),
        'React Masterclass',
      );
      await user.type(
        screen.getByPlaceholderText('Enter description'),
        'Learn React from scratch',
      );
      await user.click(screen.getByTestId('multi-data-select-org'));

      await user.click(screen.getByRole('button', { name: 'Create' }));

      await waitFor(() => {
        expect(mockCreateMutate).toHaveBeenCalledWith({
          thumbnailUrl: 'https://example.com/existing.png',
          mentorId: 1,
          title: 'React Masterclass',
          description: 'Learn React from scratch',
          organizationIds: [1, 2],
        });
      });
    });

    it('uploads file to ImageKit when thumbnail is a File object before submitting', async () => {
      const user = userEvent.setup();
      vi.mocked(HttpService.uploadToImageKit).mockResolvedValue(
        'https://imagekit.io/uploaded-thumb.png',
      );

      render(<CreateCourseModal {...defaultProps} />);

      await user.click(screen.getByText('Upload Fake File'));
      await user.selectOptions(screen.getByTestId('data-select-mentor'), '1');
      await user.type(
        screen.getByPlaceholderText('Enter title'),
        'Vue.js Basics',
      );
      await user.type(
        screen.getByPlaceholderText('Enter description'),
        'Learn Vue.js framework',
      );
      await user.click(screen.getByTestId('multi-data-select-org'));

      await user.click(screen.getByRole('button', { name: 'Create' }));

      await waitFor(() => {
        expect(HttpService.uploadToImageKit).toHaveBeenCalled();
        expect(mockCreateMutate).toHaveBeenCalledWith(
          expect.objectContaining({
            thumbnailUrl: 'https://imagekit.io/uploaded-thumb.png',
            mentorId: 1,
            title: 'Vue.js Basics',
            organizationIds: [1, 2],
          }),
        );
      });
    });
  });

  describe('Edit Mode (Existing Course)', () => {
    it('renders CourseFormSkeleton when course data is loading', () => {
      vi.mocked(useGetCourse).mockReturnValue({
        data: undefined,
        isLoading: true,
      } as ReturnType<typeof useGetCourse>);

      render(
        <CreateCourseModal {...defaultProps} selectedCourseId="course-123" />,
      );

      expect(
        screen.queryByPlaceholderText('Enter title'),
      ).not.toBeInTheDocument();
    });

    it('populates form fields with existing course data on load', async () => {
      vi.mocked(useGetCourse).mockReturnValue({
        data: {
          data: {
            id: 'course-123',
            thumbnailUrl: 'https://example.com/course.png',
            mentorId: '1',
            title: 'Existing Course Title',
            description: 'Existing Course Description',
            organizationIds: ['1'],
          },
        },
        isLoading: false,
      } as unknown as ReturnType<typeof useGetCourse>);

      render(
        <CreateCourseModal {...defaultProps} selectedCourseId="course-123" />,
      );

      expect(
        screen.getByRole('heading', { name: 'Edit Course' }),
      ).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Enter title')).toHaveValue(
          'Existing Course Title',
        );
        expect(screen.getByPlaceholderText('Enter description')).toHaveValue(
          'Existing Course Description',
        );
      });

      expect(
        screen.getByRole('button', { name: 'Update' }),
      ).toBeInTheDocument();
    });

    it('calls updateCourse mutation when submitting in edit mode', async () => {
      const user = userEvent.setup();

      vi.mocked(useGetCourse).mockReturnValue({
        data: {
          data: {
            id: 'course-123',
            thumbnailUrl: 'https://example.com/course.png',
            mentorId: '1',
            title: 'Existing Title',
            description: 'Existing Desc',
            organizationIds: ['1'],
          },
        },
        isLoading: false,
      } as unknown as ReturnType<typeof useGetCourse>);

      render(
        <CreateCourseModal {...defaultProps} selectedCourseId="course-123" />,
      );

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Enter title')).toHaveValue(
          'Existing Title',
        );
      });

      await user.click(screen.getByRole('button', { name: 'Update' }));

      await waitFor(() => {
        expect(mockUpdateMutate).toHaveBeenCalledWith({
          courseId: 'course-123',
          payload: {
            thumbnailUrl: 'https://example.com/course.png',
            mentorId: 1,
            title: 'Existing Title',
            description: 'Existing Desc',
            organizationIds: [1],
          },
        });
      });
    });
  });

  describe('Modal Interactivity & Resets', () => {
    it('triggers onOpenChange when close button or Cancel button is clicked', async () => {
      const user = userEvent.setup();
      const onOpenChangeMock = vi.fn();

      render(
        <CreateCourseModal {...defaultProps} onOpenChange={onOpenChangeMock} />,
      );

      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      await user.click(cancelButton);

      expect(onOpenChangeMock).toHaveBeenCalledWith(false);
    });
  });
});
