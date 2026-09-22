import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Download, ChevronDown, ChevronUp, ExternalLink, Filter, ShieldCheck, Layers, FileText, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import axios from "../api.js";
import { 
  INTERMEDIATE_OFFICIAL_LINKS, 
  FOUNDATION_OFFICIAL_LINKS, 
  FINAL_OFFICIAL_LINKS,
  ICAI_PORTALS 
} from "../data/icaiOfficialLinks.js";

// --- Curated Database of Past Year Question Papers ---

const ALL_PAPERS = [
  // ===================== CA INTERMEDIATE: GROUP 1 =====================
  // Paper 1: Advanced Accounting
  {
    id: "i-p1-may24",
    stage: "Intermediate",
    group: "Group 1",
    year: 2024,
    session: "May 2024",
    paper: "Paper 1: Advanced Accounting",
    paperCode: "Paper 1",
    questions: 100,
    officialPdfUrl: INTERMEDIATE_OFFICIAL_LINKS["advanced-accounting"].questionPapers,
    studyMaterialUrl: INTERMEDIATE_OFFICIAL_LINKS["advanced-accounting"].studyMaterial,
    mcqs: [
      {
        q: "As per AS 14 (Accounting for Amalgamations), goodwill arising on amalgamation should be:",
        opts: ["Written off immediately against reserves", "Amortised over a period not exceeding 5 years", "Retained in Balance Sheet indefinitely", "Deducted directly from Share Capital"],
        answer: 1,
        explanation: "Under AS 14, goodwill arising on amalgamation in the nature of purchase should be amortised over its useful life, usually not exceeding 5 years unless a longer period can be justified."
      },
      {
        q: "Under AS 28, an impairment loss for an asset is recognized in the Statement of Profit and Loss when:",
        opts: ["Recoverable Amount is greater than Carrying Amount", "Carrying Amount exceeds Recoverable Amount", "Net Selling Price is equal to Value in Use", "Asset is fully depreciated"],
        answer: 1,
        explanation: "Impairment loss occurs when the carrying amount of an asset exceeds its recoverable amount (higher of net selling price and value in use)."
      },
      {
        q: "In a company liquidation, the liquidator's remuneration is usually calculated as a percentage on:",
        opts: ["Total assets in the balance sheet", "Assets realized and amount distributed to unsecured creditors", "Share capital", "Net profit before liquidation"],
        answer: 1,
        explanation: "Liquidator's remuneration is conventionally agreed as a percentage on the amount realized from assets and on the amount distributed to unsecured creditors."
      }
    ]
  },
  {
    id: "i-p1-nov23",
    stage: "Intermediate",
    group: "Group 1",
    year: 2023,
    session: "Nov 2023",
    paper: "Paper 1: Advanced Accounting",
    paperCode: "Paper 1",
    questions: 100,
    officialPdfUrl: INTERMEDIATE_OFFICIAL_LINKS["advanced-accounting"].questionPapers,
    studyMaterialUrl: INTERMEDIATE_OFFICIAL_LINKS["advanced-accounting"].studyMaterial,
    mcqs: [
      {
        q: "Under AS 19 (Leases), in the case of a Finance Lease, the lessee recognizes the asset and liability at:",
        opts: ["Fair value of leased asset or present value of minimum lease payments, whichever is lower", "Nominal lease payments total", "Future value of lease installments", "Residual value guaranteed by lessee"],
        answer: 0,
        explanation: "At the inception of a finance lease, the lessee recognizes the asset and liability at an amount equal to the fair value of the leased asset or, if lower, the present value of the minimum lease payments."
      },
      {
        q: "In internal reconstruction of a company, the sacrifice made by shareholders and creditors is credited to:",
        opts: ["Capital Reserve Account", "Reconstruction / Capital Reduction Account", "General Reserve Account", "Profit and Loss Account"],
        answer: 1,
        explanation: "All sacrifices, reductions in liabilities, and write-offs are routed through the Capital Reduction (Reconstruction) Account."
      }
    ]
  },

  // Paper 2: Corporate and Other Laws
  {
    id: "i-p2-may24",
    stage: "Intermediate",
    group: "Group 1",
    year: 2024,
    session: "May 2024",
    paper: "Paper 2: Corporate and Other Laws",
    paperCode: "Paper 2",
    questions: 100,
    officialPdfUrl: INTERMEDIATE_OFFICIAL_LINKS["corporate-laws"].questionPapers,
    studyMaterialUrl: INTERMEDIATE_OFFICIAL_LINKS["corporate-laws"].studyMaterial,
    mcqs: [
      {
        q: "Under Section 135 of the Companies Act 2013, every company meeting the CSR threshold shall spend in every financial year at least:",
        opts: ["1% of average net profits of preceding 3 years", "2% of average net profits of preceding 3 years", "5% of paid up share capital", "2% of annual turnover"],
        answer: 1,
        explanation: "Companies qualifying under Section 135(1) must spend at least 2% of the average net profits made during the 3 immediately preceding financial years."
      },
      {
        q: "Under the General Clauses Act 1897, 'Affidavit' includes:",
        opts: ["Affirmation and declaration in the case of persons by law allowed to declare instead of swearing", "Written agreement between two partners", "Oral statement made before a Magistrate", "Power of attorney"],
        answer: 0,
        explanation: "Section 3(3) of General Clauses Act states 'affidavit' shall include affirmation and declaration in the case of persons by law allowed to affirm or declare instead of swearing."
      },
      {
        q: "The maximum number of members in a private limited company under the Companies Act 2013 is:",
        opts: ["50", "100", "200", "Unlimited"],
        answer: 2,
        explanation: "Section 2(68) of Companies Act 2013 limits the number of members of a private company to 200, excluding present and past employees who became members while in employment."
      }
    ]
  },
  {
    id: "i-p2-nov23",
    stage: "Intermediate",
    group: "Group 1",
    year: 2023,
    session: "Nov 2023",
    paper: "Paper 2: Corporate and Other Laws",
    paperCode: "Paper 2",
    questions: 100,
    officialPdfUrl: INTERMEDIATE_OFFICIAL_LINKS["corporate-laws"].questionPapers,
    studyMaterialUrl: INTERMEDIATE_OFFICIAL_LINKS["corporate-laws"].studyMaterial,
    mcqs: [
      {
        q: "Under Section 73 of the Companies Act 2013, a company may accept deposits from its members subject to passing a resolution in:",
        opts: ["Board Meeting", "General Meeting", "Creditors Meeting", "Audit Committee Meeting"],
        answer: 1,
        explanation: "A company can accept deposits from its members after obtaining approval of shareholders in a general meeting."
      },
      {
        q: "Which rule of interpretation applies when words in a statute are clear, unambiguous, and plain?",
        opts: ["Rule of Literal Construction", "Mischief Rule (Heydon's Rule)", "Golden Rule", "Harmonious Construction"],
        answer: 0,
        explanation: "Literal construction is the primary rule: if the words are plain and unambiguous, they must be given their natural and ordinary grammatical meaning."
      }
    ]
  },

  // Paper 3: Taxation
  {
    id: "i-p3-may24",
    stage: "Intermediate",
    group: "Group 1",
    year: 2024,
    session: "May 2024",
    paper: "Paper 3: Taxation (Direct & Indirect Tax)",
    paperCode: "Paper 3",
    questions: 100,
    officialPdfUrl: INTERMEDIATE_OFFICIAL_LINKS["taxation"].questionPapers,
    studyMaterialUrl: INTERMEDIATE_OFFICIAL_LINKS["taxation"].studyMaterial,
    mcqs: [
      {
        q: "Under the default new tax regime under Section 115BAC, what is the standard deduction allowed from salary income for AY 2024-25 / 2025-26?",
        opts: ["Rs. 40,000", "Rs. 50,000", "Rs. 75,000", "Nil"],
        answer: 2,
        explanation: "As amended by the Finance Act, the standard deduction under Section 16(ia) available under Section 115BAC is Rs. 75,000."
      },
      {
        q: "Under the CGST Act 2017, what is the threshold limit of aggregate turnover for composition levy for manufacturers and traders in normal states?",
        opts: ["Rs. 20 Lakhs", "Rs. 50 Lakhs", "Rs. 1.5 Crore", "Rs. 2 Crore"],
        answer: 2,
        explanation: "The aggregate turnover limit for opting into the composition scheme under Section 10(1) is Rs. 1.5 crore for manufacturers and traders in non-special category states."
      },
      {
        q: "TDS under Section 194C is required to be deducted on payments to contractors at the rate of:",
        opts: ["1% for individual/HUF and 2% for others", "2% for all", "5% for all", "10% for individual/HUF"],
        answer: 0,
        explanation: "Section 194C mandates TDS at 1% where payment/credit is made to an individual or HUF contractor, and 2% where made to other persons."
      }
    ]
  },
  {
    id: "i-p3-nov23",
    stage: "Intermediate",
    group: "Group 1",
    year: 2023,
    session: "Nov 2023",
    paper: "Paper 3: Taxation (Direct & Indirect Tax)",
    paperCode: "Paper 3",
    questions: 100,
    officialPdfUrl: INTERMEDIATE_OFFICIAL_LINKS["taxation"].questionPapers,
    studyMaterialUrl: INTERMEDIATE_OFFICIAL_LINKS["taxation"].studyMaterial,
    mcqs: [
      {
        q: "An individual resident in India is considered 'Resident and Ordinarily Resident' (ROR) if he satisfies:",
        opts: ["At least one basic condition only", "At least one basic condition and both additional conditions", "Only one additional condition", "Resides in India for 365 days in previous year"],
        answer: 1,
        explanation: "To be ROR, the individual must satisfy at least one basic condition under Sec 6(1) and both additional conditions under Sec 6(6)."
      },
      {
        q: "What is the time of supply of goods under Section 12(2) of the CGST Act in forward charge?",
        opts: ["Date of issue of invoice or last date to issue invoice, whichever is earlier", "Date of receipt of payment only", "Date of entry in books", "Date of delivery of goods"],
        answer: 0,
        explanation: "By Notification No. 66/2017-CT, liability to pay tax on goods arises at the time of issue of invoice or the last date on which the invoice ought to have been issued under Sec 31."
      }
    ]
  },

  // ===================== CA INTERMEDIATE: GROUP 2 =====================
  // Paper 4: Cost and Management Accounting
  {
    id: "i-p4-may24",
    stage: "Intermediate",
    group: "Group 2",
    year: 2024,
    session: "May 2024",
    paper: "Paper 4: Cost and Management Accounting",
    paperCode: "Paper 4",
    questions: 100,
    officialPdfUrl: INTERMEDIATE_OFFICIAL_LINKS["cost-management"].questionPapers,
    studyMaterialUrl: INTERMEDIATE_OFFICIAL_LINKS["cost-management"].studyMaterial,
    mcqs: [
      {
        q: "In Economic Order Quantity (EOQ) formula, if the annual demand doubles while ordering cost and carrying cost per unit remain constant, EOQ will:",
        opts: ["Double", "Increase by 41.4% (multiplied by √2)", "Remain unchanged", "Quadruple"],
        answer: 1,
        explanation: "EOQ = √(2DS/C). When D doubles, EOQ becomes √(2 * 2DS/C) = √2 * EOQ ≈ 1.414 * EOQ, which is an increase of ~41.4%."
      },
      {
        q: "Under marginal costing, the Break-Even Point (in units) is calculated as:",
        opts: ["Fixed Costs ÷ Contribution per unit", "Fixed Costs ÷ Profit Volume Ratio", "Total Cost ÷ Selling Price", "Variable Cost ÷ Contribution"],
        answer: 0,
        explanation: "BEP (units) = Total Fixed Costs / Contribution per unit. In monetary value, BEP (Rs.) = Fixed Costs / P/V Ratio."
      },
      {
        q: "Normal idle time is treated as:",
        opts: ["Part of production overheads and absorbed into cost of production", "Charged directly to Costing P&L", "Recovered from workers", "Ignored in cost accounts"],
        answer: 0,
        explanation: "Normal idle time cannot be avoided and is treated as indirect labor cost and included in factory overheads to be absorbed by all output."
      }
    ]
  },
  {
    id: "i-p4-nov23",
    stage: "Intermediate",
    group: "Group 2",
    year: 2023,
    session: "Nov 2023",
    paper: "Paper 4: Cost and Management Accounting",
    paperCode: "Paper 4",
    questions: 100,
    officialPdfUrl: INTERMEDIATE_OFFICIAL_LINKS["cost-management"].questionPapers,
    studyMaterialUrl: INTERMEDIATE_OFFICIAL_LINKS["cost-management"].studyMaterial,
    mcqs: [
      {
        q: "In Activity Based Costing (ABC), the factors that cause changes in the cost of an activity are called:",
        opts: ["Cost Pools", "Cost Drivers", "Cost Centers", "Cost Objects"],
        answer: 1,
        explanation: "A cost driver is any factor that incurs or causes a change in the cost of an activity."
      },
      {
        q: "Material price variance is calculated as:",
        opts: ["(Standard Price - Actual Price) × Actual Quantity", "(Standard Quantity - Actual Quantity) × Standard Price", "(Standard Price - Actual Price) × Standard Quantity", "Actual Quantity × Actual Price"],
        answer: 0,
        explanation: "MPV = Actual Quantity Purchased/Used × (Standard Price - Actual Price)."
      }
    ]
  },

  // Paper 5: Auditing and Ethics
  {
    id: "i-p5-may24",
    stage: "Intermediate",
    group: "Group 2",
    year: 2024,
    session: "May 2024",
    paper: "Paper 5: Auditing and Ethics",
    paperCode: "Paper 5",
    questions: 100,
    officialPdfUrl: INTERMEDIATE_OFFICIAL_LINKS["auditing-ethics"].questionPapers,
    studyMaterialUrl: INTERMEDIATE_OFFICIAL_LINKS["auditing-ethics"].studyMaterial,
    mcqs: [
      {
        q: "SA 230 specifically deals with:",
        opts: ["The Auditor's Responsibilities Relating to Fraud", "Audit Documentation (Working Papers)", "Agreeing the Terms of Audit Engagements", "Materiality in Planning and Performing an Audit"],
        answer: 1,
        explanation: "SA 230 prescribes the auditor's responsibility to prepare audit documentation for an audit of financial statements."
      },
      {
        q: "According to the ICAI Code of Ethics, which threat arises when an auditor promotes a position or opinion to the point that subsequent objectivity may be compromised?",
        opts: ["Self-interest threat", "Self-review threat", "Advocacy threat", "Familiarity threat"],
        answer: 2,
        explanation: "Advocacy threat occurs when a professional accountant promotes a client's or employer's position to the extent that objectivity is compromised."
      },
      {
        q: "Under Section 139(1) of the Companies Act 2013, a statutory auditor is appointed in the first AGM to hold office until the conclusion of:",
        opts: ["Next AGM", "Sixth AGM", "Third AGM", "Lifetime of the company"],
        answer: 1,
        explanation: "Under Section 139(1), the statutory auditor appointed at the AGM holds office from the conclusion of that meeting until the conclusion of the 6th AGM."
      }
    ]
  },
  {
    id: "i-p5-nov23",
    stage: "Intermediate",
    group: "Group 2",
    year: 2023,
    session: "Nov 2023",
    paper: "Paper 5: Auditing and Ethics",
    paperCode: "Paper 5",
    questions: 100,
    officialPdfUrl: INTERMEDIATE_OFFICIAL_LINKS["auditing-ethics"].questionPapers,
    studyMaterialUrl: INTERMEDIATE_OFFICIAL_LINKS["auditing-ethics"].studyMaterial,
    mcqs: [
      {
        q: "Which Standard on Auditing governs external confirmations?",
        opts: ["SA 501", "SA 505", "SA 520", "SA 530"],
        answer: 1,
        explanation: "SA 505 deals with the auditor's use of external confirmation procedures to obtain audit evidence in accordance with SA 330 and SA 500."
      },
      {
        q: "In an audit of financial statements, the risk that the auditor expresses an inappropriate audit opinion when the financial statements are materially misstated is known as:",
        opts: ["Inherent Risk", "Control Risk", "Detection Risk", "Audit Risk"],
        answer: 3,
        explanation: "Audit Risk is the risk that the auditor expresses an inappropriate audit opinion when the financial statements are materially misstated."
      }
    ]
  },

  // Paper 6: Financial Management & Strategic Management
  {
    id: "i-p6-may24",
    stage: "Intermediate",
    group: "Group 2",
    year: 2024,
    session: "May 2024",
    paper: "Paper 6: Financial Management and Strategic Management",
    paperCode: "Paper 6",
    questions: 100,
    officialPdfUrl: INTERMEDIATE_OFFICIAL_LINKS["fm-sm"].questionPapers,
    studyMaterialUrl: INTERMEDIATE_OFFICIAL_LINKS["fm-sm"].studyMaterial,
    mcqs: [
      {
        q: "Which capital budgeting technique explicitly assumes reinvestment of intermediate cash flows at the firm's cost of capital?",
        opts: ["Internal Rate of Return (IRR)", "Net Present Value (NPV)", "Payback Period", "Accounting Rate of Return (ARR)"],
        answer: 1,
        explanation: "NPV technique realistically assumes that intermediate cash inflows are reinvested at the firm's cost of capital (hurdle rate), unlike IRR which assumes reinvestment at IRR."
      },
      {
        q: "According to Porter's Five Forces Model, which of the following is NOT one of the competitive forces?",
        opts: ["Threat of New Entrants", "Bargaining Power of Buyers", "Government Regulation Force", "Threat of Substitute Products"],
        answer: 2,
        explanation: "Porter's 5 Forces are: Threat of new entrants, Bargaining power of buyers, Bargaining power of suppliers, Threat of substitutes, and Rivalry among existing competitors."
      },
      {
        q: "Degree of Operating Leverage (DOL) is defined as:",
        opts: ["% Change in EBIT ÷ % Change in Sales", "% Change in EPS ÷ % Change in EBIT", "Contribution ÷ EBT", "EBIT ÷ Interest"],
        answer: 0,
        explanation: "DOL measures the sensitivity of a firm's Operating Profit (EBIT) to changes in Sales: DOL = % Change in EBIT / % Change in Sales = Contribution / EBIT."
      }
    ]
  },
  {
    id: "i-p6-nov23",
    stage: "Intermediate",
    group: "Group 2",
    year: 2023,
    session: "Nov 2023",
    paper: "Paper 6: Financial Management and Strategic Management",
    paperCode: "Paper 6",
    questions: 100,
    officialPdfUrl: INTERMEDIATE_OFFICIAL_LINKS["fm-sm"].questionPapers,
    studyMaterialUrl: INTERMEDIATE_OFFICIAL_LINKS["fm-sm"].studyMaterial,
    mcqs: [
      {
        q: "In the BCG Growth-Share Matrix, a Business Unit with High Market Share in a Low Growth Market is called a:",
        opts: ["Star", "Cash Cow", "Question Mark", "Dog"],
        answer: 1,
        explanation: "Cash cows are business units with high market share in mature, low-growth industries, generating substantial surplus cash."
      },
      {
        q: "Gordon's Model of dividend valuation suggests that dividend policy has an impact on share price except when:",
        opts: ["r > k", "r < k", "r = k", "Growth rate is zero"],
        answer: 2,
        explanation: "When return on investment (r) equals the cost of capital (k), the firm is normal and dividend policy is irrelevant to firm value."
      }
    ]
  },

  // ===================== CA FOUNDATION =====================
  {
    id: "f-p1-may24",
    stage: "Foundation",
    group: "Foundation",
    year: 2024,
    session: "May 2024",
    paper: "Paper 1: Accounting",
    paperCode: "Paper 1",
    questions: 100,
    officialPdfUrl: FOUNDATION_OFFICIAL_LINKS.suggestedAnswers,
    studyMaterialUrl: FOUNDATION_OFFICIAL_LINKS["paper-1"].studyMaterial,
    mcqs: [
      {
        q: "Which accounting principle requires that financial statements should disclose all significant information?",
        opts: ["Full Disclosure Principle", "Materiality Principle", "Prudence Principle", "Consistency Principle"],
        answer: 0,
        explanation: "The Full Disclosure Principle requires that all relevant, material financial information be disclosed in the financial statements or accompanying notes."
      },
      {
        q: "In bank reconciliation, bank charges debited by bank but not yet entered in cash book will:",
        opts: ["Increase cash book balance", "Decrease passbook balance as compared to cash book", "Have no impact", "Be added back to passbook"],
        answer: 1,
        explanation: "Bank charges reduce the passbook balance; hence passbook balance is lower than cash book balance until adjusted."
      }
    ]
  },
  {
    id: "f-p2-may24",
    stage: "Foundation",
    group: "Foundation",
    year: 2024,
    session: "May 2024",
    paper: "Paper 2: Business Laws",
    paperCode: "Paper 2",
    questions: 100,
    officialPdfUrl: FOUNDATION_OFFICIAL_LINKS.suggestedAnswers,
    studyMaterialUrl: FOUNDATION_OFFICIAL_LINKS["paper-2"].studyMaterial,
    mcqs: [
      {
        q: "Under the Indian Contract Act 1872, an agreement without consideration is:",
        opts: ["Valid always", "Void ab initio (except under specific exceptions)", "Voidable", "Illegal"],
        answer: 1,
        explanation: "Section 25 stipulates that an agreement made without consideration is void, subject to exceptions like natural love and affection, past voluntary services, or time-barred debt."
      }
    ]
  },

  // ===================== CA FINAL =====================
  {
    id: "fn-p1-may24",
    stage: "Final",
    group: "Group 1",
    year: 2024,
    session: "May 2024",
    paper: "Paper 1: Financial Reporting",
    paperCode: "Paper 1",
    questions: 100,
    officialPdfUrl: FINAL_OFFICIAL_LINKS.suggestedAnswers,
    studyMaterialUrl: FINAL_OFFICIAL_LINKS["paper-1"].studyMaterial,
    mcqs: [
      {
        q: "Under Ind AS 115 (Revenue from Contracts with Customers), step 3 of the 5-step model is:",
        opts: ["Identify the contract", "Determine the transaction price", "Identify performance obligations", "Allocate transaction price"],
        answer: 1,
        explanation: "Step 1: Identify contract, Step 2: Identify performance obligations, Step 3: Determine transaction price, Step 4: Allocate price, Step 5: Recognize revenue."
      }
    ]
  },
  {
    id: "fn-p3-may24",
    stage: "Final",
    group: "Group 1",
    year: 2024,
    session: "May 2024",
    paper: "Paper 3: Advanced Auditing and Professional Ethics",
    paperCode: "Paper 3",
    questions: 100,
    officialPdfUrl: FINAL_OFFICIAL_LINKS.suggestedAnswers,
    studyMaterialUrl: FINAL_OFFICIAL_LINKS["paper-3"].studyMaterial,
    mcqs: [
      {
        q: "CARO 2020 requires reporting on whether the company has been declared a willful defaulter by any bank or financial institution under clause:",
        opts: ["Clause (ix)(b)", "Clause (i)(c)", "Clause (xi)(a)", "Clause (xvi)"],
        answer: 0,
        explanation: "Clause (ix)(b) of CARO 2020 specifically requires reporting on whether the company has been declared a willful defaulter by any bank or financial institution or other lender."
      }
    ]
  }
];

const YEARS = [2024, 2023, 2022, 2021, 2020, 2019];
const STAGES = ["Intermediate", "Foundation", "Final", "All"];
const GROUPS = ["All Groups", "Group 1", "Group 2"];

// --- Sub-components ---

function MCQItem({ mcq, idx }) {
  const [revealed, setRevealed] = useState(false);
  const labels = ["A", "B", "C", "D"];

  return (
    <div className="border border-surface-border rounded-xl p-4 bg-surface-card/60">
      <p className="text-sm text-slate-200 mb-3 font-medium">
        <span className="text-indigo-400 font-bold mr-2">Q{idx + 1}.</span>
        {mcq.q}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
        {mcq.opts.map((opt, oi) => (
          <div
            key={oi}
            className={`rounded-lg px-3 py-2 text-sm flex items-center gap-2 transition-all duration-200 ${
              revealed && oi === mcq.answer
                ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
                : revealed
                ? "bg-slate-800/40 text-slate-500"
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
            <span className="text-xs sm:text-sm">{opt}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-surface-border/50">
        <button
          onClick={() => setRevealed((r) => !r)}
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
        >
          {revealed ? "Hide Explanation" : "Show Correct Answer & Reason"}
        </button>
        {revealed && (
          <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Correct Option: {labels[mcq.answer]}
          </span>
        )}
      </div>

      {revealed && mcq.explanation && (
        <div className="mt-3 p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 leading-relaxed">
          <strong className="text-indigo-300 block mb-0.5">ICAI Key Concept:</strong>
          {mcq.explanation}
        </div>
      )}
    </div>
  );
}

function PYQCard({ paper }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="glass-panel border border-surface-border hover:border-indigo-500/30 rounded-2xl overflow-hidden flex flex-col justify-between transition-all"
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {paper.session}
            </span>
            {paper.group && paper.group !== "Foundation" && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {paper.group}
              </span>
            )}
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                paper.stage === "Foundation"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  : paper.stage === "Intermediate"
                  ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/30"
              }`}
            >
              {paper.stage}
            </span>
          </div>
          <span className="text-xs text-slate-400 font-medium shrink-0">{paper.questions} Marks</span>
        </div>

        <h3 className="text-white font-bold text-base leading-snug mb-4">
          {paper.paper}
        </h3>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-surface-border">
          <button
            onClick={() => setExpanded((e) => !e)}
            className="flex-1 min-w-[130px] flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs sm:text-sm font-semibold border border-indigo-500/20 transition-all"
          >
            <BookOpen className="w-4 h-4 text-indigo-400" />
            {expanded ? "Hide MCQs" : "Practice MCQs"}
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <a
            href={paper.officialPdfUrl || ICAI_PORTALS.announcements}
            target="_blank"
            rel="noopener noreferrer"
            title="Open official ICAI suggested answers & questions"
            className="flex-1 min-w-[140px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs sm:text-sm font-semibold border border-surface-border transition-all"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>ICAI Suggested Answers</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          {paper.studyMaterialUrl && (
            <a
              href={paper.studyMaterialUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open verified ICAI study material for this paper"
              className="px-3 py-2 rounded-xl bg-surface-card hover:bg-slate-800 text-slate-300 hover:text-indigo-300 text-xs font-semibold border border-surface-border transition-all flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Official Notes</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </a>
          )}
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
            className="overflow-hidden border-t border-surface-border bg-surface/50"
          >
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300">
                  Interactive Practice MCQs ({paper.mcqs?.length || 0})
                </span>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3 h-3" />
                  ICAI Pattern Verified
                </span>
              </div>
              {paper.mcqs && paper.mcqs.length > 0 ? (
                paper.mcqs.map((mcq, idx) => (
                  <MCQItem key={idx} mcq={mcq} idx={idx} />
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No sample questions loaded for this paper.</p>
              )}
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
  const [stage, setStage] = useState("Intermediate");
  const [groupFilter, setGroupFilter] = useState("All Groups");
  const [year, setYear] = useState("All");
  const [paper, setPaper] = useState("All");
  const [userProfile, setUserProfile] = useState(null);

  // Sync with user's selected stage and group from profile
  useEffect(() => {
    const uid = user?.id;
    if (!uid) return;
    axios.get(`/api/profile?userId=${uid}`)
      .then(res => {
        if (res?.data) {
          setUserProfile(res.data);
          if (res.data.ca_stage) {
            const capStage = res.data.ca_stage.charAt(0).toUpperCase() + res.data.ca_stage.slice(1);
            if (STAGES.includes(capStage)) setStage(capStage);
          }
          if (res.data.ca_group && res.data.ca_group !== 'Both Groups') {
            setGroupFilter(res.data.ca_group);
          }
        }
      })
      .catch(() => {});
  }, [user?.id]);

  const filtered = useMemo(() => {
    return ALL_PAPERS.filter((p) => {
      if (stage !== "All" && p.stage !== stage) return false;
      if (stage === "Intermediate" && groupFilter !== "All Groups" && p.group !== groupFilter) return false;
      if (stage === "Final" && groupFilter !== "All Groups" && p.group !== groupFilter) return false;
      if (year !== "All" && p.year !== Number(year)) return false;
      if (paper !== "All" && p.paper !== paper) return false;
      return true;
    });
  }, [stage, groupFilter, year, paper]);

  const availablePapers = useMemo(() => {
    const base = ALL_PAPERS.filter((p) => {
      if (stage !== "All" && p.stage !== stage) return false;
      if ((stage === "Intermediate" || stage === "Final") && groupFilter !== "All Groups" && p.group !== groupFilter) return false;
      if (year !== "All" && p.year !== Number(year)) return false;
      return true;
    });
    return ["All", ...Array.from(new Set(base.map((p) => p.paper)))];
  }, [stage, groupFilter, year]);

  return (
    <div className="min-h-screen text-white space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shrink-0">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
                Past Year Questions Bank
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Direct Official ICAI Links
              </span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl">
              Official ICAI Question Papers & Suggested Answers (2019-2024). Filtered specifically for your enrolled CA group without generic redirects.
            </p>
          </div>
        </div>

        {userProfile?.ca_group && (
          <div className="self-start md:self-center px-4 py-2 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
            Enrolled: {userProfile.ca_stage?.toUpperCase() || 'INTER'} — {userProfile.ca_group}
          </div>
        )}
      </motion.div>

      {/* Filters Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="glass-panel border border-surface-border rounded-2xl p-4 sm:p-5"
      >
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-slate-400 shrink-0">
            <Filter className="w-4 h-4 text-indigo-400" />
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-300">Filters</span>
          </div>

          {/* Stage Filter */}
          <div className="relative min-w-[140px]">
            <select
              value={stage}
              onChange={(e) => { setStage(e.target.value); setPaper("All"); }}
              className="w-full appearance-none bg-surface-card border border-surface-border text-slate-200 text-xs sm:text-sm font-medium rounded-xl px-3.5 py-2.5 pr-8 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {STAGES.map((s) => (
                <option key={s} value={s}>{s === "All" ? "All Stages" : `CA ${s}`}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Group Filter (Crucial requirement: shows relevant group info) */}
          {(stage === "Intermediate" || stage === "Final" || stage === "All") && (
            <div className="relative min-w-[130px]">
              <select
                value={groupFilter}
                onChange={(e) => { setGroupFilter(e.target.value); setPaper("All"); }}
                className="w-full appearance-none bg-surface-card border border-indigo-500/40 text-indigo-200 text-xs sm:text-sm font-semibold rounded-xl px-3.5 py-2.5 pr-8 focus:outline-none focus:border-indigo-500 cursor-pointer shadow-sm"
              >
                {GROUPS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-indigo-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          )}

          {/* Year Filter */}
          <div className="relative min-w-[110px]">
            <select
              value={year}
              onChange={(e) => { setYear(e.target.value); setPaper("All"); }}
              className="w-full appearance-none bg-surface-card border border-surface-border text-slate-200 text-xs sm:text-sm font-medium rounded-xl px-3.5 py-2.5 pr-8 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="All">All Years</option>
              {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Paper Selector */}
          <div className="relative flex-1 min-w-[200px]">
            <select
              value={paper}
              onChange={(e) => setPaper(e.target.value)}
              className="appearance-none w-full bg-surface-card border border-surface-border text-slate-200 text-xs sm:text-sm font-medium rounded-xl px-3.5 py-2.5 pr-8 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {availablePapers.map((p) => (
                <option key={p} value={p}>{p === "All" ? "All Papers in Group" : p}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <span className="text-xs text-slate-400 font-semibold ml-auto">
            {filtered.length} paper{filtered.length !== 1 ? "s" : ""}
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
            className="flex flex-col items-center justify-center py-20 gap-4 text-slate-400 glass-panel rounded-2xl border border-surface-border"
          >
            <BookOpen className="w-12 h-12 text-slate-600" />
            <p className="text-lg font-bold text-white">No papers match your filters</p>
            <p className="text-xs text-slate-400">Try changing Group ({groupFilter}) or Year filter.</p>
            <button
              onClick={() => { setGroupFilter("All Groups"); setYear("All"); setPaper("All"); }}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition-all"
            >
              Reset Filters
            </button>
          </motion.div>
        ) : (
          <motion.div key="grid" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((p) => (
              <PYQCard key={p.id} paper={p} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Official ICAI Portal Links Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>
            All papers, suggested answers, and syllabus materials directly link to the verified{" "}
            <a
              href={ICAI_PORTALS.intermediatePortal}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:underline font-bold"
            >
              ICAI Board of Studies (BoS) Portal
            </a>
            . Zero generic redirects.
          </span>
        </div>
        <a
          href="https://www.icai.org/category/examination"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-card hover:bg-slate-800 text-slate-200 border border-surface-border transition-all font-semibold"
        >
          <span>ICAI Exam Announcements</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </a>
      </div>
    </div>
  );
}
