import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {useAuthStore} from "../store/useAuthStore"

const SignUpPage = () => {
  const [formdata,setFormData]=useState({fullname:"",email:"",password:""})
  const [signUp,isSigningUp]=useAuthStore()
  const handleSubmit=(e)=>{

  }
  return (
    <div className='w-full flex justify-items-center p-4 bg-slate-900'>
      <div className='relative w-full max-w-6xl md:h-[800px] h-[650px]'>
        
      </div>
    </div>
  )
}

export default SignUpPage
