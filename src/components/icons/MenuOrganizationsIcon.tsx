import type { MenuIconProps } from '@/types/icon';

export function MenuOrganizationsIcon({ color = '#FAFAFA' }: MenuIconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity="0.6" clipPath="url(#clip0_3593_11126)">
        <path
          d="M7.98002 14.6666C11.662 14.6666 14.6467 11.6819 14.6467 7.99992C14.6467 4.31792 11.662 1.33325 7.98002 1.33325C4.29802 1.33325 1.31335 4.31792 1.31335 7.99992C1.31335 11.6819 4.29802 14.6666 7.98002 14.6666Z"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.00005 10.8199C8.74796 10.8199 9.46524 10.5228 9.99409 9.99397C10.5229 9.46512 10.8201 8.74784 10.8201 7.99993C10.8201 7.25202 10.5229 6.53474 9.99409 6.00589C9.46524 5.47704 8.74796 5.17993 8.00005 5.17993C7.25214 5.17993 6.53487 5.47704 6.00601 6.00589C5.47716 6.53474 5.18005 7.25202 5.18005 7.99993C5.18005 8.74784 5.47716 9.46512 6.00601 9.99397C6.53487 10.5228 7.25214 10.8199 8.00005 10.8199Z"
          stroke={color}
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_3593_11126">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
