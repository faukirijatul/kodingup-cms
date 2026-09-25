import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { MentorDetailModal } from './MentorDetailModal';
import type { Mentor } from '@/types/mentor';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }: { children: ReactNode; open: boolean }) =>
    open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({
    children,
    className,
  }: {
    children: ReactNode;
    className?: string;
  }) => (
    <div data-testid="dialog-content" className={className}>
      {children}
    </div>
  ),
  DialogFooter: ({
    children,
    className,
  }: {
    children: ReactNode;
    className?: string;
  }) => (
    <div data-testid="dialog-footer" className={className}>
      {children}
    </div>
  ),
}));

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  children?: ReactNode;
  variant?: string;
}

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, type, variant }: ButtonProps) => (
    <button onClick={onClick} type={type} data-variant={variant}>
      {children}
    </button>
  ),
}));

vi.mock('@/components/icons/IconVerified', () => ({
  IconVerified: () => <span data-testid="icon-verified" />,
}));

vi.mock('@/components/RichTextEditor/RichTextContent', () => ({
  RichTextContent: ({ content }: { content?: string }) => (
    <div data-testid="rich-text-content">{content}</div>
  ),
}));

const mockMentor: Mentor = {
  id: 'mentor-123',
  firstName: 'Jane',
  lastName: 'Doe',
  title: 'Senior Software Engineer',
  avatarUrl: 'https://example.com/avatar.jpg',
  companyLogoUrl: 'https://example.com/company-logo.png',
  shortDescription: 'Passionate about frontend development.',
  longDescription: '<p>Experienced developer with 10+ years in Web Tech.</p>',
  expertises: ['React', 'TypeScript', 'Tailwind CSS'],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('MentorDetailModal Component', () => {
  it('renders modal content correctly when open is true and mentor data is provided', () => {
    render(
      <MentorDetailModal
        open={true}
        onOpenChange={vi.fn()}
        mentor={mockMentor}
      />,
    );

    expect(screen.getByTestId('dialog')).toBeInTheDocument();

    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();
    expect(
      screen.getByText('Passionate about frontend development.'),
    ).toBeInTheDocument();

    const images = screen.getAllByRole('img');
    const avatar = images.find(
      (img) => img.getAttribute('alt') === 'Mentor Avatar',
    );
    const logo = images.find(
      (img) => img.getAttribute('alt') === 'Company Logo',
    );

    expect(avatar).toHaveAttribute('src', mockMentor.avatarUrl);
    expect(logo).toHaveAttribute('src', mockMentor.companyLogoUrl);

    expect(screen.getByTestId('icon-verified')).toBeInTheDocument();

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Tailwind CSS')).toBeInTheDocument();

    expect(screen.getByTestId('rich-text-content')).toHaveTextContent(
      mockMentor.longDescription,
    );
  });

  it('does not render modal content when open is false', () => {
    render(
      <MentorDetailModal
        open={false}
        onOpenChange={vi.fn()}
        mentor={mockMentor}
      />,
    );

    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });

  it('navigates to edit form URL with correct mentorId when Edit button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <MentorDetailModal
        open={true}
        onOpenChange={vi.fn()}
        mentor={mockMentor}
      />,
    );

    const editButton = screen.getByRole('button', { name: /edit/i });
    await user.click(editButton);

    expect(mockNavigate).toHaveBeenCalledWith('form?mentorId=mentor-123');
  });

  it('handles empty or null mentor gracefully without crashing', () => {
    render(
      <MentorDetailModal open={true} onOpenChange={vi.fn()} mentor={null} />,
    );

    expect(screen.getByTestId('dialog')).toBeInTheDocument();
    expect(screen.queryByText('Jane Doe')).not.toBeInTheDocument();
  });
});
