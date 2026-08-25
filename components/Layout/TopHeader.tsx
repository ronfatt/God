'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Volume2, VolumeX, Flame, Coins, Sparkles } from 'lucide-react';
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
    <header className="sticky top-0 z-40 w-full px-4 py-3 glass-panel-dark border-b border-amber-500/10 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {showBack ? (
          <button
            onClick={onBack}
            className="p-1.5 -ml-1 text-neutral-400 hover:text-amber-300 transition-colors flex items-center gap-1 text-sm active:scale-95"
          >
            <span className="text-lg">‹</span>
            <span>返回</span>
          </button>
        ) : (
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full border border-amber-400/40 bg-gradient-to-br from-amber-500/20 to-neutral-900 flex items-center justify-center text-amber-300 font-serif text-sm shadow-[0_0_12px_rgba(212,175,55,0.25)] group-hover:scale-105 transition-transform">
              ☯
            </div>
            <div className="flex flex-col">
              <span className="text-base font-serif font-bold tracking-wider text-gold-gradient">
                {title || '天机52'}
              </span>
              <span className="text-[9px] tracking-[0.2em] text-neutral-400 font-sans -mt-1 uppercase">
                TIANJI 52
              </span>
            </div>
          </Link>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Token Balance */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs shadow-inner">
          <Coins className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span className="font-semibold">{user?.tokens ?? 120}</span>
        </div>

        {/* Streak */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs shadow-inner">
          <Flame className="w-3.5 h-3.5 text-rose-400 fill-rose-400/30" />
          <span className="font-semibold">{user?.streak ?? 7}</span>
        </div>

        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          aria-label="Toggle Sound"
          className="p-1.5 rounded-full border border-neutral-700/60 bg-neutral-900/80 text-neutral-300 hover:text-amber-300 hover:border-amber-500/40 active:scale-90 transition-all"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-neutral-500" /> : <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />}
        </button>
      </div>
    </header>
  );
};
