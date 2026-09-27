import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  Bot, Send, Sparkles, RefreshCw, BookOpen, Lightbulb, CheckCircle2, 
  Mic, MicOff, Image as ImageIcon, Brain, ArrowLeft, Copy, Check,
  Target, HelpCircle, Layers, Compass, Smartphone, Zap, AlertCircle
} from 'lucide-react';
import axios from '../api.js';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

export default function TutorPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { activePhase, currentPhaseInfo } = useTheme();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [errorState, setErrorState] = useState(null);
  const [lastFailedQuery, setLastFailedQuery] = useState(null);
  const [isLimitReached, setIsLimitReached] = useState(false);
  
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const inputRef = useRef(null);

  // Suggested prompt categories
  const promptCategories = [
    {
      id: 'concept',
      icon: Lightbulb,
      title: 'Explain a concept',
      color: 'text-amber-400',
      bg: 'hover:border-amber-500/40 hover:bg-amber-500/5',
      badge: 'Concept',
      prompt: 'Explain AS 10 Component Accounting simply and why it is mandatory for CA Inter.'
    },
    {
      id: 'solve',
      icon: Target,
      title: 'Solve a question',
      color: 'text-sky-400',
      bg: 'hover:border-sky-500/40 hover:bg-sky-500/5',
      badge: 'Problem Solving',
      prompt: 'Guide me step-by-step through calculating P/V ratio and Break-Even Point from given sales and profit.'
    },
    {
      id: 'quiz',
      icon: HelpCircle,
      title: 'Quiz me',
      color: 'text-emerald-400',
      bg: 'hover:border-emerald-500/40 hover:bg-emerald-500/5',
      badge: 'Active Recall',
      prompt: 'Quiz me on Section 135 (CSR Rules) of Companies Act 2013 with 3 practical MCQs. Ask one at a time.'
    },
    {
      id: 'revise',
      icon: Layers,
      title: 'Help me revise',
      color: 'text-purple-400',
      bg: 'hover:border-purple-500/40 hover:bg-purple-500/5',
      badge: 'Fast Revision',
      prompt: 'Give me a crisp 5-minute high-yield revision of GST Input Tax Credit (ITC) eligibility under Section 16.'
    }
  ];

  // Quick subject pills
  const subjectPills = [
    { label: 'Adv. Accounting', prompt: 'What are the key criteria for capitalization under AS 10 (PPE)?' },
    { label: 'Corporate Laws', prompt: 'Explain the disqualifications of an auditor under Section 141(3) with exam traps.' },
    { label: 'Taxation (GST & DT)', prompt: 'Explain Section 54 Capital Gains exemption conditions simply.' },
    { label: 'Costing', prompt: 'What is the logic behind Activity Based Costing vs Traditional Absorption?' },
    { label: 'Auditing & Ethics', prompt: 'Difference between Qualified Opinion and Adverse Opinion under SA 705?' },
    { label: 'FM & SM', prompt: 'How do we calculate Weighted Average Cost of Capital (WACC) using market values?' }
  ];

  // Handle URL query parameter ?prompt=
  useEffect(() => {
    const urlPrompt = searchParams.get('prompt');
    if (urlPrompt && messages.length === 0) {
      handleSend(urlPrompt);
    }
  }, [searchParams]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Voice recognition support
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice input is not supported in this browser. Please try Google Chrome or Edge.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => (prev ? `${prev} ` : '') + transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSend = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    setErrorState(null);
    setLastFailedQuery(null);

    const userMsg = {
      sender: 'user',
      text: query,
      image: selectedImage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    if (!textToSend) setInput('');
    setSelectedImage(null);
    setLoading(true);

    try {
      const res = await axios.post('/api/tutor/chat', {
        messages: updatedMessages,
        isPublicPreview: !user,
        userContext: {
          name: user?.name,
          ca_stage: profile?.ca_stage || 'intermediate',
          ca_group: profile?.ca_group || 'Both Groups',
          attempt: profile?.attempt || 'January 2027'
        }
      });

      if (res.data?.isLimitReached) {
        setIsLimitReached(true);
      }

      const botMsg = {
        sender: 'bot',
        text: res.data?.reply || "I've reviewed your question. Let's explore the core concept together.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Tutor chat request error:', err);
      const isRateLimit = err.response?.status === 429;
      if (isRateLimit) {
        setIsLimitReached(true);
      }
      setErrorState(isRateLimit 
        ? "You've reached the free website preview limit. Open the Tutovia App for unlimited sessions!" 
        : "A momentary network delay interrupted the response. Please retry.");
      setLastFailedQuery(query);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastFailedQuery) {
      handleSend(lastFailedQuery);
    }
  };

  const userExchangeCount = messages.filter(m => m.sender === 'user').length;

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-surface-border bg-surface/90 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-surface-card border border-transparent hover:border-surface-border transition-all"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-bold text-base sm:text-lg text-white">Tutovia AI Tutor</h1>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  CA Intermediate
                </span>
              </div>
              <p className="text-xs text-slate-400">Your study companion for the CA journey.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={() => {
                setMessages([]);
                setErrorState(null);
              }}
              className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-surface-card border border-surface-border transition-colors flex items-center gap-1.5"
              title="Start New Topic"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Topic</span>
            </button>
          )}

          {!user && (
            <Link 
              to="/login"
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Get the App</span>
            </Link>
          )}
        </div>
      </header>

      {/* Main Chat Viewport */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 flex flex-col">
        
        {/* Welcome Screen (Zero State) */}
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col justify-center items-center text-center my-auto py-8">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400 shadow-xl shadow-indigo-500/5">
              <Brain className="w-8 h-8" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-heading font-black text-white mb-2">
              Hi! I'm your Tutovia AI Tutor 👋
            </h2>
            <p className="text-sm sm:text-base text-slate-300 font-medium max-w-md mb-8">
              What are you working on today? Ask a question, share a problem, or ask for a concept breakdown.
            </p>

            {/* 4 Mode Suggested Prompts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full max-w-2xl mb-8">
              {promptCategories.map(cat => {
                const IconComponent = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleSend(cat.prompt)}
                    className={`p-4 rounded-2xl bg-surface-card border border-surface-border text-left transition-all duration-200 group ${cat.bg}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <IconComponent className={`w-4 h-4 ${cat.color}`} />
                        <span className="font-heading font-bold text-sm text-slate-200 group-hover:text-white">
                          {cat.title}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-2 py-0.5 rounded-md bg-surface border border-surface-border">
                        {cat.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 group-hover:text-slate-300 line-clamp-2 leading-relaxed">
                      "{cat.prompt}"
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Subject Shortcuts */}
            <div className="w-full max-w-2xl">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-indigo-400" />
                <span>Or explore subjects directly:</span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {subjectPills.map((sub, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(sub.prompt)}
                    className="text-xs px-3 py-1.5 rounded-full bg-surface-card hover:bg-surface border border-surface-border hover:border-indigo-500/40 text-slate-300 hover:text-white transition-all text-left"
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Message Thread */}
        {messages.length > 0 && (
          <div className="flex-1 space-y-6 pb-6">
            {messages.map((msg, index) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={index}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[90%] sm:max-w-[82%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    
                    {/* Avatar Icon */}
                    <div className="shrink-0 mt-1">
                      {isUser ? (
                        <div className="w-8 h-8 rounded-xl bg-indigo-600 border border-indigo-400/40 flex items-center justify-center text-xs font-bold text-white shadow-md shadow-indigo-600/20">
                          {user?.name?.[0]?.toUpperCase() || 'CA'}
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                          <Bot className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    {/* Bubble Content */}
                    <div className="flex-1">
                      <div className={`p-4 sm:p-5 rounded-2xl shadow-lg transition-all ${
                        isUser 
                          ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-600/10' 
                          : 'bg-surface-card border border-surface-border text-slate-100 rounded-tl-none shadow-xl'
                      }`}>
                        
                        {/* Header for Bot Message */}
                        {!isUser && (
                          <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-surface-border/60">
                            <div className="flex items-center gap-1.5">
                              <Brain className="w-3.5 h-3.5 text-indigo-400" />
                              <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                                Tutovia Study Companion
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {msg.timestamp}
                            </span>
                          </div>
                        )}

                        {/* Image Attachment (if any) */}
                        {msg.image && (
                          <img 
                            src={msg.image} 
                            alt="Student question attachment" 
                            className="max-w-full rounded-xl mb-3 border border-surface-border shadow-sm max-h-72 object-contain"
                          />
                        )}

                        {/* Markdown / Message text */}
                        <div className="text-sm font-sans leading-relaxed markdown-content space-y-2">
                          <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>

                        {/* Message Toolbar for Bot */}
                        {!isUser && (
                          <div className="mt-3 pt-2.5 border-t border-surface-border/40 flex items-center justify-between text-xs text-slate-400">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleCopy(msg.text, index)}
                                className="flex items-center gap-1 hover:text-slate-200 transition-colors py-1 px-2 rounded-lg hover:bg-surface"
                                title="Copy note"
                              >
                                {copiedIndex === index ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    <span className="text-emerald-400 text-[11px]">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span className="text-[11px]">Copy</span>
                                  </>
                                )}
                              </button>
                            </div>
                            <span className="text-[10px] text-slate-400">
                              CA Intermediate Concept
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-3 max-w-[80%] items-start">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400 mt-1">
                    <Bot className="w-4 h-4 animate-bounce" />
                  </div>
                  <div className="bg-surface-card border border-surface-border p-4 rounded-2xl rounded-tl-none shadow-xl flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                      <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse delay-100" />
                      <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse delay-200" />
                    </div>
                    <span className="text-xs text-slate-300 font-medium">
                      Tutovia is thinking and preparing your explanation...
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Error & Retry Banner */}
            {errorState && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-rose-300 text-xs">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorState}</span>
                </div>
                {lastFailedQuery && !isLimitReached && (
                  <button
                    onClick={handleRetry}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold transition-all shrink-0 flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Retry Question</span>
                  </button>
                )}
              </div>
            )}

            {/* Natural App Conversion Banner (Shown after student has engaged or hit limit) */}
            {(userExchangeCount >= 3 || isLimitReached) && (
              <div className="my-6 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-indigo-900/30 via-purple-900/20 to-slate-900/40 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 max-w-xl">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" /> Enjoying your study session?
                    </span>
                    <h3 className="font-heading font-black text-base sm:text-lg text-white">
                      This is just a glimpse of Tutovia.
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      In the full app, your tutor becomes part of your complete learning journey — with personalized planning, progress tracking, recommendations, reminders, memory and more.
                    </p>
                  </div>

                  <Link
                    to="/login"
                    className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm transition-all shadow-xl shadow-indigo-600/30 flex items-center gap-2 shrink-0 group"
                  >
                    <span>Continue Your Journey in the Tutovia App</span>
                    <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}

      </main>

      {/* Sticky Bottom Input Bar */}
      <footer className="sticky bottom-0 z-30 border-t border-surface-border bg-surface/95 backdrop-blur-md p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Quick Context Follow-ups when messages exist */}
          {messages.length > 0 && !loading && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-3 scrollbar-none text-xs">
              <span className="text-[11px] text-slate-400 font-semibold shrink-0 mr-1">Follow up:</span>
              {[
                'Can you give me an example?',
                'Explain why in simpler terms',
                'Quiz me on this topic',
                'What is the exam trap here?'
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(chip)}
                  className="px-2.5 py-1 rounded-full bg-surface-card hover:bg-surface border border-surface-border text-slate-300 hover:text-white transition-all shrink-0 text-[11px]"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 sm:gap-3"
          >
            {/* Preview of Attached Image */}
            {selectedImage && (
              <div className="absolute bottom-20 left-4 sm:left-auto p-2 bg-surface-card border border-surface-border rounded-xl shadow-2xl flex items-center gap-2">
                <img src={selectedImage} alt="Uploaded problem" className="h-14 w-14 object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-colors"
                  title="Remove image"
                >
                  &times;
                </button>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-3 rounded-2xl bg-surface-card border border-surface-border text-slate-400 hover:text-indigo-400 hover:border-indigo-500/40 transition-colors shrink-0"
              title="Attach question image"
            >
              <ImageIcon className="w-5 h-5" />
            </button>

            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  isListening 
                    ? '🎙️ Listening to your question...' 
                    : messages.length === 0 
                    ? 'Ask anything (e.g. "Explain AS 10", "Solve this costing problem", "Quiz me on Audit")...' 
                    : 'Ask a follow-up or next doubt...'
                }
                disabled={loading || isLimitReached}
                className={`w-full bg-surface-card border rounded-2xl px-4 sm:px-5 py-3.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none transition-all ${
                  isListening 
                    ? 'border-rose-500 ring-2 ring-rose-500/20 animate-pulse' 
                    : 'border-surface-border focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                } disabled:opacity-60 disabled:cursor-not-allowed`}
              />
            </div>

            {/* Voice Input */}
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              title={isListening ? 'Stop listening' : 'Speak your question'}
              className={`p-3 rounded-2xl transition-all shrink-0 ${
                isListening
                  ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                  : 'bg-surface-card border border-surface-border text-slate-400 hover:text-white hover:border-indigo-500'
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!input.trim() || loading || isLimitReached}
              className="p-3 sm:px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2 shrink-0"
            >
              <Send className="w-5 h-5" />
              <span className="hidden sm:inline">Ask</span>
            </button>
          </form>

          <p className="text-[11px] text-center text-slate-400 mt-2">
            Tutovia AI Tutor provides academic coaching. Cross-reference statutory limits and tax amendments with latest ICAI publications.
          </p>
        </div>
      </footer>

    </div>
  );
}
