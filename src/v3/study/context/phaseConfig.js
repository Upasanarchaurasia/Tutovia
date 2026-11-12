export const TIME_THEME_CONFIG = {
  morning: {
    id: 'morning',
    name: 'Morning',
    label: 'Fresh Start',
    timeLabel: '05:00 AM – 10:59 AM',
    startHour: 5,
    startMinute: 0,
    endHour: 10,
    endMinute: 59,
    startMinutes: 5 * 60, // 300
    endMinutes: 10 * 60 + 59, // 659
    icon: '🌅',
    greeting: 'Good morning 🌅',
    tagline: 'Fresh sunrise & mindful momentum.',
    subtext: "Let's build today's CA study milestones with fresh energy and clear direction.",
    encouragement: 'Start with one high-impact chapter while your mind is completely fresh.',
    quote: 'Every sunrise is an invitation to begin again with clarity.',
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-300/40',
    accent: '#E06D38',
    accentSoft: '#FDE6D2',
    textColor: '#2B2338',
    description: 'Fresh, warm, positive & motivating daylight tones.'
  },
  day: {
    id: 'day',
    name: 'Day',
    label: 'Focus Mode',
    timeLabel: '11:00 AM – 04:59 PM',
    startHour: 11,
    startMinute: 0,
    endHour: 16,
    endMinute: 59,
    startMinutes: 11 * 60, // 660
    endMinutes: 16 * 60 + 59, // 1019
    icon: '☀️',
    greeting: 'Good afternoon ☀️',
    tagline: 'Deep focus & productive flow.',
    subtext: 'Time to master your core chapters, practice questions, and lock in concepts.',
    encouragement: 'Protect your focus slot. 25 minutes of deep work beats hours of multitasking.',
    quote: 'One focused hour is worth four distracted ones. Keep your momentum.',
    badgeBg: 'bg-sky-100 text-sky-900 border-sky-300/40',
    accent: '#4F46E5',
    accentSoft: '#EEF2FF',
    textColor: '#0F172A',
    description: 'Crisp, bright, high-readability productivity environment.'
  },
  evening: {
    id: 'evening',
    name: 'Evening',
    label: 'Reflect & Recharge',
    timeLabel: '05:00 PM – 07:59 PM',
    startHour: 17,
    startMinute: 0,
    endHour: 19,
    endMinute: 59,
    startMinutes: 17 * 60, // 1020
    endMinutes: 19 * 60 + 59, // 1199
    icon: '🌇',
    greeting: 'Good evening 🌇',
    tagline: "You've come a long way today.",
    subtext: "You don't have to finish everything today. Let's consolidate what matters most.",
    encouragement: 'Celebrate the revision blocks you completed. Consistency compounds quietly.',
    quote: 'Progress is quiet. Honor the steps you took today.',
    badgeBg: 'bg-rose-100 text-rose-900 border-rose-300/40',
    accent: '#D96041',
    accentSoft: '#FCE8E2',
    textColor: '#2C2237',
    description: 'Sunset-inspired, warm, relaxing & reflective tones.'
  },
  night: {
    id: 'night',
    name: 'Night',
    label: 'Wind Down',
    timeLabel: '08:00 PM – 04:59 AM',
    startHour: 20,
    startMinute: 0,
    endHour: 4,
    endMinute: 59,
    startMinutes: 20 * 60, // 1200
    endMinutes: 4 * 60 + 59, // 299 (next day morning cutoff)
    icon: '🌙',
    greeting: 'Good night 🌙',
    tagline: 'Calm evening & restorative study.',
    subtext: 'Rest is part of the syllabus — sleep consolidates memory for exam success ✨',
    encouragement: 'Close high-stress tabs. Deep review or restful sleep will consolidate memory.',
    quote: 'Rest restores memory. A fresh mind is your greatest exam asset.',
    badgeBg: 'bg-purple-950/60 text-purple-200 border-purple-400/20',
    accent: '#818CF8',
    accentSoft: 'rgba(129, 140, 248, 0.18)',
    textColor: '#F1F5F9',
    description: 'Eye-friendly, anti-glare, deep soft dark surfaces.'
  }
};