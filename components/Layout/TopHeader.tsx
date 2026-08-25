'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Volume2, VolumeX, Flame, Coins, ChevronLeft } from 'lucide-react';
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
    <header className="sticky top-0 z-40 w-full px-4 py-3 glass-panel-dark border-b border-amber-500/20 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2">
        {showBack ? (
          <button
            onClick={onBack}
            className="p-1.5 -ml-1 text-stone-600 hover:text-amber-800 transition-colors flex items-center gap-0.5 text-sm active:scale-95 font-serif font-bold"
          >
            <ChevronLeft className="w-5 h-5 text-amber-700 stroke-[2.5]" />
            <span>返回</span>
          </button>
        ) : (
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full border border-amber-600/30 bg-gradient-to-br from-amber-100 to-amber-200/80 flex items-center justify-center text-amber-800 font-serif text-sm shadow-[0_2px_8px_rgba(212,175,55,0.25)] group-hover:scale-105 transition-transform">
              ☯
            </div>
            <div className="flex flex-col">
              <span className="text-base font-serif font-extrabold tracking-wider text-gold-gradient">
                {title || '天机52'}
              </span>
              <span className="text-[9px] tracking-[0.2em] text-stone-500 font-sans -mt-1 uppercase font-semibold">
                TIANJI 52
              </span>
            </div>
          </Link>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Token Balance */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50/90 border border-amber-400/40 text-amber-900 text-xs shadow-sm">
          <Coins className="w-3.5 h-3.5 text-amber-600" />
          <span className="font-mono font-bold">{user?.tokens ?? 120}</span>
        </div>

        {/* Streak */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50/90 border border-rose-400/40 text-rose-800 text-xs shadow-sm">
          <Flame className="w-3.5 h-3.5 text-rose-600 fill-rose-500/20" />
          <span className="font-mono font-bold">{user?.streak ?? 7}</span>
        </div>

        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          aria-label="Toggle Sound"
          className="p-1.5 rounded-full border border-amber-300/40 bg-white/80 text-stone-600 hover:text-amber-800 hover:border-amber-500/50 shadow-sm active:scale-90 transition-all"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-stone-400" /> : <Volume2 className="w-4 h-4 text-amber-600 animate-pulse" />}
        </button>
      </div>
    </header>
  );
};
