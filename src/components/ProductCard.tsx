import React from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';
import { Plus, Minus, Star, Coins, Store, Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  variant?: 'grid' | 'horizontal';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, variant = 'grid' }) => {
  const { cart, addToCart, openProduct, openShop, toggleWishlist, isWishlisted } = useApp();

  const cartItem = cart.find((item) => item.product.id === product.id);
  const quantity = cartItem?.quantity || 0;
  const isSaved = isWishlisted(product.id);

  const catConfig = CATEGORIES[product.category];
  const coinRate = catConfig ? catConfig.coinRate : 3;
  // Calculate potential coin earnings for 1 unit: (price * rate) / 100
  const coinEarnings = Math.max(1, Math.floor((product.price * coinRate) / 100));

  if (variant === 'horizontal') {
    return (
      <div 
        onClick={() => openProduct(product)}
        className="group flex gap-3 p-3 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 shadow-2xs hover:shadow-xs transition-all cursor-pointer relative"
      >
        {/* Product Image */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0 relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          {product.discountPercent > 0 && (
            <span className="absolute top-1.5 left-1.5 bg-emerald-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-xs">
              {product.discountPercent}% OFF
            </span>
          )}

          {/* Wishlist Heart Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            aria-label={isSaved ? 'Remove from saved' : 'Save for later'}
            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/95 dark:bg-neutral-900/90 backdrop-blur-xs flex items-center justify-center shadow-xs hover:scale-110 active:scale-90 transition-all z-10 cursor-pointer"
          >
            <Heart 
              className={`w-3.5 h-3.5 transition-colors ${
                isSaved ? 'fill-rose-500 text-rose-500' : 'text-neutral-400 dark:text-neutral-500 hover:text-rose-500'
              }`} 
            />
          </button>
        </div>

        {/* Product Info */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400 mb-0.5">
              <Store className="w-3 h-3 text-neutral-400 dark:text-neutral-500 shrink-0" />
              <span className="truncate">{product.shopName}</span>
            </div>

            <h4 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-neutral-100 line-clamp-2 leading-snug group-hover:text-teal-800 dark:group-hover:text-teal-300 transition-colors">
              {product.name}
            </h4>

            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">{product.unit}</p>
          </div>

          <div className="mt-2 flex items-center justify-between gap-2">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm sm:text-base font-extrabold text-neutral-900 dark:text-white">
                  ₹{product.price}
                </span>
                {product.mrp > product.price && (
                  <span className="text-xs text-neutral-400 dark:text-neutral-500 line-through">
                    ₹{product.mrp}
                  </span>
                )}
              </div>

              {/* Coin earning badge */}
              <div className="flex items-center gap-1 text-[10px] font-bold text-amber-800 dark:text-amber-300 mt-0.5">
                <Coins className="w-3 h-3 text-amber-700 dark:text-amber-400 fill-amber-500" />
                <span>Earn {coinEarnings} Coins</span>
              </div>
            </div>

            {/* Quantity Controls / Add Button */}
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="shrink-0"
            >
              {quantity === 0 ? (
                <button
                  onClick={() => addToCart(product, 1)}
                  className="px-3.5 py-1.5 bg-teal-50 dark:bg-neutral-800 hover:bg-teal-700 dark:hover:bg-teal-600 text-teal-800 dark:text-teal-300 hover:text-white border border-teal-600/60 dark:border-teal-700 rounded-xl text-xs font-bold transition-colors touch-press flex items-center gap-1 shadow-2xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ADD</span>
                </button>
              ) : (
                <div className="flex items-center bg-teal-800 dark:bg-teal-700 text-white rounded-xl shadow-xs overflow-hidden">
                  <button
                    onClick={() => addToCart(product, -1)}
                    className="p-1.5 hover:bg-teal-900 active:bg-teal-950 transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-2 text-xs font-bold">{quantity}</span>
                  <button
                    onClick={() => addToCart(product, 1)}
                    className="p-1.5 hover:bg-teal-900 active:bg-teal-950 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default 'grid' variant
  return (
    <div 
      onClick={() => openProduct(product)}
      className="group bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 hover:border-teal-300/80 dark:hover:border-teal-700 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between cursor-pointer overflow-hidden relative touch-press"
    >
      {/* Top Image Container */}
      <div className="relative aspect-square w-full bg-neutral-50 dark:bg-neutral-800 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Discount Tag */}
        {product.discountPercent > 0 && (
          <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-md shadow-xs">
            {product.discountPercent}% OFF
          </div>
        )}

        {/* Category Pill & Wishlist Heart Button */}
        <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10">
          <div className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xs text-[10px] font-bold text-neutral-800 dark:text-neutral-200 px-1.5 py-0.5 rounded-md shadow-2xs border dark:border-neutral-700">
            {catConfig?.emoji} {product.category === 'sanivox' ? 'SANIVOX' : ''}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            aria-label={isSaved ? 'Remove from saved' : 'Save for later'}
            className="w-7 h-7 rounded-full bg-white/95 dark:bg-neutral-900/90 backdrop-blur-xs flex items-center justify-center shadow-2xs hover:scale-110 active:scale-90 transition-all cursor-pointer border dark:border-neutral-700"
          >
            <Heart 
              className={`w-3.5 h-3.5 transition-colors ${
                isSaved ? 'fill-rose-500 text-rose-500' : 'text-neutral-400 dark:text-neutral-500 hover:text-rose-500'
              }`} 
            />
          </button>
        </div>

        {/* Coin Earning Chip */}
        <div className="absolute bottom-2 left-2 right-2">
          <div className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center justify-between shadow-xs ${
            product.category === 'sanivox'
              ? 'bg-amber-400 text-neutral-950'
              : 'bg-neutral-900/80 dark:bg-neutral-950/85 text-amber-300 backdrop-blur-xs'
          }`}>
            <span className="flex items-center gap-1">
              <Coins className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span>+{coinEarnings} Coins</span>
            </span>
            <span className="text-[9px] opacity-85 font-semibold">
              {coinRate} / ₹100
            </span>
          </div>
        </div>
      </div>

      {/* Details Container */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          {/* Shop Source */}
          <div className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium truncate mb-1">
            {product.shopName}
          </div>

          <h4 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-neutral-100 line-clamp-2 leading-snug group-hover:text-teal-800 dark:group-hover:text-teal-300 transition-colors">
            {product.name}
          </h4>

          <div className="flex items-center justify-between mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
            <span>{product.unit}</span>
            <div className="flex items-center gap-0.5 text-amber-500 font-bold text-[10px]">
              <Star className="w-2.5 h-2.5 fill-amber-400" />
              <span>{product.rating}</span>
            </div>
          </div>
        </div>

        {/* Price & Add Button Row */}
        <div className="mt-2.5 pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-1">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-extrabold text-neutral-950 dark:text-white font-brand">
                ₹{product.price}
              </span>
              {product.mrp > product.price && (
                <span className="text-[11px] text-neutral-400 dark:text-neutral-500 line-through">
                  ₹{product.mrp}
                </span>
              )}
            </div>
          </div>

          {/* Add / Stepper */}
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="shrink-0"
          >
            {quantity === 0 ? (
              <button
                onClick={() => addToCart(product, 1)}
                className="px-3 py-1 bg-teal-50 dark:bg-neutral-800 hover:bg-teal-700 dark:hover:bg-teal-600 text-teal-800 dark:text-teal-300 hover:text-white border border-teal-600/70 dark:border-teal-700 rounded-xl text-xs font-extrabold transition-all touch-press flex items-center gap-0.5 shadow-2xs cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>ADD</span>
              </button>
            ) : (
              <div className="flex items-center bg-teal-800 dark:bg-teal-700 text-white rounded-xl shadow-xs overflow-hidden">
                <button
                  onClick={() => addToCart(product, -1)}
                  className="p-1 hover:bg-teal-900 active:bg-teal-950 transition-colors cursor-pointer"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="px-1.5 text-xs font-bold">{quantity}</span>
                <button
                  onClick={() => addToCart(product, 1)}
                  className="p-1 hover:bg-teal-900 active:bg-teal-950 transition-colors cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
