'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import Image from 'next/image';
import pay_done from '@/assets/pay_done.png'
import { useRouter } from 'next/navigation';
import './booking-success.css'
import Loading from '@/components/Loading/Loading';

const BookingSuccess = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const hasFetched=useRef(false);

  const [paymentId,setPaymentId]=useState<any>(null)
  const [countdown, setCountdown] = useState(10);
  
  const [dateofShow,setDateofShow]=useState<any>(null)
  const [moviename,setMovieName]=useState<any>(null)

  const formatDate = (isoDateString:any) => {
    const date = new Date(isoDateString);
    return new Intl.DateTimeFormat('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    }).format(date);
};

const getMovieName=async(movieId:string)=>{
  try{
   const response=await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/movies/${movieId}`,{
       method:'GET',
       headers:{
           'Content-Type':'application/json',
       },
       credentials:'include',
   })
   const data=await response.json()
   if(data.ok){
       return data.data.title
   }
   else{
       console.log(data)
       return 'unknown Movie'
   }
  }
  catch(err){
   console.log(err)
  }
}

  useEffect(() => {
    console.log('sessionId:', sessionId);
    if (!sessionId || hasFetched.current) return; // Exit if there's no sessionId or fetch has already happened
    hasFetched.current = true; // Set to true before fetching
    const fetchSession = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/checkout-session/${sessionId}`);
            const session = await res.json();

            console.log('Fetched session:', session); // Log the fetched session
            if (session.payment_intent) {
              console.log('Payment Intent:',session.payment_intent)
              confirmBooking(session.payment_intent,session)
            }else {
              console.log('Payment intent is null.');
              toast.error('Payment not completed. Please try again.');
          }
        } catch (error) {
            console.error('Error fetching session:', error);
            toast.error('Failed to fetch session data');
        }finally{
          setLoading(false);
        }
    };
    fetchSession();
}, [sessionId]);


    const confirmBooking = async (paymentIntent:any,session:any) => {
      if (!paymentIntent) {
        toast.error('Payment intent not found. Please try again.');
        setLoading(false);
        return;
      }
      try {
        setPaymentId(paymentIntent)
        setDateofShow(formatDate(session.metadata.showDate))
        setMovieName(getMovieName(session.metadata.movieId))
        const bookingDetails = {
          showTime: session.metadata.showTime,
          showDate: session.metadata.showDate,
          movieId: session.metadata.movieId,
          screenId: session.metadata.screenId,
          seats: JSON.parse(session.metadata.seats), // Parse seats back to an array
          totalPrice: session.metadata.totalPrice,
          paymentId: paymentIntent, // Assuming paymentId is always available for this example, replace with actual payment ID from the intent.
          paymentType: 'online', // Assuming paymentType is always 'online' for this example
        };
        
        console.log('Booking Details:', bookingDetails);
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/bookticket`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ sessionId,paymentIntent,bookingDetails}),
        });
        const data = await res.json();
        if (data.ok) {
          toast.success('Ticket booked successfully');
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error('Something went wrong while confirming the booking');
        console.error(error);
      } 
    };

    useEffect(() => {
      if (!loading) {
        const timer = setInterval(() => {
          setCountdown((prevCountdown) => {
            if (prevCountdown <= 1) {
              clearInterval(timer);
              router.push('/profile'); // Change this to your desired route
              return 0;
            }
            return prevCountdown - 1;
          });
        }, 1000);
  
        return () => clearInterval(timer); // Cleanup the timer if the component unmounts
      }
    }, [loading, router]);


  return (
    <div>
      {loading ? <Loading/>: 
      <div className="main-cont">
        <div className="content-cont">
          <div className="id-info">
            <h1>Your Booking has been Successful!</h1>
            <p><span>Payment Id:</span>{paymentId}</p>
          </div>
          <Image src={pay_done} alt="payment done"height={200} width={200}/>
          <div className="book-info">
            <div className="left">
              <h3>Movie</h3>
              <p>{moviename}</p>
            </div>
            <div className="right">
              <h3>Date</h3>
              <p>{dateofShow}</p>
            </div>
          </div>
          
          <button onClick={()=>{
            router.push('/profile');
          }}>Go to Bookings</button>
          <p>You will be redirected to your bookings in {countdown} seconds...</p>
        </div>
      </div>
    }
    </div>
  );
};

export default BookingSuccess;
