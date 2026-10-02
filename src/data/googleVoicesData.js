// Google Cloud Text-to-Speech Free Tier Sample Voices Catalog
// Covers Standard (4M chars/mo free), WaveNet (1M chars/mo free), Neural2 (1M chars/mo free), Journey, News & Studio voices

export const GOOGLE_VOICE_TIERS = {
  ALL: { id: 'ALL', name: 'All Tiers', limit: 'Free Tier Available' },
  STANDARD: { id: 'STANDARD', name: 'Standard Tier', limit: '4,000,000 chars / month FREE', cost: '$4.00 per 1M chars after free tier', badge: '4M Free/mo', color: 'indigo' },
  WAVENET: { id: 'WAVENET', name: 'WaveNet Neural Tier', limit: '1,000,000 chars / month FREE', cost: '$16.00 per 1M chars after free tier', badge: '1M Free/mo', color: 'emerald' },
  NEURAL2: { id: 'NEURAL2', name: 'Neural2 Advanced', limit: '1,000,000 chars / month FREE', cost: '$16.00 per 1M chars after free tier', badge: '1M Free/mo', color: 'purple' },
  JOURNEY: { id: 'JOURNEY', name: 'Journey & News', limit: '1,000,000 chars / month FREE', cost: '$16.00 per 1M chars after free tier', badge: '1M Free/mo', color: 'amber' },
  STUDIO: { id: 'STUDIO', name: 'Studio Ultra HD', limit: '1,000,000 chars / month FREE', cost: '$160.00 per 1M chars (Preview tier free)', badge: 'Ultra HD', color: 'rose' }
};

export const SAMPLE_PROMPTS = [
  {
    title: 'Tutovia AI Tutor Introduction',
    category: 'Welcome',
    text: 'Welcome to Tutovia, your mindful study companion and AI tutor. Today we will master Accounting Standard 16, Borrowing Costs, step-by-step with high retention.'
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
    title: 'Auditing Ethics & Integrity Principle',
    category: 'Auditing',
    text: 'An auditor must maintain strict independence of mind and appearance. Professional skepticism requires a questioning mind and a critical assessment of audit evidence throughout the engagement.'
  },
  {
    title: 'Corporate Law Director Duties',
    category: 'Law',
    text: 'Under Section 166 of the Companies Act 2013, a director of a company shall act in good faith in order to promote the objects of the company for the benefit of its members as a whole.'
  }
];

export const GOOGLE_SAMPLE_VOICES = [
  // ----------------------------------------------------
  // STANDARD VOICES (4 Million characters/month free)
  // ----------------------------------------------------
  {
    id: 'en-US-Standard-A',
    name: 'Google US English Standard A',
    languageCode: 'en-US',
    languageName: 'English (US)',
    ssmlGender: 'MALE',
    tier: 'STANDARD',
    freeLimit: '4,000,000 chars/mo free',
    naturalness: 3.8,
    description: 'Clear, crisp American male voice. Excellent for fast concept review.',
    samplePitch: 0.0,
    sampleRate: 1.0,
    nativeBrowserMatch: ['Google US English', 'en-US', 'English (United States)']
  },
  {
    id: 'en-US-Standard-B',
    name: 'Google US English Standard B',
    languageCode: 'en-US',
    languageName: 'English (US)',
    ssmlGender: 'MALE',
    tier: 'STANDARD',
    freeLimit: '4,000,000 chars/mo free',
    naturalness: 3.9,
    description: 'Deeper male tone, suitable for formal lecture summaries and legal provisions.',
    samplePitch: -2.0,
    sampleRate: 0.95,
    nativeBrowserMatch: ['Google US English', 'en-US']
  },
  {
    id: 'en-US-Standard-C',
    name: 'Google US English Standard C',
    languageCode: 'en-US',
    languageName: 'English (US)',
    ssmlGender: 'FEMALE',
    tier: 'STANDARD',
    freeLimit: '4,000,000 chars/mo free',
    naturalness: 4.0,
    description: 'Bright female voice with balanced pacing. High articulation for tax rules.',
    samplePitch: 1.0,
    sampleRate: 1.0,
    nativeBrowserMatch: ['Google US English', 'en-US']
  },
  {
    id: 'en-US-Standard-D',
    name: 'Google US English Standard D',
    languageCode: 'en-US',
    languageName: 'English (US)',
    ssmlGender: 'MALE',
    tier: 'STANDARD',
    freeLimit: '4,000,000 chars/mo free',
    naturalness: 4.1,
    description: 'Resonant male academic voice with clean diction.',
    samplePitch: -1.0,
    sampleRate: 1.0,
    nativeBrowserMatch: ['Google US English', 'en-US']
  },
  {
    id: 'en-US-Standard-E',
    name: 'Google US English Standard E',
    languageCode: 'en-US',
    languageName: 'English (US)',
    ssmlGender: 'FEMALE',
    tier: 'STANDARD',
    freeLimit: '4,000,000 chars/mo free',
    naturalness: 4.2,
    description: 'Warm female tone ideal for continuous study listening sessions.',
    samplePitch: 0.5,
    sampleRate: 1.0,
    nativeBrowserMatch: ['Google US English', 'en-US']
  },
  {
    id: 'en-US-Standard-F',
    name: 'Google US English Standard F',
    languageCode: 'en-US',
    languageName: 'English (US)',
    ssmlGender: 'FEMALE',
    tier: 'STANDARD',
    freeLimit: '4,000,000 chars/mo free',
    naturalness: 4.0,
    description: 'Professional female announcer voice with moderate cadence.',
    samplePitch: 0.0,
    sampleRate: 1.0,
    nativeBrowserMatch: ['Google US English', 'en-US']
  },
  {
    id: 'en-IN-Standard-A',
    name: 'Google Indian English Standard A',
    languageCode: 'en-IN',
    languageName: 'English (India)',
    ssmlGender: 'FEMALE',
    tier: 'STANDARD',
    freeLimit: '4,000,000 chars/mo free',
    naturalness: 4.3,
    description: 'Clear Indian female voice, perfectly familiar for Indian CA aspirants.',
    samplePitch: 0.0,
    sampleRate: 1.0,
    nativeBrowserMatch: ['Google UK English Female', 'en-IN', 'English India']
  },
  {
    id: 'en-IN-Standard-B',
    name: 'Google Indian English Standard B',
    languageCode: 'en-IN',
    languageName: 'English (India)',
    ssmlGender: 'MALE',
    tier: 'STANDARD',
    freeLimit: '4,000,000 chars/mo free',
    naturalness: 4.3,
    description: 'Friendly Indian male voice with neutral academic cadence.',
    samplePitch: -1.0,
    sampleRate: 1.0,
    nativeBrowserMatch: ['Google UK English Male', 'en-IN']
  },
  {
    id: 'en-IN-Standard-C',
    name: 'Google Indian English Standard C',
    languageCode: 'en-IN',
    languageName: 'English (India)',
    ssmlGender: 'MALE',
    tier: 'STANDARD',
    freeLimit: '4,000,000 chars/mo free',
    naturalness: 4.2,
    description: 'Confident male voice with strong emphasis on numerical data.',
    samplePitch: 0.0,
    sampleRate: 1.0,
    nativeBrowserMatch: ['Google UK English Male', 'en-IN']
  },
  {
    id: 'en-IN-Standard-D',
    name: 'Google Indian English Standard D',
    languageCode: 'en-IN',
    languageName: 'English (India)',
    ssmlGender: 'FEMALE',
    tier: 'STANDARD',
    freeLimit: '4,000,000 chars/mo free',
    naturalness: 4.4,
    description: 'Soothing female Indian voice, ideal for late-night audio flashcards.',
    samplePitch: 1.0,
    sampleRate: 0.95,
    nativeBrowserMatch: ['Google UK English Female', 'en-IN']
  },
  {
    id: 'hi-IN-Standard-A',
    name: 'Google Hindi Standard A',
    languageCode: 'hi-IN',
    languageName: 'Hindi (India)',
    ssmlGender: 'FEMALE',
    tier: 'STANDARD',
    freeLimit: '4,000,000 chars/mo free',
    naturalness: 4.2,
    description: 'Standard Hindi female voice for bilingual explanations.',
    samplePitch: 0.0,
    sampleRate: 1.0,
    nativeBrowserMatch: ['Google हिन्दी', 'hi-IN', 'Hindi']
  },
  {
    id: 'hi-IN-Standard-B',
    name: 'Google Hindi Standard B',
    languageCode: 'hi-IN',
    languageName: 'Hindi (India)',
    ssmlGender: 'MALE',
    tier: 'STANDARD',
    freeLimit: '4,000,000 chars/mo free',
    naturalness: 4.1,
    description: 'Clear Hindi male voice for concept walkthroughs.',
    samplePitch: -1.0,
    sampleRate: 1.0,
    nativeBrowserMatch: ['Google हिन्दी', 'hi-IN']
  },

  // ----------------------------------------------------
  // WAVENET NEURAL VOICES (1 Million characters/month free)
  // ----------------------------------------------------
  {
    id: 'en-US-Wavenet-A',
    name: 'Google US WaveNet A (Neural)',
    languageCode: 'en-US',
    languageName: 'English (US)',
    ssmlGender: 'MALE',
    tier: 'WAVENET',
    freeLimit: '1,000,000 chars/mo free',
    naturalness: 4.7,
    description: 'DeepMind WaveNet neural voice. Exceptional human-like cadence and warmth.',
    samplePitch: 0.0,
    sampleRate: 1.0,
    nativeBrowserMatch: ['Google US English', 'en-US']
  },
  {
    id: 'en-US-Wavenet-B',
    name: 'Google US WaveNet B (Neural)',
    languageCode: 'en-US',
    languageName: 'English (US)',
    ssmlGender: 'MALE',
    tier: 'WAVENET',
    freeLimit: '1,000,000 chars/mo free',
    naturalness: 4.8,
    description: 'Deep male neural voice with lifelike breathing and pauses.',
    samplePitch: -2.0,
    sampleRate: 0.95,
    nativeBrowserMatch: ['Google US English', 'en-US']
  },
  {
    id: 'en-US-Wavenet-C',
    name: 'Google US WaveNet C (Neural)',
    languageCode: 'en-US',
    languageName: 'English (US)',
    ssmlGender: 'FEMALE',
    tier: 'WAVENET',
    freeLimit: '1,000,000 chars/mo free',
    naturalness: 4.9,
    description: 'Ultra-natural female neural voice. Highly recommended for study guides.',
    samplePitch: 0.5,
    sampleRate: 1.0,
    nativeBrowserMatch: ['Google US English', 'en-US']
  },
  {
    id: 'en-US-Wavenet-D',
    name: 'Google US WaveNet D (Neural)',
    languageCode: 'en-US',
    languageName: 'English (US)',
    ssmlGender: 'MALE',
    tier: 'WAVENET',
    freeLimit: '1,000,000 chars/mo free',
    naturalness: 4.8,
    description: 'Smooth male academic voice with high clarity for dense legal terms.',
    samplePitch: 0.0,
    sampleRate: 1.0,
    nativeBrowserMatch: ['Google US English', 'en-US']
  },
  {
    id: 'en-US-Wavenet-E',
    name: 'Google US WaveNet E (Neural)',
    languageCode: 'en-US',
    languageName: 'English (US)',
    ssmlGender: 'FEMALE',
    tier: 'WAVENET',
    freeLimit: '1,000,000 chars/mo free',
    naturalness: 4.7,
    description: 'Soft female neural narrator, easy to listen to for long periods.',
    samplePitch: 0.0,
    sampleRate: 1.0,
    nativeBrowserMatch: ['Google US English', 'en-US']
  },
  {
    id: 'en-IN-Wavenet-A',
    name: 'Google Indian WaveNet A (Neural)',
    languageCode: 'en-IN',
    languageName: 'English (India)',
    ssmlGender: 'FEMALE',
    tier: 'WAVENET',
    freeLimit: '1,000,000 chars/mo free',
    naturalness: 4.9,
    description: 'Top-rated Indian female neural voice. Realistic inflection and phrasing.',
    samplePitch: 0.0,
    sampleRate: 1.0,
    nativeBrowserMatch: ['Google UK English Female', 'en-IN']
  },
  {
    id: 'en-IN-Wavenet-B',
    name: 'Google Indian WaveNet B (Neural)',
    languageCode: 'en-IN',
    languageName: 'English (India)',
    ssmlGender: 'MALE',
    tier: 'WAVENET',
    freeLimit: '1,000,000 chars/mo free',
    naturalness: 4.8,
    description: 'Natural Indian male neural voice. Highly articulated for complex calculations.',
    samplePitch: -1.0,
    sampleRate: 1.0,
    nativeBrowserMatch: ['Google UK English Male', 'en-IN']
  },
  {
    id: 'hi-IN-Wavenet-A',
    name: 'Google Hindi WaveNet A (Neural)',
    languageCode: 'hi-IN',
    languageName: 'Hindi (India)',
    ssmlGender: 'FEMALE',
    tier: 'WAVENET',
    freeLimit: '1,000,000 chars/mo free',
    naturalness: 4.8,
    description: 'High-fidelity Hindi female neural synthesis with authentic pronunciation.',
    samplePitch: 0.0,
    sampleRate: 1.0,
    nativeBrowserMatch: ['Google हिन्दी', 'hi-IN']
  },
  {
    id: 'hi-IN-Wavenet-B',
    name: 'Google Hindi WaveNet B (Neural)',
    languageCode: 'hi-IN',
    languageName: 'Hindi (India)',
    ssmlGender: 'MALE',
    tier: 'WAVENET',
    freeLimit: '1,000,000 chars/mo free',
    naturalness: 4.7,
    description: 'Rich Hindi male neural voice for detailed topic summaries.',
    samplePitch: -1.0,
    sampleRate: 1.0,
    nativeBrowserMatch: ['Google हिन्दी', 'hi-IN']
  },
  {
    id: 'en-GB-Wavenet-A',
    name: 'Google British WaveNet A (Neural)',
    languageCode: 'en-GB',
    languageName: 'English (UK)',
    ssmlGender: 'FEMALE',
    tier: 'WAVENET',
    freeLimit: '1,000,000 chars/mo free',
    naturalness: 4.8,
    description: 'Elegant British female neural voice with formal academic tone.',
    samplePitch: 0.0,
    sampleRate: 1.0,
    nativeBrowserMatch: ['Google UK English Female', 'en-GB']
  },
  {
    id: 'en-GB-Wavenet-B',
    name: 'Google British WaveNet B (Neural)',
    languageCode: 'en-GB',
    languageName: 'English (UK)',
    ssmlGender: 'MALE',
    tier: 'WAVENET',
    freeLimit: '1,000,000 chars/mo free',
    naturalness: 4.8,
    description: 'Authoritative British male neural voice.',
    samplePitch: -1.5,
    sampleRate: 0.95,
    nativeBrowserMatch: ['Google UK English Male', 'en-GB']
  },

  // ----------------------------------------------------
  // NEURAL2 VOICES (1 Million characters/month free)
  // ----------------------------------------------------
  {
    id: 'en-US-Neural2-A',
    name: 'Google US Neural2 A',
    languageCode: 'en-US',
    languageName: 'English (US)',
    ssmlGender: 'FEMALE',
    tier: 'NEURAL2',
    freeLimit: '1,000,000 chars/mo free',
    naturalness: 4.95,
    description: 'Next-generation Google Assistant model. Studio clarity with expressive prosody.',
    samplePitch: 0.0,
    sampleRate: 1.0,
    nativeBrowserMatch: ['Google US English', 'en-US']
  },
  {
    id: 'en-US-Neural2-C',
    name: 'Google US Neural2 C',
    languageCode: 'en-US',
    languageName: 'English (US)',
    ssmlGender: 'FEMALE',
    tier: 'NEURAL2',
    freeLimit: '1,000,000 chars/mo free',
    naturalness: 4.9,
    description: 'Warm, highly natural female voice with adaptive intonation.',
    samplePitch: 0.5,
    sampleRate: 1.0,
    nativeBrowserMatch: ['Google US English', 'en-US']
  },
  {
    id: 'en-US-Neural2-D',
    name: 'Google US Neural2 D',
    languageCode: 'en-US',
    languageName: 'English (US)',
    ssmlGender: 'MALE',
    tier: 'NEURAL2',
    freeLimit: '1,000,000 chars/mo free',
    naturalness: 4.92,
    description: 'Deep, crisp male Neural2 voice with executive clarity.',
    samplePitch: -1.0,
    sampleRate: 1.0,
    nativeBrowserMatch: ['Google US English', 'en-US']
  },
  {
    id: 'en-US-Neural2-F',
    name: 'Google US Neural2 F',
    languageCode: 'en-US',
    languageName: 'English (US)',
    ssmlGender: 'FEMALE',
    tier: 'NEURAL2',
    freeLimit: '1,000,000 chars/mo free',
    naturalness: 4.94,
    description: 'Smooth, polished female presenter voice for video lectures.',
    samplePitch: 0.0,
    sampleRate: 1.0,
    nativeBrowserMatch: ['Google US English', 'en-US']
  },
  {
    id: 'en-US-Neural2-J',
    name: 'Google US Neural2 J',
    languageCode: 'en-US',
    languageName: 'English (US)',
    ssmlGender: 'MALE',
    tier: 'NEURAL2',
    freeLimit: '1,000,000 chars/mo free',
    naturalness: 4.9,
    description: 'Dynamic male voice with high energy and natural cadence.',
    samplePitch: 0.0,
    sampleRate: 1.05,
    nativeBrowserMatch: ['Google US English', 'en-US']
  },

  // ----------------------------------------------------
  // JOURNEY & NEWS VOICES (1 Million characters/month free)
  // ----------------------------------------------------
  {
    id: 'en-US-Journey-D',
    name: 'Google US Journey D (Podcast)',
    languageCode: 'en-US',
    languageName: 'English (US)',
    ssmlGender: 'MALE',
    tier: 'JOURNEY',
    freeLimit: '1,000,000 chars/mo free',
    naturalness: 4.98,
    description: 'Conversational podcast-style voice optimized for interactive Q&A.',
    samplePitch: -0.5,
    sampleRate: 1.0,
    nativeBrowserMatch: ['Google US English', 'en-US']
  },
  {
    id: 'en-US-Journey-F',
    name: 'Google US Journey F (Audiobook)',
    languageCode: 'en-US',
    languageName: 'English (US)',
    ssmlGender: 'FEMALE',
    tier: 'JOURNEY',
    freeLimit: '1,000,000 chars/mo free',
    naturalness: 4.97,
    description: 'Expressive female storytelling voice perfect for study podcasts.',
    samplePitch: 0.0,
    sampleRate: 1.0,
    nativeBrowserMatch: ['Google US English', 'en-US']
  },
  {
    id: 'en-US-News-K',
    name: 'Google US News K (Broadcast)',
    languageCode: 'en-US',
    languageName: 'English (US)',
    ssmlGender: 'FEMALE',
    tier: 'JOURNEY',
    freeLimit: '1,000,000 chars/mo free',
    naturalness: 4.95,
    description: 'News broadcast voice designed for clear ICAI exam date announcements.',
    samplePitch: 0.5,
    sampleRate: 1.0,
    nativeBrowserMatch: ['Google US English', 'en-US']
  },

  // ----------------------------------------------------
  // STUDIO VOICES (Ultra High Definition Preview)
  // ----------------------------------------------------
  {
    id: 'en-US-Studio-O',
    name: 'Google US Studio O (Mastering)',
    languageCode: 'en-US',
    languageName: 'English (US)',
    ssmlGender: 'FEMALE',
    tier: 'STUDIO',
    freeLimit: 'Free Tier Preview',
    naturalness: 5.0,
    description: 'Studio-mastered professional voice recorded with studio condenser mic acoustics.',
    samplePitch: 0.0,
    sampleRate: 1.0,
    nativeBrowserMatch: ['Google US English', 'en-US']
  },
  {
    id: 'en-US-Studio-Q',
    name: 'Google US Studio Q (Mastering)',
    languageCode: 'en-US',
    languageName: 'English (US)',
    ssmlGender: 'MALE',
    tier: 'STUDIO',
    freeLimit: 'Free Tier Preview',
    naturalness: 5.0,
    description: 'Ultra HD male narrator voice with cinematic clarity.',
    samplePitch: -1.0,
    sampleRate: 1.0,
    nativeBrowserMatch: ['Google US English', 'en-US']
  }
];
