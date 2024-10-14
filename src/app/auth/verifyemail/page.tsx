'use client'
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import otp_back from '@/assets/otp_back2.png'
import './verifyemail.css'

const VerifyOtpPage = () => {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  const [isDisabled,setIsDisabled]=React.useState<boolean>(false);
  const [countdown, setCountdown] = useState(20);;
  
  const [user, setUser]=useState<any>(null)
  const [notVerified,setNotVerified]=useState<any>(false)

  const getUserData=React.useCallback(async()=>{
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/auth/getuser`,{
        method:'GET',
        headers:{
            'Content-Type':'application/json',
        },
        credentials:'include',
    })
    .then((res)=>res.json())
    .then((data)=>{
        if(data.ok){
            console.log(data)
            setUser(data.data)
        }
        else{
            console.log(data)
        }
    })
},[]) 

React.useEffect(() => {
  if (user && user.verified === false) {
    setNotVerified(true);
    setCountdown(0);
  }
}, [user]);

  React.useEffect(() => {
    // Parse query parameters from the URL
    const params = new URLSearchParams(window.location.search);
    setUserId(params.get('userId'));
    setEmail(params.get('email'));
    getUserData()
  }, []);

  React.useEffect(() => {
    let timer:any;
    if (countdown > 0) {
      // If countdown is active, set interval to decrement every second
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else {
      // Countdown is over, clear interval and enable the button
      setIsDisabled(false);
    }
    return () => clearInterval(timer); // Clear interval on component unmount or when countdown changes
  }, [countdown]);

  const backgroundStyle = {
    width: '50%',
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
};

  const handleChange = (e:any) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/auth/verifyotp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, otp }), // Send userId and otp in the request body
          });
    
        const result = await response.json();
        console.log(result);
      if (result.status === 'VERIFIED') {
        setSuccess('OTP verified successfully!');
        // Redirect to the login page or home page after successful verification
        if(notVerified){
          router.push('/profile');
          setNotVerified(false)
        }
        else{
          router.push('/auth/signin');
        }
      } else {
        setError(result.message);
        setSuccess('')
      }
    } catch (error) {
      console.error('Error verifying OTP', error);
      setError('An error occurred while verifying the OTP.');
      setSuccess('')
    }
  };

  const handleResendOtp = async () => {
    try {
        setIsDisabled(true);
        setCountdown(20); // Set countdown to 20 seconds
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API}/auth/resendotpverificationcode`, { userId, email });
      if (response.data.status === 'PENDING') {
        setSuccess('OTP resent successfully. Please check your email.');
        setError('')
      } else {
        setError(response.data.message);
        setSuccess('')
        setIsDisabled(false); // Enable the button after resending OTP
        setCountdown(0)
      }
    } catch (error) {
      console.error('Error resending OTP', error);
      setError('An error occurred while resending the OTP.');
      setSuccess('')
      setIsDisabled(false); // Enable the button after resending OTP
      setCountdown(0)
    }
  };

  return (
    <div className='main'>
        <div className='left-div' style={backgroundStyle}>
        <Image src={otp_back} alt='background' height={600} width={600}></Image>
        </div>
        <div className='right-div'>
            <div className="body-cont">
            <h1>OTP Verification</h1>
            <p>{notVerified?`Click Send OTP to verify ${email}`:`Enter 6 Digit OTP sent to ${email}`}</p>
            <form onSubmit={handleSubmit}>
                <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                value={otp}
                onChange={handleChange}
                required
                maxLength={6}
                pattern="\d{6}"
                />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
                <p>Didn&apos;t Receive OTP Code?</p> 
                {countdown==0?<p className='enabled' onClick={handleResendOtp}>{notVerified?'Send OTP':'Resend OTP'}</p>:<p className='disabled'>Resend OTP in {countdown} sec</p>}
                <button type="submit" disabled={isDisabled||!otp}>{isDisabled ? 'Please wait...' : 'Verify OTP'}</button>
            </form>
            </div>
        </div>
      
    </div>
  );
};

export default VerifyOtpPage;