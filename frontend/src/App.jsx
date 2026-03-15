import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ChatPage from './pages/ChatPage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import { useAuthStore } from './store/useAuthStore'

import PageLoader from './components/PageLoader'
import { Toaster } from 'react-hot-toast'

const App = () => {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  // console.log({authUser})

  if (isCheckingAuth) {
    return <PageLoader />
  }


  return (
    <div className='min-h-screen bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden text-white'>
      {/* Background elements */}
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_60%)]" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-white opacity-10 blur-[140px]" />
      <div className="absolute bottom-0 -right-32 w-[500px] h-[500px] bg-gradient-to-tr from-white/10 via-gray-300/10 to-transparent blur-[120px]" />


      <div className="relative z-10 w-full max-w-5xl">
        <Routes>
          <Route path="/" element={authUser ? <ChatPage /> : <Navigate to={"/login"} />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to={"/"} />} />
          <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />} />
        </Routes>
      </div>
      <Toaster />
    </div>
  )
}

export default App
