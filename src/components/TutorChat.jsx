import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, X, Send, Sparkles, RefreshCw, BookOpen, Lightbulb, CheckCircle2, 
  Mic, MicOff, Image as ImageIcon, Brain, Copy, Check, Maximize2,
  Target, HelpCircle, Layers, AlertCircle, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from '../api.js';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../context/AuthContext.jsx';

export function TutorChat({ isOpen, onClose }) {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [errorState, setErrorState] = useState(null);
  const [lastFailedQuery, setLastFailedQuery] = useState(null);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Suggested prompt categories
  const starterModes = [
    {
      id: 'concept',
      icon: Lightbulb,
      title: 'Explain a concept',
      color: 'text-amber-400',
      prompt: 'Explain AS 10 Component Accounting simply and why it is mandatory for CA Inter.'
    },
    {
      id: 'solve',
      icon: Target,
      title: 'Solve a question',
      color: 'text-sky-400',
      prompt: 'Guide me step-by-step through calculating P/V ratio and Break-Even Point from given sales and profit.'
    },
    {
      id: 'quiz',
      icon: HelpCircle,
      title: 'Quiz me',
      color: 'text-emerald-400',
      prompt: 'Quiz me on Section 135 (CSR Rules) of Companies Act 2013 with 3 practical MCQs. Ask one at a time.'
    },
    {
      id: 'revise',
      icon: Layers,
      title: 'Help me revise',
      color: 'text-purple-400',
      prompt: 'Give me a crisp 5-minute high-yield revision of GST Input Tax Credit (ITC) eligibility under Section 16.'
    }
  ];

  // Stage-aware quick prompts
  const stageId = profile?.ca_stage || 'intermediate';
  const quickPrompts = stageId === 'foundation'
    ? [
        'Explain the Accounting Equation',
        'Law of Demand vs Law of Supply',
        'Partnership dissolution entries',
        '3 Focus tips for Foundation prep'
      ]
    : stageId === 'final'
    ? [
        'Ind AS 115 — 5-step revenue model',
        'DTAA — OECD vs UN model',
        'Hedge accounting under Ind AS 109',
        'Advanced exam strategy for CA Final'
      ]
    : [
        'Section 135 CSR thresholds & penalties',
        'GST ITC eligibility conditions (Sec 16)',
        'Difference between AS 10 and Ind AS 16',
        'Calculate WACC with market value weights'
      ];

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice input is not supported in your browser. Please use Chrome or Edge.');
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, loading, isOpen]);

  if (!isOpen) return null;

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
      const botMsg = { 
        sender: 'bot', 
        text: res.data?.reply || "I've reviewed your question. Let's walk through the core logic together.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Tutor Chat error:', err);
      setErrorState("A temporary network delay interrupted the response.");
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
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-lg glass-panel border-l border-surface-border flex flex-col h-full shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 border-b border-surface-border flex items-center justify-between bg-surface/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-white flex items-center gap-2 text-base">
                  Tutovia AI Tutor
                </h3>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-xs text-slate-400">Your study companion for the CA journey.</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Open full page mode */}
            <Link
              to="/tutor"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-surface-card transition-colors"
              title="Expand to Full Page"
            >
              <Maximize2 className="w-4 h-4" />
            </Link>

            {messages.length > 0 && (
              <button 
                onClick={() => {
                  setMessages([]);
                  setErrorState(null);
                }}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-surface-card transition-colors"
                title="Start New Topic"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}

            <button 
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-surface-card transition-colors"
              title="Close Drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* Welcome Screen (Zero State) */}
          {messages.length === 0 && (
            <div className="py-6 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mb-3 text-indigo-400 shadow-lg shadow-indigo-500/10">
                <Brain className="w-7 h-7" />
              </div>

              <h4 className="font-heading font-black text-lg text-white mb-1">
                Hi! I'm your Tutovia AI Tutor 👋
              </h4>
              <p className="text-xs text-slate-300 font-medium max-w-xs mb-6">
                What are you working on today? Choose a mode below or ask your doubt directly.
              </p>

              {/* 4 Mode Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full mb-6">
                {starterModes.map(mode => {
                  const Icon = mode.icon;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => handleSend(mode.prompt)}
                      className="p-3 rounded-xl bg-surface-card border border-surface-border text-left hover:border-indigo-500/40 hover:bg-surface transition-all text-xs group"
                    >
                      <div className="flex items-center gap-1.5 font-heading font-bold text-slate-200 group-hover:text-white mb-1">
                        <Icon className={`w-3.5 h-3.5 ${mode.color}`} />
                        <span>{mode.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2">
                        {mode.prompt}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Active Messages */}
          {messages.map((msg, index) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={index}
                className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`p-4 rounded-2xl max-w-[88%] shadow-lg ${
                  isUser 
                    ? 'bg-indigo-600 text-white rounded-br-none shadow-indigo-600/20' 
                    : 'bg-surface-card border border-surface-border text-slate-100 rounded-bl-none shadow-xl'
                }`}>
                  
                  {!isUser && (
                    <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-surface-border/50">
                      <div className="flex items-center gap-1.5">
                        <Brain className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                          Tutovia Study Companion
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopy(msg.text, index)}
                        className="text-slate-400 hover:text-white transition-colors"
                        title="Copy note"
                      >
                        {copiedIndex === index ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  )}

                  <div className="whitespace-pre-wrap font-sans text-xs sm:text-[13px] leading-relaxed markdown-content space-y-2">
                    {msg.image && (
                      <img 
                        src={msg.image} 
                        alt="Upload" 
                        className="max-w-full rounded-lg mb-2 border border-surface-border max-h-48 object-contain" 
                      />
                    )}
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-surface-card border border-surface-border p-3.5 rounded-2xl rounded-bl-none text-slate-400 text-xs flex items-center gap-2 shadow-lg">
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
                <span>Tutovia is preparing your explanation...</span>
              </div>
            </div>
          )}

          {/* Error & Retry */}
          {errorState && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between gap-2 text-rose-300 text-xs">
              <div className="flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorState}</span>
              </div>
              {lastFailedQuery && (
                <button
                  onClick={handleRetry}
                  className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold transition-all shrink-0 text-[11px]"
                >
                  Retry
                </button>
              )}
            </div>
          )}

          {/* Natural App Conversion Banner */}
          {userExchangeCount >= 3 && !user && (
            <div className="p-4 rounded-2xl bg-indigo-900/20 border border-indigo-500/30 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-indigo-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Enjoying your session?</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                In the app, your tutor becomes part of your complete learning journey — with personalized planning, progress tracking, recommendations, reminders, memory and more.
              </p>
              <Link
                to="/login"
                onClick={onClose}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 pt-1"
              >
                <span>Continue Your Journey in the Tutovia App</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="p-3 border-t border-surface-border bg-surface/50">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 mb-2">
            <Lightbulb className="w-3 h-3 text-amber-400" />
            <span>Suggested Questions:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="text-[11px] px-2.5 py-1 rounded-full bg-surface-card hover:bg-surface text-slate-300 hover:text-white border border-surface-border transition-all text-left"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Box */}
        <div className="p-4 border-t border-surface-border bg-surface">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            {selectedImage && (
              <div className="absolute bottom-20 left-4 p-2 bg-surface-card border border-surface-border rounded-xl shadow-xl flex items-center gap-2">
                <img src={selectedImage} alt="Preview" className="h-12 w-12 object-cover rounded" />
                <button 
                  type="button" 
                  onClick={() => setSelectedImage(null)} 
                  className="w-6 h-6 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center hover:bg-rose-500/20"
                >
                  <X className="w-3 h-3" />
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
              className="p-2.5 rounded-xl bg-surface-card border border-surface-border text-slate-400 hover:text-indigo-400 hover:border-indigo-500/30 transition-colors shrink-0"
              title="Upload Image"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
            
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? '🎙️ Listening...' : 'Ask a question or request explanation...'}
              className={`flex-1 bg-surface-card border rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors ${
                isListening ? 'border-rose-500 animate-pulse' : 'border-surface-border focus:border-indigo-500'
              }`}
            />
            
            {/* Mic Button */}
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              title={isListening ? 'Stop listening' : 'Speak your question'}
              className={`p-2.5 rounded-xl transition-all ${
                isListening
                  ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                  : 'bg-surface-card border border-surface-border text-slate-400 hover:text-white hover:border-indigo-500'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all shadow-md shadow-indigo-600/30"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
