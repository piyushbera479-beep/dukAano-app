import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Phone, 
  Navigation, 
  LocateFixed, 
  ShieldCheck, 
  Radio, 
  Clock, 
  AlertCircle, 
  ExternalLink,
  Store,
  MapPin,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { Order } from '../types';
import { riderGpsSync, RiderLocationUpdate } from '../services/riderGpsSync';
import { useApp } from '../context/AppContext';

interface LiveOrderTrackingMapProps {
  order: Order;
  onOpenSupport?: (orderId: string) => void;
}

// Default fallback coordinates centered around Delhi NCR market hub
const DEFAULT_CUSTOMER_LOCATION = {
  latitude: 28.6289,
  longitude: 77.2065,
  name: 'Your Delivery Address',
};

const DEFAULT_SHOP_LOCATION = {
  latitude: 28.6360,
  longitude: 77.2185,
  name: 'Local Partner Store',
};

export const LiveOrderTrackingMap: React.FC<LiveOrderTrackingMapProps> = ({ order, onOpenSupport }) => {
  const { navigateTo } = useApp();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{
    shop?: L.Marker;
    customer?: L.Marker;
    rider?: L.Marker;
    route?: L.Polyline;
  }>({});

  const [liveLocation, setLiveLocation] = useState<RiderLocationUpdate | null>(() => {
    return riderGpsSync.getRiderLocation(order.id);
  });
  const [mapError, setMapError] = useState<string | null>(null);
  const [lastUpdatedText, setLastUpdatedText] = useState<string>('Connecting...');

  const customerCoords = order.customerLocation || {
    latitude: DEFAULT_CUSTOMER_LOCATION.latitude,
    longitude: DEFAULT_CUSTOMER_LOCATION.longitude,
    name: order.deliveryAddress?.house ? `${order.deliveryAddress.house}, ${order.deliveryAddress.street}` : DEFAULT_CUSTOMER_LOCATION.name
  };

  const shopCoords = order.shopLocation || {
    latitude: DEFAULT_SHOP_LOCATION.latitude,
    longitude: DEFAULT_SHOP_LOCATION.longitude,
    name: order.items[0]?.product.shopName || DEFAULT_SHOP_LOCATION.name
  };

  const riderName = order.rider?.name || liveLocation?.riderName || 'Suresh Kumar';
  const riderPhone = order.rider?.phone || liveLocation?.riderPhone || '+91 98765 43210';
  const riderVehicle = order.rider?.vehicle || liveLocation?.vehicle || 'Hero Electric Optima (DL 08 AK 4921)';
  const riderRating = order.rider?.rating || 4.9;

  // Real-time distance and ETA calculation
  const hasLiveGps = !!(liveLocation && liveLocation.isLive);
  const distanceKm = hasLiveGps 
    ? riderGpsSync.calculateDistanceKm(
        liveLocation.latitude, 
        liveLocation.longitude, 
        customerCoords.latitude, 
        customerCoords.longitude
      )
    : 1.4; // estimated average distance

  const etaMinutes = hasLiveGps 
    ? riderGpsSync.calculateEtaMinutes(distanceKm)
    : 8;

  const formattedDistance = hasLiveGps 
    ? riderGpsSync.formatDistance(distanceKm)
    : '~1.4 km';

  // 1. Subscribe to real-time GPS updates for this order
  useEffect(() => {
    const unsubscribe = riderGpsSync.subscribeToRiderLocation(order.id, (update) => {
      setLiveLocation(update);
      setLastUpdatedText('Just now');
    });

    return () => {
      unsubscribe();
    };
  }, [order.id]);

  // Update "last updated" text timer
  useEffect(() => {
    if (!liveLocation) return;
    const interval = setInterval(() => {
      const elapsedSec = Math.floor((Date.now() - liveLocation.timestamp) / 1000);
      if (elapsedSec < 10) {
        setLastUpdatedText('Just now');
      } else if (elapsedSec < 60) {
        setLastUpdatedText(`${elapsedSec}s ago`);
      } else {
        const mins = Math.floor(elapsedSec / 60);
        setLastUpdatedText(`${mins}m ago`);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [liveLocation]);

  // 2. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    try {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
      }).setView([customerCoords.latitude, customerCoords.longitude], 15);

      // CartoDB Voyager clean tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Custom Customer Marker
      const customerIcon = L.divIcon({
        className: 'custom-customer-pin',
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
            <div style="background: #D97706; color: #FFFFFF; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 9999px; box-shadow: 0 2px 4px rgba(0,0,0,0.2); white-space: nowrap; margin-bottom: 3px;">
              Your Doorstep
            </div>
            <div style="width: 32px; height: 32px; background: #D97706; border: 2.5px solid #FFFFFF; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.25);">
              <span style="font-size: 14px;">📍</span>
            </div>
          </div>
        `,
        iconSize: [32, 48],
        iconAnchor: [16, 48],
      });

      const customerMarker = L.marker([customerCoords.latitude, customerCoords.longitude], {
        icon: customerIcon,
        zIndexOffset: 100,
      }).addTo(map);

      // Custom Shop Marker
      const shopIcon = L.divIcon({
        className: 'custom-shop-pin',
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
            <div style="background: #0F766E; color: #FFFFFF; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 9999px; box-shadow: 0 2px 4px rgba(0,0,0,0.2); white-space: nowrap; margin-bottom: 3px;">
              ${shopCoords.name || 'Merchant Shop'}
            </div>
            <div style="width: 30px; height: 30px; background: #0F766E; border: 2.5px solid #FFFFFF; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.25);">
              <span style="font-size: 13px;">🏬</span>
            </div>
          </div>
        `,
        iconSize: [30, 46],
        iconAnchor: [15, 46],
      });

      const shopMarker = L.marker([shopCoords.latitude, shopCoords.longitude], {
        icon: shopIcon,
        zIndexOffset: 80,
      }).addTo(map);

      markersRef.current.customer = customerMarker;
      markersRef.current.shop = shopMarker;
      mapInstanceRef.current = map;

      // Fit bounds initially
      const bounds = L.latLngBounds([
        [customerCoords.latitude, customerCoords.longitude],
        [shopCoords.latitude, shopCoords.longitude],
      ]);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });

    } catch (err: any) {
      console.error('Error creating Leaflet map:', err);
      setMapError('Map could not be rendered');
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 3. Update Rider Marker and Route when real GPS coordinates change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (hasLiveGps && liveLocation) {
      const riderLatLng: L.LatLngTuple = [liveLocation.latitude, liveLocation.longitude];
      const customerLatLng: L.LatLngTuple = [customerCoords.latitude, customerCoords.longitude];

      // Custom Rider Icon with real-time radar ping
      const riderIcon = L.divIcon({
        className: 'custom-rider-pin',
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -50%);">
            <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
              <!-- Pulsing satellite radar ring -->
              <div style="position: absolute; inset: -4px; border-radius: 50%; background: rgba(15, 118, 110, 0.35); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
              <!-- Inner marker -->
              <div style="position: relative; width: 38px; height: 38px; background: #111827; border: 2.5px solid #F59E0B; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);">
                <span style="font-size: 18px;">🛵</span>
              </div>
            </div>
            <div style="background: #111827; color: #F59E0B; font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 9999px; margin-top: 2px; border: 1px solid #374151; white-space: nowrap;">
              ${riderName} • LIVE
            </div>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      });

      if (!markersRef.current.rider) {
        markersRef.current.rider = L.marker(riderLatLng, {
          icon: riderIcon,
          zIndexOffset: 200,
        }).addTo(map);
      } else {
        markersRef.current.rider.setLatLng(riderLatLng);
        markersRef.current.rider.setIcon(riderIcon);
      }

      // Draw real route line between Rider and Customer
      if (markersRef.current.route) {
        markersRef.current.route.setLatLngs([riderLatLng, customerLatLng]);
      } else {
        markersRef.current.route = L.polyline([riderLatLng, customerLatLng], {
          color: '#0F766E',
          weight: 4,
          opacity: 0.85,
          dashArray: '6, 8',
        }).addTo(map);
      }

      // Smooth pan to keep rider visible
      const bounds = L.latLngBounds([riderLatLng, customerLatLng]);
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 16 });

    } else {
      // If live GPS is stopped/not active, remove rider marker
      if (markersRef.current.rider) {
        markersRef.current.rider.remove();
        delete markersRef.current.rider;
      }
      if (markersRef.current.route) {
        markersRef.current.route.remove();
        delete markersRef.current.route;
      }
    }
  }, [hasLiveGps, liveLocation?.latitude, liveLocation?.longitude]);

  // Recenter map button handler
  const handleRecenter = () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (hasLiveGps && liveLocation) {
      const bounds = L.latLngBounds([
        [liveLocation.latitude, liveLocation.longitude],
        [customerCoords.latitude, customerCoords.longitude],
      ]);
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 16 });
    } else {
      const bounds = L.latLngBounds([
        [customerCoords.latitude, customerCoords.longitude],
        [shopCoords.latitude, shopCoords.longitude],
      ]);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    }
  };

  const handleCallRider = () => {
    window.location.href = `tel:${riderPhone.replace(/\s+/g, '')}`;
  };

  return (
    <div className="w-full bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden shadow-xl border border-neutral-200 dark:border-neutral-800 transition-colors">
      {/* Live Map Frame Container */}
      <div className="relative w-full h-[280px] sm:h-[320px] bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Floating Top Header Overlay */}
        <div className="absolute top-3 inset-x-3 z-10 flex items-center justify-between pointer-events-none">
          {/* Live Status Pill */}
          <div className="pointer-events-auto bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-neutral-200/80 dark:border-neutral-800 flex items-center gap-2">
            {hasLiveGps ? (
              <>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] font-black tracking-tight text-emerald-800 dark:text-emerald-300 uppercase">
                  Live GPS Active
                </span>
                <span className="text-[10px] text-neutral-400">({lastUpdatedText})</span>
              </>
            ) : (
              <>
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300">
                  Awaiting Rider GPS Signal
                </span>
              </>
            )}
          </div>

          {/* Recenter Button */}
          <button
            onClick={handleRecenter}
            className="pointer-events-auto w-9 h-9 rounded-full bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 shadow-md border border-neutral-200 dark:border-neutral-800 flex items-center justify-center hover:bg-neutral-50 dark:hover:bg-neutral-800 active:scale-95 transition-all cursor-pointer"
            title="Recenter Map"
            aria-label="Recenter Map"
          >
            <LocateFixed className="w-4 h-4 text-teal-800 dark:text-teal-400" />
          </button>
        </div>

        {/* Floating "Live GPS not connected yet" banner if rider hasn't transmitted yet */}
        {!hasLiveGps && (
          <div className="absolute inset-x-3 bottom-3 z-10 pointer-events-auto bg-neutral-900/90 text-white backdrop-blur-md rounded-2xl p-3 shadow-xl border border-neutral-700/80 flex items-start gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Radio className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-amber-300">
                Live GPS not connected yet
              </p>
              <p className="text-[11px] text-neutral-300 leading-snug mt-0.5">
                Rider has been assigned and is heading to the merchant. Live device GPS coordinates will stream here once the rider begins delivery.
              </p>
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() => navigateTo('rider_dashboard')}
                  className="px-2.5 py-1 bg-amber-400 text-neutral-950 rounded-lg text-[10px] font-extrabold flex items-center gap-1 hover:bg-amber-300 active:scale-95 transition-all cursor-pointer"
                >
                  <span>Launch Rider Partner App</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Card / Details Section */}
      <div className="p-4 space-y-4">
        {/* Status & ETA Header Row */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="space-y-0.5">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-teal-800 dark:text-teal-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-teal-600 dark:bg-teal-400 animate-ping" />
              Rider is on the way
            </span>
            <h3 className="text-lg font-black text-neutral-900 dark:text-white font-brand leading-tight">
              Arriving in ~{etaMinutes} mins
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Estimated distance: <strong className="text-neutral-800 dark:text-neutral-200">{formattedDistance}</strong> away
            </p>
          </div>

          <div className="text-right">
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-200 text-xs font-black">
              <Clock className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
              <span>{order.estimatedDelivery || '15-25 mins'}</span>
            </div>
            {hasLiveGps && (
              <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                Real-time satellite feed
              </span>
            )}
          </div>
        </div>

        {/* Rider Profile and Contact Card */}
        <div className="bg-neutral-50 dark:bg-neutral-800/60 rounded-2xl p-3.5 border border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Rider Avatar */}
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-800 to-teal-600 text-white font-black text-base flex items-center justify-center shadow-md">
                🛵
              </div>
              <span className="absolute -bottom-1 -right-1 bg-amber-400 text-neutral-950 text-[9px] font-black px-1.5 py-0.2 rounded-full border-2 border-white dark:border-neutral-900 shadow-2xs">
                {riderRating}★
              </span>
            </div>

            {/* Rider Info */}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="font-extrabold text-sm text-neutral-900 dark:text-white truncate font-brand">
                  {riderName}
                </h4>
                <span title="Verified Delivery Partner">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400 shrink-0" />
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                {riderVehicle}
              </p>
              
              {/* Share location is active indicator */}
              <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">
                <Radio className="w-3 h-3 animate-pulse" />
                <span>Share location is active</span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Call Rider + Chat */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCallRider}
              className="py-2 px-3 bg-teal-800 hover:bg-teal-900 active:bg-teal-950 text-white rounded-xl text-xs font-extrabold shadow-sm flex items-center gap-1.5 transition-all touch-press cursor-pointer"
              title="Call Delivery Partner"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Rider</span>
            </button>

            {onOpenSupport && (
              <button
                onClick={() => onOpenSupport(order.id)}
                className="p-2 bg-white dark:bg-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-600 rounded-xl transition-all cursor-pointer"
                title="Delivery Support"
                aria-label="Order Support"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Delivery Progress Points preview */}
        <div className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5 truncate">
            <Store className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400 shrink-0" />
            <span className="truncate">{shopCoords.name}</span>
          </div>
          <span className="text-neutral-300 dark:text-neutral-700 font-bold">→</span>
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="truncate">{customerCoords.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
