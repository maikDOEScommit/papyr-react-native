# PAPYR - Key Files Quick Reference

## Authentication & User Management

| File | Purpose | Key Functions |
|------|---------|---|
| `/lib/supabase/auth.ts` | Auth operations | `signUp()`, `signIn()`, `signOut()`, `getCurrentUser()`, `signInWithOAuth()` |
| `/lib/supabase/context.tsx` | Auth provider | `AuthProvider`, `useAuth()` hook |
| `/components/AuthModal.tsx` | Login/signup UI | Email/password form, OAuth buttons |
| `/lib/supabase/database.ts` | Profile operations | `getProfile()`, `createProfile()`, `updateProfile()` |
| `/lib/supabase/middleware.ts` | Session management | Supabase session middleware |

## Commitment System (Core)

| File | Purpose | Key Functions |
|------|---------|---|
| `/lib/storage.ts` | State management | `getAppState()`, `addCommitment()`, `markCommitmentDeveloped()`, `deleteCommitment()` |
| `/lib/supabase/database.ts` | Cloud persistence | `getCommitments()`, `createCommitment()`, `updateCommitment()` |
| `/components/Dashboard.tsx` | Main UI | Commitment grid, upload button |
| `/components/UploadFlow.tsx` | Image + goal input | Camera capture, goal text, signature |
| `/components/Archive.tsx` | Historical view | Commitment list, filtering |

## Gamification Features

| File | Purpose | Key Functions |
|------|---------|---|
| `/lib/calendar.ts` | Streak logic | Streak calculation, last date tracking |
| `/lib/countdown.ts` | Wolf Hour | `getTimeUntilNextWindow()`, `formatCountdown()`, `isWithinWolfHour()` |
| `/lib/dailyQuestions.ts` | Daily Q logic | `shouldShowDailyQuestion()`, question bank |
| `/components/DailyQuestion.tsx` | Question UI | Question display, answer handling |
| `/components/SevenDayReflection.tsx` | 7-day milestone | Celebration, vision input, paywall |
| `/lib/onboardingHelper.ts` | Onboarding state | `shouldShowPopup()`, `getPopupForDay()` |
| `/components/OnboardingPopup.tsx` | Popup UI | Educational popups |

## Payment & Subscription

| File | Purpose | Key Functions |
|------|---------|---|
| `/components/Paywall.tsx` | Payment pitch | Free trial info, pricing display |
| `/components/Subscription.tsx` | Subscription mgmt | Active subscription display |
| `/app/api/stripe/webhook/route.ts` | Stripe events | `checkout.session.completed`, subscription updates |
| `/app/api/stripe/checkout/route.ts` | Create checkout | Stripe session creation |
| `/lib/stripe/client.ts` | Stripe client | Load Stripe JS |

## Internationalization

| File | Purpose | Key Functions |
|------|---------|---|
| `/lib/i18n/context.tsx` | i18n provider | `I18nProvider`, `useI18n()` hook |
| `/lib/i18n/translations/de.json` | German strings | All German translations |
| `/lib/i18n/translations/en.json` | English strings | All English translations |

## Notifications

| File | Purpose | Key Functions |
|------|---------|---|
| `/lib/firebase.ts` | Firebase setup | `initializeFirebase()`, `getFirebaseMessaging()`, `requestFCMToken()` |
| `/lib/pushNotifications.ts` | Push notification logic | `subscribeToPushNotifications()`, handlers |
| `/lib/notifications.ts` | Notification utils | Notification permission, display |
| `/public/firebase-messaging-sw.js` | Service worker | FCM background handling |

## UI Components

| File | Purpose | Type |
|------|---------|------|
| `/components/MainApp.tsx` | Core app container | Container |
| `/components/Navbar.tsx` | Top navigation | Container |
| `/components/RightSidebar.tsx` | Stats sidebar | Presentation |
| `/components/Dashboard.tsx` | Main dashboard | Container |
| `/components/Archive.tsx` | Archive view | Container |
| `/components/Settings.tsx` | User settings | Container |
| `/components/Shop.tsx` | Shop screen | Container |
| `/components/Rules.tsx` | Rules/info | Presentation |
| `/components/NewOnboarding.tsx` | Onboarding flow | Container |
| `/components/InspirationBrowser.tsx` | Inspiration lib | Container |
| `/components/TypewriterText.tsx` | Text animation | Presentation |
| `/components/ConfirmDialog.tsx` | Confirmation | Modal |
| `/components/GoalsInputPopup.tsx` | Goals input | Modal |
| `/components/RitualPopup.tsx` | Ritual info | Modal |
| `/components/AddToHomeScreen.tsx` | Install prompt | Presentation |

## Configuration & Setup

| File | Purpose | Content |
|------|---------|---------|
| `/package.json` | Dependencies | All npm packages |
| `/tsconfig.json` | TypeScript config | Type checking settings |
| `/tailwind.config.ts` | Tailwind setup | Colors, fonts, custom utilities |
| `/next.config.js` | Next.js config | PWA setup |
| `/postcss.config.mjs` | PostCSS config | CSS processing |
| `.env.example` | Environment template | Required env vars |
| `/middleware.ts` | Request middleware | Auth session handling |
| `/app/globals.css` | Global styles | CSS utilities, animations |

## App Structure

| File | Purpose | Role |
|------|---------|------|
| `/app/layout.tsx` | Root layout | Providers setup |
| `/app/page.tsx` | Home page | View orchestration |
| `/app/viewport.ts` | Viewport config | Mobile meta tags |
| `/app/onboarding-video/page.tsx` | Video onboarding | Welcome screen |
| `/app/success/page.tsx` | Payment success | Post-transaction |
| `/app/auth/callback/route.ts` | OAuth callback | OAuth redirect handler |

## Key Dependencies Map

```
Root
├─ layout.tsx
│  ├─ AuthProvider (from /lib/supabase/context)
│  │  ├─ getCurrentUser (from /lib/supabase/auth)
│  │  ├─ getProfile (from /lib/supabase/database)
│  │  └─ onAuthStateChange (from /lib/supabase/auth)
│  └─ I18nProvider (from /lib/i18n/context)
│
├─ page.tsx
│  ├─ useAuth hook
│  ├─ AuthModal (with OAuth integration)
│  ├─ NewOnboarding
│  ├─ MainApp
│  ├─ Paywall
│  └─ InspirationBrowser
│
└─ MainApp.tsx
   ├─ Dashboard (with image picker, Supabase upload)
   ├─ Archive
   ├─ Settings (with i18n toggle)
   ├─ Navbar (with global pulse)
   ├─ RightSidebar
   ├─ UploadFlow (camera integration)
   ├─ DailyQuestion
   ├─ SevenDayReflection
   ├─ OnboardingPopup
   └─ InspirationBrowser
```

## State & Storage Architecture

```
Browser/App
├─ localStorage/AsyncStorage
│  └─ AppState (commitments, streak, jokers, settings)
│
├─ Context API
│  ├─ AuthContext (user, profile, auth state)
│  └─ I18nContext (language, translations)
│
├─ Component State
│  └─ useState hooks (UI state, modals, etc.)
│
└─ External Services
   ├─ Supabase Auth (authentication)
   ├─ Supabase DB (commitments, profiles)
   ├─ Stripe (payments)
   ├─ Firebase (push notifications)
   └─ Google Fonts (fonts)
```

## Important Constants & Config

**Wolf Hour Window**:
- Default: 20:00 - 02:00 (8 PM - 2 AM)
- Location: `/lib/storage.ts` line 186-195

**Streak Milestones**:
- 7 days: 10-year vision question, paywall
- Every 7 days: +1 Joker awarded

**Free Trial**:
- Limit: 14 commitments
- Trigger: After 14 commitments, show paywall

**Pricing**:
- Basic: €0.99/month
- Pro: €2.99/month (includes monthly joker)

**Environment Variables Required**:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_PRICE_ID
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_VAPID_KEY
```

## Testing Key Areas

| Feature | Primary File | Test Cases |
|---------|--------------|-----------|
| Streak calculation | `/lib/storage.ts` | Consecutive days, joker usage, reset logic |
| Commitment creation | `/components/UploadFlow.tsx` + `/lib/storage.ts` | Image capture, goal input, signature |
| Authentication | `/lib/supabase/auth.ts` | Email/password, OAuth, session |
| Payments | `/app/api/stripe/webhook/route.ts` | Checkout, subscription, pro benefits |
| Wolf Hour | `/lib/countdown.ts` | Time window checking, countdown |
| Daily Questions | `/components/DailyQuestion.tsx` | Show on day 1-7, skip after |
| 7-Day Reflection | `/components/SevenDayReflection.tsx` | Trigger at day 7, capture vision |

## Performance Considerations

- **Image handling**: Optimize before upload (current: base64, future: files)
- **List rendering**: Archive uses scrolling list of commitments
- **Storage**: localStorage has size limits (typically 5-10MB)
- **Sync**: Supabase real-time optional for improvement
- **Notifications**: Firebase FCM for push, service worker for offline

