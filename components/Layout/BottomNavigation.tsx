'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Sparkles, Clock, User, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { sound } from '@/lib/sound';

export const BottomNavigation: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: '首页', icon: Compass, match: ['/'] },
    { href: '/question', label: '抽牌', icon: Sparkles, match: ['/question', '/spread', '/draw'] },
    { href: '/cards', label: '图鉴', icon: Layers, match: ['/cards'] },
    { href: '/history', label: '记录', icon: Clock, match: ['/history'] },
    { href: '/profile', label: '我的', icon: User, match: ['/profile'] },
  ];

  const handleNavClick = () => {
    sound.playCardSelect();
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto px-3 pb-5 pt-2 glass-panel-dark border-t border-amber-500/20 backdrop-blur-xl shadow-[0_-4px_25px_rgba(180,140,50,0.08)]">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = item.match.some((path) =>
            path === '/' ? pathname === '/' : pathname.startsWith(path)
          );
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleNavClick}
              className={cn(
                'relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-300',
                isActive ? 'text-amber-800 scale-105' : 'text-stone-500 hover:text-stone-800'
              )}
            >
              {/* Active Golden Aura Glow */}
              {isActive && (
                <div className="absolute inset-0 -top-1 rounded-xl bg-gradient-to-t from-amber-500/15 to-transparent blur-sm pointer-events-none" />
              )}
              
              <div className="relative">
                <Icon className={cn('w-5 h-5 transition-transform duration-300', isActive ? 'stroke-[2.5] scale-110 text-amber-800 drop-shadow-[0_2px_4px_rgba(212,175,55,0.4)]' : 'text-stone-500')} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-600 shadow-[0_0_6px_#B8860B]" />
                )}
              </div>
              <span className={cn('text-[11px] mt-1 font-serif tracking-wider', isActive ? 'font-bold text-amber-900' : 'text-stone-500')}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
