import React from 'react';
import { BookOpen, Award, GraduationCap, Brain, ChevronRight, Sparkles } from 'lucide-react';
import { TRACK_LIST } from '../academicTracks.js';

const ICON_MAP = {
  BookOpen: BookOpen,
  Award: Award,
  GraduationCap: GraduationCap,
  Brain: Brain
};

export default function AcademicTrackSelector({ 
  activeTrackId, 
  onSelectTrack, 
  variant = 'compact', // 'compact' | 'cards' | 'banner'
  isDarkTheme = false 
}) {
  if (variant === 'cards') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
        {TRACK_LIST.map((track) => {
          const Icon = ICON_MAP[track.icon] || BookOpen;
          const isSelected = activeTrackId === track.id;

          return (
            <button
              key={track.id}
              onClick={() => onSelectTrack(track.id)}
              className={`text-left p-4 rounded-2xl border-2 transition-all duration-200 relative overflow-hidden group focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                isSelected
                  ? isDarkTheme 
                    ? 'bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-950/50 text-white' 
                    : 'bg-white border-indigo-600 shadow-md shadow-indigo-100 text-slate-900'
                  : isDarkTheme
                    ? 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700 text-slate-300'
                    : 'bg-white/70 border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider">
                  <Sparkles size={10} />
                  <span>Active</span>
                </div>
              )}
              <div className="flex items-center gap-2.5 mb-2">
                <div 
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold shadow-sm"
                  style={{ backgroundColor: track.color }}
                >
                  <Icon size={16} />
                </div>
                <div>
                  <div className="text-[11px] font-semibold opacity-70 uppercase tracking-wider">
                    {track.category}
                  </div>
                  <div className="text-sm font-bold tracking-tight">
                    {track.shortName}
                  </div>
                </div>
              </div>
              <p className="text-xs line-clamp-2 opacity-80 leading-relaxed">
                {track.tagline}
              </p>
            </button>
          );
        })}
      </div>
    );
  }

  // Compact / Pill bar mode (Default for top of hero, hub, and headers)
  return (
    <div className="w-full overflow-x-auto pb-1 scrollbar-none">
      <div className={`inline-flex items-center gap-1.5 p-1 rounded-2xl border ${
        isDarkTheme ? 'bg-[#0B1120]/80 border-slate-800' : 'bg-slate-100/90 border-slate-200/80 shadow-inner'
      }`}>
        <div className="px-2.5 py-1 text-[11px] font-black uppercase tracking-wider opacity-60 flex items-center gap-1 shrink-0">
          <GraduationCap size={13} className="text-indigo-500" />
          <span>Stage:</span>
        </div>

        {TRACK_LIST.map((track) => {
          const Icon = ICON_MAP[track.icon] || BookOpen;
          const isSelected = activeTrackId === track.id;

          return (
            <button
              key={track.id}
              onClick={() => onSelectTrack(track.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : isDarkTheme
                    ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <Icon size={13} className={isSelected ? 'text-white' : 'opacity-70'} />
              <span>{track.shortName}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
