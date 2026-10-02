// Gemini API Text-to-Speech (TTS) Free Tier Sample Voices Catalog
// Covers all 8 official prebuilt Gemini 2.0 Flash Voices

export const GEMINI_FREE_TIER_INFO = {
  model: 'Gemini 2.0 Flash (Audio Modality)',
  dailyLimit: '1,500 Requests per Day (RPD) FREE',
  minuteLimit: '15 Requests per Minute (RPM) FREE',
  tokenLimit: '1,000,000 Tokens per Minute (TPM) FREE',
  cost: '$0.00 / Month on Gemini API Free Tier',
  badge: '1,500 Free Requests/Day'
};

export const GEMINI_SAMPLE_PROMPTS = [
  {
    title: 'Tutovia Gemini AI Tutor Intro',
    category: 'Welcome',
    text: 'Welcome to Tutovia, your mindful study companion powered by Gemini AI. Today we will master Accounting Standard 16, Borrowing Costs, step-by-step.'
  },
  {
    title: 'AS-16 Borrowing Costs Core Rule',
    category: 'Accounting',
    text: 'Under Accounting Standard 16, borrowing costs that are directly attributable to the acquisition, construction, or production of a qualifying asset should be capitalized as part of the cost of that asset.'
  },
  {
    title: 'Income Tax Section 44AD Presumptive Scheme',
    category: 'Taxation',
    text: 'Section 44AD allows eligible small businesses with turnover up to 2 Crore rupees to declare net profit at 8% of total turnover, or 6% in respect of amount received by digital payment modes.'
  },
  {
    title: 'Auditing Ethics & Professional Skepticism',
    category: 'Auditing',
    text: 'An auditor must maintain strict independence of mind and appearance. Professional skepticism requires a questioning mind and a critical assessment of audit evidence throughout the engagement.'
  },
  {
    title: 'Corporate Law Director Duties',
    category: 'Law',
    text: 'Under Section 166 of the Companies Act 2013, a director of a company shall act in good faith in order to promote the objects of the company for the benefit of its members as a whole.'
  }
];

export const GEMINI_SAMPLE_VOICES = [
  {
    id: 'Puck',
    name: 'Gemini Puck',
    gender: 'MALE',
    tone: 'Energetic & Engaging',
    description: 'High-energy, upbeat male voice. Perfect for rapid revision, flashcards, and motivational study sessions.',
    naturalness: 4.95,
    recommendedFor: 'Pomodoro Timer, Quick Concept Recaps & Flashcards',
    samplePitch: 1.0,
    sampleRate: 1.05,
    nativeBrowserMatch: ['Google US English', 'en-US', 'Male']
  },
  {
    id: 'Charon',
    name: 'Gemini Charon',
    gender: 'MALE',
    tone: 'Deep & Authoritative',
    description: 'Resonant, deep male voice with formal academic gravity. Excellent for reading statutory tax sections and company law provisions.',
    naturalness: 4.98,
    recommendedFor: 'Corporate Law, Auditing Standards & Case Studies',
    samplePitch: -2.0,
    sampleRate: 0.95,
    nativeBrowserMatch: ['Google UK English Male', 'en-US', 'Male']
  },
  {
    id: 'Kore',
    name: 'Gemini Kore',
    gender: 'FEMALE',
    tone: 'Calm & Mindful',
    description: 'Serene, soothing female voice with smooth pacing. Ideal for late-night study sessions, wellness exercises, and complex accounting standards.',
    naturalness: 4.96,
    recommendedFor: 'Accounting Standards, Zen Study Room & Mindful Coaching',
    samplePitch: 0.0,
    sampleRate: 0.95,
    nativeBrowserMatch: ['Google UK English Female', 'en-US', 'Female']
  },
  {
    id: 'Fenrir',
    name: 'Gemini Fenrir',
    gender: 'MALE',
    tone: 'Confident & Articulate',
    description: 'Crisp, articulate male voice with sharp diction. Highly recommended for tax formulas, GST provisions, and numerical problem walkthroughs.',
    naturalness: 4.94,
    recommendedFor: 'Taxation, Cost Management & Numerical Problems',
    samplePitch: -0.5,
    sampleRate: 1.0,
    nativeBrowserMatch: ['Google US English', 'en-US', 'Male']
  },
  {
    id: 'Aoede',
    name: 'Gemini Aoede',
    gender: 'FEMALE',
    tone: 'Warm & Conversational',
    description: 'Friendly, interactive female voice that feels like a personal study mentor. Excellent for 24/7 AI tutor conversational chat.',
    naturalness: 4.99,
    recommendedFor: 'AI Tutor Chat, Q&A Explanations & Doubt Clearing',
    samplePitch: 0.5,
    sampleRate: 1.0,
    nativeBrowserMatch: ['Google US English', 'en-US', 'Female']
  },
  {
    id: 'Leda',
    name: 'Gemini Leda',
    gender: 'FEMALE',
    tone: 'Professional & Clear',
    description: 'Clear, authoritative female presenter voice. Great for exam strategy announcements, syllabus tracking, and official ICAI notifications.',
    naturalness: 4.93,
    recommendedFor: 'Exam Strategy, ICAI Alerts & Syllabus Overview',
    samplePitch: 0.0,
    sampleRate: 1.0,
    nativeBrowserMatch: ['Google UK English Female', 'en-GB', 'Female']
  },
  {
    id: 'Orpheus',
    name: 'Gemini Orpheus',
    gender: 'MALE',
    tone: 'Expressive & Storyteller',
    description: 'Dynamic, storytelling male voice with natural vocal inflections. Perfect for long legal case studies and practical auditing scenarios.',
    naturalness: 4.97,
    recommendedFor: 'Audit Case Studies, Ethics & Legal Scenarios',
    samplePitch: -1.0,
    sampleRate: 1.0,
    nativeBrowserMatch: ['Google US English', 'en-US', 'Male']
  },
  {
    id: 'Callisto',
    name: 'Gemini Callisto',
    gender: 'FEMALE',
    tone: 'Bright & Academic',
    description: 'Intellectual female academic voice with crystal-clear pronunciation for financial management formulas and ratios.',
    naturalness: 4.95,
    recommendedFor: 'Financial Management, Strategic Management & Ratios',
    samplePitch: 0.5,
    sampleRate: 1.02,
    nativeBrowserMatch: ['Google US English', 'en-US', 'Female']
  }
];
