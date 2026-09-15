import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Coins, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  Star, 
  Heart, 
  ShieldCheck, 
  Info, 
  RotateCcw,
  MessageSquareHeart,
  ChevronDown,
  ChevronUp,
  Share2
} from 'lucide-react';

// ============================================================================
// CONFIGURABLE SOCIAL & REVIEW PLACEHOLDER LINKS
// Update these official URLs when live social pages and Google Place IDs are ready
// ============================================================================
export const SOCIAL_OFFICIAL_LINKS = {
  instagram: 'https://www.instagram.com/dukaano_official',
  facebook: 'https://www.facebook.com/dukaano.india',
  googleReview: 'https://search.google.com/local/writereview?placeid=dukaano_india_preview',
};

interface FollowAndEarnSectionProps {
  showBalanceCard?: boolean;
  compact?: boolean;
}

export const FollowAndEarnSection: React.FC<FollowAndEarnSectionProps> = ({ 
  showBalanceCard = true,
  compact = false 
}) => {
  const { 
    coins, 
    socialClaimed, 
    claimSocialReward, 
    resetSocialReward 
  } = useApp();

  const [activeModal, setActiveModal] = useState<'instagram' | 'facebook' | 'google' | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [showConfigLinks, setShowConfigLinks] = useState<boolean>(false);

  // Conversion: 100 coins = ₹10 => 1 coin = ₹0.10
  const coinRupeeValue = (coins * 0.1).toFixed(1);

  // Handle Instagram click
  const handleInstagramClick = () => {
    // Open placeholder link in a safe new window
    try {
      window.open(SOCIAL_OFFICIAL_LINKS.instagram, '_blank', 'noopener,noreferrer');
    } catch {
      // ignore
    }

    if (!socialClaimed.instagram) {
      setActiveModal('instagram');
    } else {
      showToast('You have already claimed 100 D Coins for following on Instagram!');
    }
  };

  // Handle Facebook click
  const handleFacebookClick = () => {
    // Open placeholder link in a safe new window
    try {
      window.open(SOCIAL_OFFICIAL_LINKS.facebook, '_blank', 'noopener,noreferrer');
    } catch {
      // ignore
    }

    if (!socialClaimed.facebook) {
      setActiveModal('facebook');
    } else {
      showToast('You have already claimed 100 D Coins for following on Facebook!');
    }
  };

  // Handle Google Review click (Zero coin incentive - purely honest feedback)
  const handleGoogleReviewClick = () => {
    try {
      window.open(SOCIAL_OFFICIAL_LINKS.googleReview, '_blank', 'noopener,noreferrer');
    } catch {
      // ignore
    }
    setActiveModal('google');
  };

  // Confirm and credit 100 D Coins for social follow
  const handleConfirmSocialReward = (platform: 'instagram' | 'facebook') => {
    const success = claimSocialReward(platform);
    setActiveModal(null);
    if (success) {
      const platformName = platform === 'instagram' ? 'Instagram' : 'Facebook';
      showToast(`🎉 +100 D Coins added for following on ${platformName}!`);
    }
  };

  const showToast = (message: string) => {
    setSuccessToast(message);
    setTimeout(() => {
      setSuccessToast(null);
    }, 4500);
  };

  return (
    <div className="space-y-4">
      {/* ==================================================================== */}
      {/* 1. D COINS BALANCE SECTION                                          */}
      {/* ==================================================================== */}
      {showBalanceCard && (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 shadow-2xs transition-all relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-400 dark:bg-amber-500 text-neutral-950 flex items-center justify-center font-black shadow-xs shrink-0">
                <Coins className="w-5 h-5 fill-neutral-950 text-neutral-950" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block">
                  Current Rewards Balance
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-neutral-900 dark:text-neutral-50 font-brand">
                    {coins}
                  </span>
                  <span className="text-xs font-black text-amber-600 dark:text-amber-400 font-brand uppercase tracking-tight">
                    D Coins
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-[11px] font-black px-2.5 py-1 rounded-xl">
                ≈ ₹{coinRupeeValue} Off
              </span>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block mt-0.5 font-medium">
                100 D Coins = ₹10
              </span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400">
            <span className="flex items-center gap-1 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Redeem up to 20% on any order at checkout</span>
            </span>
            <span className="text-[11px] font-bold text-teal-800 dark:text-teal-400">
              Verified Tier
            </span>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 2. FOLLOW & EARN D COINS MAIN SECTION                                */}
      {/* ==================================================================== */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 shadow-2xs space-y-4">
        {/* Section Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-teal-50 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 flex items-center justify-center font-bold">
                <Share2 className="w-4 h-4 text-teal-700 dark:text-teal-400" />
              </div>
              <h2 className="text-sm font-extrabold text-neutral-900 dark:text-white font-brand tracking-tight">
                Follow & Earn D Coins
              </h2>
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
              Connect with DUKAANO for local store updates and earn 100 D Coins for following on social media.
            </p>
          </div>

          <span className="text-[10px] font-black bg-gradient-to-r from-amber-400 to-amber-500 text-neutral-950 px-2 py-0.5 rounded-full shadow-2xs shrink-0">
            Earn 200 Coins
          </span>
        </div>

        {/* Social Follow Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* ================================================================ */}
          {/* INSTAGRAM FOLLOW BUTTON / CARD                                   */}
          {/* ================================================================ */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-neutral-50 to-neutral-100/50 dark:from-neutral-800/60 dark:to-neutral-800/30 border border-neutral-200/80 dark:border-neutral-700/80 flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-600 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                {/* Authentic Instagram gradient badge */}
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center text-white shadow-xs">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-neutral-900 dark:text-white leading-tight">
                    Instagram
                  </h3>
                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400">
                    @dukaano_official
                  </span>
                </div>
              </div>

              {socialClaimed.instagram ? (
                <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md flex items-center gap-1 border border-emerald-300 dark:border-emerald-800">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>100 D Coins</span>
                </span>
              ) : (
                <span className="text-[10px] font-black text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-300 dark:border-amber-700">
                  +100 D Coins
                </span>
              )}
            </div>

            <button
              onClick={handleInstagramClick}
              className={`w-full py-2 px-3 rounded-xl text-xs font-extrabold transition-all touch-press flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                socialClaimed.instagram
                  ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-600'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:hover:bg-white dark:text-neutral-900'
              }`}
            >
              {socialClaimed.instagram ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Followed DUKAANO</span>
                </>
              ) : (
                <>
                  <span>Follow DUKAANO</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </>
              )}
            </button>
          </div>

          {/* ================================================================ */}
          {/* FACEBOOK FOLLOW BUTTON / CARD                                    */}
          {/* ================================================================ */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-neutral-50 to-neutral-100/50 dark:from-neutral-800/60 dark:to-neutral-800/30 border border-neutral-200/80 dark:border-neutral-700/80 flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-600 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                {/* Authentic Facebook blue badge */}
                <div className="w-9 h-9 rounded-xl bg-[#1877F2] flex items-center justify-center text-white shadow-xs">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-neutral-900 dark:text-white leading-tight">
                    Facebook
                  </h3>
                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400">
                    facebook.com/dukaano.india
                  </span>
                </div>
              </div>

              {socialClaimed.facebook ? (
                <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md flex items-center gap-1 border border-emerald-300 dark:border-emerald-800">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>100 D Coins</span>
                </span>
              ) : (
                <span className="text-[10px] font-black text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-300 dark:border-amber-700">
                  +100 D Coins
                </span>
              )}
            </div>

            <button
              onClick={handleFacebookClick}
              className={`w-full py-2 px-3 rounded-xl text-xs font-extrabold transition-all touch-press flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                socialClaimed.facebook
                  ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-600'
                  : 'bg-[#1877F2] hover:bg-[#166fe5] text-white'
              }`}
            >
              {socialClaimed.facebook ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Followed DUKAANO</span>
                </>
              ) : (
                <>
                  <span>Follow DUKAANO</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* 3. GOOGLE REVIEWS SECTION (Strict Compliance - Zero Coin Incentive)   */}
        {/* ==================================================================== */}
        <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700/70 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              {/* Google G multi-color logo */}
              <div className="w-9 h-9 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center shadow-xs shrink-0">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-extrabold text-neutral-900 dark:text-white leading-tight">
                    Google Reviews
                  </h3>
                  <span className="flex items-center text-amber-500">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  </span>
                </div>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                  DUKAANO Local Marketplace • Bangalore
                </p>
              </div>
            </div>

            <span className="text-[10px] font-bold text-neutral-600 dark:text-neutral-300 bg-neutral-200/80 dark:bg-neutral-700/60 px-2 py-0.5 rounded-full">
              Voluntary
            </span>
          </div>

          {/* MANDATORY POLICY NOTE: "Please share your honest experience." */}
          <div className="p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/70 text-amber-950 dark:text-amber-200 text-xs">
            <div className="flex items-start gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-extrabold text-xs text-amber-950 dark:text-amber-100">
                  Please share your honest experience.
                </p>
                <p className="text-[11px] text-amber-900/90 dark:text-amber-300/90 mt-0.5 leading-snug">
                  We value authentic neighborhood feedback. In accordance with Google review policies, reviews are purely voluntary and not incentivized with D Coins.
                </p>
              </div>
            </div>
          </div>

          {/* Button: "Rate DUKAANO on Google" */}
          <button
            onClick={handleGoogleReviewClick}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-extrabold bg-teal-800 hover:bg-teal-900 active:bg-teal-950 text-white dark:bg-teal-700 dark:hover:bg-teal-600 transition-all touch-press flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>Rate DUKAANO on Google</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-90" />
          </button>
        </div>

        {/* ==================================================================== */}
        {/* 4. CONFIGURABLE PLACEHOLDER LINKS ACCORDION                          */}
        {/* ==================================================================== */}
        <div className="pt-1 border-t border-neutral-100 dark:border-neutral-800">
          <button
            onClick={() => setShowConfigLinks((prev) => !prev)}
            className="w-full flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 py-1 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
              <span>Official Links Placeholders (Configurable)</span>
            </span>
            {showConfigLinks ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          {showConfigLinks && (
            <div className="mt-2 p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-[10px] space-y-1.5 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Instagram:</span>
                <span className="text-teal-700 dark:text-teal-300 truncate max-w-[200px]">
                  {SOCIAL_OFFICIAL_LINKS.instagram}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Facebook:</span>
                <span className="text-teal-700 dark:text-teal-300 truncate max-w-[200px]">
                  {SOCIAL_OFFICIAL_LINKS.facebook}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Google Review:</span>
                <span className="text-teal-700 dark:text-teal-300 truncate max-w-[200px]">
                  {SOCIAL_OFFICIAL_LINKS.googleReview}
                </span>
              </div>

              {/* Rewards Status */}
              <div className="pt-2 mt-2 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between font-sans">
                <span className="text-[10px] text-neutral-500">Need to refresh status:</span>
                <button
                  onClick={() => {
                    resetSocialReward();
                    showToast('Social rewards status synced');
                  }}
                  className="flex items-center gap-1 text-[10px] font-bold text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Sync Rewards</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* VERIFICATION & CLAIM MODALS                                          */}
      {/* ==================================================================== */}
      {/* Instagram Follow Verification Modal */}
      {activeModal === 'instagram' && (
        <div className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 max-w-sm w-full p-5 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white flex items-center justify-center mx-auto shadow-sm">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>

            <div className="text-center">
              <h3 className="text-base font-extrabold text-neutral-900 dark:text-white font-brand">
                Followed DUKAANO on Instagram?
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Confirm your follow on <strong className="text-neutral-800 dark:text-neutral-200">@dukaano_official</strong> to receive your 100 D Coins reward.
              </p>
            </div>

            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 text-center">
              <span className="text-xs font-black text-amber-900 dark:text-amber-300">
                Reward: +100 D Coins (₹10 Discount Value)
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 py-2 rounded-xl text-xs font-bold border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer"
              >
                Later
              </button>
              <button
                onClick={() => handleConfirmSocialReward('instagram')}
                className="flex-1 py-2 rounded-xl text-xs font-extrabold bg-neutral-950 dark:bg-white text-amber-300 dark:text-neutral-950 hover:opacity-90 cursor-pointer shadow-xs"
              >
                Claim 100 Coins
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Facebook Follow Verification Modal */}
      {activeModal === 'facebook' && (
        <div className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 max-w-sm w-full p-5 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-[#1877F2] text-white flex items-center justify-center mx-auto shadow-sm">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>

            <div className="text-center">
              <h3 className="text-base font-extrabold text-neutral-900 dark:text-white font-brand">
                Followed DUKAANO on Facebook?
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Confirm your follow on <strong className="text-neutral-800 dark:text-neutral-200">facebook.com/dukaano.india</strong> to receive your 100 D Coins reward.
              </p>
            </div>

            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 text-center">
              <span className="text-xs font-black text-amber-900 dark:text-amber-300">
                Reward: +100 D Coins (₹10 Discount Value)
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 py-2 rounded-xl text-xs font-bold border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer"
              >
                Later
              </button>
              <button
                onClick={() => handleConfirmSocialReward('facebook')}
                className="flex-1 py-2 rounded-xl text-xs font-extrabold bg-[#1877F2] hover:bg-[#166fe5] text-white cursor-pointer shadow-xs"
              >
                Claim 100 Coins
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Google Review Prompt Modal (Reminder of Honest Feedback, Zero Coins) */}
      {activeModal === 'google' && (
        <div className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 max-w-sm w-full p-5 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 flex items-center justify-center mx-auto shadow-xs">
              <MessageSquareHeart className="w-6 h-6 text-teal-700 dark:text-teal-400" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-extrabold text-neutral-900 dark:text-white font-brand">
                Thank You for Reviewing DUKAANO
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                Your feedback opened in a new tab.
              </p>
            </div>

            <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl border border-neutral-200 dark:border-neutral-700 text-left text-xs space-y-1">
              <p className="font-extrabold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
                <span>Please share your honest experience.</span>
              </p>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Whether you had a seamless order or have suggestions for our delivery partners and local kirana stores, every honest review helps improve neighborhood retail.
              </p>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-xl text-xs font-extrabold bg-teal-800 hover:bg-teal-900 text-white dark:bg-teal-700 dark:hover:bg-teal-600 cursor-pointer shadow-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Floating Success Toast */}
      {successToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-neutral-900/95 dark:bg-neutral-100/95 backdrop-blur-md text-amber-300 dark:text-neutral-950 px-4 py-2.5 rounded-2xl shadow-xl border border-amber-400/40 text-xs font-black flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}
    </div>
  );
};
