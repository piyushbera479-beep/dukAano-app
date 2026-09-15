import React from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';
import { CategoryType } from '../types';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const CategoryCards: React.FC = () => {
  const { openCategory } = useApp();

  const categoryList: CategoryType[] = ['grocery', 'care', 'eats', 'sanivox'];

  return (
    <section className="px-4 py-3">
      <div className="flex items-center justify-between mb-2.5">
        <div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-1.5 font-brand">
            Shop by Category
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Select to explore neighborhood stores & products
          </p>
        </div>
      </div>

      {/* 2x2 Android Grid for the 4 Large Category Cards */}
      <div className="grid grid-cols-2 gap-3">
        {categoryList.map((catKey) => {
          const cat = CATEGORIES[catKey];
          const isSanivox = catKey === 'sanivox';

          return (
            <button
              key={cat.id}
              onClick={() => openCategory(catKey)}
              className={`group relative overflow-hidden rounded-2xl p-3.5 text-left transition-all duration-200 shadow-sm hover:shadow-md border touch-press flex flex-col justify-between min-h-[140px] cursor-pointer ${
                isSanivox
                  ? 'bg-gradient-to-br from-teal-700 via-teal-800 to-cyan-900 dark:from-teal-900 dark:via-teal-950 dark:to-cyan-950 text-white border-teal-600 dark:border-teal-700 ring-2 ring-teal-500/30'
                  : catKey === 'grocery'
                  ? 'bg-gradient-to-br from-emerald-50 to-teal-50/60 dark:from-emerald-950/50 dark:to-teal-950/40 text-neutral-900 dark:text-white border-emerald-200/80 dark:border-emerald-800/80 hover:border-emerald-300'
                  : catKey === 'care'
                  ? 'bg-gradient-to-br from-blue-50 to-indigo-50/60 dark:from-blue-950/50 dark:to-indigo-950/40 text-neutral-900 dark:text-white border-blue-200/80 dark:border-blue-800/80 hover:border-blue-300'
                  : 'bg-gradient-to-br from-amber-50 to-orange-50/60 dark:from-amber-950/50 dark:to-orange-950/40 text-neutral-900 dark:text-white border-amber-200/80 dark:border-amber-800/80 hover:border-amber-300'
              }`}
            >
              {/* Background decorative watermark */}
              <span className="absolute -bottom-2 -right-1 text-5xl opacity-15 select-none pointer-events-none transition-transform group-hover:scale-110">
                {cat.emoji}
              </span>

              {/* Card Top: Emoji & Coin Badge */}
              <div className="flex items-start justify-between gap-1 relative z-10">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-2xl shadow-xs ${
                  isSanivox ? 'bg-white/15 backdrop-blur-xs' : 'bg-white dark:bg-neutral-800/90 shadow-xs'
                }`}>
                  <span>{cat.emoji}</span>
                </div>

                {/* Coin earning badge */}
                <div
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs whitespace-nowrap ${
                    isSanivox
                      ? 'bg-amber-400 text-neutral-950 ring-1 ring-amber-300'
                      : catKey === 'care'
                      ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                      : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  }`}
                >
                  {isSanivox && <Sparkles className="w-2.5 h-2.5 text-neutral-950 fill-neutral-950" />}
                  <span>{cat.coinRate} Coins / ₹100</span>
                </div>
              </div>

              {/* Card Bottom: Title, Subtitle, and Forward Arrow */}
              <div className="relative z-10 mt-3">
                <div className="flex items-center justify-between">
                  <h3 className={`font-extrabold text-base tracking-tight font-brand ${
                    isSanivox ? 'text-white' : 'text-neutral-900 dark:text-white'
                  }`}>
                    {cat.title}
                  </h3>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-0.5 ${
                    isSanivox ? 'bg-white/20 text-white' : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 shadow-2xs'
                  }`}>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                <p className={`text-[11px] mt-0.5 line-clamp-1 ${
                  isSanivox ? 'text-teal-100 font-medium' : 'text-neutral-500 dark:text-neutral-400'
                }`}>
                  {catKey === 'grocery' && 'Kiranas, Atta, Dal & Milk'}
                  {catKey === 'care' && 'Pharmacies & Wellness'}
                  {catKey === 'eats' && 'Dhabas, Chai & Biryani'}
                  {catKey === 'sanivox' && 'Hospital-grade Cleaners'}
                </p>

                {isSanivox && (
                  <div className="mt-1.5 flex items-center gap-1 text-[10px] text-amber-300 font-bold">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Highest Coin Rewards</span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
