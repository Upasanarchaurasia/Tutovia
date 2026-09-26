import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import axios from '../api.js';
import { BookOpen, HelpCircle, Layers, CheckCircle2, Award, RotateCcw, ChevronLeft, ChevronRight, Upload, Loader2, Plus, X, Sparkles } from 'lucide-react';

export default function Flashcards() {
  const { user } = useAuth();
  const [flashcards, setFlashcards] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });
  const fileInputRef = useRef(null);

  // Custom Flashcard Creation State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSubject, setNewSubject] = useState('taxation');
  const [newChapter, setNewChapter] = useState('Key Concepts');
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [newTip, setNewTip] = useState('');

  // Filters
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [progressFilter, setProgressFilter] = useState('all'); // all, pending, reviewed

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [subjectFilter, progressFilter]);

  const getStorageKey = () => `tutovia_fc_progress_${user?.id || 'guest'}`;

  const mergeLocalProgress = (cards) => {
    try {
      const localData = JSON.parse(localStorage.getItem(getStorageKey()) || '{}');
      return cards.map(c => {
        if (localData[c.id]) {
          return {
            ...c,
            status: localData[c.id].status || c.status,
            next_review_date: localData[c.id].next_review_date || c.next_review_date
          };
        }
        return c;
      });
    } catch {
      return cards;
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const uid = user?.id || '';
    try {
      const [fcRes, subRes] = await Promise.all([
        axios.get(`/api/flashcards${uid ? `?userId=${uid}` : ''}`).catch(() => ({ data: [] })),
        axios.get(`/api/subjects${uid ? `?userId=${uid}` : ''}`).catch(() => ({ data: [] }))
      ]);
      const rawCards = Array.isArray(fcRes.data) ? fcRes.data : [];
      setFlashcards(mergeLocalProgress(rawCards));
      setAvailableSubjects(Array.isArray(subRes.data) ? subRes.data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFlashcards = async () => {
    const uid = user?.id || '';
    try {
      const res = await axios.get(`/api/flashcards${uid ? `?userId=${uid}` : ''}`).catch(() => ({ data: [] }));
      const rawCards = Array.isArray(res.data) ? res.data : [];
      setFlashcards(mergeLocalProgress(rawCards));
    } catch (error) {
      console.error(error);
    }
  };

  const filteredCards = useMemo(() => {
    let result = flashcards;
    
    if (subjectFilter !== 'all') {
      result = result.filter(fc => fc.subject_id === subjectFilter);
    }

    if (progressFilter === 'pending') {
      result = result.filter(fc => fc.status === 'pending');
    } else if (progressFilter === 'reviewed') {
      result = result.filter(fc => fc.status !== 'pending');
    } else if (progressFilter === 'due') {
      const now = new Date();
      result = result.filter(fc => {
        if (fc.status === 'pending') return false;
        if (fc.next_review_date) {
          return new Date(fc.next_review_date) <= now;
        }
        return true;
      });
    } else if (progressFilter === 'again') {
      result = result.filter(fc => fc.status === 'again');
    } else if (progressFilter === 'hard') {
      result = result.filter(fc => fc.status === 'hard');
    } else if (progressFilter === 'good') {
      result = result.filter(fc => fc.status === 'good');
    } else if (progressFilter === 'mastered') {
      result = result.filter(fc => fc.status === 'mastered');
    }

    return result;
  }, [flashcards, subjectFilter, progressFilter]);

  const safeIndex = filteredCards.length > 0 ? Math.min(currentIndex, filteredCards.length - 1) : 0;

  const handleNext = () => {
    if (safeIndex < filteredCards.length - 1) {
      setIsFlipped(false);
      setCurrentIndex(safeIndex + 1);
    }
  };

  const handlePrev = () => {
    if (safeIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex(safeIndex - 1);
    }
  };

  const submitProgress = async (quality) => {
    const currentCard = filteredCards[safeIndex];
    if (!currentCard) return;

    let optimisticStatus = 'again';
    if (quality >= 5) optimisticStatus = 'mastered';
    else if (quality >= 4) optimisticStatus = 'good';
    else if (quality >= 3) optimisticStatus = 'hard';

    const optimisticNextReview = new Date(Date.now() + (quality >= 5 ? 6 : quality >= 4 ? 3 : 1) * 86400000).toISOString();

    // 1. Optimistic state update in memory
    setFlashcards(prev => prev.map(fc => 
      fc.id === currentCard.id ? { ...fc, status: optimisticStatus, next_review_date: optimisticNextReview } : fc
    ));

    // 2. Persist locally to localStorage immediately
    try {
      const key = getStorageKey();
      const localData = JSON.parse(localStorage.getItem(key) || '{}');
      localData[currentCard.id] = { status: optimisticStatus, next_review_date: optimisticNextReview, quality };
      localStorage.setItem(key, JSON.stringify(localData));
    } catch (e) {
      console.warn("Local storage write error:", e);
    }

    // 3. Smooth flip and advance card
    setIsFlipped(false);
    if (progressFilter === 'all' || progressFilter === 'reviewed') {
      if (safeIndex < filteredCards.length - 1) {
        setCurrentIndex(safeIndex + 1);
      }
    } else {
      // In dynamic filters like 'pending' or 'again', the card leaves the filter automatically.
      if (safeIndex >= filteredCards.length - 1 && safeIndex > 0) {
        setCurrentIndex(safeIndex - 1);
      }
    }

    // 4. Background server sync
    try {
      const res = await axios.post('/api/flashcards/progress', {
        userId: user?.id,
        cardId: currentCard.id,
        quality: quality // SM-2 score 1-5
      });
      
      if (res.data?.progress) {
        const newStatus = res.data.progress.status;
        const nextReview = res.data.progress.next_review_date;

        setFlashcards(prev => prev.map(fc => 
          fc.id === currentCard.id ? { ...fc, status: newStatus, next_review_date: nextReview } : fc
        ));
      }
    } catch (error) {
      console.error("Failed to update flashcard progress on server", error);
    }
  };

  const handleCreateCard = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    const createdCard = {
      id: `custom_${Date.now()}`,
      subject_id: newSubject,
      chapter: newChapter,
      section: 'CA Intermediate Notes',
      question: newQuestion.trim(),
      points: newAnswer.split('\n').filter(p => p.trim().length > 0),
      memory_tip: newTip.trim() || 'Key Exam Formula / Rule',
      status: 'pending',
      isCustom: true
    };

    setFlashcards(prev => [createdCard, ...prev]);
    setShowCreateModal(false);
    setNewQuestion('');
    setNewAnswer('');
    setNewTip('');

    try {
      await axios.post('/api/flashcards/bulk', { flashcards: [createdCard] }).catch(() => {});
    } catch (_) {}
  };

  const minSwipeDistance = 50;

  const handleTouchStart = (e) => {
    setTouchEnd({ x: 0, y: 0 });
    setTouchStart({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
  };

  const handleTouchMove = (e) => {
    setTouchEnd({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
  };

  const handleTouchEnd = () => {
    if (!touchStart.x || !touchEnd.x) return;
    
    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isLeftSwipe = distanceX > minSwipeDistance;
    const isRightSwipe = distanceX < -minSwipeDistance;
    const isUpSwipe = distanceY > minSwipeDistance;

    // Only process swipe if card is flipped (review mode)
    if (isFlipped) {
      if (Math.abs(distanceX) > Math.abs(distanceY)) {
        if (isLeftSwipe) {
          submitProgress(1); // Swipe Left -> Again
        }
        if (isRightSwipe) {
          submitProgress(4); // Swipe Right -> Good
        }
      } else {
        if (isUpSwipe) {
          submitProgress(5); // Swipe Up -> Easy
        }
      }
    } else {
      // If not flipped, left/right swipes just navigate
      if (Math.abs(distanceX) > Math.abs(distanceY)) {
        if (isLeftSwipe) handleNext();
        if (isRightSwipe) handlePrev();
      }
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const data = await file.arrayBuffer();
      // Ensure window.XLSX is loaded from index.html CDN
      if (!window.XLSX) {
        alert("Excel parser is still loading. Please try again in a moment.");
        setIsUploading(false);
        return;
      }
      const workbook = window.XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = window.XLSX.utils.sheet_to_json(worksheet);
      
      const newFlashcards = jsonData.map(row => ({
        subject_id: row.SubjectId || 'general',
        chapter: row.Chapter || 'Custom Import',
        question: row.Question || row.Front || 'Untitled Question',
        answer: row.Answer || row.Back || 'Untitled Answer',
        memory_tip: row.MemoryTip || row.Tip || null
      }));

      if (newFlashcards.length > 0) {
        const res = await axios.post('/api/flashcards/bulk', { flashcards: newFlashcards });
        alert(`Successfully imported ${res.data.addedCount} new flashcards!`);
        fetchFlashcards(); // Refresh list
      }
    } catch (err) {
      console.error("Failed to parse or upload Excel file", err);
      alert("Failed to read the Excel file. Please ensure it has Question and Answer columns.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div></div>;
  }

  const currentCard = filteredCards[safeIndex];

  // Stats
  const flippedCount = flashcards.filter(fc => fc.status !== 'pending').length;
  const remainingCount = flashcards.length - flippedCount;
  const percentComplete = flashcards.length > 0 ? Math.round((flippedCount / flashcards.length) * 100) : 0;

  const againCount = flashcards.filter(fc => fc.status === 'again').length;
  const hardCount = flashcards.filter(fc => fc.status === 'hard').length;
  const goodCount = flashcards.filter(fc => fc.status === 'good').length;
  const masteredCount = flashcards.filter(fc => fc.status === 'mastered').length;

  return (
    <div className="space-y-6">
      
      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-card border border-surface-border p-4 rounded-2xl">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <select 
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="bg-surface border border-surface-border rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Subjects</option>
            {availableSubjects.map(sub => (
              <option key={sub.id} value={sub.id}>{sub.title}</option>
            ))}
            {/* Always include custom imported cards option if any exist */}
            {flashcards.some(fc => fc.isCustom) && (
              <option value="general">Custom Imported</option>
            )}
          </select>

          <select 
            value={progressFilter}
            onChange={(e) => setProgressFilter(e.target.value)}
            className="bg-surface border border-surface-border rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Progress</option>
            <option value="pending">Pending Only ({flashcards.length - flippedCount})</option>
            <option value="reviewed">Reviewed Only ({flippedCount})</option>
            <option value="due">Due for Review</option>
            <option value="again">Needs Review ({againCount})</option>
            <option value="hard">Hard Cards ({hardCount})</option>
            <option value="good">Good Memory ({goodCount})</option>
            <option value="mastered">Mastered Only ({masteredCount})</option>
          </select>
        </div>
        
        <div className="text-slate-400 text-sm font-medium">
          Showing {filteredCards.length} Cards
        </div>
      </div>

      {/* Upload Custom Deck Banner */}
      <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-indigo-300 font-bold mb-1 flex items-center gap-2">
            <Layers className="w-5 h-5" /> Import Your Own Flashcards
          </h3>
          <p className="text-slate-400 text-xs">Upload an Excel file (.xlsx) with 'Question' and 'Answer' columns to instantly add custom cards to your deck.</p>
        </div>
        <input 
          type="file" 
          accept=".xlsx, .xls" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
        />
        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> New Card
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-1.5 whitespace-nowrap"
          >
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {isUploading ? 'Importing...' : 'Upload Excel'}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Main Flashcard Stage */}
        <div className="flex-1 flex flex-col items-center">
          
          {filteredCards.length > 0 ? (
            <div className="w-full max-w-2xl relative perspective-1000 mb-6 group">
              
              <div className="flex justify-between items-center w-full mb-3 px-2">
                <span className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full border border-indigo-500/30">
                  Card {safeIndex + 1} of {filteredCards.length}
                </span>
                {currentCard.status !== 'pending' ? (
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    currentCard.status === 'mastered' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                    currentCard.status === 'good' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                    currentCard.status === 'hard' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                    'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  }`}>
                    {currentCard.status === 'mastered' ? '🌟 Mastered' :
                     currentCard.status === 'good' ? '👍 Good' :
                     currentCard.status === 'hard' ? '⚠️ Hard' : '🔄 Needs Review'}
                  </span>
                ) : (
                  <span className="text-xs font-medium px-3 py-1 rounded-full border bg-slate-500/10 text-slate-400 border-slate-500/20">
                    New Card
                  </span>
                )}
              </div>

              {/* The Flip Container */}
              <div 
                className={`w-full aspect-[4/3] sm:aspect-[16/10] transition-transform duration-700 cursor-pointer relative touch-pan-y`}
                style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : '' }}
                onClick={() => setIsFlipped(!isFlipped)}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                
                {/* Front Face (Question) */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-surface-card to-background border border-surface-border rounded-3xl p-6 sm:p-10 flex flex-col shadow-2xl shadow-black/50"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  
                  <div className="flex items-center gap-2 mb-6">
                    <BookOpen className="w-5 h-5 text-indigo-400" />
                    <span className="text-sm font-bold text-slate-300">{currentCard.chapter}</span>
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-center items-center text-center">
                    <h3 className="text-3xl sm:text-4xl font-black text-white mb-2">{currentCard.title}</h3>
                    <p className="text-lg text-indigo-300 font-medium">{currentCard.subtitle}</p>
                    
                    <div className="w-16 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent my-6 opacity-50"></div>
                    
                    <p className="text-xl text-slate-300 leading-relaxed max-w-lg">{currentCard.prompt}</p>
                  </div>

                  <div className="mt-auto flex items-center justify-center gap-2 text-slate-500 text-sm">
                    <RotateCcw className="w-4 h-4" />
                    <span>Click card to flip</span>
                  </div>

                </div>

                {/* Back Face (Answer) */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-indigo-950 to-background border border-indigo-500/30 rounded-3xl p-6 sm:p-10 flex flex-col shadow-2xl shadow-indigo-900/20"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  
                  <div className="flex items-center gap-2 mb-4">
                    <Layers className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-bold text-slate-300">{currentCard.chapter}</span>
                  </div>
                  
                  <div className="self-start bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-lg mb-6 shadow-md shadow-indigo-500/30">
                    {currentCard.section}
                  </div>

                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <ul className="space-y-4">
                      {currentCard.points.map((point, idx) => (
                        <li key={idx} className="flex gap-3 text-slate-200 text-lg leading-relaxed">
                          <span className="text-emerald-400 mt-1.5">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-indigo-500/20 bg-indigo-500/10 -mx-6 sm:-mx-10 -mb-6 sm:-mb-10 px-6 sm:px-10 py-5 rounded-b-3xl">
                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-amber-400/80 text-xs font-bold uppercase tracking-wider block mb-1">Memory Tip</span>
                        <p className="text-amber-100 font-medium">{currentCard.memory_tip}</p>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* Navigation Controls */}
              <div className="flex justify-between items-center mt-6 w-full">
                <button 
                  onClick={handlePrev}
                  disabled={safeIndex === 0}
                  className="flex items-center gap-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" /> Prev
                </button>
                
                <button 
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="px-6 py-2 bg-surface-card hover:bg-slate-800 border border-surface-border rounded-xl text-white font-bold transition-all shadow-sm"
                >
                  Flip Card
                </button>
                
                <button 
                  onClick={handleNext}
                  disabled={safeIndex === filteredCards.length - 1}
                  className="flex items-center gap-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                >
                  Next <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* 4-Tier Spaced Repetition System (Leitner Box/SM-2) Buttons */}
              <div className={`grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-6 transition-all duration-500 ${isFlipped ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                <button 
                  onClick={() => submitProgress(1)}
                  className="py-3 px-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-xl text-rose-300 font-bold transition-all text-xs text-center flex flex-col items-center"
                >
                  <span>Again</span>
                  <span className="text-[10px] text-rose-400/70 font-normal">Review soon</span>
                </button>
                <button 
                  onClick={() => submitProgress(3)}
                  className="py-3 px-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl text-amber-300 font-bold transition-all text-xs text-center flex flex-col items-center"
                >
                  <span>Hard</span>
                  <span className="text-[10px] text-amber-400/70 font-normal">Small interval</span>
                </button>
                <button 
                  onClick={() => submitProgress(4)}
                  className="py-3 px-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-xl text-blue-300 font-bold transition-all text-xs text-center flex flex-col items-center"
                >
                  <span>Good</span>
                  <span className="text-[10px] text-blue-400/70 font-normal">Normal interval</span>
                </button>
                <button 
                  onClick={() => submitProgress(5)}
                  className="py-3 px-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-300 font-bold transition-all text-xs text-center flex flex-col items-center"
                >
                  <span>Easy</span>
                  <span className="text-[10px] text-emerald-400/70 font-normal">Large interval</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400 bg-surface-card border border-surface-border rounded-3xl w-full max-w-2xl">
              <Layers className="w-12 h-12 mb-4 opacity-50" />
              <p>No flashcards found for these filters.</p>
            </div>
          )}
        </div>

        {/* Sidebar Analytics */}
        <div className="w-full lg:w-80 space-y-4">
          
          <div className="glass-panel p-6 rounded-3xl border border-surface-border relative overflow-hidden bg-gradient-to-br from-surface-card to-background">
            <h3 className="text-lg font-bold text-white mb-6">Overall Progress</h3>
            
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-800" />
                  <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" 
                    strokeDasharray={351.85} 
                    strokeDashoffset={351.85 - (351.85 * percentComplete) / 100}
                    strokeLinecap="round"
                    className="text-indigo-500 drop-shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-1000 ease-out" 
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-white">{percentComplete}%</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Cards Flipped</span>
                <strong className="text-white">{flippedCount} / {flashcards.length}</strong>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Remaining</span>
                <strong className="text-white">{remainingCount}</strong>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-surface-border">
            <h3 className="text-lg font-bold text-white mb-4">Review Stats</h3>
            
            <div className="grid grid-cols-1 gap-3">
              <div className="flex justify-between items-center p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <span className="text-rose-400 font-semibold text-sm">Needs Review (Again)</span>
                <span className="text-white font-bold text-lg">{againCount}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <span className="text-amber-400 font-semibold text-sm">Challenging (Hard)</span>
                <span className="text-white font-bold text-lg">{hardCount}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <span className="text-blue-400 font-semibold text-sm">Good Memory (Good)</span>
                <span className="text-white font-bold text-lg">{goodCount}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-emerald-400 font-semibold text-sm">Perfect (Mastered)</span>
                <span className="text-white font-bold text-lg">{masteredCount}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Create Custom Flashcard Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-surface border border-surface-border w-full max-w-lg rounded-3xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-base">Create Custom Flashcard</h3>
              </div>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCard} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Subject
                  </label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
                  >
                    {availableSubjects.map(sub => (
                      <option key={sub.id} value={sub.id}>{sub.title}</option>
                    ))}
                    <option value="general">General CA</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Chapter / Topic
                  </label>
                  <input
                    type="text"
                    required
                    value={newChapter}
                    onChange={(e) => setNewChapter(e.target.value)}
                    placeholder="Chapter 4: Capital Gains"
                    className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Card Front (Question / Prompt)
                </label>
                <textarea
                  required
                  rows={2}
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="e.g. What are the conditions for claiming Input Tax Credit under Section 16?"
                  className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Card Back (Key Answers / Bullet points, one per line)
                </label>
                <textarea
                  required
                  rows={3}
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="• Possession of tax invoice&#10;• Goods or services received&#10;• Tax charged actually paid to Govt&#10;• Return filed under Sec 39"
                  className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Memory Hook / Mnemonic (Optional)
                </label>
                <input
                  type="text"
                  value={newTip}
                  onChange={(e) => setNewTip(e.target.value)}
                  placeholder="e.g. Mnemonic: I-R-P-F (Invoice, Receipt, Payment, Filing)"
                  className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-surface-card hover:bg-surface-border text-slate-300 text-xs font-semibold border border-surface-border transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Save to My Deck
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
