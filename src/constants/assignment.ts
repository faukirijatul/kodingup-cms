export const ASSIGNMENT_STATUS = ['Published', 'Unpublished'];

export const ASSIGNMENT_STATUS_STYLES: Record<
  (typeof ASSIGNMENT_STATUS)[number],
  { bg: string; border: string; text: string; dot: string }
> = {
  Published: {
    bg: 'bg-[#032E15]',
    border: 'border-[#0D542B]',
    text: 'text-[#00A63E]',
    dot: 'bg-[#00A63E]',
  },
  Unpublished: {
    bg: 'bg-[#27272A]',
    border: 'border-[#27272A]',
    text: 'text-[#FAFAFA]',
    dot: 'bg-[#FAFAFA]',
  },
};
