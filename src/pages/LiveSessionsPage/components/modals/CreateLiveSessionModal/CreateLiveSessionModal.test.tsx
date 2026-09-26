import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { CreateLiveSessionModal } from './CreateLiveSessionModal';
import { useGetLiveSession } from '@/hooks/liveSessions/useGetLiveSession';
import { useCreateLiveSession } from '@/hooks/liveSessions/useCreateLiveSession';
import { useUpdateLiveSession } from '@/hooks/liveSessions/useUpdateLiveSession';
import { useOrganizationOptions } from '@/hooks/dataOptions/useOrganizationOptions';
import type { LiveSession } from '@/types/liveSession';

vi.mock('@/hooks/liveSessions/useGetLiveSession');
vi.mock('@/hooks/liveSessions/useCreateLiveSession');
vi.mock('@/hooks/liveSessions/useUpdateLiveSession');
vi.mock('@/hooks/dataOptions/useOrganizationOptions');

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }: { children: ReactNode; open: boolean }) =>
    open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  DialogHeader: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  DialogTitle: ({ children }: { children: ReactNode }) => <h2>{children}</h2>,
  DialogFooter: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  DialogClose: ({ children }: { children: ReactNode }) => <div>{children}</div>,
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

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: ComponentPropsWithoutRef<'button'>) => (
    <button {...props}>{children}</button>
  ),
}));

interface DataSelectProps {
  value: string;
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

vi.mock('./LiveSessionFormSkeleton', () => ({
  LiveSessionFormSkeleton: () => (
    <div data-testid="live-session-skeleton">Loading Skeleton...</div>
  ),
}));

const mockLiveSession: LiveSession = {
  id: 'session-123',
  organizationId: 1,
  title: 'React Advanced Session',
  startAt: '2026-06-01T10:00:00.000Z',
  endAt: '2026-06-01T12:00:00.000Z',
  description: 'In-depth React discussion',
} as unknown as LiveSession;

const mockOrgOptions = [
  { label: 'KodingUp Academy', value: '1' },
  { label: 'Tech Academy', value: '2' },
];

describe('CreateLiveSessionModal Component', () => {
  const mockOnOpenChange = vi.fn();
  const mockCreateMutate = vi.fn();
  const mockUpdateMutate = vi.fn();

  beforeEach(() => {
    vi.mocked(useOrganizationOptions).mockReturnValue({
      organizationOptions: mockOrgOptions,
      page: 1,
      searchQuery: '',
      setPage: vi.fn(),
      handleSearchOrgChange: vi.fn(),
      isOrgsLoading: false,
      totalOrgs: 2,
    });

    vi.mocked(useGetLiveSession).mockReturnValue({
      data: undefined,
      isLoading: false,
    } as unknown as ReturnType<typeof useGetLiveSession>);

    vi.mocked(useCreateLiveSession).mockReturnValue({
      mutate: mockCreateMutate,
      isPending: false,
    } as unknown as ReturnType<typeof useCreateLiveSession>);

    vi.mocked(useUpdateLiveSession).mockReturnValue({
      mutate: mockUpdateMutate,
      isPending: false,
    } as unknown as ReturnType<typeof useUpdateLiveSession>);
  });

  const renderComponent = (
    props: { open?: boolean; selectedLiveSessionId?: string } = {},
  ) => {
    return render(
      <CreateLiveSessionModal
        open={props.open ?? true}
        onOpenChange={mockOnOpenChange}
        selectedLiveSessionId={props.selectedLiveSessionId ?? ''}
      />,
    );
  };

  it('renders modal in Create mode with default form values', () => {
    renderComponent();

    expect(
      screen.getByRole('heading', { name: 'Create Live Session' }),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter title')).toHaveValue('');
    expect(screen.getByPlaceholderText('Enter description')).toHaveValue('');
    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
  });

  it('renders skeleton loading state when fetching live session data in Edit mode', () => {
    vi.mocked(useGetLiveSession).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as unknown as ReturnType<typeof useGetLiveSession>);

    renderComponent({ selectedLiveSessionId: 'session-123' });

    expect(screen.getByTestId('live-session-skeleton')).toBeInTheDocument();
  });

  it('populates form with live session details when in Edit mode', async () => {
    vi.mocked(useGetLiveSession).mockReturnValue({
      data: { data: mockLiveSession },
      isLoading: false,
    } as unknown as ReturnType<typeof useGetLiveSession>);

    renderComponent({ selectedLiveSessionId: 'session-123' });

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Edit Live Session' }),
      ).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter title')).toHaveValue(
        'React Advanced Session',
      );
      expect(screen.getByPlaceholderText('Enter description')).toHaveValue(
        'In-depth React discussion',
      );
      expect(screen.getByTestId('data-select')).toHaveValue('1');
      expect(
        screen.getByRole('button', { name: 'Update' }),
      ).toBeInTheDocument();
    });
  });

  it('displays validation error messages when submitting an empty form', async () => {
    const { container } = renderComponent();

    const form = container.querySelector('form') as HTMLFormElement;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Organization is required')).toBeInTheDocument();
      expect(screen.getByText('Title is required')).toBeInTheDocument();
      expect(screen.getByText('Start date is required')).toBeInTheDocument();
      expect(screen.getByText('End date is required')).toBeInTheDocument();
      expect(screen.getByText('Description is required')).toBeInTheDocument();
    });
  });

  it('calls createLiveSession mutation when submitting valid form in Create mode', async () => {
    const user = userEvent.setup();
    const { container } = renderComponent();

    await user.selectOptions(screen.getByTestId('data-select'), '1');
    await user.type(
      screen.getByPlaceholderText('Enter title'),
      'New Live Session',
    );
    await user.type(
      screen.getAllByTestId('date-time-picker-pick-a-date-and-time')[0],
      '2026-06-01T10:00:00.000Z',
    );
    await user.type(
      screen.getAllByTestId('date-time-picker-pick-a-date-and-time')[1],
      '2026-06-01T12:00:00.000Z',
    );
    await user.type(
      screen.getByPlaceholderText('Enter description'),
      'New Session Description',
    );

    const form = container.querySelector('form') as HTMLFormElement;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockCreateMutate).toHaveBeenCalledWith({
        organizationId: 1,
        title: 'New Live Session',
        startAt: '2026-06-01T10:00:00.000Z',
        endAt: '2026-06-01T12:00:00.000Z',
        description: 'New Session Description',
      });
    });
  });

  it('calls updateLiveSession mutation when submitting valid form in Edit mode', async () => {
    vi.mocked(useGetLiveSession).mockReturnValue({
      data: { data: mockLiveSession },
      isLoading: false,
    } as unknown as ReturnType<typeof useGetLiveSession>);

    const { container } = renderComponent({
      selectedLiveSessionId: 'session-123',
    });

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter title')).toHaveValue(
        'React Advanced Session',
      );
    });

    const form = container.querySelector('form') as HTMLFormElement;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockUpdateMutate).toHaveBeenCalledWith({
        liveSessionId: 'session-123',
        payload: {
          organizationId: 1,
          title: 'React Advanced Session',
          startAt: '2026-06-01T10:00:00.000Z',
          endAt: '2026-06-01T12:00:00.000Z',
          description: 'In-depth React discussion',
        },
      });
    });
  });

  it('shows Saving... and disables submit button while mutation is pending', () => {
    vi.mocked(useCreateLiveSession).mockReturnValue({
      mutate: mockCreateMutate,
      isPending: true,
    } as unknown as ReturnType<typeof useCreateLiveSession>);

    renderComponent();

    const submitButton = screen.getByRole('button', { name: 'Saving...' });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });
});
