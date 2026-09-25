import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { AvatarUploader } from './AvatarUploader';

vi.mock('lucide-react', () => ({
  X: () => <span data-testid="icon-x" />,
}));

vi.mock('@/components/icons/IconUser', () => ({
  IconUser: () => <span data-testid="icon-user" />,
}));

describe('AvatarUploader Component', () => {
  it('renders default placeholder state when no value is provided', () => {
    render(<AvatarUploader onChange={vi.fn()} />);

    expect(screen.getByTestId('icon-user')).toBeInTheDocument();
    expect(screen.getByText('Upload avatar')).toBeInTheDocument();
    expect(screen.getByText('PNG, JPG up to 2MB')).toBeInTheDocument();
    expect(screen.queryByAltText('Mentor Avatar')).not.toBeInTheDocument();
  });

  it('renders avatar image preview when value URL string is provided', () => {
    render(
      <AvatarUploader
        value="https://example.com/avatar.jpg"
        onChange={vi.fn()}
      />,
    );

    const img = screen.getByAltText('Mentor Avatar');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    expect(screen.queryByTestId('icon-user')).not.toBeInTheDocument();
  });

  it('triggers file input click when clicking on the uploader container', async () => {
    const user = userEvent.setup();
    render(<AvatarUploader onChange={vi.fn()} />);

    const hiddenFileInput = screen.getByText('Upload avatar').parentElement
      ?.previousElementSibling as HTMLInputElement;

    const inputClickSpy = vi.spyOn(hiddenFileInput, 'click');

    const dropzone = screen.getByTestId('icon-user').parentElement!;
    await user.click(dropzone);

    expect(inputClickSpy).toHaveBeenCalled();
  });

  it('calls onChange when user selects a file through input change', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<AvatarUploader onChange={handleChange} />);

    const file = new File(['avatar content'], 'avatar.png', {
      type: 'image/png',
    });
    const hiddenFileInput = screen
      .getByText('Upload avatar')
      .parentElement?.parentElement?.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;

    await user.upload(hiddenFileInput, file);

    expect(handleChange).toHaveBeenCalledWith(file);
  });

  it('calls onChange with null when clicking remove button on active preview', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <AvatarUploader
        value="https://example.com/avatar.jpg"
        onChange={handleChange}
      />,
    );

    const removeButton = screen.getByTestId('icon-x').parentElement!;
    await user.click(removeButton);

    expect(handleChange).toHaveBeenCalledWith(null);
  });

  it('applies bg-bg-secondary class during drag over state on dropzone', () => {
    render(<AvatarUploader onChange={vi.fn()} />);

    const dropzone = screen.getByTestId('icon-user').parentElement!;

    fireEvent.dragOver(dropzone);
    expect(dropzone.className).toContain('bg-bg-secondary');

    fireEvent.dragLeave(dropzone);
    expect(dropzone.className).toContain('bg-bg-primary');
  });
});
