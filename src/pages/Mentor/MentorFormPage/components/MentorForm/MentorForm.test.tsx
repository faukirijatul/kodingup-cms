import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { MentorForm } from './MentorForm';
import { useGetMentor } from '@/hooks/mentors/useGetMentor';
import { useCreateMentor } from '@/hooks/mentors/useCreateMentor';
import { useUpdateMentor } from '@/hooks/mentors/useUpdateMentor';
import { HttpService } from '@/services/http';

vi.mock('@/hooks/mentors/useGetMentor');
vi.mock('@/hooks/mentors/useCreateMentor');
vi.mock('@/hooks/mentors/useUpdateMentor');
vi.mock('@/services/http', () => ({
  HttpService: {
    uploadToImageKit: vi.fn(),
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('@/components/PageHeader', () => ({
  PageHeader: ({
    title,
    description,
    children,
  }: {
    title: string;
    description: string;
    children?: ReactNode;
  }) => (
    <div data-testid="page-header">
      <h1>{title}</h1>
      <p>{description}</p>
      {children}
    </div>
  ),
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    type,
    disabled,
    form,
  }: {
    children: ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    form?: string;
  }) => (
    <button type={type} onClick={onClick} disabled={disabled} form={form}>
      {children}
    </button>
  ),
}));

vi.mock('@/components/ui/input', () => ({
  Input: (props: ComponentPropsWithoutRef<'input'>) => <input {...props} />,
}));

vi.mock('@/components/ui/textarea', () => ({
  Textarea: (props: ComponentPropsWithoutRef<'textarea'>) => (
    <textarea {...props} />
  ),
}));

vi.mock('@/components/ui/label', () => ({
  Label: ({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) => (
    <label htmlFor={htmlFor}>{children}</label>
  ),
}));

interface UploaderMockProps {
  value?: File | string | null;
  onChange: (file: File | string | null) => void;
}

vi.mock('../AvatarUploader', () => ({
  AvatarUploader: ({ onChange }: UploaderMockProps) => (
    <div data-testid="avatar-uploader">
      <button
        type="button"
        onClick={() =>
          onChange(new File(['avatar'], 'avatar.png', { type: 'image/png' }))
        }
      >
        Select Avatar File
      </button>
    </div>
  ),
}));

vi.mock('../CompanyLogoUploader', () => ({
  CompanyLogoUploader: ({ onChange }: UploaderMockProps) => (
    <div data-testid="company-logo-uploader">
      <button
        type="button"
        onClick={() =>
          onChange(new File(['logo'], 'logo.png', { type: 'image/png' }))
        }
      >
        Select Logo File
      </button>
    </div>
  ),
}));

interface RichTextEditorMockProps {
  value: string;
  onChange: (value: string) => void;
}

vi.mock('@/components/RichTextEditor/RichTextEditor', () => ({
  RichTextEditor: ({ value, onChange }: RichTextEditorMockProps) => (
    <textarea
      data-testid="rich-text-editor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

vi.mock('./MentorFormSkeleton', () => ({
  MentorFormSkeleton: () => <div data-testid="mentor-form-skeleton" />,
}));

const mockMentorData = {
  data: {
    id: 'mentor-123',
    firstName: 'Jane',
    lastName: 'Doe',
    title: 'Senior Software Engineer',
    companyLogoUrl: 'https://example.com/logo.png',
    shortDescription: 'Frontend Expert',
    longDescription: '<p>Detailed content</p>',
    avatarUrl: 'https://example.com/avatar.jpg',
    expertises: ['React', 'TypeScript'],
  },
};

describe('MentorForm Component', () => {
  let queryClient: QueryClient;
  const mockCreateMutate = vi.fn();
  const mockUpdateMutate = vi.fn();

  const createWrapper = () => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    return ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  beforeEach(() => {
    vi.mocked(useCreateMentor).mockReturnValue({
      mutate: mockCreateMutate,
      isPending: false,
    } as unknown as ReturnType<typeof useCreateMentor>);

    vi.mocked(useUpdateMentor).mockReturnValue({
      mutate: mockUpdateMutate,
      isPending: false,
    } as unknown as ReturnType<typeof useUpdateMentor>);
  });

  it('renders in create mode when mentorId is empty', () => {
    vi.mocked(useGetMentor).mockReturnValue({
      data: undefined,
      isLoading: false,
    } as unknown as ReturnType<typeof useGetMentor>);

    render(<MentorForm mentorId="" />, { wrapper: createWrapper() });

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Create mentor',
    );
    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
  });

  it('renders in edit mode and populates form fields with existing mentor data', async () => {
    vi.mocked(useGetMentor).mockReturnValue({
      data: mockMentorData,
      isLoading: false,
    } as unknown as ReturnType<typeof useGetMentor>);

    render(<MentorForm mentorId="mentor-123" />, { wrapper: createWrapper() });

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Edit mentor',
    );
    expect(screen.getByRole('button', { name: 'Update' })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter first name')).toHaveValue(
        'Jane',
      );
      expect(screen.getByPlaceholderText('Enter last name')).toHaveValue('Doe');
      expect(screen.getByPlaceholderText('Enter title')).toHaveValue(
        'Senior Software Engineer',
      );
      expect(screen.getByPlaceholderText('Enter expertises')).toHaveValue(
        'React, TypeScript',
      );
      expect(screen.getByPlaceholderText('Enter description')).toHaveValue(
        'Frontend Expert',
      );
    });
  });

  it('navigates to /mentors when Cancel button is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(useGetMentor).mockReturnValue({
      data: undefined,
      isLoading: false,
    } as unknown as ReturnType<typeof useGetMentor>);

    render(<MentorForm mentorId="" />, { wrapper: createWrapper() });

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    await user.click(cancelButton);

    expect(mockNavigate).toHaveBeenCalledWith('/mentors');
  });

  it('submits form for creating a mentor and handles file uploads to ImageKit', async () => {
    const user = userEvent.setup();
    vi.mocked(useGetMentor).mockReturnValue({
      data: undefined,
      isLoading: false,
    } as unknown as ReturnType<typeof useGetMentor>);

    vi.mocked(HttpService.uploadToImageKit)
      .mockResolvedValueOnce('https://imagekit.io/uploaded-avatar.png')
      .mockResolvedValueOnce('https://imagekit.io/uploaded-logo.png');

    const { container } = render(<MentorForm mentorId="" />, {
      wrapper: createWrapper(),
    });

    // Select files
    await user.click(screen.getByText('Select Avatar File'));
    await user.click(screen.getByText('Select Logo File'));

    // Fill form inputs
    await user.type(screen.getByPlaceholderText('Enter first name'), 'John');
    await user.type(screen.getByPlaceholderText('Enter last name'), 'Doe');
    await user.type(
      screen.getByPlaceholderText('Enter title'),
      'Software Architect',
    );
    await user.type(
      screen.getByPlaceholderText('Enter expertises'),
      'Go, Docker',
    );
    await user.type(
      screen.getByPlaceholderText('Enter description'),
      'Backend Architect',
    );
    await user.type(screen.getByTestId('rich-text-editor'), 'Bio content');

    // Trigger form submit directly
    const form = container.querySelector('#mentor-form') as HTMLFormElement;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(HttpService.uploadToImageKit).toHaveBeenCalledTimes(2);
      expect(mockCreateMutate).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        title: 'Software Architect',
        companyLogoUrl: 'https://imagekit.io/uploaded-logo.png',
        shortDescription: 'Backend Architect',
        longDescription: 'Bio content',
        avatarUrl: 'https://imagekit.io/uploaded-avatar.png',
        expertises: ['Go', 'Docker'],
      });
    });
  });

  it('submits form for updating an existing mentor', async () => {
    vi.mocked(useGetMentor).mockReturnValue({
      data: mockMentorData,
      isLoading: false,
    } as unknown as ReturnType<typeof useGetMentor>);

    const { container } = render(<MentorForm mentorId="mentor-123" />, {
      wrapper: createWrapper(),
    });

    // Wait until react-hook-form reset completes with mentor data
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter first name')).toHaveValue(
        'Jane',
      );
    });

    // Trigger form submit directly
    const form = container.querySelector('#mentor-form') as HTMLFormElement;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockUpdateMutate).toHaveBeenCalledWith({
        mentorId: 'mentor-123',
        payload: {
          firstName: 'Jane',
          lastName: 'Doe',
          title: 'Senior Software Engineer',
          companyLogoUrl: 'https://example.com/logo.png',
          shortDescription: 'Frontend Expert',
          longDescription: '<p>Detailed content</p>',
          avatarUrl: 'https://example.com/avatar.jpg',
          expertises: ['React', 'TypeScript'],
        },
      });
    });
  });
});
