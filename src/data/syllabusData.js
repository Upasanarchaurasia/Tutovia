// src/data/syllabusData.js
// Official ICAI Syllabus data for all CA stages

export const CA_STAGES = [
  {
    id: 'foundation',
    label: 'CA Foundation',
    emoji: '🎓',
    description: 'First step of the CA journey. Covers basics of Accounting, Laws, Economics & Quantitative Aptitude.',
    color: 'emerald',
    schemes: ['New Scheme (2023)', 'Old Scheme'],
    defaultScheme: 'New Scheme (2023)',
    icaiPortal: 'https://www.icai.org/post/foundation-course-new-scheme'
  },
  {
    id: 'intermediate',
    label: 'CA Intermediate',
    emoji: '📘',
    description: 'Advanced stage with 6 papers across taxation, law, accounting, audit, costing & finance.',
    color: 'indigo',
    schemes: ['New Scheme (2023)', 'Old Scheme'],
    defaultScheme: 'New Scheme (2023)',
    icaiPortal: 'https://www.icai.org/post/intermediate-course-new-scheme'
  },
  {
    id: 'ittc',
    label: 'CA ITTC',
    emoji: '💻',
    description: 'IT Training & Orientation Course. Mandatory practical training module for CA aspirants.',
    color: 'cyan',
    schemes: ['IT Training', 'Orientation Course'],
    defaultScheme: 'IT Training',
    icaiPortal: 'https://www.icai.org/post/information-technology-training'
  },
  {
    id: 'final',
    label: 'CA Final',
    emoji: '🏆',
    description: 'The ultimate CA examination covering advanced financial reporting, taxation, audit & strategy.',
    color: 'amber',
    schemes: ['New Scheme (2023)', 'Old Scheme'],
    defaultScheme: 'New Scheme (2023)',
    icaiPortal: 'https://www.icai.org/post/final-course-new-scheme'
  }
];

export const SYLLABUS_BY_STAGE = {
  foundation: {
    groups: null, // Foundation has no Group 1/Group 2 split
    papers: [
      {
        id: 'f-paper1',
        code: 'Paper 1',
        title: 'Principles and Practice of Accounting',
        shortTitle: 'Accounting',
        color: 'emerald',
        marks: 100,
        officialPdfUrl: 'https://www.icai.org/post/paper-1-accounting-foundation-new',
        rtpUrl: 'https://www.icai.org/post/rtp-foundation-new',
        mtpUrl: 'https://www.icai.org/post/mtp-foundation-new',
        bosVideoUrl: 'https://www.icai.org/post/suggested-answers-foundation-new',
        chapters: [
          { no: 1, title: 'Theoretical Framework', marks: '10-15', topics: ['Meaning & Scope of Accounting', 'Accounting Concepts, Principles & Conventions', 'Accounting Standards'] },
          { no: 2, title: 'Accounting Process', marks: '15-20', topics: ['Books of Prime Entry', 'Ledgers', 'Trial Balance'] },
          { no: 3, title: 'Bank Reconciliation Statement', marks: '8-12', topics: ['Causes of Disagreement', 'Preparation of BRS'] },
          { no: 4, title: 'Inventories', marks: '8-12', topics: ['FIFO', 'Weighted Average', 'AS 2 Valuation of Inventories'] },
          { no: 5, title: 'Depreciation, Provisions & Reserves', marks: '8-12', topics: ['SLM', 'WDV', 'AS 6 Depreciation Accounting'] },
          { no: 6, title: 'Bills of Exchange and Promissory Notes', marks: '6-10', topics: ['Accommodation Bills', 'Dishonour of Bills'] },
          { no: 7, title: 'Sale of Goods on Approval or Return Basis', marks: '5-8', topics: ['Treatment in books'] },
          { no: 8, title: 'Final Accounts of Sole Proprietors', marks: '12-18', topics: ['Trading Account', 'Profit & Loss Account', 'Balance Sheet'] },
          { no: 9, title: 'Partnership Accounts', marks: '15-20', topics: ['Admission', 'Retirement', 'Death', 'Dissolution'] },
          { no: 10, title: 'Company Accounts', marks: '10-15', topics: ['Issue of Shares', 'Forfeiture', 'Re-issue', 'Debentures'] }
        ]
      },
      {
        id: 'f-paper2',
        code: 'Paper 2',
        title: 'Business Laws',
        shortTitle: 'Business Laws',
        color: 'blue',
        marks: 100,
        officialPdfUrl: 'https://www.icai.org/post/paper-2-business-laws-foundation-new',
        rtpUrl: 'https://www.icai.org/post/rtp-foundation-new',
        mtpUrl: 'https://www.icai.org/post/mtp-foundation-new',
        bosVideoUrl: 'https://www.icai.org/post/suggested-answers-foundation-new',
        chapters: [
          { no: 1, title: 'Indian Contract Act, 1872', marks: '25-30', topics: ['Offer & Acceptance', 'Consideration', 'Void & Voidable Contracts', 'Breach'] },
          { no: 2, title: 'Sale of Goods Act, 1930', marks: '15-20', topics: ['Contract of Sale', 'Conditions & Warranties', 'Transfer of Property', 'Rights of Unpaid Seller'] },
          { no: 3, title: 'Indian Partnership Act, 1932', marks: '15-20', topics: ['Nature of Partnership', 'Rights & Duties of Partners', 'Dissolution'] },
          { no: 4, title: 'Limited Liability Partnership Act, 2008', marks: '10-15', topics: ['Nature of LLP', 'Incorporation', 'Partners and their Relations'] },
          { no: 5, title: 'Companies Act, 2013 (Basics)', marks: '10-15', topics: ['Types of Companies', 'Memorandum of Association', 'Articles of Association', 'Prospectus'] }
        ]
      },
      {
        id: 'f-paper3',
        code: 'Paper 3',
        title: 'Quantitative Aptitude',
        shortTitle: 'Quantitative Aptitude',
        color: 'purple',
        marks: 100,
        officialPdfUrl: 'https://www.icai.org/post/paper-3-quantitative-aptitude-foundation-new',
        rtpUrl: 'https://www.icai.org/post/rtp-foundation-new',
        mtpUrl: 'https://www.icai.org/post/mtp-foundation-new',
        bosVideoUrl: 'https://www.icai.org/post/suggested-answers-foundation-new',
        chapters: [
          { no: 1, title: 'Ratio and Proportion', marks: '5-8', topics: ['Simple Ratios', 'Partnership Problems'] },
          { no: 2, title: 'Indices and Surds', marks: '5-8', topics: ['Laws of Indices', 'Surds'] },
          { no: 3, title: 'Logarithm', marks: '5-8', topics: ['Properties of Logarithms', 'Application'] },
          { no: 4, title: 'Equations', marks: '10-15', topics: ['Linear Equations', 'Quadratic Equations', 'Simultaneous Equations'] },
          { no: 5, title: 'Linear Inequalities', marks: '5-8', topics: ['Solution of Inequalities', 'Graphical Method'] },
          { no: 6, title: 'Time Value of Money', marks: '10-15', topics: ['Simple Interest', 'Compound Interest', 'Present Value', 'EMI Calculation'] },
          { no: 7, title: 'Permutations and Combinations', marks: '8-12', topics: ['Fundamental Principle of Counting', 'nPr', 'nCr'] },
          { no: 8, title: 'Sequence and Series', marks: '5-8', topics: ['AP', 'GP', 'Sum Formulas'] },
          { no: 9, title: 'Sets, Relations and Functions', marks: '5-8', topics: ['Types of Sets', 'Venn Diagrams', 'Functions'] },
          { no: 10, title: 'Basic Concepts of Differential & Integral Calculus', marks: '10-15', topics: ['Differentiation Rules', 'Integration Basics', 'Maxima & Minima'] },
          { no: 11, title: 'Statistics', marks: '10-15', topics: ['Measures of Central Tendency', 'Standard Deviation', 'Correlation'] },
          { no: 12, title: 'Probability', marks: '8-12', topics: ['Classical Probability', 'Addition Theorem', 'Conditional Probability', 'Baye\'s Theorem'] }
        ]
      },
      {
        id: 'f-paper4',
        code: 'Paper 4',
        title: 'Business Economics',
        shortTitle: 'Business Economics',
        color: 'rose',
        marks: 100,
        officialPdfUrl: 'https://www.icai.org/post/paper-4-business-economics-foundation-new',
        rtpUrl: 'https://www.icai.org/post/rtp-foundation-new',
        mtpUrl: 'https://www.icai.org/post/mtp-foundation-new',
        bosVideoUrl: 'https://www.icai.org/post/suggested-answers-foundation-new',
        chapters: [
          { no: 1, title: 'Introduction to Business Economics', marks: '5-8', topics: ['Nature & Scope of Economics', 'Micro vs Macro Economics'] },
          { no: 2, title: 'Theory of Demand and Supply', marks: '15-20', topics: ['Law of Demand', 'Elasticity of Demand', 'Law of Supply', 'Market Equilibrium'] },
          { no: 3, title: 'Theory of Production and Cost', marks: '12-18', topics: ['Law of Variable Proportions', 'Returns to Scale', 'Cost Concepts', 'Short Run vs Long Run Costs'] },
          { no: 4, title: 'Price Determination in Different Markets', marks: '12-18', topics: ['Perfect Competition', 'Monopoly', 'Monopolistic Competition', 'Oligopoly'] },
          { no: 5, title: 'Business Cycles', marks: '8-12', topics: ['Phases of Business Cycle', 'Theories of Business Cycles'] },
          { no: 6, title: 'Determination of National Income', marks: '10-15', topics: ['GDP', 'GNP', 'NNP', 'Circular Flow of Income'] },
          { no: 7, title: 'Public Finance', marks: '8-12', topics: ['Government Revenue', 'Government Expenditure', 'Budget', 'Fiscal Policy'] },
          { no: 8, title: 'Money Market', marks: '8-12', topics: ['Functions of Money', 'Money Supply', 'RBI Functions', 'Monetary Policy'] },
          { no: 9, title: 'International Trade', marks: '8-12', topics: ['Theories of International Trade', 'Balance of Payments', 'Foreign Exchange Rate'] }
        ]
      }
    ]
  },
  intermediate: {
    groups: ['Group 1', 'Group 2', 'Both Groups'],
    papers: [
      {
        id: 'i-paper1',
        code: 'Paper 1',
        title: 'Advanced Accounting',
        shortTitle: 'Advanced Accounting',
        group: 'Group 1',
        color: 'emerald',
        marks: 100,
        officialPdfUrl: 'https://www.icai.org/post/paper-1-advanced-accounting-new',
        rtpUrl: 'https://www.icai.org/post/rtp-intermediate-new',
        mtpUrl: 'https://www.icai.org/post/mtp-intermediate-new',
        bosVideoUrl: 'https://www.icai.org/post/suggested-answers-intermediate-new',
        chapters: [
          { no: 1, title: 'AS 1 to AS 7', marks: '10-15', topics: ['AS 1 Disclosure of Accounting Policies', 'AS 2 Inventories', 'AS 4 Contingencies', 'AS 5 Net Profit/Loss', 'AS 7 Construction Contracts'] },
          { no: 2, title: 'AS 9 to AS 15', marks: '10-15', topics: ['AS 9 Revenue Recognition', 'AS 10 PPE', 'AS 11 Foreign Exchange', 'AS 12 Government Grants', 'AS 13 Investments', 'AS 15 Employee Benefits'] },
          { no: 3, title: 'Company Final Accounts (Schedule III)', marks: '20-25', topics: ['Balance Sheet Format', 'P&L Format', 'Notes to Accounts', 'Cash Flow Statement'] },
          { no: 4, title: 'Buy Back of Securities', marks: '8-12', topics: ['Conditions for Buy-Back', 'Sources of Buy-Back', 'Accounting Entries'] },
          { no: 5, title: 'Amalgamation of Companies (AS 14)', marks: '12-18', topics: ['Types of Amalgamation', 'Pooling of Interest', 'Purchase Method', 'Goodwill Treatment'] },
          { no: 6, title: 'Internal Reconstruction', marks: '8-12', topics: ['Capital Reduction', 'Accounting Entries', 'Statement of Affairs'] },
          { no: 7, title: 'Partnership Accounts (Advanced)', marks: '10-15', topics: ['Admission of Partner', 'Retirement/Death', 'Conversion to Company'] },
          { no: 8, title: 'Banking Companies', marks: '8-12', topics: ['Final Accounts of Banks', 'Non-Performing Assets', 'Capital Adequacy'] }
        ]
      },
      {
        id: 'i-paper2',
        code: 'Paper 2',
        title: 'Corporate & Other Laws',
        shortTitle: 'Corporate & Other Laws',
        group: 'Group 1',
        color: 'blue',
        marks: 100,
        officialPdfUrl: 'https://www.icai.org/post/paper-2-corporate-and-other-laws-new',
        rtpUrl: 'https://www.icai.org/post/rtp-intermediate-new',
        mtpUrl: 'https://www.icai.org/post/mtp-intermediate-new',
        bosVideoUrl: 'https://www.icai.org/post/suggested-answers-intermediate-new',
        chapters: [
          { no: 1, title: 'Companies Act 2013 — Preliminary & Incorporation', marks: '8-12', topics: ['Types of Companies', 'Incorporation Process', 'Certificate of Incorporation', 'MOA & AOA'] },
          { no: 2, title: 'Prospectus & Allotment of Securities', marks: '8-12', topics: ['Types of Prospectus', 'DRHP', 'Misstatement in Prospectus'] },
          { no: 3, title: 'Share Capital & Debentures', marks: '10-15', topics: ['Types of Share Capital', 'Issue at Premium/Discount', 'Debentures', 'Charges'] },
          { no: 4, title: 'Acceptance of Deposits (Sec 73-76)', marks: '5-8', topics: ['Conditions for Deposits', 'Repayment', 'Penalties'] },
          { no: 5, title: 'Registration of Charges (Sec 77-87)', marks: '5-8', topics: ['Duty to Register', 'Modification', 'Satisfaction'] },
          { no: 6, title: 'Management & Administration', marks: '12-18', topics: ['Registers', 'Annual Return', 'Meetings', 'Voting'] },
          { no: 7, title: 'Corporate Social Responsibility (Sec 135)', marks: '5-8', topics: ['Applicability', 'CSR Committee', '2% Net Profit Rule', 'Activities'] },
          { no: 8, title: 'LLP Act 2008', marks: '8-12', topics: ['Nature of LLP', 'Incorporation', 'Partners & Designated Partners', 'Winding Up'] },
          { no: 9, title: 'General Clauses Act & Interpretation of Statutes', marks: '5-8', topics: ['General Definitions', 'Definitions in GCA', 'Rules of Interpretation'] }
        ]
      },
      {
        id: 'i-paper3',
        code: 'Paper 3',
        title: 'Taxation (Income Tax + GST)',
        shortTitle: 'Taxation',
        group: 'Group 1',
        color: 'rose',
        marks: 100,
        officialPdfUrl: 'https://www.icai.org/post/paper-3-taxation-new',
        rtpUrl: 'https://www.icai.org/post/rtp-intermediate-new',
        mtpUrl: 'https://www.icai.org/post/mtp-intermediate-new',
        bosVideoUrl: 'https://www.icai.org/post/suggested-answers-intermediate-new',
        chapters: [
          { no: 1, title: 'Basic Concepts of Income Tax', marks: '5-8', topics: ['Previous Year & Assessment Year', 'Residential Status', 'Scope of Total Income'] },
          { no: 2, title: 'Income from Salaries', marks: '15-20', topics: ['Allowances', 'Perquisites', 'Retirement Benefits', 'Standard Deduction'] },
          { no: 3, title: 'Income from House Property', marks: '8-12', topics: ['Annual Value Computation', 'Self-Occupied vs Let-Out', 'Interest on Loan'] },
          { no: 4, title: 'Profits & Gains of Business or Profession', marks: '15-20', topics: ['Expenses Allowable', 'Disallowances (Sec 40, 40A)', 'Depreciation (Sec 32)', 'Set-off of Losses'] },
          { no: 5, title: 'Capital Gains', marks: '10-15', topics: ['Types of Capital Assets', 'Short-Term vs Long-Term', 'Exemptions (Sec 54, 54F, 54EC)', 'Indexed Cost'] },
          { no: 6, title: 'Income from Other Sources', marks: '5-8', topics: ['Dividends', 'Interest', 'Winnings from Lottery', 'Family Pension'] },
          { no: 7, title: 'Deductions (Sec 80C to 80U)', marks: '8-12', topics: ['80C (₹1.5L limit)', '80D Health Insurance', '80G Donations', '80TTA Interest'] },
          { no: 8, title: 'GST — Basic Concepts & Levy', marks: '8-12', topics: ['CGST', 'SGST', 'IGST', 'Composite Supply vs Mixed Supply', 'Place of Supply'] },
          { no: 9, title: 'GST — Input Tax Credit (Sec 16-21)', marks: '10-15', topics: ['Eligibility Conditions', 'Blocked Credits (Sec 17(5))', 'Apportionment', 'Reversal of ITC'] },
          { no: 10, title: 'GST — Registration & Returns', marks: '8-12', topics: ['Compulsory Registration', 'Voluntary Registration', 'GSTR-1', 'GSTR-3B'] }
        ]
      },
      {
        id: 'i-paper4',
        code: 'Paper 4',
        title: 'Cost & Management Accounting',
        shortTitle: 'Cost Accounting',
        group: 'Group 2',
        color: 'purple',
        marks: 100,
        officialPdfUrl: 'https://www.icai.org/post/paper-4-cost-and-management-accounting-new',
        rtpUrl: 'https://www.icai.org/post/rtp-intermediate-new',
        mtpUrl: 'https://www.icai.org/post/mtp-intermediate-new',
        bosVideoUrl: 'https://www.icai.org/post/suggested-answers-intermediate-new',
        chapters: [
          { no: 1, title: 'Introduction to Cost Accounting', marks: '5-8', topics: ['Cost Concepts', 'Cost Centre', 'Cost Unit', 'Cost Sheet'] },
          { no: 2, title: 'Material Cost', marks: '10-15', topics: ['Purchase Procedure', 'EOQ', 'ABC Analysis', 'FIFO/LIFO', 'Material Losses'] },
          { no: 3, title: 'Labour Cost', marks: '10-15', topics: ['Time Keeping', 'Idle Time', 'Labour Turnover', 'Incentive Schemes'] },
          { no: 4, title: 'Overhead', marks: '12-18', topics: ['Classification', 'Absorption Methods', 'Under/Over Absorption', 'Machine Hour Rate'] },
          { no: 5, title: 'Activity Based Costing', marks: '5-8', topics: ['Cost Drivers', 'Cost Pools', 'ABC vs Traditional Costing'] },
          { no: 6, title: 'Cost Sheet & Job Costing', marks: '8-12', topics: ['Format of Cost Sheet', 'Job Costing', 'Batch Costing'] },
          { no: 7, title: 'Contract Costing', marks: '5-8', topics: ['WIP Treatment', 'Profit Recognition on Incomplete Contracts'] },
          { no: 8, title: 'Standard Costing', marks: '12-18', topics: ['Material Variance', 'Labour Variance', 'Overhead Variance', 'Sales Variance'] },
          { no: 9, title: 'Marginal Costing & CVP Analysis', marks: '10-15', topics: ['Contribution', 'P/V Ratio', 'Break-Even Point', 'Margin of Safety', 'Make or Buy'] },
          { no: 10, title: 'Budgetary Control', marks: '8-12', topics: ['Types of Budgets', 'Fixed vs Flexible Budget', 'Cash Budget', 'ZBB'] }
        ]
      },
      {
        id: 'i-paper5',
        code: 'Paper 5',
        title: 'Auditing & Ethics',
        shortTitle: 'Auditing',
        group: 'Group 2',
        color: 'amber',
        marks: 100,
        officialPdfUrl: 'https://www.icai.org/post/paper-5-auditing-and-ethics-new',
        rtpUrl: 'https://www.icai.org/post/rtp-intermediate-new',
        mtpUrl: 'https://www.icai.org/post/mtp-intermediate-new',
        bosVideoUrl: 'https://www.icai.org/post/suggested-answers-intermediate-new',
        chapters: [
          { no: 1, title: 'Audit Concepts & Principles (SA 200)', marks: '8-12', topics: ['Objectives of Audit', 'Types of Audit', 'SA 200 Overall Objectives', 'General Principles'] },
          { no: 2, title: 'Audit Planning (SA 300)', marks: '5-8', topics: ['Planning Memorandum', 'Audit Programme', 'Audit Strategy'] },
          { no: 3, title: 'Audit Documentation (SA 230)', marks: '5-8', topics: ['Working Papers', 'Contents', 'Ownership', 'Confidentiality'] },
          { no: 4, title: 'Audit Evidence (SA 500)', marks: '8-12', topics: ['Audit Procedures', 'Sufficiency & Appropriateness', 'Sources of Evidence'] },
          { no: 5, title: 'Materiality (SA 320)', marks: '5-8', topics: ['Concept of Materiality', 'Performance Materiality', 'Revision'] },
          { no: 6, title: 'Audit Risk (SA 315, SA 330)', marks: '8-12', topics: ['Inherent Risk', 'Control Risk', 'Detection Risk', 'Response to Risks'] },
          { no: 7, title: 'Company Audit (Sec 139-148)', marks: '15-20', topics: ['Appointment of Auditor', 'Rotation', 'Removal', 'Rights & Duties', 'Audit Report under Sec 143'] },
          { no: 8, title: 'Audit Report (SA 700, SA 705, SA 706)', marks: '8-12', topics: ['Unmodified Opinion', 'Modified Opinions', 'Emphasis of Matter', 'Other Matter'] },
          { no: 9, title: 'ICAI Code of Ethics', marks: '8-12', topics: ['Fundamental Principles', 'Threats & Safeguards', 'Independence', 'Confidentiality'] }
        ]
      },
      {
        id: 'i-paper6',
        code: 'Paper 6',
        title: 'Financial Management & Strategic Management',
        shortTitle: 'FM & SM',
        group: 'Group 2',
        color: 'indigo',
        marks: 100,
        officialPdfUrl: 'https://www.icai.org/post/paper-6-financial-management-and-strategic-management-new',
        rtpUrl: 'https://www.icai.org/post/rtp-intermediate-new',
        mtpUrl: 'https://www.icai.org/post/mtp-intermediate-new',
        bosVideoUrl: 'https://www.icai.org/post/suggested-answers-intermediate-new',
        chapters: [
          { no: 1, title: 'Financial Management Overview', marks: '5-8', topics: ['Goals of Financial Management', 'Agency Problem', 'Time Value of Money'] },
          { no: 2, title: 'Cost of Capital', marks: '12-18', topics: ['Cost of Equity (CAPM)', 'Cost of Debt', 'WACC', 'Marginal Cost of Capital'] },
          { no: 3, title: 'Capital Structure', marks: '8-12', topics: ['Theories of Capital Structure', 'MM Approach', 'Leverage', 'Optimal Capital Structure'] },
          { no: 4, title: 'Capital Budgeting', marks: '15-20', topics: ['NPV', 'IRR', 'Payback Period', 'ARR', 'Profitability Index', 'Risk in Capital Budgeting'] },
          { no: 5, title: 'Working Capital Management', marks: '8-12', topics: ['Operating Cycle', 'Cash Management', 'Inventory Management', 'Debtors Management', 'CCC'] },
          { no: 6, title: 'Dividend Policy', marks: '5-8', topics: ['Dividend Theories (MM, Gordon, Walter)', 'Bonus Shares', 'Buyback'] },
          { no: 7, title: 'Strategic Management — Introduction', marks: '5-8', topics: ['Mission & Vision', 'Strategic Intent', 'Strategic Planning Process'] },
          { no: 8, title: 'Strategic Analysis', marks: '8-12', topics: ['SWOT Analysis', 'PESTLE', 'Porter\'s Five Forces', 'BCG Matrix', 'Value Chain'] },
          { no: 9, title: 'Strategic Choices', marks: '8-12', topics: ['Stability Strategy', 'Expansion Strategy', 'Retrenchment', 'Combination'] },
          { no: 10, title: 'Business Level Strategies', marks: '5-8', topics: ['Cost Leadership', 'Differentiation', 'Focus Strategy', 'Blue Ocean Strategy'] }
        ]
      }
    ]
  },
  ittc: {
    groups: null,
    papers: [
      {
        id: 'it-module1',
        code: 'Module 1',
        title: 'Information Technology Training',
        shortTitle: 'IT Training',
        color: 'cyan',
        marks: null,
        officialPdfUrl: 'https://www.icai.org/post/information-technology-training',
        rtpUrl: 'https://www.icai.org/post/information-technology-training',
        mtpUrl: null,
        bosVideoUrl: 'https://www.icai.org/post/information-technology-training',
        chapters: [
          { no: 1, title: 'Computer Basics & Office Automation', marks: null, topics: ['MS Word', 'MS Excel', 'MS PowerPoint', 'Email Etiquette'] },
          { no: 2, title: 'Accounting Software (Tally & ERP)', marks: null, topics: ['Tally Prime', 'Voucher Entry', 'Financial Reports', 'GST in Tally'] },
          { no: 3, title: 'MIS Reports & Spreadsheet Analysis', marks: null, topics: ['Pivot Tables', 'VLOOKUP', 'Charts', 'Data Analysis'] },
          { no: 4, title: 'Cyber Security Basics', marks: null, topics: ['Threats', 'Password Management', 'Phishing', 'Data Protection'] },
          { no: 5, title: 'E-Filing & Online Compliance', marks: null, topics: ['Income Tax e-Filing', 'GST Portal', 'MCA Portal', 'Digital Signature'] }
        ]
      },
      {
        id: 'it-module2',
        code: 'Module 2',
        title: 'Orientation Course',
        shortTitle: 'Orientation',
        color: 'sky',
        marks: null,
        officialPdfUrl: 'https://www.icai.org/post/orientation-course',
        rtpUrl: 'https://www.icai.org/post/orientation-course',
        mtpUrl: null,
        bosVideoUrl: 'https://www.icai.org/post/orientation-course',
        chapters: [
          { no: 1, title: 'Communication Skills', marks: null, topics: ['Business Writing', 'Presentation Skills', 'Email Writing'] },
          { no: 2, title: 'Personality Development', marks: null, topics: ['Soft Skills', 'Time Management', 'Stress Management'] },
          { no: 3, title: 'Accountancy Profession Overview', marks: null, topics: ['CA Profession', 'Ethics Overview', 'Articleship Guidance'] },
          { no: 4, title: 'Business Environment & Entrepreneurship', marks: null, topics: ['Business Types', 'Startup Ecosystem', 'Innovation'] }
        ]
      }
    ]
  },
  final: {
    groups: ['Group 1', 'Group 2', 'Both Groups'],
    papers: [
      {
        id: 'fin-paper1',
        code: 'Paper 1',
        title: 'Financial Reporting',
        shortTitle: 'Financial Reporting',
        group: 'Group 1',
        color: 'emerald',
        marks: 100,
        officialPdfUrl: 'https://www.icai.org/post/paper-1-financial-reporting-final-new',
        rtpUrl: 'https://www.icai.org/post/rtp-final-new',
        mtpUrl: 'https://www.icai.org/post/mtp-final-new',
        bosVideoUrl: 'https://www.icai.org/post/suggested-answers-final-new',
        chapters: [
          { no: 1, title: 'Ind AS Framework & Conceptual Framework', marks: '8-12', topics: ['Qualitative Characteristics', 'Elements of Financial Statements', 'Recognition & Measurement'] },
          { no: 2, title: 'Ind AS 1 — Presentation of Financial Statements', marks: '8-12', topics: ['Complete Set of Financial Statements', 'Going Concern', 'Accrual Basis', 'Comparative Information'] },
          { no: 3, title: 'Ind AS 16 — Property, Plant & Equipment', marks: '10-15', topics: ['Recognition', 'Measurement After Recognition', 'Revaluation Model', 'Derecognition'] },
          { no: 4, title: 'Ind AS 109 — Financial Instruments', marks: '12-18', topics: ['Classification', 'FVTPL vs FVOCI vs Amortized Cost', 'Hedge Accounting', 'Impairment (ECL)'] },
          { no: 5, title: 'Ind AS 115 — Revenue from Contracts with Customers', marks: '10-15', topics: ['5-Step Model', 'Performance Obligations', 'Variable Consideration', 'Contract Modifications'] },
          { no: 6, title: 'Ind AS 116 — Leases', marks: '8-12', topics: ['Right-of-Use Asset', 'Lease Liability', 'Short-Term & Low Value Exemptions', 'Sale and Leaseback'] },
          { no: 7, title: 'Consolidated Financial Statements (Ind AS 110)', marks: '15-20', topics: ['Control Concept', 'Consolidation Procedures', 'Non-Controlling Interest', 'Goodwill Impairment'] },
          { no: 8, title: 'Business Combinations (Ind AS 103)', marks: '8-12', topics: ['Purchase Price Allocation', 'Goodwill Measurement', 'Bargain Purchase'] }
        ]
      },
      {
        id: 'fin-paper2',
        code: 'Paper 2',
        title: 'Advanced Financial Management',
        shortTitle: 'AFM',
        group: 'Group 1',
        color: 'indigo',
        marks: 100,
        officialPdfUrl: 'https://www.icai.org/post/paper-2-advanced-financial-management-final-new',
        rtpUrl: 'https://www.icai.org/post/rtp-final-new',
        mtpUrl: 'https://www.icai.org/post/mtp-final-new',
        bosVideoUrl: 'https://www.icai.org/post/suggested-answers-final-new',
        chapters: [
          { no: 1, title: 'Financial Policy & Corporate Strategy', marks: '8-12', topics: ['Strategic Financial Management', 'Value Creation', 'Corporate Financial Modelling'] },
          { no: 2, title: 'Risk Management', marks: '12-18', topics: ['Types of Financial Risks', 'Value at Risk', 'Currency Risk', 'Interest Rate Risk', 'Derivatives'] },
          { no: 3, title: 'Security Analysis (Equity Valuation)', marks: '10-15', topics: ['Dividend Discount Model', 'P/E Model', 'EV/EBITDA', 'Discounted Free Cash Flow'] },
          { no: 4, title: 'Portfolio Theory & Capital Market', marks: '10-15', topics: ['Markowitz Portfolio Theory', 'CAPM', 'Beta', 'Efficient Frontier', 'Sharpe Ratio'] },
          { no: 5, title: 'Derivatives — Forwards, Futures & Options', marks: '12-18', topics: ['Forward Contracts', 'Futures Pricing', 'Options (Call/Put)', 'Black-Scholes Model', 'Greeks'] },
          { no: 6, title: 'Mergers & Acquisitions', marks: '10-15', topics: ['Types of M&A', 'Valuation in M&A', 'Exchange Ratio', 'LBO', 'Due Diligence'] },
          { no: 7, title: 'Startup Finance & PE/VC', marks: '5-8', topics: ['Venture Capital', 'Angel Investors', 'Startup Valuation Techniques', 'Term Sheet'] }
        ]
      },
      {
        id: 'fin-paper3',
        code: 'Paper 3',
        title: 'Advanced Auditing, Assurance & Professional Ethics',
        shortTitle: 'Advanced Audit',
        group: 'Group 1',
        color: 'amber',
        marks: 100,
        officialPdfUrl: 'https://www.icai.org/post/paper-3-advanced-auditing-assurance-and-professional-ethics-final-new',
        rtpUrl: 'https://www.icai.org/post/rtp-final-new',
        mtpUrl: 'https://www.icai.org/post/mtp-final-new',
        bosVideoUrl: 'https://www.icai.org/post/suggested-answers-final-new',
        chapters: [
          { no: 1, title: 'Quality Control (SA 220, SQC 1)', marks: '8-12', topics: ['Quality Control at Engagement Level', 'Firm-Level QC', 'ISQC 1'] },
          { no: 2, title: 'Audit of Banks & Financial Institutions', marks: '12-18', topics: ['Prudential Norms', 'NPA Classification', 'LFAR', 'Long Form Audit Report'] },
          { no: 3, title: 'Audit of Public Sector Undertakings', marks: '8-12', topics: ['CAG Audit', 'Compliance Audit', 'Performance Audit'] },
          { no: 4, title: 'Reporting under CARO 2020', marks: '8-12', topics: ['CARO 2020 Requirements', 'Reporting on Internal Financial Controls'] },
          { no: 5, title: 'Forensic Audit & Investigation', marks: '5-8', topics: ['Types of Fraud', 'Evidence Collection', 'Forensic Techniques'] },
          { no: 6, title: 'Professional Ethics & Code of Ethics 2020', marks: '10-15', topics: ['Threats to Independence', 'Safeguards', 'Non-Assurance Services', 'Intimidation Threat'] },
          { no: 7, title: 'Peer Review & Quality Review', marks: '5-8', topics: ['Peer Review Programme', 'Quality Review Board'] }
        ]
      },
      {
        id: 'fin-paper4',
        code: 'Paper 4',
        title: 'Direct Tax Laws & International Taxation',
        shortTitle: 'Direct Tax',
        group: 'Group 2',
        color: 'rose',
        marks: 100,
        officialPdfUrl: 'https://www.icai.org/post/paper-4-direct-tax-laws-and-international-taxation-final-new',
        rtpUrl: 'https://www.icai.org/post/rtp-final-new',
        mtpUrl: 'https://www.icai.org/post/mtp-final-new',
        bosVideoUrl: 'https://www.icai.org/post/suggested-answers-final-new',
        chapters: [
          { no: 1, title: 'Tax Planning, Tax Avoidance & Tax Evasion', marks: '5-8', topics: ['Concepts & Differences', 'GAAR Provisions', 'Legitimate Tax Planning'] },
          { no: 2, title: 'Profits & Gains of Business/Profession (Advanced)', marks: '15-20', topics: ['Deductions under Sec 30-37', 'Scientific Research', 'Depreciation Block of Assets'] },
          { no: 3, title: 'Capital Gains (Advanced)', marks: '10-15', topics: ['Slump Sale (Sec 50B)', 'Conversion of Stock in Trade', 'Reference to Valuation Officer'] },
          { no: 4, title: 'MAT (Sec 115JB) & AMT (Sec 115JC)', marks: '8-12', topics: ['Book Profits Computation', 'MAT Credit', 'AMT Applicability'] },
          { no: 5, title: 'Transfer Pricing (Sec 92)', marks: '12-18', topics: ['International Transactions', 'Arm\'s Length Price Methods', 'APA'] },
          { no: 6, title: 'Double Taxation Avoidance Agreements (DTAA)', marks: '10-15', topics: ['Residence vs Source Taxation', 'OECD Model', 'UN Model', 'MFN Clause'] },
          { no: 7, title: 'Assessment & Appeal Procedures', marks: '8-12', topics: ['Types of Assessment', 'CIT(A)', 'ITAT', 'High Court & Supreme Court'] }
        ]
      },
      {
        id: 'fin-paper5',
        code: 'Paper 5',
        title: 'Indirect Tax Laws (GST + Customs)',
        shortTitle: 'Indirect Tax',
        group: 'Group 2',
        color: 'purple',
        marks: 100,
        officialPdfUrl: 'https://www.icai.org/post/paper-5-indirect-tax-laws-final-new',
        rtpUrl: 'https://www.icai.org/post/rtp-final-new',
        mtpUrl: 'https://www.icai.org/post/mtp-final-new',
        bosVideoUrl: 'https://www.icai.org/post/suggested-answers-final-new',
        chapters: [
          { no: 1, title: 'GST — Overview & Constitutional Framework', marks: '5-8', topics: ['Dual GST Structure', 'GST Council', 'Constitutional Amendments'] },
          { no: 2, title: 'GST — Supply, Levy & Exemptions', marks: '12-18', topics: ['Composite vs Mixed Supply', 'Reverse Charge Mechanism', 'Exempted Supplies', 'Nil-rated Goods'] },
          { no: 3, title: 'GST — Valuation & Time of Supply', marks: '8-12', topics: ['Transaction Value', 'Related Party Transactions', 'Time of Supply Rules'] },
          { no: 4, title: 'GST — ITC (Advanced)', marks: '10-15', topics: ['Conditions for ITC (Sec 16)', 'Blocked Credits (Sec 17(5))', 'Annual Reconciliation', 'ITC Reversal'] },
          { no: 5, title: 'GST — Assessment, Audit & Penalties', marks: '8-12', topics: ['Self Assessment', 'Scrutiny', 'Demand & Recovery', 'Offences & Penalties'] },
          { no: 6, title: 'Customs Act 1962', marks: '15-20', topics: ['Types of Customs Duty', 'Customs Valuation', 'Import/Export Procedures', 'Special Economic Zones', 'Anti-Dumping Duty'] }
        ]
      },
      {
        id: 'fin-paper6',
        code: 'Paper 6',
        title: 'Integrated Business Solutions (IBS)',
        shortTitle: 'IBS / Case Study',
        group: 'Group 2',
        color: 'blue',
        marks: 100,
        officialPdfUrl: 'https://www.icai.org/post/paper-6-integrated-business-solutions-final-new',
        rtpUrl: 'https://www.icai.org/post/rtp-final-new',
        mtpUrl: 'https://www.icai.org/post/mtp-final-new',
        bosVideoUrl: 'https://www.icai.org/post/suggested-answers-final-new',
        chapters: [
          { no: 1, title: 'Integration of FR, AFM, Audit, Tax', marks: null, topics: ['Case Study Approach', 'Multi-Disciplinary Application', 'Business Scenario Analysis'] },
          { no: 2, title: 'Business Reporting & Communication', marks: null, topics: ['Management Reports', 'Board Presentations', 'Communication of Complex Financial Data'] },
          { no: 3, title: 'Professional Skepticism & Judgment', marks: null, topics: ['Ethical Dilemmas', 'Skepticism in Audit & Tax Planning', 'Real World Application'] }
        ]
      }
    ]
  }
};

// Helper: get papers by stage and group
export function getPapersForStage(stageId, caGroup = null) {
  const stageData = SYLLABUS_BY_STAGE[stageId];
  if (!stageData) return [];
  const papers = stageData.papers || [];
  if (!caGroup || caGroup === 'Both Groups' || stageData.groups === null) return papers;
  return papers.filter(p => !p.group || p.group === caGroup);
}

// Helper: get subject IDs mapped from stage for server API compatibility
export function getSubjectIdsForStage(stageId) {
  const maps = {
    foundation: ['f-paper1', 'f-paper2', 'f-paper3', 'f-paper4'],
    intermediate: ['i-paper1', 'i-paper2', 'i-paper3', 'i-paper4', 'i-paper5', 'i-paper6'],
    ittc: ['it-module1', 'it-module2'],
    final: ['fin-paper1', 'fin-paper2', 'fin-paper3', 'fin-paper4', 'fin-paper5', 'fin-paper6']
  };
  return maps[stageId] || maps.intermediate;
}

export default SYLLABUS_BY_STAGE;
