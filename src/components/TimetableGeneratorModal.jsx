import React, { useState, useEffect } from 'react';
import { X, Clock, Calendar, Info, AlertTriangle } from 'lucide-react';

export default function TimetableGeneratorModal({ isOpen, onClose, onGenerate, defaultHours }) {
  const [step, setStep] = useState(1);
  const [studyHours, setStudyHours] = useState(defaultHours || 8);
  const [customHours, setCustomHours] = useState('');
  const [availableHours, setAvailableHours] = useState('');
  
  const [wakeTime, setWakeTime] = useState('07:00');
  const [sleepTime, setSleepTime] = useState('23:00');
  const [commitments, setCommitments] = useState('09:00 - 13:00 College\n17:00 - 18:00 Gym');

  useEffect(() => {
    if (isOpen) {
      setStep(1);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStudyHoursSelect = (hours) => {
    setStudyHours(hours);
    setCustomHours('');
  };

  const handleCustomHoursChange = (e) => {
    setCustomHours(e.target.value);
    setStudyHours(e.target.value);
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleGenerate = () => {
    onGenerate({
      studyHours: parseInt(studyHours, 10),
      availableHours: parseInt(availableHours, 10) || parseInt(studyHours, 10),
      wakeTime,
      sleepTime,
      commitmentsStr: commitments
    });
    onClose();
  };

  const studyOptions = [2, 4, 6, 8, 10, 12, 14];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-surface-border w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-surface-border flex justify-between items-center bg-surface-card">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-indigo-400" />
            AI Timetable Generator
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-surface-border rounded-xl transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-lg font-semibold text-white">How many hours do you want to study?</h3>
              <div className="grid grid-cols-4 gap-3">
                {studyOptions.map(hrs => (
                  <button
                    key={hrs}
                    onClick={() => handleStudyHoursSelect(hrs)}
                    className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all ${
                      Number(studyHours) === hrs && customHours === ''
                        ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300'
                        : 'bg-surface-card border-surface-border text-slate-300 hover:border-indigo-400/50'
                    }`}
                  >
                    {hrs} hrs
                  </button>
                ))}
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-400 mb-2">Custom Hours</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={customHours}
                    onChange={handleCustomHoursChange}
                    className="flex-1 bg-surface-card border border-surface-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                    placeholder="E.g., 5"
                    min="1"
                    max="24"
                  />
                  <span className="text-slate-400 font-medium">hrs</span>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-lg font-semibold text-white">How many hours are realistically available for studying?</h3>
              <p className="text-sm text-slate-400">
                Be honest with yourself. This helps the AI adjust the schedule if your target of <strong className="text-indigo-300">{studyHours} hours</strong> is too ambitious for today.
              </p>
              
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={availableHours}
                  onChange={(e) => setAvailableHours(e.target.value)}
                  className="flex-1 bg-surface-card border border-surface-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 text-lg font-bold"
                  placeholder={`E.g., ${studyHours}`}
                  min="1"
                  max="24"
                />
                <span className="text-slate-400 font-medium text-lg">hrs</span>
              </div>

              {parseInt(studyHours) > parseInt(availableHours) && availableHours !== '' && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex gap-3 text-amber-300 text-sm">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                  <p>Your target ({studyHours}h) is higher than available time ({availableHours}h). The AI will create a realistic schedule prioritizing weaknesses, and may add optional extra sessions if possible.</p>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-lg font-semibold text-white mb-2">Daily Commitments & Timings</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Wake-up Time</label>
                  <input
                    type="time"
                    value={wakeTime}
                    onChange={(e) => setWakeTime(e.target.value)}
                    className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Sleep Time</label>
                  <input
                    type="time"
                    value={sleepTime}
                    onChange={(e) => setSleepTime(e.target.value)}
                    className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Fixed Commitments (College, Gym, Travel, etc.)</label>
                <p className="text-[10px] text-slate-500 mb-2">Format: HH:MM - HH:MM Activity Name. One per line.</p>
                <textarea
                  value={commitments}
                  onChange={(e) => setCommitments(e.target.value)}
                  className="w-full h-32 bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-white focus:outline-none text-sm font-mono"
                  placeholder="09:00 - 13:00 College&#10;17:00 - 18:30 Gym"
                />
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-surface-border bg-surface-card flex justify-between items-center mt-auto">
          <div className="flex gap-1.5">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-1.5 w-6 rounded-full ${step >= i ? 'bg-indigo-500' : 'bg-surface-border'}`} />
            ))}
          </div>
          
          <div className="flex gap-3">
            {step > 1 && (
              <button 
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 rounded-xl text-slate-300 font-semibold hover:bg-surface-border transition-colors"
              >
                Back
              </button>
            )}
            
            {step < 3 ? (
              <button 
                onClick={handleNext}
                className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors shadow-lg shadow-indigo-500/20"
              >
                Next
              </button>
            ) : (
              <button 
                onClick={handleGenerate}
                className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors shadow-lg shadow-indigo-500/20 flex items-center gap-2"
              >
                Generate Timetable
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
