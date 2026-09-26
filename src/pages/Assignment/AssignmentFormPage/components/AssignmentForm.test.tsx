import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ComponentPropsWithoutRef } from 'react';
import { AssignmentForm } from './AssignmentForm';
import { useCreateAssignment } from '@/hooks/assignments/useCreateAssignment';
import { useUpdateAssignment } from '@/hooks/assignments/useUpdateLiveSession';
import { useOrganizationOptions } from '@/hooks/dataOptions/useOrganizationOptions';
import type { Assignment } from '@/types/assignment';

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom',
    );
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock('@/hooks/assignments/useCreateAssignment');
vi.mock('@/hooks/assignments/useUpdateLiveSession');
vi.mock('@/hooks/dataOptions/useOrganizationOptions');

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
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
  Label: ({
    children,
    htmlFor,
  }: {
    children: React.ReactNode;
    htmlFor?: string;
  }) => <label htmlFor={htmlFor}>{children}</label>,
}));

interface DataSelectProps {
  value: string | number;
  onValueChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
}

vi.mock('@/components/DataSelect', () => ({
  DataSelect: ({ value, onValueChange, options }: DataSelectProps) => (
    <select
      data-testid="data-select"
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
    >
      <option value="">Select organization</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  ),
}));

interface DateTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

vi.mock('@/components/DateTimePicker', () => ({
  DateTimePicker: ({ value, onChange, placeholder }: DateTimePickerProps) => (
    <input
      data-testid={`date-time-picker-${placeholder?.replace(/\s+/g, '-').toLowerCase()}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

vi.mock('@/components/RichTextEditor/RichTextEditor', () => ({
  RichTextEditor: ({ value, onChange }: RichTextEditorProps) => (
    <textarea
      data-testid="rich-text-editor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

const mockAssignment: Assignment = {
  id: 'assign-123',
  organizationId: 1,
  title: 'Existing Assignment',
  shortDescription: 'Short summary',
  longDescription: '<p>Detailed content</p>',
  availableAt: '2026-01-01T00:00:00.000Z',
  dueAt: '2026-01-10T00:00:00.000Z',
  publishedAt: '2026-01-01T00:00:00.000Z',
  organization: {
    id: '1',
    name: 'KodingUp Academy',
  },
} as unknown as Assignment;

const mockOrgOptions = [
  { label: 'KodingUp Academy', value: '1' },
  { label: 'Tech Institute', value: '2' },
];

describe('AssignmentForm Component', () => {
  const mockNavigate = vi.fn();
  const mockCreateMutate = vi.fn();
  const mockUpdateMutate = vi.fn();

  beforeEach(() => {
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    vi.mocked(useOrganizationOptions).mockReturnValue({
      organizationOptions: mockOrgOptions,
      page: 1,
      searchQuery: '',
      setPage: vi.fn(),
      handleSearchOrgChange: vi.fn(),
      isOrgsLoading: false,
      totalOrgs: 2,
    });

    vi.mocked(useCreateAssignment).mockReturnValue({
      mutate: mockCreateMutate,
      isPending: false,
    } as unknown as ReturnType<typeof useCreateAssignment>);

    vi.mocked(useUpdateAssignment).mockReturnValue({
      mutate: mockUpdateMutate,
      isPending: false,
    } as unknown as ReturnType<typeof useUpdateAssignment>);
  });

  const renderComponent = (assignment?: Assignment) => {
    return render(
      <MemoryRouter>
        <AssignmentForm assignment={assignment} />
      </MemoryRouter>,
    );
  };

  it('renders in create mode with empty default values', () => {
    renderComponent();

    expect(screen.getByPlaceholderText('Enter title')).toHaveValue('');
    expect(screen.getByPlaceholderText('Enter description')).toHaveValue('');
    expect(screen.getByTestId('data-select')).toHaveValue('');
    expect(
      screen.getByRole('button', { name: 'Save Draft' }),
    ).toBeInTheDocument();
  });

  it('populates form fields correctly when assignment prop is provided', async () => {
    renderComponent(mockAssignment);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter title')).toHaveValue(
        'Existing Assignment',
      );
      expect(screen.getByPlaceholderText('Enter description')).toHaveValue(
        'Short summary',
      );
      expect(screen.getByTestId('data-select')).toHaveValue('1');
      expect(
        screen.getByRole('button', { name: 'Update' }),
      ).toBeInTheDocument();
    });
  });

  it('navigates to /assignments when Cancel button is clicked in AssignmentStatus', async () => {
    const user = userEvent.setup();
    renderComponent();

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    await user.click(cancelButton);

    expect(mockNavigate).toHaveBeenCalledWith('/assignments');
  });

  it('displays validation error messages when submitting an empty form', async () => {
    const { container } = renderComponent();

    const form = container.querySelector('#assignment-form') as HTMLFormElement;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
      expect(
        screen.getByText('Short description is required'),
      ).toBeInTheDocument();
      expect(screen.getByText('Organization is required')).toBeInTheDocument();
      expect(
        screen.getByText('Available date is required'),
      ).toBeInTheDocument();
      expect(screen.getByText('Due date is required')).toBeInTheDocument();
      expect(
        screen.getByText('Long description is required'),
      ).toBeInTheDocument();
    });
  });

  it('submits form for creating a new assignment when input is valid', async () => {
    const user = userEvent.setup();
    const { container } = renderComponent();

    await user.type(
      screen.getByPlaceholderText('Enter title'),
      'New Assignment',
    );
    await user.type(
      screen.getByPlaceholderText('Enter description'),
      'New short description',
    );
    await user.selectOptions(screen.getByTestId('data-select'), '1');
    await user.type(
      screen.getByTestId('date-time-picker-pick-a-date'),
      '2026-05-01T00:00:00.000Z',
    );
    await user.type(
      screen.getByTestId('date-time-picker-pick-a-date-and-time'),
      '2026-05-10T00:00:00.000Z',
    );
    await user.type(
      screen.getByTestId('rich-text-editor'),
      'Detailed long description',
    );

    const form = container.querySelector('#assignment-form') as HTMLFormElement;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockCreateMutate).toHaveBeenCalledWith({
        organizationId: 1,
        title: 'New Assignment',
        shortDescription: 'New short description',
        longDescription: 'Detailed long description',
        availableAt: '2026-05-01T00:00:00.000Z',
        dueAt: '2026-05-10T00:00:00.000Z',
      });
    });
  });

  it('submits form for updating an existing assignment when input is valid', async () => {
    const { container } = renderComponent(mockAssignment);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter title')).toHaveValue(
        'Existing Assignment',
      );
    });

    const form = container.querySelector('#assignment-form') as HTMLFormElement;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockUpdateMutate).toHaveBeenCalledWith({
        assignmentId: 'assign-123',
        payload: {
          organizationId: 1,
          title: 'Existing Assignment',
          shortDescription: 'Short summary',
          longDescription: '<p>Detailed content</p>',
          availableAt: '2026-01-01T00:00:00.000Z',
          dueAt: '2026-01-10T00:00:00.000Z',
        },
      });
    });
  });

  it('shows Saving... state on submit button while mutation is loading', () => {
    vi.mocked(useCreateAssignment).mockReturnValue({
      mutate: mockCreateMutate,
      isPending: true,
    } as unknown as ReturnType<typeof useCreateAssignment>);

    renderComponent();

    expect(
      screen.getByRole('button', { name: 'Saving...' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Saving...' })).toHaveAttribute(
      'form',
      'assignment-form',
    );
  });
});
