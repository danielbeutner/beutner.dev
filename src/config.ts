export const SITE = {
  title: 'beutner.dev',
  description: 'Personal page of Daniel Beutner',
  url: 'https://beutner.dev',
  lang: 'en',
  locale: 'en_us',
} as const;

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Europe/Berlin',
  }).format(date);
}

export function isoDate(date: Date): string {
  return date.toISOString().replace(/\.\d{3}Z$/, 'Z');
}
