import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext.jsx';
import LandingPage from '../pages/LandingPage.jsx';

function RedirectToMain({ path }) {
  useEffect(() => {
    window.location.href = path;
  }, [path]);
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm font-semibold text-slate-300">Opening {path} on Tutovia...</p>
    </div>
  );
}

export default function AppV2() {
  return (
    <BrowserRouter basename="/v2">
      <ThemeProvider>
        <Routes>
          <Route path="/login" element={<RedirectToMain path="/login" />} />
          <Route path="/tutor" element={<RedirectToMain path="/tutor" />} />
          <Route path="/gemini-voices" element={<RedirectToMain path="/gemini-voices" />} />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}
