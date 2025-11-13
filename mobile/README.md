# PAPYR Mobile App (React Native)

React Native mobile app für PAPYR - die gamifizierte Journaling-App mit Wolf Hour System.

## 🚀 Features (MVP Phase 1)

- ✅ **Authentifizierung**: Email/Password Login via Supabase
- ✅ **Wolf Hour System**: Uploads nur zwischen 20:00-02:00 Uhr
- ✅ **Commitment Upload**: Kamera + Zieltext
- ✅ **Streak Tracking**: Tägliche Streak-Anzeige
- ✅ **Mehrsprachigkeit**: Deutsch/Englisch
- ✅ **Native Navigation**: React Navigation (Stack + Bottom Tabs)

## 📋 Voraussetzungen

- Node.js 18+
- npm oder yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go App auf Smartphone (für Testing)
- iOS Simulator (Mac) oder Android Emulator

## 🛠️ Setup

### 1. Dependencies installieren

```bash
npm install
```

### 2. Environment Variables konfigurieren

Erstelle eine `.env` Datei im Projekt-Root:

```env
SUPABASE_URL=deine_supabase_url
SUPABASE_ANON_KEY=dein_supabase_anon_key
```

Die Supabase Credentials findest du in deinem Supabase Dashboard unter Settings > API.

### 3. App starten

```bash
# Development Server starten
npm start

# Für iOS (nur Mac)
npm run ios

# Für Android
npm run android

# Web Version (zum Testen)
npm run web
```

### 4. Mit Expo Go testen

1. Installiere [Expo Go](https://expo.dev/client) auf deinem Smartphone
2. Starte `npm start`
3. Scanne den QR-Code mit Expo Go (Android) oder der Kamera-App (iOS)

## 📁 Projektstruktur

```
mobile/
├── src/
│   ├── components/        # Wiederverwendbare UI-Komponenten
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── Loading.tsx
│   ├── screens/          # App Screens
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── CameraScreen.tsx
│   │   ├── CommitmentUploadScreen.tsx
│   │   ├── ArchiveScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── navigation/       # React Navigation Setup
│   │   └── AppNavigator.tsx
│   ├── contexts/         # React Contexts
│   │   └── AuthContext.tsx
│   ├── services/         # API Services
│   │   └── supabase.ts
│   ├── utils/           # Utility Functions
│   │   ├── storage.ts
│   │   └── wolfHour.ts
│   ├── constants/       # Konstanten & Konfiguration
│   │   ├── colors.ts
│   │   └── config.ts
│   ├── types/          # TypeScript Types
│   │   └── index.ts
│   └── i18n/          # Internationalisierung
│       ├── index.ts
│       └── locales/
│           ├── de.json
│           └── en.json
├── App.tsx            # App Entry Point
├── app.json          # Expo Konfiguration
└── package.json
```

## 🎨 Design System

### Farben (Vintage Aesthetic)

- **Cream**: #F5F1E8 (Background)
- **Dark Brown**: #3D2B1F (Primary Text)
- **Brown**: #8B7355 (Secondary)
- **Light Brown**: #C8B59D (Borders)

### Komponenten

- `Button`: Primary, Secondary, Outline Varianten
- `Input`: Text Input mit Label und Error State
- `Card`: Container mit Shadow
- `Loading`: Zentrierter Loading Spinner

## 🔐 Supabase Setup

### Benötigte Tabellen

```sql
-- Users Table (erweitert Supabase Auth)
CREATE TABLE users (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  subscription TEXT DEFAULT 'free',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Commitments Table
CREATE TABLE commitments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  image_url TEXT NOT NULL,
  goal_text TEXT NOT NULL,
  is_during_wolf_hour BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Storage Bucket

Erstelle einen `commitments` Storage Bucket in Supabase für Bilder.

## 📱 Testing

### Expo Go (Empfohlen für schnelles Testing)

```bash
npm start
# Scanne QR-Code mit Expo Go App
```

### iOS Simulator (nur Mac)

```bash
npm run ios
```

### Android Emulator

```bash
npm run android
```

## 🚧 Nächste Schritte (Phase 2)

- [ ] OAuth Integration (Google, Apple)
- [ ] Push Notifications (Firebase)
- [ ] Stripe Payment Integration
- [ ] Daily Questions System
- [ ] Joker System
- [ ] Weekly Reflections
- [ ] Archive mit Filterung
- [ ] Inspiration Browser
- [ ] Animationen (Polaroid-Effect)

## 🐛 Bekannte Issues

- [ ] OAuth noch nicht implementiert
- [ ] Streak-Berechnung muss mit Backend synchronisiert werden
- [ ] Archive Screen ist noch Placeholder
- [ ] Keine Offline-Unterstützung

## 📝 Lizenz

Proprietary - PAPYR

## 👤 Entwickler

Entwickelt für PAPYR - Die gamifizierte Journaling-App
