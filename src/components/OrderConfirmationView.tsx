import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckCircle2, 
  Coins, 
  Sparkles, 
  ArrowRight, 
  ShoppingBag, 
  MapPin, 
  Clock, 
  Banknote,
  Share2,
  FileText
} from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import { OrderTrackerTimeline } from './OrderTrackerTimeline';

export const OrderConfirmationView: React.FC = () => {
  const { lastPlacedOrder, setActiveTab, navigateTo } = useApp();

  if (!lastPlacedOrder) {
    return (
      <div className="p-8 text-center min-h-screen flex flex-col items-center justify-center bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
        <p className="text-neutral-600 dark:text-neutral-400 text-sm">No recent order found.</p>
        <button
          onClick={() => {
            setActiveTab('home');
            navigateTo('home');
          }}
          className="mt-4 px-4 py-2 bg-teal-800 dark:bg-teal-600 text-white rounded-xl text-xs font-bold cursor-pointer"
        >
          Go to Home
        </button>
      </div>
    );
  }

  const handleGoToOrders = () => {
    setActiveTab('orders');
    navigateTo('home');
  };

  const handleContinueShopping = () => {
    setActiveTab('home');
    navigateTo('home');
  };

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 pb-20 transition-colors">
      {/* Top celebratory banner */}
      <div className="bg-gradient-to-b from-teal-800 to-teal-700 dark:from-neutral-900 dark:to-neutral-950 text-white px-4 pt-8 pb-10 text-center relative overflow-hidden border-b dark:border-neutral-800">
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-emerald-400 text-teal-950 flex items-center justify-center shadow-lg mb-3 animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs uppercase tracking-widest text-teal-200 dark:text-teal-400 font-bold">
            Order Placed Successfully
          </span>
          <h1 className="text-2xl font-black font-brand text-white mt-0.5">
            Order #{lastPlacedOrder.id}
          </h1>

          <div className="mt-2 inline-flex items-center gap-1.5 bg-teal-900/60 dark:bg-neutral-800/80 px-3 py-1 rounded-full text-xs text-teal-100 dark:text-teal-300 border border-teal-600/60 dark:border-neutral-700">
            <Clock className="w-3.5 h-3.5 text-teal-300" />
            <span>Estimated delivery in 25 - 35 mins</span>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-6 space-y-3.5 relative z-20">
        {/* PROMINENT EARNED COINS CARD */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 dark:from-amber-600 dark:via-amber-500 dark:to-yellow-500 rounded-2xl p-4 text-neutral-950 shadow-md border-2 border-amber-300 dark:border-amber-400">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-neutral-950 text-amber-300 flex items-center justify-center shadow-sm shrink-0">
              <Coins className="w-7 h-7 fill-amber-300" />
            </div>

            <div className="flex-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-neutral-900/80 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-neutral-950 fill-neutral-950" />
                <span>Rewards Credited</span>
              </span>
              <h2 className="text-xl font-black font-brand text-neutral-950 leading-tight">
                +{lastPlacedOrder.earnedCoins} DUKAANO Coins Earned!
              </h2>
              <p className="text-xs text-neutral-800 font-medium mt-0.5">
                Added to your balance • 100 coins = ₹10 off on next order
              </p>
            </div>
          </div>

          {/* Breakdown per category */}
          {lastPlacedOrder.categoryCoinsBreakdown.length > 0 && (
            <div className="mt-3 pt-2.5 border-t border-neutral-950/15 space-y-1.5">
              <p className="text-[11px] font-extrabold uppercase text-neutral-900">
                Earnings Breakdown:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                {lastPlacedOrder.categoryCoinsBreakdown.map((item) => (
                  <div
                    key={item.category}
                    className="bg-white/60 dark:bg-black/20 backdrop-blur-xs px-2.5 py-1.5 rounded-xl flex items-center justify-between font-semibold text-neutral-900 border border-amber-200/80"
                  >
                    <span>
                      {CATEGORIES[item.category]?.emoji} {item.categoryTitle}
                    </span>
                    <span className="font-extrabold text-neutral-950">
                      +{item.coins} coins ({item.rate}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Real-Time Live Order Progress Visualizer */}
        <OrderTrackerTimeline order={lastPlacedOrder} />

        {/* Order Details Summary */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Order Details
            </span>
            <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              {lastPlacedOrder.createdAt}
            </span>
          </div>

          {/* Items Preview */}
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {lastPlacedOrder.items.map((item) => (
              <div key={item.product.id} className="py-2 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-9 h-9 rounded-lg object-cover bg-neutral-100 dark:bg-neutral-800 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="truncate">
                    <p className="font-bold text-neutral-900 dark:text-white truncate">
                      {item.product.name}
                    </p>
                    <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                      Qty: {item.quantity} • {item.product.unit}
                    </p>
                  </div>
                </div>
                <span className="font-extrabold text-neutral-900 dark:text-white shrink-0">
                  ₹{item.product.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          {/* Price & Payment Mode */}
          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400">
            <div className="flex justify-between">
              <span>Item Total</span>
              <span className="font-semibold text-neutral-900 dark:text-neutral-200">₹{lastPlacedOrder.itemTotal}</span>
            </div>

            {lastPlacedOrder.coinsRedeemed > 0 && (
              <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-bold">
                <span>Coins Discount ({lastPlacedOrder.coinsRedeemed} coins)</span>
                <span>-₹{lastPlacedOrder.coinsDiscount}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>{lastPlacedOrder.deliveryFee === 0 ? 'FREE' : `₹${lastPlacedOrder.deliveryFee}`}</span>
            </div>

            <div className="pt-1.5 border-t border-neutral-200 dark:border-neutral-800 flex justify-between items-center text-sm font-black text-neutral-900 dark:text-white">
              <span>Total Paid / Payable</span>
              <span className="text-base text-teal-800 dark:text-teal-400 font-brand">₹{lastPlacedOrder.grandTotal}</span>
            </div>

            <div className="flex items-center gap-1.5 pt-1 text-[11px] text-neutral-700 dark:text-neutral-300 font-semibold">
              <Banknote className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
              <span>
                Payment Mode: {lastPlacedOrder.paymentMethod === 'COD' ? 'Cash on Delivery (Pay to Rider)' : 'UPI on Delivery'}
              </span>
            </div>
          </div>
        </div>

        {/* Delivery Address Summary */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 shadow-2xs space-y-2">
          <div>
            <div className="flex items-center gap-2 mb-1 text-xs font-bold text-neutral-900 dark:text-white">
              <MapPin className="w-4 h-4 text-teal-700 dark:text-teal-400" />
              <span>Delivering To</span>
            </div>
            <p className="text-xs text-neutral-700 dark:text-neutral-300 font-medium">
              {lastPlacedOrder.deliveryAddress.name} ({lastPlacedOrder.deliveryAddress.phone})
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {lastPlacedOrder.deliveryAddress.house}, {lastPlacedOrder.deliveryAddress.street}, {lastPlacedOrder.deliveryAddress.landmark}, {lastPlacedOrder.deliveryAddress.city} - {lastPlacedOrder.deliveryAddress.pincode}
            </p>
          </div>

          {lastPlacedOrder.deliveryInstructions && (
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-start gap-2 text-xs bg-amber-50/60 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200/70 dark:border-amber-800/60">
              <FileText className="w-3.5 h-3.5 text-amber-800 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-[11px] text-amber-950 dark:text-amber-300 block">
                  Rider Instructions:
                </span>
                <p className="text-[11px] text-amber-900 dark:text-amber-200 font-medium leading-tight">
                  "{lastPlacedOrder.deliveryInstructions}"
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 space-y-2.5">
          <button
            onClick={handleGoToOrders}
            className="w-full py-3 bg-teal-800 dark:bg-teal-600 hover:bg-teal-900 dark:hover:bg-teal-700 active:bg-teal-950 text-white rounded-xl font-extrabold text-sm shadow-sm flex items-center justify-center gap-2 transition-all touch-press cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>View All Orders in Orders Tab</span>
          </button>

          <button
            onClick={handleContinueShopping}
            className="w-full py-3 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 active:bg-neutral-100 text-teal-900 dark:text-teal-300 border border-neutral-300 dark:border-neutral-700 rounded-xl font-bold text-sm shadow-2xs flex items-center justify-center gap-2 transition-all touch-press cursor-pointer"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
