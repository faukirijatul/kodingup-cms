import { Plus, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useUpload } from '@/hooks/useUpload';

interface ThumbnailUploaderProps {
  value?: File | string | null;
  onChange: (file: File | string | null) => void;
  className?: string;
}

export function ThumbnailUploader({
  value,
  onChange,
  className,
}: ThumbnailUploaderProps) {
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
  });

  return (
    <div className={cn('w-full', className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {preview ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'border-dark relative flex h-49 w-full items-center justify-between rounded-md border border-dashed p-4 transition-colors',
            isDragging ? 'bg-bg-secondary' : 'bg-bg-primary',
          )}
        >
          <div className="group border-dark relative h-full overflow-hidden rounded-md border">
            <img
              src={preview}
              alt="Course Thumbnail"
              className="h-40.5 w-[288px] object-cover object-center"
            />
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
              <Button type="button" onClick={handleClickFileInputButton}>
                <Upload className="h-4 w-4" />
                Change
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
                Remove
              </Button>
            </div>
          </div>

          <div className="text-muted text-xs leading-4 font-normal">1/1</div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'border-dark flex h-15.5 w-full cursor-pointer items-center justify-start gap-3 rounded-lg border border-dashed p-4 transition-colors',
            isDragging ? 'bg-bg-secondary' : 'bg-bg-primary',
          )}
        >
          <Button type="button" onClick={handleClickFileInputButton}>
            <Plus className="h-4 w-4" />
            Add files
          </Button>

          <span className="text-muted text-sm">
            Drop files here or click to browse (max 1 files)
          </span>
        </div>
      )}
    </div>
  );
}
