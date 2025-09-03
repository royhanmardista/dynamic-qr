import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { AuthStatus } from './types'
import { AuthStatuses } from './types'

export interface AuthState {
  phoneNumber: string
  isLoading: boolean
  error: string
  status: AuthStatus
  isInitialized: boolean
}

export interface AuthContextType {
  auth: AuthState
  setAuth: (updates: Partial<AuthState>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const initialAuthState: AuthState = {
  phoneNumber: '',
  isLoading: false,
  error: '',
  status: AuthStatuses.VERIFY,
  isInitialized: false,
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuthState] = useState<AuthState>(initialAuthState)

  useEffect(() => {
    setAuthState((prev) => ({
      ...prev,
      isInitialized: true,
    }))
  }, [])

  const setAuth = (updates: Partial<AuthState>) => {
    setAuthState((prev) => ({ ...prev, ...updates }))
  }

  const contextValue: AuthContextType = {
    auth,
    setAuth,
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}

/* eslint-disable react-refresh/only-export-components */
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
