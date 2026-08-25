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
        'relative rounded-xl overflow-hidden bg-gradient-to-b from-[#161a24] via-[#0d1017] to-[#06070a] border flex flex-col justify-between p-3 select-none transition-all duration-300',
        suitInfo.border,
        'hover:shadow-[0_0_20px_rgba(212,175,55,0.25)]',
        className
      )}
      style={{
        aspectRatio: '2/3',
      }}
    >
      {/* Background Realm Radial Tint */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-b opacity-40 pointer-events-none',
          card.gradient
        )}
      />

      {/* Decorative Golden Inset Border */}
      <div className="absolute inset-1.5 rounded-lg border border-amber-500/20 pointer-events-none" />

      {/* Top Header: Rank, Suit, Realm & YinYang */}
      <div className="relative z-10 flex items-start justify-between">
        {/* Top-Left Rank & Suit */}
        <div className="flex flex-col items-center">
          <span className={cn('text-lg font-serif font-bold leading-none', suitInfo.color)}>
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
              'px-2 py-0.5 rounded-full text-[10px] font-medium border flex items-center gap-1 backdrop-blur-md',
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
          <span className="text-[9px] text-neutral-400 font-serif tracking-widest">
            {card.realm || suitInfo.name}
          </span>
        </div>
      </div>

      {/* Center Figure & Title */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto text-center px-1">
        {/* Subtle Archetype Seal Circle */}
        <div className="relative w-14 h-14 rounded-full border border-amber-400/30 flex items-center justify-center bg-black/40 mb-1.5 shadow-[0_0_15px_rgba(0,0,0,0.8)]">
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-amber-500/10 to-transparent blur-sm" />
          <span className="text-xl font-serif text-amber-200 drop-shadow-[0_0_10px_rgba(212,175,55,0.6)]">
            {card.archetype ? card.archetype.charAt(0) : card.cardName.charAt(0)}
          </span>
        </div>

        {/* Card Name */}
        <h3 className="text-base font-serif font-bold tracking-wider text-amber-100 drop-shadow-sm leading-tight">
          {card.cardName}
        </h3>

        {/* Archetype Name */}
        <p className="text-[10px] text-amber-300/90 font-serif tracking-wider truncate max-w-full px-2 mt-0.5">
          【{card.archetype}】
        </p>

        {/* Archetype Label / Type */}
        <span className="mt-1 px-1.5 py-0.2 rounded bg-neutral-900/80 border border-neutral-700/50 text-[8px] text-neutral-400 font-serif">
          {TYPE_NAME_MAP[card.type] || card.type}
        </span>
      </div>

      {/* Bottom Section: Energy Stars & Keywords */}
      <div className="relative z-10 flex flex-col gap-1 pt-1 border-t border-neutral-800/80">
        {/* Energy Rating & Title */}
        <div className="flex items-center justify-between text-[9.5px]">
          <span className="text-amber-400 font-serif font-medium flex items-center gap-0.5">
            <Sparkles className="w-2.5 h-2.5 text-amber-400" />
            {card.energyTitle}
          </span>

          {/* Stars */}
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={cn(
                  'text-[9px] leading-none',
                  star <= card.energyLevel ? 'text-amber-400 drop-shadow-[0_0_3px_#D4AF37]' : 'text-neutral-700'
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
            {card.keywords.slice(0, 3).map((kw, idx) => (
              <span
                key={idx}
                className="text-[8.5px] px-1.5 py-0.2 rounded bg-neutral-900/60 text-neutral-300 font-serif border border-neutral-800/80"
              >
                {kw}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
