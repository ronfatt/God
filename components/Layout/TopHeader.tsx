'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Volume2, VolumeX, Flame, Coins, ChevronLeft, Sparkles } from 'lucide-react';
import { sound } from '@/lib/sound';
import { Storage } from '@/lib/storage';
import { UserProfile } from '@/types/oracle';

interface TopHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ title, showBack, onBack }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    setIsMuted(sound.getMuted());
    setUser(Storage.getUser());

    const handleStorageChange = () => {
      setUser(Storage.getUser());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleSound = () => {
    const nextMute = sound.toggleMute();
    setIsMuted(nextMute);
  };

  return (
    <header className="sticky top-0 z-40 w-full px-4 py-3 bg-[#FAF8F5]/90 backdrop-blur-2xl border-b border-amber-400/25 flex items-center justify-between shadow-[0_2px_15px_rgba(180,140,50,0.06)]">
      <div className="flex items-center gap-2">
        {showBack ? (
          <button
            onClick={onBack}
            className="p-1.5 -ml-1 text-stone-700 hover:text-amber-900 transition-colors flex items-center gap-1 text-xs active:scale-95 font-serif font-black"
          >
            <ChevronLeft className="w-4 h-4 text-amber-700 stroke-[3]" />
            <span className="tracking-wider">返回</span>
          </button>
        ) : (
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full border border-amber-500/40 bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200 flex items-center justify-center text-amber-900 font-serif text-sm shadow-[0_2px_10px_rgba(212,175,55,0.3)] group-hover:scale-105 transition-transform">
              ☯
            </div>
            <div className="flex flex-col">
              <span className="text-base font-serif font-black tracking-widest text-gold-gradient">
                {title || '天机52'}
              </span>
              <span className="text-[8.5px] tracking-[0.25em] text-amber-800/80 font-sans -mt-1 uppercase font-bold">
                TIANJI 52 · ORACLE
              </span>
            </div>
          </Link>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        {/* Token Balance */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-50 to-white border border-amber-300 text-amber-900 text-xs shadow-xs">
          <Coins className="w-3.5 h-3.5 text-amber-600" />
          <span className="font-mono font-black">{user?.tokens ?? 120}</span>
        </div>

        {/* Streak */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-rose-50 to-white border border-rose-300 text-rose-800 text-xs shadow-xs">
          <Flame className="w-3.5 h-3.5 text-rose-600 fill-rose-500/20" />
          <span className="font-mono font-black">{user?.streak ?? 7}</span>
        </div>

        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          aria-label="Toggle Sound"
          className="p-1.5 rounded-full border border-amber-300/50 bg-white/90 text-stone-600 hover:text-amber-900 hover:border-amber-500/60 shadow-xs active:scale-90 transition-all"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-stone-400" /> : <Volume2 className="w-4 h-4 text-amber-600 animate-pulse" />}
        </button>
      </div>
    </header>
  );
};
