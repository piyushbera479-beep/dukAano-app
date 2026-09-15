import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Coins, 
  ArrowRight, 
  Sparkles,
  Truck,
  ShieldCheck
} from 'lucide-react';
import { CATEGORIES } from '../data/mockData';

export const CartModal: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    addToCart, 
    removeFromCart, 
    clearCart,
    cartSubtotal, 
    cartItemCount,
    calculateCoinsForCart,
    navigateTo
  } = useApp();

  if (!isCartOpen) return null;

  const { totalCoins: coinsToEarn, breakdown } = calculateCoinsForCart(cart);
  const isFreeDelivery = cartSubtotal >= 199;
  const deliveryFee = cartSubtotal === 0 ? 0 : isFreeDelivery ? 0 : 25;
  const grandTotal = cartSubtotal + deliveryFee;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    navigateTo('checkout');
  };

  return (
    <div 
      onClick={() => setIsCartOpen(false)}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end"
    >
      {/* Mobile Drawer (full width on mobile, max-w-md on desktop) */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-250 transition-colors"
      >
        {/* Cart Header */}
        <div className="bg-teal-800 dark:bg-neutral-900 text-white px-4 py-3.5 flex items-center justify-between shadow-xs border-b dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-teal-200 dark:text-teal-400" />
            <div>
              <h3 className="font-extrabold text-base leading-tight font-brand">
                My Cart ({cartItemCount} {cartItemCount === 1 ? 'item' : 'items'})
              </h3>
              <p className="text-[11px] text-teal-200 dark:text-neutral-400">Local delivery in 20-30 mins</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-teal-200 dark:text-teal-400 hover:text-white px-2 py-1 rounded transition-colors cursor-pointer"
                title="Clear Cart"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full hover:bg-teal-700/80 dark:hover:bg-neutral-800 text-white transition-colors cursor-pointer"
              aria-label="Close Cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cart Body */}
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-teal-100 dark:bg-teal-950/60 flex items-center justify-center mb-3 text-teal-800 dark:text-teal-300">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h4 className="font-extrabold text-base text-neutral-800 dark:text-neutral-100 font-brand">
              Your cart is empty
            </h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-xs">
              Explore local kiranas, food dhabas, pharmacies, and SANIVOX essentials to earn DUKAANO Coins!
            </p>
            <button
              onClick={() => setIsCartOpen(false)}
              className="mt-5 px-6 py-2.5 bg-teal-800 dark:bg-teal-700 hover:bg-teal-900 text-white rounded-xl font-bold text-sm shadow-sm transition-all touch-press cursor-pointer"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar">
              {/* Free Delivery Bar */}
              <div className="bg-white dark:bg-neutral-900 rounded-xl p-2.5 border border-neutral-200 dark:border-neutral-800 flex items-center gap-2.5 shadow-2xs">
                <Truck className="w-5 h-5 text-teal-700 dark:text-teal-400 shrink-0" />
                <div className="flex-1 text-xs text-neutral-700 dark:text-neutral-300">
                  {isFreeDelivery ? (
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">
                      🎉 Free Delivery unlocked!
                    </span>
                  ) : (
                    <span>
                      Add <strong className="text-neutral-900 dark:text-white">₹{199 - cartSubtotal}</strong> more for <strong className="text-emerald-700 dark:text-emerald-400">FREE Delivery</strong>
                    </span>
                  )}
                </div>
              </div>

              {/* Coin Earnings Callout Banner */}
              <div className="bg-gradient-to-r from-amber-500 to-amber-400 dark:from-amber-600 dark:to-amber-500 rounded-xl p-3 text-neutral-950 shadow-xs border border-amber-300 dark:border-amber-400/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-extrabold text-xs">
                    <Sparkles className="w-4 h-4 text-neutral-950 fill-neutral-950" />
                    <span>Coin Reward on this order:</span>
                  </div>
                  <span className="bg-neutral-950 text-amber-300 px-2 py-0.5 rounded-full font-black text-xs">
                    +{coinsToEarn} DUKAANO Coins
                  </span>
                </div>
                <div className="mt-1.5 pt-1.5 border-t border-neutral-950/10 flex flex-wrap gap-2 text-[10px] font-semibold text-neutral-900">
                  {breakdown.map((item) => (
                    <span key={item.category} className="bg-white/40 dark:bg-black/20 px-1.5 py-0.5 rounded">
                      {CATEGORIES[item.category]?.emoji} {item.categoryTitle}: +{item.coins} coins ({item.rate}/₹100)
                    </span>
                  ))}
                </div>
              </div>

              {/* Cart Items List */}
              <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 divide-y divide-neutral-100 dark:divide-neutral-800 shadow-2xs overflow-hidden">
                <div className="p-3 bg-neutral-50/70 dark:bg-neutral-800/50 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs font-bold text-neutral-600 dark:text-neutral-400">
                  <span>Items</span>
                  <span>Quantity & Price</span>
                </div>

                {cart.map(({ product, quantity }) => {
                  const catConfig = CATEGORIES[product.category];
                  const itemTotal = product.price * quantity;
                  const itemCoins = Math.max(1, Math.floor((itemTotal * (catConfig?.coinRate || 3)) / 100));

                  return (
                    <div key={product.id} className="p-3 flex items-center justify-between gap-3">
                      {/* Product Thumbnail & Details */}
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover bg-neutral-100 dark:bg-neutral-800 shrink-0 border dark:border-neutral-700"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate">
                            {product.name}
                          </h4>
                          <p className="text-[11px] text-neutral-400 dark:text-neutral-500 truncate">
                            {product.unit} • ₹{product.price} each
                          </p>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-400">
                            <Coins className="w-2.5 h-2.5 fill-amber-500" />
                            <span>+{itemCoins} coins</span>
                          </span>
                        </div>
                      </div>

                      {/* Stepper & Total */}
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <div className="flex items-center bg-teal-800 dark:bg-teal-700 text-white rounded-lg shadow-2xs overflow-hidden">
                          <button
                            onClick={() => addToCart(product, -1)}
                            className="p-1 hover:bg-teal-900 active:bg-teal-950 transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2 text-xs font-bold">{quantity}</span>
                          <button
                            onClick={() => addToCart(product, 1)}
                            className="p-1 hover:bg-teal-900 active:bg-teal-950 transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="text-xs font-extrabold text-neutral-900 dark:text-neutral-100">
                          ₹{itemTotal}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bill Details */}
              <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-3.5 shadow-2xs space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                  Bill Summary
                </h4>

                <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-300">
                  <span>Item Total</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-100">₹{cartSubtotal}</span>
                </div>

                <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-300">
                  <span>Delivery Fee</span>
                  {isFreeDelivery ? (
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">FREE</span>
                  ) : (
                    <span className="font-semibold text-neutral-800 dark:text-neutral-100">₹{deliveryFee}</span>
                  )}
                </div>

                <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex justify-between items-center text-sm font-extrabold text-neutral-900 dark:text-white">
                  <span>To Pay</span>
                  <span className="text-base text-teal-800 dark:text-teal-400 font-brand">₹{grandTotal}</span>
                </div>

                <div className="text-[11px] text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-800/60 p-2 rounded-lg flex items-center gap-1.5 border dark:border-neutral-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400 shrink-0" />
                  <span>Coins redemption will be applied on Checkout screen</span>
                </div>
              </div>
            </div>

            {/* Cart Footer */}
            <div className="p-4 pb-20 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 shadow-lg">
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3 bg-teal-700 dark:bg-teal-600 hover:bg-teal-800 dark:hover:bg-teal-500 text-white rounded-xl font-bold text-sm shadow-md flex items-center justify-between px-4 transition-all touch-press cursor-pointer"
              >
                <div className="text-left">
                  <span className="block text-[11px] text-teal-200 dark:text-teal-100 font-medium">
                    Total: ₹{grandTotal}
                  </span>
                  <span className="text-sm font-extrabold">Proceed to Checkout</span>
                </div>
                <div className="flex items-center gap-1 font-extrabold text-amber-300">
                  <span>+{coinsToEarn} Coins</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
