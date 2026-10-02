// Comprehensive Voice Synthesizer & Audio Engine Supporting 4 TTS Systems:
// 1. Gemini Hinglish (Web Speech Synthesis tuned for Leda & Charon)
// 2. Microsoft Edge Neural (Online Natural HD Voices)
// 3. Google Cloud Neural2 (GCP Text-to-Speech API)
// 4. Google Translate Stream (Instant Free Audio Stream)

export const GEMINI_LEDA_CHARON_CONFIGS = {
  'Leda-Hinglish': {
    basePitch: 1.15,      // Crisp, warm female pitch
    baseRate: 0.98,
    gender: 'FEMALE',
    hinglishAccent: true
  },
  'Charon-Hinglish': {
    basePitch: 0.60,      // Deep, resonant male bass
    baseRate: 0.90,
    gender: 'MALE',
    hinglishAccent: true
  }
};

export function getHinglishBrowserVoice(voiceId) {
  if (!('speechSynthesis' in window)) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const config = GEMINI_LEDA_CHARON_CONFIGS[voiceId] || GEMINI_LEDA_CHARON_CONFIGS['Leda-Hinglish'];
  const isFemale = config.gender === 'FEMALE';

  // Find Indian English / Hindi voices
  const indianVoices = voices.filter(v => 
    v.lang.includes('IN') || 
    v.lang.includes('hi') || 
    v.name.includes('India') || 
    v.name.includes('Hindi') || 
    v.name.includes('Heera') || 
    v.name.includes('Ravi') ||
    v.name.includes('Kalpana') ||
    v.name.includes('Hemant')
  );

  if (indianVoices.length > 0) {
    const matchedGender = indianVoices.find(v => 
      isFemale ? (v.name.includes('Female') || v.name.includes('Heera') || v.name.includes('Kalpana'))
               : (v.name.includes('Male') || v.name.includes('Ravi') || v.name.includes('Hemant'))
    );
    if (matchedGender) return matchedGender;
    return indianVoices[0];
  }

  // Fallback to any gendered voice
  const genderVoices = voices.filter(v => {
    const nameLower = v.name.toLowerCase();
    if (isFemale) {
      return nameLower.includes('female') || nameLower.includes('zira') || nameLower.includes('samantha');
    } else {
      return nameLower.includes('male') || nameLower.includes('david') || nameLower.includes('george');
    }
  });

  return genderVoices.length > 0 ? genderVoices[0] : voices[0];
}

export function getHinglishUtteranceParams(voiceId, userPitch = 0, userRate = 1.0) {
  const config = GEMINI_LEDA_CHARON_CONFIGS[voiceId] || GEMINI_LEDA_CHARON_CONFIGS['Leda-Hinglish'];
  const pitchOffset = userPitch / 20;
  const finalPitch = Math.max(0.5, Math.min(1.8, config.basePitch + pitchOffset));
  const finalRate = Math.max(0.5, Math.min(2.0, config.baseRate * userRate));

  return { pitch: finalPitch, rate: finalRate };
}

// Find Microsoft Edge Online Natural Voices from WebSpeech if available
export function getEdgeNeuralVoice(voiceCode) {
  if (!('speechSynthesis' in window)) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // Exact match by name / URI
  const exact = voices.find(v => v.name.includes(voiceCode) || v.voiceURI.includes(voiceCode));
  if (exact) return exact;

  // Match by keyword (Neerja, Prabhat, Swara, Madhur)
  const key = voiceCode.split('-')[1] || '';
  const matched = voices.find(v => v.name.toLowerCase().includes(key.toLowerCase()));
  if (matched) return matched;

  // Fallback to any Indian English / Hindi voice
  return getHinglishBrowserVoice('Leda-Hinglish');
}

// Google Translate Audio Stream Endpoint Generator
export function getGoogleTranslateAudioUrl(text, lang = 'en-IN') {
  const cleanLang = lang.includes('hi') ? 'hi' : 'en-IN';
  const encodedText = encodeURIComponent(text.substring(0, 200)); // 200 char limit per stream chunk
  return `https://translate.google.com/translate_tts?client=tw-ob&tl=${cleanLang}&q=${encodedText}`;
}
