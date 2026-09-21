import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Layers, GraduationCap, HeartPulse, BarChart3 } from 'lucide-react';

export default function BottomNav() {
  const location = useLocation();

  const tabs = [
    { path: '/', label: 'Home', icon: LayoutDashboard },
    { path: '/flashcards', label: 'Cards', icon: Layers },
    { path: '/exams', label: 'Exams', icon: GraduationCap },
    { path: '/analytics', label: 'Stats', icon: BarChart3 },
    { path: '/wellness', label: 'Wellness', icon: HeartPulse },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-surface/95 backdrop-blur-xl border-t border-surface-border safe-area-pb">
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                isActive
                  ? 'text-indigo-400 bg-indigo-500/10'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
              <span className="text-[10px] font-semibold">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
