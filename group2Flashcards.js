// group2Flashcards.js
// High-Yield CA Intermediate Group 2 Flashcards
// Covers: Cost & Management Accounting, Auditing & Ethics, FM & SM

export const group2Flashcards = [
  // ==========================================
  // COST & MANAGEMENT ACCOUNTING (cost-management)
  // ==========================================
  {
    id: "cost-ch1-material-eoq",
    subject_id: "cost-management",
    chapter: "Chapter 1: Material Cost",
    title: "What is Economic Order Quantity (EOQ) and what is its formula?",
    subtitle: "EOQ Definition & Formula",
    prompt: "Formula? Underlying assumptions? Trade-off?",
    section: "Material Control",
    points: [
      "1) EOQ is the size of the order that minimizes total inventory costs (Carrying Cost + Ordering Cost).",
      "2) Formula: EOQ = √((2 × A × O) / C), where A = Annual Demand (units), O = Ordering cost per order, C = Carrying cost per unit per annum.",
      "3) At EOQ: Total Annual Ordering Cost = Total Annual Carrying Cost.",
      "4) Key Assumptions: Demand is steady and known, Lead time is constant, Purchase price is fixed with no quantity discounts."
    ],
    memory_tip: "At EOQ, Ordering Cost EQUALS Carrying Cost; Formula: √(2AO/C)"
  },
  {
    id: "cost-ch1-reorder-levels",
    subject_id: "cost-management",
    chapter: "Chapter 1: Material Cost",
    title: "How do you calculate Re-order Level (ROL), Minimum Level, and Maximum Level?",
    subtitle: "Inventory Stock Levels",
    prompt: "Formulas for ROL, Min Level, Max Level, Average Stock?",
    section: "Inventory Control Levels",
    points: [
      "1) Re-order Level (ROL) = Maximum Consumption × Maximum Lead Time (or Safety Stock + (Normal Consumption × Normal Lead Time)).",
      "2) Minimum Stock Level = ROL - (Normal Consumption × Normal Lead Time).",
      "3) Maximum Stock Level = ROL + ROQ - (Minimum Consumption × Minimum Lead Time).",
      "4) Average Stock Level = Minimum Level + 1/2(ROQ) or (Minimum Level + Maximum Level) / 2."
    ],
    memory_tip: "ROL = Max × Max; Min = ROL - (Avg × Avg); Max = ROL + ROQ - (Min × Min)"
  },
  {
    id: "cost-ch2-labour-incentives",
    subject_id: "cost-management",
    chapter: "Chapter 2: Employee Cost & Direct Expenses",
    title: "What is the difference between Halsey Plan and Rowan Plan?",
    subtitle: "Incentive Wage Systems",
    prompt: "Formulas? Bonus fraction? Effect on higher efficiency?",
    section: "Labour Remuneration",
    points: [
      "1) Halsey Premium Plan (50%): Total Wages = (Time Taken × Rate) + 50% × (Time Saved × Rate).",
      "2) Rowan Scheme: Total Wages = (Time Taken × Rate) + [ (Time Saved / Time Allowed) × (Time Taken × Rate) ].",
      "3) Comparison: When time saved is LESS than 50% of time allowed, Rowan plan gives HIGHER bonus than Halsey.",
      "4) When time saved EQUALS 50%, both plans pay identical bonus. Above 50% time saved, Halsey gives higher bonus."
    ],
    memory_tip: "Rowan bonus fraction = (Saved/Allowed) × Time Wages; Halsey = 50% × Time Saved × Rate"
  },
  {
    id: "cost-ch3-overhead-absorption",
    subject_id: "cost-management",
    chapter: "Chapter 3: Overheads",
    title: "What causes Under-Absorption and Over-Absorption of Overheads and how is it treated?",
    subtitle: "Overhead Recovery Treatment",
    prompt: "Definitions? 3 Accounting Treatments in CA Exams?",
    section: "Overhead Accounting",
    points: [
      "1) Under-absorption occurs when Actual Overheads EXCEED Absorbed Overheads (under-recovered cost).",
      "2) Over-absorption occurs when Absorbed Overheads EXCEED Actual Overheads (over-recovered cost).",
      "3) Treatment 1 (Normal / Uncontrollable): Use a Supplementary Overhead Rate applied to Work-in-Progress, Finished Goods, and Cost of Sales.",
      "4) Treatment 2 (Abnormal / Idle Capacity): Transfer completely to Costing Profit & Loss Account.",
      "5) Treatment 3 (Small balances): Carry forward to next accounting period or write off directly to Cost of Sales."
    ],
    memory_tip: "Normal differences -> Supplementary Rate (WIP + FG + Cost of Sales); Abnormal -> Costing P&L"
  },
  {
    id: "cost-ch4-abc-costing",
    subject_id: "cost-management",
    chapter: "Chapter 4: Activity Based Costing (ABC)",
    title: "What are Cost Pools and Cost Drivers in Activity Based Costing?",
    subtitle: "ABC Fundamentals",
    prompt: "Definition of Cost Pool? Cost Driver types? Traditional vs ABC?",
    section: "Modern Costing Systems",
    points: [
      "1) Cost Pool: An aggregation of all costs incurred when performing a specific business activity or function (e.g., machine setup pool, material ordering pool).",
      "2) Cost Driver: A factor or variable that causes a change in the cost of an activity. Two types: Resource Cost Driver and Activity Cost Driver.",
      "3) Resource Cost Driver: Measures consumption of resources by activities (e.g., floor area for rent).",
      "4) Activity Cost Driver: Measures consumption of activities by cost objects (e.g., number of production runs for setup cost).",
      "5) Traditional costing overcosts high-volume simple products and undercosts low-volume complex products (Cost Distortion)."
    ],
    memory_tip: "Cost Pool = Activity bucket; Cost Driver = Trigger that causes activity cost to rise"
  },
  {
    id: "cost-ch5-marginal-costing",
    subject_id: "cost-management",
    chapter: "Chapter 5: Marginal Costing",
    title: "State the essential formulas for PV Ratio, Break-Even Point, and Margin of Safety.",
    subtitle: "CVP Analysis Core Formulas",
    prompt: "PV Ratio formulas? BEP in units & value? MOS formula & significance?",
    section: "Cost-Volume-Profit Analysis",
    points: [
      "1) Profit-Volume (PV) Ratio = (Contribution / Sales) × 100 = (Change in Profit / Change in Sales) × 100.",
      "2) Break-Even Point (Units) = Fixed Cost / Contribution per unit.",
      "3) Break-Even Point (Value) = Fixed Cost / PV Ratio.",
      "4) Margin of Safety (MOS) = Actual Sales - Break-Even Sales = Profit / PV Ratio.",
      "5) Profit = Margin of Safety Sales × PV Ratio."
    ],
    memory_tip: "Profit = MOS × PV Ratio; BEP Value = Fixed Cost / PV Ratio; Change in Profit / Change in Sales = PV Ratio"
  },
  {
    id: "cost-ch6-standard-costing",
    subject_id: "cost-management",
    chapter: "Chapter 6: Standard Costing",
    title: "What are the Material Price, Usage, and Cost Variances and their verification relationship?",
    subtitle: "Material Variance Formulas",
    prompt: "MPV, MUV, MCV formulas? Mathematical cross-check equation?",
    section: "Variance Analysis",
    points: [
      "1) Material Cost Variance (MCV) = (Standard Quantity × Standard Price) - (Actual Quantity × Actual Price).",
      "2) Material Price Variance (MPV) = Actual Quantity × (Standard Price - Actual Price).",
      "3) Material Usage Variance (MUV) = Standard Price × (Standard Quantity - Actual Quantity).",
      "4) Verification Golden Rule: MCV = MPV + MUV.",
      "5) Further Split: MUV splits into Material Mix Variance (MMV) and Material Yield Variance (MYV)."
    ],
    memory_tip: "MCV = MPV + MUV; Price checks rates (AQ × ΔP); Usage checks consumption (SP × ΔQ)"
  },
  {
    id: "cost-ch7-budgetary-control",
    subject_id: "cost-management",
    chapter: "Chapter 7: Budgets and Budgetary Control",
    title: "What is a Flexible Budget and how does it differ from a Fixed Budget?",
    subtitle: "Flexible vs Fixed Budgeting",
    prompt: "Definition? Segregation of Semi-Variable costs? When is it used?",
    section: "Budgeting Techniques",
    points: [
      "1) A Flexible Budget is designed to change in response to different levels of activity/capacity utilization.",
      "2) Fixed Budget assumes a single static activity level and does not adjust when actual production varies.",
      "3) Semi-Variable Cost segregation: Variable Cost per unit = (Difference in Total Cost) / (Difference in Output units).",
      "4) Fixed Cost Component = Total Semi-Variable Cost - (Variable Cost per unit × Units).",
      "5) Crucial exam rule: Variances can only be meaningfully computed by comparing Actual Performance with a Flexible Budget."
    ],
    memory_tip: "Flexible Budget dynamically flexes variable costs to actual volume achieved"
  },

  // ==========================================
  // AUDITING & ETHICS (auditing-ethics)
  // ==========================================
  {
    id: "audit-sa200-objectives",
    subject_id: "auditing-ethics",
    chapter: "Chapter 1: Nature, Objective and Scope of Audit",
    title: "What are the Overall Objectives of an Independent Auditor under SA 200?",
    subtitle: "SA 200 Core Mandate",
    prompt: "Two overarching objectives? Reasonable assurance definition? Inherent limitations?",
    section: "SA 200 Principles",
    points: [
      "1) Objective 1: Obtain reasonable assurance about whether the financial statements as a whole are free from material misstatement (fraud or error).",
      "2) Objective 2: Report on the financial statements and communicate as required by the SAs in accordance with the auditor's findings.",
      "3) Reasonable Assurance = High, but NOT absolute, level of assurance due to inherent limitations of audit.",
      "4) Inherent Limitations stem from: Nature of financial reporting (estimates/judgments), Nature of audit procedures, Time and cost balance."
    ],
    memory_tip: "SA 200 = High reasonable assurance (not guarantee) + Independent Reporting"
  },
  {
    id: "audit-sa210-engagement-terms",
    subject_id: "auditing-ethics",
    chapter: "Chapter 2: Audit Strategy, Planning and Programming",
    title: "What are the Preconditions for an Audit under SA 210?",
    subtitle: "SA 210 Preconditions",
    prompt: "What must auditor determine before accepting? Management responsibilities?",
    section: "SA 210 Engagement Terms",
    points: [
      "1) Determine whether the financial reporting framework to be applied in preparation of FS is acceptable.",
      "2) Obtain agreement of management that it acknowledges and understands its responsibility for preparation of FS in accordance with applicable FRF.",
      "3) Management responsibility for Internal Control necessary to enable FS free from material misstatement.",
      "4) Management responsibility to provide auditor with: Unrestricted access to all information, additional information requested, and unrestricted access to persons."
    ],
    memory_tip: "Preconditions = Acceptable FRF + Written acknowledgement of management responsibilities & unrestricted access"
  },
  {
    id: "audit-sa230-documentation",
    subject_id: "auditing-ethics",
    chapter: "Chapter 3: Audit Documentation and Audit Evidence",
    title: "What are the Retention Period and Ownership rules for Audit Documentation under SA 230 / SQC 1?",
    subtitle: "SA 230 Retention & Assembly",
    prompt: "Assembly deadline? Retention period? Property of whom?",
    section: "Audit Documentation",
    points: [
      "1) Assembly of Final Audit File: Completed within 60 days from the date of the auditor's report (SQC 1).",
      "2) Retention Period: Firm must retain engagement documentation for at least 7 years from the date of the auditor's report.",
      "3) Ownership: Working papers are the PROPERTY of the auditor. The auditor may, at his discretion, make portions available to the client.",
      "4) Working papers must provide sufficient and appropriate record of the basis for the audit report and evidence that audit was performed per SAs."
    ],
    memory_tip: "Assembly: 60 days; Retention: 7 years minimum; Ownership: Sole property of the Auditor"
  },
  {
    id: "audit-sa240-fraud-responsibilities",
    subject_id: "auditing-ethics",
    chapter: "Chapter 4: Risk Assessment and Internal Control",
    title: "What is the difference between Fraud and Error, and what are the two types of intentional misstatements under SA 240?",
    subtitle: "SA 240 Fraud in Audit",
    prompt: "Primary distinguishing factor? Two types of fraud relevant to auditor?",
    section: "Fraud Analysis",
    points: [
      "1) The distinguishing factor between fraud and error is whether the underlying action is INTENTIONAL or UNINTENTIONAL.",
      "2) Type 1: Misstatements resulting from Fraudulent Financial Reporting (e.g., manipulation, falsification, intentional misapplication of accounting principles).",
      "3) Type 2: Misstatements resulting from Misappropriation of Assets (e.g., stealing cash, embezzling receipts, causing entity to pay for goods not received).",
      "4) Primary responsibility for prevention and detection of fraud rests with TCWG (Those Charged with Governance) and Management."
    ],
    memory_tip: "Fraud = Intentional; Two types: Cooking the books (FFR) vs Stealing assets"
  },
  {
    id: "audit-sa500-evidence",
    subject_id: "auditing-ethics",
    chapter: "Chapter 5: Audit Evidence",
    title: "What constitutes 'Sufficient Appropriate Audit Evidence' (SAAE) under SA 500?",
    subtitle: "SA 500 SAAE Criteria",
    prompt: "Sufficiency vs Appropriateness? Relevance & Reliability factors?",
    section: "Audit Evidence Principles",
    points: [
      "1) Sufficiency = Measure of the QUANTITY of audit evidence (affected by assessment of risks of material misstatement and quality of evidence).",
      "2) Appropriateness = Measure of the QUALITY of audit evidence (its relevance and reliability in providing support for conclusions).",
      "3) Reliability Rules: External evidence is more reliable than internal evidence; Direct evidence obtained by auditor is more reliable than indirect/inferred.",
      "4) Written documentary evidence is more reliable than oral representations; Original documents are more reliable than photocopies/faxes."
    ],
    memory_tip: "Sufficiency = Quantity; Appropriateness = Quality (Relevance + Reliability)"
  },
  {
    id: "audit-sa700-opinion-types",
    subject_id: "auditing-ethics",
    chapter: "Chapter 6: Audit Report",
    title: "When does an auditor issue a Qualified Opinion, Adverse Opinion, or Disclaimer of Opinion?",
    subtitle: "SA 705 Modifications Matrix",
    prompt: "2x2 Decision Matrix: Material vs Pervasive?",
    section: "Auditor's Report",
    points: [
      "1) Unmodified Opinion: Financial statements are prepared, in all material respects, in accordance with applicable FRF.",
      "2) Qualified Opinion: Misstatement is MATERIAL BUT NOT PERVASIVE (or unable to obtain SAAE, but possible effects are material but not pervasive).",
      "3) Adverse Opinion: Having obtained SAAE, misstatements, individually or in aggregate, are BOTH MATERIAL AND PERVASIVE.",
      "4) Disclaimer of Opinion: Auditor is UNABLE TO OBTAIN SAAE and the possible undetected misstatements could be BOTH MATERIAL AND PERVASIVE."
    ],
    memory_tip: "Material only = Qualified; Material + Pervasive (Known) = Adverse; Material + Pervasive (Unknown SAAE) = Disclaimer"
  },
  {
    id: "audit-company-audit-141",
    subject_id: "auditing-ethics",
    chapter: "Chapter 7: Company Audit",
    title: "What are the major disqualifications for appointment as an auditor under Section 141(3) of Companies Act, 2013?",
    subtitle: "Section 141(3) Disqualifications",
    prompt: "Body corporate? Officer/employee? Partner indebtedness / security holding limit?",
    section: "Statutory Eligibility",
    points: [
      "1) A body corporate (other than LLP).",
      "2) An officer or employee of the company, or partner/employee of such officer/employee.",
      "3) A person who, or his relative/partner: Holds any security/interest in company/subsidiary/holding/associate (Relative can hold security up to face value ₹1,00,000).",
      "4) Indebted to company/subsidiary/holding in excess of ₹5,00,000.",
      "5) Given guarantee or provided security in connection with indebtedness of any third person exceeding ₹1,00,000.",
      "6) Person whose subsidiary or associate has business relationship, or person convicted of fraud by court within last 10 years."
    ],
    memory_tip: "Relative security: Max ₹1 Lakh face value; Indebtedness: Max ₹5 Lakhs; Guarantee: Max ₹1 Lakh"
  },

  // ==========================================
  // FINANCIAL MANAGEMENT & STRATEGIC MANAGEMENT (fm-sm)
  // ==========================================
  {
    id: "fm-ch1-wealth-maximization",
    subject_id: "fm-sm",
    chapter: "Chapter 1: Scope and Objectives of Financial Management",
    title: "Why is Wealth Maximization superior to Profit Maximization as the financial objective of a firm?",
    subtitle: "Wealth vs Profit Maximization",
    prompt: "Limitations of profit maximization? Time value of money? Risk factor?",
    section: "FM Foundations",
    points: [
      "1) Ambiguity: 'Profit' is vague (accounting profit, cash profit, short-term vs long-term profit).",
      "2) Time Value of Money: Profit maximization ignores the timing of cash inflows, treating current and distant inflows equally.",
      "3) Risk and Uncertainty: Profit maximization does not account for the risk profile of alternative investment streams.",
      "4) Wealth Maximization: Focuses on maximizing the Net Present Value (NPV) of future cash flows, maximizing market price per share (MPS).",
      "5) Takes into account both magnitude, timing, and risk of future cash flows."
    ],
    memory_tip: "Wealth Maximization considers Timing, Cash Flows, and Risk; Profit Maximization ignores TVM & Risk"
  },
  {
    id: "fm-ch2-ratios-dupont",
    subject_id: "fm-sm",
    chapter: "Chapter 2: Financial Analysis and Planning - Ratio Analysis",
    title: "What is DuPont Analysis and how does it decompose Return on Equity (ROE)?",
    subtitle: "DuPont 3-Point Model",
    prompt: "3 components of ROE? What does each component measure?",
    section: "Ratio Analysis",
    points: [
      "1) DuPont Analysis decomposes Return on Equity (ROE) into three distinct multiplicative drivers.",
      "2) Formula: ROE = Net Profit Margin × Asset Turnover Ratio × Financial Leverage Multiplier.",
      "3) Net Profit Margin = (Net Income / Sales) -> Measures operational profitability and expense control.",
      "4) Asset Turnover = (Sales / Total Assets) -> Measures asset utilization efficiency.",
      "5) Equity Multiplier = (Total Assets / Shareholders' Equity) -> Measures financial leverage and debt exposure."
    ],
    memory_tip: "ROE = Profitability (NPM) × Efficiency (Asset Turnover) × Leverage (Assets/Equity)"
  },
  {
    id: "fm-ch3-cost-of-capital-wacc",
    subject_id: "fm-sm",
    chapter: "Chapter 3: Cost of Capital",
    title: "How is Cost of Equity calculated under CAPM and how is WACC determined?",
    subtitle: "CAPM & WACC Formulas",
    prompt: "CAPM formula components? Market risk premium? Book value vs Market value weights?",
    section: "Cost of Capital",
    points: [
      "1) Capital Asset Pricing Model (CAPM): Ke = Rf + β × (Rm - Rf), where Rf = Risk-free rate, β = Beta coefficient (systematic risk), Rm = Market return, (Rm - Rf) = Equity Market Risk Premium.",
      "2) Cost of Debt (Post-Tax): Kd = Interest × (1 - Tax Rate) / Net Proceeds (or effective yield).",
      "3) Weighted Average Cost of Capital (WACC / Ko) = (We × Ke) + (Wd × Kd) + (Wp × Kp) + (Wr × Kr).",
      "4) Exam Preference: Market Value weights are preferred over Book Value weights because market values reflect current economic conditions."
    ],
    memory_tip: "Ke = Rf + β(Rm - Rf); WACC = Σ(Component Cost × Weight); Market weights > Book weights"
  },
  {
    id: "fm-ch4-leverage-analysis",
    subject_id: "fm-sm",
    chapter: "Chapter 4: Financing Decisions - Capital Structure",
    title: "What are Operating Leverage, Financial Leverage, and Combined Leverage?",
    subtitle: "Leverage Formulas & Meanings",
    prompt: "Degree of Operating, Financial & Combined Leverage formulas? What risk does each measure?",
    section: "Leverage Decisions",
    points: [
      "1) Degree of Operating Leverage (DOL) = Contribution / EBIT -> Measures business/operational risk arising from Fixed Operating Costs.",
      "2) Degree of Financial Leverage (DFL) = EBIT / EBT (or EBIT / [EBT - (Preference Dividend / (1-t))]) -> Measures financial risk arising from Fixed Financial Charges.",
      "3) Degree of Combined Leverage (DCL) = Contribution / EBT = DOL × DFL.",
      "4) High DOL + High DFL creates an extremely risky financial structure.",
      "5) Percentage change relation: %Δ EBIT = DOL × %Δ Sales; %Δ EPS = DFL × %Δ EBIT; %Δ EPS = DCL × %Δ Sales."
    ],
    memory_tip: "DOL = Contrib/EBIT; DFL = EBIT/EBT; DCL = Contrib/EBT = DOL × DFL"
  },
  {
    id: "fm-ch5-capital-budgeting-npv",
    subject_id: "fm-sm",
    chapter: "Chapter 5: Investment Decisions - Capital Budgeting",
    title: "Why is Net Present Value (NPV) theoretically superior to Internal Rate of Return (IRR)?",
    subtitle: "NPV vs IRR Comparison",
    prompt: "Reinvestment rate assumption? Mutually exclusive projects? Multiple IRRs?",
    section: "Capital Budgeting Evaluation",
    points: [
      "1) Reinvestment Rate: NPV assumes intermediate cash flows are reinvested at the Cost of Capital (realistic). IRR assumes reinvestment at the project's own IRR (unrealistic).",
      "2) Multiple / Imaginary IRRs: Non-conventional cash flows (cash flow sign changes more than once) can yield multiple IRRs. NPV always yields a unique decision.",
      "3) Mutually Exclusive Projects: IRR can favor smaller or front-loaded projects, whereas NPV directly measures the absolute addition to shareholder wealth.",
      "4) Value Additivity: NPV satisfies value additivity (NPV(A+B) = NPV(A) + NPV(B)). IRR does not.",
      "5) Decision Rule: If NPV and IRR conflict in mutually exclusive projects, ALWAYS choose the project with HIGHER NPV."
    ],
    memory_tip: "NPV reinvests at Cost of Capital; IRR assumes IRR reinvestment. In conflicts, ALWAYS follow NPV!"
  },
  {
    id: "sm-ch1-strategic-intent",
    subject_id: "fm-sm",
    chapter: "Chapter 6: Strategic Management Introduction & Intent",
    title: "What are the components of Strategic Intent: Vision, Mission, and Objectives?",
    subtitle: "Hierarchy of Strategic Intent",
    prompt: "Definitions of Vision vs Mission? SMART criteria for objectives?",
    section: "Strategic Intent",
    points: [
      "1) Vision: Blueprint of the organization's future position. Answers: 'What do we want to become? Where do we want to go?'.",
      "2) Mission: Enduring statement of purpose that distinguishes the firm from others. Answers: 'Who are we, what do we do, and why are we here?'.",
      "3) Goals & Objectives: Measurable end results the firm seeks to achieve over specified time horizons.",
      "4) Objectives must be SMART: Specific, Measurable, Achievable, Relevant, Time-bound.",
      "5) Business Definition: Explains customer groups, customer functions, and alternative technologies used."
    ],
    memory_tip: "Vision = Future Destination; Mission = Present Purpose & Identity; Objectives = SMART milestones"
  },
  {
    id: "sm-ch2-porter-five-forces",
    subject_id: "fm-sm",
    chapter: "Chapter 7: Strategic Analysis & External Environment",
    title: "What are Michael Porter's Five Forces that shape industry competition?",
    subtitle: "Porter's 5 Forces Model",
    prompt: "Identify the 5 forces? What determines the collective strength?",
    section: "Industry Analysis",
    points: [
      "1) Threat of New Entrants: Barred by economies of scale, capital requirements, switching costs, brand identity.",
      "2) Bargaining Power of Buyers: Higher when buyers purchase in bulk, products are undifferentiated, low switching costs.",
      "3) Bargaining Power of Suppliers: Higher when few suppliers dominate, products are differentiated, high switching costs.",
      "4) Threat of Substitute Products: Substitutes that offer better price-performance trade-off place a ceiling on industry prices.",
      "5) Rivalry among Existing Competitors: Driven by numerous/equally balanced competitors, slow industry growth, high exit barriers."
    ],
    memory_tip: "Porter's 5: Entrants, Buyers, Suppliers, Substitutes, and Internal Rivalry"
  },
  {
    id: "sm-ch3-bcg-matrix",
    subject_id: "fm-sm",
    chapter: "Chapter 8: Corporate & Business Level Strategy",
    title: "What are the four quadrants of the Boston Consulting Group (BCG) Growth-Share Matrix?",
    subtitle: "BCG Matrix Quadrants",
    prompt: "Two axes? Stars, Cash Cows, Question Marks, Dogs characteristics & strategies?",
    section: "Portfolio Analysis",
    points: [
      "1) Vertical Axis: Market Growth Rate (Industry attractiveness). Horizontal Axis: Relative Market Share (Competitive strength).",
      "2) Stars (High Growth, High Share): Require heavy investment to maintain dominance. Strategy: Build / Hold.",
      "3) Cash Cows (Low Growth, High Share): Generate substantial excess cash with minimal investment. Strategy: Harvest / Hold; fund Stars and Question Marks.",
      "4) Question Marks / Problem Children (High Growth, Low Share): Require cash infusion to gain share or risk becoming Dogs. Strategy: Build or Divest.",
      "5) Dogs (Low Growth, Low Share): Low profits or cash traps. Strategy: Divest / Liquidate / Harvest."
    ],
    memory_tip: "Stars = High/High; Cash Cows = Low Growth/High Share; Question Marks = High Growth/Low Share; Dogs = Low/Low"
  },
  {
    id: "sm-ch4-ansoff-matrix",
    subject_id: "fm-sm",
    chapter: "Chapter 8: Corporate & Business Level Strategy",
    title: "What are the four growth options in Igor Ansoff's Product-Market Matrix?",
    subtitle: "Ansoff Growth Matrix",
    prompt: "Existing vs New Products / Markets? Risk comparison?",
    section: "Growth Strategies",
    points: [
      "1) Market Penetration (Existing Product, Existing Market): Increase market share via aggressive pricing, promotions, and distribution (Lowest risk).",
      "2) Market Development (Existing Product, New Market): Entering new geographical areas, demographic segments, or foreign markets.",
      "3) Product Development (New Product, Existing Market): Developing new products or features for current customers.",
      "4) Diversification (New Product, New Market): Entering completely unfamiliar territory. Two forms: Concentric/Related vs Conglomerate/Unrelated (Highest risk)."
    ],
    memory_tip: "Penetration (Exist/Exist), Market Dev (Exist/New), Product Dev (New/Exist), Diversification (New/New - Highest Risk)"
  }
];
