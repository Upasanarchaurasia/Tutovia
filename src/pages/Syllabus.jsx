import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  CheckCircle2, 
  ExternalLink, 
  Search, 
  Filter, 
  GraduationCap, 
  FileText, 
  Video, 
  Layers, 
  Award, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  ArrowRight,
  RotateCcw,
  Check,
  Clock,
  Bookmark
} from 'lucide-react';
import { CA_STAGES, SYLLABUS_BY_STAGE } from '../data/syllabusData.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import axios from '../api.js';

const STATUS_CONFIG = {
  not_started: { label: 'Not Started', color: 'bg-slate-800 text-slate-400 border-slate-700', icon: Clock },
  in_progress: { label: 'In Progress', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30', icon: Clock },
  rev_1: { label: 'Revision 1 Done', color: 'bg-blue-500/15 text-blue-300 border-blue-500/30', icon: RotateCcw },
  rev_2: { label: 'Revision 2 Done', color: 'bg-purple-500/15 text-purple-300 border-purple-500/30', icon: Award },
  completed: { label: 'Mastered', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', icon: CheckCircle2 }
};

export default function Syllabus() {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [activeStage, setActiveStage] = useState('intermediate');
  const [activeGroup, setActiveGroup] = useState('all'); // 'all', 'Group 1', 'Group 2'
  const [searchQuery, setSearchQuery] = useState('');
  const [chapterProgress, setChapterProgress] = useState({});
  const [expandedPapers, setExpandedPapers] = useState({});
  const [loading, setLoading] = useState(true);

  const storageKey = `tutovia_syllabus_progress_${user?.id || 'guest'}`;

  // Fetch initial syllabus progress
  useEffect(() => {
    const uid = user?.id || '';
    // 1. Load from localStorage
    try {
      const local = JSON.parse(localStorage.getItem(storageKey) || '{}');
      setChapterProgress(local);
    } catch {
      // ignore
    }

    // 2. Load from server
    axios.get(`/api/syllabus/progress${uid ? `?userId=${uid}` : ''}`)
      .then(res => {
        if (res.data && typeof res.data === 'object') {
          setChapterProgress(prev => {
            const merged = { ...prev, ...res.data };
            try {
              localStorage.setItem(storageKey, JSON.stringify(merged));
            } catch {}
            return merged;
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    // Also fetch profile to pre-select student's stage & group
    if (uid) {
      axios.get(`/api/profile?userId=${uid}`).then(res => {
        if (res.data?.ca_stage) {
          setActiveStage(res.data.ca_stage);
        }
        if (res.data?.ca_group && (res.data.ca_group === 'Group 1' || res.data.ca_group === 'Group 2')) {
          setActiveGroup(res.data.ca_group);
        }
      }).catch(() => {});
    }
  }, [user?.id]);

  // Set all papers expanded by default on stage change
  useEffect(() => {
    const stageData = SYLLABUS_BY_STAGE[activeStage];
    if (stageData?.papers) {
      const initExpanded = {};
      stageData.papers.forEach(p => {
        initExpanded[p.id] = true;
      });
      setExpandedPapers(initExpanded);
    }
  }, [activeStage]);

  const handleStatusChange = async (chapterKey, nextStatus) => {
    const updated = { ...chapterProgress, [chapterKey]: nextStatus };
    setChapterProgress(updated);

    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {}

    addToast(`Chapter marked as: ${STATUS_CONFIG[nextStatus]?.label || nextStatus}`, 'success');

    try {
      await axios.post('/api/syllabus/progress', {
        userId: user?.id,
        chapterId: chapterKey,
        status: nextStatus
      });
    } catch {
      // Background sync fail is silently kept in localStorage
    }
  };

  const currentStageData = useMemo(() => {
    return SYLLABUS_BY_STAGE[activeStage] || SYLLABUS_BY_STAGE.intermediate;
  }, [activeStage]);

  const currentStageMeta = useMemo(() => {
    return CA_STAGES.find(s => s.id === activeStage) || CA_STAGES[1];
  }, [activeStage]);

  // Filter papers by group and search query
  const filteredPapers = useMemo(() => {
    if (!currentStageData?.papers) return [];
    
    return currentStageData.papers.filter(paper => {
      // Group filter
      if (activeGroup !== 'all' && paper.group && paper.group !== activeGroup) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesPaper = paper.title.toLowerCase().includes(q) || 
                             paper.code.toLowerCase().includes(q) || 
                             paper.shortTitle.toLowerCase().includes(q);
        
        const matchesChapter = (paper.chapters || []).some(ch => 
          ch.title.toLowerCase().includes(q) || 
          (ch.topics || []).some(t => t.toLowerCase().includes(q))
        );

        return matchesPaper || matchesChapter;
      }

      return true;
    });
  }, [currentStageData, activeGroup, searchQuery]);

  // Compute Overall Stage Statistics
  const overallStats = useMemo(() => {
    const papers = currentStageData?.papers || [];
    let totalChapters = 0;
    let completedChapters = 0;
    let inProgressChapters = 0;

    papers.forEach(paper => {
      (paper.chapters || []).forEach(ch => {
        totalChapters++;
        const key = `${paper.id}-ch-${ch.no}`;
        const st = chapterProgress[key];
        if (st === 'completed') {
          completedChapters++;
        } else if (st && st !== 'not_started') {
          inProgressChapters++;
        }
      });
    });

    const completionRate = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;
    return { totalChapters, completedChapters, inProgressChapters, completionRate };
  }, [currentStageData, chapterProgress]);

  const togglePaperExpand = (paperId) => {
    setExpandedPapers(prev => ({
      ...prev,
      [paperId]: !prev[paperId]
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* 1. Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden border border-indigo-500/20 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>Official ICAI Syllabus & Active Revision Tracker</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              ICAI Syllabus Hub
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
              Complete chapter breakdown, marks weightage, direct BoS study materials, and personal chapter revision checklist.
            </p>
          </div>

          {/* Quick Overall Progress Card */}
          <div className="flex items-center gap-4 bg-surface-card border border-surface-border rounded-2xl p-4 shadow-md">
            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-surface-border" strokeWidth="3" />
                <circle 
                  cx="18" 
                  cy="18" 
                  r="16" 
                  fill="none" 
                  className="stroke-indigo-500 transition-all duration-700" 
                  strokeWidth="3" 
                  strokeDasharray="100" 
                  strokeDashoffset={100 - overallStats.completionRate} 
                  strokeLinecap="round" 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs font-black text-white">{overallStats.completionRate}%</span>
              </div>
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Syllabus Completion</span>
              <div className="text-sm font-bold text-white">
                {overallStats.completedChapters} of {overallStats.totalChapters} Chapters Mastered
              </div>
              <span className="text-xs text-indigo-400 font-medium">
                {overallStats.inProgressChapters} currently in progress
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CA Stage Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {CA_STAGES.map(stage => {
          const isActive = activeStage === stage.id;
          return (
            <button
              key={stage.id}
              onClick={() => {
                setActiveStage(stage.id);
                setActiveGroup('all');
              }}
              className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                isActive 
                  ? 'bg-gradient-to-br from-indigo-950/60 to-surface-card border-indigo-500/50 shadow-lg shadow-indigo-500/10' 
                  : 'bg-surface-card border-surface-border hover:border-slate-600 text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{stage.emoji}</span>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                )}
              </div>
              <div>
                <h3 className={`font-bold text-sm leading-tight ${isActive ? 'text-white' : 'text-slate-300'}`}>
                  {stage.label}
                </h3>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  {stage.schemes?.[0] || 'Official Scheme'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Stage Info & Controls Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-surface-border">
        {/* Group Tabs (for Intermediate & Final) */}
        {(activeStage === 'intermediate' || activeStage === 'final') ? (
          <div className="flex items-center gap-1.5 p-1 bg-surface-card border border-surface-border rounded-xl">
            {[
              { id: 'all', label: 'All Papers' },
              { id: 'Group 1', label: 'Group 1 (3 Papers)' },
              { id: 'Group 2', label: 'Group 2 (3 Papers)' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveGroup(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeGroup === tab.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="font-semibold text-slate-200">{currentStageMeta.label}</span>
            <span>• 4 Comprehensive Papers</span>
          </div>
        )}

        {/* Search Bar & ICAI BoS Link */}
        <div className="flex items-center gap-3 flex-1 max-w-md ml-auto">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search papers, chapters, AS/SA, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-card border border-surface-border rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <a
            href={currentStageMeta.icaiPortal}
            target="_blank"
            rel="noopener noreferrer"
            title="Open ICAI Official BoS Knowledge Portal"
            className="p-2.5 rounded-xl bg-surface-card hover:bg-slate-800 text-slate-300 hover:text-indigo-300 border border-surface-border text-xs flex items-center gap-1.5 shrink-0 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">ICAI Portal</span>
          </a>
        </div>
      </div>

      {/* 4. Papers & Chapter Breakdown List */}
      <div className="space-y-6">
        {filteredPapers.length > 0 ? (
          filteredPapers.map(paper => {
            const isExpanded = expandedPapers[paper.id] !== false;
            const chapters = paper.chapters || [];
            
            // Calculate paper progress
            const paperTotal = chapters.length;
            const paperCompleted = chapters.filter(ch => chapterProgress[`${paper.id}-ch-${ch.no}`] === 'completed').length;
            const paperPct = paperTotal > 0 ? Math.round((paperCompleted / paperTotal) * 100) : 0;

            return (
              <div 
                key={paper.id} 
                className="glass-panel rounded-3xl border border-surface-border overflow-hidden transition-all shadow-md"
              >
                {/* Paper Header */}
                <div 
                  onClick={() => togglePaperExpand(paper.id)}
                  className="p-6 cursor-pointer hover:bg-slate-800/40 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4 select-none"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
                          {paper.code}
                        </span>
                        {paper.group && (
                          <span className="text-[10px] font-bold text-slate-400">
                            • {paper.group}
                          </span>
                        )}
                        <span className="text-[10px] font-bold text-emerald-400">
                          • {paper.marks} Marks
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {paper.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {chapters.length} Chapters • {paperCompleted} Completed ({paperPct}%)
                      </p>
                    </div>
                  </div>

                  {/* Quick Action Links & Expand Icon */}
                  <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-surface-border">
                    {/* Official ICAI Links */}
                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      {paper.officialPdfUrl && (
                        <a 
                          href={paper.officialPdfUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="px-2.5 py-1.5 rounded-lg bg-surface-card hover:bg-slate-800 text-slate-300 hover:text-white border border-surface-border text-[11px] font-semibold flex items-center gap-1 transition-colors"
                          title="Open ICAI Study Material PDF"
                        >
                          <FileText className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Module</span>
                        </a>
                      )}
                      {paper.rtpUrl && (
                        <a 
                          href={paper.rtpUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="px-2.5 py-1.5 rounded-lg bg-surface-card hover:bg-slate-800 text-slate-300 hover:text-white border border-surface-border text-[11px] font-semibold flex items-center gap-1 transition-colors"
                          title="Open Latest Revision Test Paper (RTP)"
                        >
                          <FileText className="w-3.5 h-3.5 text-amber-400" />
                          <span>RTP</span>
                        </a>
                      )}
                      {paper.mtpUrl && (
                        <a 
                          href={paper.mtpUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="px-2.5 py-1.5 rounded-lg bg-surface-card hover:bg-slate-800 text-slate-300 hover:text-white border border-surface-border text-[11px] font-semibold flex items-center gap-1 transition-colors"
                          title="Open Mock Test Paper (MTP)"
                        >
                          <FileText className="w-3.5 h-3.5 text-emerald-400" />
                          <span>MTP</span>
                        </a>
                      )}
                    </div>

                    <div className="w-8 h-8 rounded-xl bg-surface-card border border-surface-border flex items-center justify-center text-slate-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Chapters Section (Collapsible) */}
                {isExpanded && (
                  <div className="border-t border-surface-border bg-surface-card/40 p-6 space-y-4">
                    {/* Paper Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1.5 font-medium">
                        <span className="text-slate-400">Paper Mastery</span>
                        <span className="text-indigo-400 font-bold">{paperPct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-card rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500" 
                          style={{ width: `${paperPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Chapter Cards Grid */}
                    <div className="grid grid-cols-1 gap-3">
                      {chapters.map(ch => {
                        const chapterKey = `${paper.id}-ch-${ch.no}`;
                        const currentStatus = chapterProgress[chapterKey] || 'not_started';
                        const statusMeta = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.not_started;
                        const StatusIcon = statusMeta.icon;

                        return (
                          <div 
                            key={ch.no} 
                            className="p-4 rounded-2xl bg-surface-card border border-surface-border hover:border-slate-600 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group"
                          >
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                <span className="text-[11px] font-mono font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                                  Ch {ch.no}
                                </span>
                                {ch.marks && (
                                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                                    ★ {ch.marks} Marks
                                  </span>
                                )}
                              </div>
                              <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                                {ch.title}
                              </h4>
                              {ch.topics && ch.topics.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                  {ch.topics.map((t, idx) => (
                                    <span key={idx} className="text-[10px] text-slate-400 bg-slate-900/60 px-2 py-0.5 rounded-md border border-slate-800">
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Status Selector & Quick Practice Links */}
                            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-between md:justify-end pt-3 md:pt-0 border-t md:border-t-0 border-surface-border">
                              {/* Status Dropdown / Cycle Button */}
                              <div className="flex items-center gap-1 bg-background/60 p-1 rounded-xl border border-surface-border">
                                {Object.entries(STATUS_CONFIG).map(([statusKey, meta]) => {
                                  const isSelected = currentStatus === statusKey;
                                  return (
                                    <button
                                      key={statusKey}
                                      onClick={() => handleStatusChange(chapterKey, statusKey)}
                                      title={meta.label}
                                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                                        isSelected 
                                          ? meta.color + ' border shadow-sm' 
                                          : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                                      }`}
                                    >
                                      {isSelected && <Check className="w-3 h-3" />}
                                      <span>{meta.label.split(' ')[0]}</span>
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Quick Action Links */}
                              <Link
                                to={`/exams?examId=${paper.id}`}
                                className="p-2 rounded-xl bg-surface-card hover:bg-slate-800 text-slate-300 hover:text-emerald-300 border border-surface-border text-xs flex items-center gap-1 transition-colors"
                                title="Practice Chapter MCQs & Quizzes"
                              >
                                <Award className="w-3.5 h-3.5 text-emerald-400" />
                              </Link>
                              <Link
                                to="/flashcards"
                                className="p-2 rounded-xl bg-surface-card hover:bg-slate-800 text-slate-300 hover:text-indigo-300 border border-surface-border text-xs flex items-center gap-1 transition-colors"
                                title="Review Related Flashcards"
                              >
                                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center glass-panel rounded-3xl border border-surface-border">
            <BookOpen className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <h3 className="text-white font-bold text-lg mb-1">No Papers Match Your Filter</h3>
            <p className="text-slate-400 text-xs mb-4">Try clearing the search query or adjusting your group filter.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveGroup('all');
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
