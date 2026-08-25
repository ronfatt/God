'use client';

import React, { useState, useEffect } from 'react';
import { SplashScreen } from '@/components/Splash/SplashScreen';
import { BottomNavigation } from '@/components/Layout/BottomNavigation';
import { usePathname } from 'next/navigation';

interface AppContainerProps {
  children: React.ReactNode;
}

export const AppContainer: React.FC<AppContainerProps> = ({ children }) => {
  const [showSplash, setShowSplash] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // Check if splash was already shown in this session
    const hasSeenSplash = sessionStorage.getItem('tianji_has_seen_splash');
    if (hasSeenSplash) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashComplete = () => {
    sessionStorage.setItem('tianji_has_seen_splash', 'true');
    setShowSplash(false);
  };

  // Hide bottom nav on specific interactive full-screen flow screens like /draw if desired, or keep it accessible
  const hideBottomNav = pathname === '/draw';

  return (
    <div className="min-h-screen bg-[#040507] flex justify-center items-start text-neutral-100 overflow-x-hidden selection:bg-amber-500/30 selection:text-amber-200">
      {/* Desktop Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0 hidden md:block">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}

      {/* Main Mobile-First Frame (390-480px width) */}
      <main className="relative z-10 w-full max-w-[440px] min-h-screen bg-[#07090e] border-x border-neutral-800/40 shadow-2xl flex flex-col pb-20">
        {/* Dynamic Background Water Ink Mist & Rotating Taiji */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] h-full pointer-events-none overflow-hidden z-0">
          {/* Subtle Ambient Taiji Watermark */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] opacity-[0.035] animate-spin-slow pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-amber-300">
              <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M 50 2 A 48 48 0 0 1 50 98 A 24 24 0 0 1 50 50 A 24 24 0 0 0 50 2 Z" fill="currentColor" />
              <circle cx="50" cy="26" r="6" fill="#07090e" />
              <circle cx="50" cy="74" r="6" fill="currentColor" />
            </svg>
          </div>

          {/* Top Mystic Radiant Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.1)_0%,transparent_70%)] blur-2xl" />
        </div>

        {/* Page Content */}
        <div className="relative z-10 flex-1 flex flex-col">
          {children}
        </div>

        {/* Global Bottom Navigation */}
        {!hideBottomNav && <BottomNavigation />}
      </main>
    </div>
  );
};
