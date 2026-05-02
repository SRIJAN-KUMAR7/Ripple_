import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ChatPage from './pages/ChatPage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import LandingPage from './pages/LandingPage'
import { useAuthStore } from './store/useAuthStore'
import { useThemeStore } from './store/useThemeStore'

import PageLoader from './components/PageLoader'
import { Toaster } from 'react-hot-toast'

const App = () => {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();
  useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return <PageLoader />
  }

  return (
    <div className={`min-h-screen relative flex overflow-hidden app-bg transition-colors duration-300 ${!authUser ? 'items-center justify-center p-4' : ''}`}>
      {/* Background grid */}
      <div className="absolute inset-0 app-grid pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--glow-color),transparent_60%)] pointer-events-none" />

      <div className={`relative z-10 w-full ${!authUser ? 'max-w-5xl' : 'h-full'}`}>
        <Routes>
          <Route path="/" element={authUser ? <ChatPage /> : <LandingPage />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to={"/"} />} />
          <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />} />
        </Routes>
      </div>
      <Toaster />
    </div>
  )
}

export default App
