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
  Cloud,
  Zap,
  Key,
  Info,
  ExternalLink
} from 'lucide-react';
import { 
  GEMINI_SAMPLE_PROMPTS, 
  TTS_TABS,
  GEMINI_LEDA_CHARON_VOICES,
  EDGE_NEURAL_VOICES,
  GCP_NEURAL_VOICES,
  GTTS_VOICES
} from '../data/geminiVoicesData.js';
import { 
  getHinglishBrowserVoice, 
  getHinglishUtteranceParams,
  getEdgeNeuralVoice,
  getGoogleTranslateAudioUrl
} from '../utils/geminiAudioSynth.js';
import { useToast } from '../context/ToastContext.jsx';

export default function GeminiVoices() {
  const { addToast } = useToast();

  // Active Tab Engine State ('gemini' | 'msedge' | 'gcp' | 'gtts')
  const [activeTab, setActiveTab] = useState('gemini');

  // Selected Voice & Text States
  const [selectedVoice, setSelectedVoice] = useState(GEMINI_LEDA_CHARON_VOICES[0]);
  const [sampleText, setSampleText] = useState(GEMINI_SAMPLE_PROMPTS[0].text);
  const [speakingRate, setSpeakingRate] = useState(1.0);
  const [pitch, setPitch] = useState(0.0);
  const [volume, setVolume] = useState(1.0);
  const [gcpApiKey, setGcpApiKey] = useState('');

  // Playback & Engine States
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [loadingAudio, setLoadingAudio] = useState(false);

  // Audio References
  const audioRef = useRef(null);
  const progressIntervalRef = useRef(null);

  // Update selected voice when switching tabs
  useEffect(() => {
    handleStopVoice();
    if (activeTab === 'gemini') {
      setSelectedVoice(GEMINI_LEDA_CHARON_VOICES[0]);
    } else if (activeTab === 'msedge') {
      setSelectedVoice(EDGE_NEURAL_VOICES[0]);
    } else if (activeTab === 'gcp') {
      setSelectedVoice(GCP_NEURAL_VOICES[0]);
    } else if (activeTab === 'gtts') {
      setSelectedVoice(GTTS_VOICES[0]);
    }
  }, [activeTab]);

  // Cleanup speech synthesis & audio elements on unmount
  useEffect(() => {
    return () => {
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
    };
  }, []);

  // Play Voice across the 4 Engines
  const handlePlayVoice = async (voiceToPlay = selectedVoice) => {
    // 1. Stop any ongoing playback
    handleStopVoice();
    setLoadingAudio(true);

    try {
      // ----------------------------------------------------
      // ENGINE 1: GEMINI VOICE STUDIO (Browser Tuned)
      // ----------------------------------------------------
      if (activeTab === 'gemini') {
        if (!('speechSynthesis' in window)) {
          addToast('Speech synthesis is not supported in your browser.', 'error');
          setLoadingAudio(false);
          return;
        }

        const utterance = new SpeechSynthesisUtterance(sampleText);
        const { pitch: distinctPitch, rate: distinctRate } = getHinglishUtteranceParams(
          voiceToPlay.id, 
          pitch, 
          speakingRate
        );

        utterance.pitch = distinctPitch;
        utterance.rate = distinctRate;
        utterance.volume = volume;

        const matchedVoice = getHinglishBrowserVoice(voiceToPlay.id);
        if (matchedVoice) {
          utterance.voice = matchedVoice;
        }

        utterance.onstart = () => {
          setLoadingAudio(false);
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
          console.error('Gemini Speech error:', e);
          setIsPlaying(false);
          setLoadingAudio(false);
          if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        };

        window.speechSynthesis.speak(utterance);
        return;
      }

      // ----------------------------------------------------
      // ENGINE 2: MICROSOFT EDGE NEURAL (Free HD Neural)
      // ----------------------------------------------------
      if (activeTab === 'msedge') {
        if ('speechSynthesis' in window) {
          const edgeVoice = getEdgeNeuralVoice(voiceToPlay.voiceCode);
          const utterance = new SpeechSynthesisUtterance(sampleText);
          utterance.rate = speakingRate;
          utterance.volume = volume;

          if (edgeVoice) {
            utterance.voice = edgeVoice;
          }

          utterance.onstart = () => {
            setLoadingAudio(false);
            setIsPlaying(true);
            const estimatedDurationSec = (sampleText.length / 14) / speakingRate;
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

          utterance.onerror = () => {
            // Fallback to Google Translate Stream if Edge voice fails
            playGoogleTranslateStream(voiceToPlay.voiceCode.includes('hi') ? 'hi' : 'en-IN');
          };

          window.speechSynthesis.speak(utterance);
          return;
        }

        // Fallback if speechSynthesis unavailable
        playGoogleTranslateStream(voiceToPlay.voiceCode.includes('hi') ? 'hi' : 'en-IN');
        return;
      }

      // ----------------------------------------------------
      // ENGINE 3: GOOGLE CLOUD NEURAL2 (GCP API or Fallback)
      // ----------------------------------------------------
      if (activeTab === 'gcp') {
        if (gcpApiKey.trim()) {
          // Official Google Cloud Text-to-Speech REST API Call
          const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${gcpApiKey.trim()}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              input: { text: sampleText },
              voice: { languageCode: voiceToPlay.voiceCode.substring(0, 5), name: voiceToPlay.voiceCode },
              audioConfig: { audioEncoding: 'MP3', speakingRate, pitch, volumeGainDb: 0 }
            })
          });

          if (!response.ok) {
            const errJson = await response.json();
            throw new Error(errJson.error?.message || 'Google Cloud TTS API Error');
          }

          const data = await response.json();
          if (data.audioContent) {
            const audioSrc = `data:audio/mp3;base64,${data.audioContent}`;
            playAudioBlob(audioSrc);
            return;
          }
        }

        // Friendly demo mode if GCP Key is not entered
        addToast('No GCP Key provided. Playing in Free Google Cloud Demo Mode.', 'info');
        playGoogleTranslateStream(voiceToPlay.voiceCode.includes('hi') ? 'hi' : 'en-IN');
        return;
      }

      // ----------------------------------------------------
      // ENGINE 4: GOOGLE TRANSLATE STREAM (gTTS)
      // ----------------------------------------------------
      if (activeTab === 'gtts') {
        playGoogleTranslateStream(voiceToPlay.lang || 'en-IN');
        return;
      }

    } catch (err) {
      console.error('Audio play error:', err);
      addToast(`Error playing audio: ${err.message}`, 'error');
      setIsPlaying(false);
      setLoadingAudio(false);
    }
  };

  // Helper: Play Google Translate Stream Audio
  const playGoogleTranslateStream = (lang) => {
    const streamUrl = getGoogleTranslateAudioUrl(sampleText, lang);
    playAudioBlob(streamUrl);
  };

  // Helper: HTML5 Audio Player with Soundwave & Progress Tracker
  const playAudioBlob = (url) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(url);
    audio.playbackRate = speakingRate;
    audio.volume = volume;
    audioRef.current = audio;

    audio.onplay = () => {
      setLoadingAudio(false);
      setIsPlaying(true);
      progressIntervalRef.current = setInterval(() => {
        if (audio.duration) {
          const prog = (audio.currentTime / audio.duration) * 100;
          setPlaybackProgress(prog);
        }
      }, 100);
    };

    audio.onended = () => {
      setIsPlaying(false);
      setPlaybackProgress(100);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };

    audio.onerror = (e) => {
      console.error('Audio element error:', e);
      setIsPlaying(false);
      setLoadingAudio(false);
      addToast('Direct audio streaming error. Trying fallback speech engine...', 'warning');
      
      // Fallback to browser SpeechSynthesis
      if ('speechSynthesis' in window) {
        const fallbackUtterance = new SpeechSynthesisUtterance(sampleText);
        fallbackUtterance.rate = speakingRate;
        fallbackUtterance.volume = volume;
        window.speechSynthesis.speak(fallbackUtterance);
      }
    };

    audio.play().catch(err => {
      console.error('Autoplay blocked:', err);
      setLoadingAudio(false);
      setIsPlaying(false);
      addToast('Click play again to start audio playback.', 'info');
    });
  };

  const handleStopVoice = () => {
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
    setLoadingAudio(false);
    setPlaybackProgress(0);
  };

  // Get current active list of voices based on tab
  const getActiveVoiceList = () => {
    switch (activeTab) {
      case 'gemini': return GEMINI_LEDA_CHARON_VOICES;
      case 'msedge': return EDGE_NEURAL_VOICES;
      case 'gcp': return GCP_NEURAL_VOICES;
      case 'gtts': return GTTS_VOICES;
      default: return GEMINI_LEDA_CHARON_VOICES;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300 pb-12">
      
      {/* 1. HERO HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950/60 via-indigo-950/50 to-slate-900/60 p-6 md:p-8 border border-purple-500/30 shadow-2xl glass-panel text-center md:text-left">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                🇮🇳 Hinglish Voice Studio
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-emerald-300" />
                Multi-Engine TTS Studio
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              Hinglish Text-to-Speech Studio
            </h1>
            <p className="text-slate-300 text-sm md:text-base max-w-3xl leading-relaxed">
              Compare Gemini Leda & Charon, Microsoft Edge Neural HD, Google Cloud Neural2, and Google Translate audio engines for Indian English and Hinglish CA study prompts.
            </p>
          </div>
        </div>
      </div>

      {/* 2. ENGINE TAB NAVIGATION */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-2 rounded-2xl bg-surface-card border border-surface-border">
        {TTS_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-3.5 rounded-xl transition-all flex flex-col items-center md:items-start text-left gap-1 relative overflow-hidden ${
                isActive
                  ? 'bg-gradient-to-r ' + tab.color + ' text-white shadow-lg shadow-purple-900/30 font-bold scale-[1.02]'
                  : 'hover:bg-surface/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs md:text-sm font-extrabold flex items-center gap-1.5">
                  {tab.id === 'gemini' && <Sparkles className="w-4 h-4 text-amber-300" />}
                  {tab.id === 'msedge' && <Zap className="w-4 h-4 text-cyan-300" />}
                  {tab.id === 'gcp' && <Cloud className="w-4 h-4 text-emerald-300" />}
                  {tab.id === 'gtts' && <Volume2 className="w-4 h-4 text-orange-300" />}
                  {tab.label}
                </span>
              </div>
              <span className={`text-[10px] ${isActive ? 'text-purple-100' : 'text-slate-500'}`}>
                {tab.subLabel}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. ENGINE INFORMATION BANNER */}
      <div className="p-4 rounded-2xl bg-surface-card/90 border border-surface-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div>
            {activeTab === 'gemini' && (
              <p className="text-slate-200">
                <strong className="text-purple-300">Gemini Voices Engine:</strong> Custom browser speech synthesis with pitch & formant offset for <strong>Gemini Leda</strong> (Crisp Female) and <strong>Gemini Charon</strong> (Deep Male Bass).
              </p>
            )}
            {activeTab === 'msedge' && (
              <p className="text-slate-200">
                <strong className="text-cyan-300">Microsoft Edge Neural Engine:</strong> Uses Microsoft Edge's 100% Free natural neural voices (Neerja & Prabhat). Offers human-like fluent Indian Hinglish pronunciation with zero cost.
              </p>
            )}
            {activeTab === 'gcp' && (
              <p className="text-slate-200">
                <strong className="text-emerald-300">Google Cloud Neural2 Engine:</strong> Official GCP Text-to-Speech API (1 Million characters/mo FREE every month for Neural2 voices).
              </p>
            )}
            {activeTab === 'gtts' && (
              <p className="text-slate-200">
                <strong className="text-amber-300">Google Translate Stream Engine:</strong> Direct free stream from Google's Indian English (`en-IN`) and Hindi (`hi`) translation audio server. Instant response, no key required.
              </p>
            )}
          </div>
        </div>

        {activeTab === 'gcp' && (
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <Key className="w-4 h-4 text-emerald-400" />
            <input
              type="password"
              placeholder="Optional GCP API Key..."
              value={gcpApiKey}
              onChange={(e) => setGcpApiKey(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-surface border border-surface-border text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full sm:w-48"
            />
          </div>
        )}
      </div>

      {/* 4. VOICE CARDS GRID FOR ACTIVE TAB */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {getActiveVoiceList().map((voice) => {
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

      {/* 5. AUDIO TESTING STUDIO CONTROLS */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 border border-surface-border space-y-6 shadow-xl">
        
        {/* Active Voice Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-surface-card border border-surface-border gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{selectedVoice.gender === 'FEMALE' ? '👩' : '👨'}</span>
            <div>
              <h4 className="font-bold text-white text-base">Active Voice: {selectedVoice.titleName}</h4>
              <p className="text-xs text-slate-400">{selectedVoice.tone} • Engine: <strong className="text-purple-300 uppercase">{activeTab}</strong></p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
              Voice Engine Ready
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
              className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-amber-500 transition-all duration-100" 
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
