import type { MenuIconProps } from '@/types/icon';

export function MenuAssignmentsIcon({ color = '#FAFAFA' }: MenuIconProps) {
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
          d="M8.83994 2.40006L3.36661 8.1934C3.15994 8.4134 2.95994 8.84673 2.91994 9.14673L2.67328 11.3067C2.58661 12.0867 3.14661 12.6201 3.91994 12.4867L6.06661 12.1201C6.36661 12.0667 6.78661 11.8467 6.99327 11.6201L12.4666 5.82673C13.4133 4.82673 13.8399 3.68673 12.3666 2.2934C10.8999 0.913397 9.78661 1.40006 8.83994 2.40006Z"
          stroke={color}
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.92667 3.3667C8.06643 4.2606 8.49907 5.08279 9.15668 5.7042C9.81428 6.32561 10.6596 6.71105 11.56 6.80003M2 14.6667H14"
          stroke={color}
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
