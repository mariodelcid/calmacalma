# Calma Calma — Android App Setup

## Prerequisites

1. **Node.js** (v18+) — https://nodejs.org
2. **Android Studio** — https://developer.android.com/studio
   - During install, make sure to include: Android SDK, Android SDK Platform, Android Virtual Device
3. **Java JDK 17** — Android Studio usually bundles this

## Step-by-step setup

### 1. Install dependencies

```bash
cd calmacalma
npm install
```

### 2. Build the web app

```bash
npm run build
```

### 3. Add the Android platform

```bash
npx cap add android
npx cap sync
```

### 4. Open in Android Studio

```bash
npx cap open android
```

This opens the Android project in Android Studio.

### 5. Test on your phone

**Option A — Direct USB install (recommended):**
1. On your Android phone: Settings → About Phone → tap "Build Number" 7 times to enable Developer Options
2. Go to Settings → Developer Options → enable "USB Debugging"
3. Connect your phone via USB cable
4. In Android Studio, your phone should appear in the device dropdown at the top
5. Click the green ▶️ Run button

**Option B — Generate APK to sideload:**
1. In Android Studio: Build → Build Bundle(s) / APK(s) → Build APK(s)
2. The APK will be at `android/app/build/outputs/apk/debug/app-debug.apk`
3. Transfer the APK to your phone (email, Google Drive, USB)
4. On your phone, open the APK to install (you may need to allow "Install from unknown sources")

## Everyday development workflow

After making code changes:

```bash
npm run cap:build    # builds web app + syncs to Android
npx cap open android # open in Android Studio to run
```

Or for live reload during development:

```bash
npm start            # starts dev server (note the IP, e.g. http://192.168.1.100:3000)
```

Then temporarily update `capacitor.config.ts` to add:

```ts
server: {
  url: 'http://YOUR_LOCAL_IP:3000',  // your computer's local IP
  cleartext: true,
  androidScheme: 'https'
}
```

Then `npx cap sync && npx cap open android` and run — the app will hot-reload from your dev server.

**Remember to remove the `url` from the config before building for production!**

## Building a release APK (for sharing/testing)

```bash
npm run build
npx cap sync
```

Then in Android Studio: Build → Generate Signed Bundle / APK → follow the wizard.
