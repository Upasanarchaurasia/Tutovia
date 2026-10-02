import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ExternalLink, Copy, Check, X, Globe, Download, ShieldCheck } from 'lucide-react';

/**
 * Reusable In-App PDF Viewer Modal
 * 
 * Provides an identical high-fidelity viewing experience to the BoS Study Material tab:
 * - Direct ICAI CDN stream / download
 * - 1-Click "Open in New Tab"
 * - In-app preview iframe with engine fallback (Direct Stream vs Google Docs PDF Engine)
 * - Copy CDN link with instant feedback
 */
export default function PdfViewerModal({
  isOpen,
  onClose,
  pdfUrl,
  title = "Official ICAI Document",
  subtitle = "ICAI Examination Directorate",
  portalSourceUrl = "https://www.icai.org",
  isOfficial = true
}) {
  const [viewerEngine, setViewerEngine] = useState('direct'); // 'direct' | 'google'
  const [copied, setCopied] = useState(false);

  if (!isOpen || !pdfUrl) return null;

  const handleCopyLink = () => {
    if (!pdfUrl) return;
    navigator.clipboard.writeText(pdfUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {});
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-5xl h-[90vh] bg-surface-card border border-surface-border rounded-2xl shadow-2xl flex flex-col overflow-hidden glass-panel"
        >
          {/* Modal Header */}
          <div className="px-5 py-3.5 bg-slate-900/90 border-b border-surface-border flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white truncate">
                    {title}
                  </h3>
                  {isOfficial && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shrink-0">
                      <ShieldCheck className="w-3 h-3" />
                      Official ICAI Notice
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 truncate">
                  {subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Copy CDN Link */}
              <button
                onClick={handleCopyLink}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-surface-border transition-all"
                title="Copy direct PDF CDN link"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>

              {/* Direct 1-Click Open in New Tab */}
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-sm"
                title="Open official ICAI PDF directly in browser"
              >
                <Download className="w-3.5 h-3.5 text-emerald-300" />
                <span>Open in New Tab</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {/* Close Modal */}
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-surface-border transition-all"
                title="Close Viewer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Informational Sub-banner with Engine Switcher */}
          <div className="bg-slate-900/60 px-5 py-2 border-b border-surface-border/60 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-medium text-slate-300">Direct ICAI CDN Stream</span>
              </div>

              {/* Engine Switcher */}
              <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-surface-border text-[11px]">
                <button
                  onClick={() => setViewerEngine('direct')}
                  className={`px-2 py-0.5 rounded-md transition-all ${
                    viewerEngine === 'direct' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Stream directly from ICAI CDN"
                >
                  Direct Stream
                </button>
                <button
                  onClick={() => setViewerEngine('google')}
                  className={`px-2 py-0.5 rounded-md transition-all ${
                    viewerEngine === 'google' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Use Google Docs PDF Engine viewer"
                >
                  Google PDF Engine
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {portalSourceUrl && (
                <a
                  href={portalSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <Globe className="w-3 h-3" />
                  <span>Portal Source</span>
                </a>
              )}
              <span className="text-[11px] text-slate-500 font-mono hidden sm:inline truncate max-w-xs">
                {pdfUrl}
              </span>
            </div>
          </div>

          {/* PDF Iframe Viewer */}
          <div className="flex-1 bg-slate-950 relative">
            <iframe
              key={viewerEngine}
              src={
                viewerEngine === 'google'
                  ? `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`
                  : pdfUrl
              }
              title={title}
              className="w-full h-full border-none"
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
