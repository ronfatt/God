'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface CardBackProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  isGlowing?: boolean;
}

export const CardBack: React.FC<CardBackProps> = ({
  className,
  size = 'md',
  isGlowing = false,
}) => {
  return (
    <div
      className={cn(
        'relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#1C1814] via-[#2A231C] to-[#14120E] border-2 border-amber-500/50 flex flex-col items-center justify-between p-3 select-none transition-all duration-300 shadow-[0_4px_20px_rgba(180,140,50,0.2)]',
        isGlowing && 'shadow-[0_0_25px_rgba(212,175,55,0.6)] border-amber-400',
        className
      )}
      style={{
        aspectRatio: '2/3',
      }}
    >
      {/* Outer Golden Inset Frame */}
      <div className="absolute inset-1.5 rounded-xl border border-amber-400/40 pointer-events-none" />
      <div className="absolute inset-2.5 rounded-lg border border-amber-300/20 pointer-events-none" />

      {/* Four Corner Ancient Cloud Patterns */}
      <div className="absolute top-2 left-2 text-[10px] text-amber-300/60 font-serif leading-none">
        ⌜
      </div>
      <div className="absolute top-2 right-2 text-[10px] text-amber-300/60 font-serif leading-none">
        ⌝
      </div>
      <div className="absolute bottom-2 left-2 text-[10px] text-amber-300/60 font-serif leading-none">
        ⌞
      </div>
      <div className="absolute bottom-2 right-2 text-[10px] text-amber-300/60 font-serif leading-none">
        ⌟
      </div>

      {/* Top Lotus Emblem */}
      <div className="w-full flex justify-center pt-1">
        <div className="flex items-center gap-1 opacity-60">
          <span className="w-3 h-px bg-amber-400" />
          <span className="text-[10px] text-amber-300">🪷</span>
          <span className="w-3 h-px bg-amber-400" />
        </div>
      </div>

      {/* Center Sacred Taiji & Tianji 52 Mandala */}
      <div className="relative flex flex-col items-center justify-center my-auto">
        {/* Subtle Radial Halo */}
        <div className="absolute w-24 h-24 rounded-full bg-amber-400/15 blur-lg pointer-events-none" />

        {/* Outer Circular Astrolabe Ring */}
        <div className="w-14 h-14 rounded-full border-2 border-amber-400/60 flex items-center justify-center bg-gradient-to-br from-amber-950/60 to-black/80 shadow-[0_0_15px_rgba(212,175,55,0.3)]">
          <div className="w-11 h-11 rounded-full border border-dashed border-amber-300/40 flex items-center justify-center animate-spin-slow">
            <span className="text-xl text-amber-200 font-serif drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]">
              ☯
            </span>
          </div>
        </div>

        {/* Center Title */}
        <div className="mt-2 text-center">
          <span className="text-xs font-serif font-extrabold tracking-[0.25em] text-amber-200 block drop-shadow-xs">
            天机52
          </span>
          <span className="text-[7.5px] tracking-[0.25em] text-amber-400/70 uppercase font-mono block font-bold">
            TIANJI 52
          </span>
        </div>
      </div>

      {/* Bottom Lotus / Cloud Filigree */}
      <div className="w-full flex justify-center pb-1">
        <div className="flex items-center gap-1 opacity-60">
          <span className="w-3 h-px bg-amber-400" />
          <span className="text-[10px] text-amber-300">🪷</span>
          <span className="w-3 h-px bg-amber-400" />
        </div>
      </div>

      {/* Subtle Shimmer Light Sweep */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-300/10 to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
};
