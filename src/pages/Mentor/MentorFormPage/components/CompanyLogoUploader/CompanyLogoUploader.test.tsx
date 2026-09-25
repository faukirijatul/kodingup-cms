import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { CompanyLogoUploader } from './CompanyLogoUploader';

vi.mock('lucide-react', () => ({
  Upload: () => <span data-testid="icon-upload" />,
  X: () => <span data-testid="icon-x" />,
}));

// Mock IconUserCircle
vi.mock('@/components/icons/IconUserCircle', () => ({
  IconUserCircle: () => <span data-testid="icon-user-circle" />,
}));

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  children?: ReactNode;
  variant?: string;
}

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, type, className }: ButtonProps) => (
    <button type={type} onClick={onClick} className={className}>
      {children}
    </button>
  ),
}));

describe('CompanyLogoUploader Component', () => {
  it('renders default state without image preview correctly', () => {
    render(<CompanyLogoUploader onChange={vi.fn()} />);

    expect(screen.getByTestId('icon-user-circle')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /upload image/i }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('icon-upload')).toBeInTheDocument();

    expect(screen.queryByAltText('Company Thumbnail')).not.toBeInTheDocument();
  });

  it('renders image preview when value URL string is provided', () => {
    render(
      <CompanyLogoUploader
        value="https://example.com/company-logo.png"
        onChange={vi.fn()}
      />,
    );

    const thumbnail = screen.getByAltText('Company Thumbnail');
    expect(thumbnail).toBeInTheDocument();
    expect(thumbnail).toHaveAttribute(
      'src',
      'https://example.com/company-logo.png',
    );

    expect(screen.queryByTestId('icon-user-circle')).not.toBeInTheDocument();
  });

  it('triggers file input click when clicking Upload Image button', async () => {
    const user = userEvent.setup();
    const { container } = render(<CompanyLogoUploader onChange={vi.fn()} />);

    const hiddenInput = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const inputClickSpy = vi.spyOn(hiddenInput, 'click');

    const uploadButton = screen.getByRole('button', { name: /upload image/i });
    await user.click(uploadButton);

    expect(inputClickSpy).toHaveBeenCalledTimes(1);
  });

  it('triggers file input click when clicking image preview', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <CompanyLogoUploader
        value="https://example.com/company-logo.png"
        onChange={vi.fn()}
      />,
    );

    const hiddenInput = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const inputClickSpy = vi.spyOn(hiddenInput, 'click');

    const thumbnail = screen.getByAltText('Company Thumbnail');
    await user.click(thumbnail);

    expect(inputClickSpy).toHaveBeenCalledTimes(1);
  });

  it('calls onChange when user uploads a file through input change', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const { container } = render(
      <CompanyLogoUploader onChange={handleChange} />,
    );

    const file = new File(['dummy logo'], 'logo.png', { type: 'image/png' });
    const hiddenInput = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    await user.upload(hiddenInput, file);

    expect(handleChange).toHaveBeenCalledWith(file);
  });

  it('calls onChange with null when clicking remove button on preview', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <CompanyLogoUploader
        value="https://example.com/company-logo.png"
        onChange={handleChange}
      />,
    );

    const removeButton = screen.getByTestId('icon-x').parentElement!;
    await user.click(removeButton);

    expect(handleChange).toHaveBeenCalledWith(null);
  });

  it('applies opacity-70 class on container during drag over state', () => {
    const { container } = render(<CompanyLogoUploader onChange={vi.fn()} />);

    const uploaderContainer = container.firstChild as HTMLElement;

    fireEvent.dragOver(uploaderContainer);
    expect(uploaderContainer.className).toContain('opacity-70');

    fireEvent.dragLeave(uploaderContainer);
    expect(uploaderContainer.className).not.toContain('opacity-70');
  });
});
