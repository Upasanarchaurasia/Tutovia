import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, Calendar, Clock, BookOpen, Sparkles } from 'lucide-react';

export default function EditTimetableModal({ isOpen, onClose, schedule, onSave }) {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    if (schedule) {
      setSessions(JSON.parse(JSON.stringify(schedule)));
    }
  }, [schedule, isOpen]);

  if (!isOpen) return null;

  const handleChange = (index, field, value) => {
    setSessions(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddSession = () => {
    const newSession = {
      id: `custom-slot-${Date.now()}`,
      timeRange: '02:00 PM - 03:30 PM',
      activity: 'Corporate & Other Laws Practice',
      focus: 'Company Law - Key Sections',
      type: 'study',
      status: 'Not Completed',
      done: false
    };
    setSessions(prev => [...prev, newSession]);
  };

  const handleDeleteSession = (index) => {
    setSessions(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(sessions);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-surface border border-surface-border w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-surface-border flex justify-between items-center bg-surface-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Edit Timetable Schedule</h2>
              <p className="text-xs text-slate-400">Modify timings, swap subjects, or add custom study slots</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-surface-border rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {sessions.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-sm">
              No sessions scheduled. Click below to add a session.
            </div>
          ) : (
            sessions.map((item, idx) => (
              <div 
                key={item.id || idx}
                className="p-4 rounded-2xl bg-surface-card border border-surface-border flex flex-col md:flex-row gap-3 items-start md:items-center justify-between"
              >
                {/* Time Range */}
                <div className="w-full md:w-44">
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Time Range
                  </label>
                  <input
                    type="text"
                    value={item.timeRange || item.time12 || item.time || ''}
                    onChange={(e) => handleChange(idx, 'timeRange', e.target.value)}
                    placeholder="09:00 AM - 10:30 AM"
                    className="w-full bg-surface border border-surface-border rounded-xl px-3 py-1.5 text-xs text-indigo-300 font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Activity / Subject */}
                <div className="flex-1 w-full">
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <BookOpen className="w-3 h-3" /> Subject / Activity
                  </label>
                  <input
                    type="text"
                    value={item.activity || item.title || ''}
                    onChange={(e) => handleChange(idx, 'activity', e.target.value)}
                    placeholder="Subject or Activity Name"
                    className="w-full bg-surface border border-surface-border rounded-xl px-3 py-1.5 text-xs text-white font-medium focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Focus / Topic */}
                <div className="w-full md:w-48">
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Focus Topic
                  </label>
                  <input
                    type="text"
                    value={item.focus || ''}
                    onChange={(e) => handleChange(idx, 'focus', e.target.value)}
                    placeholder="Focus or notes"
                    className="w-full bg-surface border border-surface-border rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Session Type */}
                <div className="w-full md:w-28">
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={item.type || 'study'}
                    onChange={(e) => handleChange(idx, 'type', e.target.value)}
                    className="w-full bg-surface border border-surface-border rounded-xl px-2 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="study">Study</option>
                    <option value="break">Break</option>
                    <option value="commitment">Commitment</option>
                    <option value="exam">Mock Exam</option>
                  </select>
                </div>

                {/* Delete Button */}
                <div className="pt-4 md:pt-0 self-end md:self-center">
                  <button
                    type="button"
                    onClick={() => handleDeleteSession(idx)}
                    className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
                    title="Delete session"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}

          {/* Add Session Button */}
          <button
            type="button"
            onClick={handleAddSession}
            className="w-full py-3 rounded-2xl border border-dashed border-indigo-500/40 hover:border-indigo-500 hover:bg-indigo-500/5 text-indigo-300 text-xs font-bold flex items-center justify-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Custom Study Block
          </button>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-surface-border bg-surface-card flex justify-between items-center">
          <span className="text-xs text-slate-400">
            {sessions.length} total session{sessions.length === 1 ? '' : 's'}
          </span>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-300 text-xs font-semibold hover:bg-surface-border transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg shadow-indigo-500/20"
            >
              <Save className="w-4 h-4" /> Save Timetable
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
