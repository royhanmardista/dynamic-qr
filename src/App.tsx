import { AuthProvider, useAuthContext } from './contexts/AuthContext'
import { AuthStatuses } from './contexts/types'
import { useSessionStorage } from './hooks/useSessionStorage'
import Login from './pages/LoginPage/Login'
import './styles/animations.css'

const AppContent = () => {
  const { auth, setAuth } = useAuthContext()
  const { isAuthenticated, user, clearToken } = useSessionStorage()

  if (!auth.isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="spinner"></div>
          <p className="text-gray-600 text-sm m-0">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Login />
  }

  const handleLogout = () => {
    clearToken()
    setAuth({
      phoneNumber: '',
      isLoading: false,
      error: '',
      status: AuthStatuses.VERIFY,
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="app-header">
        <h1 className="m-0 text-2xl text-gray-800 font-bold">
          Dynamic QR Dashboard
        </h1>
        <div className="flex items-center gap-4 text-gray-600 justify-center">
          <span>Welcome, {user}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white border-none px-4 py-2 rounded-md text-sm cursor-pointer transition-colors hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="flex-1 p-8 bg-gray-50 md:p-8 p-4">
        <div className="max-w-[600px] mx-auto bg-white rounded-xl p-8 shadow-md md:p-8 p-6">
          <h2 className="m-0 mb-6 text-gray-800 text-center">Your QR Code</h2>
          <div className="flex flex-col items-center justify-center h-[200px] border-2 border-dashed border-gray-300 rounded-lg text-gray-600 text-center">
            <p className="m-0 mb-2 text-lg">QR Code will be generated here</p>
            <small className="text-gray-400">
              Dynamic QR functionality coming soon...
            </small>
          </div>
        </div>
      </main>
    </div>
  )
}

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
