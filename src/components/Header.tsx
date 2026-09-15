import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  MapPin, 
  ShoppingBag, 
  Coins, 
  ChevronDown, 
  X,
  Sparkles,
  Bell,
  Truck,
  Tag,
  Check,
  Clock,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  iconType: 'truck' | 'deal' | 'coin';
  unread: boolean;
  actionTab?: 'orders' | 'home' | 'coins';
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Your order has been picked up',
    message: 'Delivery partner Suresh Kumar is on the way with your order #DKN-95381.',
    time: '2m ago',
    iconType: 'truck',
    unread: true,
    actionTab: 'orders',
  },
  {
    id: 'n2',
    title: 'New deals available',
    message: 'Flat 15% OFF + 10x Coins on SANIVOX Hospital-grade Cleaners & Dhabas today!',
    time: '18m ago',
    iconType: 'deal',
    unread: true,
    actionTab: 'home',
  },
  {
    id: 'n3',
    title: '31 DUKAANO Coins credited',
    message: 'Cashback earned from your latest grocery order is now ready to redeem.',
    time: '2h ago',
    iconType: 'coin',
    unread: false,
    actionTab: 'coins',
  },
];

export const Header: React.FC = () => {
  const { 
    coins, 
    cartItemCount, 
    setIsCartOpen, 
    searchQuery, 
    setSearchQuery, 
    deliveryAddress,
    updateDeliveryAddress,
    setActiveTab,
    navigateTo
  } = useApp();

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [tempCity, setTempCity] = useState(deliveryAddress.city);
  const [tempStreet, setTempStreet] = useState(deliveryAddress.street);

  // Notification state
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activeToast, setActiveToast] = useState<NotificationItem | null>(null);
  const [toastCycleIndex, setToastCycleIndex] = useState(0);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleSaveLocation = () => {
    updateDeliveryAddress({
      city: tempCity,
      street: tempStreet,
    });
    setIsLocationModalOpen(false);
  };

  const handleToggleNotifications = () => {
    if (activeToast) {
      // Toggle off
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      setActiveToast(null);
      setIsNotificationsOpen(false);
    } else {
      // Toggle on: display current notification update in toast overlay
      const itemToDisplay = notifications[toastCycleIndex % notifications.length] || INITIAL_NOTIFICATIONS[0];
      triggerToast(itemToDisplay, false); // Don't auto-dismiss immediately so user can read it
      setIsNotificationsOpen(true);
    }
  };

  const handleCycleNextToast = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIndex = (toastCycleIndex + 1) % notifications.length;
    setToastCycleIndex(nextIndex);
    const nextItem = notifications[nextIndex];
    triggerToast(nextItem, false);
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleSelectNotification = (item: NotificationItem) => {
    // Mark this item as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, unread: false } : n))
    );

    // Show quick toast feedback
    triggerToast(item, true);

    // Close dropdown
    setIsNotificationsOpen(false);

    // Navigate if an action tab is associated
    if (item.actionTab) {
      setActiveTab(item.actionTab);
      navigateTo('home');
    }
  };

  const triggerToast = (item: NotificationItem, autoDismiss = true) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setActiveToast(item);
    if (autoDismiss) {
      toastTimeoutRef.current = setTimeout(() => {
        setActiveToast(null);
      }, 5000);
    }
  };

  const handleSimulateNewAlert = () => {
    const freshAlert: NotificationItem = {
      id: `alert-${Date.now()}`,
      title: 'Your order has been picked up',
      message: 'Rider Suresh Kumar is arriving in 8-12 minutes. Track live in Orders.',
      time: 'Just now',
      iconType: 'truck',
      unread: true,
      actionTab: 'orders',
    };
    setNotifications((prev) => [freshAlert, ...prev]);
    triggerToast(freshAlert, true);
  };

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-teal-800 dark:bg-neutral-900 text-white shadow-md border-b dark:border-neutral-800 transition-colors duration-200">
      {/* Top Bar with Location, Logo, and Quick Badges */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between gap-2">
        {/* Left: Brand & Location */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                setActiveTab('home');
                navigateTo('home');
              }}
              className="text-left flex items-center gap-1.5 focus:outline-none cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-white dark:bg-teal-600 flex items-center justify-center shadow-sm">
                <span className="font-extrabold text-teal-800 dark:text-white text-base font-brand">D</span>
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white font-brand">
                DUKAANO
              </span>
            </button>
            <span className="text-[10px] font-semibold uppercase tracking-wider bg-teal-700/80 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-teal-100 dark:text-neutral-300 border border-teal-600/50 dark:border-neutral-700">
              INDIA 🇮🇳
            </span>
          </div>

          {/* Location selector */}
          <button 
            onClick={() => setIsLocationModalOpen(true)}
            className="flex items-center gap-1 mt-0.5 text-xs text-teal-100 dark:text-neutral-300 hover:text-white transition-colors group text-left cursor-pointer"
            title="Change Delivery Location"
          >
            <MapPin className="w-3.5 h-3.5 text-teal-300 dark:text-teal-400 shrink-0" />
            <span className="font-medium truncate max-w-[170px] sm:max-w-[220px]">
              {deliveryAddress.landmark || deliveryAddress.street}, {deliveryAddress.city.split(',')[0]}
            </span>
            <ChevronDown className="w-3 h-3 text-teal-200 dark:text-neutral-400 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Right: Coins Balance Pill, Notification Bell, & Cart Icon */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* DUKAANO Coins Quick Button */}
          <button
            onClick={() => {
              setActiveTab('coins');
              navigateTo('home');
            }}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm transition-all touch-press cursor-pointer"
            title="View DUKAANO Coins"
          >
            <Coins className="w-3.5 h-3.5 text-neutral-950 fill-neutral-950" />
            <span>{coins}</span>
          </button>

          {/* Notification Bell with Toggle Overlay */}
          <div className="relative">
            <button
              onClick={handleToggleNotifications}
              className={`relative p-2 rounded-full transition-all touch-press cursor-pointer ${
                isNotificationsOpen 
                  ? 'bg-teal-900 dark:bg-neutral-800 text-amber-300 ring-2 ring-amber-400/50' 
                  : 'bg-teal-700/80 dark:bg-neutral-800 hover:bg-teal-700 dark:hover:bg-neutral-700 text-white'
              }`}
              aria-label="Notifications"
              title="Notifications & Updates"
            >
              <Bell className="w-4.5 h-4.5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-0.5 bg-rose-500 text-white font-extrabold text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-teal-800 dark:border-neutral-900 shadow animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Toast Overlay Dropdown */}
            {isNotificationsOpen && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 z-40 bg-black/40" 
                  onClick={() => setIsNotificationsOpen(false)} 
                />

                {/* Toast Overlay Panel */}
                <div className="absolute right-0 top-11 w-80 sm:w-84 z-50 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded-2xl shadow-xl border border-neutral-200/90 dark:border-neutral-800 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* Header */}
                  <div className="p-3 bg-teal-900 dark:bg-neutral-950 text-white flex items-center justify-between border-b dark:border-neutral-800">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-amber-300" />
                      <h4 className="text-xs font-black uppercase tracking-wider font-brand">
                        Updates & Alerts
                      </h4>
                      {unreadCount > 0 && (
                        <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllAsRead}
                          className="text-[10px] font-bold text-teal-200 dark:text-teal-400 hover:text-white hover:underline transition-colors cursor-pointer"
                        >
                          Mark read
                        </button>
                      )}
                      <button
                        onClick={() => setIsNotificationsOpen(false)}
                        className="p-1 rounded-full text-teal-200 dark:text-neutral-400 hover:text-white hover:bg-teal-800 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Notification List */}
                  <div className="max-h-72 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-neutral-400 dark:text-neutral-500">
                        <Bell className="w-8 h-8 mx-auto mb-2 text-neutral-300 dark:text-neutral-700 stroke-[1.5]" />
                        <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">No updates right now</p>
                        <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-0.5">We'll alert you about order status and special deals.</p>
                      </div>
                    ) : (
                      notifications.map((item) => {
                        return (
                          <div
                            key={item.id}
                            onClick={() => handleSelectNotification(item)}
                            className={`p-3 flex items-start gap-3 cursor-pointer transition-colors ${
                              item.unread 
                                ? 'bg-teal-50/50 dark:bg-teal-950/40 hover:bg-teal-100/50 dark:hover:bg-teal-950/60' 
                                : 'bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800/60'
                            }`}
                          >
                            {/* Icon Badge */}
                            <div className="shrink-0 mt-0.5">
                              {item.iconType === 'truck' && (
                                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shadow-2xs border border-emerald-200 dark:border-emerald-800">
                                  <Truck className="w-4 h-4" />
                                </div>
                              )}
                              {item.iconType === 'deal' && (
                                <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 flex items-center justify-center shadow-2xs border border-amber-200 dark:border-amber-800">
                                  <Tag className="w-4 h-4" />
                                </div>
                              )}
                              {item.iconType === 'coin' && (
                                <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 flex items-center justify-center shadow-2xs border border-teal-200 dark:border-teal-800">
                                  <Coins className="w-4 h-4" />
                                </div>
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <h5 className={`text-xs leading-tight truncate ${
                                  item.unread 
                                    ? 'font-black text-neutral-950 dark:text-neutral-100 font-brand' 
                                    : 'font-bold text-neutral-800 dark:text-neutral-300'
                                }`}>
                                  {item.title}
                                </h5>
                                <div className="flex items-center gap-1 shrink-0">
                                  <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium">
                                    {item.time}
                                  </span>
                                  {item.unread && (
                                    <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                                  )}
                                </div>
                              </div>
                              <p className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-1 leading-snug line-clamp-2">
                                {item.message}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Toast Overlay Footer with Simulator */}
                  <div className="p-2.5 bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                    <button
                      onClick={handleSimulateNewAlert}
                      className="text-[11px] font-bold text-teal-800 dark:text-teal-400 hover:text-teal-900 dark:hover:text-teal-300 flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-teal-100/60 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                      <span>Check Updates</span>
                    </button>

                    <button
                      onClick={() => {
                        setNotifications(INITIAL_NOTIFICATIONS);
                      }}
                      className="text-[10px] text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 py-1 px-1.5 rounded transition-colors flex items-center gap-1 cursor-pointer"
                      title="Reset notifications to initial"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Cart Icon with badge */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-full bg-teal-700/80 dark:bg-neutral-800 hover:bg-teal-700 dark:hover:bg-neutral-700 text-white transition-all touch-press cursor-pointer"
            aria-label="View Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-400 text-neutral-900 font-extrabold text-[11px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-teal-800 dark:border-neutral-900 shadow">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Ephemeral Active Toast Overlay Banner */}
      {activeToast && (
        <div className="px-4 pb-2.5 animate-in slide-in-from-top-2 fade-in duration-200">
          <div 
            onClick={() => {
              if (activeToast.actionTab) {
                setActiveTab(activeToast.actionTab);
                navigateTo('home');
              }
              setActiveToast(null);
            }}
            className="bg-neutral-900/95 dark:bg-neutral-800 text-white p-3 rounded-2xl shadow-xl border border-neutral-700/80 dark:border-neutral-700 flex items-center justify-between gap-2.5 cursor-pointer hover:bg-neutral-900 transition-colors group"
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="w-8 h-8 rounded-xl bg-teal-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                {activeToast.iconType === 'truck' ? (
                  <Truck className="w-4 h-4 text-emerald-300" />
                ) : activeToast.iconType === 'deal' ? (
                  <Tag className="w-4 h-4 text-amber-300" />
                ) : (
                  <Coins className="w-4 h-4 text-amber-300 fill-amber-300" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-black text-amber-300 truncate font-brand">
                    {activeToast.title}
                  </span>
                  <span className="text-[10px] text-neutral-400 shrink-0">
                    • {activeToast.time}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-200 leading-snug line-clamp-1">
                  {activeToast.message}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleCycleNextToast}
                className="px-2 py-1 bg-white/10 hover:bg-white/20 text-[10px] font-bold rounded-lg text-teal-200 hover:text-white transition-colors cursor-pointer"
                title="Next update"
              >
                Next ↻
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveToast(null);
                }}
                className="p-1 text-neutral-400 hover:text-white rounded-md cursor-pointer hover:bg-white/10 transition-colors"
                aria-label="Dismiss toast"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="px-4 pb-3 pt-1">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-teal-700 dark:text-teal-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products, shops..."
            className="w-full pl-9 pr-8 py-2 text-sm bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-400 rounded-xl border border-transparent dark:border-neutral-700 shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Location Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl border dark:border-neutral-800 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <h3 className="font-bold text-base text-neutral-800 dark:text-neutral-100">Select Delivery Location</h3>
              </div>
              <button 
                onClick={() => setIsLocationModalOpen(false)}
                className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 py-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                  Street / Area / Colony
                </label>
                <input
                  type="text"
                  value={tempStreet}
                  onChange={(e) => setTempStreet(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  placeholder="e.g. 100 Feet Road, Indiranagar"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                  City & State
                </label>
                <input
                  type="text"
                  value={tempCity}
                  onChange={(e) => setTempCity(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  placeholder="e.g. Bengaluru, Karnataka"
                />
              </div>

              {/* Quick Indian city presets */}
              <div>
                <span className="block text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 mb-1.5 uppercase">
                  Popular Hubs
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['Bengaluru', 'Delhi NCR', 'Mumbai', 'Pune', 'Hyderabad'].map((city) => (
                    <button
                      key={city}
                      onClick={() => setTempCity(`${city}, India`)}
                      className="text-xs px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 hover:bg-teal-50 dark:hover:bg-neutral-700 hover:text-teal-700 dark:hover:text-teal-300 text-neutral-800 dark:text-neutral-200 rounded-md border border-neutral-200 dark:border-neutral-700 transition-colors cursor-pointer"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => setIsLocationModalOpen(false)}
                className="flex-1 py-2.5 text-sm font-semibold text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveLocation}
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-teal-700 dark:bg-teal-600 rounded-xl hover:bg-teal-800 dark:hover:bg-teal-700 transition-colors shadow-sm cursor-pointer"
              >
                Confirm Location
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
