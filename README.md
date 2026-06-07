# AtlasQuest — Source Code

A Duolingo-style geography quiz app built with React + TypeScript.
Self-contained single file — no backend required.

## Features
- Language selector: French / English / Arabic (RTL support)
- Daily streak with automatic reset if you miss a day
- Lives system with timed refill (1 life per 30 minutes)
- Gems economy + Premium mode (ad-free, unlimited lives)
- Simulated AdMob rewarded ads (ready for real integration)
- Full localStorage persistence across sessions
- Built-in APK + Play Store + AdMob integration guide tab

---

## Quick Start (Web Preview in Browser)

1. Create a Vite + React + TypeScript project:

   npm create vite@latest atlasquest -- --template react-ts
   cd atlasquest

2. Replace src/App.tsx with AtlasQuestFinal.tsx content
3. In src/main.tsx keep: import App from './App'
4. Run:

   npm install
   npm run dev

Open http://localhost:5173 — the app runs fully in the browser.

---

## Convert to Android APK

### Step 1 — Install prerequisites

- Node.js 18+       →  https://nodejs.org
- Java 17 JDK       →  https://adoptium.net
- Android Studio    →  https://developer.android.com/studio
- Android SDK API 34 (install inside Android Studio → SDK Manager)

After installing, set environment variables:
  JAVA_HOME  = path to your JDK folder
  ANDROID_HOME = path to your Android SDK folder

Verify:
  node -v        (should show 18+)
  java -version  (should show 17+)

---

### Step 2 — Build the web app

  npm run build
  # Creates dist/ folder — this is what Capacitor packages

---

### Step 3 — Add Capacitor

  npm install @capacitor/core @capacitor/cli @capacitor/android
  npx cap init AtlasQuest com.yourname.atlasquest
  npx cap add android
  npx cap sync

---

### Step 4 — Generate a Keystore (one time only)

You must sign your app to publish it. Run this once and keep the file safe:

  keytool -genkey -v \
    -keystore atlasquest.keystore \
    -alias atlasquest \
    -keyalg RSA -keysize 2048 \
    -validity 10000

You will be prompted for a password and your name/organization.

WARNING: Never lose this file. Google requires the EXACT same key
for every future update. If you lose it, you cannot update your app.

---

### Step 5 — Build a signed AAB in Android Studio

  npx cap open android

In Android Studio:
  Build → Generate Signed Bundle / APK
  → Android App Bundle (recommended for Play Store)
  → Choose your atlasquest.keystore
  → Enter key alias: atlasquest
  → Enter your password
  → Build

Output: android/app/build/outputs/bundle/release/app-release.aab

Or from the command line:
  cd android
  ./gradlew bundleRelease

---

## Publish to Google Play Store

1. Create a developer account at https://play.google.com/console
   (one-time $25 registration fee)

2. Click "Create app" → fill in:
   - App title and description (in all languages you support)
   - Screenshots: phone (min 2), 7" tablet optional
   - Feature graphic: 1024 x 500 px
   - App icon: 512 x 512 px PNG
   - Privacy Policy URL (required — host a simple page)

3. Navigate to: Production → Releases → Create new release
   → Upload your .aab file

4. Complete the content rating questionnaire
5. Submit for review

Review takes 1–3 days for new apps, faster for updates.

Release strategy (recommended order):
  Internal testing  →  up to 100 testers, instant publish
  Closed testing    →  invite-only testers
  Open testing      →  anyone can join as tester
  Production        →  full public release

---

## Save to GitHub

1. Create a new repo at https://github.com (click + → New repository)
   Name it "atlasquest", set to Public or Private, no template files.

2. In your project folder, open a terminal and run:

   echo "node_modules/" > .gitignore
   echo "dist/" >> .gitignore
   echo "android/" >> .gitignore
   echo "ios/" >> .gitignore
   echo "*.keystore" >> .gitignore

   git init
   git add .
   git commit -m "Initial commit: AtlasQuest"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/atlasquest.git
   git push -u origin main

   Replace YOUR_USERNAME with your actual GitHub username.

3. To save future changes:

   git add .
   git commit -m "Describe what changed"
   git push

IMPORTANT: The *.keystore line in .gitignore is critical.
Your signing keystore must NEVER be uploaded to GitHub (public or private).

---

## Real AdMob Integration

The app currently simulates ads. To use real Google AdMob:

Install the Capacitor plugin:
  npm install @capacitor-community/admob
  npx cap sync

Add App IDs to AndroidManifest.xml:
  <meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX"/>

Initialize on app start:
  import { AdMob } from '@capacitor-community/admob';
  await AdMob.initialize({
    requestTrackingAuthorization: true,
    initializeForTesting: false,
  });

Show rewarded ad (replace the simulated modal in the component):
  import { AdMob, RewardAdPluginEvents } from '@capacitor-community/admob';

  const REWARDED_ID = 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX';
  await AdMob.prepareRewardVideoAd({ adId: REWARDED_ID });
  AdMob.addListener(RewardAdPluginEvents.Rewarded, () => {
    grantLife(); // ONLY grant the reward inside this callback
  });
  await AdMob.showRewardVideoAd();

Show banner ad (replaces ad-strip div):
  await AdMob.showBanner({
    adId: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
    adSize: AdSize.BANNER,
    position: AdPosition.BOTTOM_CENTER,
  });
  // For Premium users: await AdMob.hideBanner();

Test Ad Unit IDs (use ONLY during development):
  Rewarded: ca-app-pub-3940256099942544/5224354917
  Banner:   ca-app-pub-3940256099942544/6300978111

Go-live checklist:
  Replace all test Ad Unit IDs with real production IDs
  Set isTesting: false in AdMob.initialize()
  Register your app at https://admob.google.com
  Complete your AdMob payment profile
  Add GDPR consent dialog (UMP SDK) for European users
  Test on a real physical device before store submission
  Never click your own ads (Google bans accounts for invalid traffic)

---

## localStorage Keys

All data is stored with the prefix aq_v1_:

  aq_v1_lang           Selected language: "fr" | "en" | "ar"
  aq_v1_gems           Gem count (number)
  aq_v1_streak         Current streak (number)
  aq_v1_isPrem         Premium status (boolean)
  aq_v1_lives          Remaining lives (number, max 5)
  aq_v1_livesTs        Timestamp of last life change (ms)
  aq_v1_modProgress    Module progress object per module ID
  aq_v1_lastPlayedDate Date string "YYYY-MM-DD" of last quiz completion

To reset all data for testing:
  Object.keys(localStorage).filter(k=>k.startsWith('aq_v1_')).forEach(k=>localStorage.removeItem(k));

---

## File Structure

  AtlasQuestFinal.tsx     Complete self-contained React + TS component
  README.md               This guide
  capacitor.config.json   Capacitor config template (fill in your IDs)
  .gitignore              Files to exclude from GitHub

---

Built with React 18 + TypeScript. No external dependencies beyond React itself.
