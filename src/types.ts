export type CategoryType = 'grocery' | 'care' | 'eats' | 'sanivox';

export interface CategoryInfo {
  id: CategoryType;
  title: string;
  shortTitle: string;
  emoji: string;
  color: string;
  bgGradient: string;
  badgeBg: string;
  badgeText: string;
  description: string;
  coinRate: number; // Coins earned per ₹100 spent
  coinNote: string;
  bannerImage: string;
}

export interface Product {
  id: string;
  name: string;
  category: CategoryType;
  categoryName: string;
  shopId: string;
  shopName: string;
  price: number;
  mrp: number;
  discountPercent: number;
  unit: string;
  rating: number;
  reviewsCount: number;
  image: string;
  description: string;
  highlights?: string[];
  isPopular?: boolean;
  isTopDeal?: boolean;
  isRecentlyAdded?: boolean;
  inStock: boolean;
  brand?: string;
}

export interface Shop {
  id: string;
  name: string;
  category: CategoryType;
  categoryName: string;
  rating: number;
  ratingCount: number;
  distance: string;
  deliveryTime: string;
  minOrder: number;
  image: string;
  address: string;
  tagline: string;
  featured?: boolean;
  isOpen: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Address {
  name: string;
  phone: string;
  house: string;
  street: string;
  landmark: string;
  city: string;
  pincode: string;
  type: 'home' | 'work' | 'other';
}

export type OrderStatus = 
  | 'confirmed'
  | 'preparing'
  | 'ready_for_pickup'
  | 'rider_assigned'
  | 'out_for_delivery'
  | 'delivered'
  // legacy aliases for mock compatibility
  | 'placed'
  | 'ready'
  | 'packing';

export interface RiderInfo {
  id: string;
  name: string;
  phone: string;
  rating: number;
  vehicle: string;
  photoUrl?: string;
  liveLocation?: {
    latitude: number;
    longitude: number;
    heading?: number | null;
    speed?: number | null;
    accuracy?: number | null;
    timestamp: number;
    isLive: boolean;
  };
}

export interface GeoPoint {
  latitude: number;
  longitude: number;
  name?: string;
  address?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  itemTotal: number;
  coinsRedeemed: number;
  coinsDiscount: number;
  deliveryFee: number;
  grandTotal: number;
  earnedCoins: number;
  categoryCoinsBreakdown: {
    category: CategoryType;
    categoryTitle: string;
    amountSpent: number;
    rate: number;
    coins: number;
  }[];
  deliveryAddress: Address;
  deliveryInstructions?: string;
  paymentMethod: 'COD' | 'UPI_ON_DELIVERY';
  status: OrderStatus;
  estimatedDelivery: string;
  rider?: RiderInfo;
  shopLocation?: GeoPoint;
  customerLocation?: GeoPoint;
}

export interface CoinTransaction {
  id: string;
  type: 'earned' | 'redeemed' | 'bonus';
  coins: number;
  description: string;
  orderId?: string;
  timestamp: string;
}

export type BottomTab = 'home' | 'orders' | 'coins' | 'profile';

export type ActiveScreen = 
  | 'home'
  | 'category_page'
  | 'shop_detail'
  | 'product_detail'
  | 'checkout'
  | 'order_confirmation'
  | 'rider_dashboard';
