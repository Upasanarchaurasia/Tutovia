import re

with open('src/pages/Subject.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

header_match = re.search(r'(?s)(.*?<div className=\"mt-6\">\s*)', content)
header = header_match.group(1) if header_match else ''

footers = re.findall(r'(?s)(        \{/\* SNAPSHOTS \& AUDIO TAB \*/\}.*)', content)
footer = footers[-1] if footers else ''

middle = '''
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
                        <div key={idx} className={`p-4 rounded-2xl bg-surface-card border transition-all ${isCompleted ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-surface-border hover:border-indigo-500/30'}`}>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={() => toggleChapter(ch.no)}
                                aria-label="Toggle Chapter Completion"
                                className={`w-6 h-6 shrink-0 rounded-md border flex items-center justify-center transition-all ${isCompleted ? 'bg-emerald-500 border-emerald-400 shadow-lg shadow-emerald-500/20' : 'bg-surface border-slate-500 hover:border-indigo-400'}`}
                              >
                                {isCompleted && <CheckCircle2 className="w-4 h-4 text-white" />}
                              </button>
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${isCompleted ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : `bg-${subject.color}-500/10 border border-${subject.color}-500/20 text-${subject.color}-400`}`}>
                                {ch.no}
                              </div>
                              <h4 className={`text-sm font-bold ${isCompleted ? 'text-emerald-100' : 'text-white'}`}>{ch.title}</h4>
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
                        <div className="text-sm font-bold text-white mb-1">RTP — {profile?.attempt || 'September 2026'}</div>
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
                        <div className="text-sm font-bold text-white mb-1">MTP Series 1 & 2 — {profile?.attempt || 'September 2026'}</div>
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
                        to={`/exams?examId=mock-${subject.id}-${chapter.id}`}
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
'''

final_content = header + middle + '\n' + footer

with open('src/pages/Subject.jsx', 'w', encoding='utf-8') as f:
    f.write(final_content)
print('SUCCESS!')
