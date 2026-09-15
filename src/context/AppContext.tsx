import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  ActiveScreen,
  Address,
  BottomTab,
  CartItem,
  CategoryType,
  CoinTransaction,
  Order,
  Product,
  Shop,
} from '../types';
import {
  CATEGORIES,
  INITIAL_COIN_HISTORY,
  INITIAL_ORDERS,
  INITIAL_USER_ADDRESS,
  PRODUCTS,
  SHOPS,
} from '../data/mockData';
import { notificationService } from '../services/notificationService';

interface CoinBreakdownItem {
  category: CategoryType;
  categoryTitle: string;
  amountSpent: number;
  rate: number;
  coins: number;
}

interface AppContextType {
  // Navigation
  activeTab: BottomTab;
  setActiveTab: (tab: BottomTab) => void;
  currentScreen: ActiveScreen;
  screenHistory: ActiveScreen[];
  navigateTo: (screen: ActiveScreen | BottomTab) => void;
  goBack: () => void;
  closeOverlay: () => void;
  
  // Selections
  selectedCategory: CategoryType | null;
  selectedShop: Shop | null;
  selectedProduct: Product | null;
  openCategory: (category: CategoryType) => void;
  openShop: (shop: Shop) => void;
  openProduct: (product: Product) => void;
  
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, delta?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartItemCount: number;
  cartSubtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  
  // Coin Engine
  coins: number;
  coinHistory: CoinTransaction[];
  addDemoCoins: (amount: number) => void;
  calculateCoinsForCart: (items?: CartItem[]) => {
    totalCoins: number;
    breakdown: CoinBreakdownItem[];
  };
  getMaxCoinsRedeemable: (orderTotal: number) => {
    maxDiscount: number;
    maxCoins: number;
  };
  
  // Checkout & Orders
  deliveryAddress: Address;
  updateDeliveryAddress: (address: Partial<Address>) => void;
  orders: Order[];
  lastPlacedOrder: Order | null;
  placeOrder: (coinsToRedeem: number, paymentMethod?: 'COD' | 'UPI_ON_DELIVERY', deliveryInstructions?: string) => Order;
  reorder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  clearWishlist: () => void;

  // Social Follow & Earn D Coins
  socialClaimed: { instagram: boolean; facebook: boolean };
  claimSocialReward: (platform: 'instagram' | 'facebook') => boolean;
  resetSocialReward: (platform?: 'instagram' | 'facebook') => void;

  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (enabled: boolean) => void;

  // Local Notifications
  notificationsEnabled: boolean;
  requestNotificationPermission: () => Promise<boolean>;
  testNotification: (customStatus?: Order['status']) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_COINS = 'dukaano_coins_balance_v1';
const LOCAL_STORAGE_KEY_HISTORY = 'dukaano_coins_history_v1';
const LOCAL_STORAGE_KEY_ORDERS = 'dukaano_orders_v1';
const LOCAL_STORAGE_KEY_WISHLIST = 'dukaano_wishlist_v1';
const LOCAL_STORAGE_KEY_THEME = 'dukaano_theme_v1';
const LOCAL_STORAGE_KEY_SOCIAL = 'dukaano_social_rewards_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [activeTab, setActiveTabState] = useState<BottomTab>('home');
  const [currentScreen, setCurrentScreen] = useState<ActiveScreen>('home');
  const [screenHistory, setScreenHistory] = useState<ActiveScreen[]>(['home']);

  // Selected Entities
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Coins State (Default 150 so user can test the 100 coins = ₹10 redemption immediately at checkout!)
  const [coins, setCoins] = useState<number>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_COINS);
    return saved !== null ? Number(saved) : 150;
  });

  const [coinHistory, setCoinHistory] = useState<CoinTransaction[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_HISTORY);
    return saved ? JSON.parse(saved) : INITIAL_COIN_HISTORY;
  });

  // Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_ORDERS);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // Wishlist State
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_WISHLIST);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved wishlist', e);
    }
    // Pre-populate with 2 realistic saved products so users immediately see Saved Items in action
    return ['prod-s1', 'prod-g2'];
  });

  // Social Follow & Earn D Coins State
  const [socialClaimed, setSocialClaimed] = useState<{ instagram: boolean; facebook: boolean }>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_SOCIAL);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved social claims', e);
    }
    return { instagram: false, facebook: false };
  });

  // Address
  const [deliveryAddress, setDeliveryAddress] = useState<Address>(INITIAL_USER_ADDRESS);

  // Dark Mode Theme State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_THEME);
      if (saved !== null) {
        return saved === 'dark';
      }
      return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // Local Notifications State
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);

  useEffect(() => {
    // Initialize notification service channel and sync permission state
    notificationService.init().then(() => {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        setNotificationsEnabled(Notification.permission === 'granted');
      }
    });

    // Listen to notification taps to bring user straight to their orders view
    const listenerHandle = notificationService.addActionListener((_orderId) => {
      setActiveTabState('orders');
      setCurrentScreen('home');
      setScreenHistory(['home']);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    return () => {
      listenerHandle.remove();
    };
  }, []);

  const requestNotificationPermission = async (): Promise<boolean> => {
    const granted = await notificationService.requestPermission();
    setNotificationsEnabled(granted);
    return granted;
  };

  const testNotification = async (customStatus: Order['status'] = 'out_for_delivery') => {
    const sampleOrderId = lastPlacedOrder ? lastPlacedOrder.id : (orders[0]?.id || 'DKN-94821');
    await notificationService.notifyOrderStatus(sampleOrderId, customStatus, 45);
  };

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_THEME, isDarkMode ? 'dark' : 'light');
    } catch (e) {
      console.error('Failed to save dark mode setting', e);
    }
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);
  const setDarkMode = (enabled: boolean) => setIsDarkMode(enabled);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_COINS, String(coins));
  }, [coins]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_HISTORY, JSON.stringify(coinHistory));
  }, [coinHistory]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_WISHLIST, JSON.stringify(wishlist));
  }, [wishlist]);

  // Navigation handlers
  const setActiveTab = (tab: BottomTab) => {
    setActiveTabState(tab);
    // Dismiss all modals, overlays, and entity selections
    setIsCartOpen(false);
    setSelectedCategory(null);
    setSelectedShop(null);
    setSelectedProduct(null);
    setSearchQuery('');

    // Switch to root screen so activeTab is rendered immediately
    setCurrentScreen('home');
    setScreenHistory(['home']);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateTo = (screen: ActiveScreen | BottomTab) => {
    if (screen === 'home' || screen === 'orders' || screen === 'coins' || screen === 'profile') {
      setActiveTab(screen);
      return;
    }
    setIsCartOpen(false);
    setScreenHistory((prev) => [...prev, screen as ActiveScreen]);
    setCurrentScreen(screen as ActiveScreen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeOverlay = () => {
    setIsCartOpen(false);
    setSelectedCategory(null);
    setSelectedShop(null);
    setSelectedProduct(null);
    setCurrentScreen('home');
    setScreenHistory(['home']);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    setIsCartOpen(false);
    if (screenHistory.length > 1) {
      const nextHistory = [...screenHistory];
      nextHistory.pop();
      const prevScreen = nextHistory[nextHistory.length - 1];
      setScreenHistory(nextHistory);
      setCurrentScreen(prevScreen);
      if (prevScreen === 'home') {
        setSelectedCategory(null);
        setSelectedShop(null);
        setSelectedProduct(null);
      }
    } else {
      setCurrentScreen('home');
      setActiveTabState('home');
      setSelectedCategory(null);
      setSelectedShop(null);
      setSelectedProduct(null);
      setScreenHistory(['home']);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openCategory = (cat: CategoryType) => {
    setSelectedCategory(cat);
    setSelectedShop(null);
    navigateTo('category_page');
  };

  const openShop = (shop: Shop) => {
    setSelectedShop(shop);
    navigateTo('shop_detail');
  };

  const openProduct = (prod: Product) => {
    setSelectedProduct(prod);
    navigateTo('product_detail');
  };

  // Cart operations
  const addToCart = (product: Product, delta = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = existing.quantity + delta;
        if (newQty <= 0) {
          return prev.filter((item) => item.product.id !== product.id);
        }
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      if (delta > 0) {
        return [...prev, { product, quantity: delta }];
      }
      return prev;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartItemCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }, [cart]);

  // Coin Calculations
  // Rules specified:
  // - SANIVOX orders earn 10 coins per ₹100 spent.
  // - Grocery earns 3 coins per ₹100.
  // - DUKAANO Eats earns 3 coins per ₹100.
  // - DUKAANO Care earns 2 coins per ₹100.
  const calculateCoinsForCart = (items = cart) => {
    const categoryTotals: Record<CategoryType, number> = {
      grocery: 0,
      care: 0,
      eats: 0,
      sanivox: 0,
    };

    items.forEach((item) => {
      categoryTotals[item.product.category] += item.product.price * item.quantity;
    });

    const breakdown: CoinBreakdownItem[] = [];
    let totalCoins = 0;

    (Object.keys(categoryTotals) as CategoryType[]).forEach((cat) => {
      const amount = categoryTotals[cat];
      if (amount > 0) {
        const catConfig = CATEGORIES[cat];
        const rate = catConfig ? catConfig.coinRate : 3;
        // e.g. 10 coins per ₹100 => (amount / 100) * 10
        const coinsEarned = Math.floor((amount * rate) / 100);
        totalCoins += coinsEarned;
        breakdown.push({
          category: cat,
          categoryTitle: catConfig?.title || cat,
          amountSpent: amount,
          rate,
          coins: coinsEarned,
        });
      }
    });

    return { totalCoins, breakdown };
  };

  // 100 coins = ₹10 discount (1 coin = ₹0.10)
  // Maximum redemption of 20% of the order value
  const getMaxCoinsRedeemable = (orderTotal: number) => {
    const maxDiscountAllowed = Math.floor(orderTotal * 0.20); // 20% limit
    // 100 coins = ₹10 => 10 coins per ₹1
    const maxCoinsByDiscountLimit = maxDiscountAllowed * 10;
    const maxCoins = Math.min(coins, maxCoinsByDiscountLimit);
    const maxDiscount = Math.floor((maxCoins / 100) * 10);
    return { maxDiscount, maxCoins };
  };

  const addDemoCoins = (amount: number) => {
    setCoins((c) => c + amount);
    const newTx: CoinTransaction = {
      id: `tx-${Date.now()}`,
      type: 'bonus',
      coins: amount,
      description: `Promotional Bonus: Added ${amount} DUKAANO Coins`,
      timestamp: 'Just now',
    };
    setCoinHistory((prev) => [newTx, ...prev]);
  };

  const updateDeliveryAddress = (partial: Partial<Address>) => {
    setDeliveryAddress((prev) => ({ ...prev, ...partial }));
  };

  // Place Order
  const placeOrder = (
    coinsToRedeem: number,
    paymentMethod: 'COD' | 'UPI_ON_DELIVERY' = 'COD',
    deliveryInstructions?: string
  ): Order => {
    const { totalCoins: earnedCoins, breakdown } = calculateCoinsForCart(cart);
    const itemTotal = cartSubtotal;
    
    // Calculate coin discount (100 coins = ₹10 discount)
    const discount = Math.floor((coinsToRedeem / 100) * 10);
    const deliveryFee = itemTotal >= 199 ? 0 : 25;
    const grandTotal = Math.max(0, itemTotal - discount + deliveryFee);

    const orderId = `DKN-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })}, ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;

    const newOrder: Order = {
      id: orderId,
      createdAt: formattedDate,
      items: [...cart],
      itemTotal,
      coinsRedeemed: coinsToRedeem,
      coinsDiscount: discount,
      deliveryFee,
      grandTotal,
      earnedCoins,
      categoryCoinsBreakdown: breakdown,
      deliveryAddress: { ...deliveryAddress },
      deliveryInstructions: deliveryInstructions?.trim() || undefined,
      paymentMethod,
      status: 'confirmed',
      estimatedDelivery: '25-35 mins',
    };

    // Update wallet coins: deduct redeemed, add newly earned coins
    const updatedCoins = coins - coinsToRedeem + earnedCoins;
    setCoins(updatedCoins);

    const newTransactions: CoinTransaction[] = [];

    if (coinsToRedeem > 0) {
      newTransactions.push({
        id: `tx-red-${Date.now()}`,
        type: 'redeemed',
        coins: coinsToRedeem,
        description: `Redeemed on Order #${orderId} (₹${discount} Off)`,
        orderId,
        timestamp: 'Just now',
      });
    }

    if (earnedCoins > 0) {
      newTransactions.push({
        id: `tx-earn-${Date.now() + 1}`,
        type: 'earned',
        coins: earnedCoins,
        description: `Cashback earned on Order #${orderId}`,
        orderId,
        timestamp: 'Just now',
      });
    }

    setCoinHistory((prev) => [...newTransactions, ...prev]);
    setOrders((prev) => [newOrder, ...prev]);
    setLastPlacedOrder(newOrder);

    // Alert user with local notification that order was placed and confirmed
    notificationService.notifyOrderStatus(orderId, 'confirmed', earnedCoins);

    // Empty cart and navigate to confirmation
    clearCart();
    setIsCartOpen(false);
    navigateTo('order_confirmation');

    return newOrder;
  };

  const reorder = (order: Order) => {
    order.items.forEach((item) => {
      addToCart(item.product, item.quantity);
    });
    setIsCartOpen(true);
  };

  const updateOrderStatus = (orderId: string, nextStatus: Order['status']) => {
    let orderChanged = false;
    let earnedCoinsForOrder = 0;

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          earnedCoinsForOrder = order.earnedCoins || 0;
          if (order.status !== nextStatus) {
            orderChanged = true;
            return { ...order, status: nextStatus };
          }
        }
        return order;
      })
    );

    if (lastPlacedOrder && lastPlacedOrder.id === orderId) {
      setLastPlacedOrder((prev) => (prev ? { ...prev, status: nextStatus } : null));
    }

    // Trigger local notification when order status transitions (Preparing, Out for Delivery, etc.)
    if (orderChanged) {
      notificationService.notifyOrderStatus(orderId, nextStatus, earnedCoinsForOrder);
    }
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isWishlisted = (productId: string) => {
    return wishlist.includes(productId);
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  // Social Follow & Earn D Coins Handlers
  const claimSocialReward = (platform: 'instagram' | 'facebook'): boolean => {
    if (socialClaimed[platform]) return false;

    const rewardCoins = 100; // 100 D Coins per follow
    setCoins((c) => c + rewardCoins);

    const platformName = platform === 'instagram' ? 'Instagram' : 'Facebook';
    const newTx: CoinTransaction = {
      id: `tx-social-${platform}-${Date.now()}`,
      type: 'bonus',
      coins: rewardCoins,
      description: `Social Reward: Followed DUKAANO on ${platformName}`,
      timestamp: 'Just now',
    };
    setCoinHistory((prev) => [newTx, ...prev]);

    const updated = { ...socialClaimed, [platform]: true };
    setSocialClaimed(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_SOCIAL, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save social reward claim', e);
    }
    return true;
  };

  const resetSocialReward = (platform?: 'instagram' | 'facebook') => {
    let updated: { instagram: boolean; facebook: boolean };
    if (platform) {
      updated = { ...socialClaimed, [platform]: false };
    } else {
      updated = { instagram: false, facebook: false };
    }
    setSocialClaimed(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_SOCIAL, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to reset social reward claims', e);
    }
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currentScreen,
        screenHistory,
        navigateTo,
        goBack,
        closeOverlay,
        selectedCategory,
        selectedShop,
        selectedProduct,
        openCategory,
        openShop,
        openProduct,
        searchQuery,
        setSearchQuery,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartItemCount,
        cartSubtotal,
        isCartOpen,
        setIsCartOpen,
        coins,
        coinHistory,
        addDemoCoins,
        calculateCoinsForCart,
        getMaxCoinsRedeemable,
        deliveryAddress,
        updateDeliveryAddress,
        orders,
        lastPlacedOrder,
        placeOrder,
        reorder,
        updateOrderStatus,
        wishlist,
        toggleWishlist,
        isWishlisted,
        clearWishlist,
        socialClaimed,
        claimSocialReward,
        resetSocialReward,
        isDarkMode,
        toggleDarkMode,
        setDarkMode,
        notificationsEnabled,
        requestNotificationPermission,
        testNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
