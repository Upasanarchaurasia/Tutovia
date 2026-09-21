import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Download, ChevronDown, ChevronUp, ExternalLink, Filter } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

// --- ICAI PDF URLs ---

const ICAI_URLS = {
  Foundation:   "https://boslive.icai.org/",
  Intermediate: "https://boslive.icai.org/",
  Final:        "https://boslive.icai.org/",
};

// --- Mock Data ---

const ALL_PAPERS = [
  {
    id: "f-may24", stage: "Foundation", year: 2024, session: "May 2024",
    paper: "Paper 1 - Principles & Practice of Accounting", questions: 60,
    mcqs: [
      { q: "Which accounting concept requires businesses to record transactions only when cash is received or paid?",
        opts: ["Accrual Concept", "Cash Basis Concept", "Matching Concept", "Conservatism"], answer: 1 },
      { q: "The financial statements of a business are prepared on the assumption that the business will continue indefinitely. This is known as:",
        opts: ["Entity Concept", "Going Concern Concept", "Consistency Concept", "Periodicity Concept"], answer: 1 },
      { q: "Depreciation is charged on:",
        opts: ["Current Assets", "Fictitious Assets", "Fixed Assets", "Liquid Assets"], answer: 2 },
      { q: "Which of the following is NOT a subsidiary book?",
        opts: ["Sales Book", "Purchase Book", "Cash Book", "Balance Sheet"], answer: 3 },
      { q: "The excess of credit side over debit side of a personal account represents:",
        opts: ["Debit Balance", "Credit Balance", "Nil Balance", "Suspense"], answer: 1 },
    ],
  },
  {
    id: "f-nov23", stage: "Foundation", year: 2023, session: "Nov 2023",
    paper: "Paper 2 - Business Laws", questions: 50,
    mcqs: [
      { q: "Under the Indian Contract Act, 1872, a minor's agreement is:",
        opts: ["Valid", "Voidable", "Void ab initio", "Unenforceable"], answer: 2 },
      { q: "Consideration in a contract must be:",
        opts: ["Past only", "Present only", "Future only", "Any of the above"], answer: 3 },
      { q: "Which of the following is an essential element of a valid contract?",
        opts: ["Written form", "Stamp duty", "Free consent", "Government approval"], answer: 2 },
      { q: "A contract entered into by coercion is:",
        opts: ["Void", "Valid", "Voidable at the option of the aggrieved party", "Illegal"], answer: 2 },
      { q: "Offer can be revoked:",
        opts: ["After acceptance", "Before acceptance", "After performance", "Never"], answer: 1 },
    ],
  },
  {
    id: "i-may24", stage: "Intermediate", year: 2024, session: "May 2024",
    paper: "Paper 1 - Advanced Accounting", questions: 100,
    mcqs: [
      { q: "Goodwill arising on amalgamation is to be:",
        opts: ["Written off immediately", "Amortised over 5 years", "Retained in Balance Sheet", "Charged to P&L over useful life"], answer: 0 },
      { q: "Under AS 14, which method of amalgamation requires recording assets and liabilities at agreed values?",
        opts: ["Purchase Method", "Pooling of Interests", "Both", "Neither"], answer: 0 },
      { q: "Debentures issued at a premium, the premium amount is transferred to:",
        opts: ["P&L Account", "Capital Reserve", "Securities Premium Account", "General Reserve"], answer: 2 },
      { q: "In a dissolution of partnership, the Realisation Account is credited with:",
        opts: ["Assets transferred", "Liabilities transferred", "Both", "Profit on realisation"], answer: 1 },
      { q: "Under Average Profit Method, goodwill is calculated by multiplying average profit with:",
        opts: ["Net Asset Value", "Number of Years Purchase", "Capitalisation Rate", "None"], answer: 1 },
    ],
  },
  {
    id: "i-nov23", stage: "Intermediate", year: 2023, session: "Nov 2023",
    paper: "Paper 4 - Taxation (Income Tax)", questions: 100,
    mcqs: [
      { q: "Under which section of the Income Tax Act can deduction be claimed for LIC premium paid?",
        opts: ["80C", "80D", "80G", "80E"], answer: 0 },
      { q: "Agricultural income in India is:",
        opts: ["Fully taxable", "Partially exempt", "Fully exempt from Income Tax", "Taxable at flat 10%"], answer: 2 },
      { q: "The last date to file ITR for an individual (non-audit) for AY 2023-24 is:",
        opts: ["30 September", "31 July", "31 March", "31 December"], answer: 1 },
      { q: "Advance tax is payable when tax liability exceeds:",
        opts: ["5,000", "10,000", "15,000", "25,000"], answer: 1 },
      { q: "HRA exemption is available under section:",
        opts: ["10(13A)", "10(14)", "10(10)", "10(5)"], answer: 0 },
    ],
  },
  {
    id: "i-may23", stage: "Intermediate", year: 2023, session: "May 2023",
    paper: "Paper 5 - Auditing & Assurance", questions: 100,
    mcqs: [
      { q: "SA 200 deals with:",
        opts: ["Audit Documentation", "Overall Objectives of the Independent Auditor", "Risk Assessment", "Audit Sampling"], answer: 1 },
      { q: "Letter of Engagement is issued by:",
        opts: ["Client to Auditor", "Auditor to Client", "ICAI to Auditor", "Government to Auditor"], answer: 1 },
      { q: "Vouching is:",
        opts: ["Verification of assets", "Checking arithmetical accuracy", "Examination of documentary evidence behind transactions", "Preparation of financial statements"], answer: 2 },
      { q: "Which SA deals with using the work of an expert?",
        opts: ["SA 500", "SA 620", "SA 610", "SA 540"], answer: 1 },
      { q: "Statutory audit is mandatory for:",
        opts: ["All entities", "Companies under Companies Act", "Partnership firms only", "Sole proprietorship"], answer: 1 },
    ],
  },
  {
    id: "fn-may24", stage: "Final", year: 2024, session: "May 2024",
    paper: "Paper 1 - Financial Reporting", questions: 100,
    mcqs: [
      { q: "As per Ind AS 115, revenue is recognised when:",
        opts: ["Cash is received", "Performance obligation is satisfied", "Invoice is raised", "Contract is signed"], answer: 1 },
      { q: "Under Ind AS 109, financial assets are classified into:",
        opts: ["2 categories", "3 categories", "4 categories", "5 categories"], answer: 1 },
      { q: "Fair value hierarchy Level 1 inputs are:",
        opts: ["Unobservable inputs", "Observable inputs other than Level 1", "Quoted prices in active markets", "Management estimates"], answer: 2 },
      { q: "Ind AS 36 deals with:",
        opts: ["Impairment of Assets", "Employee Benefits", "Leases", "Revenue"], answer: 0 },
      { q: "Component accounting is required under:",
        opts: ["AS 10", "Ind AS 16", "Both", "Neither"], answer: 1 },
    ],
  },
  {
    id: "fn-nov23", stage: "Final", year: 2023, session: "Nov 2023",
    paper: "Paper 3 - Advanced Auditing", questions: 100,
    mcqs: [
      { q: "CARO 2020 is applicable to:",
        opts: ["All companies", "Specified companies under Companies Act 2013", "Listed companies only", "Foreign companies only"], answer: 1 },
      { q: "Peer Review is governed by:",
        opts: ["SEBI", "ICAI", "MCA", "RBI"], answer: 1 },
      { q: "Forensic audit is primarily concerned with:",
        opts: ["Tax compliance", "Detection of fraud", "Statutory compliance", "Internal controls"], answer: 1 },
      { q: "The concept of materiality in audit is addressed by:",
        opts: ["SA 320", "SA 200", "SA 315", "SA 700"], answer: 0 },
      { q: "Rotation of auditor is mandatory after every:",
        opts: ["5 years", "10 years", "3 years", "7 years"], answer: 1 },
    ],
  },
];

const YEARS  = [2024, 2023, 2022, 2021, 2020, 2019];
const STAGES = ["All", "Foundation", "Intermediate", "Final"];

// --- Sub-components ---

function MCQItem({ mcq, idx }) {
  const [revealed, setRevealed] = useState(false);
  const labels = ["A", "B", "C", "D"];

  return (
    <div className="border border-white/10 rounded-xl p-4 bg-slate-900/60">
      <p className="text-sm text-slate-200 mb-3 font-medium">
        <span className="text-indigo-400 font-bold mr-2">Q{idx + 1}.</span>
        {mcq.q}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
        {mcq.opts.map((opt, oi) => (
          <div
            key={oi}
            className={`rounded-lg px-3 py-2 text-sm flex items-center gap-2 transition-all duration-300 ${
              revealed && oi === mcq.answer
                ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
                : revealed
                ? "bg-slate-800/50 text-slate-500"
                : "bg-slate-800/80 text-slate-300"
            }`}
          >
            <span
              className={`font-bold text-xs w-5 h-5 rounded flex items-center justify-center shrink-0 ${
                revealed && oi === mcq.answer
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-700 text-slate-400"
              }`}
            >
              {labels[oi]}
            </span>
            {opt}
          </div>
        ))}
      </div>
      <button
        onClick={() => setRevealed((r) => !r)}
        className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
      >
        {revealed ? "Hide Answer" : "Show Answer"}
      </button>
    </div>
  );
}

function PYQCard({ paper }) {
  const [expanded, setExpanded] = useState(false);
  const icaiUrl = ICAI_URLS[paper.stage] || ICAI_URLS["Intermediate"];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35 }}
      className="glass-panel border border-white/10 rounded-2xl overflow-hidden"
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {paper.session}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                paper.stage === "Foundation"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  : paper.stage === "Intermediate"
                  ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                  : "bg-orange-500/10 text-orange-400 border-orange-500/30"
              }`}
            >
              {paper.stage}
            </span>
          </div>
          <span className="text-xs text-slate-500 shrink-0">{paper.questions} Qs</span>
        </div>
        <h3 className="text-white font-semibold text-sm leading-snug mb-4">{paper.paper}</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setExpanded((e) => !e)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-sm font-medium border border-indigo-500/20 transition-all"
          >
            <BookOpen className="w-4 h-4" />
            {expanded ? "Hide Questions" : "View Questions"}
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          <a
            href={icaiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-sm font-medium border border-white/10 transition-all"
          >
            <Download className="w-4 h-4" />
            Download PDF
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            key="mcq-section"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-white/10"
          >
            <div className="p-5 space-y-3">
              <p className="text-xs text-slate-500 mb-4 italic">
                Sample MCQs - official papers available via Download PDF above.
              </p>
              {paper.mcqs.map((mcq, idx) => (
                <MCQItem key={idx} mcq={mcq} idx={idx} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// --- Main Component ---

export default function PYQ() {
  const { user } = useAuth();
  const [stage, setStage] = useState("All");
  const [year,  setYear]  = useState("All");
  const [paper, setPaper] = useState("All");

  const filtered = useMemo(() => {
    return ALL_PAPERS.filter((p) => {
      if (stage !== "All" && p.stage !== stage) return false;
      if (year  !== "All" && p.year  !== Number(year))  return false;
      if (paper !== "All" && p.paper !== paper) return false;
      return true;
    });
  }, [stage, year, paper]);

  const availablePapers = useMemo(() => {
    const base = ALL_PAPERS.filter((p) => {
      if (stage !== "All" && p.stage !== stage) return false;
      if (year  !== "All" && p.year  !== Number(year))  return false;
      return true;
    });
    return ["All", ...Array.from(new Set(base.map((p) => p.paper)))];
  }, [stage, year]);

  return (
    <div className="min-h-screen bg-background text-white p-6 md:p-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-purple-500/20">
            <BookOpen className="w-6 h-6 text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Past Year Questions
          </h1>
        </div>
        <p className="text-slate-400 ml-14">
          ICAI Official Question Papers 2019-2024 - Foundation - Intermediate - Final
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="glass-panel border border-white/10 rounded-2xl p-5 mb-8"
      >
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-slate-400">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filter by</span>
          </div>

          {/* Stage */}
          <div className="relative">
            <select
              value={stage}
              onChange={(e) => { setStage(e.target.value); setPaper("All"); }}
              className="appearance-none bg-slate-800 border border-white/10 text-slate-200 text-sm rounded-xl px-4 py-2 pr-8 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {STAGES.map((s) => (
                <option key={s} value={s}>{s === "All" ? "All Stages" : s}</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Year */}
          <div className="relative">
            <select
              value={year}
              onChange={(e) => { setYear(e.target.value); setPaper("All"); }}
              className="appearance-none bg-slate-800 border border-white/10 text-slate-200 text-sm rounded-xl px-4 py-2 pr-8 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="All">All Years</option>
              {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Paper */}
          <div className="relative flex-1 min-w-[180px]">
            <select
              value={paper}
              onChange={(e) => setPaper(e.target.value)}
              className="appearance-none w-full bg-slate-800 border border-white/10 text-slate-200 text-sm rounded-xl px-4 py-2 pr-8 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {availablePapers.map((p) => (
                <option key={p} value={p}>{p === "All" ? "All Papers" : p}</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <span className="text-xs text-slate-500 ml-auto">
            {filtered.length} paper{filtered.length !== 1 ? "s" : ""} found
          </span>
        </div>
      </motion.div>

      {/* Cards Grid */}
      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-24 gap-4 text-slate-500"
          >
            <BookOpen className="w-12 h-12 opacity-30" />
            <p className="text-lg font-medium">No papers found</p>
            <p className="text-sm">Try adjusting the filters above.</p>
          </motion.div>
        ) : (
          <motion.div key="grid" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((p) => (
              <PYQCard key={p.id} paper={p} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-10 flex items-start gap-2 text-xs text-slate-500 border-t border-white/5 pt-6"
      >
        <ExternalLink className="w-3.5 h-3.5 shrink-0 mt-0.5 text-indigo-500" />
        <span>
          Official question papers and suggested answers are published by{" "}
          <a
            href="https://boslive.icai.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:underline"
          >
            ICAI (icai.org)
          </a>
          . PDFs open on the ICAI website. Sample MCQs shown here are for practice only.
        </span>
      </motion.div>
    </div>
  );
}

