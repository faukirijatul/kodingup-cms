/**
 * Returns two letter initials of the name or the first two letters of the first name
 *
 * @param name Full name
 * @returns {string} Two letter initials of the name or the first two letters of the first name
 */
export const getInitials = (name: string): string => {
  const words = name.trim().split(' ');

  if (words.length >= 2) {
    return words[0][0] + words[1][0];
  }

  return words[0].slice(0, 2);
};
