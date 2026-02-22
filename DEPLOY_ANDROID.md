# THE ARENA - Android Deployment Guide

**Deploy THE ARENA to Android in 3 simple steps.**

---

## Prerequisites

1. **Expo Account** - Create at https://expo.dev
2. **EAS Account** - Create at https://expo.dev (same account)
3. **GitHub Account** - For code hosting
4. **Android Phone** - For testing and deployment

---

## Step 1: Install Expo CLI

```bash
npm install -g eas-cli expo-cli
```

Verify installation:
```bash
eas --version
expo --version
```

---

## Step 2: Authenticate with Expo

```bash
cd /home/ubuntu/the-arena-mobile
eas login
```

When prompted:
- Enter your Expo email
- Enter your Expo password

---

## Step 3: Build APK for Android

### Option A: Build APK (Direct Install on Phone)

```bash
eas build --platform android --local
```

This will:
1. Build the Android APK locally
2. Generate `the-arena-mobile.apk` file
3. Show you the file location

### Option B: Build via Cloud (Faster)

```bash
eas build --platform android
```

This will:
1. Build on Expo's servers
2. Generate a download link
3. Send link to your email

---

## Step 4: Install on Android Phone

### Method 1: Direct APK Install

1. Download the APK file to your phone
2. Open file manager
3. Tap the APK file
4. Tap "Install"
5. Grant permissions
6. Launch the app

### Method 2: USB Cable

```bash
# Connect phone via USB
adb install the-arena-mobile.apk
```

### Method 3: Scan QR Code

After build completes, scan the QR code with your phone to download and install.

---

## Step 5: Test on Phone

1. Open THE ARENA app
2. Test quad-exposure feature
3. Test publishing
4. Test blockchain claiming
5. Test offline mode

---

## Deploy to Google Play Store

### Step 1: Create Google Play Account

1. Go to https://play.google.com/console
2. Create a developer account ($25 one-time fee)
3. Create a new app

### Step 2: Generate Signing Key

```bash
eas credentials
```

Follow prompts to:
- Create a new keystore
- Set keystore password
- Set key alias and password

### Step 3: Build for Production

```bash
eas build --platform android --auto-submit
```

This will:
1. Build production APK
2. Sign with your key
3. Submit to Google Play Store

### Step 4: Review and Publish

1. Go to Google Play Console
2. Review your app details
3. Set pricing (free)
4. Submit for review
5. Wait for approval (usually 24-48 hours)

---

## One-Click Deploy Script

Create `deploy-android.sh`:

```bash
#!/bin/bash

echo "🚀 THE ARENA - Android Deployment"
echo ""

# Check prerequisites
if ! command -v eas &> /dev/null; then
    echo "Installing EAS CLI..."
    npm install -g eas-cli
fi

# Login
echo "Logging in to Expo..."
eas login

# Build
echo "Building APK..."
eas build --platform android

echo ""
echo "✅ Build complete!"
echo "Download link has been sent to your email."
echo ""
echo "Next steps:"
echo "1. Download APK from link in email"
echo "2. Transfer to Android phone"
echo "3. Install APK"
echo "4. Launch THE ARENA"
echo ""
```

Make executable:
```bash
chmod +x deploy-android.sh
./deploy-android.sh
```

---

## Troubleshooting

### Build Fails

```bash
# Clear cache
rm -rf node_modules .expo
npm install

# Try again
eas build --platform android
```

### APK Won't Install

- Check Android version (requires Android 6.0+)
- Enable "Unknown sources" in Settings
- Free up storage space on phone

### App Crashes on Launch

1. Check logs:
   ```bash
   eas build:view
   ```

2. Review error messages

3. Check API URL in settings

### Can't Connect to Backend

1. Verify backend is running
2. Check API URL in app settings
3. Ensure phone has internet connection

---

## Testing Checklist

- [ ] App installs successfully
- [ ] Home screen loads
- [ ] Can navigate to Lab
- [ ] Can enter prompt
- [ ] Can get quad-exposure responses
- [ ] Can view history
- [ ] Can access settings
- [ ] Can change API URL
- [ ] Offline mode works
- [ ] Dark theme displays correctly

---

## Distribution

### Share APK

1. Build APK locally
2. Upload to file sharing service
3. Share download link with users

### Google Play Store

1. Follow "Deploy to Google Play Store" section above
2. App will be available to all Android users
3. Users can find it by searching "THE ARENA"

### F-Droid (Open Source)

1. Submit APK to F-Droid
2. Available in F-Droid app store
3. No fees, no review process

---

## Monitoring

### View Build Status

```bash
eas build:view
```

### View Build Logs

```bash
eas build:view --id <build-id>
```

### Download Build

```bash
eas build:download --id <build-id>
```

---

## Updates

### Push Updates Over-the-Air

```bash
eas update
```

This allows users to get updates without rebuilding APK.

### Create New Build

```bash
# Update version in app.json
# Then rebuild
eas build --platform android
```

---

## Costs

| Service | Cost |
|---------|------|
| Expo | Free |
| EAS Build | Free (limited) / $99/month (unlimited) |
| Google Play | $25 one-time |
| **Total** | **$25 one-time** |

---

## Support

- **Expo Docs**: https://docs.expo.dev
- **EAS Docs**: https://docs.expo.dev/eas
- **Android Docs**: https://developer.android.com

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `eas login` | Login to Expo |
| `eas build --platform android` | Build APK |
| `eas build --platform android --local` | Build locally |
| `eas build:view` | View build status |
| `eas update` | Push OTA update |
| `adb install app.apk` | Install via USB |

---

**Ready to deploy? Run: `eas build --platform android`**

Built by NO_GAS_LABS™
