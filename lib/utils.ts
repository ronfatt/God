import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatElementColor(element: string) {
  switch (element) {
    case 'wood':
    case '木':
      return {
        bg: 'bg-emerald-50/95',
        border: 'border-emerald-500/30',
        text: 'text-emerald-900',
        glow: 'shadow-emerald-500/10',
        accent: '#065F46',
      };
    case 'fire':
    case '火':
      return {
        bg: 'bg-rose-50/95',
        border: 'border-rose-500/30',
        text: 'text-rose-900',
        glow: 'shadow-rose-500/10',
        accent: '#9F1239',
      };
    case 'earth':
    case '土':
      return {
        bg: 'bg-amber-50/95',
        border: 'border-amber-600/30',
        text: 'text-amber-950',
        glow: 'shadow-amber-500/10',
        accent: '#B45309',
      };
    case 'metal':
    case '金':
      return {
        bg: 'bg-amber-100/70',
        border: 'border-amber-500/40',
        text: 'text-amber-950',
        glow: 'shadow-amber-400/15',
        accent: '#92400E',
      };
    case 'water':
    case '水':
      return {
        bg: 'bg-cyan-50/95',
        border: 'border-cyan-500/30',
        text: 'text-cyan-950',
        glow: 'shadow-cyan-500/10',
        accent: '#0E7490',
      };
    default:
      return {
        bg: 'bg-stone-50/95',
        border: 'border-stone-300',
        text: 'text-stone-900',
        glow: 'shadow-stone-500/10',
        accent: '#B8860B',
      };
  }
}

export function formatSuitInfo(suit: string) {
  switch (suit) {
    case 'heart':
      return {
        symbol: '♥',
        name: '心界',
        nameEn: 'Heart Realm',
        color: 'text-rose-700',
        border: 'border-rose-300',
        bgGradient: 'from-rose-50/80 to-white',
        accentColor: '#BE123C',
        particleColor: ['#BE123C', '#FB7185', '#FDA4AF', '#D4AF37'],
      };
    case 'diamond':
      return {
        symbol: '♦',
        name: '财界',
        nameEn: 'Diamond Realm',
        color: 'text-amber-700',
        border: 'border-amber-400/50',
        bgGradient: 'from-amber-50/80 to-white',
        accentColor: '#B45309',
        particleColor: ['#B45309', '#FBBF24', '#FDE68A', '#D4AF37'],
      };
    case 'club':
      return {
        symbol: '♣',
        name: '生界',
        nameEn: 'Club Realm',
        color: 'text-emerald-800',
        border: 'border-emerald-400/50',
        bgGradient: 'from-emerald-50/80 to-white',
        accentColor: '#065F46',
        particleColor: ['#065F46', '#34D399', '#6EE7B7', '#D4AF37'],
      };
    case 'spade':
      return {
        symbol: '♠',
        name: '玄界',
        nameEn: 'Spade Realm',
        color: 'text-purple-900',
        border: 'border-purple-300',
        bgGradient: 'from-purple-50/80 to-white',
        accentColor: '#581C87',
        particleColor: ['#581C87', '#C084FC', '#E9D5FF', '#D4AF37'],
      };
    default:
      return {
        symbol: '☯',
        name: '天界',
        nameEn: 'Tian Realm',
        color: 'text-amber-800',
        border: 'border-amber-400',
        bgGradient: 'from-amber-50 to-white',
        accentColor: '#B8860B',
        particleColor: ['#B8860B', '#D4AF37'],
      };
  }
}

export function formatSpreadName(spreadType: string) {
  switch (spreadType) {
    case 'single':
      return '天机一牌 · 随问随占';
    case 'three':
      return '三才神谕 · 天人地时';
    case 'six':
      return '六合命盘 · 全维推演';
    case 'nine':
      return '九宫天命 · 乾坤终局';
    default:
      return '神谕占验';
  }
}
