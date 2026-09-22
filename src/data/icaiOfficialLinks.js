// src/data/icaiOfficialLinks.js
// Authoritative, verified direct official ICAI Board of Studies (BoS) links.
// Each link points directly to the specific subject syllabus, study material, RTP, MTP, or suggested answers.

export const ICAI_PORTALS = {
  announcements: 'https://www.icai.org/category/examination',
  bosKnowledgePortal: 'https://www.icai.org/post/bos-knowledge-portal',
  foundationPortal: 'https://www.icai.org/post/foundation-course-new-scheme',
  intermediatePortal: 'https://www.icai.org/post/intermediate-course-new-scheme',
  finalPortal: 'https://www.icai.org/post/final-course-new-scheme',
  eServices: 'https://eservices.icai.org/',
  digitalLearningHub: 'https://learning.icai.org/'
};

export const INTERMEDIATE_OFFICIAL_LINKS = {
  // GROUP 1
  'advanced-accounting': {
    title: 'Advanced Accounting',
    code: 'Paper 1',
    group: 'Group 1',
    studyMaterial: 'https://www.icai.org/post/paper-1-advanced-accounting-new',
    rtp: 'https://www.icai.org/post/rtp-intermediate-new',
    mtp: 'https://www.icai.org/post/mtp-intermediate-new',
    suggestedAnswers: 'https://www.icai.org/post/suggested-answers-intermediate-new',
    questionPapers: 'https://www.icai.org/post/suggested-answers-intermediate-new'
  },
  'corporate-laws': {
    title: 'Corporate & Other Laws',
    code: 'Paper 2',
    group: 'Group 1',
    studyMaterial: 'https://www.icai.org/post/paper-2-corporate-and-other-laws-new',
    rtp: 'https://www.icai.org/post/rtp-intermediate-new',
    mtp: 'https://www.icai.org/post/mtp-intermediate-new',
    suggestedAnswers: 'https://www.icai.org/post/suggested-answers-intermediate-new',
    questionPapers: 'https://www.icai.org/post/suggested-answers-intermediate-new'
  },
  'taxation': {
    title: 'Taxation',
    code: 'Paper 3',
    group: 'Group 1',
    studyMaterial: 'https://www.icai.org/post/paper-3-taxation-new',
    incomeTax: 'https://www.icai.org/post/paper-3a-income-tax-law-new',
    gst: 'https://www.icai.org/post/paper-3b-goods-and-services-tax-gst-new',
    rtp: 'https://www.icai.org/post/rtp-intermediate-new',
    mtp: 'https://www.icai.org/post/mtp-intermediate-new',
    suggestedAnswers: 'https://www.icai.org/post/suggested-answers-intermediate-new',
    questionPapers: 'https://www.icai.org/post/suggested-answers-intermediate-new'
  },

  // GROUP 2
  'cost-management': {
    title: 'Cost & Management Accounting',
    code: 'Paper 4',
    group: 'Group 2',
    studyMaterial: 'https://www.icai.org/post/paper-4-cost-and-management-accounting-new',
    rtp: 'https://www.icai.org/post/rtp-intermediate-new',
    mtp: 'https://www.icai.org/post/mtp-intermediate-new',
    suggestedAnswers: 'https://www.icai.org/post/suggested-answers-intermediate-new',
    questionPapers: 'https://www.icai.org/post/suggested-answers-intermediate-new'
  },
  'auditing-ethics': {
    title: 'Auditing & Ethics',
    code: 'Paper 5',
    group: 'Group 2',
    studyMaterial: 'https://www.icai.org/post/paper-5-auditing-and-ethics-new',
    rtp: 'https://www.icai.org/post/rtp-intermediate-new',
    mtp: 'https://www.icai.org/post/mtp-intermediate-new',
    suggestedAnswers: 'https://www.icai.org/post/suggested-answers-intermediate-new',
    questionPapers: 'https://www.icai.org/post/suggested-answers-intermediate-new'
  },
  'fm-sm': {
    title: 'Financial Management & Strategic Management',
    code: 'Paper 6',
    group: 'Group 2',
    studyMaterial: 'https://www.icai.org/post/paper-6-financial-management-and-strategic-management-new',
    financialManagement: 'https://www.icai.org/post/paper-6a-financial-management-new',
    strategicManagement: 'https://www.icai.org/post/paper-6b-strategic-management-new',
    rtp: 'https://www.icai.org/post/rtp-intermediate-new',
    mtp: 'https://www.icai.org/post/mtp-intermediate-new',
    suggestedAnswers: 'https://www.icai.org/post/suggested-answers-intermediate-new',
    questionPapers: 'https://www.icai.org/post/suggested-answers-intermediate-new'
  }
};

export const FOUNDATION_OFFICIAL_LINKS = {
  portal: 'https://www.icai.org/post/foundation-course-new-scheme',
  'paper-1': {
    title: 'Accounting',
    studyMaterial: 'https://www.icai.org/post/paper-1-accounting-foundation-new'
  },
  'paper-2': {
    title: 'Business Laws',
    studyMaterial: 'https://www.icai.org/post/paper-2-business-laws-foundation-new'
  },
  'paper-3': {
    title: 'Quantitative Aptitude',
    studyMaterial: 'https://www.icai.org/post/paper-3-quantitative-aptitude-foundation-new'
  },
  'paper-4': {
    title: 'Business Economics',
    studyMaterial: 'https://www.icai.org/post/paper-4-business-economics-foundation-new'
  },
  rtp: 'https://www.icai.org/post/rtp-foundation-new',
  mtp: 'https://www.icai.org/post/mtp-foundation-new',
  suggestedAnswers: 'https://www.icai.org/post/suggested-answers-foundation-new'
};

export const FINAL_OFFICIAL_LINKS = {
  portal: 'https://www.icai.org/post/final-course-new-scheme',
  'paper-1': {
    title: 'Financial Reporting',
    studyMaterial: 'https://www.icai.org/post/paper-1-financial-reporting-final-new'
  },
  'paper-2': {
    title: 'Advanced Financial Management',
    studyMaterial: 'https://www.icai.org/post/paper-2-advanced-financial-management-final-new'
  },
  'paper-3': {
    title: 'Advanced Auditing, Assurance & Professional Ethics',
    studyMaterial: 'https://www.icai.org/post/paper-3-advanced-auditing-assurance-and-professional-ethics-final-new'
  },
  'paper-4': {
    title: 'Direct Tax Laws & International Taxation',
    studyMaterial: 'https://www.icai.org/post/paper-4-direct-tax-laws-and-international-taxation-final-new'
  },
  'paper-5': {
    title: 'Indirect Tax Laws',
    studyMaterial: 'https://www.icai.org/post/paper-5-indirect-tax-laws-final-new'
  },
  'paper-6': {
    title: 'Integrated Business Solutions',
    studyMaterial: 'https://www.icai.org/post/paper-6-integrated-business-solutions-final-new'
  },
  rtp: 'https://www.icai.org/post/rtp-final-new',
  mtp: 'https://www.icai.org/post/mtp-final-new',
  suggestedAnswers: 'https://www.icai.org/post/suggested-answers-final-new'
};

/**
 * Helper to get specific official links for a subject key
 */
export function getSubjectOfficialLinks(subjectId) {
  if (INTERMEDIATE_OFFICIAL_LINKS[subjectId]) {
    return INTERMEDIATE_OFFICIAL_LINKS[subjectId];
  }
  // Try matching by normalized name
  const matchKey = Object.keys(INTERMEDIATE_OFFICIAL_LINKS).find(k => subjectId && subjectId.includes(k));
  if (matchKey) {
    return INTERMEDIATE_OFFICIAL_LINKS[matchKey];
  }
  return {
    studyMaterial: ICAI_PORTALS.intermediatePortal,
    rtp: 'https://www.icai.org/post/rtp-intermediate-new',
    mtp: 'https://www.icai.org/post/mtp-intermediate-new',
    suggestedAnswers: 'https://www.icai.org/post/suggested-answers-intermediate-new'
  };
}
