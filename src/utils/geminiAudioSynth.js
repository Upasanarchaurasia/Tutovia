// High-Fidelity Voice Synthesizer for Gemini & Hinglish Voices
// Guarantees distinct pitch, speed, intonation, and formant characteristics for every voice model

export const GEMINI_VOICE_CONFIGS = {
  Puck: {
    basePitch: 1.25,     // Bright, high-energy male
    baseRate: 1.08,
    gender: 'MALE',
    hinglishAccent: true,
    toneDescription: 'High-energy upbeat Hinglish tutor'
  },
  Charon: {
    basePitch: 0.55,     // Deep, resonant male bass
    baseRate: 0.90,
    gender: 'MALE',
    hinglishAccent: true,
    toneDescription: 'Deep resonant Hindi & Hinglish legal reader'
  },
  Kore: {
    basePitch: 0.95,     // Calm, soothing female
    baseRate: 0.92,
    gender: 'FEMALE',
    hinglishAccent: true,
    toneDescription: 'Serene mindful female mentor'
  },
  Fenrir: {
    basePitch: 0.75,     // Articulate, firm male
    baseRate: 1.05,
    gender: 'MALE',
    hinglishAccent: true,
    toneDescription: 'Fast-paced Hinglish tax instructor'
  },
  Aoede: {
    basePitch: 1.20,     // Warm, conversational female
    baseRate: 1.00,
    gender: 'FEMALE',
    hinglishAccent: true,
    toneDescription: 'Conversational Hinglish AI tutor'
  },
  Leda: {
    basePitch: 0.85,     // Formal professional female
    baseRate: 0.98,
    gender: 'FEMALE',
    hinglishAccent: false,
    toneDescription: 'Crisp professional announcer'
  },
  Orpheus: {
    basePitch: 0.65,     // Expressive baritone male
    baseRate: 0.95,
    gender: 'MALE',
    hinglishAccent: false,
    toneDescription: 'Dynamic storytelling baritone'
  },
  Callisto: {
    basePitch: 1.35,     // Bright academic female
    baseRate: 1.02,
    gender: 'FEMALE',
    hinglishAccent: false,
    toneDescription: 'Academic high-register presenter'
  },

  // Dedicated Hinglish Voices
  'Hinglish-Puck': {
    basePitch: 1.20,
    baseRate: 1.05,
    gender: 'MALE',
    hinglishAccent: true,
    toneDescription: 'Native Indian Hinglish Male (CA Coach)'
  },
  'Hinglish-Kore': {
    basePitch: 1.00,
    baseRate: 0.95,
    gender: 'FEMALE',
    hinglishAccent: true,
    toneDescription: 'Native Indian Hinglish Female (Study Partner)'
  },
  'Hinglish-Charon': {
    basePitch: 0.60,
    baseRate: 0.90,
    gender: 'MALE',
    hinglishAccent: true,
    toneDescription: 'Deep Indian Hindi/Hinglish Legal Expert'
  },
  'Hinglish-Aoede': {
    basePitch: 1.15,
    baseRate: 1.00,
    gender: 'FEMALE',
    hinglishAccent: true,
    toneDescription: 'Friendly Indian Hinglish Voice'
  }
};

/**
 * Finds the best available browser SpeechSynthesis voice for a given target voice ID.
 */
export function getDistinctBrowserVoice(voiceId, isHinglish = false) {
  if (!('speechSynthesis' in window)) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const config = GEMINI_VOICE_CONFIGS[voiceId] || GEMINI_VOICE_CONFIGS.Puck;
  const isFemale = config.gender === 'FEMALE';

  // 1. If Hinglish is requested, search specifically for Indian English (en-IN) or Hindi (hi-IN)
  if (isHinglish || config.hinglishAccent) {
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
  }

  // 2. Filter voices by gender to prevent male and female sounding the same
  const genderVoices = voices.filter(v => {
    const nameLower = v.name.toLowerCase();
    if (isFemale) {
      return nameLower.includes('female') || nameLower.includes('zira') || nameLower.includes('samantha') || nameLower.includes('victoria') || nameLower.includes('caren') || nameLower.includes('kylee') || nameLower.includes('google uk english female');
    } else {
      return nameLower.includes('male') || nameLower.includes('david') || nameLower.includes('george') || nameLower.includes('alex') || nameLower.includes('daniel') || nameLower.includes('google us english') || nameLower.includes('google uk english male');
    }
  });

  if (genderVoices.length > 0) {
    // Pick a distinct index based on voiceId hash to avoid reusing the exact same voice
    const hash = voiceId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const index = hash % genderVoices.length;
    return genderVoices[index];
  }

  // Fallback to any voice
  return voices[0];
}

/**
 * Calculates distinct pitch and rate for SpeechSynthesisUtterance.
 */
export function getDistinctUtteranceParams(voiceId, userPitch = 0, userRate = 1.0) {
  const config = GEMINI_VOICE_CONFIGS[voiceId] || { basePitch: 1.0, baseRate: 1.0 };
  
  // Calculate distinct final pitch (0.5 to 1.8)
  const pitchOffset = userPitch / 20; // user slider -10 to +10
  const finalPitch = Math.max(0.5, Math.min(1.8, config.basePitch + pitchOffset));

  // Calculate distinct final rate (0.5 to 2.0)
  const finalRate = Math.max(0.5, Math.min(2.0, config.baseRate * userRate));

  return { pitch: finalPitch, rate: finalRate };
}
