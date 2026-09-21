import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowLeft, CheckCircle2, AlertCircle, Scale, ShieldAlert } from 'lucide-react';

export default function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-slate-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-surface-border shadow-2xl">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-surface-border">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <Scale size={24} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">Terms of Service</h1>
              <p className="text-xs text-slate-400 mt-1">Last Updated: September 2026 &bull; Read Carefully</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none space-y-6 text-sm sm:text-base leading-relaxed text-slate-300">
            <section>
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
                <CheckCircle2 size={18} className="text-purple-400" /> 1. Acceptance of Terms
              </h2>
              <p>
                By registering an account, accessing, or utilizing the Tutovia website and services, you agree to abide by these Terms of Service. If you do not agree with any part of these terms, please discontinue using the platform.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
                <FileText size={18} className="text-purple-400" /> 2. Educational & Study Tool Nature
              </h2>
              <p>
                Tutovia is an independent digital study companion built to assist students preparing for examinations conducted by the Institute of Chartered Accountants of India (ICAI). 
              </p>
              <p className="mt-2 text-amber-300/90 text-xs sm:text-sm bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl">
                <strong>Notice:</strong> Tutovia is an independent platform and is not affiliated, endorsed, or associated with the Institute of Chartered Accountants of India (ICAI). All official syllabus details, statutory guidelines, and exam announcements remain the exclusive property of ICAI.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
                <ShieldAlert size={18} className="text-purple-400" /> 3. User Conduct & Acceptable Use
              </h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>You are responsible for safeguarding your login credentials.</li>
                <li>You agree not to reverse-engineer, exploit, or disrupt API endpoints or AI features.</li>
                <li>Excessive, automated, or abusive queries to the AI Tutor or database are strictly prohibited.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
                <AlertCircle size={18} className="text-purple-400" /> 4. AI Guidance Disclaimer
              </h2>
              <p>
                Tutovia's AI Tutor provides automated academic explanations, conceptual summaries, and memory aids based on large language models. While trained for accuracy, AI responses should be cross-referenced with primary ICAI study material and statutory pronouncements for technical certainty.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
                <Scale size={18} className="text-purple-400" /> 5. Termination & Modifications
              </h2>
              <p>
                We reserve the right to modify these terms or suspend access to accounts violating platform policies. Inquiries regarding terms may be directed to <span className="text-indigo-400 font-mono">legal@tutovia.com</span>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
