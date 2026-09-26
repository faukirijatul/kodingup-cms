import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent, {
  PointerEventsCheckLevel,
} from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { toast } from 'sonner';
import { InviteStudentModal } from './InviteStudentModal';
import { useListOrganizations } from '@/hooks/organizations/useListOrganizations';
import { useInviteStudent } from '@/hooks/studentInvitations/useInviteStudent';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('@/hooks/organizations/useListOrganizations', () => ({
  useListOrganizations: vi.fn(),
}));

vi.mock('@/hooks/studentInvitations/useInviteStudent', () => ({
  useInviteStudent: vi.fn(),
}));

vi.mock('@/components/DataSelect', () => ({
  DataSelect: ({ value, onValueChange }: DataSelectMockProps) => (
    <button
      type="button"
      data-testid="data-select"
      data-value={value || ''}
      onClick={() => onValueChange('1')}
    >
      Select Organization Option
    </button>
  ),
}));

interface DataSelectMockProps {
  value?: string;
  onValueChange: (value: string) => void;
}

type UseListOrganizationsReturn = ReturnType<typeof useListOrganizations>;
type UseInviteStudentReturn = ReturnType<typeof useInviteStudent>;
type UseInviteStudentOptions = Parameters<typeof useInviteStudent>[0];

describe('InviteStudentModal', () => {
  const mockOnOpenChange = vi.fn();
  const mockMutate = vi.fn();

  const mockOrgsData = {
    data: [
      { id: '1', name: 'Org Alpha' },
      { id: '2', name: 'Org Beta' },
    ],
    meta: { total: 2 },
  };

  beforeEach(() => {
    vi.mocked(useListOrganizations).mockReturnValue({
      data: mockOrgsData,
      isLoading: false,
    } as UseListOrganizationsReturn);

    vi.mocked(useInviteStudent).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as unknown as UseInviteStudentReturn);
  });

  describe('Modal Visibility & Initial Render', () => {
    it('does not render modal content when open is false', () => {
      render(
        <InviteStudentModal open={false} onOpenChange={mockOnOpenChange} />,
      );

      expect(screen.queryByText('Invite Student')).not.toBeInTheDocument();
    });

    it('renders form fields correctly when open is true', () => {
      render(
        <InviteStudentModal open={true} onOpenChange={mockOnOpenChange} />,
      );

      expect(
        screen.getByRole('heading', { name: 'Invite Student' }),
      ).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByTestId('data-select')).toBeInTheDocument();
      expect(screen.getByLabelText('Invitation Message')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Send Invitation' }),
      ).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('displays validation errors when submitting empty form', async () => {
      const user = userEvent.setup({
        pointerEventsCheck: PointerEventsCheckLevel.Never,
      });
      render(
        <InviteStudentModal open={true} onOpenChange={mockOnOpenChange} />,
      );

      const submitButton = screen.getByRole('button', {
        name: 'Send Invitation',
      });

      await user.click(submitButton);

      expect(await screen.findByText('Email is required')).toBeInTheDocument();
      expect(
        await screen.findByText('Organization is required'),
      ).toBeInTheDocument();
      expect(mockMutate).not.toHaveBeenCalled();
    });

    it('displays error for invalid email format', async () => {
      const user = userEvent.setup({
        pointerEventsCheck: PointerEventsCheckLevel.Never,
      });
      render(
        <InviteStudentModal open={true} onOpenChange={mockOnOpenChange} />,
      );

      const emailInput = screen.getByLabelText('Email');
      await user.type(emailInput, 'invalid-email');

      const submitButton = screen.getByRole('button', {
        name: 'Send Invitation',
      });
      await user.click(submitButton);

      expect(
        await screen.findByText('Please enter a valid email address'),
      ).toBeInTheDocument();
      expect(mockMutate).not.toHaveBeenCalled();
    });
  });

  describe('Form Submission Flow', () => {
    it('submits valid data with correct parsed organizationId', async () => {
      const user = userEvent.setup({
        pointerEventsCheck: PointerEventsCheckLevel.Never,
      });
      render(
        <InviteStudentModal open={true} onOpenChange={mockOnOpenChange} />,
      );

      await user.type(screen.getByLabelText('Email'), 'student@example.com');
      await user.click(screen.getByTestId('data-select'));
      await user.type(
        screen.getByLabelText('Invitation Message'),
        'Welcome to KodingUp!',
      );

      const submitButton = screen.getByRole('button', {
        name: 'Send Invitation',
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith({
          email: 'student@example.com',
          organizationId: 1,
        });
      });
    });

    it('triggers success toast and closes modal on mutation success', () => {
      type OnSuccessFn = NonNullable<UseInviteStudentOptions>['onSuccess'];
      let onSuccessCallback: OnSuccessFn;

      vi.mocked(useInviteStudent).mockImplementation(
        (options?: UseInviteStudentOptions) => {
          if (options?.onSuccess) {
            onSuccessCallback = options.onSuccess;
          }
          return {
            mutate: mockMutate,
            isPending: false,
          } as unknown as UseInviteStudentReturn;
        },
      );

      render(
        <InviteStudentModal open={true} onOpenChange={mockOnOpenChange} />,
      );

      act(() => {
        onSuccessCallback?.(
          {} as Parameters<NonNullable<OnSuccessFn>>[0],
          {} as Parameters<NonNullable<OnSuccessFn>>[1],
          undefined,
          undefined as never,
        );
      });

      expect(toast.success).toHaveBeenCalledWith(
        'Student invited successfully',
      );
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    it('triggers error toast on mutation error', () => {
      type OnErrorFn = NonNullable<UseInviteStudentOptions>['onError'];
      let onErrorCallback: OnErrorFn;

      vi.mocked(useInviteStudent).mockImplementation(
        (options?: UseInviteStudentOptions) => {
          if (options?.onError) {
            onErrorCallback = options.onError;
          }
          return {
            mutate: mockMutate,
            isPending: false,
          } as unknown as UseInviteStudentReturn;
        },
      );

      render(
        <InviteStudentModal open={true} onOpenChange={mockOnOpenChange} />,
      );

      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      act(() => {
        onErrorCallback?.(
          new Error('Server Error'),
          {} as Parameters<NonNullable<OnErrorFn>>[1],
          undefined,
          undefined as never,
        );
      });

      expect(toast.error).toHaveBeenCalledWith('Failed to invited student');
      consoleSpy.mockRestore();
    });

    it('disables submit button and shows loading text while pending', () => {
      vi.mocked(useInviteStudent).mockReturnValue({
        mutate: mockMutate,
        isPending: true,
      } as unknown as UseInviteStudentReturn);

      render(
        <InviteStudentModal open={true} onOpenChange={mockOnOpenChange} />,
      );

      const submitButton = screen.getByRole('button', { name: 'Sending...' });
      expect(submitButton).toBeDisabled();
    });
  });
});
