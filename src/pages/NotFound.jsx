import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-slate-100 p-4">
      <div className="glass-panel p-8 rounded-3xl max-w-md w-full text-center space-y-6 border border-surface-border">
        <div className="w-20 h-20 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto border border-rose-500/20">
          <AlertTriangle className="w-10 h-10 text-rose-400" />
        </div>
        
        <div>
          <h1 className="text-4xl font-bold mb-2">404</h1>
          <p className="text-slate-400 text-lg">Page not found</p>
        </div>
        
        <p className="text-slate-500 text-sm">
          The page you are looking for doesn't exist or has been moved.
        </p>

        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
