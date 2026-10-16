import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProviderV2 } from './ThemeContextV2.jsx';
import { AuthProvider } from '../context/AuthContext.jsx';
import LandingPageV2 from './LandingPageV2.jsx';
import AuthContainerV2 from './auth/AuthContainerV2.jsx';
import LoginV2 from './LoginV2.jsx';
import SignUpV2 from './SignUpV2.jsx';
import MemberHubV2 from './MemberHubV2.jsx';

export default function AppV2() {
  const routerBase = import.meta.env.BASE_URL 
    ? import.meta.env.BASE_URL.replace(/\/$/, '') 
    : '/v2';

  return (
    <AuthProvider>
      <ThemeProviderV2>
        <BrowserRouter basename={routerBase}>
          <Routes>
            <Route path="/" element={<LandingPageV2 />} />
            
            {/* Shared Persistent Auth Container for Fixed Dimensions & Non-Restarting Carousel */}
            <Route element={<AuthContainerV2 />}>
              <Route path="/login" element={<LoginV2 />} />
              <Route path="/signup" element={<SignUpV2 />} />
            </Route>

            {/* Lightweight Post-Login Member Welcome Hub & App Gateway */}
            <Route path="/hub" element={<MemberHubV2 />} />
            <Route path="/welcome" element={<Navigate to="/hub" replace />} />
            <Route path="/app" element={<Navigate to="/hub" replace />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProviderV2>
    </AuthProvider>
  );
}
