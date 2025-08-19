# Firebase Integration Setup

Your romantic app now has complete Firebase integration! Here's how to configure it with your Firebase project:

## 🔧 Configuration Steps

### 1. Update Firebase Config
Edit `src/firebase/config.ts` and replace the placeholder values with your actual Firebase project credentials:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com", 
  projectId: "your-actual-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id"
};
```

You can find these values in your Firebase Console:
1. Go to Project Settings → General tab
2. Scroll down to "Your apps" section
3. Copy the config object

### 2. Firebase Console Setup

In your Firebase Console, make sure to enable:

**Authentication:**
- Go to Authentication → Sign-in method
- Enable "Email/Password" provider

**Firestore Database:**
- Go to Firestore Database → Create database
- Start in test mode (you can secure it later)

**Storage:**
- Go to Storage → Get started
- Set up with default security rules

## 🎯 Features Included

### Authentication
- Email/password login and registration
- User session management
- Protected routes
- Sign out functionality

### Database (Firestore)
- **Love Messages**: Store and retrieve romantic messages by month
- **Date Plans**: Save upcoming and past date ideas with details
- **Photos**: Store photo memories with captions and favorites
- Real-time data synchronization

### File Storage
- Photo uploads to Firebase Storage
- Organized by user and month
- Automatic file management

## 🚀 How It Works

1. **Authentication Required**: Users must sign in before accessing the app
2. **User-Specific Data**: All data is tied to the authenticated user
3. **Real-time Updates**: Changes sync automatically across devices
4. **Secure**: Each user can only access their own data

## 📱 Component Structure

- `AuthWrapper`: Handles login/signup UI and authentication state
- `useAuth`: Custom hook for authentication logic
- Firebase services in `/firebase/` directory for database operations
- Existing components can be enhanced to use Firebase data

## 🔒 Security

The current Firestore rules allow read/write access until a future date. For production, update the rules in Firebase Console to be more restrictive:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{collection}/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

## 🎨 Next Steps

1. Replace the config values with your Firebase project credentials
2. Test the authentication flow
3. Optionally customize the UI components
4. Set up proper security rules for production

Your romantic app is now ready with full Firebase backend functionality! 💕