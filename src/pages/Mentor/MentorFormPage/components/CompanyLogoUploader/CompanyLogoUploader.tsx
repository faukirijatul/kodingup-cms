import { IconUserCircle } from '@/components/icons/IconUserCircle';
import { Button } from '@/components/ui/button';
import { useUpload } from '@/hooks/upload/useUpload';
import { Upload, X } from 'lucide-react';

const MAX_FILE_SIZE_TWO_MB = {
  value: 2 * 1024 * 1024,
  label: '2MB',
};

interface CompanyLogoUploaderProps {
  value?: File | string | null;
  onChange: (file: File | string | null) => void;
  className?: string;
}

export function CompanyLogoUploader({
  value,
  onChange,
  className,
}: CompanyLogoUploaderProps) {
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
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex items-center justify-between gap-2 transition-colors ${
        isDragging ? 'opacity-70' : ''
      } ${className || ''}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpg, image/jpeg"
        className="hidden"
        onChange={handleFileChange}
      />

      {preview ? (
        <div className="group relative flex items-center justify-between">
          <img
            src={preview}
            alt="Company Thumbnail"
            onClick={handleClickFileInputButton}
            className="h-9 cursor-pointer object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <X className="cursor-pointer text-white" />
          </button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={handleClickFileInputButton}
          className="h-9"
        >
          <IconUserCircle />
        </Button>
      )}

      <Button
        type="button"
        variant="outline"
        onClick={handleClickFileInputButton}
        className="flex w-full items-center gap-3.5"
      >
        <Upload size={16} />
        <span>Upload Image</span>
      </Button>
    </div>
  );
}
