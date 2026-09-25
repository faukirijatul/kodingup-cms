import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';

describe('DeleteConfirmationModal', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    onConfirm: vi.fn(),
  };

  it('renders modal with default title, description, and action buttons', () => {
    render(<DeleteConfirmationModal {...defaultProps} />);

    expect(
      screen.getByRole('heading', { name: 'Delete Item' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Are you sure you want to delete this item? This action cannot be undone.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  it('renders custom title and description when provided', () => {
    render(
      <DeleteConfirmationModal
        {...defaultProps}
        title="Delete Course"
        description="Are you sure you want to remove this course?"
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'Delete Course' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Are you sure you want to remove this course?'),
    ).toBeInTheDocument();
  });

  it('calls onConfirm when Delete button is clicked', async () => {
    const user = userEvent.setup();
    render(<DeleteConfirmationModal {...defaultProps} />);

    const deleteButton = screen.getByRole('button', { name: 'Delete' });
    await user.click(deleteButton);

    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('handles isLoading state correctly', () => {
    render(<DeleteConfirmationModal {...defaultProps} isLoading={true} />);

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    const deleteButton = screen.getByRole('button', { name: 'Deleting...' });

    expect(deleteButton).toBeInTheDocument();
    expect(cancelButton).toBeDisabled();
    expect(deleteButton).toBeDisabled();
  });

  it('calls onOpenChange with false when Cancel button is clicked', async () => {
    const user = userEvent.setup();
    const onOpenChangeMock = vi.fn();

    render(
      <DeleteConfirmationModal
        {...defaultProps}
        onOpenChange={onOpenChangeMock}
      />,
    );

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    await user.click(cancelButton);

    expect(onOpenChangeMock).toHaveBeenCalledWith(false);
  });

  it('does not render modal content when open is false', () => {
    render(<DeleteConfirmationModal {...defaultProps} open={false} />);

    expect(
      screen.queryByRole('heading', { name: 'Delete Item' }),
    ).not.toBeInTheDocument();
  });
});
