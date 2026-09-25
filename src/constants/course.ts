export const COURSE_STATUS = ['Published'];

export const COURSE_STATUS_STYLES: Record<
  (typeof COURSE_STATUS)[number],
  { bg: string; border: string; text: string; dot: string }
> = {
  Published: {
    bg: 'bg-[#032E15]',
    border: 'border-[#0D542B]',
    text: 'text-[#00A63E]',
    dot: 'bg-[#00A63E]',
  },
};
