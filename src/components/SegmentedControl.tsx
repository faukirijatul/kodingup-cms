import { useCallback } from 'react';

interface SegmentedControlProps {
  segments: { label: string; value: number }[];
  selectedSegment: number;
  onSelectSegment: (value: number) => void;
}

export function SegmentedControl({
  segments,
  selectedSegment,
  onSelectSegment,
}: SegmentedControlProps) {
  const handleClickSegment = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const value = Number(event.currentTarget.dataset.value);
      onSelectSegment(value);
    },
    [onSelectSegment],
  );

  return (
    <nav className="border-dark flex gap-8 border-b">
      {segments.map((segment) => (
        <button
          key={segment.value}
          type="button"
          className={`h-10.5 cursor-pointer text-sm leading-5 font-medium ${
            selectedSegment === segment.value
              ? 'text-blue border-blue border-b-2'
              : 'text-muted hover:text-white'
          }`}
          data-value={segment.value}
          onClick={handleClickSegment}
        >
          {segment.label}
        </button>
      ))}
    </nav>
  );
}
