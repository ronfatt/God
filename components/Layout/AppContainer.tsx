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

  const hideBottomNav = pathname === '/draw';

  return (
    <div className="min-h-screen bg-[#F4EFE6] flex justify-center items-start text-stone-900 overflow-x-hidden selection:bg-amber-500/20 selection:text-amber-900">
      {/* Desktop Background Ambient Gold & Jade Halo */}
      <div className="fixed inset-0 pointer-events-none z-0 hidden md:block">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-amber-200/40 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-rose-200/30 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}

      {/* Main Mobile-First Frame (390-440px width) with Warm Sacred Rice-White Silk */}
      <main className="relative z-10 w-full max-w-[440px] min-h-screen bg-[#FAF8F5] border-x border-amber-900/10 shadow-[0_0_50px_rgba(180,140,50,0.12)] flex flex-col pb-24">
        {/* Dynamic Background Sacred Taiji Watermark & Ambient Sunbeam */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] h-full pointer-events-none overflow-hidden z-0">
          {/* Subtle Golden Taiji Watermark */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] opacity-[0.045] animate-spin-slow pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-amber-700">
              <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M 50 2 A 48 48 0 0 1 50 98 A 24 24 0 0 1 50 50 A 24 24 0 0 0 50 2 Z" fill="currentColor" />
              <circle cx="50" cy="26" r="6" fill="#FAF8F5" />
              <circle cx="50" cy="74" r="6" fill="currentColor" />
            </svg>
          </div>

          {/* Top Sacred Warm Golden Radiant Glow */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.15)_0%,transparent_70%)] blur-2xl" />
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
