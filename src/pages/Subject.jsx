import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, BookOpen, PenTool, Clock, Award, 
  FileText, BrainCircuit, Activity, ChevronRight, Play, AlertCircle, Bookmark, 
  ExternalLink, CheckCircle2, Copy, Check, Sparkles, ChevronDown, ChevronUp,
  X, Info, Calculator, Volume2, ShieldAlert, Layers, CornerDownRight
} from 'lucide-react';
import axios from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { SYLLABUS_BY_STAGE } from '../data/syllabusData.js';
import { syncCompletedChapters } from '../services/syncService.js';
import { getChapterSpecificData, CHAPTER_DETAILS } from '../data/chapterDetailsData.js';

export default function Subject() {
  const { id } = useParams();
  const [subject, setSubject] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [completedChapters, setCompletedChapters] = useState([]);
  const [notes, setNotes] = useState('');
  const { user, profile } = useAuth();
  const [savingNotes, setSavingNotes] = useState(false);
  
  // States for Unified Revision Notes & Formulas
  const [selectedRevisionChapter, setSelectedRevisionChapter] = useState('all');
  const [revisionSubTab, setRevisionSubTab] = useState('snapshots'); // 'snapshots' | 'notebook'
  const [copiedFormula, setCopiedFormula] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // States for Interactive Mindmap Drill-down
  const [selectedMindmapNode, setSelectedMindmapNode] = useState(null);
  const [mindmapFilterChapter, setMindmapFilterChapter] = useState('all');
  
  const userStorageKey = `tutovia_completed_chapters_${user?.id || 'guest'}_${id}`;

  useEffect(() => {
    const saved = localStorage.getItem(userStorageKey);
    if (saved) {
      try { setCompletedChapters(JSON.parse(saved)); } catch (e) {}
    } else {
      setCompletedChapters([]);
    }

    // In background, sync with Supabase cloud if user is logged in
    if (user?.id) {
      syncCompletedChapters(user.id, id).then(synced => {
        if (Array.isArray(synced) && synced.length > 0) {
          setCompletedChapters(synced);
        }
      }).catch(() => {});
    }
  }, [id, user?.id, userStorageKey]);

  const toggleChapter = (no) => {
    setCompletedChapters(prev => {
      const newList = prev.includes(no) ? prev.filter(c => c !== no) : [...prev, no];
      localStorage.setItem(userStorageKey, JSON.stringify(newList));
      if (user?.id) {
        syncCompletedChapters(user.id, id, newList).catch(() => {});
      }
      return newList;
    });
  };

  useEffect(() => {
    fetchSubject();
  }, [id, user?.id]);

  const fetchSubject = async () => {
    setLoading(true);
    const uid = user?.id || '';
    const attempt = profile?.attempt || user?.attempt || 'September 2026';
    try {
      const [resSub, resChap, resMat, resNotes] = await Promise.all([
        axios.get(`/api/subjects/${id}${uid ? `?userId=${uid}` : ''}`).catch(() => ({ data: null })),
        axios.get(`/api/chapters?subjectId=${id}`).catch(() => ({ data: [] })),
        axios.get(`/api/materials?subjectId=${id}&attempt=${encodeURIComponent(attempt)}`).catch(() => ({ data: [] })),
        axios.get(`/api/notes?subjectId=${id}${uid ? `&userId=${uid}` : ''}`).catch(() => ({ data: { notes: '' } }))
      ]);
      if (resSub?.data) setSubject(resSub.data);
      if (resChap?.data) setChapters(resChap.data);
      if (resMat?.data) setMaterials(resMat.data);
      setNotes(resNotes?.data?.notes || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveNotes = async () => {
    setSavingNotes(true);
    setSaveSuccess(false);
    const uid = user?.id;
    if (!uid) {
      setSavingNotes(false);
      return;
    }
    try {
      await axios.post(`/api/notes?userId=${uid}&subjectId=${id}`, { notes });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleCopyFormula = (formulaObj) => {
    const textToCopy = `${formulaObj.name}\nFormula: ${formulaObj.formula}\nNote: ${formulaObj.explanation || ''}`;
    navigator.clipboard?.writeText(textToCopy);
    setCopiedFormula(formulaObj.name);
    setTimeout(() => setCopiedFormula(null), 2000);
  };

  const handleAppendToNotes = (text) => {
    const updatedNotes = notes ? `${notes}\n\n${text}` : text;
    setNotes(updatedNotes);
    setRevisionSubTab('notebook');
    alert('Added to your Personal Notes!');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-sm">Loading subject details...</p>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-2xl font-bold text-slate-300">Subject Not Found or Loading Failed</h2>
        <div className="flex items-center justify-center gap-4">
          <button 
            onClick={fetchSubject} 
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition-all"
          >
            Retry Loading
          </button>
          <Link to="/" className="text-indigo-400 hover:underline inline-block text-sm">Return to Dashboard</Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'materials', label: 'Official Study Material', icon: Bookmark },
    { id: 'chapters', label: 'Chapters & Topics', icon: BookOpen },
    { id: 'practice', label: 'Practice & Mock Tests', icon: PenTool },
    { id: 'revision', label: 'Revision Notes', icon: FileText },
    { id: 'mindmap', label: 'Mind Map', icon: BrainCircuit }
  ];

  const handlePlayAudio = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any current audio
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Slightly slower for learning
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported in this browser.");
    }
  };

  // Determine state
  let statusText = "In Progress";
  let statusColor = "text-indigo-400";
  let statusBg = `bg-indigo-500/10`;
  let statusBorder = `border-indigo-500/20`;

  if (subject.questionsAttempted === 0) {
    statusText = "Not Started";
    statusColor = "text-slate-400";
    statusBg = "bg-slate-800";
    statusBorder = "border-slate-700";
  } else if (subject.accuracy !== null && subject.accuracy < 60) {
    statusText = "Needs Attention";
    statusColor = "text-rose-400";
    statusBg = "bg-rose-500/10";
    statusBorder = "border-rose-500/20";
  } else if (subject.accuracy !== null && subject.accuracy >= 60) {
    statusText = "Active / Strong";
    statusColor = "text-emerald-400";
    statusBg = "bg-emerald-500/10";
    statusBorder = "border-emerald-500/20";
  }

  // Find official syllabus data
  const stageId = profile?.ca_stage || 'intermediate';
  const stageData = SYLLABUS_BY_STAGE[stageId] || SYLLABUS_BY_STAGE['intermediate'];
  const matchedPaper = stageData?.papers?.find(p => p.id === subject.id || subject.id?.includes(p.id?.split('-').pop()));
  const paperData = matchedPaper || stageData?.papers?.find(p =>
    p.shortTitle?.toLowerCase() === subject.title?.toLowerCase() ||
    p.title?.toLowerCase().includes(subject.title?.toLowerCase().split(' ')[0])
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Breadcrumb & Header */}
      <div>
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="glass-panel p-8 rounded-3xl relative overflow-hidden border border-surface-border">
          <div className={`absolute top-0 right-0 w-64 h-64 bg-${subject.color}-500/10 rounded-full blur-3xl pointer-events-none`} />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-${subject.color}-500/10 border border-${subject.color}-500/20 text-${subject.color}-400 text-xs font-semibold uppercase tracking-wider`}>
                  {subject.group}
                </div>
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${statusBg} border ${statusBorder} ${statusColor} text-xs font-semibold uppercase tracking-wider`}>
                  {statusText === 'Needs Attention' && <AlertCircle className="w-3.5 h-3.5" />}
                  {statusText}
                </div>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
                {subject.title}
              </h1>
              <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
                Track your syllabus completion, attempt practice questions, and review your weak areas.
              </p>
            </div>
            
            <div className="flex gap-4 text-center">
              <div className="p-4 rounded-2xl bg-surface border border-surface-border min-w-[100px]">
                <div className={`text-2xl font-bold text-${subject.color}-400`}>{subject.progress}%</div>
                <div className="text-xs text-slate-500 mt-1">Completion</div>
              </div>
              <div className="p-4 rounded-2xl bg-surface border border-surface-border min-w-[100px]">
                <div className={`text-2xl font-bold ${subject.accuracy !== null ? 'text-slate-200' : 'text-slate-500'}`}>
                  {subject.accuracy !== null ? `${subject.accuracy}%` : '—'}
                </div>
                <div className="text-xs text-slate-500 mt-1">Accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                isActive 
                  ? `bg-${subject.color}-600 text-white shadow-lg shadow-${subject.color}-500/20` 
                  : 'bg-surface-card border border-surface-border text-slate-400 hover:text-slate-200 hover:bg-surface'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
                        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-6">
              {paperData?.chapters ? (
                <div className="glass-panel p-6 rounded-3xl border border-surface-border">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-indigo-400" /> Chapter-wise Syllabus & Progress
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-300 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20">
                        {completedChapters.length} / {paperData.chapters.length} Completed
                      </span>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-surface border border-surface-border rounded-full h-2.5 mb-6 overflow-hidden">
                    <div 
                      className={`bg-${subject.color}-500 h-2.5 rounded-full transition-all duration-700 ease-out relative overflow-hidden`}
                      style={{ width: `${(completedChapters.length / paperData.chapters.length) * 100}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {paperData.chapters.map((ch, idx) => {
                      const isCompleted = completedChapters.includes(ch.no);
                      return (
                        <div key={idx} className="p-4 rounded-2xl bg-surface-card border transition-all ">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={() => toggleChapter(ch.no)}
                                aria-label="Toggle Chapter Completion"
                                className={isCompleted ? "w-6 h-6 shrink-0 rounded-md border flex items-center justify-center transition-all bg-emerald-500 border-emerald-500" : "w-6 h-6 shrink-0 rounded-md border border-slate-600 flex items-center justify-center transition-all hover:border-indigo-400"}
                              >
                                {isCompleted && <CheckCircle2 className="w-4 h-4 text-white" />}
                              </button>
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 bg-surface border border-surface-border text-slate-400">
                                {ch.no}
                              </div>
                              <h4 className="text-sm font-bold text-slate-200">{ch.title}</h4>
                            </div>
                            {ch.marks && (
                              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap w-fit">
                                {ch.marks} Marks
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1.5 pl-12 mt-3">
                            {ch.topics?.map((t, ti) => (
                              <span key={ti} className="text-[10px] px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="glass-panel p-8 text-center rounded-3xl border border-surface-border">
                  <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">No Syllabus Data</h3>
                  <p className="text-sm text-slate-400 mb-6">We don't have interactive chapter checklists for this specific paper yet.</p>
                  <button onClick={() => setActiveTab('materials')} className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all">
                    View Study Materials
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MATERIALS TAB */}
        {activeTab === 'materials' && (
          <div className="space-y-6">
            {paperData ? (
              <div className="glass-panel p-6 rounded-3xl border border-indigo-500/30 bg-indigo-500/5">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                      <Bookmark className="w-5 h-5 text-indigo-400" /> Official ICAI Study Material
                    </h3>
                    <p className="text-xs text-slate-400">
                      Direct links to Board of Studies (BOS) official resources for your stage.
                      Last updated for <span className="text-indigo-300 font-semibold">{profile?.attempt || 'September 2026'}</span>.
                    </p>
                  </div>
                  <a
                    href={paperData?.icaiPortal || paperData?.rtpUrl || 'https://boslive.icai.org/'}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all shadow-lg shadow-indigo-500/20 whitespace-nowrap"
                  >
                    ?? Open ICAI BOS Portal <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paperData?.officialPdfUrl && (
                    <a href={paperData.officialPdfUrl} target="_blank" rel="noreferrer" className="flex items-start gap-4 p-4 rounded-2xl bg-surface-card border border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                        <BookOpen className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-emerald-400 mb-0.5">?? STUDY MATERIAL</div>
                        <div className="text-sm font-bold text-white mb-1">{paperData?.code}: {paperData?.shortTitle || subject.title}</div>
                        <div className="text-[11px] text-slate-400">ICAI BOS Official Study Module PDF</div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                    </a>
                  )}

                  {paperData?.rtpUrl && (
                    <a href={paperData.rtpUrl} target="_blank" rel="noreferrer" className="flex items-start gap-4 p-4 rounded-2xl bg-surface-card border border-amber-500/20 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all group">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 group-hover:bg-amber-500/20 transition-colors">
                        <FileText className="w-6 h-6 text-amber-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-amber-400 mb-0.5">?? REVISION TEST PAPER (RTP)</div>
                        <div className="text-sm font-bold text-white mb-1">RTP � {profile?.attempt || 'September 2026'}</div>
                        <div className="text-[11px] text-slate-400">Official ICAI Revision Test Paper with Solutions</div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                    </a>
                  )}

                  {paperData?.mtpUrl && (
                    <a href={paperData.mtpUrl} target="_blank" rel="noreferrer" className="flex items-start gap-4 p-4 rounded-2xl bg-surface-card border border-blue-500/20 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 transition-colors">
                        <PenTool className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-blue-400 mb-0.5">?? MOCK TEST PAPER (MTP)</div>
                        <div className="text-sm font-bold text-white mb-1">MTP Series 1 & 2 � {profile?.attempt || 'September 2026'}</div>
                        <div className="text-[11px] text-slate-400">Official ICAI Mock Test Papers with Suggested Answers</div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-blue-400 shrink-0 mt-1" />
                    </a>
                  )}

                  {paperData?.bosVideoUrl && (
                    <a href={paperData.bosVideoUrl} target="_blank" rel="noreferrer" className="flex items-start gap-4 p-4 rounded-2xl bg-surface-card border border-rose-500/20 hover:border-rose-500/50 hover:bg-rose-500/5 transition-all group">
                      <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0 group-hover:bg-rose-500/20 transition-colors">
                        <Play className="w-6 h-6 text-rose-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-rose-400 mb-0.5">?? BOS VIDEO LECTURES</div>
                        <div className="text-sm font-bold text-white mb-1">ICAI BOS Knowledge Portal Videos</div>
                        <div className="text-[11px] text-slate-400">Official faculty-recorded lecture series by ICAI BOS</div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-rose-400 shrink-0 mt-1" />
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="glass-panel p-6 rounded-3xl border border-surface-border">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-indigo-400" /> Learning Resources
                </h3>
                {materials.length > 0 ? (
                  <div className="space-y-3">
                    {materials.map((m, idx) => (
                      <a key={idx} href={m.url || "https://boslive.icai.org/"} target="_blank" rel="noopener noreferrer" className="p-4 rounded-2xl bg-surface-card border border-surface-border hover:border-indigo-500/50 transition-colors flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                            <Bookmark className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-white font-bold group-hover:text-indigo-300 transition-colors">{m.title}</h4>
                            <p className="text-xs text-slate-400">{m.type}</p>
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-slate-400">No official materials found for this subject.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* CHAPTERS TAB */}
        {activeTab === 'chapters' && (
          <div className="glass-panel p-6 rounded-3xl border border-surface-border">
            <h3 className="text-lg font-bold text-white mb-4">Syllabus Breakdown</h3>
            {chapters.length > 0 ? (
              <div className="space-y-4">
                {chapters.map((chapter, i) => (
                  <div key={chapter.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-2xl bg-surface-card border border-surface-border hover:border-indigo-500/30 transition-all cursor-pointer group gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-surface border border-surface-border flex items-center justify-center text-slate-400 font-bold group-hover:text-indigo-400 transition-colors">
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-xs text-indigo-400 font-semibold mb-0.5">{chapter.module}</p>
                        <h4 className="text-white font-semibold mb-1">{chapter.title}</h4>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {chapter.duration}</span>
                          <span className="flex items-center gap-1"><PenTool className="w-3 h-3" /> {chapter.questions} Qs</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <a 
                        href={chapter.url || "https://boslive.icai.org/"}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-static-white text-sm font-bold flex items-center gap-2 whitespace-nowrap"
                      >
                        Read Chapter PDF <ExternalLink className="w-4 h-4" />
                      </a>
                      <Link 
                        to={`/exams?examId=mock-${subject?.id}-${chapter.id}`}
                        className="px-4 py-2 rounded-xl bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-static-white text-sm font-bold flex items-center gap-2 whitespace-nowrap"
                      >
                        Take Chapter Mock <Play className="w-3 h-3 fill-current" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">Chapters coming soon.</p>
            )}
          </div>
        )}
        {/* UNIFIED REVISION & NOTES TAB */}
        {(activeTab === 'revision' || activeTab === 'snapshots') && (
          <div className="space-y-6">
            {/* Header & Sub-Tab Switcher */}
            <div className="glass-panel p-6 rounded-3xl border border-surface-border">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-surface-border">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-400" /> Revision Notes & Formulas
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Elaborated chapter snapshots, statutory provisions, formula cheat-sheets, and your synchronized study notebook.
                  </p>
                </div>

                {/* Sub-tab Pill Switcher */}
                <div className="flex items-center p-1 rounded-2xl bg-surface/80 border border-surface-border">
                  <button
                    onClick={() => setRevisionSubTab('snapshots')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                      revisionSubTab === 'snapshots'
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" /> Chapter Snapshots & Formulas
                  </button>
                  <button
                    onClick={() => setRevisionSubTab('notebook')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                      revisionSubTab === 'notebook'
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <PenTool className="w-3.5 h-3.5" /> My Personal Notebook
                  </button>
                </div>
              </div>

              {/* Sub-tab 1: Chapter Snapshots & Formulas */}
              {revisionSubTab === 'snapshots' && (
                <div className="pt-6 space-y-6">
                  {/* Chapter Selector Filter */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    <button
                      onClick={() => setSelectedRevisionChapter('all')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                        selectedRevisionChapter === 'all'
                          ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40'
                          : 'bg-surface-card border-surface-border text-slate-400 hover:text-white'
                      }`}
                    >
                      All Chapters ({chapters.length || 3})
                    </button>
                    {(chapters.length > 0 ? chapters : (CHAPTER_DETAILS[id]?.chapters || [])).map((chap, idx) => (
                      <button
                        key={chap.id || idx}
                        onClick={() => setSelectedRevisionChapter(String(chap.number || idx + 1))}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                          selectedRevisionChapter === String(chap.number || idx + 1)
                            ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40'
                            : 'bg-surface-card border-surface-border text-slate-400 hover:text-white'
                        }`}
                      >
                        Ch {chap.number || idx + 1}: {chap.title?.length > 25 ? chap.title.substring(0, 25) + '...' : chap.title}
                      </button>
                    ))}
                  </div>

                  {/* Chapter Cards List */}
                  <div className="space-y-6">
                    {(chapters.length > 0 ? chapters : (CHAPTER_DETAILS[id]?.chapters || []))
                      .filter(chap => selectedRevisionChapter === 'all' || selectedRevisionChapter === String(chap.number))
                      .map((chap, idx) => {
                        const chapData = getChapterSpecificData(id, chap.number || idx + 1, chap.title);
                        return (
                          <div 
                            key={chap.id || idx}
                            className="p-6 rounded-3xl bg-surface-card border border-surface-border hover:border-indigo-500/30 transition-all space-y-5"
                          >
                            {/* Chapter Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-surface-border">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
                                    {chap.module || chapData.module || 'Core Module'}
                                  </span>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    Weightage: {chapData.marks || '15-20'} Marks
                                  </span>
                                </div>
                                <h4 className="text-lg font-bold text-white">
                                  Chapter {chap.number || idx + 1}: {chap.title || chapData.title}
                                </h4>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  onClick={() => handlePlayAudio(chapData.audioSummary)}
                                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-bold transition-all"
                                  title="Listen to comprehensive audio summary"
                                >
                                  <Volume2 className="w-4 h-4 text-emerald-400" /> Listen Audio Summary
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveTab('mindmap');
                                    setSelectedMindmapNode({
                                      title: chap.title || chapData.title,
                                      subtitle: `Chapter ${chap.number || idx + 1} • ${chap.module || chapData.module}`,
                                      marks: chapData.marks,
                                      summary: chapData.audioSummary,
                                      provisions: chapData.importantPoints,
                                      formulas: chapData.formulas,
                                      traps: chapData.icaiTraps,
                                      chapterUrl: chap.url
                                    });
                                  }}
                                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 border border-purple-500/30 text-xs font-bold transition-all"
                                  title="Explore in interactive mind map"
                                >
                                  <BrainCircuit className="w-4 h-4 text-purple-400" /> Mind Map
                                </button>
                              </div>
                            </div>

                            {/* Section 1: Key Conceptual Points & Statutory Provisions */}
                            <div className="space-y-3">
                              <h5 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Key Conceptual Points & Statutory Provisions
                              </h5>
                              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                {chapData.importantPoints?.map((point, pIdx) => (
                                  <li 
                                    key={pIdx} 
                                    className="p-3 rounded-xl bg-surface/50 border border-surface-border text-xs text-slate-300 leading-relaxed flex items-start gap-2"
                                  >
                                    <span className="text-emerald-400 font-bold shrink-0 mt-0.5">•</span>
                                    <span>{point}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Section 2: Formulas & Calculation Cheat Sheet */}
                            {chapData.formulas && chapData.formulas.length > 0 && (
                              <div className="space-y-3">
                                <h5 className="text-xs font-extrabold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                                  <Calculator className="w-3.5 h-3.5" /> Essential Formulas & Computational Cheat Sheet
                                </h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {chapData.formulas.map((f, fIdx) => (
                                    <div 
                                      key={fIdx} 
                                      className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 space-y-2 relative group"
                                    >
                                      <div className="flex items-center justify-between gap-2">
                                        <span className="text-xs font-bold text-white">{f.name}</span>
                                        <button
                                          onClick={() => handleCopyFormula(f)}
                                          className="p-1.5 rounded-lg bg-surface hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-[10px] font-bold flex items-center gap-1"
                                          title="Copy formula to clipboard"
                                        >
                                          {copiedFormula === f.name ? (
                                            <>
                                              <Check className="w-3 h-3 text-emerald-400" /> Copied!
                                            </>
                                          ) : (
                                            <>
                                              <Copy className="w-3 h-3" /> Copy
                                            </>
                                          )}
                                        </button>
                                      </div>
                                      <div className="p-2.5 rounded-xl bg-surface/80 border border-surface-border font-mono text-xs text-indigo-300 overflow-x-auto">
                                        {f.formula}
                                      </div>
                                      {f.explanation && (
                                        <p className="text-[11px] text-slate-400 leading-normal">
                                          {f.explanation}
                                        </p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Section 3: ICAI Exam Traps & Examiner Pitfalls */}
                            {chapData.icaiTraps && chapData.icaiTraps.length > 0 && (
                              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-2">
                                <h5 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                                  <ShieldAlert className="w-4 h-4 text-amber-400" /> ICAI Exam Traps & Pitfall Warnings
                                </h5>
                                <ul className="space-y-1.5">
                                  {chapData.icaiTraps.map((trap, tIdx) => (
                                    <li key={tIdx} className="text-xs text-slate-300 flex items-start gap-2">
                                      <span className="text-amber-400 font-bold shrink-0">⚠️</span>
                                      <span>{trap}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Bottom Actions */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleAppendToNotes(`### Chapter ${chap.number || idx + 1}: ${chap.title || chapData.title}\n\n**Key Points:**\n${chapData.importantPoints?.map(p => `- ${p}`).join('\n')}\n\n**Formulas:**\n${chapData.formulas?.map(f => `${f.name}: ${f.formula}`).join('\n')}`)}
                                  className="px-3.5 py-2 rounded-xl bg-surface hover:bg-slate-800 text-slate-300 text-xs font-bold border border-surface-border transition-all flex items-center gap-1.5"
                                >
                                  <Copy className="w-3.5 h-3.5" /> Append Points to My Notes
                                </button>
                              </div>

                              <div className="flex items-center gap-2">
                                {chap.url && (
                                  <a
                                    href={chap.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 transition-all flex items-center gap-1.5"
                                  >
                                    <FileText className="w-3.5 h-3.5" /> Read Chapter PDF <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                                <Link
                                  to={`/exams?examId=mock-${subject?.id}-${chap.id || idx + 1}`}
                                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
                                >
                                  Take Chapter Quiz <Play className="w-3 h-3 fill-current" />
                                </Link>
                              </div>
                            </div>

                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Sub-tab 2: My Personal Notebook */}
              {revisionSubTab === 'notebook' && (
                <div className="pt-6 space-y-4">
                  {/* Quick Insert Symbols Toolbar */}
                  <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-surface/60 border border-surface-border">
                    <span className="text-xs font-bold text-slate-400 mr-2 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Quick Inserts:
                    </span>
                    <button
                      onClick={() => handleAppendToNotes('\n## Key Formula:\n- **Concept**: \n- **Equation**: \n- **Parameters**: \n')}
                      className="px-2.5 py-1 rounded-lg bg-surface-card hover:bg-indigo-600/20 hover:text-indigo-300 text-slate-300 text-xs font-bold border border-surface-border transition-all"
                    >
                      + Formula Block
                    </button>
                    <button
                      onClick={() => handleAppendToNotes('\n### Statutory Provision / Section:\n- **Section**: \n- **Applicability**: \n- **Condition**: \n')}
                      className="px-2.5 py-1 rounded-lg bg-surface-card hover:bg-indigo-600/20 hover:text-indigo-300 text-slate-300 text-xs font-bold border border-surface-border transition-all"
                    >
                      + Section Note
                    </button>
                    {['₹', 'P/V Ratio', 'WACC', 'BEP', 'AS 10', 'Sec 135', 'SA 200', 'ITC'].map(sym => (
                      <button
                        key={sym}
                        onClick={() => handleAppendToNotes(` ${sym} `)}
                        className="px-2.5 py-1 rounded-lg bg-surface-card hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-surface-border transition-all"
                      >
                        {sym}
                      </button>
                    ))}
                  </div>

                  {/* Notes Textarea */}
                  <div className="relative">
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Write your personal revision notes, mnemonics, formula reminders, and tricky adjustments here. Automatically saved and synced across web and mobile!"
                      className="w-full h-[450px] bg-surface/50 border border-surface-border rounded-2xl p-5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 leading-relaxed font-sans text-sm resize-y"
                    ></textarea>
                  </div>

                  {/* Footer with Character count and Save Button */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span>{notes.length} characters</span>
                      <span>•</span>
                      <span>{notes.trim() ? notes.trim().split(/\s+/).length : 0} words</span>
                      {saveSuccess && (
                        <span className="text-emerald-400 font-bold flex items-center gap-1 animate-pulse">
                          <CheckCircle2 className="w-4 h-4" /> Notes Saved & Synced to Cloud!
                        </span>
                      )}
                    </div>

                    <button 
                      onClick={saveNotes}
                      disabled={savingNotes}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-indigo-600/20"
                    >
                      {savingNotes ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <PenTool className="w-4 h-4" />
                      )}
                      {savingNotes ? 'Saving to Cloud...' : 'Save & Sync Notes'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* INTERACTIVE MIND MAP TAB WITH DETAILED DRILL-DOWN */}
        {activeTab === 'mindmap' && (
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-3xl border border-surface-border space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5 text-purple-400" /> Interactive Visual Mind Map
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Click on ANY node to open a comprehensive drill-down overview with statutory provisions, formulas, and exam guidance!
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">Focus:</span>
                  <select
                    value={mindmapFilterChapter}
                    onChange={(e) => setMindmapFilterChapter(e.target.value)}
                    className="bg-surface-card border border-surface-border rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500/50"
                  >
                    <option value="all">Full Subject Blueprint</option>
                    {(chapters.length > 0 ? chapters : (CHAPTER_DETAILS[id]?.chapters || [])).map((c, i) => (
                      <option key={c.id || i} value={String(c.number || i + 1)}>
                        Ch {c.number || i + 1}: {c.title?.length > 25 ? c.title.substring(0, 25) + '...' : c.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Mind Map Canvas / Interactive Tree */}
              <div className="relative border border-surface-border rounded-3xl bg-surface/40 p-6 md:p-10 overflow-x-auto min-h-[520px] flex flex-col items-center justify-center">
                {/* Visual Decorative SVG Lines */}
                <div className="w-full max-w-4xl space-y-10">
                  {/* ROOT NODE: Subject */}
                  <div className="flex justify-center">
                    <button
                      onClick={() => {
                        const firstChap = (chapters.length > 0 ? chapters[0] : CHAPTER_DETAILS[id]?.chapters?.[0]);
                        const firstData = getChapterSpecificData(id, 1, firstChap?.title);
                        setSelectedMindmapNode({
                          title: subject.title,
                          subtitle: `${subject.code || 'CA Intermediate'} • Complete Course Blueprint`,
                          marks: '100 Marks Total',
                          summary: `${subject.title} is a core CA paper comprising ${chapters.length || 6} major chapters across statutory framework, practical problem solving, and ICAI case studies.`,
                          provisions: [
                            'Structured under ICAI New Scheme of Education and Training.',
                            'Exams consist of 30% compulsory case-scenario based MCQs and 70% descriptive questions.',
                            'Requires thorough conceptual command over statutory limits, formulas, and presentation standards.'
                          ],
                          formulas: firstData.formulas || [],
                          traps: [
                            'Allocate 1.8 minutes per mark in exam (180 minutes for 100 marks).',
                            'Always cite applicable Section numbers and Accounting Standards in initial paragraphs.'
                          ]
                        });
                      }}
                      className="px-6 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-base md:text-lg shadow-[0_0_30px_rgba(168,85,247,0.3)] border border-purple-400/30 flex items-center gap-3 transition-all hover:scale-105"
                    >
                      <BrainCircuit className="w-6 h-6 text-purple-200" />
                      <span>{subject.title}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">Click to Explore</span>
                    </button>
                  </div>

                  {/* Connective Line Down */}
                  <div className="flex justify-center">
                    <div className="w-0.5 h-8 bg-gradient-to-b from-purple-500 to-indigo-500"></div>
                  </div>

                  {/* LEVEL 2: Modules & Chapters Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {(chapters.length > 0 ? chapters.slice(0, 3) : (CHAPTER_DETAILS[id]?.chapters || []).slice(0, 3)).map((chap, idx) => {
                      const chapData = getChapterSpecificData(id, chap.number || idx + 1, chap.title);
                      return (
                        <div 
                          key={chap.id || idx}
                          className="flex flex-col items-center space-y-4"
                        >
                          {/* Module / Chapter Box */}
                          <button
                            onClick={() => setSelectedMindmapNode({
                              title: `Chapter ${chap.number || idx + 1}: ${chap.title || chapData.title}`,
                              subtitle: `${chap.module || chapData.module} • Weightage: ${chapData.marks || '15-20'} Marks`,
                              marks: chapData.marks,
                              summary: chapData.audioSummary,
                              provisions: chapData.importantPoints,
                              formulas: chapData.formulas,
                              traps: chapData.icaiTraps,
                              chapterUrl: chap.url
                            })}
                            className="w-full p-4 rounded-2xl bg-surface-card hover:bg-surface border border-purple-500/30 hover:border-purple-400 text-left transition-all hover:scale-[1.02] shadow-lg group relative overflow-hidden"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                                {chap.module || chapData.module || `Module ${idx + 1}`}
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                                {chapData.marks || '15-20'} Marks
                              </span>
                            </div>
                            <h4 className="font-bold text-white text-sm group-hover:text-purple-300 transition-colors">
                              {chap.title || chapData.title}
                            </h4>
                            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                              {chapData.importantPoints?.[0] || 'Click to view specific legal provisions and calculation models.'}
                            </p>
                            <div className="mt-3 flex items-center justify-between text-[11px] text-purple-400 font-bold">
                              <span>Drill Down Overview →</span>
                              <span className="text-slate-500">{chapData.formulas?.length || 2} Formulas</span>
                            </div>
                          </button>

                          {/* Sub-concept Leaf Nodes */}
                          <div className="w-full space-y-2 pl-3 border-l-2 border-purple-500/20">
                            {chapData.mindmapTree?.children?.[0]?.subtopics?.slice(0, 2).map((subtopic, sIdx) => (
                              <button
                                key={sIdx}
                                onClick={() => setSelectedMindmapNode({
                                  title: subtopic,
                                  subtitle: `Concept under Chapter ${chap.number || idx + 1}: ${chap.title || chapData.title}`,
                                  marks: 'Tested in 4-6 Mark Case Questions',
                                  summary: `Specific core concept testing application of provisions under ${chap.title || chapData.title}. Remember to review statutory exemptions and computational adjustments.`,
                                  provisions: [
                                    chapData.importantPoints?.[sIdx] || `Mandatory legal provisions governing ${subtopic}.`,
                                    'Ensure all requisite disclosures and conditions are explicitly cited in your answers.'
                                  ],
                                  formulas: chapData.formulas || [],
                                  traps: chapData.icaiTraps || [],
                                  chapterUrl: chap.url
                                })}
                                className="w-full p-2.5 rounded-xl bg-surface/80 hover:bg-purple-950/30 border border-surface-border hover:border-purple-500/40 text-left text-xs text-slate-300 hover:text-white transition-all flex items-center justify-between group"
                              >
                                <span className="flex items-center gap-1.5 font-medium">
                                  <CornerDownRight className="w-3 h-3 text-purple-400 shrink-0" />
                                  <span className="truncate">{subtopic}</span>
                                </span>
                                <span className="text-[10px] text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                  Inspect →
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* MINDMAP DRILL-DOWN DETAILED MODAL */}
            {selectedMindmapNode && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
                <div className="w-full max-w-3xl max-h-[90vh] bg-surface-card border border-purple-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                  {/* Modal Header */}
                  <div className="p-6 bg-gradient-to-r from-purple-900/30 via-surface to-indigo-900/30 border-b border-surface-border flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider">
                          MIND MAP DRILL-DOWN
                        </span>
                        {selectedMindmapNode.marks && (
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            {selectedMindmapNode.marks}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-extrabold text-white">
                        {selectedMindmapNode.title}
                      </h3>
                      {selectedMindmapNode.subtitle && (
                        <p className="text-xs text-purple-300/80 mt-0.5">
                          {selectedMindmapNode.subtitle}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => setSelectedMindmapNode(null)}
                      className="p-2 rounded-xl bg-surface hover:bg-slate-800 text-slate-400 hover:text-white transition-all shrink-0"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Modal Body (Scrollable) */}
                  <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
                    {/* 1. Overview */}
                    <div className="p-4 rounded-2xl bg-surface/60 border border-surface-border space-y-2">
                      <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Info className="w-4 h-4" /> Concept Breakdown & Practical Overview
                      </h4>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {selectedMindmapNode.summary}
                      </p>
                    </div>

                    {/* 2. Key Statutory Provisions */}
                    {selectedMindmapNode.provisions && selectedMindmapNode.provisions.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" /> Statutory Provisions & Rules
                        </h4>
                        <ul className="space-y-2">
                          {selectedMindmapNode.provisions.map((prov, prIdx) => (
                            <li 
                              key={prIdx}
                              className="p-3 rounded-xl bg-surface/40 border border-surface-border text-xs text-slate-300 flex items-start gap-2.5 leading-relaxed"
                            >
                              <span className="text-emerald-400 font-bold shrink-0 mt-0.5">•</span>
                              <span>{prov}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* 3. Formulas & Calculations */}
                    {selectedMindmapNode.formulas && selectedMindmapNode.formulas.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Calculator className="w-4 h-4" /> Formulas & Quantitative Methods
                        </h4>
                        <div className="space-y-2.5">
                          {selectedMindmapNode.formulas.map((f, fIdx) => (
                            <div key={fIdx} className="p-3.5 rounded-xl bg-indigo-500/5 border border-indigo-500/20 space-y-1.5">
                              <div className="flex items-center justify-between text-xs font-bold text-white">
                                <span>{f.name}</span>
                                <button
                                  onClick={() => handleCopyFormula(f)}
                                  className="text-[10px] text-indigo-300 hover:text-white flex items-center gap-1"
                                >
                                  {copiedFormula === f.name ? 'Copied!' : 'Copy Formula'}
                                </button>
                              </div>
                              <div className="p-2 rounded-lg bg-surface font-mono text-xs text-indigo-300">
                                {f.formula}
                              </div>
                              {f.explanation && (
                                <p className="text-[11px] text-slate-400">{f.explanation}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 4. ICAI Exam Traps */}
                    {selectedMindmapNode.traps && selectedMindmapNode.traps.length > 0 && (
                      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                        <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                          <ShieldAlert className="w-4 h-4 text-amber-400" /> ICAI Exam Traps & Pitfalls
                        </h4>
                        <ul className="space-y-1.5">
                          {selectedMindmapNode.traps.map((tr, tIdx) => (
                            <li key={tIdx} className="text-xs text-slate-300 flex items-start gap-2">
                              <span className="text-amber-400 shrink-0">⚠️</span>
                              <span>{tr}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Modal Footer Actions */}
                  <div className="p-4 sm:p-6 bg-surface/80 border-t border-surface-border flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePlayAudio(selectedMindmapNode.summary)}
                        className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <Volume2 className="w-4 h-4 text-emerald-400" /> Listen Audio
                      </button>
                      <button
                        onClick={() => {
                          handleAppendToNotes(`### ${selectedMindmapNode.title}\n\n${selectedMindmapNode.summary}\n\n**Key Provisions:**\n${selectedMindmapNode.provisions?.map(p => `- ${p}`).join('\n') || ''}`);
                          setSelectedMindmapNode(null);
                          setActiveTab('revision');
                        }}
                        className="px-4 py-2 rounded-xl bg-surface hover:bg-slate-700 text-slate-300 text-xs font-bold border border-surface-border transition-all flex items-center gap-1.5"
                      >
                        <Copy className="w-3.5 h-3.5" /> Save to Revision Notes
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {selectedMindmapNode.chapterUrl && (
                        <a
                          href={selectedMindmapNode.chapterUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 rounded-xl bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 border border-indigo-500/30 text-xs font-bold transition-all flex items-center gap-1.5"
                        >
                          <FileText className="w-3.5 h-3.5" /> Read PDF <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      <button
                        onClick={() => setSelectedMindmapNode(null)}
                        className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/20"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PRACTICE TAB */}
        {activeTab === 'practice' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-3xl border border-indigo-500/20 bg-indigo-500/5 relative overflow-hidden">
              <Clock className="absolute -bottom-4 -right-4 w-32 h-32 text-indigo-500/10" />
              <h3 className="text-xl font-bold text-white mb-2">Topic-wise Practice</h3>
              <p className="text-sm text-indigo-200 mb-6 max-w-[80%]">Practice MCQs specifically tailored to your syllabus chapters.</p>
              <Link to="/exams" className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-static-white font-bold text-sm transition-colors shadow-lg shadow-indigo-600/20">
                Start Topic Quiz
              </Link>
            </div>
            
            <div className="glass-panel p-6 rounded-3xl border border-purple-500/20 bg-purple-500/5 relative overflow-hidden">
              <Award className="absolute -bottom-4 -right-4 w-32 h-32 text-purple-500/10" />
              <h3 className="text-xl font-bold text-white mb-2">Full Mock Test</h3>
              <p className="text-sm text-purple-200 mb-6 max-w-[80%]">Take a full comprehensive mock exam aligned with ICAI patterns.</p>
              <Link to="/exams" className="inline-block px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-static-white font-bold text-sm transition-colors shadow-lg shadow-purple-600/20">
                Take Mock Test
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

















