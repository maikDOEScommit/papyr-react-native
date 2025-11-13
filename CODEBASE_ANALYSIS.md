# PAPYR React Application - Comprehensive Codebase Analysis

## Executive Summary
PAPYR is a Next.js/React web application that digitizes a morning/evening ritual-based journaling system. Users commit to daily goals written by hand, scan them, and type them into the app during a specific "Wolf Hour" window (8 PM - 2 AM). The app emphasizes streak maintenance, gamification, and simplicity with a minimalist, vintage aesthetic.

---

## 1. Main Application Structure & Entry Points

### Root Entry Point: `/app/page.tsx`
- **Role**: Main home/dashboard page that orchestrates the entire application flow
- **View Management**: Handles view state transitions between:
  - `auth` - Authentication modal for login/signup
  - `onboarding` - Initial 7-day user onboarding flow
  - `main` - Core application dashboard
  - `paywall` - Subscription/payment flow
- **Key Features**:
  - Splash screen (1.8 second minimum)
  - Auth state checking via `useAuth()` hook
  - Profile-based onboarding completion tracking
  - Inspiration browser modal management

### Layout: `/app/layout.tsx`
- **Type**: Root layout wrapper (Server Component)
- **Key Elements**:
  - `AuthProvider` - Manages auth context globally
  - `I18nProvider` - Handles language (DE/EN) switching
  - Metadata configuration for PWA
  - Custom font family: "Patrick Hand" (handwriting font)
  - Manifest for mobile app installability

### Core Application Container: `/components/MainApp.tsx`
- **Purpose**: Main content area after authentication
- **Responsibilities**:
  - Manages app view navigation (Dashboard, Archive, Settings, Shop, Rules, Subscription)
  - Sidebar state management (left navigation, right sidebar)
  - Modal management (Daily Questions, 7-Day Reflection, Onboarding Popups)
  - Global pulse counter (live commitment counter)
  - Polaroid development animation (45-second effect)
  - Inspiration browser toggle
- **Child Components**:
  - `Dashboard` - Main commitment/streak display
  - `Archive` - Historical commitments view
  - `Settings` - User preferences and notifications
  - `Shop` - Merchandise/premium items
  - `Rules` - Feature explanation
  - `Subscription` - Subscription management
  - `Navbar` - Top navigation with streak info
  - `RightSidebar` - Stats and quick links

### API Routes
| Route | Purpose | Auth |
|-------|---------|------|
| `/api/stripe/checkout/route.ts` | Create Stripe checkout session | Yes |
| `/api/stripe/webhook/route.ts` | Handle Stripe events (subscription, payment) | Webhook |
| `/api/auth/callback/route.ts` | OAuth redirect handler | Yes |
| `/onboarding-video/page.tsx` | Video onboarding screen | No |
| `/success/page.tsx` | Post-subscription confirmation | Yes |

---

## 2. Key Features & Components

### A. Authentication & Authorization
**File**: `/lib/supabase/auth.ts`, `/components/AuthModal.tsx`

**Features**:
- Email/Password authentication
- OAuth support (Google, GitHub, Apple)
- Signup with optional username
- Email confirmation flow
- Session-based auth with Supabase

**Components**:
- `AuthModal` - Login/signup form with OAuth buttons
- Uses Supabase JS client for auth management

### B. Commitment System (Core Feature)
**Files**: `/lib/storage.ts`, `/lib/supabase/database.ts`

**Key Data Structure**:
```typescript
interface Commitment {
  id: string;
  date: string;
  imageData: string;           // Base64 image data
  goals: string;               // User's goals for the day
  isDeveloping: boolean;       // Polaroid development state
  timestamp: number;
  signatureInitials: string | null;
  completed: boolean;
}
```

**Features**:
- **Streak System**: Consecutive days maintained with Joker backup
- **Joker System**: 1 joker awarded every 7-day streak, can miss 1 day without reset
- **Wolf Hour Window**: Only 8 PM - 2 AM (configurable for testing)
- **Polaroid Development**: 45-second visual effect simulating Polaroid film development
- **Signature Support**: Optional initials signing
- **Local Storage**: Uses browser localStorage as primary data store
- **Supabase Sync**: Server-side persistence with cloud backup

**Components**:
- `Dashboard` - Main upload and streak display
- `UploadFlow` - Image capture and goal input
- `Archive` - Historical commitments
- `GoalsInputPopup` - Goal text input modal

### C. Gamification Features

**1. Streak Tracking** (`/lib/calendar.ts`)
- Current streak number display
- Last commitment date tracking
- Automatic reset when rules violated
- Milestone celebrations

**2. Daily Questions** (`/lib/dailyQuestions.ts`)
- Show after each commitment on days 1-7
- Questions designed to deepen commitment
- Automatically skips after 7 days
- Example: "What would you do if failure were impossible?"

**3. 7-Day Reflection** (`/components/SevenDayReflection.tsx`)
- Triggered at exactly 7-day streak
- Three-step flow:
  1. Celebration screen
  2. "10-year vision" question
  3. Premium paywall pitch (€0.99/month)
- Must be completed before unlocking premium

**4. Wolf Hour Gamification** (`/lib/countdown.ts`)
- "Global Pulse" counter - live commitments during Wolf Hour
- Time countdown until next window
- Creates urgency and community feeling

### D. Monetization System
**Files**: `/components/Paywall.tsx`, `/components/Subscription.tsx`

**Pricing Tiers**:
1. **Free Trial**: 14 days (can make 14 commitments)
2. **Basic (€0.99/month)**: Unlimited commitments, archive access
3. **Pro (€2.99/month)**: All basic + monthly bonus Joker

**Stripe Integration**:
- Webhook handling for subscription events
- Customer and subscription ID tracking
- Pro status detection and benefits

**Components**:
- `Paywall` - Subscription offer screen
- `Subscription` - Subscription management
- Payment status stored in user profile

### E. Multi-Language Support
**System**: Context-based i18n (`/lib/i18n/context.tsx`)

**Supported Languages**:
- German (de) - Default
- English (en)

**Implementation**:
- Key-based translation system
- localStorage persistence
- Language toggle in navbar
- Translation files: `/lib/i18n/translations/{de,en}.json`

**Usage**:
```typescript
const { t } = useI18n();
// Access: t('navbar.todaySubmitted')
```

### F. Notification System
**Files**: `/lib/notifications.ts`, `/lib/pushNotifications.ts`, `/lib/firebase.ts`

**Features**:
- Firebase Cloud Messaging (FCM) integration
- Push notification support
- Service worker registration
- Browser notification permission handling
- Scheduled notifications for Wolf Hour reminders

**Status**: Partially implemented - awaiting backend configuration

### G. User Profile & Settings
**Files**: `/components/Settings.tsx`, `/lib/supabase/database.ts`

**Profile Fields**:
- Email and username
- Streak and commitment counts
- Joker count
- Payment status (hasPaid, isPro)
- Notification preferences
- Last monthly Pro joker date
- 10-year vision text

**Settings Options**:
- Language preference
- Notification settings (enabled, morning/afternoon/evening)
- Account deletion option
- Support contact

### H. Visual Features

**Polaroid Aesthetic**:
- Vintage cream/brown color palette
- Hand-written font (Patrick Hand)
- Grain overlay effect
- Box shadows mimicking physical photos
- Development animation on image display

**Responsive Design**:
- Mobile-first approach
- Sidebar collapse on scroll
- Breakpoints: sm, md, lg
- Mobile menu toggle

---

## 3. Technologies Used

### Frontend Framework & Build
- **Next.js 14**: App Router, API routes, middleware
- **React 18**: Components, hooks, context API
- **TypeScript**: Type safety and development experience

### Styling
- **Tailwind CSS 3.4**: Utility-first CSS framework
- **Custom CSS**: Global styles in `/app/globals.css`
- **Font Family**: Patrick Hand (Google Fonts), SF Pro (system UI)

### State Management
- **React Context API**: Authentication and i18n
- **Browser localStorage**: Local app state
- **Supabase Real-time**: For sync (optional)

### Backend Services
- **Supabase**: PostgreSQL database, authentication, real-time subscriptions
- **Stripe**: Payment processing and subscription management
- **Firebase**: Cloud Messaging for push notifications
- **Supabase Auth**: Email/password, OAuth providers

### Build & Deployment
- **TypeScript Compiler**: Strict type checking
- **PostCSS**: CSS processing with Autoprefixer
- **next-pwa**: PWA capabilities

### Progressive Web App
- **PWA Configuration**: `/next.config.js`
- **Manifest**: `/public/manifest.json`
- **Icons**: 192x192 and 512x512 variants
- **Service Worker**: Push notification support

---

## 4. External Dependencies & APIs

### NPM Dependencies
```json
{
  "@stripe/stripe-js": "^8.4.0",        // Stripe payment SDK
  "@supabase/auth-helpers-nextjs": "^0.10.0",  // Auth integration
  "@supabase/ssr": "^0.7.0",            // SSR support
  "@supabase/supabase-js": "^2.81.0",   // Database client
  "firebase": "^12.5.0",                // Push notifications
  "next": "14.2.15",                    // Web framework
  "next-pwa": "^5.6.0",                 // PWA support
  "react": "^18.3.1",                   // UI library
  "react-dom": "^18.3.1",               // DOM rendering
  "stripe": "^19.3.0"                   // Server-side Stripe
}
```

### External APIs & Services

| Service | Purpose | Configuration |
|---------|---------|---|
| **Supabase** | Authentication, PostgreSQL DB | Environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` |
| **Stripe** | Payments & subscriptions | `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` |
| **Firebase** | Push notifications | `NEXT_PUBLIC_FIREBASE_*` variables, VAPID key |
| **Google Fonts** | Custom fonts (Patrick Hand, Courier Prime) | CDN via font links |

### Database Schema (Supabase PostgreSQL)

**Tables**:
1. **profiles** (extends Supabase auth.users)
   - Stores user metadata, streak, commitment count, pro status
   - Synced via auth triggers

2. **commitments**
   - Stores commitment data (image URL, goals, dev status)
   - Linked to user via user_id

3. **daily_questions** (implicit)
   - Question bank for days 1-7

---

## 5. File Organization & Architecture Patterns

### Directory Structure
```
/papyr-react-native
├── /app                          # Next.js App Router
│   ├── page.tsx                 # Root home (view orchestrator)
│   ├── layout.tsx               # Root layout (providers)
│   ├── globals.css              # Global styles
│   ├── middleware.ts            # Auth session middleware
│   ├── /api
│   │   ├── /stripe
│   │   │   ├── /checkout        # Create checkout session
│   │   │   └── /webhook         # Stripe events
│   │   └── /auth
│   │       └── /callback        # OAuth redirect
│   ├── /onboarding-video
│   ├── /success
│   └── /viewport.ts             # Viewport meta config
│
├── /components                   # React components (24 files)
│   ├── MainApp.tsx              # Core app container
│   ├── Navbar.tsx               # Top navigation
│   ├── Dashboard.tsx            # Main commitment UI
│   ├── RightSidebar.tsx         # Stats sidebar
│   ├── Archive.tsx              # Historical commitments
│   ├── Settings.tsx             # User preferences
│   ├── Paywall.tsx              # Payment screen
│   ├── Subscription.tsx         # Subscription mgmt
│   ├── AuthModal.tsx            # Login/signup form
│   ├── UploadFlow.tsx           # Image + goal input
│   ├── DailyQuestion.tsx        # Question prompt
│   ├── SevenDayReflection.tsx  # 7-day milestone
│   ├── OnboardingPopup.tsx     # Educational popups
│   ├── NewOnboarding.tsx       # Initial onboarding
│   ├── InspirationBrowser.tsx  # Inspiration library
│   └── ... (8 more components)
│
├── /lib                          # Utilities & business logic
│   ├── storage.ts               # localStorage management
│   ├── calendar.ts              # Streak calculation
│   ├── countdown.ts             # Wolf Hour countdown
│   ├── dailyQuestions.ts        # Question logic
│   ├── onboardingHelper.ts      # Onboarding state
│   ├── notifications.ts         # Notification handler
│   ├── pushNotifications.ts     # Push notification setup
│   ├── firebase.ts              # Firebase config
│   │
│   ├── /supabase                # Supabase integration
│   │   ├── client.ts            # Client-side auth client
│   │   ├── server.ts            # Server-side client
│   │   ├── auth.ts              # Auth functions
│   │   ├── database.ts          # Database queries
│   │   ├── context.tsx          # Auth provider
│   │   └── middleware.ts        # Session middleware
│   │
│   ├── /stripe                  # Stripe integration
│   │   └── client.ts            # Stripe JS client
│   │
│   └── /i18n                    # Internationalization
│       ├── context.tsx          # i18n provider
│       └── /translations
│           ├── de.json          # German translations
│           └── en.json          # English translations
│
├── /public                       # Static assets
│   ├── /assets                  # Image assets
│   ├── manifest.json            # PWA manifest
│   ├── favicon.ico
│   ├── sw.js                    # Service worker (legacy)
│   └── firebase-messaging-sw.js # FCM service worker
│
├── Configuration Files
│   ├── package.json             # Dependencies
│   ├── tsconfig.json            # TypeScript config
│   ├── tailwind.config.ts       # Tailwind configuration
│   ├── next.config.js           # Next.js config with PWA
│   ├── postcss.config.mjs       # PostCSS config
│   ├── middleware.ts            # Auth middleware
│   └── .env.example             # Environment template
│
└── Documentation
    ├── README.md                # Main readme
    ├── MIGRATION_GUIDE.md       # React Native migration
    ├── SUPABASE_SETUP.md        # Database setup
    ├── STRIPE_SETUP.md          # Payment setup
    ├── PRO_FEATURES_SETUP.md    # Pro tier setup
    └── ... (additional guides)
```

### Architecture Patterns

#### 1. **Provider Pattern** (Context API)
```typescript
// AuthProvider wraps app with user/profile/auth state
// I18nProvider wraps app with language/translation state
// Enables hook-based access: useAuth(), useI18n()
```

#### 2. **Component Composition**
- **Container Components**: MainApp, Dashboard (manage state)
- **Presentation Components**: Navbar, RightSidebar (UI focused)
- **Modal Components**: AuthModal, Paywall, DailyQuestion (overlays)

#### 3. **Custom Hooks**
- `useAuth()` - Access authentication state
- `useI18n()` - Access translation functions

#### 4. **State Management Layers**
1. **Component State**: React useState for UI state
2. **Context State**: Authentication and language via Context API
3. **localStorage**: Persistent app state and settings
4. **Supabase**: Remote persistence and sync
5. **Global Pulse**: Simulated server-side counter

#### 5. **Data Flow**
```
User Interaction
    ↓
Component Handler
    ↓
Storage/API Update
    ↓
State Refresh
    ↓
UI Re-render
```

#### 6. **API Integration Pattern**
- Supabase: CRUD operations in lib/supabase/database.ts
- Stripe: Webhook handling in /api/stripe/webhook/route.ts
- Firebase: Client-side messaging in lib/firebase.ts

#### 7. **Middleware Pattern**
- `/middleware.ts` - Session management on every request
- Service Worker - Offline support and FCM

---

## 6. Data Models & Schemas

### TypeScript Interfaces

#### Profile
```typescript
interface Profile {
  id: string;
  email: string;
  user_name: string | null;
  has_completed_onboarding: boolean;
  has_paid: boolean;
  is_pro: boolean;
  current_streak: number;
  last_commitment_date: string | null;
  ten_year_vision: string | null;
  has_completed_seven_day_reflection: boolean;
  jokers: number;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  notification_settings: NotificationSettings;
  created_at: string;
  updated_at: string;
}
```

#### Commitment (Client)
```typescript
interface Commitment {
  id: string;
  date: string;
  imageData: string;              // Base64
  goals: string;
  isDeveloping: boolean;
  timestamp: number;
  signatureInitials: string | null;
  completed: boolean;
}
```

#### Commitment (Server/Supabase)
```typescript
interface Commitment {
  id: string;
  user_id: string;
  date: string;
  image_url: string;              // Storage URL
  goals: string;
  is_developing: boolean;
  signature_initials: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}
```

#### AppState (localStorage)
```typescript
interface AppState {
  hasCompletedOnboarding: boolean;
  hasPaid: boolean;
  isPro: boolean;
  userName: string;
  commitments: Commitment[];
  currentStreak: number;
  lastCommitmentDate: string | null;
  tenYearVision: string | null;
  hasCompletedSevenDayReflection: boolean;
  jokers: number;
  lastShownPopupDay: number | null;
  totalCommitments: number;
  notificationSettings: NotificationSettings;
}
```

---

## 7. Key Business Logic

### Streak Calculation
```typescript
- Day after last commitment: +1 streak
- Missed 1 day + Joker available: Use joker, +1 streak
- Missed 1 day + No joker: Reset streak to 1
- Missed 2+ days: Always reset to 1
```

### Joker Award System
```typescript
- Award 1 joker for every 7-day streak milestone
- Example: 7 days = 1 joker, 14 days = 2 jokers, etc.
- Pro users get 1 bonus joker monthly
```

### Wolf Hour Window
```typescript
- Default: 20:00 - 02:00 (8 PM - 2 AM)
- Uploads only allowed during this window
- Creates exclusivity and urgency
- Countdown timer shows time until next window
```

### Paywall Logic
```typescript
- Free trial: 14 commitments (not 14 days)
- After 14 commitments: Require subscription
- €0.99/month: Basic tier (archive access)
- €2.99/month: Pro tier (monthly bonus joker)
- 7-day mark: Show 10-year vision + paywall pitch
```

---

## 8. What Needs to Be Migrated to React Native

### High Priority (Core Functionality)
1. **Authentication System** - Supabase auth, OAuth
2. **Commitment Management** - Image capture, storage, upload
3. **Streak System** - Calculation, Joker logic
4. **User Profile** - Data persistence, sync
5. **Notifications** - Push notifications, Wolf Hour reminders

### Medium Priority (Key Features)
1. **Daily Questions** - Local state, question logic
2. **7-Day Reflection** - Modal flow, vision capture
3. **Paywall** - Stripe integration, subscription mgmt
4. **Archive** - Historical commitment browsing
5. **Settings** - Notification preferences, language

### Lower Priority (Polish)
1. **Polaroid Animation** - 45-second development effect
2. **Global Pulse Counter** - Real-time counter display
3. **Onboarding Popups** - Educational screens
4. **Inspiration Browser** - Browsing feature
5. **Shop/Rules/Subscription UI** - Additional screens

### Technical Considerations for React Native
1. **Image Handling**: Replace web file input with react-native-image-picker
2. **Storage**: Switch from localStorage to AsyncStorage
3. **Styling**: Migrate from Tailwind to StyleSheet or NativeWind
4. **Fonts**: Verify Patrick Hand font availability in React Native
5. **Navigation**: Replace Next.js routing with React Navigation
6. **Notifications**: Use react-native-notifications or OneSignal
7. **Offline Storage**: Use SQLite or Realm for better data management
8. **Camera Access**: Implement native camera integration
9. **PWA Features**: Not applicable - replace with app store distribution

---

## Summary Statistics

- **Total Components**: 24
- **Total TS/TSX Files**: 25
- **Total Lines of Code**: ~8,200
- **External APIs**: 4 (Supabase, Stripe, Firebase, Google Fonts)
- **Supported Languages**: 2 (DE, EN)
- **Database Tables**: 2 core (profiles, commitments)
- **Authentication Methods**: Email/Password + 3x OAuth (Google, GitHub, Apple)

