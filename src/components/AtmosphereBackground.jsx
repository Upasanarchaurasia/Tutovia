import React from 'react';
import { motion } from 'framer-motion';

/**
 * AtmosphereBackground — Dynamic 4-Atmosphere Continuous Visual Environment
 *
 * One consistent student study environment beside a panoramic window/balcony.
 * Composition remains identical across all 4 moments of the day:
 * - Foreground: Comfortable student study desk (lamp, laptop, notebook & pen, coffee mug, plant, books)
 * - Middle ground: Large window/balcony view, distant hills, trees, and city skyline
 * - Background: Panoramic sky that gradually transitions:
 *    🌅 AURORA   (Sunrise: Pale blue, peach, soft pink, lavender, warm golden sunrise, quiet city)
 *    ☀️ LUMEN    (Day: Clear blue, cyan, white clouds, natural daylight, awake & productive city)
 *    🌇 TWILIGHT (Sunset: Blue → Cyan → Peach → Orange → Coral → Pink → Purple → Indigo, glowing window lights, warm desk lamp)
 *    🌙 ECLIPSE  (Night: Deep navy, midnight blue, crescent moon with cool glow, subtle stars, warm desk lamp + moonlight)
 */

function StudyDeskForeground({ phase }) {
  const isLight = phase === 'aurora' || phase === 'lumen';
  const isTwilight = phase === 'twilight';
  const isEclipse = phase === 'eclipse';

  // Desktop colors & opacity based on ambient room light
  const deskFill = isLight ? '#E7DFD5' : '#0D1122';
  const deskStroke = isLight ? '#D5CBBF' : '#1A213B';
  const itemFill = isLight ? '#D1C7BA' : '#151C33';
  const itemStroke = isLight ? '#B5A998' : '#2A3559';
  const pageFill = isLight ? '#FFFFFF' : '#1E284A';

  return (
    <g className="transition-all duration-1000">
      {/* 1. Desk Lamp Ambient Light Bloom (Warm lamp in Twilight and Eclipse) */}
      {isTwilight && (
        <circle cx="170" cy="740" r="160" fill="url(#twilightLampGlow)" opacity="0.85" />
      )}
      {isEclipse && (
        <circle cx="170" cy="740" r="240" fill="url(#eclipseLampGlow)" opacity="0.95" />
      )}

      {/* 2. Window Sill Ledge */}
      <rect x="0" y="814" width="1440" height="10" fill={isLight ? '#C9BFB2' : '#0B0F20'} opacity="0.9" />

      {/* 3. Study Desk Surface */}
      <rect x="0" y="824" width="1440" height="76" fill={deskFill} opacity="0.95" />
      <line x1="0" y1="824" x2="1440" y2="824" stroke={deskStroke} strokeWidth="1.5" />

      {/* 4. Left Desk Lamp */}
      <g>
        {/* Lamp Base */}
        <ellipse cx="140" cy="824" rx="20" ry="5" fill={itemFill} stroke={itemStroke} strokeWidth="1" />
        {/* Lamp Stem */}
        <path d="M 140 824 Q 130 760 170 730" fill="none" stroke={itemStroke} strokeWidth="3" strokeLinecap="round" />
        {/* Lamp Shade */}
        <polygon points="156,720 192,726 178,746 150,738" fill={itemFill} stroke={itemStroke} strokeWidth="1.2" />
        {/* Lit Bulb / Glow Point in Evening & Night */}
        {(isTwilight || isEclipse) && (
          <circle cx="168" cy="742" r="5" fill="#FEF08A" filter="drop-shadow(0 0 8px #F59E0B)" />
        )}
      </g>

      {/* 5. Angled Laptop */}
      <g opacity="0.85">
        {/* Open Display */}
        <polygon points="320,764 430,758 436,822 326,824" fill={itemFill} stroke={itemStroke} strokeWidth="1.2" />
        {/* Screen Glow */}
        <polygon 
          points="326,768 424,763 430,818 332,820" 
          fill={isLight ? '#BAE6FD' : isTwilight ? '#FDBA74' : '#818CF8'} 
          opacity={isLight ? 0.35 : 0.22} 
        />
        {/* Keyboard Base */}
        <polygon points="314,824 434,822 446,835 310,838" fill={itemFill} stroke={itemStroke} strokeWidth="1.2" />
      </g>

      {/* 6. Open Notebook & Pen */}
      <g opacity="0.85">
        {/* Left Page */}
        <polygon points="530,826 590,825 592,844 526,845" fill={pageFill} stroke={itemStroke} strokeWidth="1" />
        {/* Right Page */}
        <polygon points="590,825 650,824 656,843 592,844" fill={pageFill} stroke={itemStroke} strokeWidth="1" />
        {/* Notebook Spine */}
        <line x1="590" y1="825" x2="592" y2="844" stroke={itemStroke} strokeWidth="1.5" />
        {/* Notebook Lines */}
        <line x1="538" y1="832" x2="582" y2="831" stroke={itemStroke} strokeWidth="0.8" opacity="0.5" />
        {/* Slim Pen */}
        <rect x="664" y="827" width="2.5" height="14" rx="1" fill={isLight ? '#F59E0B' : '#38BDF8'} transform="rotate(-25 664 827)" />
      </g>

      {/* 7. Coffee Mug / Water Bottle with Faint Steam */}
      <g opacity="0.9">
        <rect x="740" y="812" width="16" height="20" rx="3" fill={itemFill} stroke={itemStroke} strokeWidth="1" />
        <path d="M 756 816 C 762 816 762 826 756 826" fill="none" stroke={itemStroke} strokeWidth="1" />
        {/* Faint Steam */}
        <path d="M 746 808 Q 744 804 748 800" fill="none" stroke={isLight ? '#CBD5E1' : '#64748B'} strokeWidth="1" opacity="0.6" strokeLinecap="round" />
        <path d="M 750 809 Q 752 805 749 801" fill="none" stroke={isLight ? '#CBD5E1' : '#64748B'} strokeWidth="1" opacity="0.6" strokeLinecap="round" />
      </g>

      {/* 8. Small Potted Succulent Plant */}
      <g opacity="0.9">
        {/* Pot */}
        <polygon points="820,816 836,816 833,830 823,830" fill={itemFill} stroke={itemStroke} strokeWidth="1" />
        {/* Succulent Leaves */}
        <path d="M 828 816 C 823 810 820 812 822 816" fill="none" stroke={isLight ? '#10B981' : '#059669'} strokeWidth="2" strokeLinecap="round" />
        <path d="M 828 816 C 833 809 836 811 834 816" fill="none" stroke={isLight ? '#10B981' : '#059669'} strokeWidth="2" strokeLinecap="round" />
        <path d="M 828 816 C 828 807 828 807 828 816" fill="none" stroke={isLight ? '#34D399' : '#10B981'} strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* 9. Small Stack of 2 Study Books */}
      <g opacity="0.85">
        <polygon points="910,826 990,826 994,834 908,834" fill={isLight ? '#E2E8F0' : '#1E293B'} stroke={itemStroke} strokeWidth="1" />
        <polygon points="915,820 985,820 988,826 913,826" fill={isLight ? '#FED7AA' : '#334155'} stroke={itemStroke} strokeWidth="1" />
      </g>

      {/* 10. Large Window / Balcony Architectural Frame */}
      <g stroke={deskStroke} opacity={isLight ? 0.35 : 0.45}>
        {/* Top Window Frame */}
        <line x1="0" y1="8" x2="1440" y2="8" strokeWidth="16" />
        {/* Left Window Pane Divider */}
        <line x1="260" y1="0" x2="260" y2="814" strokeWidth="4" />
        {/* Right Window Pane Divider */}
        <line x1="1180" y1="0" x2="1180" y2="814" strokeWidth="4" />
        {/* Upper Transom Bar */}
        <line x1="0" y1="220" x2="1440" y2="220" strokeWidth="3" opacity="0.6" />
      </g>
    </g>
  );
}

function DistantSkyline({ phase }) {
  const isAurora = phase === 'aurora';
  const isLumen = phase === 'lumen';
  const isTwilight = phase === 'twilight';
  const isEclipse = phase === 'eclipse';

  // Base skyline color
  const skylineFill = isAurora ? '#C4B5FD' : isLumen ? '#94A3B8' : isTwilight ? '#0E1226' : '#050811';
  const skylineOpacity = isAurora ? 0.28 : isLumen ? 0.2 : isTwilight ? 0.88 : 0.95;

  return (
    <g>
      {/* Distant Hills / Tree Canopy */}
      <path 
        d="M 0 710 Q 250 670 500 690 T 1000 680 T 1440 710 L 1440 820 L 0 820 Z" 
        fill={isAurora ? '#FBCFE8' : isLumen ? '#A7F3D0' : isTwilight ? '#312E81' : '#0B1120'} 
        opacity={isAurora ? 0.35 : isLumen ? 0.25 : isTwilight ? 0.45 : 0.6} 
      />
      <path 
        d="M 0 735 Q 350 705 700 730 T 1440 735 L 1440 820 L 0 820 Z" 
        fill={isAurora ? '#E0D7F5' : isLumen ? '#10B981' : isTwilight ? '#1E1B4B' : '#070B16'} 
        opacity={isAurora ? 0.3 : isLumen ? 0.15 : isTwilight ? 0.6 : 0.8} 
      />

      {/* Consistent City Skyline (Identical building silhouettes across all 4 modes) */}
      <path 
        d="M 0 760 L 60 760 L 60 710 L 100 710 L 100 760 L 140 760 L 140 670 L 180 670 L 180 760 L 250 760 L 250 720 L 300 720 L 300 760 L 370 760 L 370 655 L 410 655 L 410 760 L 470 760 L 470 725 L 520 725 L 520 760 L 600 760 L 600 645 L 650 645 L 650 760 L 720 760 L 720 695 L 770 695 L 770 760 L 850 760 L 850 665 L 890 665 L 890 760 L 980 760 L 980 715 L 1040 715 L 1040 760 L 1120 760 L 1120 635 L 1160 635 L 1160 760 L 1220 760 L 1220 685 L 1270 685 L 1270 760 L 1350 760 L 1350 710 L 1400 710 L 1400 760 L 1440 760 L 1440 820 L 0 820 Z" 
        fill={skylineFill} 
        opacity={skylineOpacity} 
      />

      {/* Building Windows & Street Lights (Gradually turning on in Twilight and Eclipse) */}
      {(isTwilight || isEclipse) && (
        <g fill="#FDE047" opacity={isTwilight ? 0.85 : 0.75}>
          <rect x="70" y="720" width="3" height="3" rx="0.5" />
          <rect x="85" y="730" width="3" height="3" rx="0.5" />
          <rect x="150" y="685" width="3" height="3" rx="0.5" />
          <rect x="165" y="705" width="3" height="3" rx="0.5" />
          <rect x="150" y="725" width="3" height="3" rx="0.5" />
          <rect x="380" y="670" width="3" height="3" rx="0.5" />
          <rect x="395" y="685" width="3" height="3" rx="0.5" />
          <rect x="380" y="705" width="3" height="3" rx="0.5" />
          <rect x="615" y="660" width="3.5" height="3.5" rx="0.5" />
          <rect x="630" y="675" width="3.5" height="3.5" rx="0.5" />
          <rect x="615" y="700" width="3.5" height="3.5" rx="0.5" />
          <rect x="735" y="710" width="3" height="3" rx="0.5" />
          <rect x="750" y="725" width="3" height="3" rx="0.5" />
          <rect x="865" y="680" width="3" height="3" rx="0.5" />
          <rect x="875" y="700" width="3" height="3" rx="0.5" />
          <rect x="1135" y="650" width="3" height="3" rx="0.5" />
          <rect x="1145" y="670" width="3" height="3" rx="0.5" />
          <rect x="1135" y="695" width="3" height="3" rx="0.5" />
          <rect x="1235" y="700" width="3" height="3" rx="0.5" />
          <rect x="1250" y="720" width="3" height="3" rx="0.5" />
        </g>
      )}

      {/* Aurora Early Morning Faint Lights (Only 2-3 early risers) */}
      {isAurora && (
        <g fill="#FBBF24" opacity="0.35">
          <rect x="380" y="705" width="3" height="3" rx="0.5" />
          <rect x="615" y="700" width="3" height="3" rx="0.5" />
          <rect x="1135" y="695" width="3" height="3" rx="0.5" />
        </g>
      )}
    </g>
  );
}

export default function AtmosphereBackground({ phase = 'twilight' }) {
  const currentPhase = phase === 'morning' ? 'aurora' : phase === 'day' ? 'lumen' : phase === 'evening' ? 'twilight' : phase === 'night' ? 'eclipse' : phase;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
      
      {/* ======================================================== */}
      {/* 🌅 1. AURORA — MORNING (Pastel sunrise sky + golden light) */}
      {/* ======================================================== */}
      {currentPhase === 'aurora' && (
        <div className="absolute inset-0 transition-opacity duration-1000 opacity-100">
          <svg className="w-full h-full object-cover filter blur-[0.6px]" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice">
            <defs>
              {/* Sunrise Sky: Pale blue/lavender -> Soft pink -> Peach -> Golden Horizon */}
              <linearGradient id="auroraSkyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#C7D2FE" stopOpacity="0.75" />
                <stop offset="25%" stopColor="#DDD6FE" stopOpacity="0.75" />
                <stop offset="50%" stopColor="#FBCFE8" stopOpacity="0.8" />
                <stop offset="75%" stopColor="#FED7AA" stopOpacity="0.85" />
                <stop offset="95%" stopColor="#FEF08A" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#FFFBEB" stopOpacity="1" />
              </linearGradient>

              {/* Soft Golden Sun Bloom near horizon */}
              <radialGradient id="auroraSunBloom" cx="30%" cy="70%" r="50%">
                <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.55" />
                <stop offset="35%" stopColor="#FDBA74" stopOpacity="0.32" />
                <stop offset="70%" stopColor="#F472B6" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#F472B6" stopOpacity="0" />
              </radialGradient>

              {/* Sunrise Cloud Gradient */}
              <linearGradient id="auroraCloud" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
                <stop offset="50%" stopColor="#FED7AA" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#FBCFE8" stopOpacity="0.55" />
              </linearGradient>
            </defs>

            {/* Sky */}
            <rect width="1440" height="900" fill="url(#auroraSkyGrad)" />

            {/* Rising Sun Disk & Halo */}
            <circle cx="430" cy="670" r="380" fill="url(#auroraSunBloom)" />
            <circle cx="430" cy="670" r="32" fill="#FEF08A" opacity="0.85" filter="drop-shadow(0 0 20px #F59E0B)" />

            {/* Sunrise Clouds */}
            <path d="M 80 320 C 140 300 240 300 300 330 C 350 310 440 315 480 340 C 510 325 580 330 620 350 C 600 375 200 380 80 320 Z" fill="url(#auroraCloud)" />
            <path d="M 720 250 C 780 230 890 230 950 260 C 1000 240 1100 245 1150 270 C 1190 295 850 300 720 250 Z" fill="url(#auroraCloud)" opacity="0.8" />
            <path d="M 350 480 C 450 460 620 460 720 490 C 800 470 950 475 1050 500 C 1000 535 500 540 350 480 Z" fill="url(#auroraCloud)" opacity="0.6" />

            {/* Distant Skyline & Landscape */}
            <DistantSkyline phase="aurora" />

            {/* Foreground Study Desk */}
            <StudyDeskForeground phase="aurora" />
          </svg>

          {/* Gentle Morning Floating Light Particles */}
          <div className="absolute inset-0">
            <motion.div 
              animate={{ y: [-12, 12, -12], opacity: [0.3, 0.6, 0.3] }} 
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-[28%] left-[24%] w-2.5 h-2.5 rounded-full bg-amber-300 blur-[2px]" 
            />
            <motion.div 
              animate={{ y: [12, -16, 12], opacity: [0.2, 0.5, 0.2] }} 
              transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute top-[42%] left-[38%] w-2 h-2 rounded-full bg-pink-300 blur-[2px]" 
            />
          </div>

          {/* Readability Scrim (Preserves morning atmosphere while giving content 100% contrast) */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#FFFDF8]/70 via-[#FFFDF8]/82 to-[#FFF8EE]/92" />
        </div>
      )}

      {/* ======================================================== */}
      {/* ☀️ 2. LUMEN — DAY (Clear blue sky + bright natural daylight) */}
      {/* ======================================================== */}
      {currentPhase === 'lumen' && (
        <div className="absolute inset-0 transition-opacity duration-1000 opacity-100">
          <svg className="w-full h-full object-cover filter blur-[0.5px]" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice">
            <defs>
              {/* Clear Blue Daytime Sky */}
              <linearGradient id="lumenSkyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.5" />
                <stop offset="35%" stopColor="#7DD3FC" stopOpacity="0.45" />
                <stop offset="70%" stopColor="#BAE6FD" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#F0F9FF" stopOpacity="0.92" />
              </linearGradient>

              {/* Natural Daylight Bloom */}
              <radialGradient id="lumenDayBloom" cx="65%" cy="15%" r="60%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
                <stop offset="30%" stopColor="#BAE6FD" stopOpacity="0.35" />
                <stop offset="70%" stopColor="#38BDF8" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
              </radialGradient>

              {/* Crisp Fluffy Daytime Clouds */}
              <linearGradient id="lumenCloud" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.88" />
                <stop offset="100%" stopColor="#E0F2FE" stopOpacity="0.65" />
              </linearGradient>
            </defs>

            {/* Sky */}
            <rect width="1440" height="900" fill="url(#lumenSkyGrad)" />

            {/* Sunlight Halo */}
            <circle cx="950" cy="180" r="480" fill="url(#lumenDayBloom)" />

            {/* Soft Fluffy Day Clouds */}
            <path d="M 100 220 C 160 190 280 190 350 230 C 410 200 520 210 580 240 C 640 220 730 230 780 260 C 720 290 250 300 100 220 Z" fill="url(#lumenCloud)" />
            <path d="M 820 160 C 880 135 990 135 1060 170 C 1120 145 1220 150 1280 185 C 1220 220 900 225 820 160 Z" fill="url(#lumenCloud)" opacity="0.8" />

            {/* Distant Skyline & Landscape */}
            <DistantSkyline phase="lumen" />

            {/* Foreground Study Desk */}
            <StudyDeskForeground phase="lumen" />
          </svg>

          {/* Readability Scrim (Crisp, clean surface backing) */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#F8FAFC]/75 via-[#F8FAFC]/85 to-[#F1F5F9]/92" />
        </div>
      )}

      {/* ======================================================== */}
      {/* 🌇 3. TWILIGHT — EVENING (Cinematic Orange-to-Blue Sunset Sky) */}
      {/* ======================================================== */}
      {currentPhase === 'twilight' && (
        <div className="absolute inset-0 transition-opacity duration-1000 opacity-100">
          <svg className="w-full h-full object-cover filter blur-[0.6px]" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice">
            <defs>
              {/* Natural Sunset Continuum: Blue -> Cyan -> Peach -> Orange -> Coral -> Pink -> Purple -> Indigo */}
              <linearGradient id="twilightSkyGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#F97316" stopOpacity="0.96" />    {/* Glowing Orange Horizon */}
                <stop offset="16%" stopColor="#FB923C" stopOpacity="0.92" />   {/* Warm Amber / Coral */}
                <stop offset="34%" stopColor="#EC4899" stopOpacity="0.82" />   {/* Sunset Pink & Magenta */}
                <stop offset="54%" stopColor="#7C3AED" stopOpacity="0.85" />   {/* Purple & Violet Transition */}
                <stop offset="76%" stopColor="#1E3A8A" stopOpacity="0.94" />   {/* Deep Indigo Blue Hour */}
                <stop offset="100%" stopColor="#0B0F20" stopOpacity="1" />     {/* Upper Midnight Blue */}
              </linearGradient>

              {/* Horizon Sunset Glow Bloom */}
              <radialGradient id="twilightHorizonBloom" cx="50%" cy="86%" r="65%">
                <stop offset="0%" stopColor="#F97316" stopOpacity="0.75" />
                <stop offset="25%" stopColor="#EA580C" stopOpacity="0.55" />
                <stop offset="55%" stopColor="#A855F7" stopOpacity="0.28" />
                <stop offset="85%" stopColor="#1E3A8A" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#0B0F20" stopOpacity="0" />
              </radialGradient>

              {/* Desk Lamp Amber Glow (Beginning to illuminate room) */}
              <radialGradient id="twilightLampGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.45" />
                <stop offset="40%" stopColor="#D97706" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
              </radialGradient>

              {/* Backlit Sunset Cloud Gradient */}
              <linearGradient id="twilightCloud" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#6366F1" stopOpacity="0.4" />
                <stop offset="70%" stopColor="#F43F5E" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#F97316" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Sky */}
            <rect width="1440" height="900" fill="url(#twilightSkyGrad)" />

            {/* Horizon Sunset Bloom */}
            <circle cx="720" cy="790" r="680" fill="url(#twilightHorizonBloom)" />

            {/* Backlit Layered Clouds */}
            <path d="M 40 450 C 180 430 360 435 500 460 C 650 440 850 445 1000 470 C 1180 450 1340 460 1440 480 C 1300 510 500 520 40 450 Z" fill="url(#twilightCloud)" opacity="0.65" />
            <path d="M 120 370 C 260 350 440 355 600 375 C 750 360 980 365 1140 385 C 1300 370 1400 380 1440 395 C 1200 420 450 430 120 370 Z" fill="url(#twilightCloud)" opacity="0.45" />

            {/* Distant Skyline & Landscape with Windows Turning On */}
            <DistantSkyline phase="twilight" />

            {/* Foreground Study Desk with Lamp Turning On */}
            <StudyDeskForeground phase="twilight" />
          </svg>

          {/* Shimmering Evening Micro-Lights */}
          <div className="absolute inset-0">
            <motion.div 
              animate={{ opacity: [0.6, 1, 0.6] }} 
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-[20%] left-[43%] w-2 h-2 rounded-full bg-amber-400 blur-[1px]" 
            />
            <motion.div 
              animate={{ opacity: [0.5, 0.95, 0.5] }} 
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute bottom-[23%] right-[22%] w-2 h-2 rounded-full bg-amber-300 blur-[1px]" 
            />
          </div>

          {/* Readability Scrim (Ensures text & cards pop with crisp evening contrast) */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F20]/70 via-[#10142C]/75 to-[#0B0F20]/85" />
        </div>
      )}

      {/* ======================================================== */}
      {/* 🌙 4. ECLIPSE — NIGHT (Moonlit sky + cozy desk lamp) */}
      {/* ======================================================== */}
      {currentPhase === 'eclipse' && (
        <div className="absolute inset-0 transition-opacity duration-1000 opacity-100">
          <svg className="w-full h-full object-cover filter blur-[0.5px]" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice">
            <defs>
              {/* Midnight Navy & Deep Indigo Sky */}
              <linearGradient id="eclipseSkyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#050811" stopOpacity="0.98" />
                <stop offset="50%" stopColor="#0B1120" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#111827" stopOpacity="1" />
              </linearGradient>

              {/* Moonlight Halo */}
              <radialGradient id="eclipseMoonHalo" cx="78%" cy="16%" r="22%">
                <stop offset="0%" stopColor="#BAE6FD" stopOpacity="0.38" />
                <stop offset="40%" stopColor="#818CF8" stopOpacity="0.14" />
                <stop offset="100%" stopColor="#0B1120" stopOpacity="0" />
              </radialGradient>

              {/* Warm Desk Lamp Ambient Glow (Primary warm light source in night) */}
              <radialGradient id="eclipseLampGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.55" />
                <stop offset="35%" stopColor="#D97706" stopOpacity="0.3" />
                <stop offset="70%" stopColor="#78350F" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#0B1120" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Sky */}
            <rect width="1440" height="900" fill="url(#eclipseSkyGrad)" />

            {/* Moon Halo */}
            <circle cx="1120" cy="140" r="280" fill="url(#eclipseMoonHalo)" />

            {/* Crescent Moon */}
            <g transform="translate(1120, 140)">
              <circle cx="0" cy="0" r="24" fill="#F8FAFC" opacity="0.9" filter="drop-shadow(0 0 8px rgba(186,230,253,0.85))" />
              <circle cx="9" cy="-5" r="21" fill="#070B16" />
            </g>

            {/* Subtle Star Field (Small non-sci-fi pinpricks) */}
            <g fill="#FFFFFF" opacity="0.75">
              <circle cx="150" cy="90" r="1.2" />
              <circle cx="280" cy="140" r="1.5" />
              <circle cx="420" cy="80" r="1" />
              <circle cx="560" cy="130" r="1.4" />
              <circle cx="680" cy="70" r="1" />
              <circle cx="820" cy="120" r="1.6" />
              <circle cx="940" cy="85" r="1.2" />
              <circle cx="1020" cy="190" r="1" />
              <circle cx="1260" cy="95" r="1.5" />
              <circle cx="1340" cy="160" r="1" />
              <circle cx="210" cy="240" r="1.3" />
              <circle cx="350" cy="280" r="1" />
              <circle cx="490" cy="220" r="1.5" />
              <circle cx="750" cy="260" r="1.2" />
              <circle cx="890" cy="230" r="1" />
            </g>

            {/* Distant Skyline with Glowing Window Lights */}
            <DistantSkyline phase="eclipse" />

            {/* Foreground Study Desk with Warm Desk Lamp */}
            <StudyDeskForeground phase="eclipse" />
          </svg>

          {/* Twinkling Stars Micro-Animation */}
          <div className="absolute inset-0">
            <motion.div 
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }} 
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-[18%] left-[28%] w-1.5 h-1.5 rounded-full bg-white shadow-sm shadow-blue-200" 
            />
            <motion.div 
              animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.3, 0.8] }} 
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
              className="absolute top-[12%] right-[42%] w-1.5 h-1.5 rounded-full bg-indigo-200 shadow-sm shadow-indigo-300" 
            />
          </div>

          {/* Readability Scrim (Anti-glare midnight navy) */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#070B16]/75 via-[#0B1120]/82 to-[#0B1120]/88" />
        </div>
      )}

    </div>
  );
}
