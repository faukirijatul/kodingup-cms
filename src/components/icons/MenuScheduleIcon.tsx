import type { MenuIconProps } from '@/types/icon';

export function MenuScheduleIcon({ color = '#FAFAFA' }: MenuIconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity="0.6">
        <path
          d="M5.33337 1.33325V3.33325M10.6667 1.33325V3.33325M2.33337 6.05992H13.6667M14.6667 12.6666C14.6667 13.1666 14.5267 13.6399 14.28 14.0399C14.045 14.4349 13.7112 14.7619 13.3114 14.9887C12.9116 15.2155 12.4597 15.3342 12 15.3333C11.3267 15.3333 10.7134 15.0866 10.2467 14.6666C10.04 14.4933 9.86004 14.2799 9.72004 14.0399C9.46627 13.6269 9.33239 13.1514 9.33337 12.6666C9.33337 11.1933 10.5267 9.99992 12 9.99992C12.8 9.99992 13.5134 10.3533 14 10.9066C14.4288 11.3927 14.6658 12.0184 14.6667 12.6666Z"
          stroke={color}
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.96 12.6668L11.62 13.3268L13.04 12.0134"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 5.66659V10.9066C13.5133 10.3533 12.8 9.99992 12 9.99992C10.5267 9.99992 9.33333 11.1933 9.33333 12.6666C9.33333 13.1666 9.47333 13.6399 9.72 14.0399C9.86 14.2799 10.04 14.4933 10.2467 14.6666H5.33333C3 14.6666 2 13.3333 2 11.3333V5.66659C2 3.66659 3 2.33325 5.33333 2.33325H10.6667C13 2.33325 14 3.66659 14 5.66659Z"
          stroke={color}
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.99663 9.1333H8.0033M5.5293 9.1333H5.53596M5.5293 11.1333H5.53596"
          stroke={color}
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
