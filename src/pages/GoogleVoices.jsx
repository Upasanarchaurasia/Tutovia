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
  ChevronRight,
  Radio,
  FileText,
  RotateCcw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  GOOGLE_VOICE_TIERS, 
  SAMPLE_PROMPTS, 
  GOOGLE_SAMPLE_VOICES 
} from '../data/googleVoicesData.js';
import { useToast } from '../context/ToastContext.jsx';
import axios from '../api.js';

export default function GoogleVoices() {
  const { addToast } = useToast();

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState('ALL');
  const [selectedLocale, setSelectedLocale] = useState('ALL');
  const [selectedGender, setSelectedGender] = useState('ALL');

  // Selected Voice & Controls
  const [selectedVoice, setSelectedVoice] = useState(GOOGLE_SAMPLE_VOICES[0]);
  const [sampleText, setSampleText] = useState(SAMPLE_PROMPTS[0].text);
  const [speakingRate, setSpeakingRate] = useState(1.0);
  const [pitch, setPitch] = useState(0.0);
  const [volume, setVolume] = useState(1.0);
  const [showSsml, setShowSsml] = useState(false);
  const [copiedSsml, setCopiedSsml] = useState(false);

  // Playback & Engine States
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [activeEngine, setActiveEngine] = useState('native'); // 'native', 'cloud_api', or 'synth'
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('tutovia_google_tts_api_key') || '');
  const [showApiModal, setShowApiModal] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);

  // Comparison Tool
  const [compareList, setCompareList] = useState([]);
  const [isComparing, setIsComparing] = useState(false);

  // Native Browser Voices
  const [browserVoices, setBrowserVoices] = useState([]);
  const audioRef = useRef(null);
  const progressIntervalRef = useRef(null);

  // Initialize Web Speech API Voices
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setBrowserVoices(voices);
      };
      loadVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);

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
  const filteredVoices = GOOGLE_SAMPLE_VOICES.filter(voice => {
    const matchesSearch = voice.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          voice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          voice.languageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          voice.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = selectedTier === 'ALL' || voice.tier === selectedTier;
    const matchesLocale = selectedLocale === 'ALL' || voice.languageCode === selectedLocale;
    const matchesGender = selectedGender === 'ALL' || voice.ssmlGender === selectedGender;
    return matchesSearch && matchesTier && matchesLocale && matchesGender;
  });

  // Save API Key
  const handleSaveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem('tutovia_google_tts_api_key', key);
    if (key.trim()) {
      setActiveEngine('cloud_api');
      addToast('Google Cloud API Key saved successfully!', 'success');
    } else {
      setActiveEngine('native');
      addToast('Switched to Native Browser Web Speech engine.', 'info');
    }
    setShowApiModal(false);
  };

  // Play Audio Synthesis
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

    // MODE 1: Direct Google Cloud REST API (If API Key provided)
    if (activeEngine === 'cloud_api' && apiKey.trim()) {
      setLoadingAudio(true);
      try {
        const response = await axios.post('/api/google-tts/synthesize', {
          text: sampleText,
          voiceName: voiceToPlay.id,
          languageCode: voiceToPlay.languageCode,
          ssmlGender: voiceToPlay.ssmlGender,
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
        console.error('Cloud TTS API Call failed:', err);
        addToast('Cloud API call failed. Falling back to Browser Native engine.', 'error');
        setActiveEngine('native');
      } finally {
        setLoadingAudio(false);
      }
    }

    // MODE 2: Web Speech API (Chrome Native Google Voices)
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(sampleText);
      utterance.rate = speakingRate;
      // Convert pitch from semitones (-20 to +20) to WebSpeech pitch (0.5 to 1.5)
      utterance.pitch = Math.max(0.5, Math.min(1.5, 1.0 + (pitch / 20)));
      utterance.volume = volume;

      // Try matching native browser voices
      const voices = window.speechSynthesis.getVoices();
      let matchedVoice = null;

      if (voiceToPlay.nativeBrowserMatch && voiceToPlay.nativeBrowserMatch.length > 0) {
        matchedVoice = voices.find(v => 
          voiceToPlay.nativeBrowserMatch.some(m => v.name.includes(m) || v.lang.includes(m))
        );
      }

      if (!matchedVoice) {
        matchedVoice = voices.find(v => v.lang.startsWith(voiceToPlay.languageCode)) || voices[0];
      }

      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onstart = () => {
        setIsPlaying(true);
        // Estimate progress duration
        const estimatedDurationSec = (sampleText.length / 15) / speakingRate;
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

  // SSML Code Generator
  const generateSsml = (voice, text) => {
    return `<speak>
  <voice name="${voice.id}" gender="${voice.ssmlGender}" language="${voice.languageCode}">
    <prosody rate="${speakingRate}x" pitch="${pitch > 0 ? '+' : ''}${pitch}st" volume="${Math.round(volume * 100)}%">
      ${text}
    </prosody>
  </voice>
</speak>`;
  };

  const handleCopySsml = () => {
    const ssmlText = generateSsml(selectedVoice, sampleText);
    navigator.clipboard.writeText(ssmlText);
    setCopiedSsml(true);
    addToast('Google Cloud SSML markup copied to clipboard!', 'success');
    setTimeout(() => setCopiedSsml(false), 2500);
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

  // Calculate Free Tier Usage Estimation
  const charCount = sampleText.length;
  const standardFreeRuns = Math.floor(4000000 / (charCount || 1));
  const wavenetFreeRuns = Math.floor(1000000 / (charCount || 1));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. HEADER HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900/50 p-6 md:p-8 border border-indigo-500/30 shadow-2xl glass-panel">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-bold flex items-center gap-1.5">
                <Cloud className="w-3.5 h-3.5" />
                Google Cloud Text-to-Speech
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                4M Chars/mo FREE (Standard)
              </span>
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-bold">
                1M Chars/mo FREE (WaveNet/Neural2)
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              Google Cloud Sample Voices Tester
            </h1>
            <p className="text-slate-300 text-sm md:text-base max-w-3xl leading-relaxed">
              Explore and test all sample voices available in the free tier of Google Cloud Text-to-Speech. Listen to natural neural voices, adjust speed & pitch, compare tones, and copy production SSML markup for Tutovia study guides.
            </p>
          </div>

          <button
            onClick={() => setShowApiModal(true)}
            className="shrink-0 px-4 py-2.5 rounded-xl bg-surface-card hover:bg-surface border border-indigo-500/40 text-indigo-300 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            <Key className="w-4 h-4 text-amber-400" />
            <span>{apiKey ? 'API Key Configured' : 'Configure Google API Key'}</span>
            <span className={`w-2 h-2 rounded-full ${apiKey ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
          </button>
        </div>
      </div>

      {/* 2. ACTIVE VOICE TESTER & AUDIO STUDIO PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Controls & Speech Studio (7 cols) */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 border border-surface-border space-y-6 shadow-xl">
          
          {/* Active Voice Info Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-surface-card/80 border border-surface-border gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/20">
                <Mic className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-white text-lg">{selectedVoice.name}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                    selectedVoice.tier === 'STANDARD' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' :
                    selectedVoice.tier === 'WAVENET' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                    selectedVoice.tier === 'NEURAL2' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' :
                    'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {selectedVoice.tier}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  ID: <code className="text-indigo-300 bg-surface px-1.5 py-0.5 rounded font-mono text-[11px]">{selectedVoice.id}</code> • {selectedVoice.languageName} • {selectedVoice.ssmlGender}
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
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              Speech Engine Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setActiveEngine('native')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  activeEngine === 'native'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                    : 'bg-surface-card border-surface-border text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-xs sm:text-sm">
                  <span>Browser Web Speech API</span>
                  {activeEngine === 'native' && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Uses Chrome's native Google Cloud TTS voices (Zero API cost)</p>
              </button>

              <button
                onClick={() => {
                  if (!apiKey) {
                    setShowApiModal(true);
                  } else {
                    setActiveEngine('cloud_api');
                  }
                }}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  activeEngine === 'cloud_api'
                    ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-md'
                    : 'bg-surface-card border-surface-border text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-xs sm:text-sm">
                  <span>Google Cloud REST API</span>
                  {activeEngine === 'cloud_api' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Direct Google Cloud TTS endpoint synthesis (Requires API Key)</p>
              </button>
            </div>
          </div>

          {/* Prompt Selector & Text Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                Sample Test Text ({sampleText.length} Chars)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">Quick Samples:</span>
                <select
                  onChange={(e) => setSampleText(e.target.value)}
                  className="bg-surface-card border border-surface-border text-xs text-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {SAMPLE_PROMPTS.map((p, idx) => (
                    <option key={idx} value={p.text}>{p.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <textarea
              rows={4}
              value={sampleText}
              onChange={(e) => setSampleText(e.target.value)}
              className="w-full p-4 rounded-2xl bg-surface-card border border-surface-border text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 leading-relaxed placeholder:text-slate-500 transition-all"
              placeholder="Type or paste any text to test Google Cloud TTS voices..."
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
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-600/30'
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
                    {isPlaying ? 'Playing Sample Voice Audio...' : loadingAudio ? 'Synthesizing Audio via Google Cloud...' : 'Ready to Test'}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Engine: <span className="text-indigo-300 font-semibold">{activeEngine === 'cloud_api' ? 'Official Google Cloud API' : 'Browser Web Speech'}</span>
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
                      isPlaying ? 'bg-indigo-400 animate-pulse' : 'bg-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-100" 
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
                <span className="font-mono text-indigo-300 font-bold">{speakingRate}x</span>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="2.0" 
                step="0.05"
                value={speakingRate}
                onChange={(e) => setSpeakingRate(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
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
                <span className="font-semibold text-slate-300">Pitch Adjustment</span>
                <span className="font-mono text-purple-300 font-bold">{pitch > 0 ? `+${pitch}` : pitch} st</span>
              </div>
              <input 
                type="range" 
                min="-10" 
                max="10" 
                step="1"
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
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
                <span className="font-semibold text-slate-300">Audio Volume</span>
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

          {/* SSML Markup Generator Drawer */}
          <div className="border-t border-surface-border pt-4">
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => setShowSsml(!showSsml)}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{showSsml ? 'Hide Google SSML Markup' : 'View Google SSML Code Snippet'}</span>
              </button>

              <button
                onClick={handleCopySsml}
                className="px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-semibold flex items-center gap-1 border border-indigo-500/30 transition-colors"
              >
                {copiedSsml ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSsml ? 'Copied SSML!' : 'Copy SSML'}</span>
              </button>
            </div>

            {showSsml && (
              <pre className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-indigo-200 text-xs font-mono overflow-x-auto leading-relaxed">
                {generateSsml(selectedVoice, sampleText)}
              </pre>
            )}
          </div>

        </div>

        {/* Right Column: Free Tier Quota Calculator & Voice Comparison (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Free Tier Quota Estimator Card */}
          <div className="glass-panel rounded-3xl p-6 border border-emerald-500/30 space-y-4 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-300 border border-emerald-500/30">
                <Cloud className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Google Cloud Free Tier Calculator</h3>
                <p className="text-xs text-slate-400">Monthly quota allowance analysis</p>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <div className="p-3 rounded-2xl bg-surface-card border border-surface-border flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-300">Standard Voice Tier</span>
                  <p className="text-[11px] text-slate-400">4,000,000 chars/month FREE</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-indigo-300">{standardFreeRuns.toLocaleString()} runs</span>
                  <p className="text-[10px] text-emerald-400 font-semibold">100% Free</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-surface-card border border-surface-border flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-300">WaveNet & Neural2 Tier</span>
                  <p className="text-[11px] text-slate-400">1,000,000 chars/month FREE</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-emerald-300">{wavenetFreeRuns.toLocaleString()} runs</span>
                  <p className="text-[10px] text-emerald-400 font-semibold">100% Free</p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200 leading-relaxed flex items-start gap-2">
              <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <span>
                <strong>Zero Cost Guarantee:</strong> Every Google Cloud account receives automatic free monthly quotas that reset on the 1st of each month.
              </span>
            </div>
          </div>

          {/* Voice Pin & Comparison Tool */}
          <div className="glass-panel rounded-3xl p-6 border border-surface-border space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <h3 className="font-bold text-white text-base">Voice Comparison Tray</h3>
              </div>
              <span className="text-xs text-slate-400 font-semibold">{compareList.length} / 3 Pinned</span>
            </div>

            {compareList.length === 0 ? (
              <div className="p-6 rounded-2xl border border-dashed border-slate-700 text-center space-y-2">
                <Radio className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-xs text-slate-400">No voices pinned for comparison yet.</p>
                <p className="text-[11px] text-slate-500">Check "Compare" on voice cards below to listen side-by-side!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {compareList.map(voice => (
                  <div key={voice.id} className="p-3 rounded-2xl bg-surface-card border border-surface-border flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">{voice.name}</h4>
                      <p className="text-[10px] text-slate-400">{voice.languageName} • {voice.ssmlGender} • {voice.tier}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePlayVoice(voice)}
                        className="px-2.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1 shadow transition-transform hover:scale-105"
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

      {/* 3. VOICE CATALOG SEARCH & FILTER SECTION */}
      <div className="glass-panel rounded-3xl p-6 border border-surface-border space-y-6 shadow-xl">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-surface-border">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-indigo-400" />
              Google Cloud Voice Catalog ({filteredVoices.length} Voices Available)
            </h2>
            <p className="text-xs text-slate-400 mt-1">Browse, filter, and test all sample voices in the Google Cloud TTS Free Tier.</p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search voices, accents, IDs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface-card border border-surface-border text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          {/* Tier Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {Object.keys(GOOGLE_VOICE_TIERS).map(tierKey => {
              const tierInfo = GOOGLE_VOICE_TIERS[tierKey];
              const isActive = selectedTier === tierKey;
              return (
                <button
                  key={tierKey}
                  onClick={() => setSelectedTier(tierKey)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                      : 'bg-surface-card hover:bg-surface text-slate-400 hover:text-slate-200 border border-surface-border'
                  }`}
                >
                  {tierInfo.name}
                </button>
              );
            })}
          </div>

          {/* Dropdown Filters */}
          <div className="flex items-center gap-3">
            {/* Locale Dropdown */}
            <select
              value={selectedLocale}
              onChange={(e) => setSelectedLocale(e.target.value)}
              className="bg-surface-card border border-surface-border text-xs text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
            >
              <option value="ALL">All Languages & Accents</option>
              <option value="en-US">English (US)</option>
              <option value="en-IN">English (India)</option>
              <option value="hi-IN">Hindi (India)</option>
              <option value="en-GB">English (UK)</option>
            </select>

            {/* Gender Dropdown */}
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="bg-surface-card border border-surface-border text-xs text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
            >
              <option value="ALL">All Genders</option>
              <option value="FEMALE">Female Voices</option>
              <option value="MALE">Male Voices</option>
            </select>
          </div>

        </div>

        {/* Voices Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVoices.map((voice) => {
            const isSelected = selectedVoice.id === voice.id;
            const isPinned = compareList.some(v => v.id === voice.id);
            return (
              <div
                key={voice.id}
                onClick={() => setSelectedVoice(voice)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer relative group flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-br from-indigo-900/40 via-surface-card to-purple-900/30 border-indigo-500 shadow-xl ring-1 ring-indigo-500/50'
                    : 'bg-surface-card/70 hover:bg-surface-card border-surface-border hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-1 ${
                        voice.tier === 'STANDARD' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                        voice.tier === 'WAVENET' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        voice.tier === 'NEURAL2' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                        'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {voice.tier}
                      </span>
                      <h4 className="font-bold text-white text-base leading-snug group-hover:text-indigo-300 transition-colors">
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

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                    {voice.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-surface-border/60 flex items-center justify-between text-xs">
                  <div className="text-slate-400">
                    <span className="font-semibold text-slate-200">{voice.languageName}</span> • {voice.ssmlGender}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedVoice(voice);
                      handlePlayVoice(voice);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/40 text-indigo-300 hover:text-white font-bold flex items-center gap-1.5 transition-all shadow"
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

      {/* 4. GOOGLE CLOUD API KEY MODAL */}
      {showApiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in">
          <div className="glass-panel rounded-3xl p-6 border border-surface-border max-w-lg w-full space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-lg">Google Cloud API Key Settings</h3>
              </div>
              <button onClick={() => setShowApiModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Enter your official Google Cloud Text-to-Speech API Key to synthesize voices directly via Google Cloud REST API. Your key is stored securely in local browser storage only.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Google Cloud API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full p-3 rounded-2xl bg-surface-card border border-surface-border text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg"
                >
                  Save & Enable REST API
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
