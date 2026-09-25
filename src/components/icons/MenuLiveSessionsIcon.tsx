import type { MenuIconProps } from '@/types/icon';

export function MenuLiveSessionsIcon({ color = '#FAFAFA' }: MenuIconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity="0.6" clipPath="url(#clip0_3593_11100)">
        <path
          d="M14.6667 7.92659V8.51992C14.6667 10.8933 14.0734 11.4799 11.7067 11.4799H4.29337C1.92671 11.4799 1.33337 10.8866 1.33337 8.51992V4.29325C1.33337 1.92659 1.92671 1.33325 4.29337 1.33325H5.33337M8.00004 11.4799V14.6666M1.33337 8.66659H14.6667M5.00004 14.6666H11"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.9067 6.24675H8.73338C7.81338 6.24675 7.50671 5.63342 7.50671 5.02009V2.67342C7.50671 1.94009 8.10671 1.34009 8.84005 1.34009H11.9067C12.5867 1.34009 13.1334 1.88675 13.1334 2.56675V5.02009C13.1334 5.70009 12.5867 6.24675 11.9067 6.24675ZM13.94 5.28009L13.1334 4.71342V2.87342L13.94 2.30675C14.34 2.03342 14.6667 2.20009 14.6667 2.68675V4.90675C14.6667 5.39342 14.34 5.56009 13.94 5.28009Z"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_3593_11100">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
