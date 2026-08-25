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
        bg: 'bg-emerald-950/60',
        border: 'border-emerald-500/40',
        text: 'text-emerald-300',
        glow: 'shadow-emerald-500/20',
        accent: '#10B981',
      };
    case 'fire':
    case '火':
      return {
        bg: 'bg-rose-950/60',
        border: 'border-rose-500/40',
        text: 'text-rose-300',
        glow: 'shadow-rose-500/20',
        accent: '#F43F5E',
      };
    case 'earth':
    case '土':
      return {
        bg: 'bg-amber-950/60',
        border: 'border-amber-500/40',
        text: 'text-amber-300',
        glow: 'shadow-amber-500/20',
        accent: '#F59E0B',
      };
    case 'metal':
    case '金':
      return {
        bg: 'bg-yellow-950/60',
        border: 'border-yellow-400/50',
        text: 'text-yellow-200',
        glow: 'shadow-yellow-400/30',
        accent: '#EAB308',
      };
    case 'water':
    case '水':
      return {
        bg: 'bg-cyan-950/60',
        border: 'border-cyan-500/40',
        text: 'text-cyan-300',
        glow: 'shadow-cyan-500/20',
        accent: '#06B6D4',
      };
    default:
      return {
        bg: 'bg-neutral-900/60',
        border: 'border-neutral-500/40',
        text: 'text-neutral-300',
        glow: 'shadow-neutral-500/20',
        accent: '#D4AF37',
      };
  }
}

export function formatSuitInfo(suit: string) {
  switch (suit) {
    case 'heart':
      return {
        symbol: '♥',
        name: '心界',
        nameEn: 'Love Realm',
        color: 'text-rose-400',
        border: 'border-rose-500/40',
        bgGradient: 'from-rose-950/50 to-neutral-950',
        accentColor: '#E11D48',
        particleColor: ['#E11D48', '#FB7185', '#FDA4AF', '#D4AF37'],
      };
    case 'diamond':
      return {
        symbol: '♦',
        name: '财界',
        nameEn: 'Wealth Realm',
        color: 'text-amber-300',
        border: 'border-amber-500/40',
        bgGradient: 'from-amber-950/50 to-neutral-950',
        accentColor: '#F59E0B',
        particleColor: ['#F59E0B', '#FBBF24', '#FDE68A', '#D4AF37'],
      };
    case 'club':
      return {
        symbol: '♣',
        name: '生界',
        nameEn: 'Growth Realm',
        color: 'text-emerald-400',
        border: 'border-emerald-500/40',
        bgGradient: 'from-emerald-950/50 to-neutral-950',
        accentColor: '#10B981',
        particleColor: ['#10B981', '#34D399', '#6EE7B7', '#D4AF37'],
      };
    case 'spade':
      return {
        symbol: '♠',
        name: '玄界',
        nameEn: 'Destiny Realm',
        color: 'text-purple-400',
        border: 'border-purple-500/40',
        bgGradient: 'from-purple-950/50 to-neutral-950',
        accentColor: '#A855F7',
        particleColor: ['#A855F7', '#C084FC', '#E879F9', '#38BDF8'],
      };
    default:
      return {
        symbol: '✦',
        name: '神谕',
        nameEn: 'Oracle',
        color: 'text-yellow-400',
        border: 'border-yellow-500/40',
        bgGradient: 'from-yellow-950/50 to-neutral-950',
        accentColor: '#D4AF37',
        particleColor: ['#D4AF37', '#F3E5AB'],
      };
  }
}
