import React, { useState } from 'react';
import { Cloud, Smartphone, Laptop, Check, X, Shield, ArrowRight, Zap, RefreshCw } from 'lucide-react';

export default function CloudSyncModal({ isOpen, onClose, onAccept }) {
  const [autoSync, setAutoSync] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsSyncing(true);
    try {
      await onAccept(autoSync);
    } finally {
      setIsSyncing(false);
      onClose();
    }
  };

  const handleDecline = () => {
    onClose(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-surface border border-surface-border rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={handleDecline}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          aria-label="Close sync modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Visual with Connected Devices */}
        <div className="flex flex-col items-center text-center mt-2 mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Smartphone className="w-6 h-6" />
            </div>
            <div className="flex items-center text-indigo-400/60">
              <RefreshCw className="w-5 h-5 animate-pulse" />
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-xl shadow-indigo-500/30">
              <Cloud className="w-8 h-8" />
            </div>
            <div className="flex items-center text-indigo-400/60">
              <RefreshCw className="w-5 h-5 animate-pulse" />
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Laptop className="w-6 h-6" />
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 mb-3">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Supabase Cloud Sync
          </span>

          <h3 className="text-2xl font-extrabold text-white tracking-tight">
            Sync Data Between App & Website?
          </h3>
          <p className="mt-2 text-sm text-slate-300 max-w-sm">
            Keep your CA study progress, daily timetable, streak, and syllabus completion seamlessly synchronized between your iPhone and web browser.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-surface-hover/50 border border-surface-border">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Never Lose Your Streak</h4>
              <p className="text-xs text-slate-400">Study on your phone on the go, pick up on your laptop with zero lost pomodoros or study hours.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-surface-hover/50 border border-surface-border">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Encrypted Cloud Backup</h4>
              <p className="text-xs text-slate-400">Your syllabus progress and mock exam scores are safely encrypted and backed up in Supabase Cloud.</p>
            </div>
          </div>
        </div>

        {/* Auto Sync Toggle */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-border/20 border border-surface-border mb-6">
          <div className="flex items-center gap-2.5">
            <Cloud className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-medium text-slate-200">Automatically sync changes in background</span>
          </div>
          <button
            type="button"
            onClick={() => setAutoSync(!autoSync)}
            className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${autoSync ? 'bg-indigo-600' : 'bg-slate-700'}`}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${autoSync ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleDecline}
            className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-surface-hover transition-colors text-center order-2 sm:order-1"
          >
            Keep Local Only
          </button>
          <button
            type="button"
            disabled={isSyncing}
            onClick={handleConfirm}
            className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all order-1 sm:order-2 disabled:opacity-50"
          >
            {isSyncing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Syncing Now...
              </>
            ) : (
              <>
                <span>Yes, Sync App & Website</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
