'use client';

import React, { useState } from 'react';
import Image from 'next/image';
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
  const [imgError, setImgError] = useState(false);
  const suitInfo = formatSuitInfo(card.suit);
  const elementStyle = formatElementColor(card.element);
  const imageSrc = card.image || `/cards/${card.id}.jpg`;

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative rounded-2xl overflow-hidden border-2 transition-all duration-300 select-none shadow-[0_4px_16px_rgba(180,140,50,0.18)]',
        'hover:shadow-[0_10px_30px_rgba(212,175,55,0.4)] hover:-translate-y-1',
        card.suit === 'heart' && 'border-rose-400/60 hover:border-rose-400',
        card.suit === 'diamond' && 'border-amber-400/80 hover:border-amber-300',
        card.suit === 'club' && 'border-emerald-400/60 hover:border-emerald-400',
        card.suit === 'spade' && 'border-purple-400/60 hover:border-purple-400',
        className
      )}
      style={{
        aspectRatio: '2/3.5',
      }}
    >
      {/* 1. Genuine Sacred High-Res Card Artwork Face */}
      {!imgError ? (
        <div className="relative w-full h-full bg-[#0E0C0A]">
          <Image
            src={imageSrc}
            alt={card.cardName || card.name}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
            priority
          />

          {/* Golden Gloss Shimmer Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-amber-200/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

          {/* Delicate Inset Golden Filigree Border */}
          <div className="absolute inset-1 rounded-xl border border-amber-300/30 pointer-events-none" />
        </div>
      ) : (
        /* Fallback Typography Card Face */
        <div className="relative w-full h-full bg-gradient-to-b from-[#FFFFFF] via-[#FAF7F0] to-[#F3EDE0] flex flex-col justify-between p-3">
          <div className="absolute inset-1.5 rounded-xl border border-amber-600/25 pointer-events-none" />

          {/* Top Header */}
          <div className="relative z-10 flex items-start justify-between">
            <div className="flex flex-col items-center">
              <span className={cn('text-lg font-serif font-black leading-none', suitInfo.color)}>
                {card.rank}
              </span>
              <span className={cn('text-xs leading-none mt-0.5', suitInfo.color)}>
                {suitInfo.symbol}
              </span>
            </div>

            <div className="flex flex-col items-end gap-1">
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
            </div>
          </div>

          {/* Center Archetype */}
          <div className="relative z-10 flex flex-col items-center justify-center my-auto text-center px-1">
            <div className="relative w-14 h-14 rounded-full border border-amber-600/40 flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100 mb-1.5 shadow-xs">
              <span className="text-xl font-serif font-extrabold text-amber-900">
                {card.archetype ? card.archetype.charAt(0) : card.cardName.charAt(0)}
              </span>
            </div>
            <h3 className="text-base font-serif font-extrabold text-stone-900">
              {card.cardName}
            </h3>
            <p className="text-[10px] text-amber-800 font-serif font-bold truncate max-w-full">
              【{card.archetype}】
            </p>
          </div>

          {/* Bottom Stars */}
          <div className="relative z-10 flex items-center justify-between text-[9.5px] pt-1 border-t border-amber-900/10">
            <span className="text-amber-800 font-serif font-bold flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5 text-amber-600 fill-amber-600" />
              {card.energyTitle}
            </span>
            <span className="text-stone-400 font-serif text-[8px]">TIANJI 52</span>
          </div>
        </div>
      )}
    </div>
  );
};
