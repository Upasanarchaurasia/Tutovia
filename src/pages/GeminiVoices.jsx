import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Square, 
  Sparkles, 
  Mic, 
  Search, 
  Sliders, 
  Copy, 
  Check, 
  Cloud, 
  Key, 
  Zap, 
  Info, 
  RefreshCw,
  Layers,
  Radio,
  FileText,
  CheckCircle2,
  Cpu,
  Globe,
  Flame,
  Star
} from 'lucide-react';
import { 
  GEMINI_FREE_TIER_INFO, 
  GEMINI_SAMPLE_PROMPTS, 
  GEMINI_SAMPLE_VOICES 
} from '../data/geminiVoicesData.js';
import { 
  getDistinctBrowserVoice, 
  getDistinctUtteranceParams 
} from '../utils/geminiAudioSynth.js';
import { useToast } from '../context/ToastContext.jsx';
import axios from '../api.js';

export default function GeminiVoices() {
  const { addToast } = useToast();

  // Search & Filter States — DEFAULT TO HINGLISH SO IT IS IMMEDIATELY VISIBLE
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('HINGLISH'); // 'HINGLISH', 'ALL', 'GEMINI_OFFICIAL'
  const [selectedGender, setSelectedGender] = useState('ALL');

  // Selected Voice & Controls — DEFAULT TO HINGLISH PUCK & HINGLISH PROMPT 1
  const [selectedVoice, setSelectedVoice] = useState(GEMINI_SAMPLE_VOICES[0]);
  const [sampleText, setSampleText] = useState(GEMINI_SAMPLE_PROMPTS[0].text);
  const [speakingRate, setSpeakingRate] = useState(1.0);
  const [pitch, setPitch] = useState(0.0);
  const [volume, setVolume] = useState(1.0);
  const [showJson, setShowJson] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  // Playback & Engine States
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [activeEngine, setActiveEngine] = useState('native'); // 'gemini_api' or 'native'
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('tutovia_gemini_api_key') || '');
  const [showApiModal, setShowApiModal] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);

  // Comparison Tool
  const [compareList, setCompareList] = useState([]);

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

  // Filter Voices
  const filteredVoices = GEMINI_SAMPLE_VOICES.filter(voice => {
    const matchesSearch = voice.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          voice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          voice.tone.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          voice.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          voice.recommendedFor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' ||
                            (selectedCategory === 'HINGLISH' && voice.isHinglish) ||
                            (selectedCategory === 'GEMINI_OFFICIAL' && !voice.isHinglish);
    const matchesGender = selectedGender === 'ALL' || voice.gender === selectedGender;
    return matchesSearch && matchesCategory && matchesGender;
  });

  // Save Gemini API Key
  const handleSaveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem('tutovia_gemini_api_key', key);
    if (key.trim()) {
      setActiveEngine('gemini_api');
      addToast('Gemini API Key saved successfully!', 'success');
    } else {
      setActiveEngine('native');
      addToast('Switched to Distinct Web Audio & Speech Synth engine.', 'info');
    }
    setShowApiModal(false);
  };

  // Play Audio Synthesis with Distinct Vocal Profiles
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

    // MODE 1: Direct Gemini API Synthesis Endpoint
    if (activeEngine === 'gemini_api' && apiKey.trim()) {
      setLoadingAudio(true);
      try {
        const response = await axios.post('/api/gemini-tts/synthesize', {
          text: sampleText,
          voiceName: voiceToPlay.id.replace('Hinglish-', ''), // Map Hinglish-Puck -> Puck for Gemini API
          speakingRate: speakingRate,
          pitch: pitch,
          apiKey: apiKey.trim()
        });

        if (response.data?.audioContent) {
          const audioSrc = `data:audio/mp3;base64,${response.data.audioContent}`;
          const audio = new Audio(audioSrc);
          audioRef.current = audio;
          audio.volume = volume;

          audio.onended = () => {
            setIsPlaying(false);
            setPlaybackProgress(100);
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
          };

          await audio.play();
          setIsPlaying(true);
          setLoadingAudio(false);

          progressIntervalRef.current = setInterval(() => {
            if (audio.duration) {
              setPlaybackProgress((audio.currentTime / audio.duration) * 100);
            }
          }, 100);
          return;
        }
      } catch (err) {
        console.error('Gemini TTS API Call failed:', err);
        addToast('Gemini API call failed. Falling back to Distinct Voice Engine.', 'error');
        setActiveEngine('native');
      } finally {
        setLoadingAudio(false);
      }
    }

    // MODE 2: Browser Speech Synthesis with Distinct Pitch & Formant Profiles
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(sampleText);

      // Get distinct pitch and rate calculated specifically for this voice model
      const { pitch: distinctPitch, rate: distinctRate } = getDistinctUtteranceParams(
        voiceToPlay.id, 
        pitch, 
        speakingRate
      );

      utterance.pitch = distinctPitch;
      utterance.rate = distinctRate;
      utterance.volume = volume;

      // Select distinct browser voice (prioritizing Indian/Hinglish if voice is Hinglish)
      const matchedVoice = getDistinctBrowserVoice(voiceToPlay.id, voiceToPlay.isHinglish);
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

    addToast('Speech synthesis is not supported in this browser environment.', 'error');
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

  // Generate Gemini API JSON Request Body
  const generateGeminiJson = (voice, text) => {
    const apiVoiceId = voice.id.replace('Hinglish-', '');
    return JSON.stringify({
      contents: [
        {
          parts: [{ text: text }]
        }
      ],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: apiVoiceId
            }
          }
        }
      }
    }, null, 2);
  };

  const handleCopyJson = () => {
    const jsonText = generateGeminiJson(selectedVoice, sampleText);
    navigator.clipboard.writeText(jsonText);
    setCopiedJson(true);
    addToast('Gemini API JSON payload copied to clipboard!', 'success');
    setTimeout(() => setCopiedJson(false), 2500);
  };

  // Toggle Voice Pin for Comparison
  const toggleCompareVoice = (voice) => {
    if (compareList.some(v => v.id === voice.id)) {
      setCompareList(compareList.filter(v => v.id !== voice.id));
    } else {
      if (compareList.length >= 3) {
        addToast('You can compare maximum 3 voices side-by-side.', 'warning');
        return;
      }
      setCompareList([...compareList, voice]);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. HEADER HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-slate-900/50 p-6 md:p-8 border border-purple-500/30 shadow-2xl glass-panel">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 shadow-sm">
                <Globe className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                🇮🇳 Hinglish Suitable Voices Active
              </span>
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Gemini 2.0 Flash Audio TTS
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                1,500 Requests/Day FREE
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              Gemini & Hinglish TTS Voice Testing Studio
            </h1>
            <p className="text-slate-300 text-sm md:text-base max-w-3xl leading-relaxed">
              Test all prebuilt Gemini 2.0 Flash sample voices alongside dedicated <strong>Hinglish suitable voices</strong> for CA aspirants. Listen to natural Hinglish tax rules, accounting standards, and distinct vocal pitch profiles.
            </p>
          </div>

          <button
            onClick={() => setShowApiModal(true)}
            className="shrink-0 px-4 py-2.5 rounded-xl bg-surface-card hover:bg-surface border border-purple-500/40 text-purple-300 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            <Key className="w-4 h-4 text-amber-400" />
            <span>{apiKey ? 'Gemini Key Saved' : 'Set Gemini API Key'}</span>
            <span className={`w-2 h-2 rounded-full ${apiKey ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
          </button>
        </div>
      </div>

      {/* 2. PROMINENT HINGLISH VOICE FILTER BAR */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-purple-500/10 to-indigo-500/15 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-bold shrink-0">
            🇮🇳
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Hinglish Audio Studio Mode
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-extrabold border border-amber-500/40">Active</span>
            </h3>
            <p className="text-xs text-slate-300">Switch categories or filter voices specifically tuned for Hinglish study recaps.</p>
          </div>
        </div>

        {/* Big Prominent Category Filter Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setSelectedCategory('HINGLISH')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shadow-md ${
              selectedCategory === 'HINGLISH'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold ring-2 ring-amber-400/50 scale-105'
                : 'bg-surface-card hover:bg-surface text-amber-300 border border-amber-500/40'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>🇮🇳 Hinglish Suitable Voices ({GEMINI_SAMPLE_VOICES.filter(v => v.isHinglish).length})</span>
          </button>

          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === 'ALL'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-surface-card hover:bg-surface text-slate-300 border border-surface-border'
            }`}
          >
            All Voices ({GEMINI_SAMPLE_VOICES.length})
          </button>

          <button
            onClick={() => setSelectedCategory('GEMINI_OFFICIAL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === 'GEMINI_OFFICIAL'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-surface-card hover:bg-surface text-slate-300 border border-surface-border'
            }`}
          >
            Gemini Official ({GEMINI_SAMPLE_VOICES.filter(v => !v.isHinglish).length})
          </button>
        </div>
      </div>

      {/* 3. ACTIVE VOICE TESTER & AUDIO STUDIO PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Controls & Speech Studio (7 cols) */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 border border-surface-border space-y-6 shadow-xl">
          
          {/* Active Voice Info Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-surface-card/80 border border-surface-border gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-purple-500/20">
                <Mic className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-white text-lg">{selectedVoice.name}</h3>
                  {selectedVoice.isHinglish && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      🇮🇳 Hinglish Suitable
                    </span>
                  )}
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/40">
                    {selectedVoice.tone}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Voice ID: <code className="text-purple-300 bg-surface px-1.5 py-0.5 rounded font-mono text-[11px]">{selectedVoice.id}</code> • {selectedVoice.gender} • {selectedVoice.recommendedFor}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <span className="text-xs font-semibold text-slate-400">Naturalness:</span>
              <div className="flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs font-bold text-amber-300">{selectedVoice.naturalness} / 5.0</span>
              </div>
            </div>
          </div>

          {/* Engine Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              Speech Engine Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setActiveEngine('native')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  activeEngine === 'native'
                    ? 'bg-purple-600/20 border-purple-500 text-white shadow-md'
                    : 'bg-surface-card border-surface-border text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-xs sm:text-sm">
                  <span>Distinct Audio & Hinglish Engine</span>
                  {activeEngine === 'native' && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Uses distinct vocal pitch, rate offsets & Indian accents for instant play</p>
              </button>

              <button
                onClick={() => {
                  if (!apiKey) {
                    setShowApiModal(true);
                  } else {
                    setActiveEngine('gemini_api');
                  }
                }}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  activeEngine === 'gemini_api'
                    ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-md'
                    : 'bg-surface-card border-surface-border text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-xs sm:text-sm">
                  <span>Gemini 2.0 REST API</span>
                  {activeEngine === 'gemini_api' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Direct Gemini 2.0 Flash Audio output synthesis (Requires API Key)</p>
              </button>
            </div>
          </div>

          {/* Prompt Selector & Text Input */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-purple-400" />
                Sample Test Text ({sampleText.length} Chars)
              </label>

              {/* Sample Selector with Hinglish Highlight */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-amber-300">Phrases:</span>
                <select
                  onChange={(e) => setSampleText(e.target.value)}
                  value={sampleText}
                  className="bg-surface-card border border-surface-border text-xs text-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-purple-500 font-medium"
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
              placeholder="Type or paste any text or Hinglish phrase to test..."
            />
          </div>

          {/* Soundwave Visualizer & Playback Bar */}
          <div className="p-4 rounded-2xl bg-surface-card border border-surface-border space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => isPlaying ? handleStopVoice() : handlePlayVoice()}
                  disabled={loadingAudio}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold transition-all shadow-lg hover:scale-105 active:scale-95 ${
                    isPlaying 
                      ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/30' 
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-600/30'
                  }`}
                >
                  {loadingAudio ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-5 h-5 fill-white" />
                  ) : (
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  )}
                </button>

                <button
                  onClick={handleStopVoice}
                  disabled={!isPlaying}
                  className="w-10 h-10 rounded-xl bg-surface border border-surface-border flex items-center justify-center text-slate-400 hover:text-slate-100 disabled:opacity-40 transition-colors"
                  title="Stop Playback"
                >
                  <Square className="w-4 h-4 fill-current" />
                </button>

                <div>
                  <h4 className="text-xs font-bold text-white">
                    {isPlaying ? `Playing ${selectedVoice.name}...` : loadingAudio ? 'Synthesizing Audio via Gemini 2.0 Flash...' : 'Ready to Test Distinct Voice'}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Engine: <span className="text-purple-300 font-semibold">{activeEngine === 'gemini_api' ? 'Official Gemini 2.0 Flash REST API' : 'Distinct Voice Synthesis Engine'}</span>
                  </p>
                </div>
              </div>

              {/* Soundwave Animation Bars */}
              <div className="flex items-center gap-1 h-8 px-2">
                {[40, 75, 100, 60, 90, 45, 80, 50, 95, 30].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: isPlaying ? `${h}%` : '20%' }}
                    className={`w-1 rounded-full transition-all duration-300 ${
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

          {/* Voice Parameter Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            
            {/* Speaking Rate */}
            <div className="p-3 rounded-2xl bg-surface-card/60 border border-surface-border space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">Speaking Rate</span>
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

            {/* Pitch Adjustment */}
            <div className="p-3 rounded-2xl bg-surface-card/60 border border-surface-border space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 font-bold">Voice Pitch</span>
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

            {/* Volume */}
            <div className="p-3 rounded-2xl bg-surface-card/60 border border-surface-border space-y-2">
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

          {/* Gemini API JSON Payload Generator Drawer */}
          <div className="border-t border-surface-border pt-4">
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => setShowJson(!showJson)}
                className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1.5"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{showJson ? 'Hide Gemini API Request Payload' : 'View Gemini API JSON Request Format'}</span>
              </button>

              <button
                onClick={handleCopyJson}
                className="px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs font-semibold flex items-center gap-1 border border-purple-500/30 transition-colors"
              >
                {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedJson ? 'Copied JSON!' : 'Copy JSON'}</span>
              </button>
            </div>

            {showJson && (
              <pre className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-purple-200 text-xs font-mono overflow-x-auto leading-relaxed">
                {generateGeminiJson(selectedVoice, sampleText)}
              </pre>
            )}
          </div>

        </div>

        {/* Right Column: Gemini Free Tier Info & Voice Comparison (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Gemini Free Tier Info Card */}
          <div className="glass-panel rounded-3xl p-6 border border-emerald-500/30 space-y-4 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-300 border border-emerald-500/30">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Gemini API Free Tier Allowance</h3>
                <p className="text-xs text-slate-400">Google Gemini 2.0 Flash Model Quotas</p>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <div className="p-3 rounded-2xl bg-surface-card border border-surface-border flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-300">Daily Free Quota</span>
                  <p className="text-[11px] text-slate-400">1,500 Requests per Day (RPD)</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-emerald-300">1,500 RPD</span>
                  <p className="text-[10px] text-emerald-400 font-semibold">100% Free</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-surface-card border border-surface-border flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-300">Rate Limit</span>
                  <p className="text-[11px] text-slate-400">15 Requests per Minute (RPM)</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-purple-300">15 RPM</span>
                  <p className="text-[10px] text-purple-400 font-semibold">Instant Play</p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200 leading-relaxed flex items-start gap-2">
              <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span>
                <strong>Zero Billing Required:</strong> Gemini API provides generous free tier rate limits that allow full TTS voice generation for study guides completely free of charge.
              </span>
            </div>
          </div>

          {/* Voice Pin & Comparison Tool */}
          <div className="glass-panel rounded-3xl p-6 border border-surface-border space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-white text-base">Gemini Voice Comparison Tray</h3>
              </div>
              <span className="text-xs text-slate-400 font-semibold">{compareList.length} / 3 Pinned</span>
            </div>

            {compareList.length === 0 ? (
              <div className="p-6 rounded-2xl border border-dashed border-slate-700 text-center space-y-2">
                <Radio className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-xs text-slate-400">No Gemini voices pinned for comparison yet.</p>
                <p className="text-[11px] text-slate-500">Click "Compare" on any voice card below to pin and compare tones!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {compareList.map(voice => (
                  <div key={voice.id} className="p-3 rounded-2xl bg-surface-card border border-surface-border flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        {voice.name}
                        {voice.isHinglish && <span className="text-[10px] text-amber-400">🇮🇳 Hinglish</span>}
                      </h4>
                      <p className="text-[10px] text-slate-400">{voice.tone} • {voice.gender}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePlayVoice(voice)}
                        className="px-2.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1 shadow transition-transform hover:scale-105"
                      >
                        <Play className="w-3 h-3 fill-current" /> Play
                      </button>
                      <button
                        onClick={() => toggleCompareVoice(voice)}
                        className="text-xs text-rose-400 hover:text-rose-300 font-bold px-1.5"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* 4. VOICE CATALOG GRID SECTION */}
      <div className="glass-panel rounded-3xl p-6 border border-surface-border space-y-6 shadow-xl">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-surface-border">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-purple-400" />
              Voice Catalog ({filteredVoices.length} Voices Available)
            </h2>
            <p className="text-xs text-slate-400 mt-1">Browse, filter, and test all prebuilt Gemini voices and Indian Hinglish suitable voices.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1 bg-surface-card border border-surface-border p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setSelectedCategory('HINGLISH')}
                className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  selectedCategory === 'HINGLISH'
                    ? 'bg-amber-500 text-slate-950 font-extrabold shadow'
                    : 'text-amber-400 hover:text-amber-300'
                }`}
              >
                <span>🇮🇳 Hinglish Suitable</span>
              </button>
              <button
                onClick={() => setSelectedCategory('ALL')}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  selectedCategory === 'ALL' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                All Voices
              </button>
              <button
                onClick={() => setSelectedCategory('GEMINI_OFFICIAL')}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  selectedCategory === 'GEMINI_OFFICIAL' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Gemini Official
              </button>
            </div>

            {/* Search Box */}
            <div className="relative w-full sm:w-56">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Puck, Kore, Hinglish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface-card border border-surface-border text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            {/* Gender Filter Dropdown */}
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="bg-surface-card border border-surface-border text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500 font-semibold"
            >
              <option value="ALL">All Genders</option>
              <option value="FEMALE">Female Voices</option>
              <option value="MALE">Male Voices</option>
            </select>
          </div>
        </div>

        {/* Voices Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredVoices.map((voice) => {
            const isSelected = selectedVoice.id === voice.id;
            const isPinned = compareList.some(v => v.id === voice.id);
            return (
              <div
                key={voice.id}
                onClick={() => setSelectedVoice(voice)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer relative group flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-br from-purple-900/40 via-surface-card to-indigo-900/30 border-purple-500 shadow-xl ring-1 ring-purple-500/50'
                    : 'bg-surface-card/70 hover:bg-surface-card border-surface-border hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {voice.tone}
                        </span>
                        {voice.isHinglish && (
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            🇮🇳 Hinglish
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-white text-lg leading-snug group-hover:text-purple-300 transition-colors">
                        {voice.name}
                      </h4>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCompareVoice(voice);
                      }}
                      className={`p-1.5 rounded-lg border text-[11px] font-bold transition-all ${
                        isPinned
                          ? 'bg-purple-600 border-purple-500 text-white'
                          : 'bg-surface border-surface-border text-slate-400 hover:text-white'
                      }`}
                      title={isPinned ? 'Pinned for Comparison' : 'Pin to Compare'}
                    >
                      {isPinned ? 'Pinned' : 'Compare'}
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    {voice.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-surface-border/60 flex items-center justify-between text-xs">
                  <div className="text-slate-400">
                    <span className="font-semibold text-slate-200">{voice.gender}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedVoice(voice);
                      handlePlayVoice(voice);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600 border border-purple-500/40 text-purple-300 hover:text-white font-bold flex items-center gap-1.5 transition-all shadow"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Test Voice</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* 5. GEMINI API KEY MODAL */}
      {showApiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in">
          <div className="glass-panel rounded-3xl p-6 border border-surface-border max-w-lg w-full space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-lg">Gemini API Key Settings</h3>
              </div>
              <button onClick={() => setShowApiModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Enter your Gemini API Key (from Google AI Studio) to synthesize voices directly via Gemini 2.0 Flash REST API. Your key is stored securely in local browser storage only.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Gemini API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full p-3 rounded-2xl bg-surface-card border border-surface-border text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => handleSaveApiKey('')}
                className="text-xs font-semibold text-rose-400 hover:text-rose-300"
              >
                Clear API Key
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowApiModal(false)}
                  className="px-4 py-2 rounded-xl bg-surface-card hover:bg-surface border border-surface-border text-xs text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSaveApiKey(apiKey)}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow-lg"
                >
                  Save & Enable Gemini REST API
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
