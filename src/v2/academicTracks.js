/**
 * Academic Tracks & Multi-Stage Stream Configuration for Tutovia V2
 * 
 * "For Students, By Students"
 * Supports the entire Commerce & Professional progression:
 * 1. Class 11 (Commerce Fundamentals)
 * 2. Class 12 (Board Exam Preparation)
 * 3. CA Foundation (ICAI Entry Level)
 * 4. CA Intermediate & Final (Professional Mastery)
 */

export const ACADEMIC_TRACKS = {
  class_11: {
    id: 'class_11',
    name: 'Class 11 (Commerce)',
    shortName: 'Class 11',
    category: 'Foundation Builder',
    badge: 'Senior Secondary • Commerce',
    tagline: 'Building unbreakable fundamentals in accounting & economic thinking.',
    description: 'Master the core accounting principles, journal entries, and microeconomic models that form the backbone of all future commerce studies.',
    icon: 'BookOpen',
    color: '#0284C7', // Sky
    accentBg: 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-300',
    subjects: [
      {
        id: 'c11_acc',
        name: 'Accountancy',
        topics: ['Introduction to Accounting', 'Basic Accounting Terms', 'Theory Base & Standards', 'Recording Transactions (Journal)', 'Bank Reconciliation Statement (BRS)', 'Trial Balance & Rectification', 'Depreciation & Provisions', 'Financial Statements of Sole Proprietorship'],
        highlight: 'Golden rules of debit/credit & balance sheet balancing'
      },
      {
        id: 'c11_eco',
        name: 'Economics',
        topics: ['Introduction to Microeconomics', 'Consumer Equilibrium (Utility & IC)', 'Demand & Elasticity of Demand', 'Production & Cost Analysis', 'Revenue & Producer Equilibrium', 'Supply & Elasticity', 'Forms of Market', 'Statistics for Economics (Measures of Central Tendency)'],
        highlight: 'Indifference curves & price elasticity formulas'
      },
      {
        id: 'c11_bst',
        name: 'Business Studies',
        topics: ['Nature & Purpose of Business', 'Forms of Business Organisation', 'Private, Public & Global Enterprises', 'Business Services (Banking & Insurance)', 'Emerging Modes of Business', 'Social Responsibility & Ethics', 'Sources of Business Finance', 'Internal Trade & International Business'],
        highlight: 'Partnership deed vs sole proprietorship comparative matrix'
      },
      {
        id: 'c11_math',
        name: 'Applied Mathematics',
        topics: ['Numbers, Quantification & Numerical Applications', 'Algebra (Sets, Relations, Complex Numbers)', 'Calculus Basics', 'Probability', 'Descriptive Statistics', 'Financial Mathematics (Compound Interest, Annuity)'],
        highlight: 'Time value of money & annuity foundations'
      }
    ],
    nextStepPreview: {
      targetId: 'class_12',
      title: 'Next Step: Class 12 Boards & Partnership Accounts',
      teaser: 'Class 11 journal mechanics seamlessly expand into Partnership Deed dissolution and Company Shares & Debentures in Class 12.'
    },
    pressureProfiles: [
      { id: 'coaching_clash', label: 'School vs Coaching Hours Clash', advice: 'Tutovia creates a compact 90-minute evening block so homework never eats your sleep.' },
      { id: 'first_term', label: 'First Term Accountancy Shock', advice: 'We break debit/credit rules into intuitive real-life scenarios until journalizing is second nature.' },
      { id: 'eco_curves', label: 'Confusion with Economics Curves', advice: 'Interactive diagrams explain utility shifts without memorizing arbitrary coordinates.' }
    ],
    tutorDoubtPrompts: [
      {
        id: 'c11_rules',
        label: 'Explain 3 Golden Rules',
        query: 'Explain the 3 Golden Rules of Accounting with clear real-world examples.',
        answer: "The 3 Golden Rules of Traditional Accounting:\n\n1. Personal Accounts (Persons, firms, companies):\n   • Rule: Debit the Receiver, Credit the Giver.\n   • Example: Paid ₹10,000 to Rohan -> Rohan is receiver (Dr), Bank gives (Cr).\n\n2. Real Accounts (Tangible & intangible assets):\n   • Rule: Debit what comes in, Credit what goes out.\n   • Example: Purchased Furniture for ₹25,000 cash -> Furniture comes in (Dr), Cash goes out (Cr).\n\n3. Nominal Accounts (Expenses, losses, incomes, gains):\n   • Rule: Debit all expenses/losses, Credit all incomes/gains.\n   • Example: Paid office rent ₹8,000 -> Rent is expense (Dr), Cash goes out (Cr).\n\nModern Equation shortcut: Assets + Expenses increase with DEBIT. Liabilities + Capital + Revenue increase with CREDIT."
      },
      {
        id: 'c11_balance_sheet',
        label: 'Why does Balance Sheet tally?',
        query: 'Why does the Balance Sheet always tally? What if it does not?',
        answer: "The Balance Sheet is an expression of the Fundamental Accounting Equation:\n\nAssets = Capital (Owner Equity) + External Liabilities\n\nEvery single economic transaction has a dual aspect (Dual Aspect Principle). For example:\n• If you borrow ₹1,00,000 from a bank: Cash asset increases by ₹1,00,000 and Bank Loan liability increases by ₹1,00,000.\n• If you buy goods on credit for ₹20,000: Stock asset increases by ₹20,000 and Creditors liability increases by ₹20,000.\n\nIf it doesn't tally, check for: (1) Omission of one-sided entries, (2) Posting to wrong side of ledger, or (3) Arithmetical error in Trial Balance. Tutovia checks these steps in order!"
      },
      {
        id: 'c11_elasticity',
        label: 'Price Elasticity of Demand',
        query: 'How do I easily calculate and interpret Price Elasticity of Demand (Ed)?',
        answer: "Price Elasticity of Demand (Ed) measures responsiveness of quantity demanded to price changes:\n\nEd = (% Change in Quantity Demanded) / (% Change in Price)\nEd = (ΔQ / ΔP) × (P / Q)\n\nKey Benchmarks to remember:\n• Ed > 1: Elastic (Luxury items, close substitutes available — price rise drops demand drastically).\n• Ed = 1: Unitary Elastic (Rectangular hyperbola demand curve).\n• Ed < 1: Inelastic (Necessities like salt or life-saving medicines — demand stays stable regardless of price).\n• Ed = 0: Perfectly Inelastic (Vertical demand curve)."
      },
      {
        id: 'c11_fear',
        label: 'Scared of Accountancy exam',
        query: 'I am terrified of failing my school Accountancy midterm exam.',
        answer: "Take a deep breath. Almost every student struggles when transitioning from Class 10 to Class 11 Accountancy because it is a completely new language!\n\nHere is your 3-day recovery formula:\n1. Day 1: Master the Modern Rules of Accounting (Asset/Expense = Debit when up; Liability/Capital/Income = Credit when up).\n2. Day 2: Solve 10 complete Journal Entries and 3 Bank Reconciliation Statements (BRS).\n3. Day 3: Financial Statements with only 3 basic adjustments (Closing Stock, Outstanding Rent, Prepaid Insurance).\n\nYou do not need 100% tonight — just win these 3 high-yield fundamentals!"
      }
    ],
    flashcards: [
      { id: 'fc11_1', topic: 'Accounting Rules', question: 'What is the modern rule for an increase in an Expense account?', answer: 'DEBIT. All expenses and assets increase with Debit and decrease with Credit.', difficulty: 'Easy' },
      { id: 'fc11_2', topic: 'BRS', question: 'What happens to Passbook balance when a cheque deposited is dishonoured?', answer: 'The Passbook balance DECREASES (or is lower than the Cash Book) because the bank reverses the credited funds.', difficulty: 'Medium' },
      { id: 'fc11_3', topic: 'Microeconomics', question: 'State the Law of Diminishing Marginal Utility (DMU).', answer: 'As a consumer consumes more and more units of a specific commodity, the utility derived from each successive unit decreases.', difficulty: 'Easy' },
      { id: 'fc11_4', topic: 'Depreciation', question: 'Difference between Straight Line Method (SLM) and Written Down Value (WDV)?', answer: 'In SLM, depreciation is calculated on the Original Cost every year (constant amount). In WDV, depreciation is calculated on the reducing book balance (decreasing amount).', difficulty: 'Medium' }
    ]
  },

  class_12: {
    id: 'class_12',
    name: 'Class 12 (Board Prep)',
    shortName: 'Class 12',
    category: 'Board Mastery & Bridge',
    badge: 'Class 12 Boards • CBSE / ISC / State',
    tagline: 'High-score board preparation and the bridge to CA Foundation.',
    description: 'Score 95%+ in Board examinations while building the advanced analytical capabilities required for professional entrance.',
    icon: 'Award',
    color: '#059669', // Emerald
    accentBg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300',
    subjects: [
      {
        id: 'c12_acc',
        name: 'Accountancy (Part 1 & 2)',
        topics: ['Accounting for Partnership Firms (Fundamentals)', 'Goodwill: Nature & Valuation', 'Change in Profit Sharing Ratio (PSR)', 'Admission of a Partner', 'Retirement / Death of a Partner', 'Dissolution of Partnership Firm', 'Accounting for Share Capital (Issue, Forfeiture & Reissue)', 'Accounting for Debentures', 'Financial Statement Analysis', 'Cash Flow Statement (AS 3)'],
        highlight: 'Partnership adjustment entries & Share forfeiture journalizing'
      },
      {
        id: 'c12_eco',
        name: 'Economics',
        topics: ['National Income & Related Aggregates', 'Money and Banking (Central Bank & Commercial Banks)', 'Determination of Income & Employment (Multiplier)', 'Government Budget and the Economy', 'Balance of Payments & Foreign Exchange', 'Development Experience (1947-90) & Economic Reforms (1991)', 'Current Challenges facing Indian Economy', 'Comparative Development Experiences of India & Neighbors'],
        highlight: 'National Income 3-method computations & Investment Multiplier'
      },
      {
        id: 'c12_bst',
        name: 'Business Studies',
        topics: ['Nature and Significance of Management', 'Principles of Management (Fayol & Taylor)', 'Business Environment', 'Planning', 'Organising', 'Staffing', 'Directing', 'Controlling', 'Financial Management & Capital Structure', 'Financial Markets (SEBI)', 'Marketing Management', 'Consumer Protection Act 2019'],
        highlight: 'Case study identification & Capital Structure Trading on Equity'
      },
      {
        id: 'c12_math',
        name: 'Applied Mathematics',
        topics: ['Higher Calculus (Integration & Differential Equations)', 'Probability Distributions (Binomial, Poisson, Normal)', 'Index Numbers & Time Series', 'Financial Mathematics (Perpetuity, Sinking Funds, EMI, CAGR)', 'Linear Programming Problems (LPP)'],
        highlight: 'Sinking fund amortization schedules & EMI calculations'
      }
    ],
    nextStepPreview: {
      targetId: 'ca_foundation',
      title: 'Next Step: CA Foundation Direct Exemption & Parallel Study',
      teaser: 'Over 65% of Class 12 Accountancy and Economics overlaps directly with CA Foundation Paper 1 & Paper 4!'
    },
    pressureProfiles: [
      { id: 'board_preboards', label: 'Pre-board Pressure & Syllabus Backlog', advice: 'Tutovia prioritizes the high-weightage 8-mark partnership and share forfeiture questions first.' },
      { id: 'cuet_balance', label: 'Balancing Boards with CUET / CA Foundation', advice: 'Dual-purpose study blocks that solve board numericals while testing MCQs for entrance speed.' },
      { id: 'presentation_loss', label: 'Losing Marks in Working Notes & Formats', advice: 'Step-by-step ICAI and CBSE compliant balance sheet and journal formats.' }
    ],
    tutorDoubtPrompts: [
      {
        id: 'c12_forfeiture',
        label: 'Share Forfeiture & Reissue',
        query: 'Explain the complete journal entries for Forfeiture and Reissue of Shares issued at Premium.',
        answer: "Share Forfeiture of Shares Issued at Premium:\n\nCase 1: When Premium has already been received:\n• The Securities Premium account is NOT touched (Section 52(2) restrictions).\n• Entry:\n  Share Capital A/c (Called-up Face Value) Dr.\n    To Calls-in-Arrears A/c (Unpaid amount excluding premium)\n    To Shares Forfeited A/c (Amount actually received towards face value)\n\nCase 2: When Premium has NOT been received:\n• Securities Premium must be cancelled (debited).\n• Entry:\n  Share Capital A/c (Called-up Face Value) Dr.\n  Securities Premium A/c (Unpaid premium) Dr.\n    To Calls-in-Arrears A/c (Total unpaid amount including premium)\n    To Shares Forfeited A/c (Amount actually received towards face value)\n\nReissue at Discount:\n• Reissue discount cannot exceed the amount previously forfeited on those shares!\n• Discount is debited to 'Shares Forfeited A/c'.\n• Net gain transferred to Capital Reserve A/c."
      },
      {
        id: 'c12_national_income',
        label: 'National Income 3-Method Guide',
        query: 'How do I avoid double-counting in National Income (Value Added vs Expenditure method)?',
        answer: "National Income (NNP at Factor Cost) Safeguards:\n\n1. Value Added Method (Output Method):\n   • Gross Value Added (GVA) = Value of Output - Intermediate Consumption.\n   • Golden rule: Always subtract Intermediate Goods (e.g., flour used by a baker). Only count Final Goods to prevent double-counting!\n\n2. Expenditure Method:\n   • GDP_mp = C (Private Final Consumption) + I (Gross Domestic Capital Formation) + G (Govt Final Consumption) + (X - M) (Net Exports).\n   • Common trap: If question gives 'Net Domestic Fixed Capital Formation', remember to add: (i) Depreciation, and (ii) Change in Stock to get Gross Investment.\n\nConversion Formula:\n• Gross to Net: Subtract Depreciation\n• Domestic to National: Add NFIA (Net Factor Income from Abroad)\n• Market Price to Factor Cost: Subtract Net Indirect Taxes (NIT = Indirect Taxes - Subsidies)."
      },
      {
        id: 'c12_sacrificing',
        label: 'Sacrificing Ratio in Partnership',
        query: 'What is Sacrificing Ratio and why do we calculate it on admission of a partner?',
        answer: "Sacrificing Ratio = Old Share - New Share.\n\nWhy it is mandatory:\nWhen a new partner enters the firm, the old partners surrender (sacrifice) a portion of their profit share in favour of the incoming partner.\n\nThe incoming partner must compensate the sacrificing partners for this surrender by bringing in Goodwill (Premium for Goodwill). This premium is credited to the old partners STRICTLY in their Sacrificing Ratio (not old ratio)!"
      },
      {
        id: 'c12_preboard_panic',
        label: 'Pre-board marks dropped',
        query: 'My pre-board marks were disappointing (62/80 in Accounts). How do I hit 95+ in the final board?',
        answer: "Pre-board marking is intentionally strict to keep students vigilant. Do not panic—a 62 in pre-boards easily converts into 95 in the main boards with targeted calibration:\n\n1. Audit your lost marks: Was it conceptual (e.g. wrong adjustment in Cash Flow) or format errors (omitted narration, missing working notes)?\n2. Master the Three 8-Mark Anchors: (a) Admission/Retirement comprehensive problem, (b) Share Forfeiture & Reissue comprehensive problem, (c) Cash Flow Statement.\n3. Solve 5 full 3-hour past board papers under strict timed conditions with proper ledger formats."
      }
    ],
    flashcards: [
      { id: 'fc12_1', topic: 'Company Accounts', question: 'What is the maximum permissible discount on reissue of forfeited shares?', answer: 'The maximum discount allowed is equal to the amount already credited to the Shares Forfeited Account in respect of those specific reissued shares.', difficulty: 'Medium' },
      { id: 'fc12_2', topic: 'Cash Flow Statement', question: 'How is Dividend Paid classified in a Cash Flow Statement for a non-financial enterprise?', answer: 'Always classified as FINANCING ACTIVITY (cash outflow), because it is a return to providers of equity capital.', difficulty: 'Easy' },
      { id: 'fc12_3', topic: 'Macroeconomics', question: 'What is the formula for Investment Multiplier (k)?', answer: 'k = 1 / (1 - MPC) or k = 1 / MPS, where MPC is Marginal Propensity to Consume and MPS is Marginal Propensity to Save.', difficulty: 'Easy' },
      { id: 'fc12_4', topic: 'Partnership', question: 'In the absence of a Partnership Deed, what interest rate is payable on a loan advanced by a partner to the firm?', answer: '6% per annum (simple interest), as per Section 13(d) of the Indian Partnership Act, 1932.', difficulty: 'Easy' }
    ]
  },

  ca_foundation: {
    id: 'ca_foundation',
    name: 'CA Foundation',
    shortName: 'CA Foundation',
    category: 'ICAI Entry Level',
    badge: 'ICAI CA Foundation • All 4 Papers',
    tagline: 'Professional entrance mastery with strict negative marking defense.',
    description: 'Master Accounting, Business Laws, Quantitative Aptitude, and Business Economics with ICAI-calibrated illustrative drills and mock papers.',
    icon: 'GraduationCap',
    color: '#D97706', // Amber / Orange
    accentBg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300',
    subjects: [
      {
        id: 'caf_p1',
        name: 'Paper 1: Accounting (100 Marks)',
        topics: ['Theoretical Framework', 'Accounting Process & BRS', 'Inventories (FIFO, Weighted Avg)', 'Depreciation & Amortisation', 'Bills of Exchange & Promissory Notes', 'Preparation of Final Accounts (Sole Proprietorship)', 'Financial Statements of NPO', 'Accounts from Incomplete Records (Single Entry)', 'Partnership and LLP Accounts', 'Company Accounts (Shares & Debentures)'],
        highlight: 'NPO Subscription account balancing & Single Entry conversions'
      },
      {
        id: 'caf_p2',
        name: 'Paper 2: Business Laws (100 Marks)',
        topics: ['The Indian Regulatory Framework', 'The Indian Contract Act, 1872', 'The Sale of Goods Act, 1930', 'The Indian Partnership Act, 1932', 'The Limited Liability Partnership Act, 2008', 'The Companies Act, 2013 (Basics & Incorporation)'],
        highlight: 'Contract Act Section 10 valid contracts & Sale vs Agreement to Sell'
      },
      {
        id: 'caf_p3',
        name: 'Paper 3: Quantitative Aptitude (100 Marks)',
        topics: ['Ratio and Proportion, Indices, Logarithms', 'Equations (Linear, Quadratic)', 'Linear Inequalities', 'Mathematics of Finance (Simple/Compound Interest, Annuity, Perpetuity)', 'Permutations and Combinations', 'Sequence and Series (AP, GP)', 'Sets, Relations and Functions', 'Calculus (Differential & Integral)', 'Statistical Representation of Data', 'Measures of Central Tendency & Dispersion', 'Probability & Theoretical Distributions', 'Correlation and Regression', 'Index Numbers'],
        highlight: 'Time Value of Money (35+ marks) & Annuity shortcuts'
      },
      {
        id: 'caf_p4',
        name: 'Paper 4: Business Economics (100 Marks)',
        topics: ['Introduction to Business Economics', 'Theory of Demand and Supply', 'Theory of Production and Cost', 'Price Determination in Different Markets', 'Determination of National Income', 'Public Finance', 'Money Market & Monetary Policy', 'International Trade & Trade Policies', 'Indian Economy Highlights'],
        highlight: 'Market price equilibrium & Monetary policy transmission'
      }
    ],
    nextStepPreview: {
      targetId: 'ca_inter_final',
      title: 'Next Step: CA Intermediate (8 Subjects) & Articleship Planning',
      teaser: 'Clear Foundation with high aggregate (250+) to unlock choice articleship firms and seamless Intermediate transition.'
    },
    pressureProfiles: [
      { id: 'maths_anxiety', label: 'Maths / Non-Maths Background Anxiety', advice: 'Focus on Time Value of Money + Statistics which account for over 65 marks with calculator shortcuts!' },
      { id: 'law_drafting', label: 'Drafting Answers in Business Laws', advice: 'Use the proven 3-step legal structure: Provision -> Facts Analysis -> Conclusion.' },
      { id: 'negative_marking', label: 'Negative Marking in Paper 3 & 4', advice: 'Tutovia trains you to skip low-confidence guesses and defend your 40-mark passing floor.' }
    ],
    tutorDoubtPrompts: [
      {
        id: 'caf_contract_void',
        label: 'Void Agreement vs Void Contract',
        query: 'What is the precise legal difference between a Void Agreement and a Void Contract under the Indian Contract Act, 1872?',
        answer: "Distinction under the Indian Contract Act, 1872:\n\n1. Void Agreement [Section 2(g)]:\n   • Definition: An agreement not enforceable by law.\n   • Status: Void from the very beginning (Void ab initio).\n   • Example: Agreement with a minor (Mohori Bibee v. Dharmodas Ghose) or agreement in restraint of trade (Section 27).\n   • Legal Effect: Never acquires the status of a contract; no restitution usually enforceable unless covered by Section 65 exceptions.\n\n2. Void Contract [Section 2(j)]:\n   • Definition: A contract which ceases to be enforceable by law becomes void when it ceases to be enforceable.\n   • Status: Valid when initially formed, but becomes void subsequently due to supervening impossibility or illegality (Section 56).\n   • Example: Contract to import goods from a foreign country, but war breaks out before performance making import illegal.\n\nKey ICAI Exam Takeaway: Never write 'Void contract ab initio' — a contract is only void subsequently; an agreement is void ab initio!"
      },
      {
        id: 'caf_tvm',
        label: 'Annuity Calculator Shortcuts',
        query: 'What is the formula and calculator trick for Present Value of Annuity Regular in Paper 3?',
        answer: "Mathematics of Finance (Paper 3 — 35+ Marks Anchor):\n\nPresent Value of Annuity Regular (PVA):\nPVA = A × [ (1 - (1 + i)^(-n)) / i ]\n\nStandard 12-Digit Calculator Trick:\nTo compute [ (1 - (1 + i)^(-n)) / i ] in 8 seconds:\n1. Type: 1 + i (e.g. for 10%, type 1.10)\n2. Press: ÷\n3. Press: = (Repeat '=' key 'n' times!)\n4. Press: - 1 =\n5. Press: ÷ i\n6. Press: × A (Annual instalment)\n\nThis single trick saves up to 15 minutes in CA Foundation Paper 3!"
      },
      {
        id: 'caf_consignment',
        label: 'Normal vs Abnormal Loss in Consignment',
        query: 'How are Normal Loss and Abnormal Loss treated in Consignment Accounts?',
        answer: "Consignment Accounts Treatment:\n\n1. Normal Loss (Inherent nature of goods — evaporation, leakage, natural wastage):\n   • NO separate entry in Consignment Account!\n   • Treatment: The cost of normal lost units is absorbed by remaining good units (Cost per unit increases).\n   • Valuation formula: Unsold Stock Value = (Total Cost + Non-recurring Expenses) / (Total Units - Normal Loss Units) × Unsold Units.\n\n2. Abnormal Loss (Accident, fire, theft, mishandling):\n   • Credited to Consignment Account at proportionate cost + expenses up to the point of loss.\n   • If insured: Insurance claim debited, balance loss debited to Profit & Loss A/c."
      },
      {
        id: 'caf_fail_fear',
        label: 'Scared of 40% paper cutoff',
        query: 'I am terrified I will clear aggregate but fail in Paper 3 (Maths & Stats) by scoring below 40.',
        answer: "This is the single most common fear in CA Foundation, and here is how to mathematically make it impossible to score below 40:\n\nPaper 3 is divided into: Maths (40 Marks), Logical Reasoning (20 Marks), Statistics (40 Marks).\n\nYour 40-Mark Shield Strategy:\n1. Master Logical Reasoning (20 Marks): Direction tests, Blood relations, Seating arrangement, Number series. Target: 16/20!\n2. Master High-Yield Statistics (40 Marks): Measures of Central Tendency & Dispersion (12-14 marks), Index numbers (6 marks), Statistical description (6 marks). Target: 22/40!\n3. Maths: Focus ONLY on Time Value of Money (14-16 marks). Target: 10/16.\n\nTotal minimum target: 16 + 22 + 10 = 48 Marks without touching complex calculus! You are safe."
      }
    ],
    flashcards: [
      { id: 'fcf_1', topic: 'Business Laws', question: 'Under Section 2(d) of Contract Act, can consideration proceed from a third party (stranger to consideration)?', answer: 'YES! In India, consideration may proceed from the promisee OR ANY OTHER PERSON (Chinnaya v. Ramayya). A stranger to consideration CAN sue, but a stranger to contract cannot.', difficulty: 'Medium' },
      { id: 'fcf_2', topic: 'Quant Aptitude', question: 'What is the relationship between Arithmetic Mean (AM), Geometric Mean (GM), and Harmonic Mean (HM)?', answer: 'For positive unequal observations: AM > GM > HM. Also: (GM)² = AM × HM.', difficulty: 'Easy' },
      { id: 'fcf_3', topic: 'Economics', question: 'What is the shape of the Average Fixed Cost (AFC) curve?', answer: 'RECTANGULAR HYPERBOLA. As output expands, fixed costs are spread over more units, approaching the axes asymptotically but never touching them.', difficulty: 'Easy' },
      { id: 'fcf_4', topic: 'Accounting', question: 'State the rule of inventory valuation as per AS 2 (Revised).', answer: 'Inventories should be valued at the LOWER OF COST AND NET REALIZABLE VALUE (NRV), evaluated item by item.', difficulty: 'Easy' }
    ]
  },

  ca_inter_final: {
    id: 'ca_inter_final',
    name: 'CA Intermediate & Final',
    shortName: 'CA Inter & Final',
    category: 'Professional Mastery',
    badge: 'ICAI CA Intermediate & Final • Both Groups',
    tagline: 'Articleship-compatible mastery with 100% preserved specialized modules.',
    description: 'Designed for articleship trainees balancing 10-hour audit calls, dual groups, corporate laws, accounting standards, and direct tax provisions.',
    icon: 'Brain',
    color: '#7C3AED', // Violet / Purple
    accentBg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300',
    subjects: [
      {
        id: 'cai_adv_acc',
        name: 'Advanced Accounting (AS & Ind AS)',
        topics: ['AS 1 (Disclosure of Policies)', 'AS 10 (Property, Plant and Equipment - Component Accounting)', 'AS 16 (Borrowing Costs)', 'AS 28 (Impairment of Assets)', 'AS 29 (Provisions, Contingent Liabilities)', 'Consolidated Financial Statements', 'Amalgamation & Reconstruction', 'Buyback of Shares', 'Branch Accounting'],
        highlight: 'AS 10 Component Accounting & AS 28 Impairment Test'
      },
      {
        id: 'cai_corp_law',
        name: 'Corporate & Other Laws',
        topics: ['Companies Act 2013: Prospectus, Allotment, Share Capital', 'Management & Administration (General Meetings, Postal Ballot)', 'Declaration & Payment of Dividend (Sec 123)', 'Accounts of Companies (Sec 128-137, CSR Sec 135)', 'Audit & Auditors (Sec 139-148)', 'The Foreign Exchange Management Act, 1999 (FEMA)', 'The General Clauses Act, 1897', 'Interpretation of Statutes'],
        highlight: 'Section 135 CSR thresholds & CARO 2020 Reporting'
      },
      {
        id: 'cai_tax',
        name: 'Taxation (Direct Tax & GST)',
        topics: ['Basic Concepts & Residential Status', 'Salaries, House Property, PGBP', 'Capital Gains (Section 54, 54B, 54EC, 54F Exemptions)', 'Income from Other Sources', 'Clubbing & Set-off of Losses', 'Deductions (Chapter VI-A: 80C to 80U)', 'TDS / TCS Provisions', 'GST Concept, Supply (Sec 7), ITC (Sec 16-18)'],
        highlight: 'Section 54 Capital Gains reinvestment & Section 16 ITC criteria'
      },
      {
        id: 'cai_audit',
        name: 'Auditing and Ethics',
        topics: ['Nature, Objective and Scope of Audit', 'Audit Strategy, Planning and Programme (SA 300)', 'Risk Assessment and Internal Control (SA 315)', 'Audit Evidence (SA 500 series)', 'Audit of Items of Financial Statements', 'Audit Documentation (SA 230)', 'Completion and Review (SA 700 series)', 'CARO 2020 Reporting Clauses', 'Audit of Banks and Special Entities'],
        highlight: 'CARO 2020 Clauses (i) through (xxi) mandatory reporting'
      }
    ],
    nextStepPreview: {
      targetId: 'ca_inter_final',
      title: 'Active Stage: CA Intermediate / Final Qualified CA Practice',
      teaser: 'Master practical ICAI drafting to complete both groups and transition directly into top-tier advisory and audit practices.'
    },
    pressureProfiles: [
      { id: 'articleship_delay', label: 'Articleship Audit Work Running Late (+90m Delay)', advice: '1-click dynamic routine adjuster recalculates evening study blocks without breaking your daily streak.' },
      { id: 'both_groups', label: 'Both Groups Information Overload', advice: 'Spaced repetition flashcards keep Accounting Standards & Section numbers fresh with 15-minute daily drills.' },
      { id: 'theory_drain', label: 'Mental Fatigue After Heavy Office Work', advice: 'Tutovia swaps heavy law drafting for practical computational drills on tired evenings.' }
    ],
    tutorDoubtPrompts: [
      {
        id: 'cai_as10',
        label: 'AS 10: Component Accounting',
        query: 'Explain AS 10 Component Accounting using the airplane analogy.',
        answer: "AS 10 (Revised) Property, Plant and Equipment — Component Accounting:\n\nThink of a commercial passenger aircraft:\n• The fuselage (airframe) lasts 25 to 30 years.\n• The jet engines require a complete technological overhaul and replacement every 5 to 7 years.\n\nComponent Accounting Principle:\nDo NOT depreciate the entire ₹500 Crore airplane as one single composite asset over 25 years!\nInstead, allocate the total cost:\n1. Fuselage component: ₹350 Cr depreciated over 25 years.\n2. Engine component: ₹150 Cr depreciated over 6 years.\n\nWhen the engine is replaced after 6 years:\n• Derecognize the carrying amount of old engine.\n• Capitalize the new engine cost.\n\nBenefit: Eliminates profit distortion on replacement date and reflects true economic wear and tear on your balance sheet!"
      },
      {
        id: 'cai_sec54',
        label: 'Direct Tax: Section 54 Exemption',
        query: 'What are the eligibility criteria and time limits for Capital Gains exemption under Section 54?',
        answer: "Section 54 (Exemption on Transfer of Long-Term Residential House Property):\n\n1. Eligible Assessee: Individual or HUF ONLY.\n2. Asset Transferred: Long-Term Capital Asset being a residential house property (holding period > 24 months).\n3. Reinvestment Requirements (New Residential House in India):\n   • Purchase: Within 1 year BEFORE or 2 years AFTER the date of transfer.\n   • Construction: Within 3 years AFTER the date of transfer.\n4. Capital Gains Account Scheme (CGAS):\n   • If amount is not utilized before filing return u/s 139(1), deposit funds in CGAS account.\n5. Lock-in Period: 3 years from date of acquisition/construction of new house.\n   • If transferred within 3 years: Cost of new house reduced by exempted capital gains!"
      },
      {
        id: 'cai_caro',
        label: 'CARO 2020 Reporting Clauses',
        query: 'What does an auditor report under Clause (i) and Clause (ii) of CARO 2020?',
        answer: "CARO 2020 Mandatory Reporting:\n\nClause (i) — Property, Plant & Equipment and Intangible Assets:\n• (a) Maintenance of proper records showing full particulars, quantitative details and situation of PPE.\n• (b) Physical verification of PPE by management at reasonable intervals; whether material discrepancies were properly dealt with.\n• (c) Title deeds of immovable properties (other than leases) held in the name of the company.\n• (d) Revaluation of PPE / Intangibles (whether based on registered valuer and if change is ≥ 10%).\n• (e) Benami property proceedings pending or initiated under Benami Transactions Act.\n\nClause (ii) — Inventories:\n• (a) Physical verification of inventory at reasonable intervals; discrepancies ≥ 10% in aggregate for each class properly accounted.\n• (b) Working Capital limits in excess of ₹5 Crores sanctioned from banks on basis of current assets: quarterly returns/statements filed agree with books of account!"
      },
      {
        id: 'cai_exhausted',
        label: 'Exhausted after 10h articleship',
        query: 'I returned home at 9:30 PM completely drained from an audit assignment. Can I study without burning out?',
        answer: "Listen to your mind. Pushing heavy theory or dense law provisions tonight will only result in zero retention and tomorrow's exhaustion.\n\nUse Tutovia's Evening Recovery Protocol:\n1. Drink water, take a warm shower, and disconnect from office emails.\n2. Run a 25-minute light practical drill: Pick 3 computational questions on an accounting standard you already enjoy (e.g., AS 16 Borrowing Costs).\n3. Review 10 Spaced Repetition Flashcards on Section numbers while lying down.\n4. Total study time: 35 focused minutes. Your streak stays intact, and you protect tomorrow's energy!"
      }
    ],
    flashcards: [
      { id: 'fcai_1', topic: 'CARO 2020', question: 'Under CARO 2020 Clause (ii)(b), what sanctioned working capital limit triggers mandatory quarterly statement verification?', answer: 'Working capital limit in excess of ₹5 CRORES in aggregate from banks/financial institutions on the security of current assets.', difficulty: 'Medium' },
      { id: 'fcai_2', topic: 'Direct Tax', question: 'What is the holding period requirement for unlisted shares to qualify as a Long-Term Capital Asset?', answer: 'MORE THAN 24 MONTHS immediately preceding the date of transfer (as per Section 2(42A)).', difficulty: 'Easy' },
      { id: 'fcai_3', topic: 'AS 28', question: 'Define "Recoverable Amount" under AS 28 (Impairment of Assets).', answer: 'Recoverable Amount is the HIGHER of an asset’s Net Selling Price (Fair Value less costs to sell) and its Value in Use (present value of estimated future cash flows).', difficulty: 'Medium' },
      { id: 'fcai_4', topic: 'Companies Act', question: 'What are the net profit/turnover thresholds for mandatory CSR under Section 135?', answer: 'Net Worth ≥ ₹500 Cr, OR Turnover ≥ ₹1,000 Cr, OR Net Profit ≥ ₹5 Cr during the immediately preceding financial year.', difficulty: 'Easy' }
    ]
  }
};

export const TRACK_LIST = Object.values(ACADEMIC_TRACKS);

export const DEFAULT_TRACK_ID = 'ca_foundation';

export function getActiveTrack(trackId) {
  return ACADEMIC_TRACKS[trackId] || ACADEMIC_TRACKS[DEFAULT_TRACK_ID];
}

export function getSavedTrackId() {
  if (typeof window === 'undefined') return DEFAULT_TRACK_ID;
  try {
    return localStorage.getItem('tutovia_academic_track') || DEFAULT_TRACK_ID;
  } catch {
    return DEFAULT_TRACK_ID;
  }
}

export function saveTrackId(trackId) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('tutovia_academic_track', trackId);
  } catch (e) {
    console.error('Failed to save academic track', e);
  }
}

/**
 * Visual Academic Journey Progression Roadmap
 * Class 11 -> Class 12 -> CA Foundation -> CA Intermediate -> CA Final
 */
export const STAGE_JOURNEY_ROADMAP = [
  { id: 'class_11', title: 'Class 11', subtitle: 'Commerce Fundamentals', stageLevel: 1, isFuturePreview: false },
  { id: 'class_12', title: 'Class 12', subtitle: 'Board Examination', stageLevel: 2, isFuturePreview: false },
  { id: 'ca_foundation', title: 'CA Foundation', subtitle: 'ICAI Entry Level', stageLevel: 3, isFuturePreview: false },
  { id: 'ca_inter', title: 'CA Intermediate', subtitle: 'Both Groups & Articleship', stageLevel: 4, isFuturePreview: false },
  { id: 'ca_final', title: 'CA Final', subtitle: 'Chartered Accountant', stageLevel: 5, isFuturePreview: true }
];

/**
 * Empathy-First Context Factors
 * "What's affecting your study today?"
 */
export const EMPATHY_FACTORS = [
  {
    id: 'good_energy',
    label: 'Good energy',
    emoji: '😊',
    recommendation: 'High cognitive bandwidth detected! Tackle complex practical computations and challenging questions today.',
    targetRatio: 1.0,
    badge: 'Peak Energy'
  },
  {
    id: 'normal_day',
    label: 'Normal day',
    emoji: '😐',
    recommendation: 'Steady and balanced rhythm. Focus on 2 core study blocks followed by 20 minutes of flashcards.',
    targetRatio: 0.9,
    badge: 'Balanced Rhythm'
  },
  {
    id: 'low_energy',
    label: 'Low energy',
    emoji: '😴',
    recommendation: "Let's keep tonight light. 30 min revision, 20 min flashcards, 10 min recall. You don't need to finish everything today.",
    targetRatio: 0.45,
    badge: 'Gentle Recovery'
  },
  {
    id: 'exam_pressure',
    label: 'Exam pressure',
    emoji: '😰',
    recommendation: 'Anxiety is normal. Break your session into 25-minute Pomodoro sprints and solve only high-probability past exam questions.',
    targetRatio: 0.8,
    badge: 'Focus Sprint'
  },
  {
    id: 'school_workload',
    label: 'School workload',
    emoji: '🏫',
    recommendation: 'Heavy school homework detected. Tutovia compressed your evening routine into one 45-minute concept consolidation session.',
    targetRatio: 0.5,
    badge: 'Homework Buffer'
  },
  {
    id: 'coaching_clash',
    label: 'Coaching clash',
    emoji: '📚',
    recommendation: 'Coaching classes ran late. Deep reading is safely shifted to weekend slots; tonight prioritize 30 minutes of quick revision.',
    targetRatio: 0.5,
    badge: 'Clash Protected'
  },
  {
    id: 'articleship_workload',
    label: 'Articleship workload',
    emoji: '💼',
    recommendation: 'Office audit calls ran past 8 PM. Zero guilt: your study streak is protected. Complete 35 minutes of light section recall before sleep.',
    targetRatio: 0.4,
    badge: 'Articleship Shield'
  },
  {
    id: 'limited_time',
    label: 'Only limited time',
    emoji: '⏳',
    recommendation: 'Only 60 minutes available? Run the Express Memory Drill: 15 flashcards, 2 formula sheets, and 1 high-weight case study.',
    targetRatio: 0.5,
    badge: 'Express Drill'
  }
];

/**
 * Default Stage Dynamic Schedules
 */
export const STAGE_SCHEDULE_TEMPLATES = {
  class_11: [
    { id: 'c11_s1', timeRange: '07:00 - 08:30 AM', time: '07:00 AM', activity: 'Accountancy: Golden Rules & Journalizing', focus: 'Accountancy', duration: '1h 30m', minutes: 90, type: 'Essential', done: true, status: 'Completed' },
    { id: 'c11_s2', timeRange: '04:30 - 05:45 PM', time: '04:30 PM', activity: 'Economics: Consumer Equilibrium & Utility Curves', focus: 'Economics', duration: '1h 15m', minutes: 75, type: 'Concept', done: true, status: 'Completed' },
    { id: 'c11_s3', timeRange: '06:15 - 07:30 PM', time: '06:15 PM', activity: 'Business Studies: Forms of Business Matrix', focus: 'Business Studies', duration: '1h 15m', minutes: 75, type: 'Theory', done: false, status: 'In Progress' },
    { id: 'c11_s4', timeRange: '08:30 - 09:30 PM', time: '08:30 PM', activity: 'Applied Maths: Time Value & Compound Interest', focus: 'Applied Maths', duration: '1h 00m', minutes: 60, type: 'Practice', done: false, status: 'Pending' },
    { id: 'c11_s5', timeRange: '09:45 - 10:15 PM', time: '09:45 PM', activity: 'Memory Review: BRS & Golden Rules Flashcards', focus: 'Revision', duration: '30m', minutes: 30, type: 'Review', done: false, status: 'Pending' }
  ],
  class_12: [
    { id: 'c12_s1', timeRange: '06:30 - 08:00 AM', time: '06:30 AM', activity: 'Accountancy: Partnership Admission & Goodwill Adjustment', focus: 'Accountancy', duration: '1h 30m', minutes: 90, type: 'Essential', done: true, status: 'Completed' },
    { id: 'c12_s2', timeRange: '04:30 - 06:00 PM', time: '04:30 PM', activity: 'Company Accounts: Issue of Shares & Pro-rata Forfeiture', focus: 'Accountancy', duration: '1h 30m', minutes: 90, type: 'Practice', done: true, status: 'Completed' },
    { id: 'c12_s3', timeRange: '06:30 - 07:45 PM', time: '06:30 PM', activity: 'Macroeconomics: National Income & Multiplier Drills', focus: 'Economics', duration: '1h 15m', minutes: 75, type: 'Concept', done: false, status: 'In Progress' },
    { id: 'c12_s4', timeRange: '08:30 - 09:30 PM', time: '08:30 PM', activity: 'Business Studies: Principles of Management Case Studies', focus: 'Business Studies', duration: '1h 00m', minutes: 60, type: 'Theory', done: false, status: 'Pending' },
    { id: 'c12_s5', timeRange: '09:45 - 10:30 PM', time: '09:45 PM', activity: 'Board Mock Review: CBSE 3-Mark Question Speed Run', focus: 'Board Prep', duration: '45m', minutes: 45, type: 'Review', done: false, status: 'Pending' }
  ],
  ca_foundation: [
    { id: 'caf_s1', timeRange: '06:30 - 08:30 AM', time: '06:30 AM', activity: 'Paper 1: Accounting — NPO & Bills of Exchange', focus: 'Accounting', duration: '2h 00m', minutes: 120, type: 'Essential', done: true, status: 'Completed' },
    { id: 'caf_s2', timeRange: '10:00 - 11:30 AM', time: '10:00 AM', activity: 'Paper 2: Business Laws — Contract Act Sec 10 & 2(g)', focus: 'Business Laws', duration: '1h 30m', minutes: 90, type: 'Essential', done: true, status: 'Completed' },
    { id: 'caf_s3', timeRange: '03:30 - 05:00 PM', time: '03:30 PM', activity: 'Paper 3: Quant Aptitude — Time Value of Money (35+ Marks)', focus: 'Quant Aptitude', duration: '1h 30m', minutes: 90, type: 'Practice', done: false, status: 'In Progress' },
    { id: 'caf_s4', timeRange: '06:30 - 08:00 PM', time: '06:30 PM', activity: 'Paper 4: Business Economics — Market Equilibrium Models', focus: 'Economics', duration: '1h 30m', minutes: 90, type: 'Concept', done: false, status: 'Pending' },
    { id: 'caf_s5', timeRange: '09:00 - 10:00 PM', time: '09:00 PM', activity: 'Daily Memory Review: 12 Due Spaced Repetition Cards', focus: 'Revision', duration: '1h 00m', minutes: 60, type: 'Review', done: false, status: 'Pending' }
  ],
  ca_inter_final: [
    { id: 'cai_s1', timeRange: '06:00 - 08:00 AM', time: '06:00 AM', activity: 'Advanced Accounting: AS 10 Component Accounting & AS 28', focus: 'Adv Accounting', duration: '2h 00m', minutes: 120, type: 'Essential', done: true, status: 'Completed' },
    { id: 'cai_s2', timeRange: '09:00 - 06:30 PM', time: '09:00 AM', activity: 'Practical Training: Articleship Statutory Audit Work', focus: 'Articleship', duration: '9h 30m', minutes: 570, type: 'Training', done: true, status: 'Completed' },
    { id: 'cai_s3', timeRange: '07:30 - 09:00 PM', time: '07:30 PM', activity: 'Direct Tax: Section 54 Capital Gains & Sec 16 ITC Criteria', focus: 'Direct Tax', duration: '1h 30m', minutes: 90, type: 'Essential', done: false, status: 'In Progress' },
    { id: 'cai_s4', timeRange: '09:15 - 10:30 PM', time: '09:15 PM', activity: 'Auditing: CARO 2020 Reporting Clauses (i) through (iv)', focus: 'Audit & Ethics', duration: '1h 15m', minutes: 75, type: 'Standards', done: false, status: 'Pending' },
    { id: 'cai_s5', timeRange: '10:30 - 11:00 PM', time: '10:30 PM', activity: 'Evening Wind-down: 10 Spaced Repetition Section Cards', focus: 'Revision', duration: '30m', minutes: 30, type: 'Review', done: false, status: 'Pending' }
  ]
};

/**
 * Weak Areas by Stage ("Needs Attention")
 */
export const STAGE_WEAK_AREAS = {
  class_11: [
    { id: 'wa11_1', topic: 'Bank Reconciliation Statement', subject: 'Accountancy', accuracy: 52, lastRevised: '5 days ago', priority: 'High', prompt: 'Passbook balance vs cash book cheque dishonour rules' },
    { id: 'wa11_2', topic: 'Depreciation (WDV Method)', subject: 'Accountancy', accuracy: 58, lastRevised: '4 days ago', priority: 'Medium', prompt: 'Written Down Value method asset sale computation' },
    { id: 'wa11_3', topic: 'Measures of Dispersion (SD)', subject: 'Economics', accuracy: 61, lastRevised: '7 days ago', priority: 'Medium', prompt: 'Standard Deviation formula and coefficient of variation' }
  ],
  class_12: [
    { id: 'wa12_1', topic: 'Partnership Dissolution (Realisation)', subject: 'Accountancy', accuracy: 54, lastRevised: '6 days ago', priority: 'High', prompt: 'Realisation account journal entries on firm dissolution' },
    { id: 'wa12_2', topic: 'Shares Forfeiture & Pro-Rata Reissue', subject: 'Accountancy', accuracy: 48, lastRevised: '3 days ago', priority: 'High', prompt: 'Pro-rata share forfeiture securities premium treatment' },
    { id: 'wa12_3', topic: 'Foreign Exchange Rate Determination', subject: 'Macroeconomics', accuracy: 62, lastRevised: '8 days ago', priority: 'Medium', prompt: 'Flexible vs managed floating exchange rate mechanisms' }
  ],
  ca_foundation: [
    { id: 'waf_1', topic: 'Bills of Exchange: Accommodation Bills', subject: 'Accounting', accuracy: 51, lastRevised: '4 days ago', priority: 'High', prompt: 'Accommodation bills discounting and insolvency apportionment' },
    { id: 'waf_2', topic: 'Contract Act: Quasi Contracts (Sec 68-72)', subject: 'Business Laws', accuracy: 57, lastRevised: '5 days ago', priority: 'Medium', prompt: 'Quasi contract obligations and finder of lost goods' },
    { id: 'waf_3', topic: 'Quantitative: Perpetuity & Amortization', subject: 'Quant Aptitude', accuracy: 53, lastRevised: '3 days ago', priority: 'High', prompt: 'Perpetuity formula and effective rate of interest' }
  ],
  ca_inter_final: [
    { id: 'wai_1', topic: 'CARO 2020 Clause (iii): Loans to Directors', subject: 'Auditing', accuracy: 46, lastRevised: '5 days ago', priority: 'High', prompt: 'CARO 2020 Clause (iii) reporting on investments and guarantees' },
    { id: 'wai_2', topic: 'AS 10: Component Depreciation & Replacement', subject: 'Adv Accounting', accuracy: 53, lastRevised: '4 days ago', priority: 'High', prompt: 'AS 10 component replacement accounting and derecognition' },
    { id: 'wai_3', topic: 'Section 54EC: Capital Gains 6-Month Window', subject: 'Direct Tax', accuracy: 55, lastRevised: '6 days ago', priority: 'High', prompt: 'Section 54EC REC/NHAI bonds 50 lakh limit and timeline' },
    { id: 'wai_4', topic: 'GST: Apportionment of ITC (Rules 42 & 43)', subject: 'GST', accuracy: 58, lastRevised: '7 days ago', priority: 'Medium', prompt: 'Rule 42 and 43 reversal of common input tax credit' }
  ]
};

/**
 * Practice Decks (Formula Sheets, Journal Entries, Sections, Standards)
 */
export const STAGE_PRACTICE_DECKS = {
  class_11: [
    { id: 'p11_1', title: 'Golden Rules & Modern Accounting Equation', category: 'Journal Entries', count: 18, icon: 'BookOpen' },
    { id: 'p11_2', title: 'Microeconomics Elasticity & Cost Curves', category: 'Formula Sheets', count: 14, icon: 'TrendingUp' },
    { id: 'p11_3', title: 'BRS Balance Adjustment Shortcuts', category: 'Practice', count: 12, icon: 'Brain' }
  ],
  class_12: [
    { id: 'p12_1', title: 'Partnership Revaluation & Sacrificing Ratio', category: 'Formula Sheets', count: 16, icon: 'TrendingUp' },
    { id: 'p12_2', title: 'Share Forfeiture & Capital Reserve Entries', category: 'Journal Entries', count: 22, icon: 'BookOpen' },
    { id: 'p12_3', title: 'Macroeconomics National Income Aggregates', category: 'Formula Sheets', count: 15, icon: 'Brain' }
  ],
  ca_foundation: [
    { id: 'pf_1', title: 'Time Value of Money (Annuity, Sinking Fund)', category: 'Formula Sheets', count: 24, icon: 'TrendingUp' },
    { id: 'pf_2', title: 'Indian Contract Act 1872 Key Sections', category: 'Legal Sections', count: 28, icon: 'BookOpen' },
    { id: 'pf_3', title: 'NPO Subscription & Consumption Ledger Cards', category: 'Journal Entries', count: 16, icon: 'Brain' }
  ],
  ca_inter_final: [
    { id: 'pi_1', title: 'CARO 2020 Clauses (i) through (xxi) Cheat Sheet', category: 'Audit Standards', count: 21, icon: 'BookOpen' },
    { id: 'pi_2', title: 'AS 10, AS 16, AS 28 Recognition & Measurement', category: 'Accounting Standards', count: 25, icon: 'Brain' },
    { id: 'pi_3', title: 'Direct Tax Section 54, 54EC, 54F Exemption Matrix', category: 'Legal Sections', count: 18, icon: 'TrendingUp' }
  ]
};

/**
 * Dynamic +90m Late-Day Rescheduling Logic
 * Protects daily streak, compresses optional tasks, shifts evening blocks cleanly
 */
export function rescheduleLateSchedule(currentSchedule) {
  if (!Array.isArray(currentSchedule) || currentSchedule.length === 0) return [];

  return currentSchedule.map((item, idx) => {
    // If already done, keep intact
    if (item.done) return item;

    // Shift times and streamline
    let newTimeRange = item.timeRange;
    if (item.timeRange.includes('06:') || item.timeRange.includes('07:')) {
      newTimeRange = '08:45 - 09:45 PM';
    } else if (item.timeRange.includes('08:') || item.timeRange.includes('09:')) {
      newTimeRange = '09:45 - 10:30 PM';
    } else if (item.timeRange.includes('10:') || item.timeRange.includes('09:45')) {
      newTimeRange = '10:30 - 11:00 PM';
    }

    return {
      ...item,
      timeRange: newTimeRange,
      status: idx === 0 ? 'In Progress' : 'Rescheduled (+90m)',
      rescheduled: true
    };
  });
}
