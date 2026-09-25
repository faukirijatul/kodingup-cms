import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useUpload } from './useUpload';
import { toast } from 'sonner';

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe('useUpload Hook', () => {
  const createDummyFile = (name: string, size: number, type: string) => {
    const file = new File(['a'.repeat(size)], name, { type });
    return file;
  };

  beforeEach(() => {
    globalThis.URL.createObjectURL = vi.fn(
      () => 'blob:http://localhost/mock-url',
    );
    globalThis.URL.revokeObjectURL = vi.fn();
  });

  it('returns URL string directly as preview if value is string', () => {
    const { result } = renderHook(() =>
      useUpload({ value: 'https://example.com/image.png', onChange: vi.fn() }),
    );

    expect(result.current.preview).toBe('https://example.com/image.png');
  });

  it('creates object URL for File value and revokes it on unmount', () => {
    const file = createDummyFile('test.png', 1000, 'image/png');
    const { result, unmount } = renderHook(() =>
      useUpload({ value: file, onChange: vi.fn() }),
    );

    expect(globalThis.URL.createObjectURL).toHaveBeenCalledWith(file);
    expect(result.current.preview).toBe('blob:http://localhost/mock-url');

    unmount();
    expect(globalThis.URL.revokeObjectURL).toHaveBeenCalledWith(
      'blob:http://localhost/mock-url',
    );
  });

  it('handles handleFileChange with valid image file', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useUpload({ onChange }));

    const file = createDummyFile('valid.jpg', 1024, 'image/jpeg');
    const event = {
      target: { files: [file], value: 'fake-path' },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleFileChange(event);
    });

    expect(onChange).toHaveBeenCalledWith(file);
  });

  it('rejects non-image files in handleFileChange', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useUpload({ onChange }));

    const file = createDummyFile('doc.pdf', 1024, 'application/pdf');
    const event = {
      target: { files: [file], value: 'fake-path' },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleFileChange(event);
    });

    expect(onChange).not.toHaveBeenCalled();
  });

  it('validates file size limit and shows toast error when exceeding maxSize', () => {
    const onChange = vi.fn();
    const maxSize = { value: 2000, label: '2KB' };
    const { result } = renderHook(() => useUpload({ onChange, maxSize }));

    const file = createDummyFile('large.png', 3000, 'image/png');
    const event = {
      target: { files: [file], value: 'fake-path' },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleFileChange(event);
    });

    expect(onChange).not.toHaveBeenCalled();
    expect(event.target.value).toBe('');
    expect(toast.error).toHaveBeenCalledWith(
      'The image size can not more than 2KB',
    );
  });

  it('manages dragging states during drag over and drag leave', () => {
    const { result } = renderHook(() => useUpload({ onChange: vi.fn() }));

    const mockEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as unknown as React.DragEvent<HTMLDivElement>;

    act(() => {
      result.current.handleDragOver(mockEvent);
    });
    expect(result.current.isDragging).toBe(true);

    act(() => {
      result.current.handleDragLeave(mockEvent);
    });
    expect(result.current.isDragging).toBe(false);
  });

  it('processes valid file drop via handleDrop', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useUpload({ onChange }));

    const file = createDummyFile('dropped.png', 1000, 'image/png');
    const dropEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      dataTransfer: { files: [file] },
    } as unknown as React.DragEvent<HTMLElement>;

    act(() => {
      result.current.handleDrop(dropEvent);
    });

    expect(result.current.isDragging).toBe(false);
    expect(onChange).toHaveBeenCalledWith(file);
  });

  it('calls onChange with null when handleRemove is triggered', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useUpload({ onChange }));

    const clickEvent = {
      stopPropagation: vi.fn(),
    } as unknown as React.MouseEvent<HTMLButtonElement>;

    act(() => {
      result.current.handleRemove(clickEvent);
    });

    expect(clickEvent.stopPropagation).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(null);
  });
});
