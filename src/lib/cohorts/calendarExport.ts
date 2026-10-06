import { CohortEvent } from './cohortTime';

/**
 * Format a Date or ISO string into UTC format required by Google Calendar & iCalendar (YYYYMMDDTHHMMSSZ)
 */
export function formatUtcDateTime(isoString: string): string {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '';
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

/**
 * Generates a direct Google Calendar Add Event URL
 */
export function generateGoogleCalendarUrl(event: CohortEvent): string {
  const startDate = new Date(event.startTime);
  const endDate = new Date(startDate.getTime() + event.durationMinutes * 60 * 1000);

  const startUtc = formatUtcDateTime(startDate.toISOString());
  const endUtc = formatUtcDateTime(endDate.toISOString());

  const baseUrl = 'https://calendar.google.com/calendar/render';
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${startUtc}/${endUtc}`,
    details: `${event.description}\n\nالمحاضر: ${event.instructorName}\nالرابط: ${event.streamUrl || 'منصة تعلّم'}`,
    location: event.streamUrl || 'منصة تعلّم (بث مباشر)',
  });

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Generates standard RFC 5545 iCalendar (.ics) string
 */
export function generateIcsCalendarData(event: CohortEvent): string {
  const startDate = new Date(event.startTime);
  const endDate = new Date(startDate.getTime() + event.durationMinutes * 60 * 1000);
  const now = new Date();

  const startUtc = formatUtcDateTime(startDate.toISOString());
  const endUtc = formatUtcDateTime(endDate.toISOString());
  const stampUtc = formatUtcDateTime(now.toISOString());
  const uid = `ta3allam-event-${event.id}-${startUtc}@ta3allam.sy`;

  // Escape special chars in text
  const cleanSummary = event.title.replace(/\n/g, ' ').replace(/,/g, '\\,');
  const cleanDescription = `${event.description} - المحاضر: ${event.instructorName}`.replace(/\n/g, '\\n').replace(/,/g, '\\,');
  const cleanLocation = (event.streamUrl || 'منصة تعلّم (بث مباشر)').replace(/,/g, '\\,');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Ta3allam Platform//Cohort Live Events//AR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${stampUtc}`,
    `DTSTART:${startUtc}`,
    `DTEND:${endUtc}`,
    `SUMMARY:${cleanSummary}`,
    `DESCRIPTION:${cleanDescription}`,
    `LOCATION:${cleanLocation}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

/**
 * Initiates browser download of .ics calendar file
 */
export function downloadIcsFile(event: CohortEvent): void {
  const icsData = generateIcsCalendarData(event);
  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `ta3allam-event-${event.id}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
