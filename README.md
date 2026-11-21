# Ezra Brain Games 🎈

A colorful, calm collection of preschool mini-games built for Ezra (roughly ages 3–6). The goal is playful practice with matching, counting, shapes, memory, attention, turn-taking, sequencing and basic problem-solving.

**Platform:** Android / iOS through Expo React Native, with a web preview. **Primary Android delivery:** installable APK from GitHub Actions. **Privacy:** game progress is stored on-device; no account is required.

> These are learning activities, not medical treatments or scientifically validated IQ boosters. Children benefit most from a balance of interactive play, conversations, movement, sleep, and time away from screens.

## 🎮 Games

| Game | What the child does | Skills practiced |
| --- | --- | --- |
| Find It! | Choose the pictured object | Attention, vocabulary, visual recognition |
| Count Animals | Count the animals and choose the number | Early numeracy |
| Big or Small | Compare size | Visual comparison |
| Same or Different | Compare two objects | Discrimination, observation |
| Shape Puzzle | Drag the matching shape to its outline | Shapes, fine-motor coordination |
| Memory Safari | Flip cards to find animal pairs | Visual memory and attention |
| Traffic Lights | Choose stop/go, then reverse the rule | Rule-following and flexibility |
| What's Next? | Complete a visual pattern | Pattern recognition |
| Little Story Builder | Put story pictures in their logical order | Sequencing, language |
| Tic Tac Toe | Two-player pass-and-play | Turn-taking, simple strategy |
| **Letter Safari** | Match scattered uppercase/lowercase letters | Visual letter identification, not ABC recitation |
| **Sound Detective** | Hear an English example word and identify its first letter | Beginning sound–symbol mapping |
| **First Word Magic** | Choose the missing first letter in a short regular word | Early decoding and word-building practice |
| **உயிரெழுத்து வேட்டை** | Listen and find a vowel | All 12 Tamil vowels in three short groups |
| **மெய்யெழுத்து மேஜிக்** | Listen and identify consonants | All 18 Tamil consonants in three groups |
| **தமிழ் ஒலி தோட்டம்** | Hear a word and choose its starting vowel | Tamil word-to-letter sound association |
| **தமிழ் சொல் மேஜிக்** | Join consonants and vowels, then recognise simple words | First உயிர்மெய் and short Tamil words |

Games include calm sounds, levels, and large touch targets. All progress in the tracked games is stored locally. Some visual guidance is written in English; speech prompts offer English and Tamil where the device supports the necessary voices.

## 📖 Early reading path (new)

**Start with Letter Safari**, followed by Sound Detective, then First Word Magic only when the first two feel comfortable. The first version concentrates on a small set of common English letters rather than rushing through the alphabet. Encourage Ezra to point to a random letter when you see it in books or signs; do not use reciting ABC as evidence of recognising printed symbols.

- Letter Safari: large, shuffled options; uppercase in level 1, lowercase in level 2, uppercase-to-lowercase matching in level 3.
- Sound Detective: the word itself is **not printed during the question**, so its initial letter is not given away. Tap the speaker to hear an English example word, and find its starting letter.
- First Word Magic: picture-supported missing-letter words are a gentle optional introduction, not a requirement for preschool children.
- Previous simple games (Find It, Big or Small, Same or Different) are hidden from the home board rather than deleting their saved progress. They remain in the codebase.
- Friendly, untimed feedback, short celebratory star animations, and original bundled chime sounds work without online APIs. The parent progress screen shows per-letter first-try picks across sessions; these are practice observations, **not** a validated literacy assessment.

**For grown-ups:** play together, talk about the pictures, and read aloud daily. The AAP recommends shared reading as part of a language-rich early childhood routine. See [AAP early literacy](https://www.aap.org/en/patient-care/early-childhood/early-childhood-health-and-development/early-literacy/) and [Reading Rockets phonics activities](https://www.readingrockets.org/literacy-home/reading-101-guide-parents/your-kindergartener/phonics-and-decoding-activities).

## 🌸 Tamil reading journey

Tamil uses **12 உயிரெழுத்துகள்**, **18 மெய்யெழுத்துகள்**, and their உயிர்மெய் combinations. Teaching all 247 symbols in one sitting is not age-appropriate. The first learning path is deliberately short and staged.

1. **உயிரெழுத்து வேட்டை** — listen to a single Tamil vowel, then pick it from a few shuffled glyphs. Three levels of four vowels introduce all twelve. The optional hint reveals the glyph, and hinted answers are not counted as unaided successes.
2. **மெய்யெழுத்து மேஜிக்** — learn six consonants at a time across வல்லினம், மெல்லினம் and இடையினம். Introduce after the easiest vowels are familiar.
3. **தமிழ் ஒலி தோட்டம்** — see a picture, hear a familiar Tamil word such as ஆடு or இலை, and identify its starting vowel. No printed word spoils the answer.
4. **தமிழ் சொல் மேஜிக்** — first join consonants and vowels (e.g. ப் + ஊ = பூ), then identify familiar one-syllable forms and short words such as ஆடு, எலி, இலை. This is supported early decoding, not fluent reading assessment.

Tamil games use Tamil spoken prompts **even when English is selected for other game instructions**. All written prompts are Tamil. Audio comes from installed on-device Tamil TTS; a Tamil voice may need to be installed once, and human-like recording quality is not guaranteed. Offline chimes and gentle magic particles are bundled, with Reduce Motion respected. Results are stored locally; parent progress includes first-try vowel recognition counts.

For parents: play for short periods, repeat letters in picture books and signs, and read aloud together. Do not rush to all consonants or word reading until the first vowels feel comfortable. The [Tamil Nadu Class 1 Tamil curriculum](https://ndl.iitkgp.ac.in/se_document/tn_school_board/12345678_tnbrd/19151) includes vowel/consonant activities; the [National Curriculum Framework (Foundational Stage)](https://ncert.nic.in/flipbook/NCF/National_Curriculum_Framework_for_Foundational_Stage_2022/files/basic-html/page114.html) and [NIPUN Bharat](https://dsel.education.gov.in/sites/default/files/update/nipun_bharat_eng_0.pdf) emphasize playful sound-to-symbol practice and home-language learning.

## ✨ Home screen

The home screen uses a responsive grid of large pastel game tiles, emoji illustrations and a progress shortcut. Subtle floating particles and entry animations are decorative only. They don't intercept taps and respond to the device's **Reduce Motion** setting.

## 🔊 Voice and language

Choose **English** or **தமிழ்** on the home screen. The setting is shared app-wide, so navigating between games cannot temporarily reset it to English. Casual, spoken Tamil is used for instructions; English example words can intentionally use English pronunciation for accurate phonics. The app never silently switches to English instructions when a Tamil voice is missing: it shows a message to install a compatible Tamil device voice instead. The speech engine prefers enhanced Tamil/English system voices when installed, but naturalness still depends on the phone’s TTS engine. The new chime effects are original bundled WAV files, not generated speech. Games have a replay button for spoken instructions. Speech uses the device's text-to-speech facilities via `expo-speech`; compatible Tamil speech depends on a Tamil voice being installed and available locally. The text remains visible if speech cannot be played.

## 📦 Download an Android APK using GitHub Actions

[Open the Android APK workflow runs](https://github.com/DavidRajPaul/kids-mini-games/actions/workflows/android-apk.yml)

1. Open **Actions → Android APK** in this GitHub repository.
2. Choose **Run workflow** on `main` (or open a new PR that changes `frontend/` to trigger its build).
3. Open a **successful** workflow run.
4. Scroll to **Artifacts** and download `ezra-brain-games-apk-<run-number>`.
5. Extract the downloaded ZIP to find `app-release.apk`.
6. Transfer the APK to your Android phone and open it. Android may ask you to allow installing an app from the application that opened the APK.

**Important:** This is a **testing APK**. The generated native Expo project uses its development/debug signing configuration for the local release variant unless a dedicated production keystore is explicitly configured. Do **not** use it for Play Store publishing or rely on its signing identity for upgrade continuity across clean CI runs. To distribute an app publicly, create and securely manage a production signing key and build an AAB or appropriately signed APK.

The workflow builds a self-contained JS-bundled release-variant APK using:
- GitHub-hosted Ubuntu runner
- Node.js 22, Java 17 and Android SDK
- Yarn 1.22.22
- `expo prebuild --platform android --clean`
- `./gradlew :app:assembleRelease --no-daemon --stacktrace`
- GitHub Actions artifact upload, retained for 14 days

It runs for pushes/PRs touching `frontend/` or the workflow itself, and supports manual dispatch. **A green run is required** before considering a build verified.

### APK troubleshooting

| Problem | What to check |
| --- | --- |
| Workflow isn't listed | The workflow file must exist on the default branch; merge the workflow PR to enable manual runs from Actions |
| Dependency install fails | Check the Yarn log, guard preinstall script, Node version and package availability |
| TypeScript fails | Resolve the exact compiler errors logged under **Check TypeScript** |
| Expo prebuild fails | Check config plugins and `frontend/app.json`; rerun locally with `npx expo prebuild --platform android --clean` |
| Gradle fails | Open **Build standalone APK** log; inspect the first actual error above the stack trace |
| No downloadable artifact | Verify **Verify APK output** and **Upload APK** steps succeeded |
| APK installs but app crashes | Obtain `adb logcat` and inspect runtime errors, fonts and native module compatibility |
| Old version won't update | Remove the previous testing APK first if its signing key differs; this removes its on-device progress |
| Tamil speech is silent | Install/enable a Tamil TTS voice in Android settings, test without airplane mode first, then verify offline support |

Do not paste signing credentials or personal tokens into public logs or issues.

## 🛠 Local development

### Prerequisites

- Node.js 22+
- Yarn 1.22.x (Corepack recommended)
- Android Studio + SDK for native Android builds
- Java 17 for Gradle native builds
- Xcode/macOS for iOS native builds

```bash
git clone https://github.com/DavidRajPaul/kids-mini-games.git
cd kids-mini-games/frontend
corepack enable
corepack prepare yarn@1.22.22 --activate
yarn install
yarn start
```

Use the Expo terminal instructions to open an emulator, Expo Go (where supported), or a development build. The app is built using Expo Router file-based navigation.

### Build an Android testing APK locally

```bash
cd frontend
yarn install
npx expo prebuild --platform android --clean
cd android
./gradlew :app:assembleRelease --no-daemon
```

Output: `frontend/android/app/build/outputs/apk/release/app-release.apk`.

> Expo's generated `android/` and `ios/` folders are not committed. Prebuild regenerates native projects and may overwrite changes inside them. This isn't a production signing workflow.

### Quality checks

```bash
cd frontend
yarn lint
./node_modules/.bin/tsc --noEmit
```

A successful native build and on-device smoke tests are still needed for each release. Test touch input, small screens, accessibility/Reduce Motion, offline speech, progressing to the next round, and restarting a game.

## 🧱 Repository layout

```text
.github/workflows/android-apk.yml    # Android CI artifact
frontend/
  app/                               # Expo Router screens
    index.tsx                        # Home game grid
    games/                           # Each mini-game screen
    progress.tsx                     # Stars and usage
  src/audio/                         # Sound effects and voice
  src/components/                    # UI, animations, learning components
  src/data/                          # Objects, animals, shapes
  src/storage/                       # Offline progress
  src/theme/                         # Colors, spacing, styles
  assets/                            # Images and short sound effects
  app.json                           # Expo app metadata
  package.json                       # JS dependencies
backend/                              # Scaffold backend; not required to build APK
```

## 🔒 Privacy and design principles

- No in-game advertising or sign-in.
- Progress saved locally rather than to a cloud database.
- Short, low-pressure games with no countdown timer requirement.
- Speech is handled through operating-system TTS; installed voices may vary.
- Motion must be decorative, pointer-transparent, and disabled for Reduce Motion.
- The repository contains an unrelated backend scaffold; the mobile APK does not depend on it.

## 🤝 Contributing

1. Create a feature branch from current `main`.
2. Keep changes small and preserve the offline, accessible game experience.
3. Run lint/typecheck and manually test the changed game on Android.
4. Open a pull request. Wait for **Android APK** workflow to pass and install the artifact before merging.

## 📚 Further reading

- [Expo documentation](https://docs.expo.dev/)
- [Expo local Android development](https://docs.expo.dev/guides/local-app-development/)
- [Expo APK builds](https://docs.expo.dev/build-reference/apk/)
- [CDC developmental milestones (age 4)](https://www.cdc.gov/act-early/milestones/4-years.html)
- [Harvard Center on the Developing Child: brain-building through play](https://developingchild.harvard.edu/resources/handouts-tools/brainbuildingthroughplay/)

---

Built with ❤️ for Ezra.
