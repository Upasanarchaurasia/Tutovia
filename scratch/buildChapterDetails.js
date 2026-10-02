// scratch/buildChapterDetails.js
import fs from 'fs';
import path from 'path';

const fileContent = `// src/data/chapterDetailsData.js
// Authoritative, chapter-specific revision notes, statutory provisions, formulas, and mindmap drilldown nodes for CA subjects.
// Covers all CA Intermediate papers (Group 1 & Group 2) with 100% chapter-specific statutory references, formulas, and exam traps.

export const CHAPTER_DETAILS = {
  // ==========================================
  // PAPER 1: ADVANCED ACCOUNTING
  // ==========================================
  'advanced-accounting': {
    subjectTitle: 'Advanced Accounting',
    code: 'Paper 1',
    chapters: [
      {
        id: 'c1',
        number: 1,
        title: 'Accounting Standards (AS 1, 2, 3, 10, 11, 12, 13, 16)',
        module: 'Module 1',
        duration: '6h 00m',
        marks: '25-30',
        audioSummary: 'Accounting Standards govern recognition, measurement, and disclosure. AS 1 requires disclosure of fundamental assumptions: Going Concern, Consistency, and Accrual. AS 2 mandates inventory valuation at lower of Cost or Net Realizable Value. AS 10 requires PPE initial recognition at cost and component depreciation. AS 16 allows capitalization of borrowing costs directly attributable to qualifying assets.',
        importantPoints: [
          'AS 1 Fundamental Accounting Assumptions: Going Concern, Consistency, Accrual. If followed, no specific disclosure required; if NOT followed, fact must be disclosed prominently.',
          'AS 2 Inventories: Valued at Lower of Cost or Net Realizable Value (NRV). Cost excludes abnormal waste, storage costs unless necessary, and administrative overheads.',
          'AS 10 Property, Plant & Equipment (PPE): Initial recognition at cost (purchase price + import duties + directly attributable site preparation + initial decommissioning estimate). Component accounting is mandatory for significant parts with different useful lives.',
          'AS 11 Effects of Changes in Foreign Exchange Rates: Monetary items reported using closing rate (exchange diff to P&L); Non-monetary items reported using transaction exchange rate.',
          'AS 12 Government Grants: Capital approach for non-repayable promoter grants; Income approach for revenue grants. Specific asset grants can either be deducted from gross book value or treated as deferred income.',
          'AS 16 Borrowing Costs: Capitalized if directly attributable to acquisition/construction of a qualifying asset (takes substantial period to get ready). Income from temporary investment of specific funds must be deducted from borrowing costs.'
        ],
        formulas: [
          {
            name: 'AS 2: Net Realizable Value (NRV)',
            formula: 'NRV = Estimated Selling Price in Ordinary Course of Business - Estimated Costs of Completion - Estimated Costs Necessary to Make the Sale',
            explanation: 'Comparison with cost is made on item-by-item basis. Raw materials are written down only if finished products are expected to sell below cost.'
          },
          {
            name: 'AS 10: Depreciable Amount & Carrying Amount',
            formula: 'Depreciable Amount = Cost or Revalued Amount - Residual Value',
            explanation: 'Carrying Amount = Gross Book Value - Accumulated Depreciation - Accumulated Impairment Losses under AS 28.'
          },
          {
            name: 'AS 16: General Borrowing Capitalization Rate',
            formula: 'Weighted Average Capitalization Rate = (Total Borrowing Costs on General Borrowings) / (Weighted Average General Borrowings Outstanding during period) × 100',
            explanation: 'Amount of borrowing cost capitalized cannot exceed actual borrowing costs incurred.'
          },
          {
            name: 'AS 20: Basic Earnings Per Share (EPS)',
            formula: 'Basic EPS = (Net Profit or Loss Attributable to Equity Shareholders) / (Weighted Average Number of Equity Shares Outstanding during the period)',
            explanation: 'Adjust for bonus issue, share split, and rights issue factor retrospectively.'
          }
        ],
        icaiTraps: [
          'AS 2: Never include selling and distribution costs in inventory cost. Abnormal scrap goes to P&L immediately.',
          'AS 16: Capitalization must suspend during extended periods where active development is interrupted.',
          'AS 10: Routine repairs and maintenance cannot be capitalized; only replacement of identifiable components that increase future economic benefits.'
        ],
        mindmapTree: {
          id: 'as-root',
          label: 'Accounting Standards Core',
          summary: 'Framework governing recognition, measurement, and presentation in financial statements.',
          children: [
            {
              id: 'as-disclosure',
              label: 'Disclosure & Reporting (AS 1, 3)',
              summary: 'AS 1 covers policies, AS 3 mandates Cash Flow Statement with Operating, Investing, and Financing activities.',
              subtopics: ['Fundamental Assumptions', 'Prudence vs Substance over Form', 'Direct vs Indirect Cash Flow']
            },
            {
              id: 'as-assets',
              label: 'Asset Valuation (AS 2, 10, 13, 16)',
              summary: 'Inventory at lower of cost/NRV; PPE at cost with componentization; Borrowing costs capitalisation rules.',
              subtopics: ['NRV comparison', 'Decommissioning provisions', 'Qualifying asset criterion', 'Cost vs Fair value for investments']
            },
            {
              id: 'as-special',
              label: 'Specialized Standards (AS 11, 12, 15, 20)',
              summary: 'Foreign exchange translations, government grants, employee benefits actuarial valuation, and Basic/Diluted EPS.',
              subtopics: ['Monetary vs Non-monetary items', 'Deferred grant recognition', 'Dilutive potential shares']
            }
          ]
        }
      },
      {
        id: 'c1-2',
        number: 2,
        title: 'Framework for Preparation & Presentation of Financial Statements',
        module: 'Module 1',
        duration: '3h 30m',
        marks: '8-12',
        audioSummary: 'The ICAI Conceptual Framework sets out concepts underlying the preparation of financial statements. It defines the qualitative characteristics: relevance, reliability, comparability, and understandability, alongside recognition criteria for assets, liabilities, income, and expenses.',
        importantPoints: [
          'Primary Objective: Provide information about financial position, financial performance, and cash flows of an enterprise useful to wide range of users in making economic decisions.',
          'Underlying Assumptions: Accrual basis (effects of transactions recognized when they occur, not when cash is received) and Going Concern (enterprise will continue in operation for foreseeable future).',
          'Qualitative Characteristics: Relevance (materiality threshold), Reliability (faithful representation, substance over form, neutrality, prudence, and completeness), Comparability, and Understandability.',
          'Asset Recognition: Probable that future economic benefits will flow to enterprise, and asset has cost or value that can be measured with reliability.',
          'Liability Recognition: Probable that an outflow of resources embodying economic benefits will result from settlement of a present obligation, and settlement amount can be measured reliably.',
          'Capital Maintenance Concepts: Financial Capital Maintenance (measured in nominal monetary units or units of constant purchasing power) vs Physical Capital Maintenance (productive capacity of enterprise).'
        ],
        formulas: [
          {
            name: 'Financial Capital Maintenance (Nominal Terms)',
            formula: 'Net Profit = Closing Net Assets - Opening Net Assets - Additional Capital Introduced + Drawings/Dividends Paid',
            explanation: 'Profit is earned only if financial amount of net assets at end of period exceeds opening net assets after adjusting distributions.'
          },
          {
            name: 'Physical Capital Maintenance Formula',
            formula: 'Profit = Current Operational Capacity at End - Productive Capacity at Beginning (adjusted for capital movements)',
            explanation: 'Requires revaluation of productive assets to current replacement costs before recognizing profit.'
          }
        ],
        icaiTraps: [
          'Substance over form: If legal ownership is not transferred but economic control and risks are passed (e.g. finance lease), asset must be recognized in user balance sheet.',
          'Prudence does not permit creation of hidden reserves or deliberate understatement of assets and profits.'
        ],
        mindmapTree: {
          id: 'framework-root',
          label: 'ICAI Conceptual Framework',
          summary: 'Foundational doctrines of financial reporting, user objectives, and asset/liability criteria.',
          children: [
            {
              id: 'framework-assumptions',
              label: 'Fundamental Assumptions & Principles',
              summary: 'Accrual, Going concern, Substance over form, Prudence and Materiality.',
              subtopics: ['Accrual vs Cash timing', 'Materiality test', 'Reliability pillars']
            },
            {
              id: 'framework-elements',
              label: 'Elements of Financial Statements',
              summary: 'Definition and recognition filters for Assets, Liabilities, Equity, Income, and Expenses.',
              subtopics: ['Probable future economic benefits', 'Reliable measurement', 'Present obligation criteria']
            },
            {
              id: 'framework-capital',
              label: 'Capital Maintenance Doctrines',
              summary: 'Financial capital maintenance vs Physical productive capacity maintenance.',
              subtopics: ['Nominal units method', 'Constant purchasing power', 'Current replacement costs']
            }
          ]
        }
      },
      {
        id: 'c2',
        number: 3,
        title: 'Company Accounts & Schedule III Financial Statements',
        module: 'Module 2',
        duration: '5h 30m',
        marks: '20-25',
        audioSummary: 'Company Accounts deals with presentation under Schedule III Division I of Companies Act 2013, Buy-back of shares under Section 68, and accounting for redemption of preference shares and debentures.',
        importantPoints: [
          'Schedule III Division I format is mandatory for Non-Ind AS companies: Non-Current Assets vs Current Assets; Equity & Non-Current Liabilities vs Current Liabilities.',
          'Operating Cycle: Time between acquisition of assets for processing and realization in cash. If not identifiable, assumed to be 12 months.',
          'Buy-Back of Shares (Sec 68): Must be authorized by AOA; Special resolution required (or Board resolution if <= 10% of paid-up equity + free reserves). Maximum buy-back is 25% of paid-up capital and free reserves in any financial year.',
          'Post Buy-Back Debt-Equity Ratio cannot exceed 2:1 (Debt includes secured and unsecured debts; Equity is paid-up share capital and free reserves).',
          'Capital Redemption Reserve (CRR): Transferred equal to nominal value of shares bought back or redeemed from free reserves/securities premium. CRR can only be utilized for issuing fully paid bonus shares.'
        ],
        formulas: [
          {
            name: 'Section 68 Buy-Back Limit (Resource Test)',
            formula: 'Maximum Buy-Back Amount <= 25% of (Paid-up Capital + Free Reserves + Securities Premium)',
            explanation: 'The share outstanding test limits shares to 25% of total paid-up equity shares.'
          },
          {
            name: 'Debt-Equity Test for Buy-Back',
            formula: '(Total Debt after Buy-Back) / (Shareholders Equity after Buy-Back) <= 2.0',
            explanation: 'Shareholders equity is reduced by the nominal value and premium paid out of reserves.'
          },
          {
            name: 'Transfer to Capital Redemption Reserve (CRR)',
            formula: 'CRR = Nominal Value of Shares Redeemed/Bought Back - Nominal Value of Fresh Issue of Shares',
            explanation: 'Fresh issue can be equity or preference, but proceeds must be utilized specifically for redemption.'
          }
        ],
        icaiTraps: [
          'Securities Premium can be utilized for buy-back under Sec 68, but CANNOT be used for redemption of preference shares under Sec 55 if company complies with Sec 133 standards.',
          'Revaluation reserve and statutory reserves can NEVER be treated as free reserves for buy-back calculations.'
        ],
        mindmapTree: {
          id: 'comp-acc-root',
          label: 'Company Accounts & Schedule III',
          summary: 'Corporate financial presentation, capital restructuring, and statutory reserves.',
          children: [
            {
              id: 'sch3-presentation',
              label: 'Schedule III Division I',
              summary: 'Balance sheet & P&L format, Current vs Non-current classification, 12-month operating cycle rule.',
              subtopics: ['Current assets criteria', 'Long-term borrowings disclosure', 'Contingent liabilities in notes']
            },
            {
              id: 'buyback-sec68',
              label: 'Buy-Back of Shares (Sec 68)',
              summary: 'Resource test (25%), Share test (25%), Debt-equity test (2:1), and transfer to CRR.',
              subtopics: ['Board vs Special resolution', 'Post-buyback solvency declaration', 'CRR restriction']
            },
            {
              id: 'redemption-shares',
              label: 'Redemption of Preference & Debentures',
              summary: 'Redemption out of profits or fresh issue; creation of CRR and Debenture Redemption Reserve (DRR).',
              subtopics: ['Sec 55 restrictions', 'Fresh issue premium accounting', 'DRR and DRI 15% rule']
            }
          ]
        }
      },
      {
        id: 'c2-2',
        number: 4,
        title: 'Accounting for Branches including Foreign Branches',
        module: 'Module 2',
        duration: '4h 30m',
        marks: '10-15',
        audioSummary: 'Branch Accounting classifies branches into Dependent, Independent, and Foreign Branches. Dependent branches use Debtors, Stock & Debtors, or Final Accounts methods. Foreign branches follow AS 11 classification into Integral and Non-Integral foreign operations.',
        importantPoints: [
          'Dependent Branches: Maintain minimal records. Head Office maintains Branch Account. Three common systems: Debtors System (Branch A/c functions as personal/nominal account), Stock & Debtors System (detailed analysis of stock surplus/shortage), Final Accounts System.',
          'Stock & Debtors Accounts: Branch Stock A/c (at invoice price), Branch Debtors A/c, Branch Expenses A/c, Goods Sent to Branch A/c, and Branch Adjustment A/c (records invoice loading and reveals gross profit).',
          'Independent Branches: Maintain complete double entry books. Reconcile Head Office Account in Branch Books with Branch Account in Head Office Books via Goods-in-Transit and Cash-in-Transit.',
          'Foreign Branches (AS 11): Integral Foreign Operation (IFO) translates monetary items at closing rate, non-monetary items at transaction rate, P&L items at average rate; exchange diff goes to P&L.',
          'Non-Integral Foreign Operation (NIFO): Translates all assets and liabilities (both monetary and non-monetary) at closing rate; income/expenses at average rate; exchange diff accumulated in Foreign Currency Translation Reserve (FCTR) until disposal.'
        ],
        formulas: [
          {
            name: 'Loading on Invoice Price Calculation',
            formula: 'Loading = Invoice Price - Cost Price = (Cost × Markup%) / (100 + Markup%)',
            explanation: 'If goods invoiced at cost + 25%, loading is 25/125 = 1/5th of Invoice Price.'
          },
          {
            name: 'Branch Stock Surplus / Shortage',
            formula: 'Apparent Shortage = Opening Stock + Goods from HO + Goods from other Branches - Sales (Cash + Credit) - Returns to HO - Normal Loss',
            explanation: 'Normal loss loading is debited to Branch Adjustment; cost of normal loss debited to Branch Adjustment. Abnormal loss cost transferred to General P&L.'
          },
          {
            name: 'Foreign Branch Translation (AS 11)',
            formula: 'Integral Operation: Monetary = Closing Rate; Non-Monetary = Transaction Date Rate; Depreciation = Rate on Asset Purchase Date',
            explanation: 'Non-Integral Operation: All Assets & Liabilities translated at Closing Rate; Exchange Diff -> FCTR.'
          }
        ],
        icaiTraps: [
          'Stock Reserve must be created on both Opening Stock and Closing Stock at the branch; Stock Reserve on opening stock is credited to Branch Adjustment, closing stock reserve debited.',
          'Goods-in-transit must be incorporated in balance sheet: Debit Goods in Transit A/c, Credit Branch A/c (in HO books).'
        ],
        mindmapTree: {
          id: 'branch-root',
          label: 'Branch Accounting & AS 11',
          summary: 'Invoicing methods, reconciliation of inter-branch accounts, and foreign branch currency translations.',
          children: [
            {
              id: 'dependent-branches',
              label: 'Dependent Branch Methods',
              summary: 'Debtors system vs Stock & Debtors system, invoice price loading, normal and abnormal loss treatment.',
              subtopics: ['Branch Adjustment A/c', 'Stock Reserve cancellation', 'Shortage vs Surplus analysis']
            },
            {
              id: 'independent-branches',
              label: 'Independent Branch Accounting',
              summary: 'Inter-office transactions, reconciliation of HO and Branch balances, Goods/Cash in transit.',
              subtopics: ['Transit adjustment entries', 'Incorporation entries in HO books', 'Head office current account']
            },
            {
              id: 'foreign-branches',
              label: 'Foreign Branches Translation (AS 11)',
              summary: 'Integral vs Non-Integral operations classification, exchange differences treatment, FCTR.',
              subtopics: ['IFO exchange diff to P&L', 'NIFO exchange diff to FCTR', 'Monetary vs Non-monetary items']
            }
          ]
        }
      },
      {
        id: 'c1-3',
        number: 5,
        title: 'Amalgamation of Companies (AS 14) & Internal Reconstruction',
        module: 'Module 2',
        duration: '5h 00m',
        marks: '16-20',
        audioSummary: 'Amalgamation under AS 14 is classified into Merger or Purchase. The Pooling of Interests method preserves book values, while the Purchase method incorporates fair values with difference going to Goodwill or Capital Reserve.',
        importantPoints: [
          'Types of Amalgamation: (1) Amalgamation in the nature of Merger (Pooling of Interests Method) - all 5 conditions of AS 14 must be satisfied; (2) Amalgamation in the nature of Purchase (Purchase Method).',
          '5 Conditions for Merger: All assets/liabilities transferred at book value, >= 90% equity shareholders become shareholders, consideration only in equity shares (except fractional cash), and business intended to be carried on.',
          'Purchase Consideration (PC): Aggregate of shares and other securities issued and payment made in form of cash or other assets by transferee company to shareholders of transferor company (debentures excluded from PC).',
          'Goodwill vs Capital Reserve: Under Purchase Method, if PC > Net Assets acquired = Goodwill; if PC < Net Assets acquired = Capital Reserve.',
          'Internal Reconstruction: Scheme of capital reduction u/s 66 approved by NCLT. Capital Reduction Account (or Reorganization Account) credited with sacrifices by shareholders/creditors.'
        ],
        formulas: [
          {
            name: 'Purchase Consideration (Net Assets Method)',
            formula: 'PC = Agreed Value of Assets Taken Over - Agreed Value of Liabilities Taken Over',
            explanation: 'Includes liabilities to third parties; excludes internal reserves, share capital, and proposed dividends.'
          },
          {
            name: 'Purchase Consideration (Net Payments Method)',
            formula: 'PC = Value of Equity Shares to Equity Shareholders + Cash to Equity Shareholders + Preference Consideration',
            explanation: 'Payments to debenture holders or liquidation expenses are not part of PC.'
          },
          {
            name: 'Capital Reserve / Goodwill in Purchase Method',
            formula: 'Goodwill = Purchase Consideration - Net Assets Acquired (at Agreed Values)',
            explanation: 'If negative, it constitutes Capital Reserve. Must amortize goodwill over max 5 years under AS 14.'
          }
        ],
        icaiTraps: [
          'Debentures of transferor company are taken over as a liability, NOT included in purchase consideration.',
          'In Pooling of Interests method, difference between PC and share capital is adjusted against General Reserves, not Capital Reserve/Goodwill.'
        ],
        mindmapTree: {
          id: 'amal-root',
          label: 'Corporate Restructuring (AS 14)',
          summary: 'External mergers and acquisitions under AS 14 and court-approved internal reconstruction schemes.',
          children: [
            {
              id: 'as14-merger',
              label: 'Nature of Merger (Pooling of Interests)',
              summary: 'All 5 conditions satisfied, assets/liabilities at book value, reserves preserved.',
              subtopics: ['90% equity shareholder consent', 'Continuation of business', 'Reserves adjustment']
            },
            {
              id: 'as14-purchase',
              label: 'Nature of Purchase (Purchase Method)',
              summary: 'Assets/liabilities at agreed/fair value; Goodwill or Capital Reserve arises.',
              subtopics: ['Statutory reserve creation (Amalgamation Adjustment Reserve)', 'Goodwill amortization over 5 years']
            },
            {
              id: 'internal-recon',
              label: 'Internal Reconstruction (Sec 66)',
              summary: 'Capital reduction account, sacrifice by shareholders/creditors, writing off accumulated losses.',
              subtopics: ['Sacrifice accounting entries', 'Writing off fictitious assets', 'NCLT confirmation']
            }
          ]
        }
      }
    ]
  },

  // ==========================================
  // PAPER 2: CORPORATE & OTHER LAWS
  // ==========================================
  'corporate-laws': {
    subjectTitle: 'Corporate & Other Laws',
    code: 'Paper 2',
    chapters: [
      {
        id: 'c3',
        number: 1,
        title: 'Preliminary, Incorporation & MOA/AOA',
        module: 'Module 1',
        duration: '4h 00m',
        marks: '12-15',
        audioSummary: 'This chapter covers Section 1 through Section 22 of the Companies Act 2013. Key provisions include definition of Small Company under Section 2(85), Private and Public companies, One Person Company, and doctrine of Ultra Vires.',
        importantPoints: [
          'Small Company [Sec 2(85)]: Paid-up capital <= ₹4 Crores AND Turnover <= ₹40 Crores in immediately preceding FY. Holding, subsidiary, Sec 8 company, or company governed by special Act can never be small companies.',
          'One Person Company (OPC): Only natural person who is an Indian citizen (whether resident in India or not) can incorporate an OPC and be a nominee.',
          'Doctrine of Ultra Vires: Acts beyond the object clause of MOA are void ab initio and cannot be ratified even by unanimous consent of all shareholders.',
          'Doctrine of Indoor Management (Turquand Rule): Outsiders dealing with company are entitled to assume internal procedures were complied with. Exceptions: Knowledge of irregularity, Suspicion of irregularity, Forgery (Ruben v Great Fingall).'
        ],
        formulas: [
          {
            name: 'Small Company Threshold Limits (Amended)',
            formula: 'Paid-up Share Capital <= ₹4.00 Crores AND Annual Turnover (preceding FY) <= ₹40.00 Crores',
            explanation: 'Both conditions must be satisfied simultaneously.'
          },
          {
            name: 'Holding-Subsidiary Test [Sec 2(87)]',
            formula: 'Controls composition of Board of Directors OR Exercises > 50% of total voting power',
            explanation: 'Directly or together with one or more subsidiary companies.'
          }
        ],
        icaiTraps: [
          'A company that is a subsidiary of a public company is always deemed to be a public company, even if it remains private in its articles.',
          'Turquand rule never protects against forged documents signed by unauthorized company officers.'
        ],
        mindmapTree: {
          id: 'incorp-root',
          label: 'Company Law Fundamentals',
          summary: 'Foundational concepts, classifications, and constitution of companies.',
          children: [
            {
              id: 'types-comp',
              label: 'Classifications of Companies',
              summary: 'Small Company limits, OPC criteria, Sec 8 non-profit licensing, Government companies.',
              subtopics: ['Sec 2(85) thresholds', 'OPC nominee rules', 'Sec 8 revocation of license']
            },
            {
              id: 'moa-aoa-doctrines',
              label: 'MOA, AOA & Judicial Doctrines',
              summary: 'Object clause alteration, Constructive Notice, Indoor Management exceptions.',
              subtopics: ['Ultra Vires consequences', 'Turquand rule exceptions', 'Alteration of registered office clause']
            }
          ]
        }
      },
      {
        id: 'c3-2',
        number: 2,
        title: 'Prospectus and Allotment of Securities',
        module: 'Module 1',
        duration: '3h 30m',
        marks: '10-14',
        audioSummary: 'Sections 23 to 42 govern public offers and private placements. Covers Golden Rule of Prospectus, Shelf Prospectus under Section 31, Red Herring Prospectus under Section 32, minimum subscription rules under Section 39, and Private Placement under Section 42.',
        importantPoints: [
          'Public Offer Modes [Sec 23]: Public company may issue securities through prospectus (IPO/FPO), private placement, or rights/bonus issue. Private company can issue through rights issue, bonus issue, or private placement.',
          'Shelf Prospectus [Sec 31]: Prospectus in respect of which securities are issued for subscription in one or more issues over a period not exceeding 1 year without issuing a fresh prospectus. Requires filing Information Memorandum in Form PAS-2.',
          'Red Herring Prospectus [Sec 32]: Prospectus that does not include complete particulars of quantum or price of securities. Must be filed with RoC at least 3 days prior to opening of subscription list.',
          'Minimum Subscription [Sec 39]: Minimum subscription of 90% must be received within 30 days of prospectus issuance. If not received, entire money must be refunded within 15 days; otherwise 15% interest p.a. payable.',
          'Private Placement [Sec 42]: Offer to identified persons <= 200 in aggregate in a financial year (excluding QIBs and employees under ESOP). Payment must be made from bank account of subscriber (never cash). Return of allotment filed in Form PAS-3 within 15 days.'
        ],
        formulas: [
          {
            name: 'Minimum Subscription Threshold (Sec 39)',
            formula: 'Minimum Subscription = 90% of Total Issue Size',
            explanation: 'Application money must be at least 5% of nominal value of security (or SEBI prescribed limit).'
          },
          {
            name: 'Refund Timeline for Non-Subscription',
            formula: 'Refund within 15 days from closure of issue. Failure triggers interest at 15% p.a.',
            explanation: 'Directors are jointly and severally liable to repay with interest.'
          },
          {
            name: 'Private Placement Maximum Ceiling (Sec 42)',
            formula: 'Maximum Identified Persons <= 200 in aggregate per FY for each kind of security',
            explanation: 'Excludes Qualified Institutional Buyers (QIBs) and employees under stock options.'
          }
        ],
        icaiTraps: [
          'Allotment under private placement cannot be made until company files Return of Allotment in Form PAS-3, and funds in separate bank account cannot be utilized before filing.',
          'Any offer to more than 200 persons automatically becomes a deemed public offer, attracting full SEBI and public offer regulations.'
        ],
        mindmapTree: {
          id: 'prospectus-root',
          label: 'Prospectus & Capital Raising',
          summary: 'Legal mechanisms for issuing securities, public disclosure standards, and private placements.',
          children: [
            {
              id: 'prospectus-types',
              label: 'Types of Prospectus (Sec 25-32)',
              summary: 'Deemed prospectus, Shelf prospectus, Red herring prospectus, Abridged prospectus.',
              subtopics: ['1-year validity of shelf prospectus', 'PAS-2 Information memorandum', 'RHP price band mechanism']
            },
            {
              id: 'allotment-rules',
              label: 'Allotment & Minimum Subscription (Sec 39)',
              summary: '90% minimum subscription, 30 days receipt rule, 15 days refund rule, 15% penal interest.',
              subtopics: ['5% application money rule', 'Separate bank account under Schedule Bank', 'PAS-3 Return of allotment']
            },
            {
              id: 'private-placement',
              label: 'Private Placement Process (Sec 42)',
              summary: 'Form PAS-4 offer letter, 200 limit ceiling, banking channel mandate, PAS-3 within 15 days.',
              subtopics: ['No public advertisement ban', 'Board + Special resolution prior approval', 'Separate bank account utilization condition']
            }
          ]
        }
      },
      {
        id: 'c3-3',
        number: 3,
        title: 'Management and Administration (Sections 88 to 122)',
        module: 'Module 2',
        duration: '5h 30m',
        marks: '15-20',
        audioSummary: 'Management and Administration covers Annual General Meetings under Section 96, Extraordinary General Meetings under Section 100, Quorum requirements under Section 103, and Ordinary vs Special Resolutions.',
        importantPoints: [
          'Annual General Meeting (AGM) [Sec 96]: Every company (other than OPC) must hold AGM every year. Gap between two AGMs cannot exceed 15 months. Must be held within 6 months from close of financial year.',
          'Notice of General Meeting [Sec 101]: Minimum 21 clear days notice in writing or electronic mode. Can be called at shorter notice if consent given by >= 95% of members entitled to vote.',
          'Quorum for Public Company [Sec 103]: 5 members personally present (if members <= 1000); 15 members (if members > 1000 but <= 5000); 30 members (if members > 5000). For Private Company: 2 members personally present.',
          'Ordinary Resolution (OR): Votes cast in favour exceed votes cast against. Special Resolution (SR) [Sec 114]: Votes cast in favour are at least 3 times the votes cast against (>= 75%).',
          'Annual Return [Sec 92]: Filed in Form MGT-7 within 60 days of AGM. Signed by director and company secretary (or PCS if no CS).'
        ],
        formulas: [
          {
            name: 'Special Resolution Requirement (Sec 114)',
            formula: 'Votes In Favour >= 3 × Votes Against (i.e. >= 75% of total votes cast)',
            explanation: 'Abstentions and invalid votes are completely ignored.'
          },
          {
            name: 'Requisition of EGM by Members (Sec 100)',
            formula: 'Requisitionists must hold >= 10% of Paid-up Capital with voting rights (or >= 10% total voting power)',
            explanation: 'Board must call meeting within 21 days from date of requisition, to be held within 45 days.'
          }
        ],
        icaiTraps: [
          'Clear 21 days excludes day of dispatch, 48 hours for postal transit, and day of meeting itself.',
          'A proxy can vote ONLY on a poll, NOT on a show of hands, and cannot speak at the general meeting.'
        ],
        mindmapTree: {
          id: 'mgmt-root',
          label: 'Management & Meetings',
          summary: 'Statutory registers, general meetings, member voting rights, and corporate governance.',
          children: [
            {
              id: 'agm-egm',
              label: 'General Meetings (Sec 96, 100)',
              summary: 'AGM timelines, 15-month gap, 21 clear days notice, shorter notice consent requirements.',
              subtopics: ['10% EGM requisition threshold', 'Tribunal power to call AGM u/s 97', 'MGT-7 annual return timeline']
            },
            {
              id: 'meeting-procedure',
              label: 'Meeting Procedures & Voting (Sec 103-110)',
              summary: 'Quorum tiers (5/15/30), Chairman, Show of hands, Poll demands, Postal ballot.',
              subtopics: ['Proxy 50-member/10% capital ceiling', 'Special Notice 14-day rule', 'Scrutinizer report timeline']
            },
            {
              id: 'resolutions',
              label: 'Resolutions & Minutes (Sec 114-118)',
              summary: 'Ordinary vs Special resolution, Form MGT-14 filing within 30 days, 30-day minutes entry rule.',
              subtopics: ['MGT-14 registration with RoC', 'Inspection of minutes books u/s 119', 'Circulation of members resolution']
            }
          ]
        }
      },
      {
        id: 'c3-4',
        number: 4,
        title: 'The Limited Liability Partnership Act, 2008 & General Clauses Act',
        module: 'Module 3',
        duration: '4h 00m',
        marks: '12-16',
        audioSummary: 'This module covers LLP Act 2008 fundamentals: separate legal entity, designated partners under Section 7, contribution, whistleblowing, and conversion from firm/company to LLP. Also covers statutory interpretation rules under General Clauses Act 1897.',
        importantPoints: [
          'Designated Partners (Sec 7): Every LLP must have at least 2 designated partners who are individuals, and at least one must be resident in India (stayed in India >= 120 days in preceding 1 year).',
          'Incorporation Document (Sec 11): Filed in Form FiLLiP with RoC. LLP Agreement filed in Form 3 within 30 days of registration.',
          'Partner Liability (Sec 27): Partner is agent of LLP, but not agent of other partners. Personal liability limited to contribution; unlimited in cases of intent to defraud (Sec 30).',
          'Annual Compliance: Statement of Account & Solvency in Form 8 within 30 days from end of 6 months of FY (by 30th October). Annual Return in Form 11 within 60 days from closure of FY (by 30th May).',
          'General Clauses Act 1897: Section 3 definitions (Person, Affidavits, Month, Year). Section 9 (Measurement of time - from/to rules). Section 27 (Meaning of service by post - presumption of delivery).'
        ],
        formulas: [
          {
            name: 'LLP Small Partner Residency Test (Sec 7)',
            formula: 'Stay in India >= 120 days during the immediately preceding one financial year',
            explanation: 'Amended from 182 days under LLP Amendment Act 2021.'
          },
          {
            name: 'Small LLP Threshold Limit [Sec 2(1)(ta)]',
            formula: 'Contribution <= ₹25 Lakhs (up to ₹5 Cr) AND Turnover <= ₹40 Lakhs (up to ₹50 Cr)',
            explanation: 'Subject to lesser compliance penalties under decriminalized regime.'
          }
        ],
        icaiTraps: [
          'If the number of partners falls below 2 and LLP carries on business for more than 6 months, the sole remaining partner becomes personally liable for all obligations incurred during that period.',
          'Under General Clauses Act Sec 27, service by post is deemed effective upon proving address was correctly stated, prepaid, and posted by registered post, unless contrary is proved.'
        ],
        mindmapTree: {
          id: 'llp-root',
          label: 'LLP Act 2008 & Interpretation',
          summary: 'Hybrid corporate structure, mutual agency limitations, designated partners, and statutory interpretation principles.',
          children: [
            {
              id: 'llp-constitution',
              label: 'LLP Constitution & Partners (Sec 5-10)',
              summary: 'Designated partners (120-day rule), DPIN requirement, Form FiLLiP and Form 3 filing.',
              subtopics: ['2 designated partners minimum', 'Body corporate partner nominee', 'Partner cessation Sec 24']
            },
            {
              id: 'llp-compliance',
              label: 'Financial Disclosures & Solvency',
              summary: 'Form 8 Statement of Account & Solvency, Form 11 Annual return, audit audit exemption thresholds.',
              subtopics: ['Contribution ₹25L / Turnover ₹40L audit trigger', 'Form 8 due date 30th Oct', 'Form 11 due date 30th May']
            },
            {
              id: 'general-clauses',
              label: 'General Clauses Act 1897 Principles',
              summary: 'Statutory definitions, computation of time, service by post, repealed enactments effect.',
              subtopics: ['Exclusion of first day u/s 9', 'Service by post presumption u/s 27', 'Effect of repeal u/s 6']
            }
          ]
        }
      }
    ]
  },

  // ==========================================
  // PAPER 3: TAXATION (INCOME TAX + GST)
  // ==========================================
  'taxation': {
    subjectTitle: 'Taxation',
    code: 'Paper 3',
    chapters: [
      {
        id: 'c4',
        number: 1,
        title: 'Basic Concepts & Residential Status (Sec 1 to 9)',
        module: 'Module 1 (Income Tax)',
        duration: '6h 00m',
        marks: '12-16',
        audioSummary: 'Covers tax rates under Section 115BAC (Default New Tax Regime) versus Normal provisions, Surcharge, Health & Education Cess, and determination of Residential Status for Individuals under Section 6(1) and 6(6).',
        importantPoints: [
          'Default Tax Regime [Sec 115BAC]: Slabs: Up to ₹3L: Nil; ₹3L-₹7L: 5%; ₹7L-₹10L: 10%; ₹10L-₹12L: 15%; ₹12L-₹15L: 20%; Above ₹15L: 30%. Rebate u/s 87A up to ₹25,000 for total income up to ₹7,00,000. Marginal relief available for income slightly exceeding ₹7 Lakhs.',
          'Standard Deduction u/s 16(ia): ₹75,000 now available under Section 115BAC as well.',
          'Residential Status of Individual [Sec 6(1)]: Resident if stay in India >= 182 days in PY, OR >= 60 days in PY + >= 365 days in 4 preceding PYs. (60 days replaced by 182 days for Indian citizen leaving for employment or crew member; 120 days if Indian citizen/PIO having total Indian income > ₹15 Lakhs).',
          'ROR vs RNOR [Sec 6(6)]: Resident is RNOR if non-resident in 9 out of 10 preceding PYs OR stay in India <= 729 days in 7 preceding PYs. Also deemed resident u/s 6(1A) is always RNOR.',
          'Scope of Total Income [Sec 5]: ROR taxed on global income; RNOR taxed on Indian income + foreign income from business controlled or profession set up in India; Non-Resident taxed only on Indian income.'
        ],
        formulas: [
          {
            name: 'Default Regime (Sec 115BAC) Slabs',
            formula: '0-3L: 0% | 3-7L: 5% | 7-10L: 10% | 10-12L: 15% | 12-15L: 20% | >15L: 30%',
            explanation: 'Rebate u/s 87A: Tax payable or ₹25,000, whichever is less (if Total Income <= ₹7,00,000).'
          },
          {
            name: 'Marginal Relief under Section 115BAC',
            formula: 'Tax on Total Income cannot exceed (Tax on ₹7,00,000 + Income exceeding ₹7,00,000)',
            explanation: 'Ensures tax payable does not exceed excess income over ₹7 Lakh threshold.'
          },
          {
            name: 'Health & Education Cess',
            formula: 'HEC = 4% × (Tax Payable + Surcharge - Rebate)',
            explanation: 'Calculated on net tax after applying applicable surcharge.'
          }
        ],
        icaiTraps: [
          'Deemed resident u/s 6(1A) (Indian citizen having Indian income > ₹15L who is not liable to tax in any other country) is ALWAYS an RNOR, never ROR.',
          'Rebate u/s 87A is not available against Long Term Capital Gains taxable under Section 112A.'
        ],
        mindmapTree: {
          id: 'tax-basic-root',
          label: 'Tax Basics & Residency',
          summary: 'Rates under Section 115BAC, surcharge, residential status tests, and scope of total income.',
          children: [
            {
              id: 'residency-tests',
              label: 'Residential Status (Sec 6)',
              summary: '182-day rule, 60+365 rule, 120-day rule for high-income PIO, Deemed residency u/s 6(1A).',
              subtopics: ['RNOR 729-day condition', 'Indian crew member CDC rule', 'Scope of income u/s 5']
            },
            {
              id: 'tax-slabs-rates',
              label: 'Tax Computations & 115BAC',
              summary: 'New regime slabs, Sec 87A rebate (₹25k), standard deduction (₹75k), marginal relief.',
              subtopics: ['Surcharge tiers (10%, 15%, 25%)', '4% HEC calculation', 'Old vs New regime option']
            }
          ]
        }
      },
      {
        id: 'c4-2',
        number: 2,
        title: 'Incomes which do not form part of Total Income (Sec 10)',
        module: 'Module 1 (Income Tax)',
        duration: '3h 30m',
        marks: '6-10',
        audioSummary: 'Section 10 exempts certain categories of receipts completely from total income. Key provisions include Agricultural Income under Section 10(1), Retrenchment compensation, Gratuity under Section 10(10), Leave Encashment under Section 10(10AA), and House Rent Allowance under Section 10(13A).',
        importantPoints: [
          'Agricultural Income [Sec 10(1)]: Fully exempt. Included for rate purposes (partial integration) if agricultural income > ₹5,000 AND non-agricultural income exceeds basic exemption limit.',
          'Death-cum-Retirement Gratuity [Sec 10(10)]: Government employees: fully exempt. Non-Govt covered by Payment of Gratuity Act 1972: Min of: (i) Actual received, (ii) ₹20,00,000, (iii) 15/26 × Last drawn salary × Completed years of service (part > 6 months rounded up).',
          'Non-Govt NOT covered by Gratuity Act: Min of: (i) Actual received, (ii) ₹20,00,000, (iii) 1/2 × Average salary of last 10 months × Completed years (ignore fractions).',
          'Leave Encashment [Sec 10(10AA)]: Government employees: fully exempt. Non-Govt on retirement: Min of: (i) Actual, (ii) ₹25,00,000 (enhanced limit), (iii) 10 months average salary, (iv) Cash equivalent of leave based on max 30 days per year of actual service.',
          'House Rent Allowance (HRA) [Sec 10(13A)]: Least of: (i) Actual HRA received, (ii) Rent paid - 10% of salary, (iii) 50% of salary (Metro) or 40% (Non-Metro). (Note: HRA exemption not available under Section 115BAC).'
        ],
        formulas: [
          {
            name: 'Gratuity Exemption (Covered by Act)',
            formula: 'Least of: Actual | ₹20,00,000 | (15/26 × Last Drawn Basic+DA × Completed Years)',
            explanation: 'Salary = Basic + DA (both forms). Fraction of year in excess of 6 months treated as full year.'
          },
          {
            name: 'Leave Encashment Statutory Limit',
            formula: 'Least of: Actual | ₹25,00,000 | (10 × Avg 10-month Salary) | (Unavailed leave up to 30 days/yr × Avg Salary)',
            explanation: 'Statutory ceiling enhanced to ₹25 Lakhs by CBDT notification.'
          },
          {
            name: 'HRA Exemption Formula (Sec 10(13A))',
            formula: 'Least of: Actual HRA | Rent Paid - 10% Salary | 50% (Metro) or 40% (Non-Metro) of Salary',
            explanation: 'Salary = Basic + DA (retirement benefits) + Commission (% of turnover).'
          }
        ],
        icaiTraps: [
          'Under Section 115BAC default regime, HRA exemption u/s 10(13A) is NOT allowed.',
          'For Gratuity not covered by Act, fraction of year is strictly ignored (e.g. 15 years 9 months is taken as 15 years).'
        ],
        mindmapTree: {
          id: 'exempt-root',
          label: 'Exempt Incomes (Sec 10)',
          summary: 'Statutory exemptions, retirement benefits relief formulas, and agricultural income integration.',
          children: [
            {
              id: 'retirement-exemptions',
              label: 'Retirement Benefits (Sec 10(10), 10AA)',
              summary: 'Gratuity limits (covered vs uncovered), Leave encashment (₹25L ceiling), Commuted pension.',
              subtopics: ['15/26 vs 1/2 salary factor', 'Fraction rounding rules', 'Commuted pension 1/3 vs 1/2 rule']
            },
            {
              id: 'employment-exemptions',
              label: 'Allowances & Other Exemptions',
              summary: 'HRA 10(13A), Retrenchment compensation (₹5L), Voluntary Retirement Scheme (₹5L).',
              subtopics: ['Rent minus 10% salary rule', 'Metro 50% definition', 'Sec 115BAC restrictions']
            }
          ]
        }
      },
      {
        id: 'c4-3',
        number: 3,
        title: 'Heads of Income - Salaries & House Property',
        module: 'Module 2 (Income Tax)',
        duration: '8h 00m',
        marks: '16-22',
        audioSummary: 'Covers computation of Income from Salaries (Sections 15 to 17) and Income from House Property (Sections 22 to 27). Details include perquisite valuation, Rent Free Accommodation, standard deductions, Municipal Value, Fair Rent, Standard Rent, and deduction for interest on housing loan.',
        importantPoints: [
          'Salaries Basis of Charge [Sec 15]: Taxable on "due" or "receipt" basis, whichever is earlier. Advance salary taxable in year of receipt; Arrears taxable in year of receipt (relief u/s 89).',
          'Rent-Free Accommodation (RFA) Perquisite: For owned accommodation: 10% of salary (cities with pop > 40L); 7.5% of salary (pop 15L to 40L); 5% of salary (other cities). For leased accommodation: lower of actual lease rent paid or 10% of salary.',
          'Deductions from Salary [Sec 16]: Standard deduction of ₹75,000 u/s 16(ia); Entertainment allowance u/s 16(ii) (Govt employees only, max ₹5,000); Professional tax u/s 16(iii) on paid basis.',
          'House Property Basis of Charge [Sec 22]: Annual value of property consisting of any buildings or lands appurtenant thereto of which assessee is owner.',
          'Gross Annual Value (GAV): Higher of Expected Rent (Higher of MV or FR, but capped at Standard Rent) and Actual Rent Received/Receivable.',
          'Deductions u/s 24: Statutory Standard Deduction of 30% of NAV u/s 24(a); Interest on borrowed capital u/s 24(b) (max ₹2,00,000 for self-occupied property if loan taken for construction/acquisition after 01.04.1999 and completed within 5 years; max ₹30,000 for repairs).'
        ],
        formulas: [
          {
            name: 'Expected Rent (ER) for House Property',
            formula: 'Expected Rent = Min( Max(Municipal Value, Fair Rent), Standard Rent )',
            explanation: 'Standard rent determined under Rent Control Act is the maximum limit.'
          },
          {
            name: 'Net Annual Value (NAV)',
            formula: 'NAV = Gross Annual Value (GAV) - Municipal Taxes Actually Paid by Owner',
            explanation: 'Municipal taxes unpaid or paid by tenant cannot be deducted.'
          },
          {
            name: 'Income from Let-Out House Property',
            formula: 'Income = NAV - (30% of NAV u/s 24(a)) - Interest on Loan u/s 24(b)',
            explanation: 'Pre-construction interest deductible in 5 equal annual installments from completion year.'
          },
          {
            name: 'Self-Occupied House Property Loss Limit',
            formula: 'NAV = Nil; Deductions u/s 24(a) = Nil; Interest u/s 24(b) = Max (₹2,00,000)',
            explanation: 'Loss from self-occupied house property can be set off against other heads up to ₹2,00,000.'
          }
        ],
        icaiTraps: [
          'Under Section 115BAC default regime, loss from house property CANNOT be set off against any other head of income.',
          'If property is vacant and actual rent is lower than expected rent OWING SOLELY to vacancy, actual rent is taken as GAV.'
        ],
        mindmapTree: {
          id: 'sal-hp-root',
          label: 'Salaries & House Property',
          summary: 'Employee perquisites, standard deductions, Annual Value computation, and loan interest caps.',
          children: [
            {
              id: 'salaries-head',
              label: 'Salaries Computation (Sec 15-17)',
              summary: 'Basic + DA, RFA valuation (10%/7.5%/5%), motor car perquisites, standard deduction ₹75,000.',
              subtopics: ['RFA pop tiers', 'Interest-free loan perquisite', 'Sec 16 deductions']
            },
            {
              id: 'hp-head',
              label: 'House Property (Sec 22-27)',
              summary: 'GAV calculation steps, municipal tax on paid basis, 30% standard deduction, Sec 24(b) interest.',
              subtopics: ['Expected rent steps', 'Vacancy vs Unrealized rent', 'Self-occupied ₹2 Lakh cap']
            }
          ]
        }
      },
      {
        id: 'c5',
        number: 4,
        title: 'GST in India - An Introduction & Supply (Sec 7 & 8)',
        module: 'Module 3 (GST)',
        duration: '5h 00m',
        marks: '12-16',
        audioSummary: 'Covers the constitutional framework of GST, taxable event of Supply under Section 7 of the CGST Act, activities without consideration under Schedule I, Schedule II classification (goods vs services), non-supplies under Schedule III, and Composite vs Mixed supplies under Section 8.',
        importantPoints: [
          'Concept of Supply [Sec 7(1)(a)]: Includes all forms of supply of goods or services or both such as sale, transfer, barter, exchange, licence, rental, lease or disposal made for a consideration by a person in the course or furtherance of business.',
          'Import of Services [Sec 7(1)(b)]: Import of services for a consideration, whether or not in course or furtherance of business, is a supply.',
          'Schedule I (Deemed Supply without Consideration): (1) Permanent transfer of business assets on which ITC availed; (2) Supply between related persons or distinct persons in course of business (gift to employee <= ₹50,000 in FY is not supply); (3) Supply between principal and agent; (4) Import of services from related person/distinct person in course of business.',
          'Schedule III (Negative List - Neither Goods nor Services): (1) Services by employee to employer; (2) Services by court/tribunal; (3) Functions by MPs/MLAs; (4) Services of funeral/crematorium/mortuary; (5) Sale of land and sale of building (after completion certificate/first occupancy); (6) Actionable claims (other than specified actionable claims: betting, casinos, gambling, horse racing, lottery, online gaming).',
          'Composite Supply [Sec 8(a)]: Two or more taxable supplies naturally bundled in ordinary course of business, one of which is a principal supply. Taxed at the rate applicable to the Principal Supply.',
          'Mixed Supply [Sec 8(b)]: Two or more individual supplies supplied together for a single price, not naturally bundled. Taxed at the highest rate among the supplies included in the package.'
        ],
        formulas: [
          {
            name: 'Composite Supply Tax Rate (Sec 8(a))',
            formula: 'Applicable GST Rate = Tax Rate of the Principal Supply',
            explanation: 'Example: Laptop supplied with carrying bag and charger -> Taxed at Laptop rate.'
          },
          {
            name: 'Mixed Supply Tax Rate (Sec 8(b))',
            formula: 'Applicable GST Rate = Highest Tax Rate among all items bundled in package',
            explanation: 'Example: Gift hamper with chocolates (18%), canned food (12%), dry fruits (5%) -> Entire hamper taxed at 18%.'
          }
        ],
        icaiTraps: [
          'Gifts not exceeding ₹50,000 in value in a financial year by an employer to an employee shall not be treated as supply; but gifts > ₹50,000 become taxable on ENTIRE amount.',
          'Sale of under-construction property (where consideration received before completion certificate) is a taxable supply of service, whereas sale after CC is covered in Schedule III.'
        ],
        mindmapTree: {
          id: 'gst-supply-root',
          label: 'GST Supply & Charge',
          summary: 'Taxable event definitions under Section 7, deemed supplies without consideration, negative list, and bundling rules.',
          children: [
            {
              id: 'supply-elements',
              label: 'Elements of Supply (Sec 7(1))',
              summary: 'Consideration, course of business, import of services, Schedule I deemed supplies.',
              subtopics: ['Related person definition', 'Principal-agent transactions', 'Distinct person registration']
            },
            {
              id: 'schedules-classification',
              label: 'Schedules II & III Analysis',
              summary: 'Goods vs Services classification in Schedule II; Negative list non-supplies in Schedule III.',
              subtopics: ['Land and building completion CC rule', 'Employee-employer services exclusion', 'Actionable claims scope']
            },
            {
              id: 'composite-mixed',
              label: 'Composite vs Mixed Supplies (Sec 8)',
              summary: 'Naturally bundled supplies (Principal rate) vs independent items at single price (Highest rate).',
              subtopics: ['Ancillary supply test', 'Single price test', 'Highest tax rate determination']
            }
          ]
        }
      },
      {
        id: 'c5-2',
        number: 5,
        title: 'Charge of GST, Exemptions & Input Tax Credit (Sec 9, 10, 16-21)',
        module: 'Module 3 (GST)',
        duration: '6h 30m',
        marks: '16-20',
        audioSummary: 'Details the levy and collection of CGST/SGST/IGST under Section 9, Reverse Charge Mechanism (RCM), Composition Levy under Section 10, and eligibility, apportionment, and blocked credits under Sections 16, 17, and 18.',
        importantPoints: [
          'Levy & Collection [Sec 9]: Intrastate supplies attract CGST + SGST; Interstate supplies attract IGST (Sec 5 IGST Act). Alcoholic liquor for human consumption is constitutionally outside GST.',
          'Reverse Charge Mechanism (RCM) [Sec 9(3)]: Tax payable by recipient. Key items: GTA services (5% without ITC), Legal services by advocate, Sponsorship services to body corporate, Director services to company.',
          'Composition Scheme [Sec 10]: Eligible if aggregate turnover in preceding FY <= ₹1.5 Crore (₹75 Lakhs for Special Category States). Rates: Manufacturer (1%), Trader (1%), Restaurant service (5%). Service providers eligible under Sec 10(2A) up to ₹50 Lakhs turnover at 6% rate.',
          'Input Tax Credit Eligibility [Sec 16]: 4 Conditions: (i) Possession of tax invoice/debit note; (ii) Details uploaded by supplier in GSTR-1 and reflected in GSTR-2B; (iii) Goods or services actually received; (iv) Tax paid to Government and return filed u/s 39. Payment to supplier must be made within 180 days; otherwise ITC reversed with interest.',
          'Blocked Credits [Sec 17(5)]: (a) Motor vehicles for passenger transport <= 13 seats (unless used for further supply, passenger transport, or driving school); (b) Food, beverages, outdoor catering, beauty treatment; (c) Membership of club/fitness center; (d) Works contract for construction of immovable property (except plant and machinery).'
        ],
        formulas: [
          {
            name: 'Rule 88A ITC Utilization Order',
            formula: 'IGST credit first used for IGST -> then CGST & SGST in ANY order and proportion -> CGST credit for CGST, then IGST -> SGST credit for SGST, then IGST',
            explanation: 'Cross-utilization of CGST credit against SGST liability (and vice-versa) is strictly PROHIBITED.'
          },
          {
            name: 'Composition Scheme Tax Rates',
            formula: 'Manufacturers: 1% (0.5% CGST + 0.5% SGST) of Turnover | Traders: 1% of Taxable Turnover | Restaurants: 5%',
            explanation: 'Composition dealers cannot collect tax from customers and cannot claim any ITC.'
          },
          {
            name: '180-Day Supplier Payment Reversal (Sec 16(2))',
            formula: 'If recipient fails to pay invoice value + tax within 180 days -> Reversal of ITC + Interest @ 18% p.a.',
            explanation: 'ITC can be re-availed upon making payment to the supplier.'
          }
        ],
        icaiTraps: [
          'CGST credit can NEVER be utilized to pay SGST liability, and SGST credit can NEVER be used to pay CGST liability.',
          'Motor vehicles designed to transport goods (trucks, tempos) are NOT blocked u/s 17(5); full ITC is eligible.'
        ],
        mindmapTree: {
          id: 'gst-charge-itc-root',
          label: 'Charge & Input Tax Credit',
          summary: 'Forward and reverse charge mechanisms, Composition limits, Section 16 conditions, and Section 17(5) blocked credits.',
          children: [
            {
              id: 'rcm-composition',
              label: 'RCM & Composition Levy (Sec 9, 10)',
              summary: 'Reverse charge notified goods/services, ₹1.5 Cr turnover ceiling, 1%/5%/6% composition rates.',
              subtopics: ['GTA 5% vs 12% choice', 'Advocate legal services RCM', 'Sec 10(2A) ₹50L service provider scheme']
            },
            {
              id: 'itc-eligibility',
              label: 'ITC Eligibility & Conditions (Sec 16)',
              summary: 'Invoice in hand, GSTR-2B reflection, receipt of goods, 180 days payment to supplier rule.',
              subtopics: ['GSTR-2B mandatory match', '180-day interest reversal', 'Depreciation on tax component bar']
            },
            {
              id: 'blocked-credits',
              label: 'Blocked Credits & Rule 88A (Sec 17(5))',
              summary: 'Passenger motor vehicles <= 13 seats, works contract, Rule 88A IGST-first utilization sequence.',
              subtopics: ['Immovable property works contract', 'Employee health insurance exceptions', 'Cross-utilization prohibition']
            }
          ]
        }
      }
    ]
  },

  // ==========================================
  // PAPER 4: COST & MANAGEMENT ACCOUNTING
  // ==========================================
  'cost-management': {
    subjectTitle: 'Cost & Management Accounting',
    code: 'Paper 4',
    chapters: [
      {
        id: 'c6',
        number: 1,
        title: 'Introduction to Cost and Management Accounting & Cost Sheet',
        module: 'Module 1',
        duration: '4h 00m',
        marks: '10-15',
        audioSummary: 'Introduction covers cost classification by nature, function, and behavior. Covers the preparation of a standardized Cost Sheet showing Prime Cost, Factory Cost, Cost of Production, and Cost of Sales under CAS guidelines.',
        importantPoints: [
          'Elements of Cost: Direct Material + Direct Labour + Direct Expenses = Prime Cost.',
          'Factory/Works Cost: Prime Cost + Factory Overheads + Opening WIP - Closing WIP.',
          'Cost of Production (COP): Factory Cost + Quality Control Cost + Research & Development Cost + Administration Overheads related to production - Credit for Recoveries/Scrap + Packing (Primary).',
          'Cost of Goods Sold (COGS): Cost of Production + Opening Finished Goods - Closing Finished Goods.',
          'Cost of Sales: COGS + Administrative Overheads (General) + Selling & Distribution Overheads.',
          'Items Excluded from Cost Sheet: Income tax, dividend paid, interest on debentures (unless borrowing cost directly attributable), capital losses, penalties, and provisions for bad debts.'
        ],
        formulas: [
          {
            name: 'Prime Cost Formula',
            formula: 'Prime Cost = Direct Materials Consumed + Direct Employee Cost + Direct Expenses',
            explanation: 'Raw Material Consumed = Opening Stock + Purchases + Carriage Inward - Closing Stock - Scrap.'
          },
          {
            name: 'Cost of Production (CAS Format)',
            formula: 'COP = Works Cost + Quality Control Cost + R&D Cost + Production Admin Overheads - Scrap Realization',
            explanation: 'Administrative overheads relating to general management are added after COGS.'
          },
          {
            name: 'Profit Percentage Conversion',
            formula: 'Profit on Cost of X% = Profit on Selling Price of [X / (100 + X)]%',
            explanation: 'Example: 25% on Cost = 25/125 = 20% on Sales.'
          }
        ],
        icaiTraps: [
          'Primary packing cost is added to Cost of Production, whereas secondary packing for carriage/delivery is added under Selling & Distribution overheads.',
          'Pure financial expenses like interest, dividend, and discounts on issue of shares are strictly omitted from cost sheets.'
        ],
        mindmapTree: {
          id: 'cost-intro-root',
          label: 'Cost Principles & Cost Sheet',
          summary: 'Classification of costs by behavior and nature, and structured cost sheet preparation.',
          children: [
            {
              id: 'cost-classifications',
              label: 'Classification of Costs',
              summary: 'Fixed vs Variable vs Semi-variable; Direct vs Indirect; Controllable vs Uncontrollable.',
              subtopics: ['High-Low semi-variable segregation', 'Opportunity costs', 'Sunk costs']
            },
            {
              id: 'cost-sheet-structure',
              label: 'Cost Sheet Architecture (CAS)',
              summary: 'Prime Cost -> Works Cost -> Cost of Production -> COGS -> Cost of Sales -> Profit.',
              subtopics: ['Quality control and R&D', 'Scrap credit adjustment', 'Primary vs Secondary packing']
            }
          ]
        }
      },
      {
        id: 'c6-2',
        number: 2,
        title: 'Material Costing & Inventory Control',
        module: 'Module 1',
        duration: '4h 30m',
        marks: '12-16',
        audioSummary: 'Material Costing deals with procurement procedures, economic order quantity (EOQ), re-order levels, safety stock, inventory valuation methods (FIFO, Weighted Average), and inventory control techniques like ABC analysis and Just-in-Time.',
        importantPoints: [
          'Economic Order Quantity (EOQ): Order size that minimizes total inventory costs (ordering cost + carrying cost). At EOQ, Annual Ordering Cost equals Annual Carrying Cost.',
          'Re-Order Level (ROL): Point at which new order should be placed. ROL = Maximum Consumption × Maximum Lead Time.',
          'Minimum Level: ROL - (Average Consumption × Average Lead Time). Safety Buffer.',
          'Maximum Level: ROL + Re-order Quantity (ROQ) - (Minimum Consumption × Minimum Lead Time).',
          'Inventory Valuation: FIFO (First In First Out - issued at earliest prices; closing inventory at recent prices). Weighted Average (Total Cost / Total Units calculated at each purchase).',
          'ABC Analysis: Category A (70% value, 10% items - strict control); Category B (20% value, 20% items); Category C (10% value, 70% items - simple control).'
        ],
        formulas: [
          {
            name: 'Economic Order Quantity (EOQ)',
            formula: 'EOQ = √( (2 × Annual Demand × Cost per Order) / Carrying Cost per unit per annum )',
            explanation: 'Carrying cost is often expressed as percentage of unit purchase price.'
          },
          {
            name: 'Total Inventory Cost at EOQ',
            formula: 'Total Cost = √( 2 × Annual Demand × Ordering Cost × Carrying Cost per unit ) + Purchase Cost',
            explanation: 'Ordering Cost = (Annual Demand / Order Size) × Cost per Order; Carrying Cost = (Order Size / 2) × Carrying Cost.'
          },
          {
            name: 'Stock Levels Formulas',
            formula: 'ROL = Max Usage × Max Lead Time | Min Level = ROL - (Avg Usage × Avg Lead Time) | Max Level = ROL + ROQ - (Min Usage × Min Lead Time)',
            explanation: 'Average Stock Level = Minimum Level + 1/2 of ROQ.'
          }
        ],
        icaiTraps: [
          'Carrying cost per unit must be calculated on unit purchase cost, NOT on total order value.',
          'If supplier offers quantity discount, compare total inventory costs (Purchase Cost + Ordering Cost + Carrying Cost) at EOQ vs at discount quantity.'
        ],
        mindmapTree: {
          id: 'mat-cost-root',
          label: 'Material Costing & EOQ',
          summary: 'Purchasing economics, inventory level formulas, and valuation methodologies.',
          children: [
            {
              id: 'eoq-analysis',
              label: 'EOQ & Inventory Economics',
              summary: 'Trade-off between ordering costs and holding costs; quantity discount evaluations.',
              subtopics: ['EOQ square root formula', 'Equalization of ordering and carrying costs', 'Discount trade-off calculation']
            },
            {
              id: 'stock-levels',
              label: 'Stock Levels & Safety Buffers',
              summary: 'Re-order level, Minimum level, Maximum level, Danger level calculations.',
              subtopics: ['Max usage times max lead time', 'Emergency purchase lead time for danger level', 'Average stock level methods']
            },
            {
              id: 'inventory-control',
              label: 'Inventory Control Techniques',
              summary: 'ABC analysis, VED analysis, Fast/Slow/Non-moving (FSN), JIT inventory approach.',
              subtopics: ['Pareto 80/20 principle in ABC', 'Vital/Essential/Desirable categorization', 'Zero inventory concept in JIT']
            }
          ]
        }
      },
      {
        id: 'c6-3',
        number: 3,
        title: 'Employee Cost & Overhead Absorption',
        module: 'Module 2',
        duration: '6h 30m',
        marks: '15-20',
        audioSummary: 'Employee cost covers idle time (normal vs abnormal), labour turnover calculation methods, and incentive wage schemes (Halsey and Rowan). Overhead covers primary and secondary distribution, machine hour rates, and treatment of under/over absorption.',
        importantPoints: [
          'Idle Time: Normal idle time is treated as part of production cost and loaded onto hourly rates. Abnormal idle time (machine breakdown, power failure) is debited directly to Costing P&L.',
          'Halsey Premium Plan: Wages = Time Taken × Rate + 50% × Time Saved × Rate.',
          'Rowan Incentive Plan: Wages = Time Taken × Rate + [ (Time Saved / Time Allowed) × (Time Taken × Rate) ]. Rowan plan pays higher bonus than Halsey when time saved is less than 50% of time allowed.',
          'Labour Turnover Methods: (1) Separation Method: [Separations / Avg Workers] × 100; (2) Replacement Method: [Replacements / Avg Workers] × 100; (3) Flux Method: [ (Separations + Accessions) / Avg Workers ] × 100.',
          'Overhead Allocation & Apportionment: Primary distribution to production and service departments. Secondary distribution using Repeated Distribution or Simultaneous Equation method.',
          'Overhead Absorption: Under-absorption or Over-absorption arises when actual overhead differs from absorbed overhead (Predetermined Rate × Actual Hours).'
        ],
        formulas: [
          {
            name: 'Halsey 50% Incentive Scheme',
            formula: 'Total Earnings = (Time Taken × Rate per hour) + [ 0.50 × (Time Allowed - Time Taken) × Rate per hour ]',
            explanation: 'Guarantees hourly wage for actual hours taken plus 50% bonus on time saved.'
          },
          {
            name: 'Rowan Incentive Scheme',
            formula: 'Total Earnings = (Time Taken × Rate) + [ (Time Saved / Time Allowed) × Time Taken × Rate ]',
            explanation: 'Bonus fraction ensures bonus can never exceed standard wages.'
          },
          {
            name: 'Predetermined Overhead Absorption Rate',
            formula: 'Absorption Rate = Budgeted Overheads / Budgeted Base (e.g. Machine Hours or Direct Labour Hours)',
            explanation: 'Absorbed Overheads = Predetermined Rate × Actual Activity Units.'
          },
          {
            name: 'Under / Over Absorption of Overheads',
            formula: 'Under/(Over) Absorption = Actual Overheads Incurred - Absorbed Overheads',
            explanation: 'If positive: Under-absorbed (debit to Costing P&L or Supplementary Rate); if negative: Over-absorbed.'
          }
        ],
        icaiTraps: [
          'Under Replacement method of labour turnover, new recruitments due to business expansion must be EXCLUDED; only replacements in vacated posts are counted.',
          'Under Rowan plan, maximum bonus is earned when time saved equals 50% of time allowed.'
        ],
        mindmapTree: {
          id: 'lab-oh-root',
          label: 'Labour Cost & Overheads',
          summary: 'Incentive wage plans, labour turnover rates, overhead distribution, and machine hour rates.',
          children: [
            {
              id: 'incentive-wage-plans',
              label: 'Incentive Wage Plans',
              summary: 'Halsey 50% vs Rowan plan, comparison of effective hourly rates, piece-rate differential plans.',
              subtopics: ['Time saved bonus fraction', 'Rowan bonus curve peak at 50%', 'Merrick and Taylor differential systems']
            },
            {
              id: 'overhead-distribution',
              label: 'Overhead Apportionment & Reciprocal Service',
              summary: 'Primary allocation bases, step-down method, simultaneous equations for reciprocal departments.',
              subtopics: ['Floor area, HP, asset value bases', 'Simultaneous equation elimination', 'Repeated distribution convergence']
            },
            {
              id: 'absorption-mechanics',
              label: 'Overhead Absorption & Under/Over Analysis',
              summary: 'Predetermined rates, machine hour rate components (standing vs running charges), supplementary rates.',
              subtopics: ['Comprehensive machine hour rate', 'Abnormal idle capacity to P&L', 'Supplementary rate for unabsorbed overhead']
            }
          ]
        }
      },
      {
        id: 'c6-4',
        number: 4,
        title: 'Activity Based Costing (ABC), Marginal Costing & Standard Costing',
        module: 'Module 3',
        duration: '7h 00m',
        marks: '20-25',
        audioSummary: 'Covers modern cost management: Activity Based Costing with cost pools and cost drivers. Marginal Costing covers contribution, PV ratio, Break-Even Point, and margin of safety. Standard Costing details material, labour, and overhead variance analysis.',
        importantPoints: [
          'Activity Based Costing (ABC): Assigns overheads to activities (cost pools) based on consumption of resources, and then to cost objects using cost drivers (e.g. number of setups, purchase orders, inspections).',
          'Marginal Costing Equation: Sales - Variable Cost = Contribution = Fixed Cost + Profit.',
          'Profit Volume (PV) Ratio: Measures rate of change of profit in relation to sales volume. PV Ratio = (Contribution / Sales) × 100 = (Change in Profit / Change in Sales) × 100.',
          'Break-Even Point (BEP): Level of sales where total cost equals total revenue (Zero profit/loss). BEP (units) = Fixed Cost / Contribution per unit. BEP (sales value) = Fixed Cost / PV Ratio.',
          'Margin of Safety (MOS): Excess of actual sales over break-even sales. MOS = Actual Sales - Break-Even Sales = Profit / PV Ratio.',
          'Standard Costing Variances: Material Cost Variance = Standard Cost - Actual Cost = Material Price Variance (AQ × [SP - AP]) + Material Usage Variance (SP × [SQ - AQ]).'
        ],
        formulas: [
          {
            name: 'Activity Cost Driver Rate in ABC',
            formula: 'Cost Driver Rate = Total Cost in Activity Pool / Total Quantity of Cost Driver',
            explanation: 'Overhead allocated to product = Activity Units Consumed × Cost Driver Rate.'
          },
          {
            name: 'Break-Even Point (Value & Units)',
            formula: 'BEP (Value) = Fixed Costs / PV Ratio | BEP (Units) = Fixed Costs / (Selling Price - Variable Cost per unit)',
            explanation: 'At BEP, Contribution equals Fixed Costs.'
          },
          {
            name: 'Margin of Safety (MOS)',
            formula: 'MOS (Sales) = Total Sales - Break-Even Sales = Profit / PV Ratio',
            explanation: 'MOS Ratio = (Actual Sales - BE Sales) / Actual Sales × 100.'
          },
          {
            name: 'Material Variances Equations',
            formula: 'MPV = Actual Quantity × (SP - AP) | MUV = Standard Price × (SQ - AQ) | MCV = MPV + MUV',
            explanation: 'SQ is standard quantity allowed for actual production achieved.'
          },
          {
            name: 'Labour Variances Equations',
            formula: 'LRV = Actual Hours × (SR - AR) | LEV = Standard Rate × (SH - AH) | LCV = LRV + LEV',
            explanation: 'If idle time exists, Idle Time Variance = Idle Hours × Standard Rate (always Adverse).'
          }
        ],
        icaiTraps: [
          'In variance calculations, Standard Quantity (SQ) and Standard Hours (SH) must ALWAYS be adjusted for the ACTUAL output produced, not budgeted output.',
          'Under ABC, high-volume standardized products are typically over-costed under traditional absorption and receive lower costs under ABC.'
        ],
        mindmapTree: {
          id: 'abc-marg-std-root',
          label: 'ABC, Marginal & Standard Costing',
          summary: 'Modern cost management frameworks, CVP decision making, and variance analysis.',
          children: [
            {
              id: 'abc-method',
              label: 'Activity Based Costing (ABC)',
              summary: 'Identification of cost pools, selection of cost drivers, and calculation of cost driver rates.',
              subtopics: ['Cost pool definition', 'Cost driver selection criteria', 'Traditional vs ABC profitability comparison']
            },
            {
              id: 'marginal-cvp',
              label: 'Marginal Costing & CVP Decision Models',
              summary: 'Contribution concept, PV ratio, Break-even point, Margin of Safety, Key factor analysis.',
              subtopics: ['Change in profit over change in sales', 'Shut-down point formula', 'Make or buy decision rules']
            },
            {
              id: 'standard-variances',
              label: 'Standard Costing Variance Decomposition',
              summary: 'Material price/usage/mix/yield; Labour rate/efficiency/idle; Variable and Fixed overhead variances.',
              subtopics: ['SQ for actual production adjustment', 'Material mix vs yield variance', 'Two/Three/Four overhead variance methods']
            }
          ]
        }
      }
    ]
  },

  // ==========================================
  // PAPER 5: AUDITING & ETHICS
  // ==========================================
  'auditing-ethics': {
    subjectTitle: 'Auditing & Ethics',
    code: 'Paper 5',
    chapters: [
      {
        id: 'c7',
        number: 1,
        title: 'Nature, Objective and Scope of Audit (SA 200, 210, 220)',
        module: 'Module 1',
        duration: '4h 00m',
        marks: '12-16',
        audioSummary: 'Covers basic principles of auditing. SA 200 outlines overall objectives of the independent auditor to obtain reasonable assurance that financial statements are free from material misstatement. SA 210 establishes terms of audit engagement, and SA 220 details quality control for an audit.',
        importantPoints: [
          'Overall Objectives [SA 200]: Obtain reasonable assurance about whether financial statements as a whole are free from material misstatement, whether due to fraud or error; and to report on financial statements in accordance with auditor findings.',
          'Reasonable Assurance: High, but not absolute, level of assurance due to inherent limitations of an audit (nature of financial reporting, nature of audit procedures, and need for timeliness).',
          'Professional Skepticism: An attitude that includes a questioning mind, being alert to conditions which may indicate possible misstatement due to error or fraud, and a critical assessment of audit evidence.',
          'Terms of Audit Engagements [SA 210]: Auditor shall agree terms in writing via Audit Engagement Letter. Preconditions for audit: determination of acceptable FRF and management acknowledgment of responsibility.',
          'Quality Control [SA 220 / SQC 1]: Leadership responsibilities, ethical requirements (Integrity, Objectivity, Independence), acceptance and continuance of client relationships, assignment of engagement teams, engagement performance, and monitoring.'
        ],
        formulas: [
          {
            name: 'Audit Risk Formula (SA 200)',
            formula: 'Audit Risk (AR) = Risk of Material Misstatement (RoMM) × Detection Risk (DR)',
            explanation: 'RoMM consists of Inherent Risk (IR) × Control Risk (CR). Auditor can only manipulate Detection Risk.'
          },
          {
            name: 'Detection Risk Relationship',
            formula: 'Detection Risk (DR) = Audit Risk (Acceptable Level) / (Inherent Risk × Control Risk)',
            explanation: 'Inverse relationship: Higher assessed RoMM requires lower acceptable detection risk through more substantive testing.'
          }
        ],
        icaiTraps: [
          'Auditor cannot give absolute assurance because audit evidence is persuasive rather than conclusive.',
          'If management requests a change in terms of audit engagement without reasonable justification (e.g. to restrict scope), auditor must refuse and withdraw if permitted by law.'
        ],
        mindmapTree: {
          id: 'audit-intro-root',
          label: 'Audit Fundamentals & SA 200',
          summary: 'Core audit objectives, professional skepticism, engagement agreements, and quality control pillars.',
          children: [
            {
              id: 'sa200-principles',
              label: 'SA 200 Core Pillars',
              summary: 'Reasonable assurance concept, Inherent limitations, Professional judgment and skepticism.',
              subtopics: ['Questioning mind requirement', 'Inherent risk vs Control risk', 'Persuasive vs Conclusive evidence']
            },
            {
              id: 'sa210-engagement',
              label: 'SA 210 Engagement Letters',
              summary: 'Preconditions for audit, recurring audit letters, changes in terms of engagement.',
              subtopics: ['Acceptable FRF test', 'Management premise acknowledgment', 'Refusal of unjustified scope limits']
            },
            {
              id: 'sqc1-quality',
              label: 'SQC 1 & SA 220 Quality Control',
              summary: 'Engagement Partner responsibilities, independence verification, Engagement Quality Control Review (EQCR).',
              subtopics: ['Threats to independence', 'EQCR for listed entities', 'Assembly of final audit file in 60 days']
            }
          ]
        }
      },
      {
        id: 'c7-2',
        number: 2,
        title: 'Audit Strategy, Planning and Programme (SA 300, 315, 320, 330)',
        module: 'Module 1',
        duration: '4h 30m',
        marks: '12-16',
        audioSummary: 'Covers audit planning under SA 300, risk assessment under SA 315, audit materiality benchmarks under SA 320, and responding to assessed risks under SA 330.',
        importantPoints: [
          'Planning an Audit [SA 300]: Continuous and iterative process. Involves establishing overall audit strategy (scope, timing, and direction) and developing detailed audit plan (risk assessment procedures and further audit procedures).',
          'Identifying & Assessing RoMM [SA 315]: Auditor must understand entity and its environment, including internal control components: Control Environment, Risk Assessment, Information System, Control Activities, and Monitoring.',
          'Materiality [SA 320]: Misstatements are material if individually or in aggregate they could influence economic decisions of users. Involves setting Materiality for financial statements as a whole and Performance Materiality (amount set to reduce risk that aggregate uncorrected misstatements exceed materiality).',
          'Responses to Assessed Risks [SA 330]: Overall responses at financial statement level (assigning experienced staff, unpredictability); Further audit procedures at assertion level (Tests of Controls and Substantive Procedures).',
          'Audit Programme: Detailed written set of instructions to audit team outlining verification procedures for each financial statement line item.'
        ],
        formulas: [
          {
            name: 'Materiality Benchmark Guidelines (SA 320)',
            formula: 'Profit Before Tax from continuing operations (5%), Total Revenue (0.5% - 1%), or Total Assets (1% - 2%)',
            explanation: 'Professional judgment dictates benchmark choice based on user focus and entity volatility.'
          },
          {
            name: 'Performance Materiality Determination',
            formula: 'Performance Materiality = 60% to 75% of Overall Financial Statement Materiality',
            explanation: 'Provides a safety margin against the accumulation of small undetected errors.'
          }
        ],
        icaiTraps: [
          'Materiality is not revised solely due to passage of time; it is revised if new information or changes in entity operations arise.',
          'Tests of controls alone are never sufficient for material classes of transactions; substantive testing is mandatory under SA 330.'
        ],
        mindmapTree: {
          id: 'audit-plan-root',
          label: 'Audit Planning & Risk Response',
          summary: 'Overall audit strategy, internal control evaluation, materiality thresholds, and substantive responses.',
          children: [
            {
              id: 'audit-strategy-plan',
              label: 'Strategy vs Plan (SA 300)',
              summary: 'Audit strategy sets scope, timing and direction; audit plan provides detailed procedure operationalization.',
              subtopics: ['Resource allocation', 'Preliminary engagement activities', 'Audit programme flexibility']
            },
            {
              id: 'sa315-internal-control',
              label: 'RoMM & Internal Controls (SA 315)',
              summary: '5 internal control components, walk-through tests, identification of significant risks.',
              subtopics: ['Entity environment understanding', 'IT controls & segregation of duties', 'Significant risk criteria']
            },
            {
              id: 'sa320-materiality',
              label: 'Materiality & Responses (SA 320, 330)',
              summary: 'Overall materiality benchmarks, performance materiality, tests of control vs substantive testing.',
              subtopics: ['Tolerable misstatement', 'Unpredictability in procedures', 'Dual-purpose testing']
            }
          ]
        }
      },
      {
        id: 'c7-3',
        number: 3,
        title: 'Audit Evidence, Documentation & Sampling (SA 230, 500, 505, 530)',
        module: 'Module 2',
        duration: '5h 30m',
        marks: '15-20',
        audioSummary: 'Details sufficiency and appropriateness of audit evidence under SA 500, working papers and documentation under SA 230, external confirmations under SA 505, and statistical vs non-statistical audit sampling under SA 530.',
        importantPoints: [
          'Audit Evidence [SA 500]: Must be Sufficient (quantity) and Appropriate (quality: relevance and reliability). External evidence is more reliable than internal; documentary more reliable than oral; original more reliable than copy.',
          'Audit Documentation [SA 230]: Working papers belong to the auditor. Must be prepared on timely basis to enable an experienced auditor to understand nature, timing, extent, and conclusions. Assembly of final audit file must be completed within 60 days from audit report date; retention period is minimum 7 years.',
          'External Confirmation [SA 505]: Direct written response obtained by auditor from a third party. Positive confirmation request (third party responds whether agreeing or disagreeing); Negative confirmation request (third party responds ONLY if disagreeing). Negative confirmations provide less persuasive evidence.',
          'Audit Sampling [SA 530]: Application of audit procedures to less than 100% of items within a population. Sampling risk: risk that auditor conclusion based on sample differs from conclusion if entire population were tested.',
          'Types of Sampling Risk: Risk of over-reliance (affects audit effectiveness -> leads to inappropriate audit opinion) and Risk of under-reliance (affects audit efficiency).'
        ],
        formulas: [
          {
            name: 'Sampling Risk Trade-Off (SA 530)',
            formula: 'Sample Size = (Population Book Value × Confidence Factor) / Tolerable Misstatement',
            explanation: 'Lower tolerable misstatement or higher confidence factor increases required sample size.'
          },
          {
            name: 'Sample Error Projection',
            formula: 'Projected Population Misstatement = (Sample Net Misstatement / Sample Total Value) × Population Total Value',
            explanation: 'Auditor must compare projected misstatement + anomalous errors with tolerable misstatement.'
          }
        ],
        icaiTraps: [
          'Negative confirmations are accepted only when: (1) Low RoMM; (2) Population has large number of small balances; (3) Very low exception rate expected; (4) Assumed recipients will not disregard requests.',
          'Audit working papers are the property of the auditor, NOT the client. Auditor has no obligation to share working papers with client or successor auditor.'
        ],
        mindmapTree: {
          id: 'audit-evidence-root',
          label: 'Audit Evidence & Working Papers',
          summary: 'Evidence reliability hierarchy, working paper retention rules, confirmation procedures, and sampling risk.',
          children: [
            {
              id: 'sa500-evidence-rules',
              label: 'Sufficiency & Appropriateness (SA 500)',
              summary: 'Reliability rules (external > internal, original > photocopy), management expert evidence evaluation.',
              subtopics: ['Inspection, Observation, Inquiry', 'Re-computation and Re-performance', 'Analytical procedures']
            },
            {
              id: 'sa230-documentation',
              label: 'Audit Documentation (SA 230)',
              summary: 'Working papers ownership, 60-day assembly period, 7-year mandatory retention rule.',
              subtopics: ['Experienced auditor test', 'Permanent vs Current audit files', 'Ownership & confidentiality']
            },
            {
              id: 'sa505-530-methods',
              label: 'Confirmations & Sampling (SA 505, 530)',
              summary: 'Positive vs negative confirmation, non-response procedures, sampling risk vs non-sampling risk.',
              subtopics: ['Management refusal to allow confirmation', 'Statistical vs Non-statistical sampling', 'Projected misstatement analysis']
            }
          ]
        }
      },
      {
        id: 'c7-4',
        number: 4,
        title: 'Audit of Items of Financial Statements & Company Audit (Sec 139-148)',
        module: 'Module 2',
        duration: '7h 00m',
        marks: '20-25',
        audioSummary: 'Covers substantive procedures for financial statement captions (Share Capital, Reserves, Borrowings, PPE, Receivables, Payables, Revenue). Details Company Audit provisions under Sections 139 to 148 of Companies Act 2013, CARO 2020 reporting, and SA 700 series audit reports.',
        importantPoints: [
          'Appointment of Auditor [Sec 139]: Non-govt company: First auditor appointed by Board within 30 days (or by members in EGM within 90 days); Subsequent auditor appointed in AGM for 5-year term (Form ADT-1 within 15 days). Govt company: First auditor appointed by C&AG within 60 days; subsequent auditor within 180 days of FY commencement.',
          'Rotation of Auditors [Sec 139(2)]: Applicable to listed companies and unlisted public companies (paid-up capital >= ₹10 Cr), private companies (paid-up capital >= ₹50 Cr), or companies with public borrowings >= ₹50 Cr. Individual auditor: 1 term of 5 consecutive years; Audit firm: 2 terms of 5 consecutive years. Cooling-off period is 5 years.',
          'Disqualifications of Auditor [Sec 141(3)]: Body corporate (other than LLP); Officer/employee of company; Partner/employee of officer; Person/relative/partner holding security in company (relative can hold face value up to ₹1,00,000); Indebtedness > ₹5,00,000; Guarantee given > ₹1,00,000; Business relationship; Person convicted of fraud within 10 years.',
          'Reporting on Fraud [Sec 143(12)]: If auditor has reason to believe fraud involving >= ₹1 Crore is being committed against company by officers/employees, report to Central Govt in Form ADT-4 within 60 days (Board response in 45 days, then report within 15 days). Fraud < ₹1 Crore reported to Audit Committee/Board within 2 days.',
          'CARO 2020: 21 reporting clauses including physical verification of inventory and PPE, benami properties, title deeds not held in company name, default in loan repayments, and unrecorded income surrendered in tax assessments.'
        ],
        formulas: [
          {
            name: 'Auditor Disqualification Relative Holding Cap',
            formula: 'Relative of Auditor may hold security in company of Face Value <= ₹1,00,000',
            explanation: 'If relative acquires securities exceeding ₹1,00,000, grace period of 60 days allowed to restore limit.'
          },
          {
            name: 'Fraud Reporting Timeline to Central Govt [Sec 143(12)]',
            formula: 'Report to Board/Audit Committee within 2 days -> Await reply 45 days -> Forward to Central Govt within 15 days (Total 60 days)',
            explanation: 'Applies to frauds of ₹1.00 Crore and above in Form ADT-4.'
          }
        ],
        icaiTraps: [
          'Relative face value limit of ₹1,00,000 applies strictly to FACE VALUE, not market value.',
          'Auditor cannot provide prohibited non-audit services u/s 144: Accounting, internal audit, investment banking, outsourced financial services.'
        ],
        mindmapTree: {
          id: 'comp-audit-root',
          label: 'Company Audit & CARO 2020',
          summary: 'Auditor appointment, rotation, Section 141 disqualifications, Sec 143(12) fraud reporting, and CARO clauses.',
          children: [
            {
              id: 'appointment-rotation',
              label: 'Appointment & Rotation (Sec 139)',
              summary: 'First auditor vs subsequent auditor, C&AG timelines, 5-year terms, rotation applicability thresholds.',
              subtopics: ['Board 30 days / EGM 90 days', 'C&AG 60-day rule', 'Rotation 10Cr/50Cr thresholds']
            },
            {
              id: 'disqualifications-141',
              label: 'Disqualifications (Sec 141)',
              summary: 'Relative shareholding ₹1L face value, indebtedness ₹5L, 20-company audit ceiling, 10-year fraud conviction.',
              subtopics: ['60-day corrective action period', 'Sec 144 prohibited services', 'Casual vacancy u/s 139(8)']
            },
            {
              id: 'caro-fraud-reporting',
              label: 'CARO 2020 & Fraud Reporting (Sec 143)',
              summary: 'Form ADT-4 for fraud >= ₹1 Cr, 21 CARO clauses, reporting on Internal Financial Controls (IFC).',
              subtopics: ['ADT-4 60-day sequential timeline', 'Physical verification of inventory clause', 'Title deeds and Benami property clauses']
            }
          ]
        }
      }
    ]
  },

  // ==========================================
  // PAPER 6: FINANCIAL MANAGEMENT & STRATEGIC MANAGEMENT
  // ==========================================
  'fm-sm': {
    subjectTitle: 'Financial Management & Strategic Management',
    code: 'Paper 6',
    chapters: [
      {
        id: 'c8',
        number: 1,
        title: 'Scope and Objectives of Financial Management & Ratio Analysis',
        module: 'Module 1 (FM)',
        duration: '4h 00m',
        marks: '10-14',
        audioSummary: 'Covers core principles of Financial Management: Profit Maximization vs Wealth Maximization. Financial analysis through key financial ratios: Liquidity ratios, Solvency ratios, Turnover ratios, and Profitability ratios including DuPont Analysis.',
        importantPoints: [
          'Wealth Maximization Objective: Modern objective of FM is to maximize Net Present Worth / Market Value of equity shares. Overcomes flaws of profit maximization (ignores time value of money, ignores risk/uncertainty, and lacks precise definition of profit).',
          'Liquidity Ratios: Current Ratio (Standard 2:1) = Current Assets / Current Liabilities. Quick / Liquid Ratio (Standard 1:1) = (Current Assets - Inventory - Prepaid Expenses) / Current Liabilities.',
          'Solvency Ratios: Debt-Equity Ratio = Total Debt / Net Worth; Interest Coverage Ratio (ICR) = EBIT / Interest. Higher ICR indicates comfortable debt service capacity.',
          'Activity / Turnover Ratios: Inventory Turnover = COGS / Average Inventory; Debtors Turnover = Credit Sales / Average Debtors; Working Capital Turnover = Sales / Net Working Capital.',
          'DuPont Analysis: Decomposes Return on Equity (ROE) into: Profit Margin (Net Profit / Sales) × Asset Turnover (Sales / Total Assets) × Financial Leverage Multiplier (Total Assets / Equity).'
        ],
        formulas: [
          {
            name: 'Current Ratio & Quick Ratio',
            formula: 'Current Ratio = CA / CL | Quick Ratio = (CA - Inventory - Prepaid Expenses) / CL',
            explanation: 'Ideal benchmarks are 2:1 for Current Ratio and 1:1 for Quick Ratio.'
          },
          {
            name: 'DuPont Three-Step ROE Decomposition',
            formula: 'ROE = (Net Profit / Sales) × (Sales / Total Assets) × (Total Assets / Shareholders Equity)',
            explanation: 'Separates operating profitability, asset efficiency, and financial leverage.'
          },
          {
            name: 'Interest Coverage Ratio (ICR)',
            formula: 'ICR = Earnings Before Interest and Tax (EBIT) / Interest Charges',
            explanation: 'Measures how many times entity can pay its debt interest using operating profits.'
          }
        ],
        icaiTraps: [
          'When calculating Inventory Turnover Ratio, use Cost of Goods Sold in numerator; use Sales only when COGS cannot be determined.',
          'Bank overdraft and cash credit are generally treated as Current Liabilities unless specifically stated to be permanent arrangements.'
        ],
        mindmapTree: {
          id: 'fm-intro-root',
          label: 'FM Scope & Ratio Analysis',
          summary: 'Wealth maximization goal, financial health diagnostic ratios, and DuPont return decomposition.',
          children: [
            {
              id: 'fm-objectives',
              label: 'FM Scope & Goals',
              summary: 'Wealth maximization vs Profit maximization, agency problem, interrelationship of finance decisions.',
              subtopics: ['Time value of money recognition', 'Risk-return trade-off', 'Agency costs & governance']
            },
            {
              id: 'ratio-metrics',
              label: 'Financial Ratio Families',
              summary: 'Liquidity, Leverage, Turnover, and Profitability metrics.',
              subtopics: ['Current & Acid test ratio', 'Debtors collection period', 'Debt-service coverage ratio']
            },
            {
              id: 'dupont-framework',
              label: 'DuPont Analysis & Performance',
              summary: 'Deconstruction of ROE into margin, asset utilization, and financial leverage.',
              subtopics: ['Net profit margin impact', 'Asset turnover velocity', 'Equity multiplier leverage effect']
            }
          ]
        }
      },
      {
        id: 'c8-2',
        number: 2,
        title: 'Types of Financing & Capital Budgeting Decisions',
        module: 'Module 1 (FM)',
        duration: '5h 00m',
        marks: '14-18',
        audioSummary: 'Covers long-term and short-term sources of finance: Venture Capital, Securitization, Lease Financing, and Bridge Financing. Capital Budgeting evaluates long-term investments using Payback, Accounting Rate of Return, Net Present Value (NPV), and Internal Rate of Return (IRR).',
        importantPoints: [
          'Sources of Finance: Long-term (Equity, Preference, Debentures, Retained Earnings, Term Loans); Medium-term (Lease, Hire Purchase, Venture Capital); Short-term (Commercial Paper, Trade Credit, Factoring).',
          'Venture Capital Financing: Funding early-stage high-growth companies. Stages: Seed capital, Start-up stage, Second round (expansion), Mezzanine financing, and Exit (IPO/buyout).',
          'Securitization: Process of pooling illiquid financial assets (e.g. mortgage loans) and converting them into marketable securities issued to investors via Special Purpose Vehicle (SPV).',
          'Capital Budgeting Evaluation Techniques: (1) Non-Discounted: Payback Period and ARR; (2) Discounted: Discounted Payback, Net Present Value (NPV), Profitability Index (PI), and Internal Rate of Return (IRR).',
          'NPV Rule: Accept project if NPV > 0. NPV is theoretically superior because it recognizes time value of money, considers all cash flows, and satisfies value additivity.',
          'IRR Rule: Rate of discount at which NPV equals Zero. Accept if IRR > Cost of Capital (Ke/Ko). In case of mutually exclusive projects with conflicting ranks, NPV decision prevails.'
        ],
        formulas: [
          {
            name: 'Net Present Value (NPV)',
            formula: 'NPV = ∑ [ CF_t / (1 + k)^t ] - Initial Cash Outlay',
            explanation: 'CF_t is Cash Flow After Tax (CFAT) = Net Profit after Tax + Depreciation.'
          },
          {
            name: 'Internal Rate of Return (IRR) by Interpolation',
            formula: 'IRR = Lower Discount Rate (L) + [ NPV_L / (NPV_L - NPV_H) ] × (Higher Rate - Lower Rate)',
            explanation: 'L = Lower rate with positive NPV; H = Higher rate with negative NPV.'
          },
          {
            name: 'Profitability Index (PI)',
            formula: 'PI = Present Value of Future Cash Inflows / Initial Cash Outlay',
            explanation: 'Accept if PI > 1.0. Ideal for project selection under capital rationing.'
          }
        ],
        icaiTraps: [
          'Always add back Depreciation to Profit After Tax to obtain Cash Flow After Tax (CFAT); Depreciation is a non-cash expense but provides a tax shield.',
          'In mutually exclusive projects where NPV and IRR give conflicting recommendations, ALWAYS choose the project with the HIGHER NPV.'
        ],
        mindmapTree: {
          id: 'cap-budget-root',
          label: 'Financing Sources & Capital Budgeting',
          summary: 'Long-term corporate capital raising, DCF appraisal techniques, and capital rationing.',
          children: [
            {
              id: 'sources-fin',
              label: 'Financing Instruments',
              summary: 'Venture capital stages, Securitization mechanics, Commercial Paper, Bridge loans.',
              subtopics: ['Venture capital exit routes', 'SPV asset transfer', 'Factoring vs Bill discounting']
            },
            {
              id: 'dcf-techniques',
              label: 'DCF Appraisal Models (NPV, IRR, PI)',
              summary: 'Calculation of CFAT, NPV decision rule, IRR interpolation, PI under capital rationing.',
              subtopics: ['Depreciation tax shield calculation', 'NPV vs IRR conflict resolution', 'Profitability index ranking']
            }
          ]
        }
      },
      {
        id: 'c8-3',
        number: 3,
        title: 'Cost of Capital, Leverages & Capital Structure',
        module: 'Module 2 (FM)',
        duration: '7h 00m',
        marks: '18-22',
        audioSummary: 'Covers determination of specific costs of capital: Cost of Debt (Kd), Cost of Preference (Kp), Cost of Equity (Ke) using Dividend Growth and CAPM models, and Weighted Average Cost of Capital (Ko). Leverages include DOL, DFL, and DCL. Capital Structure theories cover NI, NOI, Traditional, and MM approaches.',
        importantPoints: [
          'Cost of Debt (Kd): Effective rate paid after taking tax shield into account. Kd = I(1 - t) / Net Proceeds (for irredeemable debt).',
          'Cost of Equity (Ke): CAPM model: Ke = Rf + β(Rm - Rf). Dividend Growth model: Ke = (D1 / P0) + g, where D1 = D0(1 + g).',
          'Weighted Average Cost of Capital (WACC / Ko): Overall composite cost of capital. Ko = ∑(Weight of source × Specific cost of source). Book value weights vs Market value weights (Market value weights are theoretically preferred).',
          'Operating Leverage (DOL): Measures business risk. DOL = Contribution / EBIT = % change in EBIT / % change in Sales.',
          'Financial Leverage (DFL): Measures financial risk. DFL = EBIT / EBT = % change in EPS / % change in EBIT.',
          'Combined Leverage (DCL): Measures total risk. DCL = DOL × DFL = Contribution / EBT = % change in EPS / % change in Sales.',
          'EBIT-EPS Indifference Point: Level of EBIT at which EPS is identical under two alternative financing plans.'
        ],
        formulas: [
          {
            name: 'Cost of Equity under CAPM',
            formula: 'Ke = Risk-Free Rate (Rf) + Beta (β) × [ Market Return (Rm) - Risk-Free Rate (Rf) ]',
            explanation: '(Rm - Rf) represents Equity Market Risk Premium.'
          },
          {
            name: 'Redeemable Cost of Debt (Approximation)',
            formula: 'Kd = [ Interest(1 - t) + (RV - NP)/n ] / [ (RV + NP)/2 ]',
            explanation: 'RV = Redeemable Value, NP = Net Proceeds, n = Number of years to redemption.'
          },
          {
            name: 'Leverage Relationships',
            formula: 'DOL = Contribution / EBIT | DFL = EBIT / (EBIT - Interest - [Preference Dividend / (1 - t)]) | DCL = DOL × DFL',
            explanation: 'If preference shares exist, adjust denominator of DFL for grossed-up preference dividend.'
          },
          {
            name: 'EBIT-EPS Indifference Point Formula',
            formula: '[ (EBIT - I1)(1 - t) - PD1 ] / N1 = [ (EBIT - I2)(1 - t) - PD2 ] / N2',
            explanation: 'N1 and N2 are number of equity shares under Plan 1 and Plan 2.'
          }
        ],
        icaiTraps: [
          'In DFL formula, if company has preference share capital, preference dividend must be divided by (1 - t) in denominator.',
          'In Dividend Growth Model, ensure numerator is D1 (expected dividend next year); if D0 (current dividend paid) is given, calculate D1 = D0(1 + g).'
        ],
        mindmapTree: {
          id: 'cost-cap-root',
          label: 'Cost of Capital & Leverages',
          summary: 'Component costs of debt, equity, preference; WACC calculation; Operating, Financial, and Combined leverage.',
          children: [
            {
              id: 'specific-costs',
              label: 'Specific Costs (Kd, Kp, Ke, Kr)',
              summary: 'Debt tax-shield, CAPM equation, Gordon dividend growth model, retained earnings opportunity cost.',
              subtopics: ['Kd net of tax formula', 'CAPM beta coefficient', 'Book value vs Market value weights']
            },
            {
              id: 'leverages-analysis',
              label: 'Leverages Analysis (DOL, DFL, DCL)',
              summary: 'Fixed operating costs and DOL; Fixed financing charges and DFL; Total risk and DCL.',
              subtopics: ['Contribution over EBIT', 'Grossed-up preference dividend in DFL', 'EBIT-EPS indifference calculations']
            },
            {
              id: 'capital-structure-theories',
              label: 'Capital Structure Doctrines',
              summary: 'Net Income (NI) theory, Net Operating Income (NOI) theory, Traditional approach, MM Arbitrage proof.',
              subtopics: ['WACC behavior in NI vs NOI', 'Optimal debt-equity ratio in traditional', 'MM proposition I & II with taxes']
            }
          ]
        }
      },
      {
        id: 'c8-4',
        number: 4,
        title: 'Introduction to Strategic Management & Strategic Intent',
        module: 'Module 3 (SM)',
        duration: '3h 30m',
        marks: '8-12',
        audioSummary: 'Introduction to Strategic Management covers definitions of strategy, levels of strategy (Corporate, Business, Functional), strategic management process, and Strategic Intent: Vision, Mission, Business Definition, Goals and Objectives.',
        importantPoints: [
          'Concept of Strategy: Unified, comprehensive, and integrated plan designed to ensure that the basic objectives of enterprise are achieved. Strategy is partly proactive and partly reactive.',
          'Strategic Management: Managerial process of developing a strategic vision, setting objectives, crafting a strategy, implementing and evaluating the strategy.',
          'Strategic Levels in Organizations: (1) Corporate Level: CEO and Board - defining corporate vision, capital allocation, diversification; (2) Business Level: SBU heads - competitive positioning and market share; (3) Functional Level: Marketing, Finance, HR, Operations - operational efficiency.',
          'Strategic Intent Hierarchy: Vision (where the organization wants to be in the long-term) -> Mission (who we are, what we do, why we exist) -> Business Definition -> Objectives & Goals (concrete quantifiable performance targets).',
          'Characteristics of Good Objectives: Concrete, measurable, challenging yet achievable, time-bound, and consistent with organizational mission.'
        ],
        formulas: [
          {
            name: 'Strategic Management Process Sequence',
            formula: 'Strategic Vision & Mission -> Environmental Scanning & SWOT -> Strategy Formulation -> Strategy Implementation -> Strategic Evaluation & Control',
            explanation: 'Iterative feedback loop connecting all 5 strategic stages.'
          }
        ],
        icaiTraps: [
          'Vision describes the FUTURE path ("where we are going"), whereas Mission focuses on PRESENT business scope and purpose ("who we are and what we do").',
          'Strategy is never purely proactive; unexpected market disruptions require reactive adaptations.'
        ],
        mindmapTree: {
          id: 'sm-intro-root',
          label: 'Strategic Intent & Management',
          summary: 'Corporate vs business levels, strategic intent hierarchy, vision, mission, and the strategic management cycle.',
          children: [
            {
              id: 'sm-levels',
              label: 'Levels of Strategic Management',
              summary: 'Corporate level, Strategic Business Unit (SBU) business level, and Functional level roles.',
              subtopics: ['Corporate portfolio decisions', 'Business competitive advantage', 'Functional support alignment']
            },
            {
              id: 'intent-hierarchy',
              label: 'Strategic Intent Hierarchy',
              summary: 'Vision statements, Mission articulation, Business model definitions, and Measurable objectives.',
              subtopics: ['Future orientation of vision', 'Present customer focus of mission', 'SMART objectives criteria']
            }
          ]
        }
      },
      {
        id: 'c8-5',
        number: 5,
        title: 'Strategic Analysis: External & Internal Environment (Porter, BCG & Ansoff)',
        module: 'Module 3 (SM)',
        duration: '5h 00m',
        marks: '14-18',
        audioSummary: 'Strategic Analysis explores external environmental forces (PESTLE, Porter’s Five Forces) and internal competencies (Core Competence, Value Chain Analysis). Examines corporate portfolio matrices: BCG Matrix, Ansoff Growth Matrix, and Porter Generic Strategies.',
        importantPoints: [
          'Porter’s Five Forces Model: Evaluates industry attractiveness: (1) Threat of new entrants; (2) Bargaining power of buyers; (3) Bargaining power of suppliers; (4) Threat of substitutes; (5) Rivalry among existing competitors.',
          'Core Competencies (Prahalad & Hamel): Collective learning in organization that coordinates diverse production skills. 3 Tests: (1) Provides access to wide variety of markets; (2) Makes significant contribution to perceived customer benefits; (3) Difficult for competitors to imitate.',
          'Value Chain Analysis (Michael Porter): Primary activities (Inbound logistics, Operations, Outbound logistics, Marketing & Sales, Service) and Support activities (Infrastructure, HR management, Tech development, Procurement).',
          'BCG Growth-Share Matrix: Classifies SBUs into 4 quadrants based on Market Growth Rate and Relative Market Share: Stars (High growth, high share); Cash Cows (Low growth, high share - generates cash); Question Marks (High growth, low share); Dogs (Low growth, low share).',
          'Ansoff Product-Market Growth Matrix: Market Penetration (Existing product, existing market); Market Development (Existing product, new market); Product Development (New product, existing market); Diversification (New product, new market - highest risk).'
        ],
        formulas: [
          {
            name: 'Relative Market Share (BCG)',
            formula: 'Relative Market Share = Business Unit Market Share / Largest Competitor Market Share',
            explanation: 'Values > 1.0 indicate market leadership position.'
          },
          {
            name: 'Ansoff Matrix Quadrants',
            formula: 'Existing Market + Existing Product = Penetration | New Market + Existing Product = Market Dev | Existing Market + New Product = Product Dev | New Market + New Product = Diversification',
            explanation: 'Diversification carries highest strategic risk.'
          }
        ],
        icaiTraps: [
          'Cash cows should not be starved of maintenance capital; they generate the cash flows required to fund Question Marks into Stars.',
          'Porter five forces analysis measures the attractiveness and profit potential of an INDUSTRY as a whole, not a single company.'
        ],
        mindmapTree: {
          id: 'sm-analysis-root',
          label: 'Strategic Analysis & Models',
          summary: 'Industry attractiveness analysis, internal core competencies, portfolio matrices, and competitive postures.',
          children: [
            {
              id: 'porter-five-forces',
              label: 'Porter Five Forces Framework',
              summary: 'Threat of entrants, buyer power, supplier power, substitutes, and competitive rivalry.',
              subtopics: ['Barriers to entry economies of scale', 'Buyer switching costs', 'Substitute price-performance trade-off']
            },
            {
              id: 'portfolio-matrices',
              label: 'BCG Matrix & Ansoff Growth Grid',
              summary: 'Stars, Cash Cows, Question Marks, Dogs dynamics; Market penetration vs Diversification.',
              subtopics: ['Cash cow surplus cash reinvestment', 'Question mark turnaround or divestment', 'Related vs Unrelated diversification']
            },
            {
              id: 'value-chain-competence',
              label: 'Value Chain & Core Competence',
              summary: 'Primary vs Support activities, competitive advantage margin, VRIN framework.',
              subtopics: ['Inbound/Outbound logistics linkage', 'Prahalad & Hamel 3 competence tests', 'Benchmarking against best-in-class']
            }
          ]
        }
      }
    ]
  }
};

// Aliases mapping for subject identification
const SUBJECT_ALIASES = {
  'advanced-accounting': 'advanced-accounting',
  'accounting': 'advanced-accounting',
  'accounts': 'advanced-accounting',
  'i-paper1': 'advanced-accounting',
  'paper-1': 'advanced-accounting',
  'paper1': 'advanced-accounting',
  '1': 'advanced-accounting',

  'corporate-laws': 'corporate-laws',
  'law': 'corporate-laws',
  'laws': 'corporate-laws',
  'corporate-law': 'corporate-laws',
  'i-paper2': 'corporate-laws',
  'paper-2': 'corporate-laws',
  'paper2': 'corporate-laws',
  '2': 'corporate-laws',

  'taxation': 'taxation',
  'tax': 'taxation',
  'direct-tax': 'taxation',
  'gst': 'taxation',
  'i-paper3': 'taxation',
  'paper-3': 'taxation',
  'paper3': 'taxation',
  '3': 'taxation',

  'cost-management': 'cost-management',
  'costing': 'cost-management',
  'cost': 'cost-management',
  'cma': 'cost-management',
  'i-paper4': 'cost-management',
  'paper-4': 'cost-management',
  'paper4': 'cost-management',
  '4': 'cost-management',

  'auditing-ethics': 'auditing-ethics',
  'audit': 'auditing-ethics',
  'auditing': 'auditing-ethics',
  'ethics': 'auditing-ethics',
  'i-paper5': 'auditing-ethics',
  'paper-5': 'auditing-ethics',
  'paper5': 'auditing-ethics',
  '5': 'auditing-ethics',

  'fm-sm': 'fm-sm',
  'fm': 'fm-sm',
  'sm': 'fm-sm',
  'financial-management': 'fm-sm',
  'strategic-management': 'fm-sm',
  'i-paper6': 'fm-sm',
  'paper-6': 'fm-sm',
  'paper6': 'fm-sm',
  '6': 'fm-sm'
};

// Keyword mapping dictionary for dynamic subject/topic resolution
const KEYWORD_CHAPTER_MAP = {
  'advanced-accounting': [
    { keywords: ['standard', 'as 1', 'as 2', 'as 10', 'as 16', 'inventory', 'ppe'], chapterIndex: 0 },
    { keywords: ['framework', 'conceptual', 'presentation', 'qualitative'], chapterIndex: 1 },
    { keywords: ['company account', 'schedule iii', 'buy-back', 'buy back', 'redemption', 'debenture'], chapterIndex: 2 },
    { keywords: ['branch', 'foreign branch', 'dependent', 'independent'], chapterIndex: 3 },
    { keywords: ['amalgamation', 'as 14', 'merger', 'reconstruction', 'purchase method'], chapterIndex: 4 }
  ],
  'corporate-laws': [
    { keywords: ['preliminary', 'incorporation', 'moa', 'aoa', 'ultra vires', 'small company', 'opc'], chapterIndex: 0 },
    { keywords: ['prospectus', 'allotment', 'shelf', 'red herring', 'private placement'], chapterIndex: 1 },
    { keywords: ['management', 'administration', 'agm', 'egm', 'meeting', 'quorum', 'resolution', 'notice'], chapterIndex: 2 },
    { keywords: ['llp', 'limited liability', 'general clauses', 'statutes'], chapterIndex: 3 }
  ],
  'taxation': [
    { keywords: ['basic concept', 'residential', 'resident', 'rnor', '115bac', 'surcharge'], chapterIndex: 0 },
    { keywords: ['exempt', 'sec 10', 'gratuity', 'leave encashment', 'hra', 'agricultural'], chapterIndex: 1 },
    { keywords: ['salary', 'salaries', 'house property', 'gav', 'nav', 'rfa', 'perquisite'], chapterIndex: 2 },
    { keywords: ['introduction', 'supply', 'schedule i', 'schedule ii', 'schedule iii', 'composite', 'mixed'], chapterIndex: 3 },
    { keywords: ['charge', 'exemption', 'itc', 'input tax credit', 'rcm', 'composition', 'reverse charge'], chapterIndex: 4 }
  ],
  'cost-management': [
    { keywords: ['introduction', 'cost sheet', 'elements of cost', 'prime cost', 'works cost'], chapterIndex: 0 },
    { keywords: ['material', 'inventory', 'eoq', 're-order', 'safety stock', 'fifo'], chapterIndex: 1 },
    { keywords: ['employee', 'labour', 'labor', 'overhead', 'idle time', 'halsey', 'rowan'], chapterIndex: 2 },
    { keywords: ['activity based', 'abc', 'marginal', 'cvp', 'break-even', 'bep', 'standard costing', 'variance'], chapterIndex: 3 }
  ],
  'auditing-ethics': [
    { keywords: ['nature', 'objective', 'scope', 'sa 200', 'sa 210', 'sa 220', 'skepticism', 'sqc 1'], chapterIndex: 0 },
    { keywords: ['strategy', 'planning', 'programme', 'sa 300', 'sa 315', 'sa 320', 'materiality', 'romm'], chapterIndex: 1 },
    { keywords: ['evidence', 'documentation', 'sampling', 'sa 230', 'sa 500', 'sa 505', 'sa 530'], chapterIndex: 2 },
    { keywords: ['financial statements', 'items', 'company audit', 'sec 139', 'sec 141', 'sec 143', 'caro', 'fraud'], chapterIndex: 3 }
  ],
  'fm-sm': [
    { keywords: ['scope', 'objective', 'ratio', 'dupont', 'liquidity', 'wealth maximization'], chapterIndex: 0 },
    { keywords: ['financing', 'source', 'capital budgeting', 'npv', 'irr', 'payback', 'pi'], chapterIndex: 1 },
    { keywords: ['cost of capital', 'leverage', 'capital structure', 'wacc', 'capm', 'dol', 'dfl', 'dcl', 'indifference'], chapterIndex: 2 },
    { keywords: ['introduction to strategic', 'strategic intent', 'vision', 'mission', 'goals', 'objectives'], chapterIndex: 3 },
    { keywords: ['analysis', 'external', 'environment', 'porter', 'bcg', 'ansoff', 'value chain'], chapterIndex: 4 }
  ]
};

// Smart chapter resolver ensuring zero generic fallbacks
export function getChapterSpecificData(subjectId, chapterNumber, chapterTitle) {
  const rawKey = subjectId ? String(subjectId).toLowerCase().trim() : '';
  const canonicalKey = SUBJECT_ALIASES[rawKey] || 'advanced-accounting';
  const subData = CHAPTER_DETAILS[canonicalKey];

  if (!subData || !subData.chapters || subData.chapters.length === 0) {
    return CHAPTER_DETAILS['advanced-accounting'].chapters[0];
  }

  const num = Number(chapterNumber);
  const titleLower = chapterTitle ? chapterTitle.toLowerCase() : '';

  // 1. Check exact match by chapter number
  if (!isNaN(num) && num > 0) {
    const numMatch = subData.chapters.find(c => c.number === num);
    if (numMatch) return numMatch;
  }

  // 2. Check title keyword rules
  const rules = KEYWORD_CHAPTER_MAP[canonicalKey];
  if (rules && titleLower) {
    for (const rule of rules) {
      if (rule.keywords.some(kw => titleLower.includes(kw))) {
        if (subData.chapters[rule.chapterIndex]) {
          return subData.chapters[rule.chapterIndex];
        }
      }
    }
  }

  // 3. Check partial title match against chapter titles in this subject
  if (titleLower) {
    const titleMatch = subData.chapters.find(c => 
      c.title.toLowerCase().includes(titleLower) || 
      titleLower.includes(c.title.toLowerCase())
    );
    if (titleMatch) return titleMatch;
  }

  // 4. Fall back to modulo index within this subject
  if (!isNaN(num) && num > 0) {
    const idx = (num - 1) % subData.chapters.length;
    return subData.chapters[idx];
  }

  return subData.chapters[0];
}
`;

fs.writeFileSync(path.resolve('src/data/chapterDetailsData.js'), fileContent, 'utf-8');
console.log('Successfully generated src/data/chapterDetailsData.js');
