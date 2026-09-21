// Utility to export Tutovia Timetable to .ics and Google Calendar

export function exportTimetableToICS(schedule, studentName = 'Tutovia Student') {
  if (!schedule || schedule.length === 0) {
    alert('No timetable sessions to export. Generate a timetable first!');
    return;
  }

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;

  const parseTimeTo24h = (timeStr) => {
    if (!timeStr) return '090000';
    // Format: "09:00 AM" or "09:00 AM - 10:30 AM" or "09:00"
    const firstPart = timeStr.split('-')[0].trim();
    const match = firstPart.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (!match) return '090000';
    let h = parseInt(match[1], 10);
    const m = match[2];
    const ampm = match[3]?.toUpperCase();
    if (ampm === 'PM' && h < 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    return `${String(h).padStart(2, '0')}${m}00`;
  };

  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Tutovia//CA Study Timetable//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ];

  schedule.forEach((item, index) => {
    const startTime = parseTimeTo24h(item.timeRange || item.time12 || item.time);
    // End time 90 mins later
    let endH = (parseInt(startTime.substring(0, 2), 10) + 1) % 24;
    let endM = (parseInt(startTime.substring(2, 4), 10) + 30);
    if (endM >= 60) {
      endH = (endH + 1) % 24;
      endM -= 60;
    }
    const endTime = `${String(endH).padStart(2, '0')}${String(endM).padStart(2, '0')}00`;

    icsContent.push(
      'BEGIN:VEVENT',
      `UID:tutovia-${Date.now()}-${index}@tutovia.app`,
      `DTSTAMP:${dateStr}T${startTime}Z`,
      `DTSTART:${dateStr}T${startTime}`,
      `DTEND:${dateStr}T${endTime}`,
      `SUMMARY:📚 Tutovia: ${item.activity || item.title || 'Study Session'}`,
      `DESCRIPTION:Focus: ${item.focus || 'CA Revision'}\\nType: ${item.type || 'study'}\\nStatus: ${item.status || 'Scheduled'}`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT10M',
      'ACTION:DISPLAY',
      'DESCRIPTION:Reminder: Tutovia Study Session starts in 10 minutes!',
      'END:VALARM',
      'END:VEVENT'
    );
  });

  icsContent.push('END:VCALENDAR');

  const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `tutovia-timetable-${year}-${month}-${day}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export function openGoogleCalendarIntent(firstSession) {
  if (!firstSession) return;
  const title = encodeURIComponent(`📚 Tutovia: ${firstSession.activity || firstSession.title || 'CA Study Session'}`);
  const details = encodeURIComponent(`Focus: ${firstSession.focus || 'CA Intermediate'}\nGenerated via Tutovia AI Timetable.`);
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}`;
  window.open(url, '_blank');
}
