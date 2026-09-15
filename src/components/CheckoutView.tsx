import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  MapPin, 
  Coins, 
  Sparkles, 
  Check, 
  Truck, 
  Banknote, 
  Info, 
  ShieldCheck, 
  AlertCircle,
  FileText 
} from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const { 
    cart, 
    cartSubtotal, 
    coins, 
    deliveryAddress, 
    updateDeliveryAddress, 
    placeOrder, 
    goBack,
    calculateCoinsForCart,
    getMaxCoinsRedeemable
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI_ON_DELIVERY'>('COD');
  const [isRedeemingCoins, setIsRedeemingCoins] = useState<boolean>(true);
  
  // Calculate max redeemable coins under the 20% order value ceiling
  const { maxDiscount, maxCoins } = getMaxCoinsRedeemable(cartSubtotal);

  // Default to maximum redeemable coins or 0
  const [redeemedCoinsInput, setRedeemedCoinsInput] = useState<number>(() => {
    return Math.min(coins, maxCoins);
  });

  const effectiveCoinsRedeemed = isRedeemingCoins ? Math.min(redeemedCoinsInput, maxCoins, coins) : 0;
  // 100 coins = ₹10 => 1 coin = ₹0.10
  const coinDiscountAmount = Math.floor((effectiveCoinsRedeemed / 100) * 10);

  const isFreeDelivery = cartSubtotal >= 199;
  const deliveryFee = cartSubtotal === 0 ? 0 : isFreeDelivery ? 0 : 25;
  const finalPayable = Math.max(0, cartSubtotal - coinDiscountAmount + deliveryFee);

  const { totalCoins: coinsToEarn, breakdown } = calculateCoinsForCart(cart);

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    house: deliveryAddress.house,
    street: deliveryAddress.street,
    landmark: deliveryAddress.landmark,
    city: deliveryAddress.city,
    pincode: deliveryAddress.pincode,
    phone: deliveryAddress.phone,
  });

  const [deliveryInstructions, setDeliveryInstructions] = useState<string>('');

  const quickInstructionTags = [
    'Leave at door',
    'Ring doorbell',
    'Avoid calling',
    'Leave with security guard',
    'Call upon arrival',
  ];

  const handleToggleTag = (tag: string) => {
    setDeliveryInstructions((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) return tag;
      if (trimmed.includes(tag)) {
        // remove tag
        return trimmed
          .replace(new RegExp(`,?\\s*${tag}\\s*,?`, 'g'), ', ')
          .replace(/^,\s*/, '')
          .replace(/,\s*$/, '')
          .trim();
      }
      return `${trimmed}, ${tag}`;
    });
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    updateDeliveryAddress(addressForm);
    setIsEditingAddress(false);
  };

  const handlePlaceOrder = () => {
    placeOrder(effectiveCoinsRedeemed, paymentMethod, deliveryInstructions);
  };

  if (cart.length === 0) {
    return (
      <div className="p-8 text-center min-h-screen bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
        <p className="text-neutral-500 dark:text-neutral-400 text-sm">Your cart is currently empty.</p>
        <button
          onClick={goBack}
          className="mt-4 px-4 py-2 bg-teal-700 dark:bg-teal-600 text-white rounded-xl text-xs font-bold cursor-pointer"
        >
          Return to Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 pb-44 transition-colors">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-teal-800 dark:bg-neutral-900 text-white px-4 py-3 flex items-center gap-3 shadow-md border-b dark:border-neutral-800">
        <button
          onClick={goBack}
          className="p-1 rounded-full hover:bg-teal-700 dark:hover:bg-neutral-800 active:bg-teal-900 transition-colors cursor-pointer"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="font-extrabold text-base tracking-tight font-brand">
            Checkout & Payment
          </h2>
          <p className="text-[11px] text-teal-200 dark:text-teal-400">
            {cart.length} items • Fast local delivery
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-3.5">
        {/* Delivery Address Card */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-700 dark:text-teal-400" />
              <h3 className="font-extrabold text-sm text-neutral-900 dark:text-white font-brand">
                Delivery Address
              </h3>
            </div>
            <button
              onClick={() => setIsEditingAddress(!isEditingAddress)}
              className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:text-teal-900 dark:hover:text-teal-300 transition-colors cursor-pointer"
            >
              {isEditingAddress ? 'Cancel' : 'Change'}
            </button>
          </div>

          {!isEditingAddress ? (
            <div className="text-xs text-neutral-700 dark:text-neutral-300 space-y-0.5">
              <p className="font-bold text-neutral-900 dark:text-white">{deliveryAddress.name} ({deliveryAddress.phone})</p>
              <p>{deliveryAddress.house}, {deliveryAddress.street}</p>
              <p>{deliveryAddress.landmark}, {deliveryAddress.city} - {deliveryAddress.pincode}</p>
              <div className="mt-2 flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold text-[11px]">
                <Truck className="w-3.5 h-3.5" />
                <span>Estimated Delivery: 25 - 35 minutes</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveAddress} className="space-y-2.5 pt-2 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 dark:text-neutral-400 mb-0.5">Flat / House / Apartment</label>
                <input
                  type="text"
                  value={addressForm.house}
                  onChange={(e) => setAddressForm({ ...addressForm, house: e.target.value })}
                  className="w-full p-2 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-lg focus:outline-none focus:ring-1.5 focus:ring-teal-700"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 dark:text-neutral-400 mb-0.5">Street / Area</label>
                <input
                  type="text"
                  value={addressForm.street}
                  onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                  className="w-full p-2 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-lg focus:outline-none focus:ring-1.5 focus:ring-teal-700"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 dark:text-neutral-400 mb-0.5">Landmark</label>
                  <input
                    type="text"
                    value={addressForm.landmark}
                    onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                    className="w-full p-2 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-lg focus:outline-none focus:ring-1.5 focus:ring-teal-700"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 dark:text-neutral-400 mb-0.5">Pincode</label>
                  <input
                    type="text"
                    value={addressForm.pincode}
                    onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                    className="w-full p-2 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-lg focus:outline-none focus:ring-1.5 focus:ring-teal-700"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-teal-800 dark:bg-teal-600 text-white rounded-lg font-bold text-xs hover:bg-teal-900 dark:hover:bg-teal-700 transition-colors cursor-pointer"
              >
                Save Delivery Address
              </button>
            </form>
          )}
        </div>

        {/* Delivery Instructions (Optional) */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-700 dark:text-teal-400" />
              <h3 className="font-extrabold text-sm text-neutral-900 dark:text-white font-brand">
                Delivery Instructions
              </h3>
            </div>
            <span className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full">
              Optional
            </span>
          </div>

          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-tight">
            Help our delivery rider locate your address quickly with gate pass codes or landmark notes.
          </p>

          <div className="relative">
            <textarea
              value={deliveryInstructions}
              onChange={(e) => setDeliveryInstructions(e.target.value.slice(0, 250))}
              rows={3}
              placeholder="e.g., Gate code #402, please ring bell twice, landmark opposite temple, or leave with security guard..."
              className="w-full p-2.5 text-xs text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:bg-white dark:focus:bg-neutral-800 focus:outline-none focus:ring-1.5 focus:ring-teal-700 transition-all resize-none"
            />
            <div className="flex justify-between items-center mt-1 text-[10px] text-neutral-400 dark:text-neutral-500">
              <span>Rider will see this note upon arrival</span>
              <span>{deliveryInstructions.length}/250</span>
            </div>
          </div>

          {/* Quick chip suggestions */}
          <div>
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-400 uppercase tracking-wider block mb-1.5">
              Quick Suggestions:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {quickInstructionTags.map((tag) => {
                const isSelected = deliveryInstructions.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleToggleTag(tag)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-teal-800 dark:bg-teal-600 text-white font-bold shadow-2xs'
                        : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200/80 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    {tag} {isSelected && '✓'}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* DUKAANO Coins Redemption Card */}
        <div className="bg-gradient-to-br from-amber-50 to-amber-100/60 dark:from-amber-950/40 dark:to-amber-900/20 rounded-2xl border border-amber-300 dark:border-amber-800/80 p-4 shadow-2xs">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center font-extrabold shadow-2xs">
                <Coins className="w-4 h-4 fill-neutral-950" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-neutral-950 dark:text-white font-brand">
                  Redeem DUKAANO Coins
                </h3>
                <p className="text-[11px] text-neutral-700 dark:text-neutral-300">
                  Available: <strong className="text-neutral-950 dark:text-amber-300">{coins} Coins</strong> (₹{(coins * 0.1).toFixed(0)} value)
                </p>
              </div>
            </div>

            {/* Toggle checkbox */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isRedeemingCoins && coins > 0}
                disabled={coins === 0}
                onChange={(e) => setIsRedeemingCoins(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-neutral-300 dark:bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          {/* Redemption Rules Notice */}
          <div className="mt-3 p-2.5 bg-white/80 dark:bg-neutral-900/80 rounded-xl border border-amber-200/80 dark:border-amber-800/60 text-[11px] space-y-1 text-neutral-700 dark:text-neutral-300">
            <div className="flex items-center gap-1.5 font-bold text-neutral-900 dark:text-white">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Conversion: 100 Coins = ₹10 Discount</span>
            </div>
            <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
              <Info className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400 shrink-0" />
              <span>Max allowed redemption: <strong>20% of order value (₹{maxDiscount} / {maxCoins} coins)</strong></span>
            </div>
          </div>

          {coins === 0 ? (
            <p className="mt-2 text-[11px] text-neutral-500 dark:text-neutral-400 italic">
              You currently have 0 coins. Complete this order to earn +{coinsToEarn} coins!
            </p>
          ) : isRedeemingCoins ? (
            <div className="mt-3 pt-2.5 border-t border-amber-200 dark:border-amber-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-neutral-900 dark:text-white">
                <span>Coins applied:</span>
                <span className="text-amber-900 dark:text-amber-300 font-extrabold">
                  {effectiveCoinsRedeemed} Coins = -₹{coinDiscountAmount} OFF
                </span>
              </div>

              {/* Quick slider or amount chips */}
              <input
                type="range"
                min="0"
                max={Math.min(coins, maxCoins)}
                step="10"
                value={effectiveCoinsRedeemed}
                onChange={(e) => setRedeemedCoinsInput(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />

              <div className="flex justify-between text-[10px] font-semibold text-neutral-500 dark:text-neutral-400">
                <span>0 Coins</span>
                <span className="text-amber-800 dark:text-amber-400 font-bold">
                  Max: {Math.min(coins, maxCoins)} Coins (₹{maxDiscount} off)
                </span>
              </div>
            </div>
          ) : (
            <p className="mt-2 text-[11px] text-neutral-600 dark:text-neutral-400 font-medium">
              Check the toggle above to use your DUKAANO Coins on this order.
            </p>
          )}
        </div>

        {/* Payment Method - COD Prominent */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 shadow-2xs">
          <h3 className="font-extrabold text-sm text-neutral-900 dark:text-white font-brand mb-2.5 flex items-center gap-1.5">
            <Banknote className="w-4 h-4 text-teal-700 dark:text-teal-400" />
            <span>Select Payment Method</span>
          </h3>

          <div className="space-y-2">
            {/* COD Option */}
            <label 
              className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                paymentMethod === 'COD'
                  ? 'border-teal-700 dark:border-teal-500 bg-teal-50/70 dark:bg-teal-950/40 ring-1 ring-teal-700 dark:ring-teal-500'
                  : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="accent-teal-700"
                />
                <div>
                  <span className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                    <span>Cash on Delivery (COD)</span>
                    <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold px-1.5 py-0.2 rounded">
                      Recommended
                    </span>
                  </span>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Pay with cash directly to the delivery partner
                  </p>
                </div>
              </div>
              <Banknote className="w-5 h-5 text-teal-800 dark:text-teal-400" />
            </label>

            {/* UPI on Delivery Option */}
            <label 
              className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                paymentMethod === 'UPI_ON_DELIVERY'
                  ? 'border-teal-700 dark:border-teal-500 bg-teal-50/70 dark:bg-teal-950/40 ring-1 ring-teal-700 dark:ring-teal-500'
                  : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="payment"
                  value="UPI_ON_DELIVERY"
                  checked={paymentMethod === 'UPI_ON_DELIVERY'}
                  onChange={() => setPaymentMethod('UPI_ON_DELIVERY')}
                  className="accent-teal-700"
                />
                <div>
                  <span className="text-xs font-bold text-neutral-900 dark:text-white">
                    UPI QR on Delivery
                  </span>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Scan delivery partner's QR with GPay, PhonePe, Paytm
                  </p>
                </div>
              </div>
              <span className="text-xs font-black text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/70 px-2 py-0.5 rounded">
                UPI
              </span>
            </label>
          </div>
        </div>

        {/* Earning Preview Banner */}
        <div className="bg-gradient-to-r from-teal-800 to-teal-900 dark:from-teal-900 dark:to-teal-950 text-white rounded-2xl p-3.5 shadow-sm border dark:border-teal-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
              <div>
                <p className="text-xs font-bold text-white">
                  Coins you will earn from this order:
                </p>
                <p className="text-[10px] text-teal-200 dark:text-teal-300">
                  Credited instantly to your DUKAANO wallet upon delivery
                </p>
              </div>
            </div>
            <span className="bg-amber-400 text-neutral-950 font-black text-sm px-2.5 py-1 rounded-full shadow-2xs">
              +{coinsToEarn} Coins
            </span>
          </div>

          <div className="mt-2 pt-2 border-t border-teal-700/60 flex flex-wrap gap-1.5 text-[10px] text-teal-100">
            {breakdown.map((item) => (
              <span key={item.category} className="bg-teal-700/50 px-2 py-0.5 rounded">
                {item.categoryTitle}: ₹{item.amountSpent} ({item.rate}%) = +{item.coins} coins
              </span>
            ))}
          </div>
        </div>

        {/* Detailed Price Breakdown */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 shadow-2xs space-y-2">
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
            Order Calculation
          </h3>

          <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-400">
            <span>Items Subtotal</span>
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">₹{cartSubtotal}</span>
          </div>

          {effectiveCoinsRedeemed > 0 && (
            <div className="flex justify-between text-xs text-emerald-700 dark:text-emerald-400 font-bold">
              <span>DUKAANO Coins ({effectiveCoinsRedeemed} redeemed)</span>
              <span>-₹{coinDiscountAmount}</span>
            </div>
          )}

          <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-400">
            <span>Delivery Partner Fee</span>
            {isFreeDelivery ? (
              <span className="font-bold text-emerald-700 dark:text-emerald-400">FREE</span>
            ) : (
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">₹{deliveryFee}</span>
            )}
          </div>

          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex justify-between items-center text-sm font-extrabold text-neutral-900 dark:text-white">
            <span>Final Payable Total</span>
            <span className="text-lg text-teal-800 dark:text-teal-400 font-brand">₹{finalPayable}</span>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar positioned above BottomNav */}
      <div className="fixed bottom-[58px] left-0 right-0 z-40 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-t border-neutral-200/90 dark:border-neutral-800 p-3.5 shadow-xl">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div>
            <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium block">
              {paymentMethod === 'COD' ? 'Pay on Delivery' : 'Scan QR at Doorstep'}
            </span>
            <span className="text-xl font-black text-neutral-900 dark:text-white font-brand">
              ₹{finalPayable}
            </span>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="flex-1 py-3 px-5 bg-teal-800 dark:bg-teal-600 hover:bg-teal-900 dark:hover:bg-teal-700 active:bg-teal-950 text-white rounded-xl font-extrabold text-sm shadow-md flex items-center justify-center gap-2 transition-all touch-press cursor-pointer"
          >
            <span>Confirm Order</span>
            <span className="bg-amber-400 text-neutral-950 text-[11px] font-black px-2 py-0.5 rounded-full">
              +{coinsToEarn} Coins
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
