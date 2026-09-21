export const examsDB = [
  // --- FULL MOCK EXAMS (Grouped by Subject) ---
  {
    id: "taxation",
    title: "Taxation (Income Tax & GST) - Full Mock",
    description: "Direct and Indirect Tax provisions for CA Intermediate.",
    duration_sec: 10800, // 3 hours
    difficulty: "Advanced",
    question_count: 10,
    total_marks: 100,
    questions: [
      { id: "ft1", question: "What is the maximum limit of deduction under section 80C?", options: ["₹ 1,00,000", "₹ 1,50,000", "₹ 2,00,000", "₹ 50,000"], correct: 1, topic: "Chapter 6: Deductions", explanation: "The maximum deduction allowable under section 80C of the Income Tax Act is ₹ 1,50,000." },
      { id: "ft2", question: "GST is a __________ based tax.", options: ["Origin", "Destination", "Production", "Manufacturing"], correct: 1, topic: "Chapter 1 (GST): GST Basics", explanation: "GST is a destination-based consumption tax. The revenue accrues to the State where the goods or services are consumed." },
      { id: "ft3", question: "Residential status of an individual is determined for each:", options: ["Calendar Year", "Previous Year", "Assessment Year", "Accounting Year"], correct: 1, topic: "Chapter 2: Residential Status", explanation: "Residential status is always determined for the Previous Year in which the income is earned." },
      { id: "ft4", question: "Which of the following is not a head of income?", options: ["Income from Salaries", "Income from Capital Gains", "Income from Exports", "Income from Other Sources"], correct: 2, topic: "Chapter 3: Heads of Income", explanation: "There are 5 heads of income. Income from Exports is not a separate head, it falls under Profits and Gains from Business or Profession." },
      { id: "ft5", question: "Time limit for issuing a tax invoice for supply of services is:", options: ["30 days", "45 days", "60 days", "90 days"], correct: 0, topic: "Chapter 8 (GST): Invoicing", explanation: "A tax invoice must be issued within 30 days from the date of the supply of service." },
      { id: "ft6", question: "Loss from house property can be set off against salary income up to:", options: ["₹ 1,00,000", "₹ 1,50,000", "₹ 2,00,000", "No limit"], correct: 2, topic: "Chapter 4: House Property", explanation: "Loss under head House Property can be set off against any other head (including Salary) up to a maximum of ₹ 2,00,000 in a year." },
      { id: "ft7", question: "Which form is used for filing GST Annual Return by regular taxpayers?", options: ["GSTR-1", "GSTR-3B", "GSTR-9", "GSTR-4"], correct: 2, topic: "Chapter 9 (GST): Returns", explanation: "GSTR-9 is the annual return form for regular taxpayers." },
      { id: "ft8", question: "Standard deduction under section 16(ia) for salary income is:", options: ["₹ 40,000", "₹ 50,000", "₹ 30,000", "Nil"], correct: 1, topic: "Chapter 3: Salaries", explanation: "A standard deduction of ₹ 50,000 is allowed from Salary income." },
      { id: "ft9", question: "Long term capital gains on listed equity shares exceeding ₹ 1,00,000 are taxed at:", options: ["10%", "15%", "20%", "Exempt"], correct: 0, topic: "Chapter 5: Capital Gains", explanation: "LTCG on listed equity shares (STT paid) is taxed at 10% on the amount exceeding ₹ 1 Lakh under Section 112A." },
      { id: "ft10", question: "Input Tax Credit (ITC) is not available in respect of:", options: ["Raw materials", "Capital goods", "Motor vehicles for transportation of persons (seating capacity <= 13)", "Computers"], correct: 2, topic: "Chapter 6 (GST): ITC", explanation: "ITC is blocked under Section 17(5) for motor vehicles for transportation of persons having approved seating capacity of not more than 13 persons, subject to exceptions." }
    ]
  },
  {
    id: "auditing-ethics",
    title: "Auditing and Assurance - Full Mock",
    description: "Standards on Auditing, vouching, verification, and audit reports.",
    duration_sec: 10800,
    difficulty: "Advanced",
    question_count: 5,
    total_marks: 100,
    questions: [
      { id: "aud1", question: "Which Standard on Auditing deals with 'Objective and General Principles Governing an Audit of Financial Statements'?", options: ["SA 200", "SA 210", "SA 230", "SA 300"], correct: 0, topic: "Chapter 1: Standards on Auditing", explanation: "SA 200 deals with the overall objectives of the independent auditor and the conduct of an audit in accordance with SAs." },
      { id: "aud2", question: "Audit risk is a function of:", options: ["Inherent risk and control risk", "Risk of material misstatement and detection risk", "Control risk and detection risk", "Inherent risk and detection risk"], correct: 1, topic: "Chapter 3: Audit Risk", explanation: "Audit risk is a function of the risk of material misstatement (inherent & control risk) and detection risk." },
      { id: "aud3", question: "Who is responsible for the prevention and detection of fraud?", options: ["Auditor", "Management", "Shareholders", "Government"], correct: 1, topic: "Chapter 5: Fraud", explanation: "The primary responsibility for the prevention and detection of fraud rests with both those charged with governance of the entity and management." },
      { id: "aud4", question: "Audit working papers are the property of:", options: ["Client", "Management", "Auditor", "Shareholders"], correct: 2, topic: "Chapter 4: Audit Documentation", explanation: "As per SA 230, working papers are the property of the auditor." },
      { id: "aud5", question: "Which section of the Companies Act 2013 deals with appointment of auditors?", options: ["Section 139", "Section 141", "Section 143", "Section 148"], correct: 0, topic: "Chapter 10: Company Audit", explanation: "Section 139 of the Companies Act 2013 governs the appointment of auditors." }
    ]
  },
  {
    id: "advanced-accounting",
    title: "Advanced Accounting - Full Mock",
    description: "Company accounts, accounting standards, and financial statements.",
    duration_sec: 10800,
    difficulty: "Advanced",
    question_count: 5,
    total_marks: 100,
    questions: [
      { id: "aa1", question: "Which AS deals with Property, Plant and Equipment?", options: ["AS 2", "AS 9", "AS 10", "AS 19"], correct: 2, topic: "Chapter 1: Accounting Standards", explanation: "AS 10 deals with Property, Plant and Equipment." },
      { id: "aa2", question: "A contingent liability is:", options: ["Recognized in the balance sheet", "Disclosed in notes to accounts", "Ignored", "Deducted from profits"], correct: 1, topic: "Chapter 1: AS 29", explanation: "A contingent liability is a possible obligation that is disclosed in notes to accounts." },
      { id: "aa3", question: "Under the intrinsic value method, shares are valued based on:", options: ["Earnings capacity", "Dividend yield", "Net assets available to equity shareholders", "Market price"], correct: 2, topic: "Chapter 5: Company Accounts", explanation: "Intrinsic value method (Net Asset Method) values shares based on net assets available to equity shareholders." },
      { id: "aa4", question: "Buy-back of shares can be made out of:", options: ["Free reserves", "Securities premium account", "Proceeds of the issue of any shares or other specified securities", "All of the above"], correct: 3, topic: "Chapter 6: Buy Back", explanation: "Buy-back can be made out of free reserves, securities premium account, or proceeds of a fresh issue." },
      { id: "aa5", question: "Which form is used for preparation of Balance Sheet of a company?", options: ["Schedule III Part I", "Schedule III Part II", "Schedule II", "Schedule I"], correct: 0, topic: "Chapter 4: Financial Statements", explanation: "Schedule III Part I of the Companies Act 2013 provides the format for the Balance Sheet." }
    ]
  },
  {
    id: "corporate-laws",
    title: "Corporate & Other Laws - Full Mock",
    description: "Companies Act, LLP, and General Clauses Act.",
    duration_sec: 10800,
    difficulty: "Intermediate",
    question_count: 3,
    total_marks: 100,
    questions: [
      { id: "cl1", question: "Minimum number of members for a private company is:", options: ["1", "2", "7", "50"], correct: 1, topic: "Chapter 2: Incorporation", explanation: "A private company must have a minimum of 2 members (except for OPC)." },
      { id: "cl2", question: "A prospectus is to be issued within how many days of its registration with ROC?", options: ["30 days", "60 days", "90 days", "120 days"], correct: 2, topic: "Chapter 3: Prospectus", explanation: "A prospectus is valid for 90 days from the date of its registration with the ROC." },
      { id: "cl3", question: "The doctrine of ultra vires means:", options: ["Beyond the powers", "Within the powers", "Illegal acts", "Fraudulent acts"], correct: 0, topic: "Chapter 2: MOA/AOA", explanation: "Ultra vires translates to 'beyond the powers'." }
    ]
  },
  {
    id: "cost-management",
    title: "Cost & Management - Full Mock",
    description: "Material costing and overheads.",
    duration_sec: 10800,
    difficulty: "Advanced",
    question_count: 3,
    total_marks: 100,
    questions: [
      { id: "cm1", question: "EOQ stands for:", options: ["Equal Order Quantity", "Economic Order Quantity", "Extra Order Quantity", "None"], correct: 1, topic: "Chapter 2: Material Costing", explanation: "EOQ is Economic Order Quantity." },
      { id: "cm2", question: "Prime cost consists of:", options: ["Direct materials, labor & expenses", "Indirect materials", "Factory overheads", "Administrative overheads"], correct: 0, topic: "Chapter 1: Cost Sheet", explanation: "Prime cost = Direct Material + Direct Labor + Direct Expenses." },
      { id: "cm3", question: "Break-even point is where:", options: ["Profit is max", "Sales = Total Cost", "Loss is max", "None"], correct: 1, topic: "Chapter 14: CVP Analysis", explanation: "At BEP, total revenue equals total cost (No profit, no loss)." }
    ]
  },
  {
    id: "fm-sm",
    title: "FM & SM - Full Mock",
    description: "Financial management basics.",
    duration_sec: 10800,
    difficulty: "Advanced",
    question_count: 3,
    total_marks: 100,
    questions: [
      { id: "fm1", question: "Cost of Capital is:", options: ["Minimum rate of return expected by investors", "Maximum rate", "Zero", "Risk free rate"], correct: 0, topic: "Chapter 4 (FM): Cost of Capital", explanation: "It is the minimum required rate of return." },
      { id: "fm2", question: "Which is a capital budgeting technique?", options: ["NPV", "EOQ", "LIFO", "FIFO"], correct: 0, topic: "Chapter 7 (FM): Capital Budgeting", explanation: "Net Present Value (NPV) is a capital budgeting technique." },
      { id: "fm3", question: "Strategic Management involves:", options: ["Day to day operations", "Long term planning & strategy", "Auditing", "Tax filing"], correct: 1, topic: "Chapter 1 (SM): Intro", explanation: "SM deals with long term vision and strategy formulation." }
    ]
  },

  // --- CHAPTER-WISE MOCK EXAMS (Expanded & Bifurcated) ---
  {
    id: "mock-taxation-c4",
    title: "Chapter Mock: Basic Concepts & Residential Status (50 Marks)",
    description: "Comprehensive 50-Mark Chapter Mock bifurcated into Concept Theory, Applicability, and Residential Scope.",
    duration_sec: 3600, // 1 hour for 50 marks
    difficulty: "Advanced",
    question_count: 15, // 15 questions * ~3.33 marks = 50 marks (simulated)
    total_marks: 50,
    questions: [
      // Bifurcation 1: Concept Theory
      { id: "tc4-1", question: "What is the maximum amount of income not chargeable to tax for a resident individual aged 60 years or more but less than 80 years?", options: ["₹ 2,50,000", "₹ 3,00,000", "₹ 5,00,000", "₹ 2,00,000"], correct: 1, topic: "Concept Theory: Basic Exemptions", explanation: "For senior citizens (60-79 years), the basic exemption limit is ₹ 3,00,000." },
      { id: "tc4-5", question: "Surcharge on income-tax for an individual having total income exceeding ₹ 50 Lakhs but up to ₹ 1 Crore is:", options: ["10%", "15%", "25%", "37%"], correct: 0, topic: "Concept Theory: Surcharge Rates", explanation: "The surcharge rate is 10% when total income exceeds ₹ 50 Lakhs but does not exceed ₹ 1 Crore." },
      { id: "tc4-6", question: "Health and Education Cess is levied at the rate of:", options: ["2%", "3%", "4%", "5%"], correct: 2, topic: "Concept Theory: Cess", explanation: "Health and Education Cess is levied at 4% on the amount of income tax plus surcharge." },
      { id: "tc4-7", question: "Rebate under section 87A is available to a resident individual if total income does not exceed (New Tax Regime):", options: ["₹ 5,00,000", "₹ 7,00,000", "₹ 3,00,000", "₹ 2,50,000"], correct: 1, topic: "Concept Theory: Rebates", explanation: "Under the new tax regime (sec 115BAC), rebate u/s 87A is available up to a total income of ₹ 7,00,000." },
      { id: "tc4-8", question: "The term 'Person' under section 2(31) includes:", options: ["Individual and HUF", "Company and Firm", "AOP, BOI, Local Authority", "All of the above"], correct: 3, topic: "Concept Theory: Definitions", explanation: "Section 2(31) defines a 'Person' to include all the mentioned entities." },

      // Bifurcation 2: Residential Status Applicability
      { id: "tc4-2", question: "An Indian citizen leaving India for employment abroad is treated as a resident if they stay in India for at least:", options: ["60 days", "182 days", "120 days", "90 days"], correct: 1, topic: "Applicability: Employment Abroad", explanation: "For an Indian citizen leaving for employment abroad, the condition of 60 days is substituted with 182 days." },
      { id: "tc4-9", question: "To be 'Resident and Ordinarily Resident' (ROR), an individual must be a resident in at least how many out of 10 preceding previous years?", options: ["2 years", "3 years", "5 years", "7 years"], correct: 0, topic: "Applicability: Additional Conditions", explanation: "One of the additional conditions is being a resident in at least 2 out of the 10 preceding previous years." },
      { id: "tc4-10", question: "Deemed resident provisions (Section 6(1A)) apply to an Indian citizen if their total income (other than foreign sources) exceeds:", options: ["₹ 5 Lakhs", "₹ 10 Lakhs", "₹ 15 Lakhs", "₹ 20 Lakhs"], correct: 2, topic: "Applicability: Deemed Resident", explanation: "An Indian citizen is deemed a resident if total income from Indian sources exceeds ₹ 15 Lakhs and is not liable to tax in any other country." },
      { id: "tc4-11", question: "The residential status of a Company is based on:", options: ["Place of Effective Management (POEM)", "Place of incorporation", "Both A and B", "Location of its shareholders"], correct: 2, topic: "Applicability: Corporate Residency", explanation: "An Indian company is always resident. A foreign company is resident if its POEM in that year is in India." },
      { id: "tc4-12", question: "If the control and management of a HUF is situated wholly outside India, the HUF is:", options: ["Resident", "Non-Resident", "Resident but not ordinarily resident", "Deemed Resident"], correct: 1, topic: "Applicability: HUF Residency", explanation: "A HUF is non-resident only if its control and management are situated wholly outside India." },

      // Bifurcation 3: Scope of Total Income
      { id: "tc4-3", question: "Income accruing in London and received there is taxable in India in the case of:", options: ["Resident and ordinarily resident (ROR) only", "Both ROR and RNOR", "Non-resident", "None of the above"], correct: 0, topic: "Scope: Foreign Income", explanation: "Foreign income is taxable only in the hands of a Resident and Ordinarily Resident." },
      { id: "tc4-4", question: "Which of the following is considered 'Agricultural Income'?", options: ["Income from dairy farming", "Income from sale of seeds", "Rent received from land used for agricultural purposes", "Income from poultry farming"], correct: 2, topic: "Scope: Agricultural Exemptions", explanation: "Rent or revenue derived from land situated in India and used for agricultural purposes is agricultural income." },
      { id: "tc4-13", question: "Income deemed to accrue or arise in India under section 9 is taxable for:", options: ["Only ROR", "Only RNOR", "Only Non-Residents", "All assesses (ROR, RNOR, NR)"], correct: 3, topic: "Scope: Section 9", explanation: "Income deemed to accrue or arise in India is taxable for all categories of taxpayers." },
      { id: "tc4-14", question: "Past untaxed profits brought into India in the current year are:", options: ["Taxable for ROR", "Taxable for NR", "Not taxable for any category", "Taxable for RNOR"], correct: 2, topic: "Scope: Remittance", explanation: "Remittance of past untaxed profits to India is not treated as income of the current year." },
      { id: "tc4-15", question: "Pension received in India from a former employer situated abroad is:", options: ["Taxable for ROR only", "Taxable for ROR and RNOR", "Taxable for all (ROR, RNOR, NR)", "Exempt"], correct: 2, topic: "Scope: Received in India", explanation: "Any income 'received in India' is taxable for all categories (ROR, RNOR, and NR)." }
    ]
  },
  {
    id: "mock-advanced-accounting-c1",
    title: "Chapter Mock: Accounting Standards (50 Marks)",
    description: "Comprehensive 50-Mark Chapter Mock bifurcated into Inventory, Revenue, and PPE standards.",
    duration_sec: 3600,
    difficulty: "Advanced",
    question_count: 15,
    total_marks: 50,
    questions: [
      // Bifurcation 1: AS 2 (Inventories)
      { id: "ac1-1", question: "As per AS 2, inventories should be valued at:", options: ["Lower of historical cost and net realizable value", "Historical cost only", "Net realizable value only", "Standard cost"], correct: 0, topic: "AS 2: Inventory Valuation", explanation: "Inventories should be valued at the lower of cost and net realizable value." },
      { id: "ac1-6", question: "Which of the following is EXCLUDED from the cost of inventories under AS 2?", options: ["Storage costs necessary in the production process", "Abnormal amounts of wasted materials", "Direct labour", "Variable production overheads"], correct: 1, topic: "AS 2: Cost Components", explanation: "Abnormal amounts of wasted materials, labour, or other production costs are excluded from inventory cost." },
      { id: "ac1-7", question: "The cost formula used for inventories that are not ordinarily interchangeable is:", options: ["FIFO", "Weighted Average", "Specific Identification", "LIFO"], correct: 2, topic: "AS 2: Cost Formulas", explanation: "Specific identification of cost is used for items that are not ordinarily interchangeable." },
      { id: "ac1-8", question: "Fixed production overheads are allocated to the costs of conversion based on:", options: ["Actual capacity", "Normal capacity", "Maximum capacity", "Ideal capacity"], correct: 1, topic: "AS 2: Overheads Allocation", explanation: "Fixed production overheads are allocated based on the normal capacity of the production facilities." },
      { id: "ac1-9", question: "Net Realizable Value (NRV) means:", options: ["Estimated selling price less estimated costs of completion and costs necessary to make the sale", "Market value of the asset", "Replacement cost of the asset", "Historical cost minus depreciation"], correct: 0, topic: "AS 2: Definitions", explanation: "NRV is the estimated selling price in the ordinary course of business less estimated costs of completion and estimated costs necessary to make the sale." },

      // Bifurcation 2: AS 9 (Revenue Recognition)
      { id: "ac1-2", question: "Which Accounting Standard deals with Revenue Recognition?", options: ["AS 1", "AS 2", "AS 9", "AS 10"], correct: 2, topic: "AS 9: Basics", explanation: "AS 9 deals with Revenue Recognition." },
      { id: "ac1-10", question: "Under AS 9, revenue from the sale of goods is recognized when:", options: ["Cash is received", "Goods are produced", "Property in goods is transferred to the buyer for a price", "Order is received"], correct: 2, topic: "AS 9: Sale of Goods", explanation: "Revenue is recognized when the seller has transferred the property in the goods to the buyer for a price and all significant risks/rewards are transferred." },
      { id: "ac1-11", question: "Revenue from rendering of services is recognized by:", options: ["Completed service contract method only", "Proportionate completion method only", "Either proportionate completion method or completed service contract method", "Cash basis method"], correct: 2, topic: "AS 9: Services", explanation: "AS 9 permits both the proportionate completion method and the completed service contract method for services." },
      { id: "ac1-12", question: "Interest revenue is recognized on:", options: ["Time proportion basis", "Cash basis", "Dividend declaration date", "Maturity date"], correct: 0, topic: "AS 9: Interest", explanation: "Interest is recognized on a time proportion basis taking into account the amount outstanding and the rate applicable." },
      { id: "ac1-13", question: "If there is significant uncertainty regarding collectability of revenue at the time of raising a claim, revenue recognition is:", options: ["Recognized immediately", "Postponed", "Recognized at 50%", "Recorded as a capital reserve"], correct: 1, topic: "AS 9: Uncertainty", explanation: "Where the ability to assess the ultimate collection with reasonable certainty is lacking, revenue recognition is postponed." },

      // Bifurcation 3: AS 10 (PPE) & AS 11 / AS 29
      { id: "ac1-3", question: "As per AS 10 (Revised), spare parts which can be used only in connection with an item of PPE are accounted for as:", options: ["Inventory", "PPE", "Revenue Expense", "Deferred Expenditure"], correct: 1, topic: "AS 10: PPE", explanation: "Stand-by equipment and servicing equipment are recognized as PPE if they meet the definition." },
      { id: "ac1-4", question: "AS 11 deals with:", options: ["Accounting for Leases", "The Effects of Changes in Foreign Exchange Rates", "Employee Benefits", "Segment Reporting"], correct: 1, topic: "AS 11: Forex", explanation: "AS 11 covers The Effects of Changes in Foreign Exchange Rates." },
      { id: "ac1-5", question: "Contingent liabilities are:", options: ["Provided for in the books of account", "Ignored entirely", "Disclosed in the notes to the financial statements", "Deducted from net profit"], correct: 2, topic: "AS 29: Contingencies", explanation: "As per AS 29, contingent liabilities are not recognized but disclosed in notes to accounts." },
      { id: "ac1-14", question: "Initial recognition of Property, Plant and Equipment is measured at:", options: ["Fair Value", "Cost", "Net Realizable Value", "Present Value"], correct: 1, topic: "AS 10: Measurement", explanation: "An item of PPE that qualifies for recognition as an asset should initially be measured at its cost." },
      { id: "ac1-15", question: "A provision is recognized when:", options: ["An enterprise has a present obligation as a result of a past event", "It is probable that an outflow of resources will be required", "A reliable estimate can be made of the amount of the obligation", "All of the above"], correct: 3, topic: "AS 29: Provisions", explanation: "All three conditions must be met to recognize a provision under AS 29." }
    ]
  }
];
