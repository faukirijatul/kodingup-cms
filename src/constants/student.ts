export const STUDENT_STATUS = Object.freeze({
  ENROLLED: 0,
  PENDING: 1,
});

export const STUDENT_STATUS2 = ['Ongoing', 'Enrolled', 'Pending'];

export const STUDENT_STATUS_STYLES: Record<
  (typeof STUDENT_STATUS2)[number],
  { bg: string; border: string; text: string; dot: string }
> = {
  Ongoing: {
    bg: 'bg-[#162456]',
    border: 'border-[#1C398E]',
    text: 'text-[#93C5FD]',
    dot: 'bg-[#3B82F6]',
  },
  Enrolled: {
    bg: 'bg-[#052E16]',
    border: 'border-[#166534]',
    text: 'text-[#86EFAC]',
    dot: 'bg-[#22C55E]',
  },
  Pending: {
    bg: 'bg-[#422006]',
    border: 'border-[#A16207]',
    text: 'text-[#FDE68A]',
    dot: 'bg-[#EAB308]',
  },
};
