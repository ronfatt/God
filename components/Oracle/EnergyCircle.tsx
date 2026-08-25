'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, TrendingUp, Heart, Briefcase, Users, Coins } from 'lucide-react';

interface EnergyCircleProps {
  score?: number;
  wealth?: number;
  career?: number;
  love?: number;
  nobleman?: number;
}

export const EnergyCircle: React.FC<EnergyCircleProps> = ({
  score = 82,
  wealth = 78,
  career = 84,
  love = 72,
  nobleman = 91,
}) => {
  const [currentScore, setCurrentScore] = useState(0);
  const [wealthScore, setWealthScore] = useState(0);
  const [careerScore, setCareerScore] = useState(0);
  const [loveScore, setLoveScore] = useState(0);
  const [noblemanScore, setNoblemanScore] = useState(0);

  useEffect(() => {
    // Smooth Count Up
    const duration = 1200;
    const steps = 30;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease out

      setCurrentScore(Math.round(score * easeProgress));
      setWealthScore(Math.round(wealth * easeProgress));
      setCareerScore(Math.round(career * easeProgress));
      setLoveScore(Math.round(love * easeProgress));
      setNoblemanScore(Math.round(nobleman * easeProgress));

      if (step >= steps) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [score, wealth, career, love, nobleman]);

  // SVG Circular progress
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentScore / 100) * circumference;

  return (
    <div className="w-full glass-panel rounded-2xl p-4 border border-amber-500/20 shadow-xl relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between gap-3">
        {/* Left: Circular Energy Ring */}
        <div className="flex flex-col items-center">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Background Track */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-neutral-800/80"
                strokeWidth="7"
                fill="none"
              />
              {/* Animated Progress Track */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="url(#goldGradient)"
                strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
                style={{
                  transition: 'stroke-dashoffset 0.1s ease-out',
                }}
              />
              <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FDE68A" />
                  <stop offset="50%" stopColor="#D4AF37" />
                  <stop offset="100%" stopColor="#B45309" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner Content */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-serif font-bold text-gold-gradient tracking-tight">
                {currentScore}
              </span>
              <span className="text-[10px] text-amber-300/80 font-serif tracking-widest -mt-1">
                命势指数
              </span>
            </div>
          </div>
        </div>

        {/* Right: Four Dimensional Sub-Metrics */}
        <div className="flex-1 grid grid-cols-2 gap-2 pl-2 border-l border-neutral-800/80">
          {/* Wealth */}
          <div className="flex items-center gap-2 p-1.5 rounded-lg bg-neutral-900/60 border border-amber-500/10">
            <div className="p-1 rounded-md bg-amber-950/60 text-amber-400">
              <Coins className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[10px] text-neutral-400 font-serif">财富</div>
              <div className="text-sm font-bold font-mono text-amber-300">{wealthScore}</div>
            </div>
          </div>

          {/* Career */}
          <div className="flex items-center gap-2 p-1.5 rounded-lg bg-neutral-900/60 border border-emerald-500/10">
            <div className="p-1 rounded-md bg-emerald-950/60 text-emerald-400">
              <Briefcase className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[10px] text-neutral-400 font-serif">事业</div>
              <div className="text-sm font-bold font-mono text-emerald-300">{careerScore}</div>
            </div>
          </div>

          {/* Love */}
          <div className="flex items-center gap-2 p-1.5 rounded-lg bg-neutral-900/60 border border-rose-500/10">
            <div className="p-1 rounded-md bg-rose-950/60 text-rose-400">
              <Heart className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[10px] text-neutral-400 font-serif">感情</div>
              <div className="text-sm font-bold font-mono text-rose-300">{loveScore}</div>
            </div>
          </div>

          {/* Nobleman */}
          <div className="flex items-center gap-2 p-1.5 rounded-lg bg-neutral-900/60 border border-purple-500/10">
            <div className="p-1 rounded-md bg-purple-950/60 text-purple-400">
              <Users className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[10px] text-neutral-400 font-serif">贵人</div>
              <div className="text-sm font-bold font-mono text-purple-300">{noblemanScore}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
