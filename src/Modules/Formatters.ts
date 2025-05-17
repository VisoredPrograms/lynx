// Remove .ts or .js extension from a filename
export const removeExtension = (str: string) => str.replace(/\.(ts|js)$/, '');

// Convert string to title case
export const toTitleCase = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

// Format timestamp as relative time (e.g., "2 days ago")
export function timeSince(timestamp: number): string {
  const secs = Math.floor((Date.now() - timestamp) / 1000);
  if (secs < 5) return 'just now';

  const units = [
    { name: 'second', secs: 1 },
    { name: 'minute', secs: 60 },
    { name: 'hour', secs: 3600 },
    { name: 'day', secs: 86400 },
    { name: 'month', secs: 2592000 },
    { name: 'year', secs: 31536000 },
  ];

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  for (const unit of [...units].reverse()) {
    const value = Math.floor(secs / unit.secs);
    if (value >= 1) return rtf.format(-value, unit.name as Intl.RelativeTimeFormatUnit);
  }

  return 'just now';
}

// Format date as short string (e.g., "5/15/25, 2:30 PM")
export const formatShortDate = (date: Date) =>
  date.toLocaleString('en-US', {
    day: 'numeric',
    month: 'numeric',
    year: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

// Format date as long string (e.g., "Wed, May 15, 2025, 2:30 PM")
export const formatLongDate = (date: Date) =>
  date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
