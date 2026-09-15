#!/usr/bin/env bash
# ==============================================================================
# DUKAANO - Android App Bundle (.aab) Build Script for Google Play Store
# ==============================================================================
set -e

echo "🚀 Starting DUKAANO Android Build..."

# Step 1: Build Web App Distribution
echo "📦 Step 1: Building production web bundle..."
npm run build

# Step 2: Sync Web Assets to Android Native Project
echo "🔄 Step 2: Syncing Capacitor Android assets..."
npx cap sync android

# Step 3: Check/Build Android App Bundle (.aab)
echo "📱 Step 3: Preparing Android Gradle project..."
cd android

# If a release keystore is found or credentials provided, build release bundle
if [ -f "app/dukaano-release.keystore" ] || [ -n "$RELEASE_STORE_FILE" ]; then
  echo "🔑 Found release keystore. Generating signed release Android App Bundle (.aab)..."
  ./gradlew bundleRelease
  echo "✅ Success! Release App Bundle generated at:"
  echo "   android/app/build/outputs/bundle/release/app-release.aab"
else
  echo "ℹ️  No release keystore detected. Generating unsigned/debug bundle for testing..."
  echo "   (To generate a release keystore, run: npm run generate:keystore)"
  ./gradlew bundleDebug || ./gradlew bundleRelease --no-daemon
fi

echo "🎉 DUKAANO Android Bundle build complete!"
