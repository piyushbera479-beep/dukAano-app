import React from 'react';
import { Home, ShoppingBag, Coins, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BottomTab } from '../types';

export const BottomNav: React.FC = () => {
  const { activeTab, currentScreen, setActiveTab, coins, orders } = useApp();

  const navItems: { id: BottomTab; label: string; icon: React.FC<{ className?: string }>; badge?: string | number }[] = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: ShoppingBag,
      badge: orders.length > 0 ? orders.length : undefined,
    },
    {
      id: 'coins',
      label: 'Coins',
      icon: Coins,
      badge: coins > 0 ? coins : undefined,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
    },
  ];

  return (
    <nav 
      id="main-bottom-nav"
      className="fixed bottom-0 left-0 right-0 z-[70] pointer-events-auto bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-t border-neutral-200/90 dark:border-neutral-800 shadow-xl transition-colors duration-200 pb-[env(safe-area-inset-bottom,0px)]"
    >
      <div className="max-w-md mx-auto flex items-center justify-around py-1.5 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          // Active state indicates the current screen is displaying this tab
          const isActive = currentScreen === 'home' && activeTab === item.id;

          return (
            <button
              key={item.id}
              id={`nav-tab-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all relative touch-press cursor-pointer ${
                isActive 
                  ? 'text-teal-800 dark:text-teal-400 font-bold' 
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
              aria-label={item.label}
            >
              {/* Pill Indicator for active icon */}
              <div
                className={`relative px-4 py-1 rounded-full transition-all duration-200 ${
                  isActive 
                    ? 'bg-teal-100/90 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300' 
                    : 'text-neutral-500 dark:text-neutral-400'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-105' : ''}`} />

                {/* Badge if present */}
                {item.badge !== undefined && (
                  <span className={`absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full text-[9px] font-extrabold flex items-center justify-center shadow-xs ${
                    item.id === 'coins' 
                      ? 'bg-amber-400 text-neutral-950 ring-1 ring-amber-300' 
                      : 'bg-teal-700 dark:bg-teal-600 text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </div>

              <span className={`text-[11px] tracking-tight mt-0.5 ${
                isActive ? 'font-bold text-teal-900 dark:text-teal-300' : 'font-medium'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
