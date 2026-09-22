import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, RefreshCw, BookOpen, Lightbulb, CheckCircle2, Mic, MicOff, Image as ImageIcon, Brain } from 'lucide-react';
import axios from '../api.js';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../context/AuthContext.jsx';

export function TutorChat({ isOpen, onClose }) {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `👋 Hi! I'm **Tutovia AI**, your 24/7 Mindful Study & ICAI CA Coach. Ask me anything about Tax, Law, Accounting standards, costing formulas, or mindful study routines!`
    }
  ]);
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Build stage-aware quick prompts based on the student's CA stage
  const stageId = profile?.ca_stage || 'intermediate';
  const quickPrompts = stageId === 'foundation'
    ? [
        'Explain the Accounting Equation',
        'Law of Demand vs Law of Supply',
        'Partnership dissolution entries',
        'Permutations and Combinations basics',
        '3 Focus tips for Foundation exam prep'
      ]
    : stageId === 'final'
    ? [
        'Ind AS 115 — 5-step revenue model',
        'DTAA — OECD vs UN model',
        'Hedge accounting under Ind AS 109',
        'Transfer pricing arm\'s length methods',
        '3 Advanced exam strategy tips for CA Final'
      ]
    : stageId === 'ittc'
    ? [
        'How to set up GST in Tally Prime',
        'Cybersecurity basics for CA students',
        'Communication skills for CA articleship',
        'E-filing income tax return steps',
        'MS Excel VLOOKUP and Pivot Tables'
      ]
    : [
        'Explain Section 135 (CSR Rules)',
        'GST Input Tax Credit eligibility (Sec 16)',
        'Difference between AS 10 and Ind AS 16',
        'Calculate WACC with market value weights',
        '3 Mindful focus hacks for long study hours'
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
      setInput(prev => prev + (prev ? ' ' : '') + transcript);
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
    scrollToBottom();
  }, [messages, loading]);

  if (!isOpen) return null;

  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg = { sender: 'user', text: query, image: selectedImage };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    if (!textToSend) setInput('');
    setSelectedImage(null);
    setLoading(true);

    try {
      const res = await axios.post('/api/tutor/chat', { 
        messages: updatedMessages,
        userContext: {
          name: user?.name,
          ca_group: profile?.ca_group || 'Both Groups',
          attempt: profile?.attempt || 'September 2026'
        }
      });
      const botMsg = { sender: 'bot', text: res.data.reply };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: "I apologize, my connection to the AI study cloud experienced a momentary delay. Please try asking your question again!"
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-lg glass-panel border-l border-surface-border flex flex-col h-full shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 border-b border-surface-border flex items-center justify-between bg-surface/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-100 flex items-center gap-2 text-base">
                Tutovia AI Coach
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </h3>
              <p className="text-xs text-slate-400">Finance & Mindful Study Expert</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setMessages([{ sender: 'bot', text: "Chat history cleared. What topic shall we explore next?" }])}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 text-xs flex items-center gap-1"
              title="Clear Chat"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
                <div className={`p-4 rounded-2xl max-w-[85%] ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-none shadow-lg shadow-indigo-600/20' : 'bg-surface-card border border-surface-border text-slate-200 rounded-bl-none shadow-xl'}`}>
                  {msg.sender === 'bot' && (
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-surface-border/50">
                      <Brain className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">AI Study Coach</span>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap font-sans text-[13px] markdown-content">
                    {msg.image && <img src={msg.image} alt="Upload" className="max-w-full rounded-lg mb-2 border border-surface-border" />}
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-surface-card border border-surface-border p-3.5 rounded-2xl rounded-bl-none text-slate-400 text-xs flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
                <span>Thinking & retrieving study notes...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="p-3 border-t border-slate-800/80 bg-surface/40">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 mb-2">
            <Lightbulb className="w-3 h-3 text-amber-400" />
            <span>Suggested Questions:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800/90 hover:bg-indigo-600/30 hover:border-indigo-500/50 text-slate-300 border border-slate-700 transition-all text-left"
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
              <div className="absolute bottom-16 left-4 p-2 bg-surface-card border border-surface-border rounded-xl shadow-xl flex items-center gap-2">
                <img src={selectedImage} alt="Preview" className="h-12 w-12 object-cover rounded" />
                <button type="button" onClick={() => setSelectedImage(null)} className="w-6 h-6 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center hover:bg-rose-500/20">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
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
              placeholder={isListening ? '🎙️ Listening...' : 'Ask a question about your exams or study topic...'}
              className={`flex-1 bg-surface-card border rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors ${isListening ? 'border-rose-500 animate-pulse' : 'border-surface-border focus:border-indigo-500'}`}
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
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-static-white transition-all shadow-md shadow-indigo-600/30"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
