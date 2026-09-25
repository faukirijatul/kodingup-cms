import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateOrganizationModal } from './CreateOrganizationModal';
import { useGetOrganization } from '@/hooks/organizations/useGetOrganization';
import { useCreateOrganization } from '@/hooks/organizations/useCreateOrganization';
import { useUpdateOrganization } from '@/hooks/organizations/useUpdateOrganization';
import { toast } from 'sonner';

vi.mock('@/hooks/organizations/useGetOrganization');
vi.mock('@/hooks/organizations/useCreateOrganization');
vi.mock('@/hooks/organizations/useUpdateOrganization');
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('./OrganizationFormSkeleton', () => ({
  OrganizationFormSkeleton: () => (
    <div data-testid="organization-form-skeleton">Loading form...</div>
  ),
}));

const mockOrganizationData = {
  data: {
    id: 'org-123',
    name: 'Acme Corporation',
  },
};

describe('CreateOrganizationModal', () => {
  let queryClient: QueryClient;
  const mockOnOpenChange = vi.fn();

  const createWrapper = () => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  beforeEach(() => {
    (useGetOrganization as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: undefined,
      isLoading: false,
    });
    (useCreateOrganization as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
    (useUpdateOrganization as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
  });

  it('renders "Add Organization" modal when selectedOrganizationId is empty', () => {
    render(
      <CreateOrganizationModal
        open={true}
        onOpenChange={mockOnOpenChange}
        selectedOrganizationId=""
      />,
      { wrapper: createWrapper() },
    );

    expect(
      screen.getByRole('heading', { level: 2, name: 'Add Organization' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/organization name/i)).toHaveValue('');
    expect(
      screen.getByRole('button', { name: /^create$/i }),
    ).toBeInTheDocument();
  });

  it('renders form skeleton loader when fetching organization data in edit mode', () => {
    (useGetOrganization as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    render(
      <CreateOrganizationModal
        open={true}
        onOpenChange={mockOnOpenChange}
        selectedOrganizationId="org-123"
      />,
      { wrapper: createWrapper() },
    );

    expect(
      screen.getByRole('heading', { level: 2, name: 'Edit Organization' }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('organization-form-skeleton')).toBeInTheDocument();
  });

  it('pre-fills form with organization name when in edit mode', async () => {
    (useGetOrganization as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockOrganizationData,
      isLoading: false,
    });

    render(
      <CreateOrganizationModal
        open={true}
        onOpenChange={mockOnOpenChange}
        selectedOrganizationId="org-123"
      />,
      { wrapper: createWrapper() },
    );

    expect(
      screen.getByRole('heading', { level: 2, name: 'Edit Organization' }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByLabelText(/organization name/i)).toHaveValue(
        'Acme Corporation',
      );
    });
    expect(
      screen.getByRole('button', { name: /^update$/i }),
    ).toBeInTheDocument();
  });

  it('triggers createOrganization mutation when submitting a valid form', async () => {
    const user = userEvent.setup();
    const mockCreateMutate = vi.fn();

    (useCreateOrganization as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      mutate: mockCreateMutate,
      isPending: false,
    });

    render(
      <CreateOrganizationModal
        open={true}
        onOpenChange={mockOnOpenChange}
        selectedOrganizationId=""
      />,
      { wrapper: createWrapper() },
    );

    const input = screen.getByLabelText(/organization name/i);
    await user.type(input, 'New Tech Startup');

    const submitButton = screen.getByRole('button', { name: /^create$/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockCreateMutate).toHaveBeenCalledWith({
        name: 'New Tech Startup',
      });
    });
  });

  it('triggers updateOrganization mutation when submitting in edit mode', async () => {
    const user = userEvent.setup();
    const mockUpdateMutate = vi.fn();

    (useGetOrganization as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockOrganizationData,
      isLoading: false,
    });
    (useUpdateOrganization as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      mutate: mockUpdateMutate,
      isPending: false,
    });

    render(
      <CreateOrganizationModal
        open={true}
        onOpenChange={mockOnOpenChange}
        selectedOrganizationId="org-123"
      />,
      { wrapper: createWrapper() },
    );

    const input = screen.getByLabelText(/organization name/i);
    await user.clear(input);
    await user.type(input, 'Acme Corp Updated');

    const submitButton = screen.getByRole('button', { name: /^update$/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockUpdateMutate).toHaveBeenCalledWith({
        organizationId: 'org-123',
        payload: {
          name: 'Acme Corp Updated',
        },
      });
    });
  });

  it('handles createOrganization onSuccess callback correctly', () => {
    let onSuccessCallback: () => void = () => {};

    (useCreateOrganization as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      ({ onSuccess }) => {
        onSuccessCallback = onSuccess;
        return { mutate: vi.fn(), isPending: false };
      },
    );

    render(
      <CreateOrganizationModal
        open={true}
        onOpenChange={mockOnOpenChange}
        selectedOrganizationId=""
      />,
      { wrapper: createWrapper() },
    );

    onSuccessCallback();

    expect(toast.success).toHaveBeenCalledWith(
      'Organization created successfully',
    );
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('handles updateOrganization onError callback correctly', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    let onErrorCallback: (error: Error) => void = () => {};

    (useUpdateOrganization as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      ({ onError }) => {
        onErrorCallback = onError;
        return { mutate: vi.fn(), isPending: false };
      },
    );

    render(
      <CreateOrganizationModal
        open={true}
        onOpenChange={mockOnOpenChange}
        selectedOrganizationId="org-123"
      />,
      { wrapper: createWrapper() },
    );

    onErrorCallback(new Error('Update failed'));

    expect(toast.error).toHaveBeenCalledWith('Failed to update organization');
  });

  it('calls onOpenChange with false when cancel button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <CreateOrganizationModal
        open={true}
        onOpenChange={mockOnOpenChange}
        selectedOrganizationId=""
      />,
      { wrapper: createWrapper() },
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });
});
