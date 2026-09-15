#!/usr/bin/env bash
# ==============================================================================
# Generate DUKAANO Release Keystore for Google Play Store upload
# ==============================================================================
set -e

KEYSTORE_PATH="android/app/dukaano-release.keystore"
ALIAS="dukaano"

if [ -f "$KEYSTORE_PATH" ]; then
  echo "⚠️ Keystore already exists at: $KEYSTORE_PATH"
  exit 0
fi

echo "🔐 Generating release keystore for DUKAANO..."
keytool -genkey -v -keystore "$KEYSTORE_PATH" \
  -alias "$ALIAS" \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass dukaano123 \
  -keypass dukaano123 \
  -dname "CN=DUKAANO Marketplace, OU=Mobile, O=DUKAANO, L=Mumbai, ST=Maharashtra, C=IN"

echo "✅ Keystore successfully created at $KEYSTORE_PATH"
echo "   Keystore password:  dukaano123"
echo "   Key alias:          dukaano"
echo "   Key password:       dukaano123"
