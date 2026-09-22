import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, BookOpen, PenTool, Clock, Award, 
  FileText, BrainCircuit, Activity, ChevronRight, Play, AlertCircle, Bookmark, ExternalLink, CheckCircle2
} from 'lucide-react';
import axios from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { SYLLABUS_BY_STAGE } from '../data/syllabusData.js';
import { syncCompletedChapters } from '../services/syncService.js';

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
    const uid = user?.id;
    if (!uid) {
      setSavingNotes(false);
      return;
    }
    try {
      await axios.post(`/api/notes?userId=${uid}&subjectId=${id}`, { notes });
    } catch (err) {
      console.error(err);
    } finally {
      setSavingNotes(false);
    }
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
    { id: 'revision', label: 'Revision & Notes', icon: FileText },
    { id: 'snapshots', label: 'Chapter Snapshots', icon: FileText },
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
        {activeTab === 'snapshots' && (
          <div className="glass-panel p-6 rounded-3xl border border-surface-border space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-6">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-400" /> Chapter Snapshots
                </h3>
                <p className="text-sm text-slate-400 mt-1">Quick revision notes with audio dictation.</p>
              </div>
            </div>

            {chapters.length > 0 ? (
              <div className="space-y-6">
                {chapters.map((chap, idx) => {
                  const summaryText = `Chapter ${chap.number}: ${chap.title}. This chapter covers key concepts which are highly tested. Remember to focus on the exceptions and statutory limits.`;
                  return (
                    <div key={idx} className="p-6 rounded-2xl bg-surface-card border border-surface-border space-y-4 relative overflow-hidden">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-xs font-bold text-emerald-400 mb-1">CHAPTER {chap.number}</div>
                          <h4 className="text-lg font-bold text-white mb-2">{chap.title}</h4>
                        </div>
                        <button 
                          onClick={() => handlePlayAudio(summaryText)}
                          className="p-3 rounded-full bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-colors flex-shrink-0"
                          title="Listen to Summary"
                        >
                          <Play className="w-5 h-5 ml-0.5" />
                        </button>
                      </div>
                      <div className="prose prose-invert prose-sm max-w-none text-slate-300">
                        <ul className="space-y-2 list-disc pl-4">
                          <li>Focus on Section provisions and time limits.</li>
                          <li>Review the latest amendments for this topic.</li>
                          <li>Key definition: Refers to the central concept outlined by ICAI guidelines.</li>
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-slate-400">No snapshots available.</p>
            )}
          </div>
        )}

        {/* MIND MAP TAB */}
        {activeTab === 'mindmap' && (
          <div className="glass-panel p-6 rounded-3xl border border-surface-border h-[600px] flex flex-col relative overflow-hidden">
            <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
              <BrainCircuit className="w-5 h-5 text-purple-400" /> Interactive Mind Map
            </h3>
            <p className="text-sm text-slate-400 mb-6">Visual structure of {subject.title}</p>
            
            <div className="flex-1 relative border border-surface-border rounded-2xl bg-surface/50 overflow-hidden flex items-center justify-center">
              <svg width="100%" height="100%" className="absolute inset-0 pointer-events-none">
                <path d="M 50% 20% L 30% 50%" stroke="rgba(167, 139, 250, 0.2)" strokeWidth="2" fill="none" />
                <path d="M 50% 20% L 70% 50%" stroke="rgba(167, 139, 250, 0.2)" strokeWidth="2" fill="none" />
                <path d="M 30% 50% L 15% 80%" stroke="rgba(167, 139, 250, 0.2)" strokeWidth="2" fill="none" />
                <path d="M 30% 50% L 45% 80%" stroke="rgba(167, 139, 250, 0.2)" strokeWidth="2" fill="none" />
                <path d="M 70% 50% L 85% 80%" stroke="rgba(167, 139, 250, 0.2)" strokeWidth="2" fill="none" />
              </svg>
              
              <div className="absolute top-[15%] left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-100 font-bold shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                {subject.title}
              </div>
              
              <div className="absolute top-[45%] left-[30%] -translate-x-1/2 px-4 py-2 rounded-xl bg-surface-card border border-surface-border text-slate-200 text-sm font-semibold hover:border-purple-500/50 cursor-pointer transition-colors">
                {chapters[0]?.title || 'Module 1'}
              </div>
              <div className="absolute top-[45%] left-[70%] -translate-x-1/2 px-4 py-2 rounded-xl bg-surface-card border border-surface-border text-slate-200 text-sm font-semibold hover:border-purple-500/50 cursor-pointer transition-colors">
                {chapters[1]?.title || 'Module 2'}
              </div>
              
              <div className="absolute top-[75%] left-[15%] -translate-x-1/2 px-3 py-1.5 rounded-lg bg-surface border border-surface-border text-slate-400 text-xs hover:text-white cursor-pointer transition-colors">
                Concepts
              </div>
              <div className="absolute top-[75%] left-[45%] -translate-x-1/2 px-3 py-1.5 rounded-lg bg-surface border border-surface-border text-slate-400 text-xs hover:text-white cursor-pointer transition-colors">
                Provisions
              </div>
              <div className="absolute top-[75%] left-[85%] -translate-x-1/2 px-3 py-1.5 rounded-lg bg-surface border border-surface-border text-slate-400 text-xs hover:text-white cursor-pointer transition-colors">
                Amendments
              </div>
            </div>
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

        {/* REVISION TAB */}
        {activeTab === 'revision' && (
          <div className="glass-panel p-6 rounded-3xl border border-surface-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" /> My Study Notes
              </h3>
              <button 
                onClick={saveNotes}
                disabled={savingNotes}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {savingNotes ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <PenTool className="w-4 h-4" />}
                {savingNotes ? 'Saving...' : 'Save Notes'}
              </button>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Write your mnemonics, formulas, and key summaries here..."
              className="w-full h-96 bg-surface/50 border border-surface-border rounded-xl p-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 resize-y"
            ></textarea>
          </div>
        )}

      </div>
    </div>
  );
}

















