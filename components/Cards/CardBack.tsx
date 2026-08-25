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
        'relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#1E1914] via-[#2D241C] to-[#14110E] border-2 border-amber-500/60 flex flex-col items-center justify-between p-3 select-none transition-all duration-300 shadow-[0_4px_20px_rgba(180,140,50,0.22)]',
        isGlowing && 'shadow-[0_0_28px_rgba(212,175,55,0.65)] border-amber-400 ring-2 ring-amber-300/40',
        className
      )}
      style={{
        aspectRatio: '129/246',
      }}
    >
      {/* Outer Golden Inset Filigree Frame */}
      <div className="absolute inset-1.5 rounded-xl border border-amber-400/40 pointer-events-none" />
      <div className="absolute inset-2.5 rounded-lg border border-amber-300/20 pointer-events-none" />

      {/* Four Corner Ancient Cloud Motifs */}
      <div className="absolute top-2 left-2 text-[10px] text-amber-300/70 font-serif leading-none select-none">
        ⌜
      </div>
      <div className="absolute top-2 right-2 text-[10px] text-amber-300/70 font-serif leading-none select-none">
        ⌝
      </div>
      <div className="absolute bottom-2 left-2 text-[10px] text-amber-300/70 font-serif leading-none select-none">
        ⌞
      </div>
      <div className="absolute bottom-2 right-2 text-[10px] text-amber-300/70 font-serif leading-none select-none">
        ⌟
      </div>

      {/* Top Lotus Crest */}
      <div className="w-full flex justify-center pt-1 relative z-10">
        <div className="flex items-center gap-1.5 opacity-70">
          <span className="w-3.5 h-px bg-amber-400" />
          <span className="text-[11px] text-amber-300">🪷</span>
          <span className="w-3.5 h-px bg-amber-400" />
        </div>
      </div>

      {/* Center Sacred Taiji & Tianji 52 Mandala */}
      <div className="relative flex flex-col items-center justify-center my-auto z-10">
        {/* Ambient Radial Halo */}
        <div className="absolute w-24 h-24 rounded-full bg-amber-400/20 blur-lg pointer-events-none" />

        {/* Outer Circular Astrolabe Ring */}
        <div className="w-14 h-14 rounded-full border-2 border-amber-400/80 flex items-center justify-center bg-gradient-to-br from-amber-950/80 via-[#261E16] to-black shadow-[0_0_16px_rgba(212,175,55,0.4)]">
          <div className="w-11 h-11 rounded-full border border-dashed border-amber-300/50 flex items-center justify-center animate-spin-slow">
            <span className="text-2xl text-amber-200 font-serif drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]">
              ☯
            </span>
          </div>
        </div>

        {/* Center Title */}
        <div className="mt-2.5 text-center space-y-0.5">
          <span className="text-xs font-serif font-black tracking-[0.25em] text-amber-200 block drop-shadow-xs">
            天机52
          </span>
          <span className="text-[7.5px] tracking-[0.3em] text-amber-400/80 uppercase font-mono block font-bold">
            EASTERN ORACLE
          </span>
        </div>
      </div>

      {/* Bottom Lotus Crest */}
      <div className="w-full flex justify-center pb-1 relative z-10">
        <div className="flex items-center gap-1.5 opacity-70">
          <span className="w-3.5 h-px bg-amber-400" />
          <span className="text-[11px] text-amber-300">🪷</span>
          <span className="w-3.5 h-px bg-amber-400" />
        </div>
      </div>

      {/* Subtle Shimmer Light Sweep */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-300/10 to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
};
