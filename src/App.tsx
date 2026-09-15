import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { CategoryPageView } from './components/CategoryPageView';
import { ShopDetailView } from './components/ShopDetailView';
import { ProductDetailView } from './components/ProductDetailView';
import { CheckoutView } from './components/CheckoutView';
import { OrderConfirmationView } from './components/OrderConfirmationView';
import { OrdersView } from './components/OrdersView';
import { CoinsView } from './components/CoinsView';
import { ProfileView } from './components/ProfileView';
import { CartModal } from './components/CartModal';
import { RiderDashboardView } from './components/RiderDashboardView';
import { SplashScreen } from './components/SplashScreen';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AndroidToast } from './components/AndroidToast';
import { useAndroidBackButton } from './hooks/useAndroidBackButton';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import { Wifi, Signal, BatteryMedium, WifiOff } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentScreen, activeTab, isDarkMode } = useApp();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const isNative = Capacitor.isNativePlatform();

  // Configure Android native status bar when running in native Capacitor
  useEffect(() => {
    if (Capacitor.isPluginAvailable('StatusBar')) {
      try {
        StatusBar.setStyle({ style: isDarkMode ? Style.Dark : Style.Light }).catch(() => {});
        StatusBar.setBackgroundColor({ color: isDarkMode ? '#0A0A0A' : '#0F766E' }).catch(() => {});
      } catch {
        // Fallback gracefully on web preview
      }
    }
  }, [isDarkMode]);

  // Network connectivity listener for mobile reliability
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setToastMessage('Internet connection restored');
    };
    const handleOffline = () => {
      setIsOnline(false);
      setToastMessage('You are offline. Cached marketplace data available');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Hook up Android hardware & gesture back-button behavior
  useAndroidBackButton({
    onExitToast: (msg) => setToastMessage(msg),
  });

  // Bottom navigation must ALWAYS remain functional, including when browsing categories, shops, products, and checking out
  const shouldShowBottomNav = currentScreen !== 'rider_dashboard';

  // Should show main header only on root home tab
  const shouldShowHeader = currentScreen === 'home' && activeTab === 'home';

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'category_page':
        return <CategoryPageView />;
      case 'shop_detail':
        return <ShopDetailView />;
      case 'product_detail':
        return <ProductDetailView />;
      case 'checkout':
        return <CheckoutView />;
      case 'order_confirmation':
        return <OrderConfirmationView />;
      case 'rider_dashboard':
        return <RiderDashboardView />;
      case 'home':
      default:
        switch (activeTab) {
          case 'orders':
            return <OrdersView />;
          case 'coins':
            return <CoinsView />;
          case 'profile':
            return <ProfileView />;
          case 'home':
          default:
            return <HomeView />;
        }
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 sm:bg-neutral-900 dark:bg-neutral-950 sm:dark:bg-black flex justify-center items-start sm:py-4 transition-colors duration-200 overflow-x-hidden">
      {/* Mobile-First Frame */}
      <div className="w-full max-w-md bg-neutral-100 dark:bg-neutral-950 min-h-screen sm:min-h-[850px] sm:rounded-3xl shadow-2xl overflow-hidden relative flex flex-col border-0 sm:border border-neutral-800/40 dark:border-neutral-800 transition-colors duration-200">
        
        {/* Android Native Status Bar padding / Web Preview Bar */}
        {isNative ? (
          <div className="h-[env(safe-area-inset-top,0px)] bg-teal-900 dark:bg-neutral-950" />
        ) : (
          /* Android Status Bar Simulation for Web Preview */
          <div className="bg-teal-900 dark:bg-neutral-900 text-white text-[11px] font-semibold px-4 py-1.5 flex items-center justify-between select-none tracking-tight border-b border-teal-800/50 dark:border-neutral-800 transition-colors">
            <span>10:30</span>
            <div className="flex items-center gap-1.5 text-white/90">
              <span className="text-[10px] font-bold">5G</span>
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <div className="flex items-center gap-0.5">
                <span>98%</span>
                <BatteryMedium className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        )}

        {/* Offline Banner Indicator */}
        {!isOnline && (
          <div className="bg-amber-500 text-neutral-950 px-3 py-1 text-[11px] font-bold flex items-center justify-center gap-1.5 z-40">
            <WifiOff className="w-3 h-3" />
            <span>Offline mode active. Orders will queue and sync when reconnected.</span>
          </div>
        )}

        {/* Global App Header (Brand, Location, Search, Cart) */}
        {shouldShowHeader && <Header />}

        {/* Main View Area */}
        <main className="flex-1 overflow-x-hidden">
          {renderCurrentScreen()}
        </main>

        {/* Global Cart Slide-over / Modal */}
        <CartModal />

        {/* Bottom Navigation */}
        {shouldShowBottomNav && <BottomNav />}

        {/* Android Native Toast for Double Tap Back / System notices */}
        <AndroidToast 
          message={toastMessage} 
          onClear={() => setToastMessage(null)} 
        />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        {/* Branded Launch Splash Screen */}
        <SplashScreen />
        <MainLayout />
      </AppProvider>
    </ErrorBoundary>
  );
}
