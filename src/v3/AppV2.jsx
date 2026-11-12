import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProviderV2 } from './ThemeContextV2.jsx';
import { AuthProvider } from '../context/AuthContext.jsx';
import LandingPageV2 from './LandingPageV2.jsx';
import AuthContainerV2 from './auth/AuthContainerV2.jsx';
import LoginV2 from './LoginV2.jsx';
import SignUpV2 from './SignUpV2.jsx';
import { DashboardRoute, SyllabusRoute, studyPages } from './study/StudyRoutes.jsx';

const StudyLayout = lazy(() => import('./study/StudyLayout.jsx'));
const routePages = [
  ['exams', 'Exams'], ['flashcards', 'Flashcards'], ['wellness', 'Wellness'],
  ['news', 'News'], ['community', 'Community'], ['profile', 'User'],
  ['subject/:id', 'Subject'], ['analytics', 'Analytics'], ['pyq', 'PYQ'],
  ['privacy', 'PrivacyPolicy'], ['terms', 'TermsOfService'], ['contact', 'Contact'],
  ['admin', 'AdminPanel'], ['download', 'AppExclusive'], ['tutor', 'TutorPage'],
  ['study-material', 'StudyMaterial'], ['gemini-voices', 'GeminiVoices']
];

export default function AppV2() {
  const routerBase = import.meta.env.BASE_URL 
    ? import.meta.env.BASE_URL.replace(/\/$/, '') 
    : '/v3';

  return (
    <AuthProvider>
      <ThemeProviderV2>
        <BrowserRouter basename={routerBase}>
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center" role="status">Opening your study space…</div>}>
          <Routes>
            <Route path="/" element={<LandingPageV2 />} />
            
            {/* Shared Persistent Auth Container for Fixed Dimensions & Non-Restarting Carousel */}
            <Route element={<AuthContainerV2 />}>
              <Route path="/login" element={<LoginV2 />} />
              <Route path="/signup" element={<SignUpV2 />} />
            </Route>

            <Route element={<StudyLayout />}>
              <Route path="/dashboard" element={<DashboardRoute />} />
              <Route path="/syllabus" element={<SyllabusRoute />} />
              {routePages.map(([path, name]) => {
                const Page = studyPages[name];
                return <Route key={path} path={`/${path}`} element={<Page />} />;
              })}
              <Route path="/user" element={<Navigate to="/profile" replace />} />
              <Route path="/google-voices" element={<Navigate to="/gemini-voices" replace />} />
            </Route>
            {['hub', 'welcome', 'app', 'home'].map(path => <Route key={path} path={`/${path}`} element={<Navigate to="/dashboard" replace />} />)}

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </Suspense>
        </BrowserRouter>
      </ThemeProviderV2>
    </AuthProvider>
  );
}
