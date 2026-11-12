import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, ArrowLeft, Lock, Database, Eye, FileText, Bot } from 'lucide-react';

export default function PrivacyPolicy() {
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
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Shield size={24} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">Privacy Policy</h1>
              <p className="text-xs text-slate-400 mt-1">Last Updated: September 2026 &bull; Effective Immediately</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none space-y-6 text-sm sm:text-base leading-relaxed text-slate-300">
            <section>
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
                <FileText size={18} className="text-indigo-400" /> 1. Overview & Commitment
              </h2>
              <p>
                Tutovia ("we", "our", or "us") provides a mindful study coach, AI-powered preparation platform, and academic revision engine for Chartered Accountancy (CA) aspirants. We are committed to protecting your personal data, exam progress, and privacy with enterprise-grade standards.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
                <Database size={18} className="text-indigo-400" /> 2. Information We Collect
              </h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Account Data:</strong> Full name, email address, authentication credentials handled securely via Supabase Auth.</li>
                <li><strong>Academic Profile:</strong> CA stage (Foundation, Intermediate, Final), target exam attempt date, daily study hour goals, wake/sleep preferences.</li>
                <li><strong>Performance Metrics:</strong> Mock exam scores, flashcard review intervals, spaced-repetition memory stats, and study streaks.</li>
                <li><strong>AI Chat Conversations:</strong> Doubts, conceptual queries, and prompts submitted to the Tutovia AI Tutor for academic coaching.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
                <Bot size={18} className="text-indigo-400" /> 3. AI Usage & Model Disclosure
              </h2>
              <p>
                Tutovia leverages advanced large language models (LLMs) via high-throughput encrypted API endpoints to deliver instant academic explanations, formula breakdowns, and personalized study schedules.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 mt-2">
                <li>Your prompts are processed securely and are <strong>never used to train public foundation models</strong>.</li>
                <li>AI interactions are isolated per user session to maintain academic confidentiality.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
                <Lock size={18} className="text-indigo-400" /> 4. Security & Data Protection
              </h2>
              <p>
                All data is encrypted in transit using TLS/HTTPS and protected at rest with Row Level Security (RLS) policies. Only your authenticated user account has permission to read or modify your study plans and mock exam records.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
                <Eye size={18} className="text-indigo-400" /> 5. Data Ownership & Deletion Rights
              </h2>
              <p>
                You retain complete ownership over your data. You may export your timetable or permanently request account and progress deletion at any time via your <Link to="/profile" className="text-indigo-400 underline">Profile Settings</Link> or by contacting our support team at <span className="text-indigo-400 font-mono">privacy@tutovia.com</span>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
