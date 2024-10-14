'use client'
import React from 'react'
import pay_cancel from '@/assets/pay_cancel.png'
import './booking-cancel.css'
import { useEffect,useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const BookingCancel=() => {
    const router=useRouter();  // Get the router instance from Next.js
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
          const timer = setInterval(() => {
            setCountdown((prevCountdown) => {
              if (prevCountdown <= 1) {
                clearInterval(timer);
                router.push('/'); // Change this to your desired route
                return 0;
              }
              return prevCountdown - 1;
            });
          }, 1000);
    
          return () => clearInterval(timer); // Cleanup the timer if the component unmounts
      }, [router]);
          
  return (
    <div>
        <div className="main-cont">
        <div className="content-cont">
          <div className="id-info">
            <h1>Your Payment has been Canceled</h1>
          </div>
          <Image src={pay_cancel} alt="payment cancel"height={200} width={200}/>
          <button onClick={()=>{
            router.push('/');  // Change this to your desired route
          }}>Go to HomePage</button>
          <p style={{'marginTop':'10px'}}>You will be redirected to Home Page in {countdown} seconds...</p>
        </div>
      </div>
    </div>
  )
}

export default BookingCancel