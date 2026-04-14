// SkillSetu — Firebase Config (safe mode)
// Google Sign-In is optional. App works fine without Firebase keys.
// Only email/password login is disabled when Firebase is not configured.

export let auth = null
export let googleProvider = null

export const signInWithGoogle = async () => {
  const key = import.meta.env.VITE_FIREBASE_API_KEY
  if (!key || key.length < 10) {
    throw new Error('Firebase not configured. Please use email and password to login.')
  }
  try {
    const { initializeApp }                               = await import('firebase/app')
    const { getAuth, GoogleAuthProvider, signInWithPopup } = await import('firebase/auth')
    const app = initializeApp({
      apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId:             import.meta.env.VITE_FIREBASE_APP_ID,
    })
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account' })
    return await signInWithPopup(getAuth(app), provider)
  } catch (e) {
    throw new Error('Google Sign-In failed: ' + e.message)
  }
}