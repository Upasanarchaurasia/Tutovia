// Gemini Hinglish Voices Catalog
// Exclusive focus on Gemini Leda (Female Hinglish) and Gemini Charon (Male Hinglish)

export const GEMINI_SAMPLE_PROMPTS = [
  {
    title: '🇮🇳 Tax Section 44AD Presumptive Rule',
    text: 'Dekho CA aspirants! Taxation Section 44AD ke under, agar tumhara turnover 2 Crore tak hai, toh 8% net profit declare kar sakte ho, aur digital payment mode par sirf 6%!'
  },
  {
    title: '🇮🇳 AS-16 Borrowing Costs Concept',
    text: 'AS-16 ke according, qualifying asset ki construction ke liye jo borrowing costs lagti hain, wo asset ki cost me capitalize hoti hain jab tak asset ready na ho jaye.'
  },
  {
    title: '🇮🇳 Daily Study Motivation & Revision',
    text: 'Kya haal hai CA aspirant! Aaj shaam ko 2 ghante Direct Tax ki revision karenge with spaced repetition flashcards. Consistency hi sabse badi key hai!'
  },
  {
    title: '🇮🇳 Auditing Professional Skepticism',
    text: 'Auditor ko hamesha professionally skeptical rehna padega — har management representation ko audit evidence ke saath cross-check karna mandatory hai.'
  },
  {
    title: '🇮🇳 Companies Act Director Duties',
    text: 'Section 166 of Companies Act 2013 ke mutabiq, har director ko company ke best interest aur members ke benefit ke liye good faith me kaam karna hoga.'
  }
];

export const GEMINI_LEDA_CHARON_VOICES = [
  {
    id: 'Leda-Hinglish',
    name: 'Gemini Leda',
    titleName: 'Gemini Leda (Hinglish Female)',
    gender: 'FEMALE',
    tone: 'Crisp & Mindful Female',
    accent: 'Hinglish / Indian Accent',
    description: 'Professional Indian Hinglish female voice. Exceptional clarity for Accounting Standards, syllabus tracking, and study explanations.',
    recommendedFor: 'Accounting Standards, Zen Study Room & Mindful Coaching',
    samplePitch: 0.5,
    sampleRate: 0.98,
    isHinglish: true,
    nativeBrowserMatch: ['Google English (India)', 'en-IN', 'Heera', 'Kalpana', 'India']
  },
  {
    id: 'Charon-Hinglish',
    name: 'Gemini Charon',
    titleName: 'Gemini Charon (Hinglish Male)',
    gender: 'MALE',
    tone: 'Deep & Resonant Male',
    accent: 'Hinglish / Indian Accent',
    description: 'Deep, authoritative Indian Hinglish male voice. Ideal for Income Tax sections, Corporate Law provisions, and statutory auditing rules.',
    recommendedFor: 'Taxation Section Walkthroughs, Corporate Law & Auditing',
    samplePitch: -4.0,
    sampleRate: 0.90,
    isHinglish: true,
    nativeBrowserMatch: ['Google English (India)', 'en-IN', 'hi-IN', 'Ravi', 'Hemant', 'India']
  }
];
