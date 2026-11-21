# Ezra Brain Games — Expo application

This directory contains the Expo SDK 54 / React Native app that powers Ezra Brain Games.

For the project overview, game descriptions, Android APK download instructions, privacy notes, and troubleshooting, see the [repository README](../README.md).

## Quick start

```bash
corepack enable
corepack prepare yarn@1.22.22 --activate
yarn install
yarn start
```

Android/iOS builds require the relevant platform SDK. To build an installable testing APK locally on a machine with Android SDK + JDK 17:

```bash
yarn install
npx expo prebuild --platform android --clean
cd android
./gradlew :app:assembleRelease --no-daemon
```

Find the APK at `android/app/build/outputs/apk/release/app-release.apk`. The GitHub Actions workflow performs these steps on an Ubuntu runner and uploads the APK as an artifact.

## Source locations

- `app/index.tsx` — home tile grid, particle animations and voice selection
- `app/games/` — gameplay screens
- `app/progress.tsx` — local progress dashboard
- `src/components/` — shared controls
- `src/audio/` — sounds and device text-to-speech
- `src/storage/` — offline progress storage
- `src/theme/` — design tokens

Run `yarn lint` and `./node_modules/.bin/tsc --noEmit` before opening a PR. Do not commit generated `android/`, `ios/`, `node_modules/` or personal signing keys.
