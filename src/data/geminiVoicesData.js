// Comprehensive Hinglish & Indian TTS Voice Catalog across 4 Engines:
// 1. Gemini Hinglish Voices (Browser Tuned Speech Synthesis)
// 2. Microsoft Edge Neural Voices (Ultra-Realistic Free Neural Voices)
// 3. Google Cloud Neural2 Voices (Official GCP Free Tier API)
// 4. Google Translate Stream (Instant Free Audio Stream)

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

export const TTS_TABS = [
  { 
    id: 'gemini', 
    label: 'Gemini Voices', 
    subLabel: 'Browser Tuned (Leda & Charon)',
    icon: 'Sparkles', 
    badge: 'Gemini Leda & Charon',
    color: 'from-purple-600 to-indigo-600'
  },
  { 
    id: 'msedge', 
    label: 'Microsoft Edge Neural', 
    subLabel: 'Ultra-Realistic Free Hinglish',
    icon: 'Zap', 
    badge: '100% Free HD',
    color: 'from-blue-600 to-cyan-600'
  },
  { 
    id: 'gcp', 
    label: 'Google Cloud Neural2', 
    subLabel: 'Official GCP Free Tier API',
    icon: 'Cloud', 
    badge: '1M Chars/mo Free',
    color: 'from-emerald-600 to-teal-600'
  },
  { 
    id: 'gtts', 
    label: 'Google Translate Stream', 
    subLabel: 'Instant Free Audio Stream',
    icon: 'Volume2', 
    badge: 'Zero Setup',
    color: 'from-amber-600 to-orange-600'
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
    description: 'Professional Indian Hinglish female voice tuned with pitch & formant processing for clear study recaps.',
    recommendedFor: 'Accounting Standards & Mindful Coaching',
    samplePitch: 0.5,
    sampleRate: 0.98,
    isHinglish: true,
    engine: 'gemini'
  },
  {
    id: 'Charon-Hinglish',
    name: 'Gemini Charon',
    titleName: 'Gemini Charon (Hinglish Male)',
    gender: 'MALE',
    tone: 'Deep & Resonant Male',
    accent: 'Hinglish / Indian Accent',
    description: 'Deep, authoritative Indian Hinglish male voice with bass pitch modulation for law and tax rules.',
    recommendedFor: 'Taxation & Corporate Law Sections',
    samplePitch: -4.0,
    sampleRate: 0.90,
    isHinglish: true,
    engine: 'gemini'
  }
];

export const EDGE_NEURAL_VOICES = [
  {
    id: 'en-IN-NeerjaNeural',
    name: 'Edge Neerja Neural',
    titleName: 'Neerja (Natural Indian Female)',
    gender: 'FEMALE',
    tone: 'Ultra-Realistic Natural Female',
    accent: 'Hinglish / Indian English',
    description: 'Microsoft Edge\'s flagship natural Indian female neural voice. Exceptionally human-like with zero robotic tone.',
    recommendedFor: 'Full Chapter Recaps & Audiobooks',
    voiceCode: 'en-IN-NeerjaNeural',
    engine: 'msedge'
  },
  {
    id: 'en-IN-PrabhatNeural',
    name: 'Edge Prabhat Neural',
    titleName: 'Prabhat (Natural Indian Male)',
    gender: 'MALE',
    tone: 'Natural Warm Male Baritone',
    accent: 'Hinglish / Indian English',
    description: 'Warm, highly articulate natural Indian male neural voice with natural speech rhythm.',
    recommendedFor: 'Lecture Summaries & Concept Explanations',
    voiceCode: 'en-IN-PrabhatNeural',
    engine: 'msedge'
  },
  {
    id: 'hi-IN-SwaraNeural',
    name: 'Edge Swara Neural',
    titleName: 'Swara (Hindi Neural Female)',
    gender: 'FEMALE',
    tone: 'Fluent Hindi / Hinglish Female',
    accent: 'Hindi & Hinglish Accent',
    description: 'Native Hindi neural voice with perfect pronunciation of Hindi terms mixed with English numbers.',
    recommendedFor: 'Hindi-Heavy Study Material',
    voiceCode: 'hi-IN-SwaraNeural',
    engine: 'msedge'
  },
  {
    id: 'hi-IN-MadhurNeural',
    name: 'Edge Madhur Neural',
    titleName: 'Madhur (Hindi Neural Male)',
    gender: 'MALE',
    tone: 'Resonant Hindi Male',
    accent: 'Hindi & Hinglish Accent',
    description: 'Clear, studio-quality Hindi male voice for study lectures and statutory act recitals.',
    recommendedFor: 'Law & Taxation Hindi Audio',
    voiceCode: 'hi-IN-MadhurNeural',
    engine: 'msedge'
  }
];

export const GCP_NEURAL_VOICES = [
  {
    id: 'en-IN-Neural2-A',
    name: 'Google Neural2-A',
    titleName: 'GCP Neural2-A (Indian Female)',
    gender: 'FEMALE',
    tone: 'Google Neural Studio Female',
    accent: 'Indian English / Hinglish',
    description: 'Google Cloud\'s premium Neural2 female voice (1 Million characters/month FREE on GCP).',
    recommendedFor: 'High-Fidelity Audio Generation',
    voiceCode: 'en-IN-Neural2-A',
    engine: 'gcp'
  },
  {
    id: 'en-IN-Neural2-B',
    name: 'Google Neural2-B',
    titleName: 'GCP Neural2-B (Indian Male)',
    gender: 'MALE',
    tone: 'Google Neural Studio Male',
    accent: 'Indian English / Hinglish',
    description: 'Google Cloud\'s flagship Neural2 male voice for Indian English and Hinglish content.',
    recommendedFor: 'Formal CA Auditing Lectures',
    voiceCode: 'en-IN-Neural2-B',
    engine: 'gcp'
  },
  {
    id: 'hi-IN-Neural2-A',
    name: 'Google Hindi Neural2-A',
    titleName: 'GCP Hindi Neural2-A (Female)',
    gender: 'FEMALE',
    tone: 'Google Hindi Neural Studio',
    accent: 'Hindi / Hinglish',
    description: 'Deep-learning trained Hindi female voice from Google Cloud AI.',
    recommendedFor: 'Hindi Direct Tax Lectures',
    voiceCode: 'hi-IN-Neural2-A',
    engine: 'gcp'
  },
  {
    id: 'hi-IN-Neural2-B',
    name: 'Google Hindi Neural2-B',
    titleName: 'GCP Hindi Neural2-B (Male)',
    gender: 'MALE',
    tone: 'Google Hindi Neural Deep Male',
    accent: 'Hindi / Hinglish',
    description: 'Google Cloud AI Hindi male voice with high clarity for legal text.',
    recommendedFor: 'Companies Act Section Recitals',
    voiceCode: 'hi-IN-Neural2-B',
    engine: 'gcp'
  }
];

export const GTTS_VOICES = [
  {
    id: 'gtts-en-IN',
    name: 'Google Translate Indian English',
    titleName: 'Google Translate (Indian English)',
    gender: 'FEMALE',
    tone: 'Instant Stream Indian Accent',
    accent: 'Hinglish / Indian Accent',
    description: 'Direct audio stream from Google Translate TTS service (100% Free, zero setup required).',
    recommendedFor: 'Quick Hinglish Previews',
    lang: 'en-IN',
    engine: 'gtts'
  },
  {
    id: 'gtts-hi',
    name: 'Google Translate Hindi',
    titleName: 'Google Translate (Hindi)',
    gender: 'FEMALE',
    tone: 'Instant Stream Hindi Voice',
    accent: 'Hindi Accent',
    description: 'Native Hindi audio stream directly from Google Translate engine.',
    recommendedFor: 'Pure Hindi Terminology',
    lang: 'hi',
    engine: 'gtts'
  }
];
