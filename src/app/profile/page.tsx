'use client'
import React from 'react'
import './profilepage.css'
import { useState,useEffect,useCallback} from 'react'
import Image from 'next/image'
import empty_book from '@/assets/empty_book.jpg'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { Span } from 'next/dist/trace'

const Page = () => {
    const router=useRouter();
    const [bookings,setBookings]=React.useState<any>([])
    const [user,setUser]=React.useState<any>(null)
    const [verified,setVerified]=React.useState<boolean>(false)
    const [cancelBookingDiv,setCancelBookingDiv]=React.useState<boolean>(false)

    const [cancelledBookings,setCancelledBookings]=React.useState<any>([])

    const formatDate = (isoDateString: any) => {
        if (!isoDateString) {
            console.error('Invalid date input');
            return '';
        }
        const date = new Date(isoDateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    };

    const formatTime = (time:any) => {
        if (!time) {
            console.error('Invalid time input');
            return '';
        }
    
        const [hour, minute] = time.split(':');
        
        if (hour === undefined || minute === undefined) {
            console.error('Invalid time format');
            return '';
        }
        
        const date = new Date();
        date.setHours(parseInt(hour, 10));
        date.setMinutes(parseInt(minute, 10));
    
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    
        return `${hours}:${minutesStr} ${ampm}`;
    }
    const formatDateTime = (isoDateString:any) => {
        if (!isoDateString) {
            console.error('Invalid date input');
            return '';
        }
        const date = new Date(isoDateString);
    
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        };
    
        return date.toLocaleString('en-US', options);
    };

    const getMovieName = useCallback(async (movieId: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/movies/${movieId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const data = await response.json();
            if (data.ok) {
                return data.data.title;
            } else {
                console.log(data);
                return 'Unknown Movie';
            }
        } catch (err) {
            console.log(err);
            return 'Unknown Movie';
        }
    }, []);

    const getBookings = useCallback(async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/getuserbookings`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const data = await response.json();
            if (data.ok) {
                console.log(data);
                const bookingsWithTitles = await Promise.all(
                    data.data.filter((booking: any) => booking !== null).map(async (booking: any) => {
                        const movieTitle = await getMovieName(booking.movieId);
                        return { ...booking, movieTitle };
                    })
                );
                setBookings(bookingsWithTitles);
            } else {
                console.log(data);
            }
        } catch (err) {
            console.log(err);
        }
    }, [getMovieName]);

    const getUserData = useCallback(async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/auth/getuser`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const data = await response.json();
            if (data.ok) {
                console.log(data);
                if (data.data.verified === true) {
                    setVerified(true);
                }
                setUser(data.data);
            } else {
                console.log(data);
            }
        } catch (err) {
            console.log(err);
        }
    }, []);

    const getCancelledBookings = useCallback(async () => {
        if (user && user._id) {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/cancelledbookings/${user._id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                const data = await response.json();
                if (data.ok) {
                    console.log(data);
                    const cancelledBookingsWithTitles = await Promise.all(
                        data.data.filter((booking: any) => booking !== null).map(async (booking: any) => {
                            const movieTitle = await getMovieName(booking.bookedMovieId);
                            return { ...booking, movieTitle };
                        })
                    );
                    setCancelledBookings(cancelledBookingsWithTitles);
                } else {
                    console.log(data);
                }
            } catch (err) {
                console.log(err);
            }
        }
    }, [user, getMovieName]);

    const handleSendVerify = () => {
        router.push(`/auth/verifyemail?userId=${user._id}&email=${user.email}`);
    };

    useEffect(() => {
        getBookings();
        getUserData();
    }, [getBookings, getUserData]);

    useEffect(() => {
        getCancelledBookings();
    }, [getCancelledBookings]);


    

    return (
    <div className="profile">
        <h1 className="head">Profile</h1>
        {
            user?(
                <div className="user">
                    <h2>User Details</h2>
                    <div className="details">
                        <div className="detail">
                            <h3>User</h3>
                            <p>{user?.name}</p>
                        </div><div className="detail">
                            <div className='email-div'>
                                <h3>Email</h3>{verified?<p className='verified verifylink'>Verified</p>:<button onClick={handleSendVerify} 
                                className='verifylink'>Not Verified</button>}
                            </div>
                            <p>{user?.email}</p>
                        </div>
                        <div className="detail">
                            <h3>City</h3>
                            <p>{user?.city}</p>
                        </div>
                    </div>
                </div>
            ):<p>No user Data</p>
        }
        <div className='booking-options'>
        <h2 className={cancelBookingDiv?'':'option-active'} onClick={()=>{setCancelBookingDiv(false)}}>Bookings</h2><h2 className={cancelBookingDiv?'option-active':''} onClick={()=>{setCancelBookingDiv(true)}}>Cancelled Bookings</h2>
        </div>
        {cancelBookingDiv?(
            <div className="bookings">
            {
                cancelledBookings.length>0?(
                    <div className="booking">
                        {
                        cancelledBookings
                        .slice() // Create a shallow copy to avoid mutating the original array
                        .reverse() // Reverse the order to get the last booked first
                        .map((booking:any,index:any)=>{
                            return (
                                     <div className="ticket-details" key={index}>
                                        <p className='details'><span className='detail-head'>Payment ID</span ><span className='cont paymentiddiv'>{booking.paymentId}</span></p>
                                        <p className='details '><span className='detail-head'>Movie</span><span>{booking.movieTitle}</span></p>
                                        <p className='details'>
                                            <span className='detail-head'>Cancelled At</span>
                                            <span className='cont'>{formatDateTime(booking.cancelledAt)}</span>
                                        </p>
                                        <p className='details'><span className='detail-head'>Amount</span><span className='cont'>Rs.{booking.totalAmount}</span></p>
                                        <p className='details'><span className='detail-head'>Refund Status</span><span className='cont'>{booking.status=='REFUND-PENDING'?<span className='status-pending'>PENDING</span>:<span className='status-success'>REFUND SUCCESS</span>}</span></p>
                                    </div>
                            )
                        })
                    
                        }
                    </div>
                ):(
                    <div className="error">
                        <Image src={empty_book} alt="empty_book" width={200} height={200}/>
                        <p style={{'textAlign':'center','fontFamily':'sans-serif',}}>No Cancelled Bookings Found</p>
                    </div>
                )
            } 
        </div>
        ):(
            <div className="bookings">
            {
                bookings.length>0?(
                    <div className="booking">
                        {
                        bookings
                        .slice() // Create a shallow copy to avoid mutating the original array
                        .reverse() // Reverse the order to get the last booked first
                        .map((booking:any,index:any)=>{
                            return (
                                     <div className="ticket-details" key={index}>
                                        <p className='details '><span className='detail-head'>Movie</span><span>{booking.movieTitle}</span></p>
                                        <p className='details'>
                                            <span className='detail-head'>Seats</span>
                                            <span className='cont'>
                                                {booking?.seats.map((seat:any,index:any)=>{
                                                    return(
                                                        <span key={index}>{seat.row}{seat.col}{seat.seat_id} </span>
                                                    )
                                                })}
                                            </span>
                                        </p>
                                        <p className='details'><span className='detail-head'>Show Date</span ><span className='cont'>{formatDate(booking.showDate)}</span></p>
                                        <p className='details'><span className='detail-head'>Show Time</span><span className='cont'>{formatTime(booking?.showTime)}</span></p>
                                        <div className="button"><button onClick={()=>{
                                            router.push(`/profile/viewticket/${booking._id}`)
                                        }}>View Full Ticket</button></div>
                                    </div>
                            )
                        })
                    
                        }
                    </div>
                ):(
                    <div className="error">
                        <Image src={empty_book} alt="empty_book" width={200} height={200}/>
                        <p style={{'textAlign':'center','fontFamily':'sans-serif',}}>No Bookings Found</p>
                    </div>
                )
            } 

        </div>
        )}
    </div>
  )
}

export default Page