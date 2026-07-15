# Smart Cold Storage (T1 Theme) 👋

An intelligent, multi-language React Native mobile application built on Expo SDK 57 for managing and monitoring cold storage facilities, chambers, active crop batches, sensor health diagnostics, and sharing permissions.

## 🚀 Key Features

* **Visual Dashboard (Home)**: High-level metrics summaries (Healthy, Warning, Critical, Offline), urgent warning alerts banner, quick filter chips, and interactive storage capacity cards.
* **Compact Device Details**: Lists total chambers and batch quantities. View live temperature/humidity sensor readings, toggle active crops, or safely archive batches.
* **Crop Profiles Library**: Supports standard crops (Tomato, Potato, Banana, Apple, Mango, etc.) and allows creating custom crops with optimal ranges for temperature, humidity, storage time, and maturity stages.
* **Local Alert Notifications**: Critical/Warning system notices with diagnostic descriptions, recommended fix suggestions, and read state markers.
* **Multi-Language Support (l10n)**: Dynamically switch application text between:
  * 🇬🇧 English
  * 🇮🇳 Hindi (हिन्दी)
  * 🇮🇳 Telugu (తెలుగు)
  * 🇮🇳 Marathi (मరాఠీ)
* **Access Sharing Management**: Grant and revoke device access keys for Managers, Technicians, or Viewers.
* **Offline Storage Engine**: Fully persistent local database backing all CRUD transactions using `@react-native-async-storage/async-storage`.

---

## 🛠️ Technology Stack

* **Framework**: React Native + Expo (SDK 57)
* **Language**: TypeScript
* **Routing**: Custom State-Based Router Stack (inside [AppContext.tsx](src/context/AppContext.tsx)) for navigation stability and back-action handling.
* **State Management**: React Context (`AppProvider`)
* **Storage**: AsyncStorage
* **Icons**: `@expo/vector-icons` (MaterialIcons)

---

## 📂 Project Directory Structure

```text
cold_app/
├── assets/             # Media and icon assets
├── dist/               # Exported native bundles
├── src/
│   ├── app/
│   │   ├── _layout.tsx # Root layout wrapping AppProvider
│   │   └── index.tsx   # Custom state-router screen entry point
│   ├── components/     # Reusable UI widgets
│   │   ├── EmptyState.tsx
│   │   ├── HealthScore.tsx
│   │   ├── NavigationShell.tsx (Bottom tab layout)
│   │   └── StatusBadge.tsx
│   ├── constants/
│   │   └── theme.ts    # HSL color palettes and theme configs (T1 Theme)
│   ├── data/
│   │   └── db.ts       # Database models and seed mock records
│   ├── utils/
│   │   ├── date.ts     # Date parser and timeAgo calculators
│   │   └── l10n.ts     # Translation dictionaries
│   └── views/          # Screen components
│       ├── auth/
│       │   ├── LoginScreen.tsx
│       │   └── SignupScreen.tsx
│       ├── AddBatchScreen.tsx
│       ├── AddDeviceScreen.tsx
│       ├── AlertsScreen.tsx
│       ├── DeviceDetailScreen.tsx
│       ├── DeviceHealthScreen.tsx
│       ├── DeviceShareScreen.tsx
│       ├── DevicesScreen.tsx
│       ├── HomeScreen.tsx
│       ├── LibraryScreen.tsx
│       └── ProfileScreen.tsx
├── package.json
└── tsconfig.json
```

---

## 🏁 Getting Started

### 1. Install Dependencies

Clone the repository and install packages:

```bash
npm install
```

### 2. Run the Development Server

Start the Metro bundler:

```bash
npm run start
```

* Press `w` to open the app on a web browser.
* Press `a` to open on an Android emulator (requires Android Studio).
* Press `i` to open on an iOS simulator (requires macOS Xcode).
* Scan the QR code with the Expo Go app on your phone to run it on a real mobile device.

### 3. Type Checking

Run TypeScript checks to ensure correctness:

```bash
npx tsc --noEmit
```

### 4. Build Production Bundles

To test the bundler export compatibility:

```bash
npx expo export
```
This generates optimized static files inside the `dist/` directory.
