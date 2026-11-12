import React, { lazy } from 'react';
import { Navigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
export function DashboardRoute() {
  const { onOpenTutor } = useOutletContext();
  return <Dashboard onOpenTutor={onOpenTutor} />;
}

export function SyllabusRoute() {
  const { profile } = useAuth();
  const validIds = ['advanced-accounting', 'corporate-laws', 'taxation', 'cost-management', 'auditing-ethics', 'fm-sm'];
  const saved = localStorage.getItem('tutovia_last_subject_id');
  const id = validIds.includes(saved) ? saved : profile?.ca_group === 'Group 2' ? 'cost-management' : 'advanced-accounting';
  return <Navigate to={`/subject/${id}`} replace />;
}

export const studyPages = {
  Exams: lazy(() => import('./pages/Exams.jsx')),
  Flashcards: lazy(() => import('./pages/Flashcards.jsx')),
  Wellness: lazy(() => import('./pages/Wellness.jsx')),
  News: lazy(() => import('./pages/News.jsx')),
  Community: lazy(() => import('./pages/Community.jsx')),
  User: lazy(() => import('./pages/User.jsx')),
  Subject: lazy(() => import('./pages/Subject.jsx')),
  Analytics: lazy(() => import('./pages/Analytics.jsx')),
  PYQ: lazy(() => import('./pages/PYQ.jsx')),
  PrivacyPolicy: lazy(() => import('./pages/PrivacyPolicy.jsx')),
  TermsOfService: lazy(() => import('./pages/TermsOfService.jsx')),
  Contact: lazy(() => import('./pages/Contact.jsx')),
  AdminPanel: lazy(() => import('./pages/AdminPanel.jsx')),
  AppExclusive: lazy(() => import('./pages/AppExclusive.jsx')),
  TutorPage: lazy(() => import('./pages/TutorPage.jsx')),
  StudyMaterial: lazy(() => import('./pages/StudyMaterial.jsx')),
  GeminiVoices: lazy(() => import('./pages/GeminiVoices.jsx')),
  NotFound: lazy(() => import('./pages/NotFound.jsx'))
};
