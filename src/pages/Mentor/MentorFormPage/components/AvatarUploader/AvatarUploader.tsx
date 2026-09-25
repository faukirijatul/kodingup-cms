import { IconUser } from '@/components/icons/IconUser';
import { useUpload } from '@/hooks/upload/useUpload';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

const MAX_FILE_SIZE_TWO_MB = {
  value: 2 * 1024 * 1024,
  label: '2MB',
};

interface AvatarUploaderProps {
  value?: File | string | null;
  onChange: (file: File | string | null) => void;
  className?: string;
}

export function AvatarUploader({
  value,
  onChange,
  className,
}: AvatarUploaderProps) {
  const {
    isDragging,
    fileInputRef,
    preview,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleClickFileInputButton,
    handleRemove,
  } = useUpload({
    value,
    onChange,
    maxSize: MAX_FILE_SIZE_TWO_MB,
  });

  return (
    <div className={cn('flex w-full justify-center', className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpg, image/jpeg"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex flex-col items-center">
        {preview ? (
          <div className="group relative mb-4.25 flex h-23.5 w-23.5 cursor-pointer items-center justify-center rounded-full">
            <img
              src={preview}
              alt="Mentor Avatar"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleClickFileInputButton}
              className="border-dark h-23.5 w-23.5 rounded-full border border-dashed object-cover object-center"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X className="cursor-pointer" />
            </button>
          </div>
        ) : (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClickFileInputButton}
            className={cn(
              'border-dark mb-4.25 flex h-23.5 w-23.5 cursor-pointer items-center justify-center rounded-full border border-dashed',
              isDragging ? 'bg-bg-secondary' : 'bg-bg-primary',
            )}
          >
            <IconUser size={24} />
          </div>
        )}
        <p className="text-white-primary text-sm leading-5 font-medium tracking-normal">
          Upload avatar
        </p>
        <p className="text-muted pt-0.5 text-xs leading-4 font-normal tracking-normal">
          PNG, JPG up to 2MB
        </p>
      </div>
    </div>
  );
}
