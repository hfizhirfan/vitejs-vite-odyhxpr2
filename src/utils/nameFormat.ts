export function emailToTitleCase(email: string): string {
  if (!email || !email.includes('@')) {
    return email || 'Guest';
  }

  const prefix = email.split('@')[0];
  const cleaned = prefix.replace(/[._\-+]/g, ' ');

  return cleaned
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
