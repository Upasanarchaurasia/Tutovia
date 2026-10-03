import React from 'react';
import { ThemeProvider } from '../context/ThemeContext.jsx';
import LandingPageV2 from './LandingPageV2.jsx';

export default function AppV2() {
  return (
    <ThemeProvider>
      <LandingPageV2 />
    </ThemeProvider>
  );
}
