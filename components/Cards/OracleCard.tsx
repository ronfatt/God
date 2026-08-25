'use client';

import React from 'react';
import { OracleCardData } from '@/types/oracle';
import { cn, formatElementColor, formatSuitInfo } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

interface OracleCardProps {
  card: OracleCardData;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  isCompact?: boolean;
  onClick?: () => void;
  showDetails?: boolean;
}

const TYPE_NAME_MAP: Record<string, string> = {
  deity: '尊神',
  buddha: '如来佛祖',
  bodhisattva: '菩萨摩诃萨',
  immortal: '列位道仙',
  beast: '天机瑞兽',
  artifact: '东方上古法器',
  symbol: '乾坤道宗象征',
};

export const OracleCard: React.FC<OracleCardProps> = ({
  card,
  className,
  size = 'md',
  isCompact = false,
  onClick,
}) => {
  const suitInfo = formatSuitInfo(card.suit);
  const elementStyle = formatElementColor(card.element);

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#FFFFFF] via-[#FAF7F0] to-[#F3EDE0] border border-amber-500/30 flex flex-col justify-between p-3 select-none transition-all duration-300 shadow-[0_4px_16px_rgba(180,140,50,0.12)]',
        'hover:shadow-[0_8px_25px_rgba(212,175,55,0.35)] hover:-translate-y-0.5',
        className
      )}
      style={{
        aspectRatio: '2/3',
      }}
    >
      {/* Background Realm Subtle Radial Tint */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-b opacity-15 pointer-events-none',
          card.gradient
        )}
      />

      {/* Decorative Golden Inset Filigree Border */}
      <div className="absolute inset-1.5 rounded-xl border border-amber-600/25 pointer-events-none" />
      <div className="absolute inset-2 rounded-lg border border-amber-500/10 pointer-events-none" />

      {/* Top Header: Rank, Suit, Realm & YinYang */}
      <div className="relative z-10 flex items-start justify-between">
        {/* Top-Left Rank & Suit */}
        <div className="flex flex-col items-center">
          <span className={cn('text-lg font-serif font-black leading-none', suitInfo.color)}>
            {card.rank}
          </span>
          <span className={cn('text-xs leading-none mt-0.5', suitInfo.color)}>
            {suitInfo.symbol}
          </span>
        </div>

        {/* Top-Right Tags: YinYang & Element */}
        <div className="flex flex-col items-end gap-1">
          {/* YinYang & Element Tag */}
          <div
            className={cn(
              'px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 backdrop-blur-md shadow-xs',
              elementStyle.bg,
              elementStyle.border,
              elementStyle.text
            )}
          >
            <span>{card.elementName}</span>
            <span className="opacity-40">·</span>
            <span>{card.yinYang === 'yang' ? '阳' : '阴'}</span>
            <span className="text-[9px] opacity-70">☯</span>
          </div>

          {/* Realm Name */}
          <span className="text-[9px] text-stone-500 font-serif font-bold tracking-widest">
            {card.realm || suitInfo.name}
          </span>
        </div>
      </div>

      {/* Center Figure & Title */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto text-center px-1">
        {/* Subtle Archetype Seal Circle */}
        <div className="relative w-14 h-14 rounded-full border border-amber-600/40 flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100 mb-1.5 shadow-[0_2px_10px_rgba(212,175,55,0.25)]">
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-amber-400/10 to-transparent blur-xs" />
          <span className="text-xl font-serif font-extrabold text-amber-900 drop-shadow-xs">
            {card.archetype ? card.archetype.charAt(0) : card.cardName.charAt(0)}
          </span>
        </div>

        {/* Card Name */}
        <h3 className="text-base font-serif font-extrabold tracking-wider text-stone-900 leading-tight">
          {card.cardName}
        </h3>

        {/* Archetype Name */}
        <p className="text-[10px] text-amber-800 font-serif font-bold tracking-wider truncate max-w-full px-2 mt-0.5">
          【{card.archetype}】
        </p>

        {/* Archetype Label / Type */}
        <span className="mt-1 px-1.5 py-0.2 rounded-full bg-amber-50 border border-amber-300/60 text-[8px] text-stone-600 font-serif font-medium">
          {TYPE_NAME_MAP[card.type] || card.type}
        </span>
      </div>

      {/* Bottom Section: Energy Stars & Keywords */}
      <div className="relative z-10 flex flex-col gap-1 pt-1 border-t border-amber-900/10">
        {/* Energy Rating & Title */}
        <div className="flex items-center justify-between text-[9.5px]">
          <span className="text-amber-800 font-serif font-bold flex items-center gap-0.5">
            <Sparkles className="w-2.5 h-2.5 text-amber-600 fill-amber-600" />
            {card.energyTitle}
          </span>

          {/* Stars */}
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={cn(
                  'text-[9px] leading-none',
                  star <= card.energyLevel ? 'text-amber-600 drop-shadow-xs' : 'text-stone-300'
                )}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        {/* Keywords */}
        {!isCompact && (
          <div className="flex items-center justify-center gap-1 flex-wrap">
            {card.keywords.slice(0, 3).map((kw, i) => (
              <span
                key={i}
                className="text-[8.5px] px-1.5 py-0.2 rounded-md bg-stone-100/90 text-stone-700 font-serif border border-stone-200/80"
              >
                {kw}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Logo Footnote */}
      <div className="text-[7.5px] tracking-[0.25em] text-amber-800/40 text-center font-serif uppercase pt-0.5">
        TIANJI 52
      </div>
    </div>
  );
};
