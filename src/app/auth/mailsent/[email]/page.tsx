'use client'
import React from 'react'
import '@/app/auth/forgotpassword/forgotpass.css'
import Image from 'next/image'
import myjpg from '@/assets/myjpg.jpg'
import { useParams } from 'next/navigation'
import { useEffect,useState } from 'react'

const Page = () => {
  const params=useParams();
  const [emailId, setEmailId] = useState('');
  useEffect(() => {
    // Decode the email parameter
    if (params.email) {
        setEmailId(decodeURIComponent(params.email));
    }
}, [params.email]);

  return (
    <div className='forgot-emaildiv'>
        <h1>Password Reset Link has been sent to your mail </h1>
        <h3>{emailId}</h3>
        <Image src={myjpg} height={400} width={450} alt='myjpg'/>
      <button onClick={()=>{
        window.location.href=`https://mail.google.com/`
      }}>Go To Gmail</button>
    </div>
  )
}

export default Page