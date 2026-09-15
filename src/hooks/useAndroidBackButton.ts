import { useEffect, useRef } from 'react';
import { App as CapApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { useApp } from '../context/AppContext';

interface UseAndroidBackButtonOptions {
  onExitToast?: (message: string) => void;
}

export const useAndroidBackButton = (options?: UseAndroidBackButtonOptions) => {
  const { 
    currentScreen, 
    activeTab, 
    goBack, 
    setActiveTab, 
    isCartOpen, 
    setIsCartOpen 
  } = useApp();

  const lastBackPressTimeRef = useRef<number>(0);

  // Sync state to ref for fresh access in listener callbacks
  const stateRef = useRef({
    currentScreen,
    activeTab,
    isCartOpen,
  });

  useEffect(() => {
    stateRef.current = {
      currentScreen,
      activeTab,
      isCartOpen,
    };
  }, [currentScreen, activeTab, isCartOpen]);

  useEffect(() => {
    const handleBackAction = () => {
      const { currentScreen: screen, activeTab: tab, isCartOpen: cartOpen } = stateRef.current;

      // 1. If cart modal is open, close it first
      if (cartOpen) {
        setIsCartOpen(false);
        return;
      }

      // 2. If viewing a secondary screen, go back to previous screen
      if (screen !== 'home') {
        goBack();
        return;
      }

      // 3. If viewing a non-home tab (e.g., Orders, Coins, Profile), return to Home tab
      if (tab !== 'home') {
        setActiveTab('home');
        return;
      }

      // 4. At root Home tab - Implement Android standard "Double tap back to exit"
      const now = Date.now();
      if (now - lastBackPressTimeRef.current < 2000) {
        // Second press within 2 seconds -> Exit app if on native Capacitor
        if (Capacitor.isNativePlatform()) {
          CapApp.exitApp();
        }
      } else {
        lastBackPressTimeRef.current = now;
        if (options?.onExitToast) {
          options.onExitToast('Press back again to exit DUKAANO');
        }
      }
    };

    // Native Capacitor Back Button Listener
    let backListenerHandle: { remove: () => void } | null = null;
    if (Capacitor.isPluginAvailable('App')) {
      CapApp.addListener('backButton', () => {
        handleBackAction();
      }).then((handle) => {
        backListenerHandle = handle;
      });
    }

    // Web / WebView popstate listener
    const handlePopState = (e: PopStateEvent) => {
      // Prevent browser default exit and handle internally
      handleBackAction();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      if (backListenerHandle) {
        backListenerHandle.remove();
      }
      window.removeEventListener('popstate', handlePopState);
    };
  }, [goBack, setActiveTab, setIsCartOpen, options]);
};
