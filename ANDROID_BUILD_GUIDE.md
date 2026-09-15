# DUKAANO: Android App Bundle (.aab) & Google Play Store Guide

DUKAANO has been converted into a production-ready Android mobile application powered by Capacitor and Gradle, configured to generate an **Android App Bundle (`.aab`)** for the Google Play Store.

---

## 📱 App Specifications

- **App Name:** DUKAANO
- **Application ID:** `com.dukaano.app`
- **Version Code:** `1`
- **Version Name:** `1.0.0`
- **Target SDK:** Android 14 / 15 (API 34/36) — *Compliant with Google Play Store 2026 requirements*
- **Minimum SDK:** Android 7.0 (API 24) — *95%+ device coverage*

---

## 🚀 How to Build the Android App Bundle (.aab)

### 1. Build the Production Web Assets & Sync to Android
```bash
npm run build:android
```
This compiles the optimized Vite bundle and synchronizes all assets into `android/app/src/main/assets/public`.

### 2. Generate a Release Keystore (For Play Store Upload)
If you do not already have an upload keystore:
```bash
npm run generate:keystore
```
This generates `android/app/dukaano-release.keystore` with:
- **Alias:** `dukaano`
- **Password:** `dukaano123` (or customize as needed)

### 3. Generate the Signed `.aab` Bundle
```bash
npm run bundle:aab
```
Or directly from the `android/` directory:
```bash
cd android
./gradlew bundleRelease
```

The generated Google Play Store bundle will be located at:
```
android/app/build/outputs/bundle/release/app-release.aab
```

---

## 🛠️ Android Native Features & Enhancements

1. **Native Back Button & Gesture Navigation:**
   - Pressing Android back button or swiping from the edge closes open modals (Cart, Tracking Map, Support Chat) before navigating away.
   - Navigates through nested screens (`product_detail` → `shop_detail` → `category` → `home`).
   - On the root Home tab, double-tapping back shows a native toast (*"Press back again to exit DUKAANO"*) and cleanly exits the app via `App.exitApp()`.

2. **DUKAANO Branded Splash Screen:**
   - Deep teal gradient (`#0F766E`) with DUKAANO emblem, golden sparkle, Hindi subtitle (*"आपकी अपनी दुकान"*), and service pillars (*Grocery • Care • Eats • SANIVOX*).
   - Automatically hides the native splash screen and transitions smoothly into the app.

3. **Android Adaptive Launcher Icons:**
   - Configured in `android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml` and `ic_launcher_round.xml`.
   - Native vector drawable `ic_launcher_foreground.xml` with golden market bag, letter 'D', and sparkle.

4. **Safe Area & Notch Insets:**
   - Uses `viewport-fit=cover` with `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)`.
   - Bottom navigation automatically adjusts above the Android system gesture pill and 3-button navigation bars.

5. **No Browser-Only UI & Production Copy:**
   - Removed test/demo terminology, replaced with professional marketplace copy.
   - Honest device geolocation with live coordinate streaming when delivery partners start orders.

6. **Offline Network Resilience & Error Boundary:**
   - Automatically detects internet connectivity loss and displays an offline mode notice.
   - Comprehensive `ErrorBoundary` catches unexpected render anomalies with one-tap recovery.

---

## 🌐 Opening in Android Studio
To inspect or run on a connected Android phone or emulator:
```bash
npx cap open android
```
In Android Studio:
1. Select **Build > Generate Signed Bundle / APK...**
2. Choose **Android App Bundle**
3. Select your keystore and destination folder
4. Upload the resulting `.aab` to Google Play Console under **Production** or **Internal Testing**.
