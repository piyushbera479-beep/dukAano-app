import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  Share2, 
  Star, 
  Store, 
  Coins, 
  Plus, 
  Minus, 
  Check, 
  ShieldCheck, 
  Sparkles,
  Truck,
  Heart,
  X,
  ShoppingBag
} from 'lucide-react';
import { CATEGORIES } from '../data/mockData';

export const ProductDetailView: React.FC = () => {
  const { 
    selectedProduct, 
    goBack, 
    cart, 
    addToCart, 
    openShop, 
    setIsCartOpen,
    cartItemCount,
    toggleWishlist,
    isWishlisted,
    setActiveTab
  } = useApp();

  if (!selectedProduct) {
    return (
      <div className="p-8 text-center min-h-screen">
        <p className="text-neutral-500 text-sm">Product not found.</p>
        <button
          onClick={goBack}
          className="mt-3 px-4 py-2 bg-teal-800 text-white rounded-xl text-xs font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  const cartItem = cart.find((item) => item.product.id === selectedProduct.id);
  const quantity = cartItem?.quantity || 0;

  const catConfig = CATEGORIES[selectedProduct.category];
  const coinRate = catConfig ? catConfig.coinRate : 3;
  const singleItemCoins = Math.max(1, Math.floor((selectedProduct.price * coinRate) / 100));

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 pb-44 transition-colors">
      {/* Top Floating App Bar */}
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800 px-4 py-3 flex items-center justify-between shadow-2xs">
        <button
          onClick={goBack}
          className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
          title="Go Back"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 truncate max-w-[180px]">
          {selectedProduct.brand || selectedProduct.categoryName}
        </span>

        <div className="flex items-center gap-1">
          <button 
            onClick={() => toggleWishlist(selectedProduct.id)}
            className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label={isWishlisted(selectedProduct.id) ? "Remove from saved" : "Save item"}
          >
            <Heart 
              className={`w-5 h-5 transition-colors ${
                isWishlisted(selectedProduct.id) 
                  ? 'fill-rose-500 text-rose-500' 
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-rose-500'
              }`} 
            />
          </button>

          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
            aria-label="Open Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-400 text-neutral-950 font-black text-[9px] min-w-4 h-4 rounded-full flex items-center justify-center shadow-2xs">
                {cartItemCount}
              </span>
            )}
          </button>

          <button 
            onClick={() => setActiveTab('home')}
            className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
            title="Close and return to Home"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {/* Product Image Section */}
        <div className="relative aspect-4/3 bg-white dark:bg-neutral-900 border-b border-neutral-200/80 dark:border-neutral-800 overflow-hidden">
          <img
            src={selectedProduct.image}
            alt={selectedProduct.name}
            className="w-full h-full object-cover"
            loading="eager"
            referrerPolicy="no-referrer"
          />

          {/* Discount Badge */}
          {selectedProduct.discountPercent > 0 && (
            <div className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-sm">
              {selectedProduct.discountPercent}% OFF
            </div>
          )}

          {/* Category Tag */}
          <div className="absolute top-3 right-3 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xs text-xs font-bold text-neutral-800 dark:text-neutral-200 px-2.5 py-1 rounded-lg shadow-2xs border border-neutral-200/50 dark:border-neutral-700">
            {catConfig?.emoji} {catConfig?.title}
          </div>
        </div>

        {/* Product Info Section */}
        <div className="p-4 space-y-4">
          <div>
            {/* Shop source */}
            <div className="flex items-center gap-1.5 text-xs text-teal-800 dark:text-teal-400 font-semibold mb-1">
              <Store className="w-3.5 h-3.5" />
              <span>Available at {selectedProduct.shopName}</span>
            </div>

            <h1 className="text-lg font-extrabold text-neutral-900 dark:text-white leading-snug font-brand">
              {selectedProduct.name}
            </h1>

            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-medium">
              Pack Size: <span className="text-neutral-800 dark:text-neutral-200 font-bold">{selectedProduct.unit}</span>
            </p>

            {/* Rating and Reviews */}
            <div className="mt-2.5 flex items-center gap-3">
              <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 px-2 py-0.5 rounded-lg text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>{selectedProduct.rating}</span>
                <span className="text-neutral-400 font-normal">({selectedProduct.reviewsCount} reviews)</span>
              </div>

              <div className="flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Genuine Quality</span>
              </div>
            </div>
          </div>

          {/* DUKAANO Coins Earning Highlight */}
          <div className={`p-3.5 rounded-2xl border shadow-2xs flex items-center justify-between ${
            selectedProduct.category === 'sanivox'
              ? 'bg-gradient-to-r from-teal-800 to-cyan-900 dark:from-teal-900 dark:to-cyan-950 text-white border-teal-600 dark:border-teal-700'
              : 'bg-gradient-to-r from-amber-50 to-amber-100/60 dark:from-amber-950/50 dark:to-amber-900/30 text-neutral-900 dark:text-white border-amber-300 dark:border-amber-800'
          }`}>
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                selectedProduct.category === 'sanivox' ? 'bg-amber-400 text-neutral-950' : 'bg-amber-500 text-neutral-950'
              }`}>
                <Coins className="w-5 h-5 fill-current" />
              </div>
              <div>
                <p className={`text-xs font-black ${
                  selectedProduct.category === 'sanivox' ? 'text-amber-300' : 'text-amber-950 dark:text-amber-300'
                }`}>
                  Earn +{singleItemCoins} DUKAANO Coins
                </p>
                <p className={`text-[11px] ${
                  selectedProduct.category === 'sanivox' ? 'text-teal-100' : 'text-neutral-600 dark:text-neutral-400'
                }`}>
                  {coinRate} coins per ₹100 • 100 coins = ₹10 off!
                </p>
              </div>
            </div>

            {selectedProduct.category === 'sanivox' && (
              <span className="bg-amber-400 text-neutral-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                10x Super Saver
              </span>
            )}
          </div>

          {/* Highlights */}
          {selectedProduct.highlights && selectedProduct.highlights.length > 0 && (
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 shadow-2xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                Key Highlights
              </h3>
              <ul className="space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300">
                {selectedProduct.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400 shrink-0" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Description */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 shadow-2xs space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Product Overview
            </h3>
            <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {selectedProduct.description}
            </p>

            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-2 text-[11px] text-neutral-500 dark:text-neutral-400">
              <Truck className="w-4 h-4 text-teal-700 dark:text-teal-400" />
              <span>Delivered in 20-30 mins from neighborhood store</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar docked above BottomNav */}
      <div className="fixed bottom-[58px] left-0 right-0 z-40 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-t border-neutral-200/90 dark:border-neutral-800 px-4 py-2.5 shadow-md">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-neutral-900 dark:text-white font-brand">
                ₹{selectedProduct.price}
              </span>
              {selectedProduct.mrp > selectedProduct.price && (
                <span className="text-xs text-neutral-400 line-through">
                  ₹{selectedProduct.mrp}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold block">
              Inclusive of all taxes
            </span>
          </div>

          {/* Quantity Controls / Add to cart */}
          <div className="flex-1 max-w-[180px]">
            {quantity === 0 ? (
              <button
                onClick={() => addToCart(selectedProduct, 1)}
                className="w-full py-2.5 bg-teal-800 hover:bg-teal-900 active:bg-teal-950 text-white rounded-xl font-extrabold text-sm shadow-sm transition-all touch-press flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
            ) : (
              <div className="flex items-center justify-between bg-teal-800 text-white rounded-xl shadow-xs px-2 py-1">
                <button
                  onClick={() => addToCart(selectedProduct, -1)}
                  className="p-1.5 hover:bg-teal-900 active:bg-teal-950 rounded-lg transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm font-extrabold px-3">{quantity}</span>
                <button
                  onClick={() => addToCart(selectedProduct, 1)}
                  className="p-1.5 hover:bg-teal-900 active:bg-teal-950 rounded-lg transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
