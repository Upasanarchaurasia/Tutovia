import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  Play, 
  Pause, 
  Square, 
  Sparkles, 
  Mic, 
  FileText, 
  Globe, 
  CheckCircle2, 
  Sliders, 
  RefreshCw,
  User,
  Shield,
  Zap,
  Info
} from 'lucide-react';
import { 
  GEMINI_SAMPLE_PROMPTS, 
  GEMINI_LEDA_CHARON_VOICES 
} from '../data/geminiVoicesData.js';
import { 
  getHinglishBrowserVoice, 
  getHinglishUtteranceParams 
} from '../utils/geminiAudioSynth.js';
import { useToast } from '../context/ToastContext.jsx';
import axios from '../api.js';

export default function GeminiVoices() {
  const { addToast } = useToast();

  // Selected Voice (Default to Gemini Leda - Female Hinglish)
  const [selectedVoice, setSelectedVoice] = useState(GEMINI_LEDA_CHARON_VOICES[0]);
  const [sampleText, setSampleText] = useState(GEMINI_SAMPLE_PROMPTS[0].text);
  const [speakingRate, setSpeakingRate] = useState(1.0);
  const [pitch, setPitch] = useState(0.0);
  const [volume, setVolume] = useState(1.0);

  // Playback & Engine States
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [loadingAudio, setLoadingAudio] = useState(false);

  // Audio References
  const audioRef = useRef(null);
  const progressIntervalRef = useRef(null);

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  // Play Audio Synthesis for Gemini Leda or Charon with Hinglish Accent
  const handlePlayVoice = async (voiceToPlay = selectedVoice) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    setIsPlaying(false);
    setPlaybackProgress(0);

    // Speech Synthesis with Distinct Hinglish Pitch & Vocal Profile
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(sampleText);

      // Get distinct pitch and rate for Leda or Charon
      const { pitch: distinctPitch, rate: distinctRate } = getHinglishUtteranceParams(
        voiceToPlay.id, 
        pitch, 
        speakingRate
      );

      utterance.pitch = distinctPitch;
      utterance.rate = distinctRate;
      utterance.volume = volume;

      // Select Indian/Hinglish browser voice
      const matchedVoice = getHinglishBrowserVoice(voiceToPlay.id);
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onstart = () => {
        setIsPlaying(true);
        const estimatedDurationSec = (sampleText.length / 14) / distinctRate;
        let elapsed = 0;
        progressIntervalRef.current = setInterval(() => {
          elapsed += 0.1;
          const prog = Math.min(98, (elapsed / estimatedDurationSec) * 100);
          setPlaybackProgress(prog);
        }, 100);
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setPlaybackProgress(100);
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      };

      utterance.onerror = (e) => {
        console.error('Speech synthesis error:', e);
        setIsPlaying(false);
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      };

      window.speechSynthesis.speak(utterance);
      return;
    }

    addToast('Speech synthesis is not supported in this browser.', 'error');
  };

  const handleStopVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    setIsPlaying(false);
    setPlaybackProgress(0);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* 1. CLEAN HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-slate-900/50 p-6 md:p-8 border border-purple-500/30 shadow-2xl glass-panel text-center md:text-left">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                🇮🇳 Hinglish Accent Studio
              </span>
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Gemini Leda & Charon Voices
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              Gemini Hinglish Voice Studio
            </h1>
            <p className="text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed">
              Listen to <strong>Gemini Leda</strong> (Crisp Female Hinglish) and <strong>Gemini Charon</strong> (Deep Male Hinglish) designed specifically for CA study recaps and concept explanations.
            </p>
          </div>
        </div>
      </div>

      {/* 2. VOICE SELECTOR CARDS (LEDA vs CHARON) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {GEMINI_LEDA_CHARON_VOICES.map((voice) => {
          const isSelected = selectedVoice.id === voice.id;
          return (
            <div
              key={voice.id}
              onClick={() => {
                setSelectedVoice(voice);
                handlePlayVoice(voice);
              }}
              className={`p-6 rounded-3xl border transition-all cursor-pointer relative group flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-br from-purple-900/40 via-surface-card to-indigo-900/30 border-purple-500 shadow-2xl ring-2 ring-purple-500/50 scale-[1.02]'
                  : 'bg-surface-card/80 hover:bg-surface-card border-surface-border hover:border-slate-700'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg ${
                      voice.gender === 'FEMALE'
                        ? 'bg-gradient-to-tr from-purple-600 to-rose-600 shadow-purple-500/30'
                        : 'bg-gradient-to-tr from-indigo-600 to-blue-600 shadow-indigo-500/30'
                    }`}>
                      <Mic className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-extrabold text-white">{voice.titleName}</h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          🇮🇳 Hinglish
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{voice.tone}</p>
                    </div>
                  </div>

                  {isSelected && (
                    <CheckCircle2 className="w-6 h-6 text-purple-400 shrink-0" />
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {voice.description}
                </p>

                <div className="p-3 rounded-2xl bg-surface/60 border border-surface-border text-[11px] text-purple-200">
                  <strong className="text-white">Recommended for:</strong> {voice.recommendedFor}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-surface-border/60 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">
                  Gender: <strong className="text-slate-200">{voice.gender}</strong>
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVoice(voice);
                    handlePlayVoice(voice);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all shadow-md ${
                    isSelected
                      ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30'
                      : 'bg-surface-card hover:bg-surface border border-surface-border text-slate-300'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Listen {voice.name}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. AUDIO TESTING STUDIO */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 border border-surface-border space-y-6 shadow-xl">
        
        {/* Active Voice Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-surface-card border border-surface-border gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{selectedVoice.gender === 'FEMALE' ? '👩' : '👨'}</span>
            <div>
              <h4 className="font-bold text-white text-base">Active Voice: {selectedVoice.titleName}</h4>
              <p className="text-xs text-slate-400">{selectedVoice.tone} • Hinglish Accent</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
              Speech Ready
            </span>
          </div>
        </div>

        {/* Prompt Selector & Text Area */}
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-purple-400" />
              Hinglish Sample Phrase
            </label>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-300">Preset Phrases:</span>
              <select
                onChange={(e) => setSampleText(e.target.value)}
                value={sampleText}
                className="bg-surface-card border border-surface-border text-xs text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-purple-500 font-medium"
              >
                {GEMINI_SAMPLE_PROMPTS.map((p, idx) => (
                  <option key={idx} value={p.text}>{p.title}</option>
                ))}
              </select>
            </div>
          </div>

          <textarea
            rows={4}
            value={sampleText}
            onChange={(e) => setSampleText(e.target.value)}
            className="w-full p-4 rounded-2xl bg-surface-card border border-surface-border text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 leading-relaxed placeholder:text-slate-500 transition-all font-sans"
            placeholder="Type or paste any Hinglish phrase to test..."
          />
        </div>

        {/* Playback Controls & Soundwave */}
        <div className="p-4 rounded-2xl bg-surface-card border border-surface-border space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => isPlaying ? handleStopVoice() : handlePlayVoice()}
                disabled={loadingAudio}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold transition-all shadow-xl hover:scale-105 active:scale-95 ${
                  isPlaying 
                    ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/30' 
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-600/30'
                }`}
              >
                {loadingAudio ? (
                  <RefreshCw className="w-6 h-6 animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-6 h-6 fill-white" />
                ) : (
                  <Play className="w-6 h-6 fill-white ml-0.5" />
                )}
              </button>

              <button
                onClick={handleStopVoice}
                disabled={!isPlaying}
                className="w-11 h-11 rounded-xl bg-surface border border-surface-border flex items-center justify-center text-slate-400 hover:text-slate-100 disabled:opacity-40 transition-colors"
                title="Stop Playback"
              >
                <Square className="w-4 h-4 fill-current" />
              </button>

              <div>
                <h4 className="text-sm font-extrabold text-white">
                  {isPlaying ? `Playing ${selectedVoice.titleName}...` : 'Click Play to Listen'}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Accent: <span className="text-amber-300 font-semibold">Indian Hinglish</span>
                </p>
              </div>
            </div>

            {/* Soundwave Bars */}
            <div className="flex items-center gap-1.5 h-8 px-2">
              {[40, 75, 100, 60, 90, 45, 80, 50, 95, 30].map((h, i) => (
                <div
                  key={i}
                  style={{ height: isPlaying ? `${h}%` : '20%' }}
                  className={`w-1.5 rounded-full transition-all duration-300 ${
                    isPlaying ? 'bg-purple-400 animate-pulse' : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-amber-500 transition-all duration-100" 
              style={{ width: `${playbackProgress}%` }}
            />
          </div>
        </div>

        {/* Voice Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          
          <div className="p-3.5 rounded-2xl bg-surface-card/60 border border-surface-border space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Speaking Speed</span>
              <span className="font-mono text-purple-300 font-bold">{speakingRate}x</span>
            </div>
            <input 
              type="range" 
              min="0.5" 
              max="2.0" 
              step="0.05"
              value={speakingRate}
              onChange={(e) => setSpeakingRate(parseFloat(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0.5x Slow</span>
              <span>1.0x Normal</span>
              <span>2.0x Fast</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-card/60 border border-surface-border space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Voice Pitch</span>
              <span className="font-mono text-indigo-300 font-bold">{pitch > 0 ? `+${pitch}` : pitch} st</span>
            </div>
            <input 
              type="range" 
              min="-10" 
              max="10" 
              step="1"
              value={pitch}
              onChange={(e) => setPitch(parseFloat(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>-10 Deep</span>
              <span>0 Normal</span>
              <span>+10 High</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-card/60 border border-surface-border space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Volume</span>
              <span className="font-mono text-emerald-300 font-bold">{Math.round(volume * 100)}%</span>
            </div>
            <input 
              type="range" 
              min="0.0" 
              max="1.0" 
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0% Mute</span>
              <span>50%</span>
              <span>100% Max</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
