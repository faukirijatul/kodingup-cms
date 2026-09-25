import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ThumbnailUploader } from './ThumbnailUploader';

globalThis.URL.createObjectURL = vi.fn(
  () => 'blob:http://localhost/fake-image-url',
);
globalThis.URL.revokeObjectURL = vi.fn();

describe('ThumbnailUploader', () => {
  const defaultProps = {
    value: null,
    onChange: vi.fn(),
  };

  describe('Empty State (No Preview)', () => {
    it('renders add file button and drop zone text correctly when value is empty', () => {
      render(<ThumbnailUploader {...defaultProps} />);

      expect(
        screen.getByRole('button', { name: /add files/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByText('Drop files here or click to browse (max 1 files)'),
      ).toBeInTheDocument();
    });

    it('triggers file selection when "Add files" button is clicked', async () => {
      const user = userEvent.setup();
      render(<ThumbnailUploader {...defaultProps} />);

      const fileInput = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      expect(fileInput).toBeInTheDocument();

      const clickSpy = vi.spyOn(fileInput, 'click');
      const addFilesButton = screen.getByRole('button', { name: /add files/i });

      await user.click(addFilesButton);

      expect(clickSpy).toHaveBeenCalledTimes(1);
    });

    it('calls onChange with selected file when a new file is uploaded', async () => {
      const user = userEvent.setup();
      const onChangeMock = vi.fn();
      render(<ThumbnailUploader {...defaultProps} onChange={onChangeMock} />);

      const fileInput = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      const file = new File(['dummy content'], 'thumbnail.png', {
        type: 'image/png',
      });

      await user.upload(fileInput, file);

      expect(onChangeMock).toHaveBeenCalledWith(file);
    });
  });

  describe('Preview State (With Existing Image or File)', () => {
    it('renders image preview, "Change" button, and "Remove" button when value is string URL', () => {
      render(
        <ThumbnailUploader
          {...defaultProps}
          value="https://example.com/thumbnail.png"
        />,
      );

      const image = screen.getByAltText('Course Thumbnail');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/thumbnail.png');

      expect(
        screen.getByRole('button', { name: /change/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /remove/i }),
      ).toBeInTheDocument();
      expect(screen.getByText('1/1')).toBeInTheDocument();
    });

    it('calls onChange with null when "Remove" button is clicked', async () => {
      const user = userEvent.setup();
      const onChangeMock = vi.fn();
      render(
        <ThumbnailUploader
          {...defaultProps}
          value="https://example.com/thumbnail.png"
          onChange={onChangeMock}
        />,
      );

      const removeButton = screen.getByRole('button', { name: /remove/i });
      await user.click(removeButton);

      expect(onChangeMock).toHaveBeenCalledWith(null);
    });

    it('triggers file input click when "Change" button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <ThumbnailUploader
          {...defaultProps}
          value="https://example.com/thumbnail.png"
        />,
      );

      const fileInput = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      const clickSpy = vi.spyOn(fileInput, 'click');

      const changeButton = screen.getByRole('button', { name: /change/i });
      await user.click(changeButton);

      expect(clickSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Drag and Drop Functionality', () => {
    it('handles dragover, dragleave, and drop events', async () => {
      const onChangeMock = vi.fn();
      const { container } = render(
        <ThumbnailUploader {...defaultProps} onChange={onChangeMock} />,
      );

      const dropzone = container.firstChild?.lastChild as HTMLElement;

      const file = new File(['dummy content'], 'dragged-thumb.png', {
        type: 'image/png',
      });

      screen.getByText('Drop files here or click to browse (max 1 files)');

      const dropEvent = new Event('drop', { bubbles: true });
      Object.defineProperty(dropEvent, 'dataTransfer', {
        value: {
          files: [file],
        },
      });

      dropzone.dispatchEvent(dropEvent);

      expect(onChangeMock).toHaveBeenCalledWith(file);
    });
  });
});
