interface Props {
  className?: string;
}

export function IconCloseSidebar({ className = '' }: Props) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g opacity="0.6">
        <path
          d="M11.3334 12L7.33337 8L11.3334 4"
          stroke="#FAFAFA"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.66663 4V12"
          stroke="#FAFAFA"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
