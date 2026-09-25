// src/data/chapterDetailsData.js
// Authoritative, chapter-specific revision notes, statutory provisions, formulas, and mindmap drilldown nodes for CA subjects.

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
        id: 'c2',
        number: 2,
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
        id: 'c3-adv',
        number: 3,
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
        id: 'c3-3',
        number: 2,
        title: 'Management and Administration (Sections 88 to 122)',
        module: 'Module 2',
        duration: '5h 30m',
        marks: '15-20',
        audioSummary: 'Management and Administration covers Annual General Meetings under Section 96, Extraordinary General Meetings under Section 100, Quorum requirements under Section 103, and Ordinary vs Special Resolutions.',
        importantPoints: [
          'Annual General Meeting (AGM) [Sec 96]: Every company (other than OPC) must hold AGM every year. Gap between two AGMs cannot exceed 15 months. Must be held within 6 months from close of financial year.',
          'Notice of General Meeting [Sec 101]: Minimum 21 clear days notice in writing or electronic mode. Can be called at shorter notice if consent given by >= 95% of members entitled to vote.',
          'Quorum for Public Company [Sec 103]: 5 members personally present (if members <= 1000); 15 members (if members > 1000 but <= 5000); 30 members (if members > 5000). For Private Company: 2 members personally present.',
          'Ordinary Resolution (OR): Votes cast in favour exceed votes cast against. Special Resolution (SR) [Sec 114]: Votes cast in favour are at least 3 times the votes cast against (>= 75%).'
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
              summary: 'Timelines for holding AGM, extension by ROC, requisition of EGM by members.',
              subtopics: ['15 month gap rule', 'Extension max 3 months', 'Board default on EGM']
            },
            {
              id: 'meeting-rules',
              label: 'Quorum & Proxies (Sec 103, 105)',
              summary: 'Quorum thresholds for public/private companies, proxy appointment time limit (48 hours).',
              subtopics: ['Quorum default dissolution', 'Proxy max 50 members/10% capital', 'Postal ballot rules']
            }
          ]
        }
      },
      {
        id: 'c3-csr',
        number: 3,
        title: 'Corporate Social Responsibility (Section 135) & Dividend',
        module: 'Module 3',
        duration: '4h 00m',
        marks: '10-14',
        audioSummary: 'Section 135 governs CSR obligations for companies crossing Net Worth 500 Cr, Turnover 1000 Cr, or Net Profit 5 Cr. Companies must spend at least 2% of average net profits of preceding 3 financial years on Schedule VII activities.',
        importantPoints: [
          'CSR Applicability Threshold: Net Worth >= ₹500 Cr, OR Turnover >= ₹1,000 Cr, OR Net Profit >= ₹5 Cr during immediately preceding financial year.',
          'CSR Committee: Consists of 3 or more directors, with at least 1 independent director (if company not required to have independent director, 2 or more directors).',
          'CSR Spend Requirement: At least 2% of the average net profits of the company made during the 3 immediately preceding financial years.',
          'Treatment of Unspent CSR: (1) Ongoing Project: Transfer to Unspent CSR A/c in scheduled bank within 30 days of FY close, spend within 3 FYs, else transfer to Sch VII fund within 30 days. (2) Non-Ongoing: Transfer to Sch VII fund within 6 months of FY close.'
        ],
        formulas: [
          {
            name: 'Mandatory CSR Spend Calculation',
            formula: 'CSR Amount = 2% × [(Net Profit FY-1 + Net Profit FY-2 + Net Profit FY-3) / 3]',
            explanation: 'Net profit computed strictly as per Section 198, excluding dividend from other Indian companies and foreign branch profits.'
          },
          {
            name: 'Interim Dividend Source [Sec 123(3)]',
            formula: 'Maximum Interim Dividend Rate <= Average Rate of Dividend declared during immediately preceding 3 FYs',
            explanation: 'Applicable if company has incurred loss in current financial year up to end of quarter.'
          }
        ],
        icaiTraps: [
          'Activities undertaken in normal course of business do NOT qualify as CSR (e.g. sponsorship for brand promotion).',
          'Unspent CSR on ongoing projects must be transferred to a special bank account within 30 days, NOT 6 months.'
        ],
        mindmapTree: {
          id: 'csr-root',
          label: 'CSR & Dividend Distribution',
          summary: 'Statutory CSR rules, Committee mandates, Schedule VII activities, and dividend restrictions.',
          children: [
            {
              id: 'csr-framework',
              label: 'Section 135 CSR Framework',
              summary: 'Applicability tests, 2% calculation u/s 198, treatment of ongoing vs non-ongoing unspent funds.',
              subtopics: ['Net profit 5 Cr trigger', 'Unspent CSR account 30 days rule', 'Set-off of excess CSR spend max 3 years']
            },
            {
              id: 'div-regulations',
              label: 'Dividend Rules (Sec 123-127)',
              summary: 'Sources of dividend, transfer to unpaid dividend account within 7 days, IEPF after 7 years.',
              subtopics: ['Depreciation requirement', 'Free reserves rule for dividend on loss', 'Interest on delayed dividend 18% p.a.']
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
    subjectTitle: 'Taxation (Income Tax + GST)',
    code: 'Paper 3',
    chapters: [
      {
        id: 'c4',
        number: 1,
        title: 'Basic Concepts & Residential Status (Sec 1 to 9)',
        module: 'Module 1 (Income Tax)',
        duration: '5h 00m',
        marks: '8-12',
        audioSummary: 'Residential status determines taxability of global vs Indian income. Section 6 defines conditions for Resident and Ordinarily Resident. Indian income is taxable for all; foreign income is taxable only for ROR unless derived from business controlled in India.',
        importantPoints: [
          'Basic Conditions for Resident [Sec 6(1)]: In India for >= 182 days in PY, OR >= 60 days in PY AND >= 365 days in 4 preceding PYs.',
          'Exceptions to 60-day rule: Indian citizen leaving India for employment abroad, or crew member of Indian ship, or Indian citizen/PIO visiting India (period is 182 days; relaxed to 120 days if total Indian income > ₹15 Lakhs).',
          'Deemed Resident [Sec 6(1A)]: Indian citizen with total income > ₹15 Lakhs (other than foreign sources) deemed resident if not liable to tax in any other country. Deemed resident is always RNOR.',
          'Scope of Total Income [Sec 5]: ROR taxed on global income; RNOR taxed on Indian income + foreign business income controlled from India; NR taxed ONLY on Indian income.'
        ],
        formulas: [
          {
            name: 'Section 115BAC Default Tax Slabs (New Regime AY 2024-25/25-26)',
            formula: '₹0-3L: Nil | ₹3-6L: 5% | ₹6-9L: 10% | ₹9-12L: 15% | ₹12-15L: 20% | Above ₹15L: 30%',
            explanation: 'Rebate u/s 87A available up to ₹25,000 if taxable income <= ₹7,00,000 (effectively zero tax up to ₹7 Lakhs, plus standard deduction of ₹75,000).'
          },
          {
            name: 'Health & Education Cess',
            formula: 'Total Tax Payable = (Tax on Total Income - Rebate 87A + Surcharge) × 1.04',
            explanation: '4% Cess is levied on cumulative tax plus surcharge.'
          }
        ],
        icaiTraps: [
          'Gift received by non-resident from Indian resident is deemed to accrue or arise in India u/s 9(1)(viii).',
          'Income from agricultural land in Pakistan or foreign country is treated as foreign income taxable for ROR under Other Sources, NOT exempt u/s 10(1).'
        ],
        mindmapTree: {
          id: 'tax-basics-root',
          label: 'Direct Tax Scope & Residence',
          summary: 'Jurisdictional taxability based on physical presence, nationality, and source of income.',
          children: [
            {
              id: 'res-status',
              label: 'Residential Status (Sec 6)',
              summary: '182 days test, 60 + 365 days test, RNOR conditions, Deemed Resident u/s 6(1A).',
              subtopics: ['Employment abroad 182 days', '120 days rule for visits', 'Deemed resident always RNOR']
            },
            {
              id: 'scope-income',
              label: 'Scope of Income (Sec 5 & 9)',
              summary: 'Income received vs deemed to be received, income accruing or arising in India.',
              subtopics: ['Salary earned in India', 'Royalty & FTS paid by resident', 'Global taxation for ROR']
            }
          ]
        }
      },
      {
        id: 'c4-3',
        number: 2,
        title: 'Profits & Gains of Business or Profession (PGBP - Sec 28 to 44DB)',
        module: 'Module 2 (Income Tax)',
        duration: '7h 00m',
        marks: '15-20',
        audioSummary: 'PGBP is the highest scoring section. Key concepts include Depreciation on block of assets under Section 32, Additional Depreciation, Scientific research deductions under Section 35, and Disallowances under Section 40 and 40A.',
        importantPoints: [
          'Depreciation [Sec 32]: Allowed on Block of Assets on WDV basis. Plant & Machinery (15%), Computers (40%), Buildings (10%). Half-rate depreciation applies if asset put to use for < 180 days in the year of acquisition.',
          'Additional Depreciation [Sec 32(1)(iia)]: 20% on new plant and machinery acquired by manufacturing units. Balance 10% allowed in subsequent year if put to use < 180 days.',
          'Section 40(a)(ia): 30% of expenditure disallowed if TDS not deducted or not paid before due date of filing return u/s 139(1).',
          'Section 40A(3): 100% disallowed if payment exceeding ₹10,000 made to a person in a single day otherwise than by account payee cheque/draft/ECS (Limit ₹35,000 for transport operators).',
          'Presumptive Taxation: Sec 44AD (8% / 6% of turnover up to ₹2 Cr / ₹3 Cr); Sec 44ADA for professionals (50% of gross receipts up to ₹50L / ₹75L).'
        ],
        formulas: [
          {
            name: 'Closing WDV of Block of Assets [Sec 43(6)]',
            formula: 'Closing WDV = Opening WDV + Actual Cost of Additions during PY - Net Sale Proceeds of Assets Sold during PY',
            explanation: 'If closing value is negative or block ceases to exist, short-term capital gain/loss arises u/s 50. No depreciation is allowed in that case.'
          },
          {
            name: 'Presumptive Income u/s 44AD',
            formula: 'Presumptive Profits = (Non-digital Turnover × 8%) + (Digital/Bank Turnover × 6%)',
            explanation: 'Threshold increased to ₹3 Crores if aggregate cash receipts <= 5% of total turnover.'
          }
        ],
        icaiTraps: [
          'If asset put to use < 180 days in year of acquisition, apply 50% of normal depreciation rate.',
          'Cash payment of ₹10,000 for purchase of capital asset is not added to actual cost under Section 43(1).'
        ],
        mindmapTree: {
          id: 'pgbp-root',
          label: 'Business Profits (PGBP)',
          summary: 'Revenue vs capital business deductions, block of assets, disallowances, and presumptive taxation.',
          children: [
            {
              id: 'depreciation-sec32',
              label: 'Depreciation & Block of Assets',
              summary: 'WDV calculation, 180 days rule, additional depreciation 20%, Sec 50 STCG on block.',
              subtopics: ['Opening WDV + Additions - Sales', 'Half rate rule', 'Actual cost u/s 43(1)']
            },
            {
              id: 'disallowances-pgbp',
              label: 'Statutory Disallowances',
              summary: 'Sec 40(a)(ia) 30% TDS default, Sec 40A(3) cash > 10K, Sec 43B statutory dues paid before ITR.',
              subtopics: ['43B actual payment rule', 'Related party excess payment 40A(2)', 'Income tax & CSR disallowed']
            }
          ]
        }
      },
      {
        id: 'c5',
        number: 3,
        title: 'GST: Supply, Charge & Input Tax Credit (Sec 7 to 21)',
        module: 'Module 3 (GST)',
        duration: '6h 30m',
        marks: '20-25',
        audioSummary: 'GST is levied on supply of goods or services. Section 7 defines supply, Section 9 levies CGST/SGST, Section 10 offers composition scheme, and Section 16 to 17(5) specify Input Tax Credit eligibility and blocked credits.',
        importantPoints: [
          'Supply [Sec 7(1)]: All forms of supply of goods/services for consideration in course of business. Schedule I lists supplies WITHOUT consideration (e.g. permanent transfer of business assets on which ITC availed, supply between related/distinct persons).',
          'Composite Supply [Sec 8(a)]: Comprises two or more naturally bundled supplies, one being a principal supply. Taxed at the rate applicable to principal supply.',
          'Mixed Supply [Sec 8(b)]: Two or more individual supplies bundled for single price not naturally bundled. Taxed at highest rate among them.',
          'Input Tax Credit (ITC) [Sec 16]: Possession of tax invoice, receipt of goods/services, tax actually paid to government, return filed u/s 39. Payment to supplier must be made within 180 days, else ITC reversed with interest.',
          'Blocked Credits [Sec 17(5)]: Motor vehicles for seating capacity <= 13 persons (unless used for further supply, passenger transport, or driving school); Food and beverages, outdoor catering, health services; Goods lost, stolen, destroyed, written off, or disposed of as free gifts.'
        ],
        formulas: [
          {
            name: 'Manner of Utilization of Input Tax Credit (Rule 88A)',
            formula: 'IGST credit -> First set off against IGST liability, then CGST/SGST in any proportion. CGST credit -> First against CGST, then IGST. SGST credit -> First against SGST, then IGST. (CGST and SGST can NEVER cross-utilize).',
            explanation: 'IGST credit must be completely exhausted before utilizing CGST or SGST credits.'
          },
          {
            name: 'Composition Scheme Threshold (Sec 10)',
            formula: 'Turnover in Preceding FY <= ₹1.5 Crores (₹75 Lakhs for Special Category States)',
            explanation: 'Tax rate: 1% of turnover (Manufacturers/Traders), 5% (Restaurants). Cannot collect tax or claim ITC.'
          }
        ],
        icaiTraps: [
          'Motor vehicles with seating capacity > 13 persons are NOT blocked under Sec 17(5). ITC is fully available.',
          'If recipient fails to pay supplier invoice value within 180 days, ITC must be reversed along with interest u/s 50.'
        ],
        mindmapTree: {
          id: 'gst-root',
          label: 'GST Architecture & ITC',
          summary: 'Taxable event of supply, reverse charge, composition levy, and Input Tax Credit mechanism.',
          children: [
            {
              id: 'gst-supply',
              label: 'Scope of Supply (Sec 7, Sch I, II, III)',
              summary: 'Consideration + business test, Sch I deemed supply, Sch III negative list (neither goods nor services).',
              subtopics: ['Related person transactions', 'Composite vs Mixed supply', 'Employee salary in Sch III']
            },
            {
              id: 'gst-itc',
              label: 'Input Tax Credit (Sec 16, 17)',
              summary: '4 golden conditions for ITC, 180 days payment rule, Sec 17(5) blocked credits catalogue.',
              subtopics: ['Rule 88A utilization order', 'Blocked motor vehicles <= 13 seats', 'Free samples credit reversal']
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
        id: 'c6-2',
        number: 1,
        title: 'Material Costing & Inventory Control',
        module: 'Module 1',
        duration: '4h 30m',
        marks: '10-15',
        audioSummary: 'Material Costing focuses on Economic Order Quantity (EOQ), re-order levels, inventory valuation methods like FIFO and Weighted Average, and inventory control techniques like ABC analysis.',
        importantPoints: [
          'Economic Order Quantity (EOQ): The ordering quantity that minimizes total annual inventory holding and ordering costs. At EOQ, Annual Ordering Cost = Annual Carrying Cost.',
          'Re-order Level (ROL): Stock level at which fresh purchase order must be initiated to prevent stock-out.',
          'ABC Analysis: Classifies inventory based on annual consumption value. A-items: 10-20% items account for 70-80% value (strict control); B-items: moderate; C-items: 70-80% items account for 10-20% value (simple control).',
          'Treatment of Scrap & Defectives: Normal spoilage cost is absorbed by good units produced; Abnormal spoilage cost is transferred directly to Costing P&L.'
        ],
        formulas: [
          {
            name: 'Economic Order Quantity (EOQ)',
            formula: 'EOQ = sqrt((2 × A × O) / C)',
            explanation: 'A = Annual Demand in units; O = Cost of placing an order; C = Carrying cost per unit per annum (often given as % of purchase price).'
          },
          {
            name: 'Re-Order Level (ROL)',
            formula: 'ROL = Maximum Consumption × Maximum Lead Time',
            explanation: 'Alternative: ROL = Safety Stock + (Average Consumption × Average Lead Time).'
          },
          {
            name: 'Maximum Stock Level',
            formula: 'Maximum Level = ROL + ROQ - (Minimum Consumption × Minimum Lead Time)',
            explanation: 'Prevents over-stocking and working capital blockage.'
          },
          {
            name: 'Minimum Stock Level (Safety Stock)',
            formula: 'Minimum Level = ROL - (Average Consumption × Average Lead Time)',
            explanation: 'Buffer stock to absorb unexpected demand spikes or delivery delays.'
          },
          {
            name: 'Danger Level',
            formula: 'Danger Level = Average Consumption × Emergency Lead Time',
            explanation: 'Only urgent issues permitted at this level.'
          }
        ],
        icaiTraps: [
          'Carrying cost must be calculated on unit purchase price (net of trade discount and GST if ITC available).',
          'In EOQ discounts, compare Total Inventory Cost = Purchase Cost + Ordering Cost + Carrying Cost.'
        ],
        mindmapTree: {
          id: 'material-root',
          label: 'Material Control & Inventory',
          summary: 'Optimum purchase size, stock level safety buffers, valuation methods, and scrap accounting.',
          children: [
            {
              id: 'eoq-calc',
              label: 'EOQ & Order Optimization',
              summary: 'Formula sqrt(2AO/C), discount evaluation, total inventory cost curves.',
              subtopics: ['Trade discount comparison', 'Annual carrying cost = Q/2 * C', 'Ordering cost = A/Q * O']
            },
            {
              id: 'stock-levels',
              label: 'Stock Levels & Safety Buffers',
              summary: 'Re-order level, minimum level, maximum level, average stock level, danger level.',
              subtopics: ['Max lead time vs Avg lead time', 'Emergency lead time in danger level', 'Stock-out cost tradeoff']
            }
          ]
        }
      },
      {
        id: 'c6-3',
        number: 2,
        title: 'Employee Cost & Overhead Absorption',
        module: 'Module 2',
        duration: '5h 00m',
        marks: '12-16',
        audioSummary: 'This chapter deals with remuneration systems like Halsey and Rowan premium plans, labor turnover rates, and overhead distribution through primary and secondary apportionment, followed by under or over absorption analysis.',
        importantPoints: [
          'Halsey Premium Plan: Standard time fixed. Worker gets guaranteed wages for actual time + bonus of 50% of time saved.',
          'Rowan Premium Plan: Worker receives bonus proportioned as: (Time Saved / Standard Time) × Time Taken × Hourly Rate. Rowan pays higher bonus than Halsey when time saved < 50% of standard time.',
          'Overhead Apportionment: Primary distribution to all departments; Secondary distribution of service departments to production departments using Step-down or Simultaneous Equation method.',
          'Under/Over Absorption of Overheads: Difference between Absorbed Overheads (Actual Hours × Predetermined Rate) and Actual Overheads. Normal under-absorption goes to production units via supplementary rate; abnormal goes to Costing P&L.'
        ],
        formulas: [
          {
            name: 'Halsey 50% Premium Bonus Plan',
            formula: 'Total Earnings = (Time Taken × Rate) + [50% × (Standard Time - Time Taken) × Rate]',
            explanation: 'Guarantees time wages and provides 50% incentive on time saved.'
          },
          {
            name: 'Rowan Premium Bonus Plan',
            formula: 'Total Earnings = (Time Taken × Rate) + [(Time Saved / Standard Time) × Time Taken × Rate]',
            explanation: 'Incentive prevents reckless rushing as bonus percentage plateaus at 50% time saved.'
          },
          {
            name: 'Predetermined Overhead Absorption Rate',
            formula: 'Absorption Rate = Budgeted Overheads / Budgeted Base (e.g. Machine Hours or Direct Labor Hours)',
            explanation: 'Absorbed Overheads = Actual Base Units × Predetermined Overhead Rate.'
          },
          {
            name: 'Under / Over Absorption of Overheads',
            formula: 'Under/Over Absorption = Absorbed Overheads - Actual Overheads Incurred',
            explanation: 'If positive: Over-absorption (credit to P&L). If negative: Under-absorption (debit to P&L or supplementary rate).'
          }
        ],
        icaiTraps: [
          'Under Rowan plan, bonus is maximum when time taken is exactly 50% of standard time.',
          'Never compute overhead absorption using actual overheads divided by actual hours; predetermined rate is always based on budgeted figures.'
        ],
        mindmapTree: {
          id: 'labour-overhead-root',
          label: 'Labor & Overhead Allocation',
          summary: 'Incentive wage plans, labor turnover, overhead cost pools, and absorption variances.',
          children: [
            {
              id: 'wage-incentives',
              label: 'Remuneration & Bonus Plans',
              summary: 'Halsey vs Rowan comparison, effective hourly rate, normal vs abnormal idle time.',
              subtopics: ['Time saved = Std time - Actual time', 'Rowan bonus curve', 'Idle time to Costing P&L']
            },
            {
              id: 'overhead-apportionment',
              label: 'Overhead Distribution & Absorption',
              summary: 'Machine hour rate, secondary apportionment methods, supplementary rate for normal variance.',
              subtopics: ['Simultaneous equations method', 'Absorbed vs Actual overheads', 'Supplementary rate formula']
            }
          ]
        }
      },
      {
        id: 'c6-4',
        number: 3,
        title: 'Marginal Costing & CVP Analysis & Standard Costing',
        module: 'Module 3',
        duration: '6h 30m',
        marks: '20-25',
        audioSummary: 'Marginal Costing separates costs into Fixed and Variable. Key metrics include P/V ratio, Break-Even Point, and Margin of Safety. Standard Costing compares actuals with standards to compute Material and Labor Variances.',
        importantPoints: [
          'Marginal Cost Equation: Sales - Variable Cost = Contribution = Fixed Cost + Profit.',
          'P/V Ratio (Profit-Volume Ratio): Percentage of contribution to sales. Remains constant at all production volumes if selling price and variable cost per unit are constant.',
          'Break-Even Point (BEP): Level of sales where total revenue equals total cost (Profit = 0, Contribution = Fixed Cost).',
          'Margin of Safety (MOS): Excess of actual sales over break-even sales. High MOS indicates financial strength and resilience against demand drops.',
          'Standard Costing Variances: Material Cost Variance (MCV) = Standard Cost - Actual Cost = Material Price Variance (MPV) + Material Usage Variance (MUV).'
        ],
        formulas: [
          {
            name: 'Profit-Volume (P/V) Ratio',
            formula: 'P/V Ratio = (Contribution / Sales) × 100 = (Change in Profit / Change in Sales) × 100',
            explanation: 'Essential for computing profit at different output levels.'
          },
          {
            name: 'Break-Even Point (BEP)',
            formula: 'BEP (in units) = Fixed Cost / Contribution per unit | BEP (in Value ₹) = Fixed Cost / P/V Ratio',
            explanation: 'Sales required to cover all fixed costs.'
          },
          {
            name: 'Margin of Safety (MOS)',
            formula: 'MOS (in ₹) = Actual Sales - Break-Even Sales = Profit / P/V Ratio',
            explanation: 'MOS % = (Margin of Safety / Actual Sales) × 100.'
          },
          {
            name: 'Required Sales for Desired Profit',
            formula: 'Required Sales (₹) = (Fixed Cost + Desired Profit) / P/V Ratio',
            explanation: 'If tax rate given, Desired Profit before tax = Target PAT / (1 - Tax Rate).'
          },
          {
            name: 'Material Variances',
            formula: 'MCV = (SQ × SP) - (AQ × AP) | MPV = AQ × (SP - AP) | MUV = SP × (SQ - AQ)',
            explanation: 'Verification check: MCV = MPV + MUV.'
          },
          {
            name: 'Labor Variances',
            formula: 'LCV = (SH × SR) - (AH × AR) | LRV = AH × (SR - AR) | LEV = SR × (SH - AH)',
            explanation: 'Verification check: LCV = LRV + LEV (adjusted for Idle Time Variance if any).'
          }
        ],
        icaiTraps: [
          'In Marginal Costing, closing inventory is valued strictly at marginal cost, whereas in Absorption Costing it includes fixed factory overheads.',
          'Material Price Variance is calculated on Quantity Purchased if raw material inventory is maintained at standard cost.'
        ],
        mindmapTree: {
          id: 'marginal-std-root',
          label: 'Decision Making & Variance Analysis',
          summary: 'Cost-Volume-Profit analysis, operational decisions (Make/Buy), and standard costing variances.',
          children: [
            {
              id: 'cvp-analysis',
              label: 'CVP Analysis & Break-Even',
              summary: 'P/V ratio, break-even point in units/value, margin of safety, multi-product BEP.',
              subtopics: ['Composite P/V ratio for sales mix', 'MOS % = Profit/Contribution', 'Indifference point formula']
            },
            {
              id: 'variance-analysis',
              label: 'Standard Costing Variances',
              summary: 'Material price/usage/mix/yield variances, Labor rate/efficiency/idle time variances.',
              subtopics: ['Reconciliation of budgeted and actual profit', 'Usage variance split into Mix and Yield']
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
        marks: '10-15',
        audioSummary: 'SA 200 outlines the overall objectives of an independent auditor: to obtain reasonable assurance that financial statements are free from material misstatement and to issue an audit report. Auditors maintain professional skepticism throughout.',
        importantPoints: [
          'SA 200 Overall Objectives: Obtain reasonable assurance (high, but not absolute level of assurance) and report on financial statements in accordance with auditor findings.',
          'Inherent Limitations of an Audit: Arise from nature of financial reporting (estimates/judgments), nature of audit procedures (collusion/fraud may not be detected), and need to strike balance between benefit and cost within reasonable time.',
          'Professional Skepticism: An attitude that includes a questioning mind, being alert to conditions indicating possible misstatement due to error or fraud, and critical assessment of audit evidence.',
          'SA 210 Agreeing the Terms of Audit Engagements: Preconditions for an audit include acceptable financial reporting framework and management acknowledgment of responsibility. Engagement letter must be issued before commencement.'
        ],
        formulas: [
          {
            name: 'Audit Risk Model (SA 315 & SA 200)',
            formula: 'Audit Risk (AR) = Risk of Material Misstatement (RMM) × Detection Risk (DR)',
            explanation: 'RMM = Inherent Risk (IR) × Control Risk (CR). Auditor can only assess RMM; auditor controls Detection Risk through nature, timing, and extent of substantive procedures.'
          }
        ],
        icaiTraps: [
          'Reasonable assurance is NOT an absolute guarantee due to inherent limitations of an audit.',
          'Auditor cannot reduce detection risk to zero; sampling risk and non-sampling risk will always persist.'
        ],
        mindmapTree: {
          id: 'audit-nature-root',
          label: 'Audit Fundamentals & Standards',
          summary: 'Overall objectives, professional skepticism, preconditions, and risk modeling.',
          children: [
            {
              id: 'sa200-principles',
              label: 'SA 200 Core Principles',
              summary: 'Reasonable assurance, inherent limitations, professional judgment and skepticism.',
              subtopics: ['Questioning mind attitude', 'Management responsibility', 'Ethical requirements of integrity and independence']
            },
            {
              id: 'sa210-preconditions',
              label: 'Audit Engagement (SA 210)',
              summary: 'Preconditions for audit, recurring audit terms, limitations of scope before acceptance.',
              subtopics: ['Engagement letter contents', 'Unacceptable scope limitations', 'Change in terms of engagement']
            }
          ]
        }
      },
      {
        id: 'c7-3',
        number: 2,
        title: 'Audit Evidence, Documentation & Sampling (SA 230, 500, 505, 530)',
        module: 'Module 2',
        duration: '5h 30m',
        marks: '15-20',
        audioSummary: 'Audit documentation under SA 230 provides evidence that the audit was planned and performed in accordance with SAs. SA 500 requires sufficient appropriate audit evidence obtained through inspection, observation, inquiry, confirmation, and analytical procedures.',
        importantPoints: [
          'SA 230 Audit Documentation (Working Papers): Property of the auditor. Assembly of final audit file must be completed within 60 days after date of auditor report. Retention period is minimum 7 years from date of report.',
          'SA 500 Sufficient Appropriate Audit Evidence: Sufficiency measures quantity (affected by RMM and quality of evidence); Appropriateness measures quality (relevance and reliability). External evidence is more reliable than internal.',
          'SA 505 External Confirmations: Direct written response from confirming party. Positive confirmation request requires recipient to respond directly indicating agreement/disagreement; Negative confirmation requests response only if disagreeing.',
          'SA 520 Analytical Procedures: Evaluations of financial information through analysis of plausible relationships among financial and non-financial data.'
        ],
        formulas: [
          {
            name: 'Materiality Benchmark (SA 320)',
            formula: 'Performance Materiality = 50% to 75% of Overall Materiality Benchmark',
            explanation: 'Set to reduce to an appropriately low level the probability that aggregate uncorrected misstatements exceed overall materiality.'
          },
          {
            name: 'Sample Size Factors (SA 530)',
            formula: 'Sample Size varies directly with Assessment of RMM and Desired Level of Confidence; inversely with Tolerable Misstatement',
            explanation: 'Tolerable misstatement is the monetary amount set by auditor where auditor seeks reasonable assurance that actual misstatement does not exceed it.'
          }
        ],
        icaiTraps: [
          'Negative confirmation requests provide less persuasive audit evidence and can only be used as sole substantive procedure when 4 specific conditions of SA 505 are satisfied.',
          'Working papers belong to the auditor, not the client. Auditor has no obligation to share them with third parties or tax authorities unless legally mandated.'
        ],
        mindmapTree: {
          id: 'audit-evidence-root',
          label: 'Audit Execution & Evidence',
          summary: 'Working papers ownership, 7-year retention, external confirmations, sampling, and analytical review.',
          children: [
            {
              id: 'sa230-docs',
              label: 'Audit Documentation (SA 230)',
              summary: 'Assembly within 60 days, retention for 7 years, SQC 1 compliance, confidentiality.',
              subtopics: ['Experienced auditor test', 'Working paper ownership', 'Subsequent alterations']
            },
            {
              id: 'sa500-evidence',
              label: 'Gathering Evidence (SA 500, 505)',
              summary: 'Sufficiency (quantity) vs Appropriateness (quality), external confirmations, management refusal.',
              subtopics: ['Reliability hierarchy of evidence', 'Positive vs Negative confirmations', 'Alternative audit procedures']
            }
          ]
        }
      },
      {
        id: 'c7-4',
        number: 3,
        title: 'Company Audit (Sec 139 to 148) & Audit Reports (SA 700 series)',
        module: 'Module 2',
        duration: '6h 00m',
        marks: '20-25',
        audioSummary: 'Company Audit covers statutory auditor appointment under Section 139, disqualifications under Section 141, powers and duties under Section 143, and reporting opinions under SA 700, 705, and 706.',
        importantPoints: [
          'Appointment of Auditor [Sec 139]: First auditor appointed by Board within 30 days (or by members in EGM within 90 days); Subsequent auditor appointed at AGM for 5-year term. Rotation mandatory for listed companies (Individual: 1 term of 5 years; Audit Firm: 2 terms of 5 years, followed by 5 years cooling period).',
          'Disqualifications [Sec 141(3)]: Body corporate (other than LLP), officer/employee of company, partner/employee of officer, person holding securities > ₹1 Lakh face value (relative can hold up to ₹1L face value, grace period 60 days to correct excess), person indebted > ₹5 Lakhs, or giving guarantee > ₹1 Lakh.',
          'Reporting Fraud [Sec 143(12)]: If auditor has reason to believe fraud involving >= ₹1 Crore is committed by officers/employees, report to Central Government (Form ADT-4) within 60 days. If < ₹1 Crore, report to Audit Committee/Board within 2 days.',
          'SA 700 / 705 / 706 Opinions: Unmodified (clean); Qualified (material but NOT pervasive); Adverse (both material AND pervasive misstatements); Disclaimer of Opinion (unable to obtain evidence and effects are material AND pervasive).'
        ],
        formulas: [
          {
            name: 'Section 141 Ceiling on Audit Limit',
            formula: 'Maximum 20 Company Audits per Chartered Accountant (Individual partner)',
            explanation: 'Excludes: OPC, Dormant companies, Small companies, and Private companies having paid-up capital < ₹100 Crores.'
          },
          {
            name: 'Fraud Reporting Timeline [Sec 143(12)]',
            formula: 'Day 0: Discovery -> Within 2 Days: Send to Board/Audit Committee -> Board reply: Within 45 Days -> Within 15 Days of reply: Forward to Central Govt (ADT-4)',
            explanation: 'Total statutory timeline not to exceed 60 days from date of knowledge.'
          }
        ],
        icaiTraps: [
          'Relative face value limit of ₹1,00,000 applies ONLY to holding securities, NOT indebtedness. If relative is indebted for > ₹5 Lakhs, auditor is immediately disqualified with NO grace period.',
          'Emphasis of Matter paragraph (SA 706) is NOT a substitute for a modified opinion (Qualified/Adverse).'
        ],
        mindmapTree: {
          id: 'comp-audit-root',
          label: 'Company Audit & Reporting',
          summary: 'Appointment, rotation, Sec 141 disqualifications, Sec 143(12) fraud reporting, and audit opinions.',
          children: [
            {
              id: 'sec139-141',
              label: 'Appointment & Eligibility (Sec 139-141)',
              summary: 'First auditor appointment, 5-year tenure, rotation rules, disqualifications catalogue.',
              subtopics: ['Relative ₹1L face value 60 day grace', 'Indebtedness ₹5L disqualification', 'Ceiling limit of 20 audits']
            },
            {
              id: 'sa700-opinions',
              label: 'Audit Opinions (SA 700, 705, 706)',
              summary: 'Unmodified, Qualified, Adverse, Disclaimer of Opinion, Key Audit Matters (SA 701).',
              subtopics: ['Pervasive vs Non-pervasive impact', 'Emphasis of Matter vs Other Matter', 'Form ADT-4 fraud reporting']
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
        id: 'c8-3',
        number: 1,
        title: 'Cost of Capital, Leverages & Capital Structure',
        module: 'Module 2 (FM)',
        duration: '6h 00m',
        marks: '20-25',
        audioSummary: 'Financial Management evaluates capital costs and risk leverage. WACC represents the weighted average cost of equity, debt, and preference capital. Operating leverage measures business risk, financial leverage measures financial risk, and combined leverage reflects total risk.',
        importantPoints: [
          'Cost of Equity (Ke): Computed using Dividend Growth Model [Ke = (D1/P0) + g] or Capital Asset Pricing Model [Ke = Rf + Beta(Rm - Rf)].',
          'Cost of Debt (Kd): After-tax cost of debt [Kd = I(1 - t) / Net Proceeds]. For redeemable debt, use approximation or IRR method.',
          'Weighted Average Cost of Capital (WACC): Overall cost of capital calculated using Book Value weights or Market Value weights.',
          'Operating Leverage (DOL): Measures responsiveness of Operating Profit (EBIT) to changes in Sales. DOL = Contribution / EBIT.',
          'Financial Leverage (DFL): Measures responsiveness of EPS to changes in EBIT. DFL = EBIT / EBT.',
          'Capital Structure Theories: Net Income (NI) approach (capital structure matters); Net Operating Income (NOI) approach (overall cost and value unchanged); Modigliani-Miller (MM) hypothesis without taxes vs with taxes.'
        ],
        formulas: [
          {
            name: 'Cost of Equity using CAPM',
            formula: 'Ke = Rf + beta × (Rm - Rf)',
            explanation: 'Rf = Risk-Free Rate; beta = Systematic Risk coefficient; (Rm - Rf) = Equity Market Risk Premium.'
          },
          {
            name: 'Weighted Average Cost of Capital (WACC / Ko)',
            formula: 'Ko = (We × Ke) + (Wd × Kd) + (Wp × Kp) + (Wr × Kr)',
            explanation: 'Weights represent proportion of each source in total financing.'
          },
          {
            name: 'Degree of Operating Leverage (DOL)',
            formula: 'DOL = Contribution / EBIT = (% Change in EBIT) / (% Change in Sales)',
            explanation: 'High DOL indicates higher proportion of fixed operating costs.'
          },
          {
            name: 'Degree of Financial Leverage (DFL)',
            formula: 'DFL = EBIT / [EBIT - Interest - (Preference Dividend / (1 - Tax Rate))]',
            explanation: 'Measures financial risk from fixed financing costs.'
          },
          {
            name: 'Degree of Combined Leverage (DCL)',
            formula: 'DCL = DOL × DFL = Contribution / EBT = (% Change in EPS) / (% Change in Sales)',
            explanation: 'Reflects combined business and financial risk.'
          }
        ],
        icaiTraps: [
          'In computing DFL, preference dividend must ALWAYS be grossed up by (1 - Tax Rate).',
          'Market value weights can never be applied to Retained Earnings separately, as market price of share already incorporates retained earnings.'
        ],
        mindmapTree: {
          id: 'fm-leverage-root',
          label: 'Capital Cost & Risk Structure',
          summary: 'WACC valuation, component cost formulas, operating/financial risk leverage, and MM theory.',
          children: [
            {
              id: 'wacc-calc',
              label: 'Cost of Capital Components',
              summary: 'Ke via CAPM and Gordon model, after-tax Kd = I(1-t), preference capital, book vs market weights.',
              subtopics: ['Gordon growth formula Ke = D1/P0 + g', 'Market value weights priority', 'Flotation cost adjustments']
            },
            {
              id: 'leverages-analysis',
              label: 'Leverage & Risk Analysis',
              summary: 'Operating leverage (DOL), Financial leverage (DFL), Combined leverage (DCL), EBIT-EPS analysis.',
              subtopics: ['DOL = Contribution/EBIT', 'Preference dividend grossing up in DFL', 'Indifference point of financing']
            }
          ]
        }
      },
      {
        id: 'c8-capbud',
        number: 2,
        title: 'Capital Budgeting Decisions & Working Capital',
        module: 'Module 2 (FM)',
        duration: '5h 30m',
        marks: '15-20',
        audioSummary: 'Capital Budgeting evaluates long-term investment projects using DCF techniques like Net Present Value (NPV), Internal Rate of Return (IRR), and Profitability Index (PI). Working Capital management ensures liquidity across cash, inventory, and receivables.',
        importantPoints: [
          'Net Present Value (NPV): Present value of cash inflows minus present value of cash outflows discounted at cost of capital. Project accepted if NPV > 0. Highest NPV chosen in mutually exclusive projects.',
          'Internal Rate of Return (IRR): Discount rate at which NPV = 0. Project accepted if IRR > Cost of Capital (hurdle rate).',
          'Profitability Index (PI): PV of Cash Inflows / Initial Outlay. Best criterion under capital rationing.',
          'Operating Cycle: Period from purchase of raw materials to receipt of cash from debtors. Gross Operating Cycle = RM Storage + WIP Period + Finished Goods Storage + Debtors Collection. Net Operating Cycle = Gross Operating Cycle - Creditors Payment Period.'
        ],
        formulas: [
          {
            name: 'Net Present Value (NPV)',
            formula: 'NPV = Sum of [CFt / (1 + k)^t] - Initial Outflow',
            explanation: 'CFt is Cash Flow After Tax (CFAT) = (EBIT × (1 - Tax)) + Depreciation.'
          },
          {
            name: 'Internal Rate of Return (Interpolation Formula)',
            formula: 'IRR = L + [(NPV_L) / (NPV_L - NPV_H)] × (H - L)',
            explanation: 'L = Lower discount rate; H = Higher discount rate; NPV_L = Positive NPV at lower rate; NPV_H = Negative NPV at higher rate.'
          },
          {
            name: 'Profitability Index (PI)',
            formula: 'PI = (Present Value of Cash Inflows) / (Initial Cash Outlay)',
            explanation: 'Accept if PI > 1.0.'
          },
          {
            name: 'Net Operating Cycle (Working Capital Cycle)',
            formula: 'Net Operating Cycle = R + W + F + D - C',
            explanation: 'R: Raw material period; W: WIP conversion period; F: Finished goods period; D: Debtors collection period; C: Creditors deferral period.'
          }
        ],
        icaiTraps: [
          'Depreciation is a non-cash expense: always add it back to profit after tax to find Cash Flow After Tax (CFAT).',
          'In mutually exclusive projects with conflicting rankings between NPV and IRR, NPV always prevails because it maximizes shareholder wealth.'
        ],
        mindmapTree: {
          id: 'capbud-root',
          label: 'Capital Investment & Liquidity',
          summary: 'Long-term capital project appraisals, DCF metrics, and operating working capital cycle.',
          children: [
            {
              id: 'dcf-criteria',
              label: 'Project Appraisal Metrics',
              summary: 'NPV superiority, IRR interpolation, PI for capital rationing, Discounted Payback.',
              subtopics: ['CFAT = PAT + Depreciation', 'NPV vs IRR conflict resolution', 'Terminal cash flows and salvage value']
            },
            {
              id: 'working-capital-cycle',
              label: 'Working Capital Management',
              summary: 'Operating cycle estimation, Tandon committee lending norms, cash management models.',
              subtopics: ['Gross vs Net cycle', 'Debtors turnover and aging', 'Maximum permissible bank finance']
            }
          ]
        }
      },
      {
        id: 'c8-4',
        number: 3,
        title: 'Strategic Management: Analysis, Levels & Matrix Models',
        module: 'Module 3 (SM)',
        duration: '4h 30m',
        marks: '20-25',
        audioSummary: 'Strategic Management focuses on competitive advantage through Porter’s Five Forces, SWOT analysis, BCG Growth-Share Matrix, Ansoff Product-Market Matrix, and strategic implementation levels.',
        importantPoints: [
          'Porter’s Five Forces: (1) Threat of new entrants, (2) Bargaining power of buyers, (3) Bargaining power of suppliers, (4) Threat of substitutes, and (5) Rivalry among existing competitors.',
          'Porter’s Generic Strategies: Cost Leadership (broad market, lowest cost), Differentiation (broad market, unique product), Focus Cost Leadership (niche), and Focus Differentiation (niche).',
          'BCG Growth-Share Matrix: Stars (High growth, high market share - invest); Cash Cows (Low growth, high market share - milk for cash); Question Marks (High growth, low share - decide whether to build or harvest); Dogs (Low growth, low share - divest or liquidate).',
          'Ansoff Product-Market Matrix: Market Penetration (Existing product, Existing market); Market Development (Existing product, New market); Product Development (New product, Existing market); Diversification (New product, New market).'
        ],
        formulas: [
          {
            name: 'Strategic Fit & Core Competence Test (Prahalad & Hamel)',
            formula: 'Core Competency Criteria: (1) Value to customer, (2) Competitor differentiation (hard to imitate), (3) Extendibility to new markets',
            explanation: 'Forms the bedrock of sustainable competitive advantage.'
          }
        ],
        icaiTraps: [
          'Cash Cows should NOT be heavily invested in for market share expansion; their cash flows should fund Question Marks and Stars.',
          'Diversification carries the highest risk in the Ansoff matrix because both products and markets are unfamiliar.'
        ],
        mindmapTree: {
          id: 'sm-core-root',
          label: 'Strategic Frameworks & Matrix Models',
          summary: 'Environmental scanning, corporate strategies, competitive advantage, and portfolio matrices.',
          children: [
            {
              id: 'porter-models',
              label: 'Porter’s Five Forces & Generic Strategies',
              summary: 'Industry attractiveness analysis, cost leadership vs differentiation, stuck-in-the-middle trap.',
              subtopics: ['Threat of new entrants barriers', 'Switching costs', 'Focus strategy for niche markets']
            },
            {
              id: 'portfolio-matrices',
              label: 'Portfolio Matrices (BCG & Ansoff)',
              summary: 'BCG matrix quadrants (Stars, Cows, Question marks, Dogs) and Ansoff growth strategies.',
              subtopics: ['Cash cows fund question marks', 'Market penetration vs development', 'Related vs Unrelated diversification']
            }
          ]
        }
      }
    ]
  }
};

// Fallback helper to provide specific rich details for any chapter
export function getChapterSpecificData(subjectId, chapterNumber, chapterTitle) {
  const subjectKey = subjectId ? subjectId.toLowerCase() : '';
  const subData = CHAPTER_DETAILS[subjectKey];

  if (subData) {
    // Try to match by chapter number or partial title match
    const matched = subData.chapters.find(c => 
      c.number === Number(chapterNumber) || 
      (chapterTitle && c.title.toLowerCase().includes(chapterTitle.toLowerCase())) ||
      (chapterTitle && chapterTitle.toLowerCase().includes(c.title.toLowerCase()))
    );
    if (matched) return matched;

    // Return the closest chapter in this subject if exists
    if (subData.chapters.length > 0) {
      const idx = (Number(chapterNumber) - 1) % subData.chapters.length;
      return subData.chapters[idx >= 0 ? idx : 0];
    }
  }

  // Fallback enriched data for any other subject or foundation level
  return {
    id: `chap-${chapterNumber}`,
    number: chapterNumber || 1,
    title: chapterTitle || 'Core Concepts & Provisions',
    module: 'Core Module',
    duration: '4h 00m',
    marks: '12-16',
    audioSummary: `Chapter ${chapterNumber}: ${chapterTitle || 'Core Syllabus Topic'}. Focus on the statutory provisions, key mathematical formulas, and ICAI exam patterns for this topic.`,
    importantPoints: [
      `Statutory Framework: Thoroughly master the key legal definitions, applicable sections, and standard compliance thresholds for ${chapterTitle || 'this topic'}.`,
      'Procedural Rules: Review mandatory time limits, filing requirements, and statutory authority jurisdictions outlined by ICAI.',
      'Practical Case Applications: Pay close attention to exceptions and non-applicability clauses frequently tested in 4-6 mark scenario questions.',
      'Amendments & Recent Changes: Verify the latest legislative circulars and ICAI Board of Studies study bulletins applicable for your attempt.'
    ],
    formulas: [
      {
        name: 'Core Analytical / Quantitative Formula',
        formula: 'Standard Output / Input Ratio = (Actual Attributable Units) / (Standard Base Requirements)',
        explanation: 'Always verify statutory limits, deduct exemptions, and cross-check balancing figures.'
      }
    ],
    icaiTraps: [
      'Ensure statutory conditions are satisfied concurrently rather than alternatively unless the word "or" is explicitly used.',
      'Verify whether exemptions apply automatically or require prior declaration / filing of statutory forms.'
    ],
    mindmapTree: {
      id: `mm-${chapterNumber}`,
      label: chapterTitle || 'Core Syllabus Overview',
      summary: 'Structured hierarchical overview of concepts, statutory provisions, and numerical techniques.',
      children: [
        {
          id: `sub-1-${chapterNumber}`,
          label: 'Foundational Principles',
          summary: 'Core legal doctrines, definitions, and standard guidelines issued by ICAI.',
          subtopics: ['Scope and coverage', 'Essential preconditions', 'Jurisdiction and applicability']
        },
        {
          id: `sub-2-${chapterNumber}`,
          label: 'Operational Applications & Formulas',
          summary: 'Calculations, journal entries, procedural timeframes, and compliance checklists.',
          subtopics: ['Step-by-step methodology', 'Calculation shortcuts', 'Reporting disclosures']
        }
      ]
    }
  };
}
