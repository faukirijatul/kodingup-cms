import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

interface UseUploadParams {
  value?: File | string | null;
  onChange: (file: File | string | null) => void;
  maxSize?: {
    value: number;
    label: string;
  };
}

export function useUpload({ value, onChange, maxSize }: UseUploadParams) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const objectUrl = useMemo(() => {
    if (value instanceof File) {
      return URL.createObjectURL(value);
    }
    return null;
  }, [value]);

  const preview = typeof value === 'string' ? value : objectUrl;

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !file.type.startsWith('image/')) return;

      if (maxSize && file.size > maxSize.value) {
        e.target.value = '';
        toast.error('The image size can not more than ' + maxSize.label);
        return;
      }

      onChange(file);
    },
    [onChange, maxSize],
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (!file || !file.type.startsWith('image/')) return;

      if (maxSize && file.size > maxSize.value) {
        toast.error('The image size can not more than ' + maxSize.label);
        return;
      }

      onChange(file);
    },
    [onChange, maxSize],
  );

  const handleClickFileInputButton = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      fileInputRef.current?.click();
    },
    [fileInputRef],
  );

  const handleRemove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onChange(null);
    },
    [onChange],
  );

  return {
    isDragging,
    fileInputRef,
    preview,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleClickFileInputButton,
    handleRemove,
  };
}
