import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Coins, 
  Sparkles, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Gift, 
  HelpCircle, 
  ShieldCheck, 
  Calculator, 
  PlusCircle,
  Clock,
  Percent
} from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import { FollowAndEarnSection } from './FollowAndEarnSection';

export const CoinsView: React.FC = () => {
  const { coins, coinHistory, addDemoCoins } = useApp();
  const [calcOrderAmount, setCalcOrderAmount] = useState<number>(500);

  // Conversion: 100 coins = ₹10 => 1 coin = ₹0.10
  const coinRupeeValue = (coins * 0.1).toFixed(1);

  // Simulation calculations based on rates
  const sanivoxCalc = Math.floor((calcOrderAmount * 10) / 100);
  const groceryCalc = Math.floor((calcOrderAmount * 3) / 100);
  const careCalc = Math.floor((calcOrderAmount * 2) / 100);
  const maxRedemptionDiscount = Math.floor(calcOrderAmount * 0.20);
  const coinsNeededForMax = maxRedemptionDiscount * 10;

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 pb-28 transition-colors">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-teal-800 dark:bg-neutral-900 text-white px-4 py-3 shadow-md border-b dark:border-neutral-800">
        <h1 className="text-base font-extrabold tracking-tight font-brand">
          DUKAANO Coins Rewards
        </h1>
        <p className="text-[11px] text-teal-200 dark:text-neutral-400">
          Earn on every neighborhood purchase • 100 Coins = ₹10 Off
        </p>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Wallet Balance Hero Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-amber-400 to-yellow-400 p-5 text-neutral-950 shadow-md border border-amber-300">
          {/* Background decorative coin */}
          <div className="absolute -right-4 -bottom-6 text-amber-200/50 text-8xl font-black select-none pointer-events-none">
            🪙
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-neutral-900/80 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 fill-neutral-950 text-neutral-950" />
                <span>D Coins Balance</span>
              </span>

              <button
                onClick={() => addDemoCoins(100)}
                className="bg-neutral-950 hover:bg-neutral-900 text-amber-300 px-3 py-1 rounded-xl text-xs font-extrabold shadow-sm transition-all touch-press flex items-center gap-1 cursor-pointer"
                title="Add 100 coins to try checkout discounts"
              >
                <PlusCircle className="w-3.5 h-3.5 text-amber-300" />
                <span>+100 Coins</span>
              </button>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-black tracking-tight font-brand text-neutral-950">
                {coins}
              </span>
              <span className="text-base font-extrabold text-neutral-900 font-brand">
                D Coins
              </span>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <span className="bg-neutral-950/15 backdrop-blur-xs text-neutral-950 font-black text-xs px-2.5 py-0.5 rounded-lg">
                ≈ ₹{coinRupeeValue} Discount Value
              </span>
              <span className="text-[11px] text-neutral-800 font-semibold">
                (100 Coins = ₹10 Discount)
              </span>
            </div>

            {/* Quick rule alert */}
            <div className="mt-4 pt-3 border-t border-neutral-950/15 flex items-center justify-between text-xs text-neutral-900 font-bold">
              <span>Redeem up to 20% of order value at checkout</span>
              <Percent className="w-4 h-4 text-neutral-950" />
            </div>
          </div>
        </div>

        {/* Follow & Earn D Coins Section */}
        <FollowAndEarnSection showBalanceCard={false} />

        {/* Category Earning Rates Breakdown */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-neutral-900 dark:text-white font-brand">
                Category Earning Rates
              </h2>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Coins credited automatically upon order completion
              </p>
            </div>
            <span className="text-[10px] bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-black px-2 py-0.5 rounded border dark:border-teal-800">
              Verified
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* SANIVOX 10/100 */}
            <div className="p-3 rounded-xl bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/50 dark:to-cyan-950/30 border border-teal-300 dark:border-teal-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 font-extrabold text-xs text-teal-950 dark:text-teal-200">
                  <span>🧴</span>
                  <span>SANIVOX</span>
                  <span className="text-[9px] bg-amber-400 text-neutral-950 font-black px-1.5 py-0.2 rounded">
                    10x Max
                  </span>
                </div>
                <p className="text-[10px] text-teal-700 dark:text-teal-400 mt-0.5">Hospital-grade cleaning</p>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-teal-800 dark:text-teal-300 font-brand block leading-none">
                  10
                </span>
                <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold">Coins / ₹100</span>
              </div>
            </div>

            {/* Grocery 3/100 */}
            <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 font-extrabold text-xs text-emerald-950 dark:text-emerald-200">
                  <span>🛒</span>
                  <span>Grocery</span>
                </div>
                <p className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-0.5">Kirana & daily staples</p>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-emerald-800 dark:text-emerald-300 font-brand block leading-none">
                  3
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Coins / ₹100</span>
              </div>
            </div>

            {/* DUKAANO Eats 3/100 */}
            <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 font-extrabold text-xs text-amber-950 dark:text-amber-200">
                  <span>🍛</span>
                  <span>DUKAANO Eats</span>
                </div>
                <p className="text-[10px] text-amber-700 dark:text-amber-400 mt-0.5">Dhabas & street food</p>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-amber-800 dark:text-amber-300 font-brand block leading-none">
                  3
                </span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">Coins / ₹100</span>
              </div>
            </div>

            {/* DUKAANO Care 2/100 */}
            <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 font-extrabold text-xs text-blue-950 dark:text-blue-200">
                  <span>💊</span>
                  <span>DUKAANO Care</span>
                </div>
                <p className="text-[10px] text-blue-700 dark:text-blue-400 mt-0.5">Pharmacies & medicines</p>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-blue-800 dark:text-blue-300 font-brand block leading-none">
                  2
                </span>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">Coins / ₹100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Earnings & Redemption Calculator */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 shadow-2xs space-y-3">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-teal-700 dark:text-teal-400" />
            <h2 className="text-sm font-extrabold text-neutral-900 dark:text-white font-brand">
              Coin Rewards Calculator
            </h2>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
              <span>If your order amount is:</span>
              <span className="text-teal-800 dark:text-teal-400 font-extrabold">₹{calcOrderAmount}</span>
            </div>
            <input
              type="range"
              min="100"
              max="2000"
              step="50"
              value={calcOrderAmount}
              onChange={(e) => setCalcOrderAmount(Number(e.target.value))}
              className="w-full accent-teal-700 dark:accent-teal-500 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-200">
              <span className="text-[10px] font-bold block text-teal-700 dark:text-teal-400">SANIVOX Earns</span>
              <span className="text-base font-black text-teal-900 dark:text-teal-100 font-brand">+{sanivoxCalc} Coins</span>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200">
              <span className="text-[10px] font-bold block text-emerald-700 dark:text-emerald-400">Grocery/Eats Earns</span>
              <span className="text-base font-black text-emerald-900 dark:text-emerald-100 font-brand">+{groceryCalc} Coins</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-950 dark:text-amber-200 font-medium">
            💡 For this ₹{calcOrderAmount} order, you can redeem up to <strong>{coinsNeededForMax} coins</strong> for an instant <strong>₹{maxRedemptionDiscount} discount</strong> (20% maximum cap rule).
          </div>
        </div>

        {/* Coin Transaction History */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-neutral-900 dark:text-white font-brand flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-teal-700 dark:text-teal-400" />
              <span>Coin Activity History</span>
            </h2>
            <span className="text-xs text-neutral-400 dark:text-neutral-500">
              {coinHistory.length} events
            </span>
          </div>

          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {coinHistory.map((tx) => {
              const isEarned = tx.type === 'earned' || tx.type === 'bonus';

              return (
                <div key={tx.id} className="py-2.5 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      tx.type === 'bonus'
                        ? 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300'
                        : isEarned
                        ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                        : 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300'
                    }`}>
                      {tx.type === 'bonus' ? (
                        <Gift className="w-4 h-4" />
                      ) : isEarned ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>

                    <div>
                      <p className="font-bold text-neutral-900 dark:text-neutral-100 line-clamp-1">
                        {tx.description}
                      </p>
                      <span className="text-[10px] text-neutral-400 dark:text-neutral-500">
                        {tx.timestamp}
                      </span>
                    </div>
                  </div>

                  <span className={`font-black text-xs shrink-0 ${
                    isEarned ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
                  }`}>
                    {isEarned ? `+${tx.coins}` : `-${tx.coins}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
