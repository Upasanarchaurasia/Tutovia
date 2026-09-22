import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, Clock, HelpCircle, Play, CheckCircle2, XCircle, 
  Award, ArrowLeft, RotateCcw, BookOpen, ChevronRight, Activity 
} from 'lucide-react';
import axios from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useSearchParams } from 'react-router-dom';

const caSubjects = [
  // GROUP 1
  { id: "advanced-accounting", title: "Advanced Accounting", group: "Group 1", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  { id: "corporate-laws", title: "Corporate & Other Laws", group: "Group 1", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  { id: "taxation", title: "Taxation", group: "Group 1", color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
  // GROUP 2
  { id: "cost-management", title: "Cost & Management Accounting", group: "Group 2", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  { id: "auditing-ethics", title: "Auditing & Ethics", group: "Group 2", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  { id: "fm-sm", title: "Financial Management & Strategic Management", group: "Group 2", color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" }
];

export default function Exams() {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [activeSubject, setActiveSubject] = useState(null); // the subject selected from directory
  const [activeExam, setActiveExam] = useState(null); // full exam object when taking test
  const [filteredCaSubjects, setFilteredCaSubjects] = useState([]);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(300);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [examResult, setExamResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();
  const examIdParam = searchParams.get('examId');
  const subjectIdParam = searchParams.get('subject');

  const fetchExamsData = () => {
    setLoading(true);
    const uid = user?.id || '';
    Promise.all([
      axios.get(`/api/exams${uid ? `?userId=${uid}` : ''}`).catch(() => ({ data: [] })),
      axios.get(`/api/progress${uid ? `?userId=${uid}` : ''}`).catch(() => ({ data: { attempts: [] } })),
      axios.get(`/api/profile${uid ? `?userId=${uid}` : ''}`).catch(() => ({ data: { ca_group: 'Both Groups' } }))
    ])
    .then(([examsRes, progRes, profileRes]) => {
      const examsData = Array.isArray(examsRes.data) ? examsRes.data : [];
      const filteredExams = examsData.filter(e => e.id !== 'gk-1' && e.id !== 'gk-2');
      setExams(filteredExams);
      setAttempts(progRes.data?.attempts || []);
      
      const userGroup = profileRes.data?.ca_group || "Both Groups";
      let availableSubjects = caSubjects;
      if (userGroup !== "Both Groups") {
        availableSubjects = caSubjects.filter(s => s.group === userGroup);
      }
      setFilteredCaSubjects(availableSubjects);

      if (subjectIdParam) {
        const sub = availableSubjects.find(s => s.id === subjectIdParam);
        if (sub) setActiveSubject(sub);
      }
    })
    .catch(err => console.error(err))
    .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchExamsData();
  }, [subjectIdParam, user?.id]);

  useEffect(() => {
    if (examIdParam && !activeExam && !isSubmitted && exams.length > 0) {
      handleStartExam(examIdParam);
    }
  }, [examIdParam, exams]);

  // Timer effect when taking exam
  useEffect(() => {
    if (!activeExam || isSubmitted) return;
    if (timeLeft <= 0) {
      handleSubmitExam();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [activeExam, isSubmitted, timeLeft]);

  const handleStartExam = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/exams/${id}`);
      setActiveExam(res.data);
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      setTimeLeft(res.data.duration_sec || 300);
      setIsSubmitted(false);
      setExamResult(null);
      setSearchParams({ examId: id });
    } catch (err) {
      console.error('Failed to load exam details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (qIndex, optionIndex) => {
    setUserAnswers(prev => ({ ...prev, [qIndex]: optionIndex }));
  };

  const handleSubmitExam = async () => {
    if (!activeExam) return;
    try {
      const payload = {
        exam_id: activeExam.id,
        answers: userAnswers,
        time_taken_sec: activeExam.duration_sec - timeLeft
      };
      const res = await axios.post('/api/exams/submit', payload);
      setExamResult(res.data);
      setIsSubmitted(true);
      // Refresh attempts history
      const progRes = await axios.get('/api/progress');
      setAttempts(progRes.data.attempts || []);
    } catch (err) {
      console.error('Failed to submit exam:', err);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-sm">Preparing exam environment...</p>
      </div>
    );
  }

  // --- VIEW 1: ACTIVE EXAM RUNNER ---
  if (activeExam && !isSubmitted) {
    const q = activeExam.questions[currentQuestionIndex];
    const totalQ = activeExam.questions.length;
    const progressPct = ((currentQuestionIndex + 1) / totalQ) * 100;

    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
        <div className="glass-panel p-4 sm:p-6 rounded-3xl border border-surface-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveExam(null);
                setSearchParams({});
              }}
              className="p-2 rounded-xl bg-surface-card hover:bg-slate-800 text-slate-400 hover:text-white border border-surface-border"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">{activeExam.title}</h2>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-xs text-slate-400">Question {currentQuestionIndex + 1} of {totalQ}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-sm font-bold border ${
              timeLeft < 60 ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse' : 'bg-surface-card text-indigo-300 border-indigo-500/30'
            }`}>
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>{formatTime(timeLeft)}</span>
            </div>
            <button
              onClick={handleSubmitExam}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-static-white text-xs font-bold shadow-lg shadow-emerald-600/20"
            >
              Submit Quiz
            </button>
          </div>
        </div>

        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-300" style={{ width: `${progressPct}%` }} />
        </div>

        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-surface-border space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">Topic: {q.topic}</span>
            <span className="text-xs text-slate-400 font-mono">QID: #{q.id}</span>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-slate-100 leading-snug">{q.question}</h3>
          <div className="space-y-3 pt-2">
            {q.options.map((optionText, optIdx) => {
              const isSelected = userAnswers[currentQuestionIndex] === optIdx;
              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectAnswer(currentQuestionIndex, optIdx)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between ${
                    isSelected ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 shadow-md shadow-indigo-600/10' : 'bg-surface-card border-surface-border text-slate-300 hover:border-slate-600 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center font-semibold text-xs ${isSelected ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-600 text-slate-400'}`}>
                      {String.fromCharCode(65 + optIdx)}
                    </div>
                    <span className="text-sm font-medium">{optionText}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <button
            disabled={currentQuestionIndex === 0}
            onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
            className="px-6 py-3 rounded-2xl bg-surface-card hover:bg-slate-800 text-white text-sm font-semibold border border-surface-border transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            disabled={currentQuestionIndex === totalQ - 1}
            onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-static-white text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next Question
          </button>
        </div>
      </div>
    );
  }

  // --- VIEW 2: EXAM RESULTS ---
  if (isSubmitted && examResult) {
    const pct = examResult.attempt.score_pct;
    const isPass = pct >= 40;
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-bottom-8 duration-500">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-surface-border text-center space-y-6">
          <div className="flex justify-center">
            {isPass ? (
              <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center border-4 border-emerald-500/30">
                <Award className="w-12 h-12 text-emerald-400" />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-rose-500/20 flex items-center justify-center border-4 border-rose-500/30">
                <AlertCircle className="w-12 h-12 text-rose-400" />
              </div>
            )}
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-white mb-2">Exam Completed!</h2>
            <p className="text-slate-400">You scored <strong className={isPass ? 'text-emerald-400' : 'text-rose-400'}>{pct}%</strong> on {examResult.attempt.exam_title}</p>
          </div>
          <div className="flex items-center justify-center gap-4 pt-4">
            <button onClick={() => { setActiveExam(null); setIsSubmitted(false); setExamResult(null); setSearchParams({}); }} className="px-6 py-3 rounded-xl bg-surface-card hover:bg-slate-800 text-white text-sm font-semibold border border-surface-border transition-all">
              Back to Directory
            </button>
            <button onClick={() => handleStartExam(examResult.attempt.exam_id)} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-static-white text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all">
              <RotateCcw className="w-4 h-4" /> Retake Exam
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white px-2">Diagnostic Review</h3>
          {examResult.questions.map((q, idx) => {
            const userChoice = userAnswers[idx];
            const isCorrect = userChoice === q.correct;
            return (
              <div key={q.id} className={`glass-panel p-6 rounded-2xl border transition-all ${isCorrect ? 'border-emerald-500/30 bg-emerald-950/10' : 'border-rose-500/30 bg-rose-950/10'}`}>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${isCorrect ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                      {idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">Topic: {q.topic}</span>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                    {isCorrect ? 'Correct +20%' : 'Incorrect'}
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-100 mb-4">{q.question}</p>
                <div className="space-y-2 mb-4">
                  {q.options.map((optText, optIdx) => {
                    const isUserPick = userChoice === optIdx;
                    const isCorrectOpt = q.correct === optIdx;
                    let style = 'bg-surface-card border-surface-border text-slate-400';
                    if (isCorrectOpt) style = 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200 font-semibold';
                    else if (isUserPick && !isCorrect) style = 'bg-rose-500/20 border-rose-500/50 text-rose-200';
                    return (
                      <div key={optIdx} className={`p-3 rounded-xl border text-xs flex items-center justify-between ${style}`}>
                        <span>{String.fromCharCode(65 + optIdx)}. {optText}</span>
                        {isCorrectOpt && <span className="text-[10px] font-bold text-emerald-400 uppercase">Correct Answer</span>}
                        {isUserPick && !isCorrectOpt && <span className="text-[10px] font-bold text-rose-400 uppercase">Your Answer</span>}
                      </div>
                    );
                  })}
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <strong className="text-indigo-400 block mb-1">Coach Explanation:</strong>
                  {q.explanation}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // --- VIEW 3: NESTED SUBJECT MOCKS DIRECTORY ---
  if (activeSubject) {
    const subjectExams = exams.filter(e => e.id.includes(activeSubject.id));
    
    const handleGenerateAIQuiz = async () => {
      setLoading(true);
      try {
        const res = await axios.post('/api/exams/ai-generate', {
          subject: activeSubject.title,
          topic: 'General Revision',
          difficulty: 'medium'
        });
        
        // Add the generated exam to the local exams state temporarily so it renders
        setExams(prev => [res.data, ...prev]);
        setActiveExam(res.data);
        setTimeLeft(res.data.duration_sec || 900); // 15 mins
        setUserAnswers({});
      } catch (err) {
        console.error('Failed to generate AI quiz:', err);
        alert('Failed to generate AI quiz. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveSubject(null)}
            className="p-2.5 rounded-xl bg-surface-card hover:bg-slate-800 text-slate-400 hover:text-white border border-surface-border transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${activeSubject.bg} ${activeSubject.color} ${activeSubject.border}`}>
                {activeSubject.group}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white">{activeSubject.title} Mocks</h1>
          </div>
          <button
            onClick={handleGenerateAIQuiz}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all whitespace-nowrap"
          >
            <BrainCircuit className="w-4 h-4" /> Generate AI Quiz
          </button>
        </div>

        {subjectExams.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl border border-surface-border text-center">
            <Activity className="w-12 h-12 text-slate-600 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-bold text-slate-300 mb-2">No Scheduled Mocks Available Yet</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">But you can generate an unlimited AI-powered 5-question pop quiz to test your knowledge.</p>
            <button
              onClick={handleGenerateAIQuiz}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all shadow-lg shadow-indigo-500/20 inline-flex items-center gap-2"
            >
              <BrainCircuit className="w-4 h-4" /> Try AI Pop Quiz
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjectExams.map((exam) => {
              const bestAttempt = attempts.filter(a => a.exam_id === exam.id).sort((a,b) => b.score_pct - a.score_pct)[0];
              const isChapterMock = exam.id.includes('mock-');
              
              return (
                <div key={exam.id} className="glass-card glass-card-hover p-6 rounded-3xl border border-surface-border flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                        isChapterMock ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {isChapterMock ? 'Chapter Mock' : 'Full Subject Mock'}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-slate-400 font-mono">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{Math.round(exam.duration_sec / 60)} mins</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 leading-tight">{exam.title}</h3>
                    <p className="text-xs text-slate-400 mb-6 leading-relaxed line-clamp-2">{exam.description}</p>
                  </div>

                  <div>
                    {bestAttempt && (
                      <div className="flex items-center justify-between p-3 rounded-xl bg-surface mb-4 border border-surface-border">
                        <span className="text-xs text-slate-400 font-semibold">Best Score</span>
                        <span className={`text-sm font-bold ${bestAttempt.score_pct >= 40 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {bestAttempt.score_pct}%
                        </span>
                      </div>
                    )}
                    <button
                      onClick={() => handleStartExam(exam.id)}
                      className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-static-white text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                    >
                      {bestAttempt ? 'Retake Mock' : 'Start Mock'} <Play className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // --- VIEW 4: ROOT EXAMS DIRECTORY ---
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-surface-border text-center sm:text-left bg-gradient-to-r from-surface-card to-background">
        <div className="max-w-2xl mx-auto sm:mx-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
            <span>Interactive Assessment Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Subject-wise Mock Exams</h1>
          <p className="text-slate-400 text-sm mt-3 leading-relaxed">
            Test your knowledge across the entire CA Intermediate syllabus. Get detailed instant scoring, topic diagnostics, and AI tutor feedback to master your weaknesses before the real exam.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" /> Group 1 Subjects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {caSubjects.filter(s => s.group === 'Group 1').map(sub => (
            <button 
              key={sub.id}
              onClick={() => setActiveSubject(sub)}
              className="glass-panel p-6 rounded-3xl border border-surface-border text-left hover:border-indigo-500/50 hover:bg-slate-800/80 transition-all group flex flex-col justify-between h-32"
            >
              <h3 className="font-bold text-white text-lg leading-tight group-hover:text-indigo-300 transition-colors">{sub.title}</h3>
              <div className="flex items-center justify-between mt-4">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${sub.bg} ${sub.color} ${sub.border}`}>
                  {sub.group}
                </span>
                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-400" /> Group 2 Subjects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {caSubjects.filter(s => s.group === 'Group 2').map(sub => (
            <button 
              key={sub.id}
              onClick={() => setActiveSubject(sub)}
              className="glass-panel p-6 rounded-3xl border border-surface-border text-left hover:border-purple-500/50 hover:bg-slate-800/80 transition-all group flex flex-col justify-between h-32"
            >
              <h3 className="font-bold text-white text-lg leading-tight group-hover:text-purple-300 transition-colors">{sub.title}</h3>
              <div className="flex items-center justify-between mt-4">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${sub.bg} ${sub.color} ${sub.border}`}>
                  {sub.group}
                </span>
                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
