import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Layers, 
  GraduationCap, 
  BookMarked, 
  Menu, 
  X, 
  BarChart3, 
  HeartPulse, 
  Newspaper, 
  Users, 
  User,
  ChevronRight,
  ShieldCheck,
  Brain,
  Sparkles,
  Shield
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';

export default function BottomNav({ onOpenTutor }) {
  const location = useLocation();
  const { user } = useAuth();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const isOwner = user && (
    user.id === 'u1' ||
    (user.email && user.email.toLowerCase() === 'chaurasiaupasana70@gmail.com')
  );

  const mainTabs = [
    { path: '/', label: 'Home', icon: LayoutDashboard },
    { path: '/exams', label: 'Exams', icon: GraduationCap },
    { path: '/pyq', label: 'PYQ Bank', icon: BookMarked },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const moreItems = [
    ...(isOwner ? [{
      path: '/admin',
      label: 'Website Admin Portal',
      desc: 'Platform stats, user management & question bank',
      icon: Shield,
      color: 'text-amber-400 bg-amber-500/10'
    }] : []),
    { path: '/news', label: 'ICAI News & Exam Alerts', desc: 'Official notifications & exam date updates', icon: Newspaper, color: 'text-amber-400 bg-amber-500/10' },
    { path: '/profile', label: 'Study Goals & Group Profile', desc: 'Switch Group 1, Group 2 or target dates', icon: User, color: 'text-purple-400 bg-purple-500/10' },
  ];

  const isMoreActive = moreItems.some(item => location.pathname === item.path);

  return (
    <>
      {/* Slide-up "More" Drawer for Mobile Phone & Touch screens */}
      <AnimatePresence>
        {showMoreMenu && (
          <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMoreMenu(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />

            {/* Modal Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 280 }}
              className="relative z-10 glass-panel border-t border-surface-border rounded-t-3xl p-5 pb-8 max-h-[85vh] overflow-y-auto"
            >
              <div className="w-12 h-1 bg-surface-border rounded-full mx-auto mb-4" />
              
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-surface-border">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-base">More Tutovia Tools</span>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">CA Portal</span>
                </div>
                <button
                  onClick={() => setShowMoreMenu(false)}
                  className="w-8 h-8 rounded-full bg-surface-card border border-surface-border flex items-center justify-center text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Quick AI Tutor Action Button for Mobile */}
              {onOpenTutor && (
                <button
                  onClick={() => { setShowMoreMenu(false); onOpenTutor(); }}
                  className="w-full mb-3 p-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white font-bold flex items-center justify-between shadow-lg shadow-indigo-600/30 border border-indigo-400/40 hover:scale-[1.01] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
                      <Brain className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        Ask Tutovia AI Tutor
                        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                      </h4>
                      <p className="text-[11px] text-indigo-100 font-normal">24/7 answers for AS, Law, Tax & Costing</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-indigo-200" />
                </button>
              )}

              <div className="space-y-2 mb-4">
                {moreItems.map(item => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setShowMoreMenu(false)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                        isActive
                          ? 'bg-indigo-600/20 border-indigo-500/40 text-white shadow-md'
                          : 'bg-surface-card/70 hover:bg-surface-card border-surface-border text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color} border border-surface-border shrink-0`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">{item.label}</h4>
                          <p className="text-[11px] text-slate-400 leading-tight mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                    </Link>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-surface-border flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Official ICAI Exam Engine
                </span>
                <span>v2.4 Pro</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Bottom Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-surface/95 backdrop-blur-xl border-t border-surface-border safe-area-pb">
        <div className="flex items-center justify-around px-2 py-1.5">
          {mainTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = location.pathname === tab.path;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`flex flex-col items-center gap-0.5 min-w-[56px] py-1.5 px-2 rounded-xl transition-all ${
                  isActive
                    ? 'text-indigo-400 bg-indigo-500/10 font-bold'
                    : 'text-slate-400 hover:text-slate-200 font-medium'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-400 stroke-[2.2]' : 'text-slate-400'}`} />
                <span className="text-[10px] tracking-tight">{tab.label}</span>
              </Link>
            );
          })}

          {/* "More" Trigger Button */}
          <button
            onClick={() => setShowMoreMenu(prev => !prev)}
            className={`flex flex-col items-center gap-0.5 min-w-[56px] py-1.5 px-2 rounded-xl transition-all ${
              showMoreMenu || isMoreActive
                ? 'text-indigo-400 bg-indigo-500/10 font-bold'
                : 'text-slate-400 hover:text-slate-200 font-medium'
            }`}
          >
            <Menu className={`w-5 h-5 ${showMoreMenu || isMoreActive ? 'text-indigo-400 stroke-[2.2]' : 'text-slate-400'}`} />
            <span className="text-[10px] tracking-tight">More</span>
          </button>
        </div>
      </nav>
    </>
  );
}
