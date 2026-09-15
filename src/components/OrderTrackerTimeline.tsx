import React, { useState, useEffect, useRef } from 'react';
import { Order, OrderStatus } from '../types';
import { useApp } from '../context/AppContext';
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  Home, 
  Clock, 
  Phone, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  ShieldCheck, 
  Play, 
  Pause, 
  PackageCheck, 
  Zap, 
  Check,
  Bike,
  Navigation,
  Radio
} from 'lucide-react';
import { LiveOrderTrackingMap } from './LiveOrderTrackingMap';

interface OrderTrackerTimelineProps {
  order: Order;
  compact?: boolean;
}

export type OrderStageKey = 
  | 'confirmed' 
  | 'preparing' 
  | 'ready_for_pickup' 
  | 'rider_assigned' 
  | 'out_for_delivery' 
  | 'delivered';

export interface StageDefinition {
  id: OrderStageKey;
  key: OrderStatus;
  title: string;
  shortLabel: string;
  eta: string;
  percentage: number;
  subtitle: string;
  detail: string;
  icon: React.ElementType;
  badge: string;
}

export const ORDER_STAGES: StageDefinition[] = [
  {
    id: 'confirmed',
    key: 'confirmed',
    title: 'Order Confirmed',
    shortLabel: 'Confirmed',
    eta: '25-35 mins',
    percentage: 16,
    subtitle: 'Store accepted & order verified',
    detail: 'Order received and confirmed by local merchant. Stock reserved and bill generated.',
    icon: CheckCircle2,
    badge: 'Store Confirmed',
  },
  {
    id: 'preparing',
    key: 'preparing',
    title: 'Preparing',
    shortLabel: 'Preparing',
    eta: '18-25 mins',
    percentage: 33,
    subtitle: 'Packing items & quality check',
    detail: 'Merchant is picking fresh items, checking expiration dates, and packing securely.',
    icon: Package,
    badge: 'Packing Items',
  },
  {
    id: 'ready_for_pickup',
    key: 'ready_for_pickup',
    title: 'Ready for Pickup',
    shortLabel: 'Ready',
    eta: '12-18 mins',
    percentage: 50,
    subtitle: 'Order packed & waiting for pickup',
    detail: 'Package is sealed with tamper-proof tape and waiting at the store dispatch counter.',
    icon: PackageCheck,
    badge: 'Ready at Store',
  },
  {
    id: 'rider_assigned',
    key: 'rider_assigned',
    title: 'Rider Assigned',
    shortLabel: 'Assigned',
    eta: '8-14 mins',
    percentage: 67,
    subtitle: 'Rider Suresh Kumar assigned',
    detail: 'Delivery partner has accepted the order and is arriving at the store for pickup.',
    icon: Bike,
    badge: 'Rider Assigned',
  },
  {
    id: 'out_for_delivery',
    key: 'out_for_delivery',
    title: 'Out for Delivery',
    shortLabel: 'En Route',
    eta: '5-10 mins',
    percentage: 84,
    subtitle: 'Rider is on the way with your order',
    detail: 'Package has been picked up from the merchant and is navigating to your doorstep.',
    icon: Truck,
    badge: 'Rider En Route',
  },
  {
    id: 'delivered',
    key: 'delivered',
    title: 'Delivered',
    shortLabel: 'Delivered',
    eta: 'Delivered',
    percentage: 100,
    subtitle: 'Package handed over at doorstep',
    detail: 'Order successfully fulfilled. DUKAANO Coins cashback credited to your wallet!',
    icon: Home,
    badge: 'Successfully Delivered',
  },
];

// Helper to map order status to stage index (0 to 5)
export const getStageIndex = (status: Order['status']): number => {
  switch (status) {
    case 'placed':
    case 'confirmed':
      return 0;
    case 'preparing':
    case 'packing':
      return 1;
    case 'ready':
    case 'ready_for_pickup':
      return 2;
    case 'rider_assigned':
      return 3;
    case 'out_for_delivery':
      return 4;
    case 'delivered':
      return 5;
    default:
      return 0;
  }
};

export const OrderTrackerTimeline: React.FC<OrderTrackerTimelineProps> = ({ order, compact = false }) => {
  const { updateOrderStatus, navigateTo } = useApp();
  const [isAutoSimulating, setIsAutoSimulating] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [showLiveMap, setShowLiveMap] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentIndex = getStageIndex(order.status);
  const currentStage = ORDER_STAGES[currentIndex];
  const isDelivered = currentIndex === 5;
  const isOutForDelivery = order.status === 'out_for_delivery';

  // Real-time auto progression simulation timer
  useEffect(() => {
    if (!isAutoSimulating || isDelivered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    setCountdown(8);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Advance to next stage
          const nextIndex = currentIndex + 1;
          if (nextIndex < ORDER_STAGES.length) {
            updateOrderStatus(order.id, ORDER_STAGES[nextIndex].key);
          } else {
            setIsAutoSimulating(false);
          }
          return 8;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoSimulating, currentIndex, isDelivered, order.id, updateOrderStatus]);

  const handleSetStage = (targetKey: OrderStatus) => {
    updateOrderStatus(order.id, targetKey);
  };

  const handleNextStage = () => {
    const nextIndex = Math.min(ORDER_STAGES.length - 1, currentIndex + 1);
    updateOrderStatus(order.id, ORDER_STAGES[nextIndex].key);
  };

  const handlePrevStage = () => {
    const prevIndex = Math.max(0, currentIndex - 1);
    updateOrderStatus(order.id, ORDER_STAGES[prevIndex].key);
  };

  const handleResetStage = () => {
    updateOrderStatus(order.id, 'confirmed');
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/90 dark:border-neutral-800 shadow-sm overflow-hidden transition-colors space-y-4">
      {/* Visualizer Top Header */}
      <div className="p-3.5 bg-gradient-to-r from-teal-900 via-teal-800 to-teal-950 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-950 text-white flex items-center justify-between border-b dark:border-neutral-800">
        <div className="flex items-center gap-2.5">
          {!isDelivered ? (
            <div className="relative flex h-3.5 w-3.5 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-xs"></span>
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            </div>
          )}

          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-teal-200 dark:text-teal-300 font-brand">
                {isDelivered ? 'Order Delivered' : 'Live Order Tracking'}
              </h4>
              <span className="text-[9px] font-extrabold bg-teal-700/80 dark:bg-neutral-800 text-amber-300 px-1.5 py-0.2 rounded-full border border-teal-600/60 dark:border-neutral-700">
                {currentStage.percentage}%
              </span>
            </div>
            <p className="text-[11px] text-teal-100 dark:text-neutral-300 font-medium">
              {isDelivered 
                ? 'Package handed over at your doorstep' 
                : `Status: ${currentStage.title} • ETA: ${currentStage.eta}`}
            </p>
          </div>
        </div>

        {/* Live Status Pill & Rider PWA Shortcut */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo('rider_dashboard')}
            className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 flex items-center gap-1 transition-all touch-press cursor-pointer"
            title="Open Rider Dashboard / PWA"
          >
            <span>🛵 Rider PWA</span>
          </button>
        </div>
      </div>

      {/* FULL-WIDTH LIVE RIDER GPS MAP SECTION WHEN "Out for Delivery" */}
      {isOutForDelivery && showLiveMap && (
        <div className="px-4">
          <LiveOrderTrackingMap order={order} />
        </div>
      )}

      <div className="p-4 pt-0 space-y-4">
        {/* Continuous Progress Bar & 6 Milestone Nodes */}
        <div className="space-y-3">
          {/* Progress Percentage Indicator & Header */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-neutral-800 dark:text-neutral-200 font-brand flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
              <span>Step {currentIndex + 1} of 6: {currentStage.title}</span>
            </span>
            <span className="text-[11px] font-black text-teal-800 dark:text-teal-300">
              {currentStage.percentage}% Complete
            </span>
          </div>

          {/* 6-Step Segmented Progress Bar */}
          <div className="relative pt-1 pb-1">
            {/* Background Track Line */}
            <div className="absolute top-4.5 left-4 right-4 h-1.5 bg-neutral-200 dark:bg-neutral-800 -translate-y-1/2 rounded-full overflow-hidden">
              {/* Filled Animated Track */}
              <div
                className="h-full bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-500 dark:from-teal-600 dark:to-emerald-400 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentIndex) / (ORDER_STAGES.length - 1)) * 100}%` }}
              />
            </div>

            {/* 6 Distinct Milestone Nodes */}
            <div className="relative z-10 flex justify-between items-start">
              {ORDER_STAGES.map((stage, idx) => {
                const isCompleted = idx < currentIndex;
                const isCurrent = idx === currentIndex;
                const Icon = stage.icon;

                return (
                  <button
                    key={stage.id}
                    onClick={() => handleSetStage(stage.key)}
                    title={`Click to set status to ${stage.title}`}
                    className="flex flex-col items-center max-w-[50px] sm:max-w-[62px] text-center group cursor-pointer focus:outline-hidden"
                  >
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 relative ${
                        isCompleted
                          ? 'bg-teal-800 dark:bg-teal-600 text-white shadow-xs group-hover:scale-110'
                          : isCurrent
                          ? 'bg-amber-400 text-neutral-950 ring-4 ring-amber-200 dark:ring-amber-950 font-black scale-110 shadow-md'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 border border-neutral-300 dark:border-neutral-700 group-hover:border-teal-400'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      ) : (
                        <Icon className="w-3.5 h-3.5" />
                      )}

                      {/* Active Beacon Pulse */}
                      {isCurrent && !isDelivered && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-neutral-900 animate-ping" />
                      )}
                    </div>

                    <span
                      className={`text-[9px] sm:text-[10px] mt-1.5 leading-tight transition-colors ${
                        isCurrent
                          ? 'text-teal-950 dark:text-teal-200 font-black font-brand'
                          : isCompleted
                          ? 'text-neutral-700 dark:text-neutral-300 font-bold'
                          : 'text-neutral-400 dark:text-neutral-500 font-medium'
                      }`}
                    >
                      {stage.shortLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Current Active Milestone Highlight Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-teal-50/70 via-white to-amber-50/40 dark:from-neutral-800/80 dark:via-neutral-900 dark:to-neutral-850 border border-teal-200/80 dark:border-neutral-700 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-teal-800 text-amber-300 dark:bg-neutral-800 dark:text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                {React.createElement(currentStage.icon, { className: 'w-4 h-4' })}
              </div>
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-teal-800 dark:text-teal-300">
                  Current Status
                </span>
                <h5 className="text-xs font-black text-neutral-900 dark:text-white font-brand">
                  {currentStage.title} — {currentStage.subtitle}
                </h5>
              </div>
            </div>

            <span className="text-[10px] font-extrabold text-neutral-600 dark:text-neutral-300 bg-white dark:bg-neutral-800 px-2 py-0.5 rounded-full border border-neutral-200 dark:border-neutral-700">
              {currentStage.eta}
            </span>
          </div>

          <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed pl-9">
            {currentStage.detail}
          </p>

          {/* Delivered Celebration Highlight */}
          {isDelivered && (
            <div className="mt-2 pt-2 border-t border-emerald-200 dark:border-neutral-700 flex items-center justify-between text-xs bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-lg text-emerald-900 dark:text-emerald-300 font-bold">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Delivered at Doorstep</span>
              </span>
              <span className="text-[11px] bg-emerald-100 dark:bg-emerald-900 px-2 py-0.5 rounded-full text-emerald-800 dark:text-emerald-200">
                +{order.earnedCoins} Coins Credited
              </span>
            </div>
          )}
        </div>

        {/* Detailed Vertical Stages List (if not compact) */}
        {!compact && (
          <div className="space-y-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <h6 className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              Order Milestone Steps
            </h6>

            <div className="space-y-2.5">
              {ORDER_STAGES.map((stage, idx) => {
                const isCompleted = idx < currentIndex;
                const isCurrent = idx === currentIndex;
                const Icon = stage.icon;

                return (
                  <div key={stage.id} className="flex items-start gap-3 relative">
                    {/* Vertical connecting line */}
                    {idx < ORDER_STAGES.length - 1 && (
                      <div
                        className={`absolute left-3.5 top-7 w-0.5 h-6 -translate-x-1/2 transition-colors ${
                          idx < currentIndex
                            ? 'bg-teal-700 dark:bg-teal-500'
                            : 'bg-neutral-200 dark:bg-neutral-800'
                        }`}
                      />
                    )}

                    {/* Stage Icon Node */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 transition-all ${
                        isCompleted
                          ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                          : isCurrent
                          ? 'bg-teal-800 dark:bg-teal-600 text-white ring-4 ring-teal-100 dark:ring-teal-950'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 border border-neutral-200 dark:border-neutral-700'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      ) : (
                        <Icon className="w-3.5 h-3.5" />
                      )}
                    </div>

                    {/* Stage Info */}
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-bold ${
                            isCurrent
                              ? 'text-teal-950 dark:text-teal-200 font-black font-brand'
                              : isCompleted
                              ? 'text-neutral-800 dark:text-neutral-200'
                              : 'text-neutral-400 dark:text-neutral-500'
                          }`}
                        >
                          {stage.title}
                        </span>

                        {isCurrent && !isDelivered && (
                          <span className="bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-extrabold text-[9px] px-2 py-0.2 rounded-full uppercase tracking-wider animate-pulse">
                            Active Step
                          </span>
                        )}
                        {isCompleted && (
                          <span className="text-emerald-700 dark:text-emerald-400 font-bold text-[10px] flex items-center gap-0.5">
                            ✓ Completed
                          </span>
                        )}
                      </div>

                      <p
                        className={`text-[11px] leading-snug mt-0.5 ${
                          isCurrent
                            ? 'text-neutral-700 dark:text-neutral-300 font-medium'
                            : isCompleted
                            ? 'text-neutral-500 dark:text-neutral-400'
                            : 'text-neutral-400 dark:text-neutral-500'
                        }`}
                      >
                        {stage.detail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Real-Time Order Progression Controls */}
        <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="text-xs font-extrabold text-neutral-800 dark:text-neutral-200">
                Order Status Management
              </span>
            </div>

            {/* Auto-progression Toggle */}
            <button
              onClick={() => setIsAutoSimulating(!isAutoSimulating)}
              disabled={isDelivered}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                isDelivered
                  ? 'opacity-50 cursor-not-allowed bg-neutral-100 dark:bg-neutral-800 text-neutral-400'
                  : isAutoSimulating
                  ? 'bg-amber-400 text-neutral-950 ring-2 ring-amber-300'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              {isAutoSimulating ? (
                <>
                  <Pause className="w-3 h-3" />
                  <span>Auto-Refresh ({countdown}s)</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3" />
                  <span>Live Auto-Sync</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Stage Jumping Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {ORDER_STAGES.map((stg, idx) => (
              <button
                key={stg.id}
                onClick={() => handleSetStage(stg.key)}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                  currentIndex === idx
                    ? 'bg-teal-800 dark:bg-teal-600 text-white shadow-xs'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                {stg.title}
              </button>
            ))}
          </div>

          {/* Manual Step Forward / Back Controls */}
          <div className="flex items-center justify-between gap-2 pt-1 text-xs">
            <button
              onClick={handleResetStage}
              className="px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-600 dark:text-neutral-300 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevStage}
                disabled={currentIndex === 0}
                className="px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed text-neutral-700 dark:text-neutral-300 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Prev</span>
              </button>

              <button
                onClick={handleNextStage}
                disabled={currentIndex === ORDER_STAGES.length - 1}
                className="px-3 py-1 bg-teal-800 dark:bg-teal-600 hover:bg-teal-900 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors shadow-2xs cursor-pointer"
              >
                <span>Advance Next Stage</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

