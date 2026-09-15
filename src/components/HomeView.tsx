import React from 'react';
import { useApp } from '../context/AppContext';
import { CategoryCards } from './CategoryCards';
import { ProductCard } from './ProductCard';
import { ShopCard } from './ShopCard';
import { FallingProductsDiscovery } from './FallingProductsDiscovery';
import { PRODUCTS, SHOPS, CATEGORIES } from '../data/mockData';
import { 
  Flame, 
  Tag, 
  Sparkles, 
  Store, 
  Clock, 
  ArrowRight, 
  Search, 
  X,
  ShieldCheck 
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { searchQuery, setSearchQuery, openCategory, openShop, navigateTo, setActiveTab } = useApp();

  // Filter if user has entered a search query
  const isSearching = searchQuery.trim().length > 0;
  const searchLower = searchQuery.toLowerCase().trim();

  const searchFilteredProducts = PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(searchLower) ||
      p.shopName.toLowerCase().includes(searchLower) ||
      p.categoryName.toLowerCase().includes(searchLower) ||
      (p.brand && p.brand.toLowerCase().includes(searchLower))
  );

  const searchFilteredShops = SHOPS.filter(
    (s) =>
      s.name.toLowerCase().includes(searchLower) ||
      s.categoryName.toLowerCase().includes(searchLower) ||
      s.tagline.toLowerCase().includes(searchLower) ||
      s.address.toLowerCase().includes(searchLower)
  );

  // Home curated sections
  const popularProducts = PRODUCTS.filter((p) => p.isPopular);
  const topDealsProducts = PRODUCTS.filter((p) => p.isTopDeal || p.discountPercent >= 20);
  const recentlyAddedProducts = PRODUCTS.filter((p) => p.isRecentlyAdded);
  const popularShops = SHOPS.filter((s) => s.featured);

  if (isSearching) {
    return (
      <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 pb-28 transition-colors">
        <div className="max-w-md mx-auto p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-neutral-900 dark:text-white font-brand flex items-center gap-1.5">
              <Search className="w-4 h-4 text-teal-700 dark:text-teal-400" />
              <span>Search results for "{searchQuery}"</span>
            </h2>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>

          {/* Matching Shops */}
          {searchFilteredShops.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Matching Stores ({searchFilteredShops.length})
              </h3>
              <div className="space-y-2">
                {searchFilteredShops.map((shop) => (
                  <ShopCard key={shop.id} shop={shop} />
                ))}
              </div>
            </div>
          )}

          {/* Matching Products */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Matching Products ({searchFilteredProducts.length})
            </h3>
            {searchFilteredProducts.length === 0 && searchFilteredShops.length === 0 ? (
              <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 text-center border border-neutral-200 dark:border-neutral-800">
                <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">No items found</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Try searching for Atta, Dal, SANIVOX, Chai, Biryani, or Dettol
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {searchFilteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 pb-28 transition-colors relative overflow-hidden">
      {/* Falling Products Discovery Layer with Shake & Tap Support */}
      <FallingProductsDiscovery />

      <div className="max-w-md mx-auto space-y-3 relative z-10">
        {/* Four Large Category Cards (Grocery 🛒, DUKAANO Care 💊, DUKAANO Eats 🍛, SANIVOX 🧴) */}
        <CategoryCards />

        {/* SANIVOX High-Coin Feature Reel */}
        <div className="px-4 py-1">
          <div 
            onClick={() => openCategory('sanivox')}
            className="rounded-2xl p-3 bg-gradient-to-r from-teal-900 via-teal-800 to-cyan-900 text-white shadow-xs border border-teal-700 dark:border-neutral-700 flex items-center justify-between cursor-pointer touch-press"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-neutral-950 flex items-center justify-center font-black text-xl shadow-xs">
                🧴
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-white font-brand">SANIVOX Cleaning Essentials</span>
                  <span className="bg-amber-400 text-neutral-950 text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">
                    Direct
                  </span>
                </div>
                <p className="text-[11px] text-teal-100">
                  Hospital-grade floor cleaners, disinfectants & hygiene products
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-amber-300 shrink-0" />
          </div>
        </div>

        {/* SECTION: Popular Near You */}
        <section className="px-4 py-2">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-lg bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 flex items-center justify-center">
                <Flame className="w-3.5 h-3.5 fill-rose-600 text-rose-600 dark:fill-rose-400 dark:text-rose-400" />
              </div>
              <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white font-brand tracking-tight">
                Popular Near You
              </h3>
            </div>
            <span className="text-[11px] font-bold text-teal-800 dark:text-teal-400">
              Top kiranas & items
            </span>
          </div>

          {/* Popular Stores Reel */}
          <div className="space-y-2 mb-3">
            {popularShops.slice(0, 2).map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>

          {/* Popular Products 2-Column Grid */}
          <div className="grid grid-cols-2 gap-3">
            {popularProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* SECTION: Top Deals */}
        <section className="px-4 py-2">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                <Tag className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white font-brand tracking-tight">
                  Top Deals
                </h3>
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium block">
                  Up to 34% Off MRP + DUKAANO Coins
                </span>
              </div>
            </div>
            <span className="text-[10px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              Limited Stock
            </span>
          </div>

          {/* Horizontal Scrolling Deals Carousel */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {topDealsProducts.map((product) => (
              <div key={product.id} className="w-44 shrink-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>

        {/* SECTION: Recently Added */}
        <section className="px-4 py-2">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white font-brand tracking-tight">
                  Recently Added
                </h3>
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium block">
                  Fresh arrivals in your locality
                </span>
              </div>
            </div>
            <span className="text-[11px] font-bold text-teal-800 dark:text-teal-400">
              Verified
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {recentlyAddedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Follow & Earn D Coins Banner */}
        <div className="px-4">
          <div 
            onClick={() => {
              setActiveTab('coins');
              navigateTo('coins');
            }}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-teal-900 to-neutral-900 text-white flex items-center justify-between shadow-sm cursor-pointer hover:opacity-95 transition-all border border-teal-800/60 touch-press"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-neutral-950 flex items-center justify-center font-black shadow-xs shrink-0">
                🪙
              </div>
              <div>
                <span className="text-xs font-black text-amber-300 flex items-center gap-1.5 font-brand">
                  <span>Follow & Earn D Coins</span>
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded font-sans">
                    +200 Coins
                  </span>
                </span>
                <p className="text-[11px] text-neutral-300 mt-0.5">
                  Follow on Instagram & Facebook • Rate us on Google
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-amber-300 shrink-0">
              <span>Earn</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Trust Badges for Local Indian Market */}
        <div className="px-4 pt-3 pb-4">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-3.5 flex items-center justify-around text-center text-[10px] text-neutral-600 dark:text-neutral-400">
            <div>
              <div className="w-8 h-8 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 flex items-center justify-center mx-auto mb-1 font-bold">
                ⚡
              </div>
              <span className="font-bold text-neutral-900 dark:text-white block">25-35 Mins</span>
              <span>Fast Delivery</span>
            </div>

            <div className="h-8 w-px bg-neutral-200 dark:bg-neutral-800" />

            <div>
              <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 flex items-center justify-center mx-auto mb-1 font-bold">
                🪙
              </div>
              <span className="font-bold text-neutral-900 dark:text-white block">Coin Rewards</span>
              <span>Up to 10/₹100</span>
            </div>

            <div className="h-8 w-px bg-neutral-200 dark:bg-neutral-800" />

            <div>
              <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center mx-auto mb-1 font-bold">
                💵
              </div>
              <span className="font-bold text-neutral-900 dark:text-white block">Cash on Delivery</span>
              <span>Pay at Door</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
