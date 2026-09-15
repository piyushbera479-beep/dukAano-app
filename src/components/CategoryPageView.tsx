import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, PRODUCTS, SHOPS } from '../data/mockData';
import { ProductCard } from './ProductCard';
import { ShopCard } from './ShopCard';
import { 
  ArrowLeft, 
  ShoppingBag, 
  Coins, 
  Sparkles, 
  Filter, 
  SlidersHorizontal,
  Store,
  Tag,
  X
} from 'lucide-react';

export const CategoryPageView: React.FC = () => {
  const { 
    selectedCategory, 
    goBack, 
    closeOverlay,
    setIsCartOpen, 
    cartItemCount 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'products' | 'shops'>('products');
  const [filterMode, setFilterMode] = useState<'all' | 'popular' | 'deals'>('all');

  if (!selectedCategory) {
    return (
      <div className="p-8 text-center min-h-screen">
        <p className="text-neutral-500 text-sm">No category selected.</p>
        <button
          onClick={goBack}
          className="mt-3 px-4 py-2 bg-teal-800 text-white rounded-xl text-xs font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  const catConfig = CATEGORIES[selectedCategory];
  const categoryProducts = PRODUCTS.filter((p) => p.category === selectedCategory);
  const categoryShops = SHOPS.filter((s) => s.category === selectedCategory);

  const filteredProducts = categoryProducts.filter((p) => {
    if (filterMode === 'popular') return p.isPopular;
    if (filterMode === 'deals') return p.discountPercent >= 15;
    return true;
  });

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 pb-24 transition-colors">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-teal-800 dark:bg-neutral-900 text-white px-4 py-3 flex items-center justify-between shadow-md border-b dark:border-neutral-800">
        <div className="flex items-center gap-2.5">
          <button
            onClick={goBack}
            className="p-1 rounded-full hover:bg-teal-700 dark:hover:bg-neutral-800 active:bg-teal-900 transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1.5">
            <span className="text-lg">{catConfig?.emoji}</span>
            <h2 className="font-extrabold text-base tracking-tight font-brand">
              {catConfig?.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-full bg-teal-700 dark:bg-neutral-800 text-white cursor-pointer hover:bg-teal-600 dark:hover:bg-neutral-700 transition-colors"
            aria-label="Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-400 text-neutral-900 font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {cartItemCount}
              </span>
            )}
          </button>

          <button
            onClick={closeOverlay}
            className="p-2 rounded-full bg-teal-700 dark:bg-neutral-800 text-white hover:bg-teal-600 dark:hover:bg-neutral-700 transition-colors cursor-pointer flex items-center justify-center"
            title="Close category and return to Home"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Category Hero & Coin Rate Highlight Banner */}
        <div className={`rounded-2xl p-4 shadow-sm border ${
          selectedCategory === 'sanivox'
            ? 'bg-gradient-to-r from-teal-800 via-teal-900 to-cyan-950 text-white border-teal-700 dark:border-neutral-700'
            : selectedCategory === 'care'
            ? 'bg-gradient-to-r from-blue-700 to-indigo-800 text-white border-blue-600 dark:border-blue-700'
            : selectedCategory === 'eats'
            ? 'bg-gradient-to-r from-amber-600 to-orange-700 text-white border-amber-500 dark:border-amber-700'
            : 'bg-gradient-to-r from-emerald-700 to-teal-800 text-white border-emerald-600 dark:border-emerald-700'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-teal-200">
                Category Rate
              </span>
              <h1 className="text-xl font-black font-brand leading-tight mt-0.5">
                {catConfig?.title} {catConfig?.emoji}
              </h1>
            </div>

            <div className="bg-amber-400 text-neutral-950 font-black text-xs px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 fill-neutral-950" />
              <span>{catConfig?.coinRate} Coins / ₹100</span>
            </div>
          </div>

          <p className="text-xs text-neutral-100 mt-2 font-medium">
            {catConfig?.description}
          </p>

          <div className="mt-2.5 pt-2 border-t border-white/20 flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1 font-semibold text-amber-300">
              <Coins className="w-3 h-3 fill-amber-300" />
              <span>100 Coins = ₹10 Discount</span>
            </span>
            <span className="text-white/80">
              {categoryShops.length} Local Stores • {categoryProducts.length} Items
            </span>
          </div>
        </div>

        {/* View Switcher: Products vs Local Stores */}
        <div className="bg-white dark:bg-neutral-900 p-1 rounded-2xl border border-neutral-200 dark:border-neutral-800 grid grid-cols-2 shadow-2xs">
          <button
            onClick={() => setActiveTab('products')}
            className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'products'
                ? 'bg-teal-800 dark:bg-teal-600 text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <span>All Products</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activeTab === 'products' ? 'bg-teal-700 text-teal-100' : 'bg-neutral-100 dark:bg-neutral-800'
            }`}>
              {categoryProducts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('shops')}
            className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'shops'
                ? 'bg-teal-800 dark:bg-teal-600 text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Local Stores</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activeTab === 'shops' ? 'bg-teal-700 text-teal-100' : 'bg-neutral-100 dark:bg-neutral-800'
            }`}>
              {categoryShops.length}
            </span>
          </button>
        </div>

        {/* Product Filters */}
        {activeTab === 'products' && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950'
                  : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800'
              }`}
            >
              All Items ({categoryProducts.length})
            </button>
            <button
              onClick={() => setFilterMode('popular')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                filterMode === 'popular'
                  ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950'
                  : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800'
              }`}
            >
              Popular 🔥
            </button>
            <button
              onClick={() => setFilterMode('deals')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                filterMode === 'deals'
                  ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950'
                  : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800'
              }`}
            >
              Top Deals 🏷️
            </button>
          </div>
        )}

        {/* Content Section */}
        {activeTab === 'products' ? (
          <div>
            {/* Quick mini-reel of shops in this category */}
            {categoryShops.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Neighborhood Stores in {catConfig?.shortTitle}
                  </h3>
                  <button
                    onClick={() => setActiveTab('shops')}
                    className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
                  >
                    View All
                  </button>
                </div>
                <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
                  {categoryShops.map((shop) => (
                    <div key={shop.id} className="w-64 shrink-0">
                      <ShopCard shop={shop} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Products Grid */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white font-brand">
                  Available Products ({filteredProducts.length})
                </h3>
                <span className="text-[11px] text-teal-800 dark:text-teal-400 font-bold">
                  Earn {catConfig?.coinRate} Coins / ₹100
                </span>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 text-center text-xs text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800">
                  No products found for this filter.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Stores List */
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white font-brand">
                Verified Neighborhood Shops
              </h3>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                Delivering in 15-30 mins
              </span>
            </div>

            {categoryShops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
