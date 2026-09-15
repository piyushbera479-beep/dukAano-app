import React from 'react';
import { useApp } from '../context/AppContext';
import { Coins, Sparkles, ChevronRight, Info, PlusCircle } from 'lucide-react';

export const CoinsBanner: React.FC = () => {
  const { coins, setActiveTab, navigateTo, addDemoCoins } = useApp();

  return (
    <div className="px-4 py-2">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 p-4 text-neutral-950 shadow-sm border border-amber-300">
        {/* Background decorative coin graphics */}
        <div className="absolute -right-4 -bottom-4 text-amber-200/40 text-7xl select-none pointer-events-none font-bold">
          ₹
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-neutral-950 text-amber-400 flex items-center justify-center shadow-xs">
                <Coins className="w-4 h-4 fill-amber-400" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-900/80">
                  DUKAANO Rewards
                </span>
                <h2 className="text-lg font-extrabold text-neutral-950 tracking-tight font-brand flex items-center gap-1.5">
                  <span>My DUKAANO Coins:</span>
                  <span className="bg-neutral-950 text-amber-300 px-2 py-0.5 rounded-full text-base font-black">
                    {coins}
                  </span>
                </h2>
              </div>
            </div>

            {/* View Wallet link */}
            <button
              onClick={() => {
                setActiveTab('coins');
                navigateTo('home');
              }}
              className="flex items-center gap-1 text-xs font-bold bg-neutral-950/10 hover:bg-neutral-950/20 px-2.5 py-1.5 rounded-xl transition-colors touch-press text-neutral-900"
            >
              <span>Wallet</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Value and rules summary */}
          <div className="mt-2.5 pt-2 border-t border-neutral-900/10 flex flex-wrap items-center justify-between text-xs gap-1.5">
            <div className="flex items-center gap-1 font-semibold text-neutral-900">
              <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
              <span>100 Coins = ₹10 Discount</span>
              <span className="text-[10px] text-neutral-800/80 font-normal">
                (Up to 20% order value)
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  navigateTo('coins');
                  setActiveTab('coins');
                }}
                className="text-[11px] font-extrabold text-neutral-900 bg-amber-200 hover:bg-amber-100 px-2 py-0.5 rounded-lg border border-amber-400/60 flex items-center gap-1 transition-all touch-press"
                title="Follow DUKAANO on Instagram & Facebook to earn 200 D Coins"
              >
                <span>Follow & Earn +200</span>
              </button>

              <button
                onClick={() => addDemoCoins(100)}
                className="text-[11px] font-bold text-neutral-900 bg-white/70 hover:bg-white px-2 py-0.5 rounded-lg border border-amber-300/60 flex items-center gap-1 transition-all touch-press"
                title="Claim 100 daily reward coins to your balance"
              >
                <PlusCircle className="w-3 h-3 text-teal-800" />
                <span>+100 Coins</span>
              </button>
            </div>
          </div>

          {/* Quick Rates Pill row */}
          <div className="mt-2 grid grid-cols-4 gap-1 text-center text-[10px] font-bold">
            <div className="bg-white/50 backdrop-blur-xs rounded-lg py-1 px-0.5">
              <span className="block text-teal-900 font-extrabold">SANIVOX</span>
              <span className="text-teal-800 font-black">10/₹100</span>
            </div>
            <div className="bg-white/50 backdrop-blur-xs rounded-lg py-1 px-0.5">
              <span className="block text-emerald-900 font-extrabold">Grocery</span>
              <span className="text-emerald-800 font-black">3/₹100</span>
            </div>
            <div className="bg-white/50 backdrop-blur-xs rounded-lg py-1 px-0.5">
              <span className="block text-amber-950 font-extrabold">Eats</span>
              <span className="text-amber-900 font-black">3/₹100</span>
            </div>
            <div className="bg-white/50 backdrop-blur-xs rounded-lg py-1 px-0.5">
              <span className="block text-blue-950 font-extrabold">Care</span>
              <span className="text-blue-900 font-black">2/₹100</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
