// Gemini API Text-to-Speech (TTS) Free Tier Sample Voices & Hinglish Catalog
// Includes all 8 official prebuilt Gemini 2.0 Flash Voices + Dedicated Hinglish Suitable Voices & Phrases

export const GEMINI_FREE_TIER_INFO = {
  model: 'Gemini 2.0 Flash (Audio Modality)',
  dailyLimit: '1,500 Requests per Day (RPD) FREE',
  minuteLimit: '15 Requests per Minute (RPM) FREE',
  tokenLimit: '1,000,000 Tokens per Minute (TPM) FREE',
  cost: '$0.00 / Month on Gemini API Free Tier',
  badge: '1,500 Free Requests/Day'
};

export const GEMINI_SAMPLE_PROMPTS = [
  // HINGLISH PROMPTS
  {
    title: '🇮🇳 Hinglish: Tax Section 44AD Presumptive Rule',
    category: 'Hinglish',
    isHinglish: true,
    text: 'Dekho CA aspirants! Taxation Section 44AD ke under, agar tumhara turnover 2 Crore tak hai, toh 8% net profit declare kar sakte ho, aur digital payment mode par sirf 6%!'
  },
  {
    title: '🇮🇳 Hinglish: AS-16 Borrowing Costs Concept',
    category: 'Hinglish',
    isHinglish: true,
    text: 'AS-16 ke according, qualifying asset ki construction ke liye jo borrowing costs lagti hain, wo asset ki cost me capitalize hoti hain jab tak asset ready na ho jaye.'
  },
  {
    title: '🇮🇳 Hinglish: Daily Study Motivation & Flashcards',
    category: 'Hinglish',
    isHinglish: true,
    text: 'Kya haal hai CA aspirant! Aaj shaam ko 2 ghante Direct Tax ki revision karenge with spaced repetition flashcards. Consistency hi sabse badi key hai!'
  },
  {
    title: '🇮🇳 Hinglish: Auditing Professional Skepticism',
    category: 'Hinglish',
    isHinglish: true,
    text: 'Auditor ko hamesha professionally skeptical rehna padega — har management representation ko audit evidence ke saath cross-check karna mandatory hai.'
  },
  {
    title: '🇮🇳 Hinglish: Companies Act Director Duties',
    category: 'Hinglish',
    isHinglish: true,
    text: 'Section 166 of Companies Act 2013 ke mutabiq, har director ko company ke best interest aur members ke benefit ke liye good faith me kaam karna hoga.'
  },

  // ENGLISH PROMPTS
  {
    title: 'English: Tutovia Gemini AI Tutor Intro',
    category: 'English',
    isHinglish: false,
    text: 'Welcome to Tutovia, your mindful study companion powered by Gemini AI. Today we will master Accounting Standard 16, Borrowing Costs, step-by-step.'
  },
  {
    title: 'English: AS-16 Borrowing Costs Core Rule',
    category: 'English',
    isHinglish: false,
    text: 'Under Accounting Standard 16, borrowing costs that are directly attributable to the acquisition, construction, or production of a qualifying asset should be capitalized as part of the cost of that asset.'
  },
  {
    title: 'English: Auditing Ethics & Professional Skepticism',
    category: 'English',
    isHinglish: false,
    text: 'An auditor must maintain strict independence of mind and appearance. Professional skepticism requires a questioning mind and a critical assessment of audit evidence throughout the engagement.'
  }
];

export const GEMINI_SAMPLE_VOICES = [
  // ----------------------------------------------------
  // DEDICATED HINGLISH SUITABLE VOICES
  // ----------------------------------------------------
  {
    id: 'Hinglish-Puck',
    name: 'Gemini Puck (Hinglish Coach)',
    gender: 'MALE',
    tone: 'Upbeat Indian Hinglish Male',
    description: 'High-energy Indian Hinglish male tutor. Perfect for Indian CA students revising Direct Tax, Law, and Costing in natural Hinglish.',
    naturalness: 4.98,
    isHinglish: true,
    recommendedFor: 'Hinglish Revision, Direct Tax & Motivating Study Sessions',
    samplePitch: 2.0,
    sampleRate: 1.08,
    nativeBrowserMatch: ['Google English (India)', 'en-IN', 'Ravi', 'Hemant', 'India']
  },
  {
    id: 'Hinglish-Kore',
    name: 'Gemini Kore (Hinglish Companion)',
    gender: 'FEMALE',
    tone: 'Calm Indian Hinglish Female',
    description: 'Serene, soothing Indian female Hinglish study partner. Excellent for explaining complex Accounting Standards in easy Hinglish.',
    naturalness: 4.97,
    isHinglish: true,
    recommendedFor: 'AS Standards, Zen Study Room & Mindful Hinglish Mentoring',
    samplePitch: 0.0,
    sampleRate: 0.95,
    nativeBrowserMatch: ['Google English (India)', 'en-IN', 'Heera', 'Kalpana', 'India']
  },
  {
    id: 'Hinglish-Charon',
    name: 'Gemini Charon (Hindi & Hinglish Legal)',
    gender: 'MALE',
    tone: 'Deep Hindi & Hinglish Legal Reader',
    description: 'Resonant, deep Hindi and Hinglish voice. Designed for formal statutory reading, Companies Act clauses, and ICAI notifications.',
    naturalness: 4.96,
    isHinglish: true,
    recommendedFor: 'Companies Act, Auditing Standards & Hindi/Hinglish Notifications',
    samplePitch: -4.0,
    sampleRate: 0.90,
    nativeBrowserMatch: ['Google हिन्दी', 'hi-IN', 'Hindi', 'Ravi']
  },
  {
    id: 'Hinglish-Aoede',
    name: 'Gemini Aoede (Hinglish AI Tutor)',
    gender: 'FEMALE',
    tone: 'Conversational Indian Hinglish',
    description: 'Friendly, interactive Hinglish female AI voice that feels like a personal CA study mentor during 24/7 doubt clearing.',
    naturalness: 4.99,
    isHinglish: true,
    recommendedFor: 'Hinglish AI Tutor Chat, Doubt Resolution & Concept Q&A',
    samplePitch: 1.5,
    sampleRate: 1.00,
    nativeBrowserMatch: ['Google English (India)', 'en-IN', 'Heera', 'India']
  },

  // ----------------------------------------------------
  // OFFICIAL PREBUILT GEMINI VOICES
  // ----------------------------------------------------
  {
    id: 'Puck',
    name: 'Gemini Puck',
    gender: 'MALE',
    tone: 'Energetic & Engaging',
    description: 'High-energy, upbeat male voice. Perfect for rapid revision, flashcards, and motivational study sessions.',
    naturalness: 4.95,
    isHinglish: false,
    recommendedFor: 'Pomodoro Timer, Quick Concept Recaps & Flashcards',
    samplePitch: 3.0,
    sampleRate: 1.10,
    nativeBrowserMatch: ['Google US English', 'en-US', 'Male', 'David']
  },
  {
    id: 'Charon',
    name: 'Gemini Charon',
    gender: 'MALE',
    tone: 'Deep & Authoritative',
    description: 'Resonant, deep male voice with formal academic gravity. Excellent for reading statutory tax sections and company law provisions.',
    naturalness: 4.98,
    isHinglish: false,
    recommendedFor: 'Corporate Law, Auditing Standards & Case Studies',
    samplePitch: -5.0,
    sampleRate: 0.88,
    nativeBrowserMatch: ['Google UK English Male', 'en-GB', 'George', 'Daniel']
  },
  {
    id: 'Kore',
    name: 'Gemini Kore',
    gender: 'FEMALE',
    tone: 'Calm & Mindful',
    description: 'Serene, soothing female voice with smooth pacing. Ideal for late-night study sessions, wellness exercises, and complex accounting standards.',
    naturalness: 4.96,
    isHinglish: false,
    recommendedFor: 'Accounting Standards, Zen Study Room & Mindful Coaching',
    samplePitch: -1.0,
    sampleRate: 0.92,
    nativeBrowserMatch: ['Google UK English Female', 'en-GB', 'Victoria', 'Zira']
  },
  {
    id: 'Fenrir',
    name: 'Gemini Fenrir',
    gender: 'MALE',
    tone: 'Confident & Articulate',
    description: 'Crisp, articulate male voice with sharp diction. Highly recommended for tax formulas, GST provisions, and numerical problem walkthroughs.',
    naturalness: 4.94,
    isHinglish: false,
    recommendedFor: 'Taxation, Cost Management & Numerical Problems',
    samplePitch: -1.5,
    sampleRate: 1.05,
    nativeBrowserMatch: ['Google US English', 'en-US', 'Alex']
  },
  {
    id: 'Aoede',
    name: 'Gemini Aoede',
    gender: 'FEMALE',
    tone: 'Warm & Conversational',
    description: 'Friendly, interactive female voice that feels like a personal study mentor. Excellent for 24/7 AI tutor conversational chat.',
    naturalness: 4.99,
    isHinglish: false,
    recommendedFor: 'AI Tutor Chat, Q&A Explanations & Doubt Clearing',
    samplePitch: 2.5,
    sampleRate: 1.00,
    nativeBrowserMatch: ['Google US English', 'en-US', 'Samantha']
  },
  {
    id: 'Leda',
    name: 'Gemini Leda',
    gender: 'FEMALE',
    tone: 'Professional & Clear',
    description: 'Clear, authoritative female presenter voice. Great for exam strategy announcements, syllabus tracking, and official ICAI notifications.',
    naturalness: 4.93,
    isHinglish: false,
    recommendedFor: 'Exam Strategy, ICAI Alerts & Syllabus Overview',
    samplePitch: 0.5,
    sampleRate: 0.98,
    nativeBrowserMatch: ['Google UK English Female', 'en-GB', 'Caren']
  },
  {
    id: 'Orpheus',
    name: 'Gemini Orpheus',
    gender: 'MALE',
    tone: 'Expressive & Storyteller',
    description: 'Dynamic, storytelling male voice with natural vocal inflections. Perfect for long legal case studies and practical auditing scenarios.',
    naturalness: 4.97,
    isHinglish: false,
    recommendedFor: 'Audit Case Studies, Ethics & Legal Scenarios',
    samplePitch: -3.0,
    sampleRate: 0.95,
    nativeBrowserMatch: ['Google US English', 'en-US', 'Male']
  },
  {
    id: 'Callisto',
    name: 'Gemini Callisto',
    gender: 'FEMALE',
    tone: 'Bright & Academic',
    description: 'Intellectual female academic voice with crystal-clear pronunciation for financial management formulas and ratios.',
    naturalness: 4.95,
    isHinglish: false,
    recommendedFor: 'Financial Management, Strategic Management & Ratios',
    samplePitch: 4.0,
    sampleRate: 1.02,
    nativeBrowserMatch: ['Google US English', 'en-US', 'Kylee']
  }
];
