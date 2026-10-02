// Distinct Voice Synthesizer for Gemini Leda and Gemini Charon in Hinglish accent

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
