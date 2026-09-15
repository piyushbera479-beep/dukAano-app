import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Order, CartItem } from '../types';
import { 
  ShoppingBag, 
  Coins, 
  Sparkles, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  Repeat, 
  Package, 
  ArrowRight,
  MapPin,
  FileText,
  Truck,
  ChevronDown,
  ChevronUp,
  Activity,
  Plus,
  Check,
  BellRing
} from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import { OrderTrackerTimeline, ORDER_STAGES, getStageIndex } from './OrderTrackerTimeline';

export const OrdersView: React.FC = () => {
  const { 
    orders, 
    reorder, 
    addToCart, 
    setIsCartOpen, 
    setActiveTab, 
    navigateTo, 
    notificationsEnabled, 
    requestNotificationPermission, 
    testNotification 
  } = useApp();
  const [filter, setFilter] = useState<'all' | 'active' | 'delivered'>('all');
  const [reorderedOrderId, setReorderedOrderId] = useState<string | null>(null);
  const [reorderFeedback, setReorderFeedback] = useState<string | null>(null);
  const [testSent, setTestSent] = useState(false);
  
  // Keep track of which orders have the timeline open (active orders default to expanded)
  const [expandedTimelines, setExpandedTimelines] = useState<Record<string, boolean>>({});

  const activeOrders = orders.filter((o) => o.status !== 'delivered');
  const pastOrders = orders.filter((o) => o.status === 'delivered');

  const displayedOrders = filter === 'active' 
    ? activeOrders 
    : filter === 'delivered' 
    ? pastOrders 
    : orders;

  const toggleTimeline = (orderId: string) => {
    setExpandedTimelines((prev) => ({
      ...prev,
      [orderId]: prev[orderId] !== undefined ? !prev[orderId] : false,
    }));
  };

  const isTimelineOpen = (order: Order): boolean => {
    if (expandedTimelines[order.id] !== undefined) {
      return expandedTimelines[order.id];
    }
    // Active orders are expanded by default to display the timeline prominently
    return order.status !== 'delivered';
  };

  const handleReorderOrder = (order: Order) => {
    reorder(order);
    const totalItems = order.items.reduce((acc, item) => acc + item.quantity, 0);
    setReorderedOrderId(order.id);
    setReorderFeedback(`Added ${totalItems} item${totalItems > 1 ? 's' : ''} from #${order.id} to cart!`);

    setTimeout(() => {
      setReorderedOrderId(null);
    }, 3000);

    setTimeout(() => {
      setReorderFeedback(null);
    }, 4500);
  };

  const handleReorderSingleItem = (item: CartItem) => {
    addToCart(item.product, item.quantity);
    setReorderFeedback(`Added ${item.quantity}x ${item.product.name} to cart!`);
    setIsCartOpen(true);

    setTimeout(() => {
      setReorderFeedback(null);
    }, 3500);
  };

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 pb-28 transition-colors">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-teal-800 dark:bg-neutral-900 text-white px-4 py-3 shadow-md border-b dark:border-neutral-800">
        <h1 className="text-base font-extrabold tracking-tight font-brand">
          My Orders & Rewards
        </h1>
        <p className="text-[11px] text-teal-200 dark:text-neutral-400">
          Track orders, reorder favorites & view earned DUKAANO Coins
        </p>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Reorder Toast Notification */}
        {reorderFeedback && (
          <div className="bg-teal-900 dark:bg-neutral-900 text-white p-3 rounded-2xl shadow-lg border border-teal-700 dark:border-neutral-700 flex items-center justify-between text-xs animate-in slide-in-from-top-2 fade-in duration-200">
            <div className="flex items-center gap-2 min-w-0 pr-2">
              <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
              <span className="font-bold truncate">{reorderFeedback}</span>
            </div>
            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-amber-400 hover:bg-amber-300 text-neutral-950 text-[11px] font-black px-3 py-1 rounded-xl whitespace-nowrap transition-colors touch-press shrink-0 shadow-2xs cursor-pointer"
            >
              View Cart
            </button>
          </div>
        )}

        {/* Local Notification Alerts Banner */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-teal-200/80 dark:border-neutral-800 p-3 shadow-2xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-400 flex items-center justify-center shrink-0">
              <BellRing className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-extrabold text-neutral-900 dark:text-neutral-100 font-brand truncate">
                  Order Status Notifications
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                  {notificationsEnabled ? 'Active' : 'Ready'}
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                Alerts on Preparing, Out for Delivery & Delivered
              </p>
            </div>
          </div>

          <button
            onClick={async () => {
              if (!notificationsEnabled) {
                await requestNotificationPermission();
              }
              await testNotification('out_for_delivery');
              setTestSent(true);
              setTimeout(() => setTestSent(false), 3000);
            }}
            className="px-2.5 py-1.5 bg-teal-50 hover:bg-teal-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-teal-800 dark:text-teal-300 rounded-xl text-[11px] font-bold shrink-0 transition-colors cursor-pointer border border-teal-200 dark:border-neutral-700"
            title="Send test local notification for out for delivery"
          >
            {testSent ? '✓ Alert Sent' : 'Test Alert'}
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              filter === 'all'
                ? 'bg-teal-800 dark:bg-teal-600 text-white shadow-xs'
                : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800'
            }`}
          >
            All Orders ({orders.length})
          </button>
          
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              filter === 'active'
                ? 'bg-teal-800 dark:bg-teal-600 text-white shadow-xs'
                : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Active Orders ({activeOrders.length})</span>
          </button>

          <button
            onClick={() => setFilter('delivered')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              filter === 'delivered'
                ? 'bg-teal-800 dark:bg-teal-600 text-white shadow-xs'
                : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800'
            }`}
          >
            Delivered ({pastOrders.length})
          </button>
        </div>

        {displayedOrders.length === 0 ? (
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 text-center border border-neutral-200 dark:border-neutral-800 shadow-2xs mt-4">
            <div className="w-16 h-16 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 flex items-center justify-center mx-auto mb-3">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-base text-neutral-900 dark:text-neutral-100 font-brand">
              {filter === 'active' ? 'No active orders' : 'No orders placed yet'}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-xs mx-auto">
              Place your first order from Kiranas, Pharmacies, Dhabas, or SANIVOX to earn DUKAANO Coins!
            </p>
            <button
              onClick={() => {
                setActiveTab('home');
                navigateTo('home');
              }}
              className="mt-4 px-5 py-2.5 bg-teal-800 dark:bg-teal-600 hover:bg-teal-900 text-white text-xs font-bold rounded-xl shadow-xs transition-all touch-press cursor-pointer"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedOrders.map((order) => {
              const isDelivered = order.status === 'delivered';
              const showTimeline = isTimelineOpen(order);
              const stageIdx = getStageIndex(order.status);
              const currentStage = ORDER_STAGES[stageIdx];

              return (
                <div
                  key={order.id}
                  className={`bg-white dark:bg-neutral-900 rounded-2xl border shadow-2xs overflow-hidden transition-all ${
                    !isDelivered 
                      ? 'border-teal-400 dark:border-teal-600 ring-2 ring-teal-100/60 dark:ring-teal-950/50' 
                      : 'border-neutral-200/90 dark:border-neutral-800 hover:border-teal-300 dark:hover:border-neutral-700'
                  }`}
                >
                  {/* Order Header */}
                  <div className={`p-3.5 border-b flex items-center justify-between ${
                    !isDelivered 
                      ? 'bg-teal-50/50 dark:bg-teal-950/40 border-teal-100 dark:border-neutral-800' 
                      : 'bg-neutral-50/70 dark:bg-neutral-800/50 border-neutral-100 dark:border-neutral-800'
                  }`}>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-xs text-neutral-900 dark:text-white font-brand">
                          #{order.id}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                            isDelivered
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                          }`}
                        >
                          {isDelivered ? (
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-700 dark:text-emerald-400" />
                          ) : (
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                            </span>
                          )}
                          <span>{currentStage.title}</span>
                        </span>
                      </div>
                      <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block mt-0.5">
                        {order.createdAt}
                      </span>
                    </div>

                    {/* Header Actions: Quick Reorder + Earned Coins Badge */}
                    <div className="flex items-center gap-2">
                      {isDelivered && (
                        <button
                          onClick={() => handleReorderOrder(order)}
                          className="text-[11px] font-bold text-teal-800 dark:text-teal-300 hover:text-teal-900 bg-teal-50 dark:bg-neutral-800 hover:bg-teal-100 dark:hover:bg-neutral-700 border border-teal-200/90 dark:border-teal-800 px-2.5 py-1 rounded-xl flex items-center gap-1 transition-colors touch-press cursor-pointer"
                          title="Reorder items from this order"
                        >
                          <Repeat className="w-3 h-3 text-teal-700 dark:text-teal-400" />
                          <span>Reorder</span>
                        </button>
                      )}

                      <div className="bg-amber-400 dark:bg-amber-500 text-neutral-950 font-black text-xs px-2.5 py-1 rounded-xl shadow-2xs flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5 fill-neutral-950" />
                        <span>+{order.earnedCoins} Coins</span>
                      </div>
                    </div>
                  </div>

                  {/* 6-STAGE REAL-TIME PROGRESS BAR PREVIEW ON EVERY ORDER CARD */}
                  <div className="px-3.5 py-2.5 bg-neutral-50/70 dark:bg-neutral-800/40 border-b border-neutral-100 dark:border-neutral-800">
                    <div className="flex items-center justify-between mb-1.5 text-xs">
                      <div className="flex items-center gap-1.5 min-w-0">
                        {!isDelivered ? (
                          <span className="relative flex h-2 w-2 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        )}
                        <span className="font-extrabold text-neutral-900 dark:text-white truncate">
                          {currentStage.title}
                        </span>
                        <span className="text-[10px] text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                          • Step {stageIdx + 1}/6 ({currentStage.percentage}%)
                        </span>
                        {order.status === 'out_for_delivery' && (
                          <span className="text-[9px] font-black bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 px-1.5 py-0.2 rounded-full flex items-center gap-0.5 animate-pulse">
                            🛵 GPS Live
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => toggleTimeline(order.id)}
                        className="text-[11px] font-bold text-teal-800 dark:text-teal-300 hover:text-teal-950 flex items-center gap-0.5 shrink-0 transition-colors cursor-pointer"
                      >
                        <span>{showTimeline ? 'Hide Details' : 'Track Live'}</span>
                        {showTimeline ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* 6-Segment Visual Progress Bar */}
                    <div className="grid grid-cols-6 gap-1.5 pt-0.5">
                      {ORDER_STAGES.map((stg, sIdx) => {
                        const isPast = sIdx < stageIdx;
                        const isCurrent = sIdx === stageIdx;
                        return (
                          <div key={stg.id} className="space-y-1">
                            <div
                              className={`h-1.5 rounded-full transition-all duration-300 ${
                                isPast
                                  ? 'bg-teal-700 dark:bg-teal-500'
                                  : isCurrent
                                  ? 'bg-amber-400 dark:bg-amber-400 ring-2 ring-amber-200 dark:ring-amber-900/60 shadow-xs'
                                  : 'bg-neutral-200 dark:bg-neutral-700'
                              }`}
                            />
                            <span
                              className={`text-[8px] sm:text-[8.5px] block truncate text-center font-bold ${
                                isCurrent
                                  ? 'text-teal-950 dark:text-teal-200 font-black'
                                  : isPast
                                  ? 'text-neutral-700 dark:text-neutral-300'
                                  : 'text-neutral-400 dark:text-neutral-500'
                              }`}
                            >
                              {stg.shortLabel}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* EXPANDABLE FULL REAL-TIME PROGRESS VISUALIZER */}
                  {showTimeline && (
                    <div className="p-3 bg-neutral-50/80 dark:bg-neutral-950/60 border-b border-neutral-100 dark:border-neutral-800">
                      <OrderTrackerTimeline order={order} />
                    </div>
                  )}

                  {/* Items List */}
                  <div className="p-3.5 space-y-2.5">
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.product.id} className="flex items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-2 min-w-0">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-10 h-10 rounded-lg object-cover bg-neutral-100 dark:bg-neutral-800 shrink-0 border dark:border-neutral-700"
                              referrerPolicy="no-referrer"
                            />
                            <div className="min-w-0">
                              <p className="font-bold text-neutral-800 dark:text-neutral-100 truncate">
                                {item.product.name}
                              </p>
                              <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                                {item.quantity} x ₹{item.product.price} ({item.product.unit})
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="font-bold text-neutral-900 dark:text-neutral-100">
                              ₹{item.product.price * item.quantity}
                            </span>
                            {isDelivered && (
                              <button
                                onClick={() => handleReorderSingleItem(item)}
                                className="p-1 rounded-md bg-neutral-100 dark:bg-neutral-800 hover:bg-teal-50 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:text-teal-800 border border-neutral-200/80 dark:border-neutral-700 transition-colors touch-press cursor-pointer"
                                title={`Add ${item.product.name} to cart`}
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Delivery & Payment Line */}
                    <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-600 dark:text-neutral-400">
                      <div className="flex items-center gap-1 truncate max-w-[220px]">
                        <MapPin className="w-3 h-3 text-teal-700 dark:text-teal-400 shrink-0" />
                        <span className="truncate">{order.deliveryAddress.landmark || order.deliveryAddress.street}</span>
                      </div>
                      <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                        {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'UPI on Delivery'}
                      </span>
                    </div>

                    {order.deliveryInstructions && (
                      <div className="flex items-start gap-1.5 text-[11px] text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-800/60 px-2 py-1.5 rounded-lg border border-neutral-100 dark:border-neutral-800">
                        <FileText className="w-3 h-3 text-teal-700 dark:text-teal-400 shrink-0 mt-0.5" />
                        <span className="truncate">
                          <strong className="text-neutral-700 dark:text-neutral-300">Note:</strong> {order.deliveryInstructions}
                        </span>
                      </div>
                    )}

                    {/* Action Bar: Toggle Track Order + Total + Reorder */}
                    <div className="pt-2.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block font-medium">
                          Total Amount Paid
                        </span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-base font-black text-neutral-900 dark:text-white font-brand">
                            ₹{order.grandTotal}
                          </span>
                          {order.coinsDiscount > 0 && (
                            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">
                              (Saved ₹{order.coinsDiscount})
                            </span>
                          )}
                        </div>
                      </div>

                      {isDelivered ? (
                        <div className="flex items-center gap-2">
                          {/* Completed Order Details Toggle */}
                          <button
                            onClick={() => toggleTimeline(order.id)}
                            className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1 border border-neutral-200 dark:border-neutral-700 cursor-pointer"
                          >
                            <Activity className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
                            <span>{showTimeline ? 'Hide Details' : 'Details'}</span>
                            {showTimeline ? (
                              <ChevronUp className="w-3 h-3" />
                            ) : (
                              <ChevronDown className="w-3 h-3" />
                            )}
                          </button>

                          {/* Primary Reorder Button for Completed Orders */}
                          <button
                            onClick={() => handleReorderOrder(order)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all touch-press flex items-center gap-1.5 shadow-xs cursor-pointer ${
                              reorderedOrderId === order.id
                                ? 'bg-emerald-700 text-white'
                                : 'bg-teal-800 dark:bg-teal-600 hover:bg-teal-900 dark:hover:bg-teal-500 text-white'
                            }`}
                            title="Add all items from this order to current cart"
                          >
                            {reorderedOrderId === order.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-amber-300 stroke-[3]" />
                                <span>Added to Cart!</span>
                              </>
                            ) : (
                              <>
                                <Repeat className="w-3.5 h-3.5 text-amber-300" />
                                <span>Reorder ({order.items.reduce((acc, it) => acc + it.quantity, 0)} Items)</span>
                              </>
                            )}
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {/* Active Order Track Order Toggle Button */}
                          <button
                            onClick={() => toggleTimeline(order.id)}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all touch-press flex items-center gap-1 shadow-2xs border bg-teal-800 dark:bg-teal-600 text-white border-teal-800 dark:border-teal-600 hover:bg-teal-900 cursor-pointer"
                          >
                            <Activity className="w-3.5 h-3.5" />
                            <span>{showTimeline ? 'Hide Tracking' : 'Track Order'}</span>
                            {showTimeline ? (
                              <ChevronUp className="w-3 h-3" />
                            ) : (
                              <ChevronDown className="w-3 h-3" />
                            )}
                          </button>

                          <button
                            onClick={() => handleReorderOrder(order)}
                            className="px-3 py-1.5 bg-teal-50 dark:bg-neutral-800 hover:bg-teal-700 text-teal-800 dark:text-teal-300 hover:text-white border border-teal-600/70 dark:border-teal-700 rounded-xl text-xs font-bold transition-all touch-press flex items-center gap-1.5 shadow-2xs cursor-pointer"
                          >
                            <Repeat className="w-3.5 h-3.5" />
                            <span>Reorder</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

