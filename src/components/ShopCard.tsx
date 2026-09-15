import React from 'react';
import { Shop } from '../types';
import { useApp } from '../context/AppContext';
import { Star, Clock, MapPin, ChevronRight, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';

interface ShopCardProps {
  shop: Shop;
}

export const ShopCard: React.FC<ShopCardProps> = ({ shop }) => {
  const { openShop } = useApp();
  const catConfig = CATEGORIES[shop.category];

  return (
    <div
      onClick={() => openShop(shop)}
      className="group bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 hover:border-teal-300 dark:hover:border-neutral-700 shadow-2xs hover:shadow-xs p-3 transition-all cursor-pointer touch-press flex gap-3 items-center"
    >
      {/* Shop Image */}
      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0">
        <img
          src={shop.image}
          alt={shop.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        {shop.featured && (
          <span className="absolute top-1 left-1 bg-amber-400 text-neutral-950 text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs">
            TOP
          </span>
        )}
      </div>

      {/* Shop Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
            {catConfig?.emoji} {catConfig?.shortTitle}
          </span>
          {shop.category === 'sanivox' && (
            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 flex items-center gap-0.5 border dark:border-teal-800">
              <Sparkles className="w-2.5 h-2.5" /> 10 Coins/₹100
            </span>
          )}
        </div>

        <h4 className="font-bold text-sm text-neutral-900 dark:text-white truncate group-hover:text-teal-800 dark:group-hover:text-teal-400 transition-colors">
          {shop.name}
        </h4>

        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
          {shop.tagline}
        </p>

        {/* Rating, Distance, Time */}
        <div className="flex items-center gap-2.5 mt-2 text-[11px] text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded">
            <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
            <span>{shop.rating}</span>
            <span className="text-[10px] text-neutral-400 font-normal">({shop.ratingCount})</span>
          </div>

          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-neutral-400" />
            <span>{shop.distance}</span>
          </div>

          <div className="flex items-center gap-1 text-teal-700 dark:text-teal-400 font-medium">
            <Clock className="w-3 h-3" />
            <span>{shop.deliveryTime}</span>
          </div>
        </div>
      </div>

      <ChevronRight className="w-4 h-4 text-neutral-400 dark:text-neutral-500 group-hover:text-teal-700 dark:group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all shrink-0" />
    </div>
  );
};
