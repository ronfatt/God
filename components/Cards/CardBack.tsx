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
        'relative rounded-xl overflow-hidden bg-gradient-to-b from-[#111319] via-[#090b10] to-[#040508] border border-amber-500/30 flex flex-col items-center justify-between p-3 select-none transition-all duration-300',
        isGlowing && 'shadow-[0_0_20px_rgba(212,175,55,0.4)] border-amber-400',
        className
      )}
      style={{
        aspectRatio: '2/3',
      }}
    >
      {/* Outer Golden Inset Frame */}
      <div className="absolute inset-1.5 rounded-lg border border-amber-500/20 pointer-events-none" />
      <div className="absolute inset-2 rounded-md border border-amber-500/10 pointer-events-none" />

      {/* Four Corner Ancient Cloud Patterns */}
      <div className="absolute top-2 left-2 text-[10px] text-amber-400/40 font-serif leading-none">
        ⌜
      </div>
      <div className="absolute top-2 right-2 text-[10px] text-amber-400/40 font-serif leading-none">
        ⌝
      </div>
      <div className="absolute bottom-2 left-2 text-[10px] text-amber-400/40 font-serif leading-none">
        ⌞
      </div>
      <div className="absolute bottom-2 right-2 text-[10px] text-amber-400/40 font-serif leading-none">
        ⌟
      </div>

      {/* Top Lotus Emblem */}
      <div className="w-full flex justify-center pt-1">
        <svg
          viewBox="0 0 24 24"
          className="w-4 h-4 fill-none stroke-amber-400/40 stroke-1"
        >
          <path d="M12 2C9 6 6 10 6 15a6 6 0 0 0 12 0c0-5-3-9-6-13z" />
          <path d="M12 7c-2 3-4 6-4 9a4 4 0 0 0 8 0c0-3-2-6-4-9z" />
        </svg>
      </div>

      {/* Center Sacred Taiji & Tianji 52 Seal */}
      <div className="relative flex flex-col items-center justify-center my-auto">
        {/* Subtle Radial Halo */}
        <div className="absolute w-20 h-20 rounded-full bg-amber-500/10 blur-md pointer-events-none" />

        {/* Outer Circular Astrolabe Ring */}
        <div className="w-14 h-14 rounded-full border border-amber-400/30 flex items-center justify-center bg-black/40 shadow-inner">
          <div className="w-11 h-11 rounded-full border border-dashed border-amber-400/20 flex items-center justify-center animate-spin-slow">
            <span className="text-xl text-amber-300 font-serif drop-shadow-[0_0_8px_rgba(212,175,55,0.7)]">
              ☯
            </span>
          </div>
        </div>

        {/* Center Title */}
        <div className="mt-2 text-center">
          <span className="text-[11px] font-serif font-bold tracking-[0.25em] text-gold-gradient block">
            天机52
          </span>
          <span className="text-[7px] tracking-[0.2em] text-neutral-400 uppercase font-mono block -mt-0.5">
            TIANJI 52
          </span>
        </div>
      </div>

      {/* Bottom Lotus / Cloud Filigree */}
      <div className="w-full flex justify-center pb-1">
        <div className="flex items-center gap-1 opacity-40">
          <span className="w-2 h-px bg-amber-400" />
          <span className="w-1 h-1 rounded-full bg-amber-400" />
          <span className="w-2 h-px bg-amber-400" />
        </div>
      </div>

      {/* Subtle Shimmer Light Sweep */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-400/5 to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
};
