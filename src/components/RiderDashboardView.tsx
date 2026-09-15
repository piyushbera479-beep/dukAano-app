import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Order, OrderStatus, RiderInfo } from '../types';
import { riderGpsSync, RiderLocationUpdate } from '../services/riderGpsSync';
import { 
  ArrowLeft, 
  Bike, 
  MapPin, 
  Store, 
  Navigation, 
  Radio, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  ExternalLink,
  RefreshCw,
  Power,
  Coins,
  Package,
  TrendingUp,
  Clock,
  Compass
} from 'lucide-react';

const DEFAULT_RIDER: RiderInfo = {
  id: 'DUK-RIDER-8821',
  name: 'Suresh Kumar',
  phone: '+91 98765 43210',
  rating: 4.92,
  vehicle: 'Hero Electric Optima (DL 08 AK 4921)',
};

export const RiderDashboardView: React.FC = () => {
  const { orders, updateOrderStatus, navigateTo, goBack } = useApp();

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [rider, setRider] = useState<RiderInfo>(DEFAULT_RIDER);
  const [isOnDuty, setIsOnDuty] = useState<boolean>(true);
  
  // Real-time GPS tracking state
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [currentCoords, setCurrentCoords] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number | null;
    speed: number | null;
    heading: number | null;
    timestamp: number;
  } | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [isRequestingPermission, setIsRequestingPermission] = useState<boolean>(false);
  const [deliverySuccessOrder, setDeliverySuccessOrder] = useState<Order | null>(null);

  // Active delivery orders
  const activeOrders = orders.filter(
    (o) => o.status === 'ready' || o.status === 'ready_for_pickup' || o.status === 'rider_assigned' || o.status === 'out_for_delivery'
  );

  const completedOrders = orders.filter((o) => o.status === 'delivered');

  // Check if any order is currently marked as out_for_delivery
  useEffect(() => {
    const enRouteOrder = orders.find((o) => o.status === 'out_for_delivery');
    if (enRouteOrder && !activeTrackingOrderId) {
      setActiveTrackingOrderId(enRouteOrder.id);
    }
  }, [orders]);

  // Clean up GPS watch on unmount
  useEffect(() => {
    return () => {
      if (watchId !== null && activeTrackingOrderId) {
        riderGpsSync.stopWatchingRiderLocation(watchId, activeTrackingOrderId);
      }
    };
  }, [watchId, activeTrackingOrderId]);

  // Start real-time GPS broadcast
  const startGpsBroadcast = (orderId: string) => {
    setGpsError(null);
    setIsRequestingPermission(true);

    if (!('geolocation' in navigator)) {
      setGpsError('Geolocation is not supported by your device or browser.');
      setIsRequestingPermission(false);
      return;
    }

    const id = riderGpsSync.startWatchingRiderLocation(
      orderId,
      rider,
      'out_for_delivery',
      (update: RiderLocationUpdate) => {
        setIsRequestingPermission(false);
        setCurrentCoords({
          latitude: update.latitude,
          longitude: update.longitude,
          accuracy: update.accuracy,
          speed: update.speed,
          heading: update.heading,
          timestamp: update.timestamp,
        });
        setGpsError(null);
      },
      (err: GeolocationPositionError) => {
        setIsRequestingPermission(false);
        console.error('GPS watch error:', err);
        if (err.code === err.PERMISSION_DENIED) {
          setGpsError('Location permission denied. Please enable GPS/Location permissions in browser settings.');
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setGpsError('GPS signal temporarily unavailable. Please ensure location services are turned on.');
        } else if (err.code === err.TIMEOUT) {
          setGpsError('Location request timed out. Retrying...');
        } else {
          setGpsError(err.message || 'Error acquiring device GPS coordinates');
        }
      }
    );

    if (id !== null) {
      setWatchId(id);
      setActiveTrackingOrderId(orderId);
    }
  };

  // Stop real-time GPS broadcast
  const stopGpsBroadcast = () => {
    if (watchId !== null && activeTrackingOrderId) {
      riderGpsSync.stopWatchingRiderLocation(watchId, activeTrackingOrderId);
      setWatchId(null);
    }
    setActiveTrackingOrderId(null);
  };

  // 1. Accept delivery (ready_for_pickup -> rider_assigned)
  const handleAcceptDelivery = (order: Order) => {
    updateOrderStatus(order.id, 'rider_assigned');
  };

  // 2. Start delivery & begin GPS broadcasting (rider_assigned -> out_for_delivery)
  const handleStartDelivery = (order: Order) => {
    updateOrderStatus(order.id, 'out_for_delivery');
    startGpsBroadcast(order.id);
  };

  // 3. Mark order as delivered (out_for_delivery -> delivered)
  const handleMarkDelivered = (order: Order) => {
    stopGpsBroadcast();
    updateOrderStatus(order.id, 'delivered');
    setDeliverySuccessOrder(order);
    setTimeout(() => {
      setDeliverySuccessOrder(null);
    }, 4500);
  };

  const handleOpenNavigation = (order: Order) => {
    const lat = order.customerLocation?.latitude || 28.6289;
    const lng = order.customerLocation?.longitude || 77.2065;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 pb-24 transition-colors font-sans">
      {/* Top App Bar */}
      <div className="sticky top-0 z-30 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800 px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigateTo('home')}
            className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-300 active:scale-95 transition-all cursor-pointer"
            title="Return to Customer App"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base">🛵</span>
              <h2 className="font-extrabold text-sm tracking-tight text-white font-brand">
                DUKAANO Rider PWA
              </h2>
            </div>
            <p className="text-[10px] text-amber-400 font-medium">Live Partner Dispatch</p>
          </div>
        </div>

        {/* On Duty / Off Duty Toggle */}
        <button
          onClick={() => setIsOnDuty(!isOnDuty)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold transition-all touch-press cursor-pointer border ${
            isOnDuty 
              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-400 shadow-xs' 
              : 'bg-neutral-800 border-neutral-700 text-neutral-400'
          }`}
        >
          <Power className="w-3.5 h-3.5" />
          <span>{isOnDuty ? 'On Duty' : 'Off Duty'}</span>
        </button>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Rider Profile Card */}
        <div className="bg-neutral-950 rounded-3xl p-4 border border-neutral-800 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-800 border-2 border-amber-400 flex items-center justify-center text-xl shadow-md">
                🚴
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-sm text-white font-brand">{rider.name}</h3>
                  <span className="bg-amber-400 text-neutral-950 text-[9px] font-black px-1.5 py-0.5 rounded-full">
                    {rider.rating}★
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400">{rider.vehicle}</p>
                <p className="text-[10px] text-teal-400 font-mono">ID: {rider.id}</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-neutral-400 block font-bold uppercase tracking-wider">Today's Payout</span>
              <span className="text-lg font-black text-emerald-400 font-brand">₹680</span>
              <span className="text-[10px] text-neutral-400 block">{completedOrders.length + 12} trips completed</span>
            </div>
          </div>
        </div>

        {/* Delivery Success Notification Banner */}
        {deliverySuccessOrder && (
          <div className="bg-emerald-950 border border-emerald-500 text-white p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top duration-300">
            <CheckCircle2 className="w-7 h-7 text-emerald-400 shrink-0" />
            <div>
              <h4 className="font-extrabold text-sm text-emerald-300">Order Successfully Delivered!</h4>
              <p className="text-xs text-neutral-300">Order #{deliverySuccessOrder.id.slice(-6).toUpperCase()} marked as handed over. ₹45 payout credited.</p>
            </div>
          </div>
        )}

        {/* GPS Error Alert */}
        {gpsError && (
          <div className="bg-rose-950/80 border border-rose-800 text-white p-3.5 rounded-2xl flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs">
              <strong className="block text-rose-300 font-bold">GPS Access Warning</strong>
              <p className="text-rose-200 mt-0.5 leading-relaxed">{gpsError}</p>
              <button
                onClick={() => activeTrackingOrderId && startGpsBroadcast(activeTrackingOrderId)}
                className="mt-2 px-3 py-1 bg-rose-800 hover:bg-rose-700 text-white text-[11px] font-bold rounded-lg cursor-pointer"
              >
                Retry Location Access
              </button>
            </div>
          </div>
        )}

        {/* Active GPS Broadcasting Card (when delivering) */}
        {activeTrackingOrderId && (
          <div className="bg-neutral-950 border-2 border-teal-500/80 rounded-3xl p-4 shadow-2xl space-y-3 relative overflow-hidden">
            {/* Pulsing indicator bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
                </span>
                <span className="text-xs font-black tracking-wider text-teal-400 uppercase">
                  Broadcasting Real GPS Location
                </span>
              </div>
              <span className="text-[10px] text-neutral-400 font-mono">
                Order #{activeTrackingOrderId.slice(-6).toUpperCase()}
              </span>
            </div>

            {/* Current Coordinates Telemetry */}
            <div className="grid grid-cols-2 gap-2 bg-neutral-900 rounded-2xl p-3 border border-neutral-800 text-xs font-mono">
              <div>
                <span className="text-[10px] text-neutral-500 block uppercase font-sans">Latitude</span>
                <span className="text-white font-bold">
                  {currentCoords ? currentCoords.latitude.toFixed(6) : 'Acquiring...'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 block uppercase font-sans">Longitude</span>
                <span className="text-white font-bold">
                  {currentCoords ? currentCoords.longitude.toFixed(6) : 'Acquiring...'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 block uppercase font-sans">GPS Accuracy</span>
                <span className="text-emerald-400 font-bold">
                  {currentCoords?.accuracy ? `±${Math.round(currentCoords.accuracy)}m` : 'High'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 block uppercase font-sans">Speed</span>
                <span className="text-amber-400 font-bold">
                  {currentCoords?.speed ? `${Math.round(currentCoords.speed * 3.6)} km/h` : 'Moving'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-neutral-400 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
                <span>Customer map updates in real time</span>
              </span>

              <button
                onClick={stopGpsBroadcast}
                className="text-xs text-rose-400 hover:text-rose-300 font-bold underline cursor-pointer"
              >
                Stop Sharing GPS
              </button>
            </div>
          </div>
        )}

        {/* Assigned Deliveries Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-white font-brand flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-400" />
              <span>Assigned Deliveries ({activeOrders.length})</span>
            </h3>
            <span className="text-xs text-neutral-400 font-medium">Auto-dispatch enabled</span>
          </div>

          {activeOrders.length === 0 ? (
            <div className="bg-neutral-950 rounded-2xl p-6 text-center border border-neutral-800 text-neutral-400">
              <CheckCircle2 className="w-10 h-10 text-neutral-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-neutral-300">No pending deliveries right now</p>
              <p className="text-xs text-neutral-500 mt-1">New store pickup requests will ring automatically when merchants prepare orders.</p>
            </div>
          ) : (
            activeOrders.map((order) => {
              const isEnRoute = order.status === 'out_for_delivery';
              const isAssigned = order.status === 'rider_assigned';
              const isReady = order.status === 'ready' || order.status === 'ready_for_pickup';
              const shopName = order.items[0]?.product.shopName || 'Local Partner Store';

              return (
                <div 
                  key={order.id}
                  className={`bg-neutral-950 rounded-3xl p-4 border transition-all space-y-3 shadow-lg ${
                    isEnRoute ? 'border-teal-500/80 ring-1 ring-teal-500/30' : 'border-neutral-800'
                  }`}
                >
                  {/* Order Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-amber-400 font-bold">
                        ORDER #{order.id.slice(-6).toUpperCase()}
                      </span>
                      <h4 className="font-black text-sm text-white">{shopName}</h4>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black text-emerald-400 font-brand">₹45 payout</span>
                      <span className="block text-[10px] text-neutral-400">{order.items.length} items</span>
                    </div>
                  </div>

                  {/* Route points */}
                  <div className="space-y-2 py-2 border-y border-neutral-900 text-xs">
                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-teal-900 text-teal-300 flex items-center justify-center shrink-0 mt-0.5">
                        <Store className="w-3 h-3" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] text-teal-400 font-bold uppercase block">Pickup Point</span>
                        <p className="text-neutral-300 truncate">{shopName} (Connaught Place)</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-amber-900 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                        <MapPin className="w-3 h-3" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] text-amber-400 font-bold uppercase block">Delivery Drop</span>
                        <p className="text-neutral-300 truncate">
                          {order.deliveryAddress.house}, {order.deliveryAddress.street}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Customer Contact */}
                  <div className="flex items-center justify-between text-xs text-neutral-400 bg-neutral-900/60 p-2.5 rounded-xl border border-neutral-800/60">
                    <div className="truncate">
                      <span className="text-white font-bold block truncate">{order.deliveryAddress.name}</span>
                      <span className="text-[10px] text-neutral-400">{order.deliveryAddress.phone}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenNavigation(order)}
                        className="p-2 bg-neutral-800 hover:bg-neutral-700 text-teal-400 rounded-lg flex items-center gap-1 text-[11px] font-bold cursor-pointer"
                        title="Google Maps Navigation"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Directions</span>
                      </button>

                      <a
                        href={`tel:${order.deliveryAddress.phone.replace(/\s+/g, '')}`}
                        className="p-2 bg-neutral-800 hover:bg-neutral-700 text-amber-400 rounded-lg flex items-center gap-1 text-[11px] font-bold"
                        title="Call Customer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call</span>
                      </a>
                    </div>
                  </div>

                  {/* Rider State Actions */}
                  <div className="pt-1">
                    {isReady && (
                      <button
                        onClick={() => handleAcceptDelivery(order)}
                        className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-xl font-extrabold text-sm shadow-md flex items-center justify-center gap-2 transition-all touch-press cursor-pointer"
                      >
                        <Bike className="w-4 h-4" />
                        <span>Accept Delivery</span>
                      </button>
                    )}

                    {isAssigned && (
                      <button
                        onClick={() => handleStartDelivery(order)}
                        className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-extrabold text-sm shadow-md flex items-center justify-center gap-2 transition-all touch-press cursor-pointer"
                      >
                        <Radio className="w-4 h-4" />
                        <span>Start Delivery & Share Live GPS</span>
                      </button>
                    )}

                    {isEnRoute && (
                      <div className="space-y-2">
                        <button
                          onClick={() => handleMarkDelivered(order)}
                          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-extrabold text-sm shadow-md flex items-center justify-center gap-2 transition-all touch-press cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Mark Order as Delivered</span>
                        </button>

                        <button
                          onClick={() => handleOpenNavigation(order)}
                          className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Turn-by-turn Directions in Google Maps</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Return to Customer Store */}
        <div className="pt-4 text-center">
          <button
            onClick={() => navigateTo('home')}
            className="text-xs text-neutral-400 hover:text-teal-400 font-bold flex items-center justify-center gap-1 mx-auto transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Switch back to Customer Marketplace</span>
          </button>
        </div>
      </div>
    </div>
  );
};
