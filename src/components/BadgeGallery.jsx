import React from 'react';
import { Trophy, Flame, Layers, Star, Zap, Lock } from 'lucide-react';

const BADGES = [
  {
    id: 'first_mock',
    label: 'First Mock',
    description: 'Complete your first mock exam',
    emoji: '🥇',
    icon: Trophy,
    color: 'amber',
    condition: (progress) => (progress?.completed_exams || 0) >= 1
  },
  {
    id: 'streak_7',
    label: '7-Day Streak',
    description: 'Study for 7 consecutive days',
    emoji: '🔥',
    icon: Flame,
    color: 'orange',
    condition: (progress) => (progress?.current_streak || 0) >= 7
  },
  {
    id: 'streak_30',
    label: '30-Day Streak',
    description: 'Study for 30 consecutive days',
    emoji: '💪',
    icon: Flame,
    color: 'rose',
    condition: (progress) => (progress?.current_streak || 0) >= 30
  },
  {
    id: 'flashcard_100',
    label: 'Flashcard Master',
    description: 'Master 100 flashcards',
    emoji: '📚',
    icon: Layers,
    color: 'indigo',
    condition: (progress) => (progress?.mastered_flashcards || 0) >= 100
  },
  {
    id: 'top_scorer',
    label: 'Top Scorer',
    description: 'Score above 70% in any exam',
    emoji: '🏆',
    icon: Star,
    color: 'yellow',
    condition: (progress) => (progress?.best_accuracy || 0) >= 70
  },
  {
    id: 'dedicated',
    label: 'Dedicated',
    description: 'Study for 100 total hours',
    emoji: '⚡',
    icon: Zap,
    color: 'purple',
    condition: (progress) => (progress?.total_study_minutes || 0) >= 6000
  }
];

const colorMap = {
  amber: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
  orange: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
  rose: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
  indigo: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
  yellow: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
  purple: 'bg-purple-500/10 border-purple-500/30 text-purple-400'
};

const glowMap = {
  amber: 'shadow-amber-500/20',
  orange: 'shadow-orange-500/20',
  rose: 'shadow-rose-500/20',
  indigo: 'shadow-indigo-500/20',
  yellow: 'shadow-yellow-500/20',
  purple: 'shadow-purple-500/20'
};

const pillColorMap = {
  amber: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
  orange: 'bg-orange-500/15 border-orange-500/40 text-orange-300',
  rose: 'bg-rose-500/15 border-rose-500/40 text-rose-300',
  indigo: 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300',
  yellow: 'bg-yellow-500/15 border-yellow-500/40 text-yellow-300',
  purple: 'bg-purple-500/15 border-purple-500/40 text-purple-300'
};

export default function BadgeGallery({ progress, compact = false }) {
  const earnedBadges = BADGES.filter((badge) => badge.condition(progress));

  /* ── COMPACT MODE ── small horizontal emoji pills for Dashboard stats row */
  if (compact) {
    if (earnedBadges.length === 0) {
      return (
        <span className="text-xs text-slate-500 italic">No badges yet</span>
      );
    }

    return (
      <div className="flex flex-wrap items-center gap-1.5">
        {earnedBadges.map((badge) => (
          <span
            key={badge.id}
            title={`${badge.label}: ${badge.description}`}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-semibold ${pillColorMap[badge.color]}`}
          >
            <span className="text-sm leading-none">{badge.emoji}</span>
            <span className="hidden sm:inline">{badge.label}</span>
          </span>
        ))}
      </div>
    );
  }

  /* ── FULL GRID MODE ── 3-column grid with locked/unlocked state */
  const totalEarned = earnedBadges.length;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-semibold text-white">Badges</h3>
        </div>
        <span className="text-xs text-slate-400 font-medium">
          {totalEarned}/{BADGES.length} earned
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-white/5 rounded-full mb-5 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700"
          style={{ width: `${(totalEarned / BADGES.length) * 100}%` }}
        />
      </div>

      {/* Badge grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {BADGES.map((badge) => {
          const earned = badge.condition(progress);
          const Icon = badge.icon;

          return (
            <div
              key={badge.id}
              className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-300 ${
                earned
                  ? `${colorMap[badge.color]} shadow-lg ${glowMap[badge.color]}`
                  : 'bg-white/[0.03] border-white/8 text-slate-600'
              }`}
            >
              {/* Emoji / icon area */}
              <div
                className={`relative flex items-center justify-center w-12 h-12 rounded-xl text-2xl transition-all ${
                  earned ? 'opacity-100 scale-100' : 'opacity-25 grayscale scale-95'
                }`}
              >
                {badge.emoji}

                {/* Lock overlay for locked badges */}
                {!earned && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-slate-500" />
                  </span>
                )}
              </div>

              {/* Label */}
              <p
                className={`text-xs font-bold text-center leading-tight ${
                  earned ? 'text-white' : 'text-slate-600'
                }`}
              >
                {badge.label}
              </p>

              {/* Description */}
              <p
                className={`text-[10px] text-center leading-snug ${
                  earned ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                {badge.description}
              </p>

              {/* Earned glow ring */}
              {earned && (
                <span className="absolute top-2 right-2 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-40" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white/70" />
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
