import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center text-slate-100 p-4">
          <div className="glass-panel p-8 rounded-3xl max-w-lg w-full text-center space-y-6 border border-rose-500/30">
            <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto border border-rose-500/20">
              <AlertTriangle className="w-8 h-8 text-rose-400" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-2 text-rose-300">Something went wrong</h2>
              <p className="text-slate-400 text-sm">We're sorry, but the application crashed.</p>
            </div>
            
            <div className="bg-surface-card p-4 rounded-xl text-left overflow-auto max-h-40 border border-surface-border text-xs text-rose-200">
              <code>{this.state.error?.toString()}</code>
            </div>

            <button 
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 rounded-xl font-medium transition-colors border border-rose-500/50"
            >
              <RefreshCw className="w-4 h-4" />
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
