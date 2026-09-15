import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PRODUCTS, CATEGORIES } from '../data/mockData';
import { ProductCard } from './ProductCard';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Clock, 
  Coins, 
  Share2, 
  ShoppingBag,
  Info,
  X
} from 'lucide-react';

export const ShopDetailView: React.FC = () => {
  const { selectedShop, goBack, closeOverlay, setIsCartOpen, cartItemCount } = useApp();
  const [activeFilter, setActiveFilter] = useState<'all' | 'deals'>('all');

  if (!selectedShop) {
    return (
      <div className="p-8 text-center min-h-screen">
        <p className="text-neutral-500 text-sm">Shop not found.</p>
        <button
          onClick={goBack}
          className="mt-3 px-4 py-2 bg-teal-800 text-white rounded-xl text-xs font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  const shopProducts = PRODUCTS.filter((p) => p.shopId === selectedShop.id);
  const displayedProducts = activeFilter === 'deals' 
    ? shopProducts.filter((p) => p.discountPercent > 15) 
    : shopProducts;

  const catConfig = CATEGORIES[selectedShop.category];

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 pb-24 transition-colors">
      {/* Top Floating App Bar */}
      <div className="sticky top-0 z-30 bg-teal-800 dark:bg-neutral-900 text-white px-4 py-3 flex items-center justify-between shadow-md border-b dark:border-neutral-800">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={goBack}
            className="p-1 rounded-full hover:bg-teal-700 dark:hover:bg-neutral-800 active:bg-teal-900 transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="truncate">
            <h2 className="font-extrabold text-sm tracking-tight truncate font-brand">
              {selectedShop.name}
            </h2>
            <p className="text-[11px] text-teal-200 dark:text-neutral-400 truncate">
              {selectedShop.distance} • {selectedShop.deliveryTime}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-full bg-teal-700 dark:bg-neutral-800 text-white cursor-pointer hover:bg-teal-600 dark:hover:bg-neutral-700 transition-colors"
            aria-label="Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-400 text-neutral-900 font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>

          <button
            onClick={closeOverlay}
            className="p-2 rounded-full bg-teal-700 dark:bg-neutral-800 text-white hover:bg-teal-600 dark:hover:bg-neutral-700 transition-colors cursor-pointer flex items-center justify-center"
            title="Close shop and return to Home"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {/* Shop Cover Banner */}
        <div className="relative h-44 bg-neutral-200 dark:bg-neutral-800">
          <img
            src={selectedShop.image}
            alt={selectedShop.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Category Chip */}
          <div className="absolute top-3 left-3 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xs px-2.5 py-1 rounded-lg text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1 shadow-xs border dark:border-neutral-700">
            <span>{catConfig?.emoji}</span>
            <span>{catConfig?.title}</span>
          </div>

          <div className="absolute bottom-3 left-4 right-4 text-white">
            <h1 className="text-lg font-black font-brand leading-tight drop-shadow-xs">
              {selectedShop.name}
            </h1>
            <p className="text-xs text-neutral-200 drop-shadow-xs">
              {selectedShop.tagline}
            </p>
          </div>
        </div>

        {/* Shop Info Card */}
        <div className="p-4 space-y-3">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-3.5 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-1 rounded-lg border border-amber-200 dark:border-amber-800">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>{selectedShop.rating}</span>
                <span className="text-neutral-400 font-normal">({selectedShop.ratingCount} reviews)</span>
              </div>

              <div className="flex items-center gap-1 text-teal-800 dark:text-teal-400 font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>{selectedShop.deliveryTime}</span>
              </div>

              <div className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                <span>{selectedShop.distance}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 flex items-center justify-between">
              <span className="truncate max-w-[240px]">{selectedShop.address}</span>
              <span className="font-semibold text-emerald-700 dark:text-emerald-400 shrink-0">Min Order ₹{selectedShop.minOrder}</span>
            </div>

            {/* Coin Earning Note */}
            <div className="bg-gradient-to-r from-amber-500/15 to-yellow-400/20 dark:from-amber-950/40 dark:to-yellow-950/30 border border-amber-300/80 dark:border-amber-800/80 rounded-xl p-2.5 flex items-center justify-between text-xs text-amber-950 dark:text-amber-200 font-bold">
              <div className="flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-amber-600 dark:text-amber-400 fill-amber-500" />
                <span>Reward: {catConfig?.coinRate} Coins per ₹100</span>
              </div>
              <span className="text-[10px] bg-amber-400 text-neutral-950 px-2 py-0.5 rounded-full font-black">
                100 Coins = ₹10
              </span>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-teal-800 dark:bg-teal-600 text-white shadow-xs'
                  : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800'
              }`}
            >
              All Items ({shopProducts.length})
            </button>
            <button
              onClick={() => setActiveFilter('deals')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'deals'
                  ? 'bg-teal-800 dark:bg-teal-600 text-white shadow-xs'
                  : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800'
              }`}
            >
              Top Deals 🏷️
            </button>
          </div>

          {/* Products from this shop */}
          <div className="space-y-2.5">
            {displayedProducts.length === 0 ? (
              <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 text-center text-xs text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800">
                No items matching filter in this shop.
              </div>
            ) : (
              displayedProducts.map((product) => (
                <ProductCard key={product.id} product={product} variant="horizontal" />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
