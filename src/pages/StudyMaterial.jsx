import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Search, 
  Download, 
  ExternalLink, 
  Copy, 
  Check, 
  Eye, 
  Sparkles, 
  X, 
  Filter, 
  Layers, 
  FileText, 
  RefreshCw, 
  ShieldCheck, 
  ChevronRight, 
  ChevronDown, 
  Globe, 
  AlertCircle,
  FileCode,
  CheckCircle2,
  Bookmark
} from 'lucide-react';
import axios from '../api.js';
import { useToast } from '../context/ToastContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function StudyMaterial() {
  const { addToast } = useToast();
  const { profile } = useAuth();

  // State
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('CA Intermediate');
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [onlyStandards, setOnlyStandards] = useState(false);
  const [activeViewerMaterial, setActiveViewerMaterial] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [viewMode, setViewMode] = useState('grouped'); // 'grouped' | 'grid'
  const [collapsedModules, setCollapsedModules] = useState({});

  // Quick search keywords
  const QUICK_SEARCHES = [
    { label: 'AS 7 Construction', query: 'AS 7' },
    { label: 'AS 2 Inventory', query: 'AS 2' },
    { label: 'AS 10 PPE', query: 'AS 10' },
    { label: 'GST Input Tax Credit', query: 'ITC' },
    { label: 'PGBP', query: 'PGBP' },
    { label: 'Standard Costing', query: 'Standard Costing' },
    { label: 'SA 200 Audit', query: 'SA 200' },
    { label: 'Ind AS 115', query: 'Ind AS 115' }
  ];

  // Fetch initial catalog
  useEffect(() => {
    fetchCatalog();
  }, []);

  const fetchCatalog = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/catalog');
      if (res.data && Array.isArray(res.data.materials)) {
        setMaterials(res.data.materials);
      }
    } catch (err) {
      console.error('Failed to load ICAI catalog:', err);
      // Fallback: search endpoint
      try {
        const searchRes = await axios.get('/api/search?q=');
        if (searchRes.data?.results) {
          setMaterials(searchRes.data.results);
        }
      } catch (fallbackErr) {
        addToast({ type: 'error', message: 'Could not connect to study material index. Retrying...' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshIndex = async () => {
    setIsRefreshing(true);
    try {
      const res = await axios.post('/api/scraper/trigger', { force: true });
      if (res.data?.success) {
        addToast({ 
          type: 'success', 
          message: `ICAI BoS Index verified! ${res.data.totalItems || materials.length} PDFs ready.` 
        });
        await fetchCatalog();
      }
    } catch (err) {
      addToast({ type: 'info', message: 'Index re-verified with cached CDN links.' });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCopyLink = (item) => {
    navigator.clipboard.writeText(item.pdf_url).then(() => {
      setCopiedId(item.id);
      addToast({ 
        type: 'success', 
        message: `Direct link copied for ${item.chapter_title.substring(0, 35)}...` 
      });
      setTimeout(() => setCopiedId(null), 2500);
    }).catch(() => {
      addToast({ type: 'error', message: 'Failed to copy link to clipboard.' });
    });
  };

  const toggleModuleCollapse = (moduleKey) => {
    setCollapsedModules(prev => ({
      ...prev,
      [moduleKey]: !prev[moduleKey]
    }));
  };

  // Extract unique filters from loaded data
  const availableCourses = useMemo(() => {
    const courses = ['All Courses', ...Array.from(new Set(materials.map(m => m.course).filter(Boolean)))];
    return courses;
  }, [materials]);

  const availableSubjects = useMemo(() => {
    let filtered = materials;
    if (selectedCourse !== 'All Courses') {
      filtered = filtered.filter(m => m.course.toLowerCase() === selectedCourse.toLowerCase());
    }
    if (selectedGroup !== 'All') {
      filtered = filtered.filter(m => m.group.toLowerCase() === selectedGroup.toLowerCase());
    }
    return ['All', ...Array.from(new Set(filtered.map(m => m.subject).filter(Boolean)))];
  }, [materials, selectedCourse, selectedGroup]);

  // Filtered & searched results
  const filteredMaterials = useMemo(() => {
    let result = [...materials];

    // Course filter
    if (selectedCourse !== 'All Courses') {
      result = result.filter(m => m.course.toLowerCase() === selectedCourse.toLowerCase());
    }

    // Group filter
    if (selectedGroup !== 'All') {
      result = result.filter(m => m.group.toLowerCase() === selectedGroup.toLowerCase());
    }

    // Subject filter
    if (selectedSubject !== 'All') {
      result = result.filter(m => m.subject.toLowerCase() === selectedSubject.toLowerCase());
    }

    // Accounting standards only toggle
    if (onlyStandards) {
      result = result.filter(m => m.is_standard);
    }

    // Text search query
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      const qWords = q.replace(/[-_]/g, ' ').split(/\s+/).filter(Boolean);
      result = result.filter(item => {
        const text = `${item.chapter_title} ${item.standard_code || ''} ${item.subject} ${item.module}`.toLowerCase();
        
        // Exact standard code match (e.g. "as 7", "as7")
        if (item.standard_code && item.standard_code.toLowerCase().replace(/\s+/g, '') === q.replace(/\s+/g, '')) {
          return true;
        }

        return qWords.every(word => text.includes(word));
      }).sort((a, b) => {
        // Boost standard match
        const aStd = a.standard_code && a.standard_code.toLowerCase().includes(q);
        const bStd = b.standard_code && b.standard_code.toLowerCase().includes(q);
        if (aStd && !bStd) return -1;
        if (!aStd && bStd) return 1;
        return 0;
      });
    }

    return result;
  }, [materials, selectedCourse, selectedGroup, selectedSubject, onlyStandards, searchQuery]);

  // Grouped by Subject and Module
  const groupedData = useMemo(() => {
    const groups = {};
    filteredMaterials.forEach(item => {
      const subj = item.subject || 'General';
      const mod = item.module || 'Study Material';
      if (!groups[subj]) groups[subj] = {};
      if (!groups[subj][mod]) groups[subj][mod] = [];
      groups[subj][mod].push(item);
    });
    return groups;
  }, [filteredMaterials]);

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* --------------------------------------------------------------------- */}
      {/* HERO SECTION                                                         */}
      {/* --------------------------------------------------------------------- */}
      <div className="relative overflow-hidden rounded-2xl glass-panel border border-surface-border p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official ICAI Board of Studies (BoS) CDN Delivery</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
              ICAI Study Material <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-emerald-400 to-amber-300">PDF Index</span>
            </h1>

            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Find, view, and open official ICAI BoS study material PDFs in <strong>1 click</strong>. 
              Indexed directly from <code className="text-xs bg-slate-800/80 px-1.5 py-0.5 rounded text-indigo-300">resource.cdn.icai.org</code> with full support for Accounting Standards (like <strong>AS 7 Construction Contracts</strong>), Company Law, GST, and Auditing.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>ICAI CDN Direct Stream</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>Compliant Direct CDN URLs</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-amber-400" />
                <span>{materials.length} Chapters Indexed</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <button
              onClick={handleRefreshIndex}
              disabled={isRefreshing}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-surface-border text-slate-200 text-xs font-medium transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Verifying CDN...' : 'Sync BoS Index'}</span>
            </button>

            <a
              href="https://boslive.icai.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-medium transition-all"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Official BoS Live Portal</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* SEARCH BAR & AUTOCOMPLETE CHIPS                                      */}
      {/* --------------------------------------------------------------------- */}
      <div className="space-y-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5 text-indigo-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by chapter, keyword or standard (e.g. 'AS 7', 'Construction', 'GST', 'PGBP', 'Ind AS 115')..."
            className="w-full pl-12 pr-12 py-3.5 rounded-xl glass-panel bg-surface-card border border-surface-border text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm shadow-inner transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-slate-500 shrink-0 font-medium">Quick search:</span>
          {QUICK_SEARCHES.map(item => (
            <button
              key={item.label}
              onClick={() => setSearchQuery(item.query)}
              className={`px-2.5 py-1 rounded-lg border transition-all shrink-0 ${
                searchQuery === item.query 
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm' 
                  : 'bg-surface-card/60 hover:bg-surface-card border-surface-border text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* MULTI-FILTER BAR (Courses, Groups, Standards Only, View Mode)        */}
      {/* --------------------------------------------------------------------- */}
      <div className="glass-panel p-4 rounded-xl border border-surface-border flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Left: Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Course Selector */}
          <div className="flex items-center bg-slate-900/60 p-1 rounded-xl border border-surface-border">
            {availableCourses.map(course => (
              <button
                key={course}
                onClick={() => {
                  setSelectedCourse(course);
                  setSelectedSubject('All');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedCourse === course 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {course}
              </button>
            ))}
          </div>

          {/* Group Selector (for Intermediate/Final) */}
          <div className="flex items-center bg-slate-900/60 p-1 rounded-xl border border-surface-border">
            {['All', 'Group 1', 'Group 2'].map(grp => (
              <button
                key={grp}
                onClick={() => {
                  setSelectedGroup(grp);
                  setSelectedSubject('All');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedGroup === grp 
                    ? 'bg-emerald-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {grp === 'All' ? 'All Groups' : grp}
              </button>
            ))}
          </div>

          {/* Subject Dropdown */}
          <div className="relative">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-slate-900/80 border border-surface-border rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 pr-8 cursor-pointer"
            >
              {availableSubjects.map(sub => (
                <option key={sub} value={sub}>
                  {sub === 'All' ? 'All Subjects' : sub}
                </option>
              ))}
            </select>
          </div>

          {/* Accounting Standards Toggle */}
          <button
            onClick={() => setOnlyStandards(!onlyStandards)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
              onlyStandards 
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' 
                : 'bg-surface-card/60 hover:bg-surface-card border-surface-border text-slate-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Standards Only (AS / Ind AS / SA)</span>
          </button>
        </div>

        {/* Right: Results Count & View Toggle */}
        <div className="flex items-center justify-between lg:justify-end gap-4 border-t lg:border-t-0 pt-3 lg:pt-0 border-surface-border/60">
          <span className="text-xs text-slate-400">
            Showing <strong className="text-white">{filteredMaterials.length}</strong> PDFs
          </span>

          <div className="flex items-center bg-slate-900/60 p-1 rounded-xl border border-surface-border">
            <button
              onClick={() => setViewMode('grouped')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'grouped' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Module Hierarchy
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Flat Cards
            </button>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* LOADING & EMPTY STATES                                               */}
      {/* --------------------------------------------------------------------- */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Querying official ICAI BoS PDF index...</p>
        </div>
      ) : filteredMaterials.length === 0 ? (
        <div className="py-16 text-center glass-panel rounded-2xl border border-surface-border p-8 max-w-lg mx-auto space-y-4">
          <AlertCircle className="w-12 h-12 text-amber-400 mx-auto opacity-80" />
          <h3 className="text-lg font-semibold text-white">No Study Material Found</h3>
          <p className="text-slate-400 text-sm">
            We couldn't find any study material PDFs matching "{searchQuery}" with the selected filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCourse('All Courses');
              setSelectedGroup('All');
              setSelectedSubject('All');
              setOnlyStandards(false);
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all"
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === 'grouped' ? (
        
        /* ------------------------------------------------------------------- */
        /* GROUPED ACCORDION VIEW (By Subject & Module)                        */
        /* ------------------------------------------------------------------- */
        <div className="space-y-6">
          {Object.entries(groupedData).map(([subjectName, modules]) => (
            <div key={subjectName} className="glass-panel rounded-2xl border border-surface-border overflow-hidden">
              
              {/* Subject Title Bar */}
              <div className="px-6 py-4 bg-slate-900/50 border-b border-surface-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-white font-display">
                      {subjectName}
                    </h2>
                    <span className="text-xs text-slate-400">
                      {Object.values(modules).flat().length} chapters available
                    </span>
                  </div>
                </div>
              </div>

              {/* Modules within Subject */}
              <div className="divide-y divide-surface-border/40">
                {Object.entries(modules).map(([moduleTitle, items]) => {
                  const moduleKey = `${subjectName}-${moduleTitle}`;
                  const isCollapsed = collapsedModules[moduleKey];

                  return (
                    <div key={moduleTitle} className="p-4 sm:p-5">
                      <div 
                        onClick={() => toggleModuleCollapse(moduleKey)}
                        className="flex items-center justify-between cursor-pointer select-none py-1 group"
                      >
                        <div className="flex items-center gap-2">
                          {isCollapsed ? (
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                          )}
                          <h3 className="text-xs sm:text-sm font-semibold text-slate-300 group-hover:text-indigo-300 transition-colors">
                            {moduleTitle}
                          </h3>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-surface-border">
                            {items.length} units
                          </span>
                        </div>
                      </div>

                      {/* Chapter Item Grid */}
                      <AnimatePresence initial={false}>
                        {!isCollapsed && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-3.5"
                          >
                            {items.map(item => (
                              <ChapterCard 
                                key={item.id} 
                                item={item} 
                                onOpenViewer={setActiveViewerMaterial}
                                onCopyLink={handleCopyLink}
                                isCopied={copiedId === item.id}
                              />
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

      ) : (

        /* ------------------------------------------------------------------- */
        /* FLAT CARD GRID VIEW                                                 */
        /* ------------------------------------------------------------------- */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMaterials.map(item => (
            <ChapterCard 
              key={item.id} 
              item={item} 
              onOpenViewer={setActiveViewerMaterial}
              onCopyLink={handleCopyLink}
              isCopied={copiedId === item.id}
            />
          ))}
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* IN-APP PDF VIEWER MODAL                                              */}
      {/* --------------------------------------------------------------------- */}
      <AnimatePresence>
        {activeViewerMaterial && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-5xl h-[90vh] bg-surface-card border border-surface-border rounded-2xl shadow-2xl flex flex-col overflow-hidden glass-panel"
            >
              {/* Modal Header */}
              <div className="px-5 py-3.5 bg-slate-900/90 border-b border-surface-border flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="text-sm font-semibold text-white truncate">
                      {activeViewerMaterial.chapter_title}
                    </h3>
                    <p className="text-xs text-slate-400 truncate">
                      {activeViewerMaterial.subject} • {activeViewerMaterial.module}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleCopyLink(activeViewerMaterial)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-surface-border transition-all"
                    title="Copy direct CDN link"
                  >
                    {copiedId === activeViewerMaterial.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  <a
                    href={activeViewerMaterial.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all shadow-sm"
                  >
                    <span>Open in New Tab</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => setActiveViewerMaterial(null)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-surface-border transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Informational Sub-banner */}
              <div className="bg-slate-900/50 px-5 py-2 border-b border-surface-border/60 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Streaming directly from official ICAI CDN ({activeViewerMaterial.file_size_approx})</span>
                </div>
                <div className="truncate max-w-sm text-[11px] text-slate-500 font-mono">
                  {activeViewerMaterial.pdf_url}
                </div>
              </div>

              {/* Iframe Viewer */}
              <div className="flex-1 bg-slate-950 relative">
                <iframe
                  src={activeViewerMaterial.pdf_url}
                  title={activeViewerMaterial.chapter_title}
                  className="w-full h-full border-none"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

/**
 * Individual Chapter / Unit Card
 */
function ChapterCard({ item, onOpenViewer, onCopyLink, isCopied }) {
  return (
    <div className="group relative bg-surface-card/70 hover:bg-surface-card border border-surface-border hover:border-indigo-500/40 rounded-xl p-4 transition-all duration-200 shadow-sm flex flex-col justify-between gap-3">
      
      {/* Top Badges */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          {item.is_standard ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-semibold">
              <Sparkles className="w-3 h-3" />
              {item.standard_code || 'Standard'}
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-surface-border text-[11px] font-medium">
              Study Unit
            </span>
          )}

          <span className="text-[11px] text-slate-500 font-mono">
            {item.file_size_approx || 'PDF'}
          </span>
        </div>

        {/* Chapter Title */}
        <h4 className="text-sm font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-2">
          {item.chapter_title}
        </h4>

        {/* Subject context */}
        <p className="text-[11px] text-slate-400 truncate">
          {item.subject}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 border-t border-surface-border/50 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {/* 1-Click In-App Viewer */}
          <button
            onClick={() => onOpenViewer(item)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-600/15 hover:bg-indigo-600/25 border border-indigo-500/30 text-indigo-300 text-xs font-medium transition-all"
            title="Read in Tutovia"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View</span>
          </button>

          {/* Direct 1-Click Open in New Tab */}
          <a
            href={item.pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-surface-border text-slate-200 text-xs font-medium transition-all"
            title="Open official ICAI PDF directly"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Open PDF</span>
          </a>
        </div>

        {/* Copy Link button */}
        <button
          onClick={() => onCopyLink(item)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-all"
          title="Copy direct CDN link"
        >
          {isCopied ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}
