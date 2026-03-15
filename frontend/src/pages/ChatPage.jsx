import React from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

const ChatPage = () => {
   
  const {logout}=useAuthStore()
   
  return (
    <div className="z-10">
      chatpage
      <button onClick={logout}>logout</button>
    </div>
  )
}

export default ChatPage
 