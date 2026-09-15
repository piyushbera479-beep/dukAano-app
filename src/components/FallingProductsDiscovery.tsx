import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { PRODUCTS, CATEGORIES } from '../data/mockData';
import { Product } from '../types';
import { Sparkles, Smartphone, Pause, Play, Zap } from 'lucide-react';

interface FallingItem {
  id: string;
  product: Product;
  xPercent: number; // 4% to 66% to stay comfortably within the card width
  y: number; // vertical pixel position from top of discovery stage
  speed: number;
  rotation: number;
  swayPhase: number;
  swaySpeed: number;
  swayAmp: number;
  categoryEmoji: string;
}

export const FallingProductsDiscovery: React.FC = () => {
  const { openProduct } = useApp();
  const [items, setItems] = useState<FallingItem[]>([]);
  const [isShaking, setIsShaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [shakeToast, setShakeToast] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  
  // Acceleration tracking for device shake detection
  const lastX = useRef<number>(0);
  const lastY = useRef<number>(0);
  const lastZ = useRef<number>(0);
  const lastShakeTime = useRef<number>(0);
  const shakeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const nextSpawnTime = useRef<number>(0);

  // Curate a balanced pool of items across Grocery, Care, Eats, and SANIVOX
  const productPool = useMemo(() => {
    const grocery = PRODUCTS.filter((p) => p.category === 'grocery');
    const care = PRODUCTS.filter((p) => p.category === 'care');
    const eats = PRODUCTS.filter((p) => p.category === 'eats');
    const sanivox = PRODUCTS.filter((p) => p.category === 'sanivox');

    return {
      grocery,
      care,
      eats,
      sanivox,
      all: [...grocery, ...care, ...eats, ...sanivox],
    };
  }, []);

  // Helper to pick a random product cycling through categories evenly
  const getRandomProduct = useCallback((): { product: Product; emoji: string } => {
    const categories: Array<'grocery' | 'care' | 'eats' | 'sanivox'> = [
      'grocery',
      'care',
      'eats',
      'sanivox',
    ];
    const cat = categories[Math.floor(Math.random() * categories.length)];
    const list = productPool[cat];
    const product = list[Math.floor(Math.random() * list.length)] || productPool.all[0];
    const emoji = CATEGORIES[product.category]?.emoji || '🛍️';
    return { product, emoji };
  }, [productPool]);

  // Create a new falling item
  const createFallingItem = useCallback(
    (customY?: number, isBurst = false): FallingItem => {
      const { product, emoji } = getRandomProduct();
      // Generate randomized horizontal position (4% to 64% so max-width 160px never overflows)
      const xPercent = Math.floor(Math.random() * 60) + 4;
      // Default slow, subtle velocity: ~0.65 to 1.05 px/frame (approx 45-65px/sec)
      // Burst velocity: ~2.4 to 3.4 px/frame (approx 160-220px/sec)
      const baseSpeed = isBurst ? Math.random() * 1.0 + 2.4 : Math.random() * 0.4 + 0.65;
      const rotation = Math.floor(Math.random() * 12) - 6; // -6 to +6 deg subtle tilt
      const swaySpeed = Math.random() * 0.018 + 0.015;
      const swayAmp = Math.random() * 7 + 4; // 4px to 11px sway

      return {
        id: `falling-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        product,
        xPercent,
        y: customY !== undefined ? customY : -(Math.random() * 40 + 60), // starts just above viewport
        speed: baseSpeed,
        rotation,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed,
        swayAmp,
        categoryEmoji: emoji,
      };
    },
    [getRandomProduct]
  );

  // Trigger temporary shake effect (accelerates falling & bursts new items)
  const triggerShake = useCallback(() => {
    // Optional iOS device motion permission request on user tap
    if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
      const DME = DeviceMotionEvent as unknown as { requestPermission?: () => Promise<string> };
      if (typeof DME.requestPermission === 'function') {
        DME.requestPermission().catch(() => {});
      }
    }

    // Haptic feedback if supported by browser
    if (typeof window !== 'undefined' && window.navigator && 'vibrate' in window.navigator) {
      try {
        window.navigator.vibrate([35, 50, 35]);
      } catch {
        // Ignore haptic errors
      }
    }

    setIsShaking(true);
    setShakeToast(true);

    // Clear previous timers
    if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);

    // Spawn 6 new products across various X positions with slightly staggered heights
    setItems((prev) => {
      const burstItems: FallingItem[] = [];
      const count = 6;
      for (let i = 0; i < count; i++) {
        burstItems.push(createFallingItem(-(i * 40 + 15), true));
      }
      return [...prev, ...burstItems];
    });

    // Toast banner display for 2.8s
    toastTimerRef.current = setTimeout(() => {
      setShakeToast(false);
    }, 2800);

    // Restore calm/slow speed after 3.5s
    shakeTimerRef.current = setTimeout(() => {
      setIsShaking(false);
    }, 3500);
  }, [createFallingItem]);

  // Initial populate with 2 gentle falling items on mount so user sees them immediately
  useEffect(() => {
    setItems([
      createFallingItem(90),
      createFallingItem(280),
    ]);
  }, [createFallingItem]);

  // Device motion shake detection listener
  useEffect(() => {
    const handleDeviceMotion = (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity || event.acceleration;
      if (!acc) return;

      const currentX = acc.x || 0;
      const currentY = acc.y || 0;
      const currentZ = acc.z || 0;

      const deltaX = Math.abs(currentX - lastX.current);
      const deltaY = Math.abs(currentY - lastY.current);
      const deltaZ = Math.abs(currentZ - lastZ.current);
      const totalDelta = deltaX + deltaY + deltaZ;

      lastX.current = currentX;
      lastY.current = currentY;
      lastZ.current = currentZ;

      const now = Date.now();
      // Threshold for genuine shaking gesture
      if (totalDelta > 22 && now - lastShakeTime.current > 1500) {
        lastShakeTime.current = now;
        triggerShake();
      }
    };

    if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
      window.addEventListener('devicemotion', handleDeviceMotion as EventListener);
    }

    return () => {
      if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
        window.removeEventListener('devicemotion', handleDeviceMotion as EventListener);
      }
      if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, [triggerShake]);

  // Animation Loop via requestAnimationFrame
  useEffect(() => {
    if (isPaused) return;

    let isMounted = true;

    const tick = () => {
      if (!isMounted) return;

      const containerHeight = stageRef.current?.clientHeight || 650;
      const now = Date.now();

      // Automatically spawn new items slowly if under max limit
      const maxNormalItems = isShaking ? 8 : 4;
      if (now > nextSpawnTime.current) {
        setItems((prev) => {
          if (prev.length < maxNormalItems) {
            return [...prev, createFallingItem(undefined, isShaking)];
          }
          return prev;
        });
        // Next spawn between 3.5s and 5.0s in calm mode, or 1.0s in shake mode
        const delay = isShaking ? Math.random() * 600 + 800 : Math.random() * 1500 + 3500;
        nextSpawnTime.current = now + delay;
      }

      // Update positions
      setItems((prev) => {
        const speedMultiplier = isShaking ? 3.0 : 1.0;

        return prev
          .map((item) => {
            const newY = item.y + item.speed * speedMultiplier;
            return {
              ...item,
              y: newY,
              swayPhase: item.swayPhase + item.swaySpeed * (isShaking ? 1.6 : 1.0),
            };
          })
          .filter((item) => item.y < containerHeight + 60); // Filter out items that exited the bottom
      });

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      isMounted = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPaused, isShaking, createFallingItem]);

  return (
    <>
      {/* Subtle Discovery Bar & Shake Trigger for Desktop/Mobile */}
      <div className="px-4 pt-1 pb-1 relative z-25">
        <div className="bg-gradient-to-r from-teal-50 via-amber-50/50 to-teal-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 rounded-2xl p-2 px-3 border border-teal-200/70 dark:border-neutral-700/80 shadow-2xs flex items-center justify-between transition-colors">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-teal-800 text-amber-300 dark:bg-neutral-800 dark:text-amber-400 flex items-center justify-center shadow-2xs shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-neutral-900 dark:text-white font-brand">
                  Live Discovery Rain
                </span>
                <span className="text-[9px] font-extrabold bg-teal-700 dark:bg-teal-600 text-white px-1.5 py-0.2 rounded-full">
                  Tap to Inspect
                </span>
              </div>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
                Products drift by • Shake phone or tap button for shower!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Shake simulator / manual trigger button */}
            <button
              onClick={triggerShake}
              title="Shake phone to shower products"
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer touch-press ${
                isShaking
                  ? 'bg-amber-400 text-neutral-950 shadow-sm scale-105 ring-2 ring-amber-300'
                  : 'bg-white dark:bg-neutral-800 text-teal-800 dark:text-teal-300 border border-teal-300/80 dark:border-neutral-700 hover:bg-teal-50 dark:hover:bg-neutral-700 shadow-2xs'
              }`}
            >
              <Smartphone className={`w-3.5 h-3.5 ${isShaking ? 'animate-bounce' : ''}`} />
              <span>{isShaking ? 'Shower!' : 'Shake 📳'}</span>
            </button>

            {/* Pause / Resume button */}
            <button
              onClick={() => setIsPaused(!isPaused)}
              title={isPaused ? 'Resume animation' : 'Pause animation'}
              className="p-1 rounded-xl text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200/70 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Floating Notification Toast when Device Shake is Detected */}
      {shakeToast && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-35 max-w-xs w-full px-4 pointer-events-none animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-neutral-950 font-bold px-3.5 py-2 rounded-2xl shadow-xl border-2 border-amber-300 flex items-center justify-between text-xs backdrop-blur-md">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 fill-neutral-950 text-neutral-950" />
              <div>
                <p className="font-black text-xs leading-none">🎉 Shake Detected!</p>
                <p className="text-[10px] text-neutral-900 font-medium">Showering fresh deals & products!</p>
              </div>
            </div>
            <span className="text-[10px] font-black bg-neutral-950 text-amber-300 px-2 py-0.5 rounded-full shadow-2xs">
              Fast Mode
            </span>
          </div>
        </div>
      )}

      {/* Subtle Visual Glow Accent During Shake */}
      {isShaking && (
        <div className="fixed inset-x-0 top-[118px] h-36 bg-gradient-to-b from-amber-400/20 via-teal-500/10 to-transparent z-15 pointer-events-none animate-pulse transition-opacity duration-300" />
      )}

      {/* 
        Falling Products Interactive Stage
        Positioned fixed between top header (~118px) and bottom nav (~62px), 
        horizontally centered to match the max-w-md app frame.
        The wrapper is pointer-events-none so scrolling and clicking standard content 
        is 100% unobstructed. Each falling item is pointer-events-auto so tapping it 
        immediately opens product details!
      */}
      <div
        ref={stageRef}
        className="fixed inset-x-0 top-[118px] bottom-[62px] pointer-events-none z-20 overflow-hidden flex justify-center select-none"
      >
        <div className="w-full max-w-md relative h-full pointer-events-none">
          {items.map((item) => {
            // Horizontal swaying formula for realistic drifting motion
            const currentSway = Math.sin(item.swayPhase) * item.swayAmp;

            return (
              <div
                key={item.id}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: `${item.xPercent}%`,
                  transform: `translate3d(${currentSway}px, ${item.y}px, 0) rotate(${item.rotation}deg)`,
                  transition: 'transform 0.05s linear',
                }}
                className="will-change-transform"
              >
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    openProduct(item.product);
                  }}
                  title={`View ${item.product.name}`}
                  className="pointer-events-auto cursor-pointer group select-none transition-transform duration-150 active:scale-95 hover:scale-105"
                >
                  <div
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-2xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md shadow-md hover:shadow-xl border transition-all duration-200 ${
                      isShaking
                        ? 'border-amber-400 ring-2 ring-amber-300/70 shadow-amber-500/20'
                        : 'border-teal-600/30 dark:border-neutral-700'
                    }`}
                  >
                    {/* Small Product Thumbnail */}
                    <div className="relative w-7 h-7 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0 border border-neutral-200 dark:border-neutral-700 shadow-2xs">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                      <span className="absolute -bottom-1 -right-1 text-[9px] bg-white/95 dark:bg-neutral-900/95 rounded-full px-0.5 shadow-2xs border border-neutral-200/50 dark:border-neutral-700/50">
                        {item.categoryEmoji}
                      </span>
                    </div>

                    {/* Compact Product Details */}
                    <div className="min-w-0 pr-1 max-w-[120px] sm:max-w-[145px]">
                      <p className="text-[11px] font-bold text-neutral-900 dark:text-white truncate leading-tight group-hover:text-teal-700 dark:group-hover:text-teal-400">
                        {item.product.name}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-black text-teal-800 dark:text-teal-300 font-brand">
                          ₹{item.product.price}
                        </span>
                        {item.product.category === 'sanivox' ? (
                          <span className="text-[8.5px] font-black text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800 px-1 py-0.2 rounded">
                            +10🪙
                          </span>
                        ) : (
                          <span className="text-[9px] font-medium text-neutral-500 dark:text-neutral-400 truncate">
                            {item.product.unit}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
