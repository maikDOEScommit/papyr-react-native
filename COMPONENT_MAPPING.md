# PAPYR Component Dependency Map

## Component Hierarchy & Flow

```
RootLayout (layout.tsx)
├── AuthProvider
│   └── I18nProvider
│       └── HomePage (page.tsx)
│           ├── AuthModal (if not authenticated)
│           ├── NewOnboarding (if needs onboarding)
│           ├── MainApp (if authenticated & onboarded)
│           │   ├── Navbar
│           │   │   ├── MobileMenu
│           │   │   └── LanguageToggle
│           │   ├── RightSidebar
│           │   │   ├── StreakDisplay
│           │   │   └── JokerCounter
│           │   ├── Dashboard (view='dashboard')
│           │   │   ├── CommitmentGrid
│           │   │   │   └── CommitmentCard
│           │   │   ├── UploadButton
│           │   │   └── CameraInput
│           │   ├── Archive (view='archive')
│           │   │   └── CommitmentsList
│           │   ├── Settings (view='settings')
│           │   │   ├── NotificationSettings
│           │   │   └── LanguageSettings
│           │   ├── Shop (view='shop')
│           │   ├── Rules (view='rules')
│           │   ├── Subscription (view='subscription')
│           │   ├── DailyQuestion (modal)
│           │   ├── SevenDayReflection (modal)
│           │   ├── OnboardingPopup (modal)
│           │   └── InspirationBrowser (modal)
│           └── Paywall (if needs payment)
└── InspirationBrowser (global modal)
```

## Component Data Flow

### Authentication Flow
```
AuthModal
  ↓ signUp/signIn
Supabase Auth
  ↓ session token
AuthProvider
  ↓ setUser, setProfile
useAuth() hook
  ↓
Components access user/profile
```

### Commitment Upload Flow
```
Dashboard (click upload)
  ↓
Camera/File Input
  ↓ image file
UploadFlow
  ↓ user enters goals
createCommitment()
  ↓
localStorage update
  ↓
Supabase upload
  ↓
Profile streak/count update
  ↓
Dashboard refreshes
```

### Notification Flow
```
Wolf Hour Trigger (20:00)
  ↓
Firebase Cloud Messaging
  ↓
Service Worker
  ↓
Browser Notification
  ↓
User clicks notification
  ↓
App opens/focuses
```

## Component Communication Patterns

### Props Passing (Unidirectional)
- MainApp → Dashboard (onUpload, onPaywallRequired callbacks)
- Navbar → MainApp (onNavigate, onSidebarToggle callbacks)
- Dashboard → CommitmentCard (commitment data)

### Context (Global State)
- useAuth() - User, profile, auth loading state
- useI18n() - Language, translation function

### State Management
- localStorage - Persisted app state
- useState - Component-level UI state
- Supabase - Server-side persistence
- Callbacks - Parent-child communication

## Component Responsibilities

| Component | Type | Responsibility |
|-----------|------|-----------------|
| `MainApp` | Container | View orchestration, modal management |
| `Navbar` | Container | Navigation, global pulse display |
| `Dashboard` | Container | Commitments display, upload |
| `RightSidebar` | Presentation | Stats display |
| `Archive` | Container | Historical commitments |
| `Settings` | Container | User preferences |
| `AuthModal` | Modal | Authentication UI |
| `Paywall` | Modal | Payment pitch |
| `DailyQuestion` | Modal | Question presentation |
| `SevenDayReflection` | Modal | 7-day milestone reflection |
| `UploadFlow` | Modal | Image + goal input |
| `InspirationBrowser` | Modal | Inspiration library |

## Data Dependencies

### Components requiring Authentication
- MainApp
- Dashboard
- Archive
- Settings
- Subscription
- Navbar

### Components requiring Local State
- Dashboard
- Settings
- AuthModal
- UploadFlow
- DailyQuestion

### Components requiring Supabase Data
- MainApp (load profile)
- Dashboard (load commitments)
- Subscription (subscription status)
- RightSidebar (stats)

### Components requiring i18n
- All user-facing components (labels, placeholders, messages)

