# PAPYR React Native Migration Checklist

## 1. Project Setup

- [ ] Create React Native project with Expo or React Native CLI
- [ ] Set up TypeScript configuration
- [ ] Configure ESLint and Prettier
- [ ] Set up development environment (iOS/Android emulators)
- [ ] Install required native modules

**Key Dependencies for RN**:
```json
{
  "react": "^18.3.0",
  "react-native": "^0.75.0",
  "@react-navigation/native": "^6.x",
  "@react-navigation/bottom-tabs": "^6.x",
  "@react-navigation/stack": "^6.x",
  "@supabase/supabase-js": "^2.81.0",
  "@react-native-async-storage/async-storage": "^1.x",
  "react-native-image-picker": "^5.x",
  "react-native-camera": "^4.x",
  "react-native-stripe-sdk": "^1.x",
  "expo-notifications": "^0.x",
  "nativewind": "^2.x" or "react-native-nativewind": "^1.x"
}
```

---

## 2. Authentication Migration

**Current**: Supabase auth with web OAuth flow

**RN Changes**:
- [ ] Install `@react-native-firebase/auth` or keep Supabase
- [ ] Implement OAuth via `react-native-app-auth` or `expo-auth-session`
- [ ] Create native OAuth deep-linking
- [ ] Adapt AuthModal to RN (removed web-specific OAuth callbacks)
- [ ] Test email/password sign up and sign in
- [ ] Handle session persistence with AsyncStorage
- [ ] Test OAuth flows for Google, Apple, GitHub

**File Changes**:
- `/lib/supabase/auth.ts` - Add RN-specific OAuth handling
- `/components/AuthModal.tsx` - Convert web form to RN components
- `/lib/supabase/context.tsx` - Update for native session handling

---

## 3. Storage & Data Persistence

**Current**: 
- localStorage (browser)
- Supabase PostgreSQL
- Base64 image data

**RN Implementation**:
- [ ] Replace localStorage with `@react-native-async-storage/async-storage`
- [ ] Implement SQLite backup for critical data
- [ ] Handle image storage (local device storage or cloud)
- [ ] Set up data sync strategy between local and Supabase
- [ ] Implement offline-first data handling
- [ ] Handle sensitive data encryption

**Key Changes**:
```typescript
// Old
const stored = localStorage.getItem(STORAGE_KEY);

// New
const stored = await AsyncStorage.getItem(STORAGE_KEY);
```

**File Changes**:
- `/lib/storage.ts` - Swap localStorage for AsyncStorage
- Create new `/lib/asyncStorage.ts` for RN storage
- Create `/lib/database/sqlite.ts` for offline DB (optional)

---

## 4. Image Handling & Camera

**Current**: 
- Web file input
- Base64 encoding
- No camera access

**RN Implementation**:
- [ ] Integrate `react-native-image-picker` for camera/gallery
- [ ] Implement native camera with `react-native-camera`
- [ ] Handle camera permissions (iOS/Android)
- [ ] Image compression before upload
- [ ] Store images locally with unique paths
- [ ] Upload to Supabase Storage
- [ ] Handle offline image queuing

**Files to Create**:
- `/lib/camera/picker.ts` - Image selection
- `/lib/camera/permissions.ts` - Camera/gallery permissions
- `/lib/camera/compression.ts` - Image optimization

**Changes**:
- `/components/UploadFlow.tsx` - Use image picker, remove file input
- `/lib/storage.ts` - Handle image path instead of base64

---

## 5. Navigation

**Current**: Next.js App Router

**RN Stack**:
- [ ] Install React Navigation
- [ ] Create navigation structure (Stack, Tab, Drawer)
- [ ] Map Next.js routes to RN screens
- [ ] Implement bottom tab navigation
- [ ] Set up stack-based modals
- [ ] Handle back button and gestures
- [ ] Deep linking for OAuth callbacks

**Navigation Structure**:
```typescript
<NavigationContainer>
  <Stack.Navigator>
    <Stack.Screen name="Auth" component={AuthScreen} />
    <Stack.Screen name="Onboarding" component={OnboardingScreen} />
    <Stack.Group screenOptions={{ presentation: 'modal' }}>
      <Stack.Screen name="MainApp">
        <MainTab.Navigator>
          <MainTab.Screen name="Dashboard" component={DashboardScreen} />
          <MainTab.Screen name="Archive" component={ArchiveScreen} />
          <MainTab.Screen name="Shop" component={ShopScreen} />
          <MainTab.Screen name="Settings" component={SettingsScreen} />
        </MainTab.Navigator>
      </Stack.Screen>
    </Stack.Group>
  </Stack.Navigator>
</NavigationContainer>
```

**Files to Create**:
- `/navigation/RootNavigator.tsx`
- `/navigation/AuthNavigator.tsx`
- `/navigation/MainNavigator.tsx`
- `/screens/*.tsx` - Convert components to screens

---

## 6. Styling & Design System

**Current**: Tailwind CSS + custom CSS

**RN Options**:
1. **NativeWind** (Recommended for compatibility)
   - [ ] Install `nativewind`
   - [ ] Adapt Tailwind classes to RN
   - [ ] Build custom StyleSheet helpers

2. **React Native StyleSheet**
   - [ ] Create `/styles/` directory with theme
   - [ ] Migrate Tailwind classes to StyleSheet
   - [ ] Set up color/spacing constants

**Approach**: Use NativeWind for quick migration, then optimize

**Key Styles to Preserve**:
- Vintage color palette (cream, brown, vintage colors)
- Patrick Hand font (verify availability)
- Polaroid shadow effects
- Responsive breakpoints

**Files to Create**:
- `/styles/theme.ts` - Colors, spacing, fonts
- `/styles/tailwind.css` - NativeWind config (if using)

---

## 7. Notifications

**Current**: Firebase FCM + Service Worker

**RN Implementation**:
- [ ] Use `expo-notifications` (Expo) or `react-native-notifications`
- [ ] Request notification permissions
- [ ] Handle notification tokens
- [ ] Set up scheduled notifications for Wolf Hour
- [ ] Handle notification received/pressed events
- [ ] Test iOS and Android separately

**Key Changes**:
- `/lib/firebase.ts` → `/lib/notifications/native.ts`
- Remove Service Worker pattern
- Implement native notification handlers

---

## 8. Payment/Stripe Integration

**Current**: Stripe SDK for web + webhook handling

**RN Changes**:
- [ ] Use `@react-native-stripe-sdk/stripe-react-native`
- [ ] Implement Stripe Payment Sheet
- [ ] Handle subscription creation in app
- [ ] Maintain webhook handler (backend stays the same)
- [ ] Update Paywall component for native
- [ ] Test iOS and Android payment flows

**Files to Update**:
- `/components/Paywall.tsx` - Use Stripe Payment Sheet
- `/lib/stripe/client.ts` - RN-specific Stripe setup

---

## 9. Component Conversion

### High Priority Components to Migrate

| Component | Current | RN | Notes |
|-----------|---------|----|----|
| AuthModal | Modal | Modal Stack | OAuth deep linking needed |
| Dashboard | Tailwind grid | FlatList/ScrollView | Touch interactions |
| UploadFlow | File input + preview | Image picker + preview | Camera permissions |
| Settings | Scrollable form | ScrollView + form | Styling migration |
| Paywall | HTML button | Stripe Payment Sheet | Native payment UI |
| Archive | Tailwind list | FlatList | Scrolling optimization |
| DailyQuestion | Modal | Modal Stack | Keep same logic |
| Navbar | Sticky header | Header component | Navigation handler |

### Component Checklist

- [ ] AuthModal → AuthScreen (in Stack)
- [ ] Dashboard → DashboardScreen (main screen)
- [ ] MainApp → Split into MainNavigator + MainScreen
- [ ] Archive → ArchiveScreen (tab)
- [ ] Settings → SettingsScreen (tab)
- [ ] Shop → ShopScreen (tab)
- [ ] Paywall → PaymentSheet modal
- [ ] UploadFlow → Modal with image picker
- [ ] DailyQuestion → Modal screen
- [ ] SevenDayReflection → Modal screen
- [ ] NewOnboarding → OnboardingScreen (stack)
- [ ] Navbar → Header + Tab navigation
- [ ] RightSidebar → Dashboard content (integrate)
- [ ] InspirationBrowser → BrowserModal

---

## 10. Feature Migration Priority

### Phase 1 (MVP - 2-3 weeks)
- [ ] Authentication (email/password)
- [ ] Camera & image capture
- [ ] Commitment creation & storage
- [ ] Streak calculation
- [ ] Basic UI navigation
- [ ] LocalStorage persistence

### Phase 2 (Core Features - 2-3 weeks)
- [ ] Supabase sync
- [ ] OAuth authentication
- [ ] Archive view
- [ ] Settings & language
- [ ] Notifications (Wolf Hour reminder)
- [ ] Paywall & Stripe

### Phase 3 (Polish - 1-2 weeks)
- [ ] Daily Questions
- [ ] 7-Day Reflection
- [ ] Polaroid animation
- [ ] Global Pulse counter
- [ ] Onboarding popups
- [ ] Inspiration browser

### Phase 4 (Optional)
- [ ] Shop
- [ ] Rules
- [ ] Advanced notifications
- [ ] Analytics

---

## 11. Testing Strategy

- [ ] Unit tests for utility functions (streak, joker logic)
- [ ] Integration tests for authentication
- [ ] Component tests for key screens
- [ ] E2E tests for critical flows (signup, commitment, payment)
- [ ] Manual testing on iOS and Android devices
- [ ] Performance testing (image handling, list scrolling)
- [ ] Accessibility testing (button sizes, text contrast)

---

## 12. Specific Code Migration Examples

### LocalStorage to AsyncStorage
```typescript
// Before (Web)
localStorage.setItem('papyr_state', JSON.stringify(state));

// After (RN)
await AsyncStorage.setItem('papyr_state', JSON.stringify(state));
```

### File Input to Image Picker
```typescript
// Before (Web)
const input = document.createElement('input');
input.type = 'file';
input.onchange = (e) => { /* handle */ };

// After (RN)
const result = await ImagePicker.launchImageLibrary({ mediaType: 'photo' });
if (result.assets) { /* handle */ }
```

### Tailwind to NativeWind/StyleSheet
```typescript
// Before (Web)
<div className="flex items-center justify-center p-4 bg-cream rounded-lg">

// After (RN - NativeWind)
<View className="flex items-center justify-center p-4 bg-[#F9F9F0] rounded-lg">

// After (RN - StyleSheet)
<View style={styles.container}>

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#F9F9F0',
    borderRadius: 8,
  }
});
```

### Modal Management
```typescript
// Before (Web)
{showDailyQuestion && <DailyQuestion ... />}

// After (RN)
<Stack.Group screenOptions={{ presentation: 'modal' }}>
  {showDailyQuestion && <Stack.Screen name="DailyQuestion" ... />}
</Stack.Group>
```

---

## 13. Platform-Specific Considerations

### iOS
- [ ] Test with iPhone 12/14/15
- [ ] Apple Sign-In implementation
- [ ] App Store submission requirements
- [ ] iOS notification permissions
- [ ] iPhone camera format compatibility

### Android
- [ ] Test with Android 11, 12, 13, 14
- [ ] Google Sign-In implementation
- [ ] Play Store submission requirements
- [ ] Android notification channels
- [ ] Android storage permissions (scoped storage)

---

## 14. Configuration & Deployment

### Development
- [ ] Expo Go for rapid development
- [ ] EAS for CI/CD (if using Expo)
- [ ] TestFlight for iOS testing
- [ ] Google Play Beta for Android testing

### Production
- [ ] EAS Build for production builds (Expo)
- [ ] Or: Xcode/Android Studio for native builds
- [ ] Code signing certificates (iOS)
- [ ] Keystore for Android
- [ ] Version management strategy

---

## 15. Known Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| **Base64 image storage** | Use device file system + AsyncStorage paths |
| **Web OAuth flow** | Implement deep-linking for OAuth |
| **localStorage** | Switch to AsyncStorage |
| **Tailwind CSS** | Use NativeWind or StyleSheet |
| **Next.js routing** | Use React Navigation |
| **Browser notifications** | Use native notification APIs |
| **Image uploads** | Implement form data + multipart upload |
| **Offline support** | Use SQLite + sync queue |

---

## 16. Success Criteria

- [ ] All authentication methods working (email, Google, Apple, GitHub)
- [ ] Camera captures work on iOS and Android
- [ ] Streak calculations accurate
- [ ] Supabase sync functioning
- [ ] Stripe payments working in-app
- [ ] Push notifications sending and opening app
- [ ] App performs well on mid-range devices
- [ ] All text properly internationalized (DE/EN)
- [ ] Manual testing on real devices completed
- [ ] Ready for App Store and Play Store submission

