import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { PRODUCTS, CATEGORIES } from '../data/mockData';
import { SupportChat } from './SupportChat';
import { FollowAndEarnSection } from './FollowAndEarnSection';
import { 
  User, 
  MapPin, 
  Coins, 
  ShoppingBag, 
  Phone, 
  ShieldCheck, 
  Heart, 
  HelpCircle, 
  Globe, 
  ChevronRight,
  Sparkles,
  Store,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Headphones,
  MessageSquare,
  Moon,
  Sun,
  Check,
  Bike,
  Bell,
  BellRing
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { 
    coins, 
    orders, 
    deliveryAddress, 
    setActiveTab, 
    navigateTo,
    openProduct,
    wishlist,
    toggleWishlist,
    clearWishlist,
    cart,
    addToCart,
    isDarkMode,
    toggleDarkMode,
    setDarkMode
  } = useApp();

  const [isSupportChatOpen, setIsSupportChatOpen] = useState(false);
  const [supportDefaultOrderId, setSupportDefaultOrderId] = useState<string | undefined>(undefined);
  const savedItemsSectionRef = useRef<HTMLDivElement>(null);

  // Filter products in the user's wishlist
  const savedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  const scrollToSaved = () => {
    savedItemsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 pb-28 text-neutral-900 dark:text-neutral-100 transition-colors duration-200">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-teal-800 dark:bg-neutral-900 text-white px-4 py-3 shadow-md border-b dark:border-neutral-800 flex items-center justify-between">
        <div>
          <h1 className="text-base font-extrabold tracking-tight font-brand">
            My Account
          </h1>
          <p className="text-[11px] text-teal-200 dark:text-neutral-400">
            DUKAANO Member • Bengaluru Central
          </p>
        </div>

        {/* Quick theme indicator pill in header */}
        <button
          onClick={toggleDarkMode}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-700/80 dark:bg-neutral-800 hover:bg-teal-700 dark:hover:bg-neutral-700 border border-teal-600 dark:border-neutral-700 transition-all cursor-pointer"
          aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? (
            <>
              <Moon className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span className="text-amber-200">Dark</span>
            </>
          ) : (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span className="text-white">Light</span>
            </>
          )}
        </button>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* User Card */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-4 shadow-2xs flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-teal-700 dark:bg-teal-600 text-white flex items-center justify-center font-black text-xl font-brand shadow-xs shrink-0">
            {deliveryAddress.name.slice(0, 1)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-neutral-900 dark:text-neutral-50 truncate font-brand">
                {deliveryAddress.name}
              </h2>
              <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <Sparkles className="w-2.5 h-2.5 fill-amber-500" />
                <span>Gold Tier</span>
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{deliveryAddress.phone}</p>
            <p className="text-[11px] text-teal-800 dark:text-teal-400 font-semibold mt-0.5">
              Member since Sept 2026
            </p>
          </div>
        </div>

        {/* Quick Stats Grid - 3 Column Layout */}
        <div className="grid grid-cols-3 gap-2.5">
          <button
            onClick={() => setActiveTab('coins')}
            className="p-3 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/60 dark:from-amber-950/40 dark:to-yellow-950/20 border border-amber-300 dark:border-amber-800/80 text-left transition-all touch-press hover:shadow-xs cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <Coins className="w-4 h-4 text-amber-600 dark:text-amber-400 fill-amber-400" />
              <ChevronRight className="w-3.5 h-3.5 text-amber-800 dark:text-amber-300" />
            </div>
            <span className="block text-lg font-black text-neutral-950 dark:text-amber-300 font-brand mt-1.5">
              {coins}
            </span>
            <span className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300 leading-tight block">
              DUKAANO Coins
            </span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className="p-3 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/80 text-left transition-all touch-press hover:shadow-xs cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <ShoppingBag className="w-4 h-4 text-teal-700 dark:text-teal-400" />
              <ChevronRight className="w-3.5 h-3.5 text-teal-800 dark:text-teal-300" />
            </div>
            <span className="block text-lg font-black text-teal-900 dark:text-teal-300 font-brand mt-1.5">
              {orders.length}
            </span>
            <span className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300 leading-tight block">
              Orders
            </span>
          </button>

          <button
            onClick={scrollToSaved}
            className="p-3 rounded-2xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 text-left transition-all touch-press hover:shadow-xs cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
              <ChevronRight className="w-3.5 h-3.5 text-rose-700 dark:text-rose-400" />
            </div>
            <span className="block text-lg font-black text-rose-950 dark:text-rose-300 font-brand mt-1.5">
              {savedProducts.length}
            </span>
            <span className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300 leading-tight block">
              Saved Items
            </span>
          </button>
        </div>

        {/* ==================================================================== */}
        {/* SYSTEM-WIDE DARK MODE THEME TOGGLE SECTION (Mandated Feature)        */}
        {/* ==================================================================== */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 shadow-2xs space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                isDarkMode 
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40' 
                  : 'bg-teal-50 text-teal-800 border border-teal-200'
              }`}>
                {isDarkMode ? (
                  <Moon className="w-5 h-5 fill-amber-300 text-amber-300" />
                ) : (
                  <Sun className="w-5 h-5 fill-amber-500 text-amber-500" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900 dark:text-neutral-100 font-brand">
                    Theme & Display
                  </h3>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    isDarkMode
                      ? 'bg-neutral-800 text-amber-300 border border-neutral-700'
                      : 'bg-teal-100 text-teal-900 border border-teal-200'
                  }`}>
                    {isDarkMode ? 'Dark Mode Active' : 'Light Mode Active'}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Toggle high-contrast dark theme for OLED battery saving & low-light shopping
                </p>
              </div>
            </div>

            {/* Accessible Toggle Switch */}
            <button
              type="button"
              role="switch"
              aria-checked={isDarkMode}
              onClick={toggleDarkMode}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 ${
                isDarkMode ? 'bg-teal-600' : 'bg-neutral-300'
              }`}
              aria-label="Toggle dark mode"
            >
              <span className="sr-only">Toggle dark mode</span>
              <span
                className={`pointer-events-none flex items-center justify-center h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  isDarkMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              >
                {isDarkMode ? (
                  <Moon className="w-3.5 h-3.5 text-neutral-900 fill-neutral-900" />
                ) : (
                  <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                )}
              </span>
            </button>
          </div>

          {/* Quick theme mode selectors */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => setDarkMode(false)}
              className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                !isDarkMode
                  ? 'bg-teal-50/80 border-teal-500 ring-2 ring-teal-500/20 text-teal-950 shadow-xs'
                  : 'bg-neutral-50 dark:bg-neutral-800/60 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:border-neutral-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sun className={`w-4 h-4 ${!isDarkMode ? 'text-amber-500 fill-amber-400' : 'text-neutral-400'}`} />
                <div>
                  <p className="text-xs font-bold leading-none">Light Theme</p>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">Daylight clarity</p>
                </div>
              </div>
              {!isDarkMode && <Check className="w-4 h-4 text-teal-700 shrink-0" />}
            </button>

            <button
              type="button"
              onClick={() => setDarkMode(true)}
              className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                isDarkMode
                  ? 'bg-neutral-800 border-teal-400 ring-2 ring-teal-400/20 text-white shadow-xs'
                  : 'bg-neutral-50 dark:bg-neutral-800/60 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:border-neutral-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <Moon className={`w-4 h-4 ${isDarkMode ? 'text-amber-300 fill-amber-300' : 'text-neutral-400'}`} />
                <div>
                  <p className="text-xs font-bold leading-none">Dark Theme</p>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">High contrast OLED</p>
                </div>
              </div>
              {isDarkMode && <Check className="w-4 h-4 text-teal-400 shrink-0" />}
            </button>
          </div>
        </div>

        {/* DEDICATED SAVED ITEMS / WISHLIST SECTION */}
        <div ref={savedItemsSectionRef} className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900 dark:text-neutral-100 font-brand">
                  Saved Items ({savedProducts.length})
                </h3>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Products bookmarked for quick re-ordering
                </p>
              </div>
            </div>

            {savedProducts.length > 0 && (
              <button
                onClick={clearWishlist}
                className="text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline px-2 py-1 rounded cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Saved Items List or Empty State */}
          {savedProducts.length === 0 ? (
            <div className="text-center py-6 px-4 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800">
              <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-400 flex items-center justify-center mx-auto mb-2.5">
                <Heart className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                No items saved yet
              </h4>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto mt-1 leading-normal">
                Tap the heart icon on any product card in the marketplace to bookmark it here for later.
              </p>
              <button
                onClick={() => {
                  setActiveTab('home');
                  navigateTo('home');
                }}
                className="mt-3.5 px-4 py-1.5 bg-teal-800 dark:bg-teal-700 hover:bg-teal-900 text-white rounded-xl text-xs font-bold transition-colors touch-press inline-flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <span>Browse Marketplace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {savedProducts.map((product) => {
                const cartItem = cart.find((item) => item.product.id === product.id);
                const quantity = cartItem?.quantity || 0;
                const catConfig = CATEGORIES[product.category];
                const coinRate = catConfig ? catConfig.coinRate : 3;
                const coinEarnings = Math.max(1, Math.floor((product.price * coinRate) / 100));

                return (
                  <div 
                    key={product.id}
                    className="py-3 first:pt-1 last:pb-1 flex items-center gap-3 group"
                  >
                    {/* Thumbnail */}
                    <div 
                      onClick={() => openProduct(product)}
                      className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0 cursor-pointer relative border border-neutral-200/80 dark:border-neutral-700"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      {product.discountPercent > 0 && (
                        <span className="absolute top-1 left-1 bg-emerald-600 text-white text-[9px] font-extrabold px-1 rounded">
                          {product.discountPercent}%
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 text-[10px] text-neutral-400 dark:text-neutral-500">
                        <Store className="w-2.5 h-2.5" />
                        <span className="truncate">{product.shopName}</span>
                      </div>

                      <h4 
                        onClick={() => openProduct(product)}
                        className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate hover:text-teal-800 dark:hover:text-teal-300 cursor-pointer transition-colors"
                      >
                        {product.name}
                      </h4>

                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex items-baseline gap-1">
                          <span className="text-xs font-black text-neutral-950 dark:text-white font-brand">
                            ₹{product.price}
                          </span>
                          {product.mrp > product.price && (
                            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 line-through">
                              ₹{product.mrp}
                            </span>
                          )}
                        </div>

                        <span className="text-[10px] text-amber-800 dark:text-amber-300 font-bold flex items-center gap-0.5 bg-amber-50 dark:bg-amber-950/50 px-1.5 py-0.2 rounded border border-amber-200 dark:border-amber-800">
                          <Coins className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400 fill-amber-400" />
                          <span>+{coinEarnings} Coins</span>
                        </span>
                      </div>
                    </div>

                    {/* Actions: Add to Cart + Remove Button */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {quantity === 0 ? (
                        <button
                          onClick={() => addToCart(product, 1)}
                          className="px-2.5 py-1.5 bg-teal-50 dark:bg-neutral-800 hover:bg-teal-700 text-teal-800 dark:text-teal-300 hover:text-white border border-teal-600/70 dark:border-teal-700 rounded-xl text-[11px] font-bold transition-all touch-press flex items-center gap-1 shadow-2xs cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>ADD</span>
                        </button>
                      ) : (
                        <div className="flex items-center bg-teal-800 dark:bg-teal-700 text-white rounded-xl shadow-xs overflow-hidden">
                          <button
                            onClick={() => addToCart(product, -1)}
                            className="p-1 hover:bg-teal-900 transition-colors cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-1.5 text-xs font-bold">{quantity}</span>
                          <button
                            onClick={() => addToCart(product, 1)}
                            className="p-1 hover:bg-teal-900 transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      {/* Remove from Saved Item Button */}
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        title="Remove from saved"
                        aria-label="Remove from saved"
                        className="p-1.5 text-neutral-400 dark:text-neutral-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Saved Addresses */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
              <span>Saved Address</span>
            </h3>
            <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
              Primary
            </span>
          </div>

          <div className="text-xs text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-800/60 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800">
            <p className="font-bold text-neutral-900 dark:text-neutral-100">{deliveryAddress.name}</p>
            <p className="text-neutral-600 dark:text-neutral-400 mt-0.5">{deliveryAddress.house}, {deliveryAddress.street}</p>
            <p className="text-neutral-600 dark:text-neutral-400">{deliveryAddress.landmark}, {deliveryAddress.city} - {deliveryAddress.pincode}</p>
            <p className="text-neutral-500 dark:text-neutral-400 mt-1">Phone: {deliveryAddress.phone}</p>
          </div>
        </div>

        {/* 24x7 Order Support & Help Desk Card */}
        <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-teal-950 rounded-3xl p-4 text-white shadow-md relative overflow-hidden border dark:border-neutral-800">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-teal-700/80 border border-teal-600 flex items-center justify-center shadow-inner">
                <Headphones className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold font-brand tracking-tight">
                    Order Help & Live Chat
                  </h3>
                  <span className="bg-emerald-500 text-neutral-950 text-[9px] font-black px-1.5 py-0.2 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-950 animate-ping" />
                    <span>ONLINE</span>
                  </span>
                </div>
                <p className="text-[11px] text-teal-200 mt-0.5">
                  Instant resolution for live orders, store packing & refunds
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3.5 pt-3 border-t border-teal-700/60 flex flex-wrap items-center justify-between gap-2 relative z-10">
            <div className="flex items-center gap-1.5 text-[11px] text-teal-200">
              <MessageSquare className="w-3.5 h-3.5 text-amber-300" />
              <span>Query recent order #{orders[0]?.id || 'latest'}</span>
            </div>

            <button
              onClick={() => {
                setSupportDefaultOrderId(orders[0]?.id);
                setIsSupportChatOpen(true);
              }}
              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-neutral-950 rounded-xl text-xs font-black font-brand transition-all touch-press flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span>Chat with Support</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Follow & Earn D Coins Section */}
        <FollowAndEarnSection showBalanceCard={true} />

        {/* Rider & Delivery Partner Mode */}
        <div className="bg-gradient-to-br from-amber-500/10 via-teal-900/10 to-teal-950/20 dark:from-amber-950/30 dark:via-neutral-900 dark:to-neutral-900 rounded-3xl border border-amber-300/40 dark:border-amber-800/40 p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-neutral-950 flex items-center justify-center font-black shadow-xs shrink-0">
                <Bike className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900 dark:text-neutral-100 font-brand">
                    Rider & Delivery Partner
                  </h3>
                  <span className="text-[9px] font-black bg-amber-400 text-neutral-950 px-1.5 py-0.2 rounded-full">
                    PWA Ready
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Broadcast live GPS, manage pick-up & delivery orders
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigateTo('rider_dashboard')}
            className="w-full py-2.5 px-4 bg-teal-850 dark:bg-teal-700 hover:bg-teal-900 text-white rounded-2xl text-xs font-black font-brand transition-all touch-press flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <Bike className="w-4 h-4 text-amber-300" />
            <span>Launch Rider Dashboard / GPS App</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* App Settings and Support */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 divide-y divide-neutral-100 dark:divide-neutral-800 shadow-2xs overflow-hidden">
          <div className="p-3.5 flex items-center justify-between text-xs cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors">
            <div className="flex items-center gap-2.5 text-neutral-800 dark:text-neutral-200 font-semibold">
              <Globe className="w-4 h-4 text-teal-700 dark:text-teal-400" />
              <span>App Language</span>
            </div>
            <span className="text-xs font-bold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded border dark:border-teal-800">
              English (India)
            </span>
          </div>

          <div className="p-3.5 flex items-center justify-between text-xs cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors">
            <div className="flex items-center gap-2.5 text-neutral-800 dark:text-neutral-200 font-semibold">
              <ShieldCheck className="w-4 h-4 text-teal-700 dark:text-teal-400" />
              <span>Payment & Refund Policy</span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 dark:text-neutral-500" />
          </div>

          <div 
            onClick={() => setIsSupportChatOpen(true)}
            className="p-3.5 flex items-center justify-between text-xs cursor-pointer hover:bg-teal-50/50 dark:hover:bg-neutral-800/60 transition-colors"
          >
            <div className="flex items-center gap-2.5 text-neutral-800 dark:text-neutral-200 font-semibold">
              <HelpCircle className="w-4 h-4 text-teal-700 dark:text-teal-400" />
              <span>Help & Local Store Support</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-bold px-1.5 py-0.5 rounded border dark:border-teal-800">
                Live Chat
              </span>
              <ChevronRight className="w-4 h-4 text-neutral-400 dark:text-neutral-500" />
            </div>
          </div>
        </div>

        {/* DUKAANO Mission Footer */}
        <div className="p-4 text-center text-xs text-neutral-400 dark:text-neutral-500 space-y-1">
          <p className="font-bold text-neutral-600 dark:text-neutral-300 font-brand">
            DUKAANO Local Marketplace India
          </p>
          <p className="text-[11px]">
            Empowering neighborhood Kiranas, Pharmacies, Dhabas & CleanTech Brands.
          </p>
          <p className="text-[10px] text-neutral-400 dark:text-neutral-600">
            Version 1.0.4 • High Contrast Dark Theme Support
          </p>
        </div>
      </div>

      {/* Mock Support Chat Modal */}
      <SupportChat
        isOpen={isSupportChatOpen}
        onClose={() => setIsSupportChatOpen(false)}
        defaultOrderId={supportDefaultOrderId}
      />
    </div>
  );
};
