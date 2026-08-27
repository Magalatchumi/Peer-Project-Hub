import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth } from '../config/firebase'
import { userService } from '../services/userService'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchOrCreateProfile = useCallback(async (firebaseUser) => {
    try {
      const profile = await userService.getMe()
      setUser(profile)
    } catch (err) {
      if (err.response?.status === 404) {
        const name = firebaseUser.displayName || firebaseUser.email.split('@')[0]
        const newProfile = await userService.register(name)
        setUser(newProfile)
      } else {
        console.error('Failed to fetch profile:', err)
        setUser(null)
      }
    }
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await fetchOrCreateProfile(firebaseUser)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [fetchOrCreateProfile])

  const signup = async (name, email, password) => {
    await createUserWithEmailAndPassword(auth, email, password)
    const profile = await userService.register(name)
    setUser(profile)
    return profile
  }

  const login = async (email, password) => {
    const credential = await signInWithEmailAndPassword(auth, email, password)
    await fetchOrCreateProfile(credential.user)
    return credential.user
  }

  const logout = async () => {
    await signOut(auth)
    setUser(null)
  }

  const updateProfile = async (updates) => {
    const updated = await userService.updateMe(updates)
    setUser(updated)
    return updated
  }

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
