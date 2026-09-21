export const icaiMaterialsDB = [
  // Advanced Accounting
  {
    id: "m1", subjectId: "advanced-accounting", module: "Module 1", chapter: "Chapter 1: Accounting Standards", type: "Study Material", url: "https://boslive.icai.org/", attempt: "September 2026", status: "Verified for Sep 2026", date: "2024-05-15"
  },
  {
    id: "m2", subjectId: "advanced-accounting", module: "Module 2", chapter: "Chapter 5: Company Accounts", type: "Study Material", url: "https://boslive.icai.org/", attempt: "September 2026", status: "Verified for Sep 2026", date: "2024-05-15"
  },
  {
    id: "mtp-1", subjectId: "advanced-accounting", module: "MTP", chapter: "Mock Test Paper - Series 1", type: "Mock Test Paper (MTP)", url: "https://boslive.icai.org/", attempt: "September 2026", status: "Verified for Sep 2026", date: "2024-06-10"
  },
  {
    id: "rtp-1", subjectId: "advanced-accounting", module: "RTP", chapter: "Revision Test Paper", type: "Revision Test Paper (RTP)", url: "https://boslive.icai.org/", attempt: "September 2026", status: "Verified for Sep 2026", date: "2024-06-15"
  },

  // Corporate Laws
  {
    id: "m3", subjectId: "corporate-laws", module: "Module 1", chapter: "Chapter 1: Preliminary", type: "Study Material", url: "https://boslive.icai.org/", attempt: "September 2026", status: "Verified for Sep 2026", date: "2024-05-15"
  },
  {
    id: "rtp-2", subjectId: "corporate-laws", module: "RTP", chapter: "Revision Test Paper", type: "Revision Test Paper (RTP)", url: "https://boslive.icai.org/", attempt: "September 2026", status: "Verified for Sep 2026", date: "2024-06-15"
  },

  // Taxation
  {
    id: "m4", subjectId: "taxation", module: "Module 1 (Income Tax)", chapter: "Chapter 1: Basic Concepts", type: "Study Material", url: "https://boslive.icai.org/", attempt: "September 2026", status: "Verified for Sep 2026", date: "2024-05-15"
  },
  {
    id: "m5", subjectId: "taxation", module: "Module 2 (GST)", chapter: "Chapter 1: GST in India - An Introduction", type: "Study Material", url: "https://boslive.icai.org/", attempt: "September 2026", status: "Verified for Sep 2026", date: "2024-05-15"
  },
  {
    id: "mtp-3", subjectId: "taxation", module: "MTP", chapter: "Mock Test Paper - Series 1", type: "Mock Test Paper (MTP)", url: "https://boslive.icai.org/", attempt: "September 2026", status: "Verified for Sep 2026", date: "2024-06-10"
  },
  {
    id: "rtp-3", subjectId: "taxation", module: "RTP", chapter: "Revision Test Paper (Income Tax & GST)", type: "Revision Test Paper (RTP)", url: "https://boslive.icai.org/", attempt: "September 2026", status: "Verified for Sep 2026", date: "2024-06-15"
  },

  // Cost Management
  {
    id: "m6", subjectId: "cost-management", module: "Module 1", chapter: "Chapter 1: Introduction to Cost and Management Accounting", type: "Study Material", url: "https://boslive.icai.org/", attempt: "September 2026", status: "Verified for Sep 2026", date: "2024-05-15"
  },
  {
    id: "mtp-4", subjectId: "cost-management", module: "MTP", chapter: "Mock Test Paper - Series 1", type: "Mock Test Paper (MTP)", url: "https://boslive.icai.org/", attempt: "September 2026", status: "Verified for Sep 2026", date: "2024-06-10"
  },

  // Auditing & Ethics
  {
    id: "m7", subjectId: "auditing-ethics", module: "Module 1", chapter: "Chapter 1: Nature, Objective and Scope of Audit", type: "Study Material", url: "https://boslive.icai.org/", attempt: "September 2026", status: "Verified for Sep 2026", date: "2024-05-15"
  },
  {
    id: "rtp-5", subjectId: "auditing-ethics", module: "RTP", chapter: "Revision Test Paper", type: "Revision Test Paper (RTP)", url: "https://boslive.icai.org/", attempt: "September 2026", status: "Verified for Sep 2026", date: "2024-06-15"
  },

  // FM-SM
  {
    id: "m8", subjectId: "fm-sm", module: "Module 1 (FM)", chapter: "Chapter 1: Scope and Objectives of Financial Management", type: "Study Material", url: "https://boslive.icai.org/", attempt: "September 2026", status: "Verified for Sep 2026", date: "2024-05-15"
  },
  {
    id: "mtp-6", subjectId: "fm-sm", module: "MTP", chapter: "Mock Test Paper - Series 1", type: "Mock Test Paper (MTP)", url: "https://boslive.icai.org/", attempt: "September 2026", status: "Verified for Sep 2026", date: "2024-06-10"
  },

  // Add a May 2027 resource to demonstrate filtering
  {
    id: "m9", subjectId: "taxation", module: "Module 1 (Income Tax)", chapter: "Chapter 1: Basic Concepts (Amendments)", type: "Statutory Update", url: "https://boslive.icai.org/", attempt: "May 2027", status: "Verified for May 2027", date: "2024-11-15"
  }
];

export const chaptersDB = [
  // Advanced Accounting
  { id: "c1", subjectId: "advanced-accounting", module: "Module 1", title: "Accounting Standards", duration: "4h 30m est.", questions: 45 },
  { id: "c1-2", subjectId: "advanced-accounting", module: "Module 1", title: "Framework for Preparation & Presentation of Financial Statements", duration: "3h 00m est.", questions: 25 },
  { id: "c2", subjectId: "advanced-accounting", module: "Module 2", title: "Company Accounts", duration: "5h 15m est.", questions: 60 },
  { id: "c2-2", subjectId: "advanced-accounting", module: "Module 2", title: "Accounting for Branches", duration: "4h 00m est.", questions: 35 },
  
  // Corporate Laws
  { id: "c3", subjectId: "corporate-laws", module: "Module 1", title: "Preliminary & Incorporation", duration: "3h 00m est.", questions: 35 },
  { id: "c3-2", subjectId: "corporate-laws", module: "Module 1", title: "Prospectus and Allotment of Securities", duration: "2h 30m est.", questions: 20 },
  { id: "c3-3", subjectId: "corporate-laws", module: "Module 2", title: "Management and Administration", duration: "5h 00m est.", questions: 50 },
  { id: "c3-4", subjectId: "corporate-laws", module: "Module 3", title: "The Limited Liability Partnership Act, 2008", duration: "4h 00m est.", questions: 40 },
  
  // Taxation
  { id: "c4", subjectId: "taxation", module: "Module 1 (Income Tax)", title: "Basic Concepts & Residential Status", duration: "6h 00m est.", questions: 80 },
  { id: "c4-2", subjectId: "taxation", module: "Module 1 (Income Tax)", title: "Incomes which do not form part of Total Income", duration: "3h 00m est.", questions: 30 },
  { id: "c4-3", subjectId: "taxation", module: "Module 2 (Income Tax)", title: "Heads of Income - Salaries & House Property", duration: "8h 00m est.", questions: 100 },
  { id: "c5", subjectId: "taxation", module: "Module 3 (GST)", title: "GST in India - An Introduction & Supply", duration: "4h 45m est.", questions: 55 },
  { id: "c5-2", subjectId: "taxation", module: "Module 3 (GST)", title: "Charge of GST & Exemptions", duration: "5h 15m est.", questions: 45 },
  
  // Cost Management
  { id: "c6", subjectId: "cost-management", module: "Module 1", title: "Introduction to Cost and Management Accounting", duration: "2h 00m est.", questions: 20 },
  { id: "c6-2", subjectId: "cost-management", module: "Module 1", title: "Material Costing", duration: "4h 00m est.", questions: 40 },
  { id: "c6-3", subjectId: "cost-management", module: "Module 2", title: "Employee Cost & Overheads", duration: "6h 30m est.", questions: 70 },
  { id: "c6-4", subjectId: "cost-management", module: "Module 3", title: "Activity Based Costing (ABC)", duration: "3h 30m est.", questions: 35 },
  
  // Auditing & Ethics
  { id: "c7", subjectId: "auditing-ethics", module: "Module 1", title: "Nature, Objective and Scope of Audit", duration: "3h 30m est.", questions: 30 },
  { id: "c7-2", subjectId: "auditing-ethics", module: "Module 1", title: "Audit Strategy, Planning and Programme", duration: "3h 00m est.", questions: 25 },
  { id: "c7-3", subjectId: "auditing-ethics", module: "Module 2", title: "Audit Evidence", duration: "6h 00m est.", questions: 60 },
  { id: "c7-4", subjectId: "auditing-ethics", module: "Module 2", title: "Audit of Items of Financial Statements", duration: "7h 00m est.", questions: 75 },
  
  // FM-SM
  { id: "c8", subjectId: "fm-sm", module: "Module 1 (FM)", title: "Scope and Objectives of Financial Management", duration: "2h 00m est.", questions: 15 },
  { id: "c8-2", subjectId: "fm-sm", module: "Module 1 (FM)", title: "Types of Financing", duration: "3h 00m est.", questions: 30 },
  { id: "c8-3", subjectId: "fm-sm", module: "Module 2 (FM)", title: "Cost of Capital & Capital Structure", duration: "7h 00m est.", questions: 80 },
  { id: "c8-4", subjectId: "fm-sm", module: "Module 3 (SM)", title: "Introduction to Strategic Management", duration: "3h 00m est.", questions: 25 },
  { id: "c8-5", subjectId: "fm-sm", module: "Module 3 (SM)", title: "Strategic Analysis: External Environment", duration: "4h 00m est.", questions: 40 }
];

