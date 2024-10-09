'use client'
import React from 'react'
import './viewticket.css' 
import movie_port from '@/assets/KUD_p.jpg'
import Image from 'next/image'
import { useState,useEffect } from 'react'
import { useParams } from 'next/navigation'
import { toast } from 'react-toastify'


const Viewticketpage = () => {
    const params=useParams();
    const bookingId=params.bookingid;
    const [booking,setBooking]=React.useState<any>(null)
    const [movie,setMovie]=React.useState<any>(null)
    const [screen,setScreen]=React.useState<any>(null)
    const [isDownloading,setIsDownloading]=React.useState<any>(null)

    const formatDate = (isoDateString:any) => {
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

    const getBooking=React.useCallback(async()=>{
        try{
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/getuserbooking/${bookingId}`,{
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                },
                credentials:'include'
            })
            const data = await response.json();
            if(data.ok){
                setBooking(data.data)
                console.log(data)
            }
            else{
                console.error(data.message);
            }
        }
        catch(error){
            console.error(error);
        }
    },[bookingId])
    
    const getMovie=React.useCallback(async(movieId:any)=>{
        try{
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/movies/${movieId}`,{
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                },
                credentials:'include'
            })
            const data = await response.json();
            if(data.ok){
                console.log(data)
                setMovie(data.data)
            }
            else{
                console.error(data.message);
            }
        }
        catch(error){
            console.error(error);
        }
    },[])

    const getScreen=React.useCallback(async()=>{
        try{
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/getscreen/${booking.screenId}`,{
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                },
                credentials:'include'
            })
            const data = await response.json();
            if(data.ok){
                console.log(data)
                setScreen(data.data)
            }
            else{
                console.error(data.message);
            }
        }
        catch(error){
            console.error(error);
        }
    },[booking])

    React.useEffect(()=>{
        getBooking()
    },[getBooking])

    useEffect(() => {
        if (booking && booking.movieId) {
            getMovie(booking.movieId);
        }
    }, [booking,getMovie]);
    useEffect(() => {
        if (booking && booking.screenId) {
            getScreen();
        }
    }, [booking,getScreen]);


    const downloadTicket = async () => {
        console.log('button was clicked')
        if(booking&&screen&&movie){
            try{
                setIsDownloading(true); 
                const response=await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/downloadticket/${booking._id}`,{
                    method:'POST',
                });
                if (!response.ok) {
                    toast.error('Failed to generate ticket');
                    return;
                }
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `ticket_${booking._id}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url); // Clean up the URL object
                toast.success('Ticket downloaded successfully');
            }
            catch(error){
                console.error('Error Downloading PDF',error);
                toast.error('Error downloading ticket');
            }
            finally{
                setIsDownloading(false); 
            }
        }
    };



  return (
    <div>
        {
            booking && movie && screen&&
            <div className='main-cont'>
                <h1 style={{'margin':'30px'}}>View Ticket</h1>
                <div className='ticket-div'>
                    <div className="details-div">
                        <div className="movie-div">
                            <Image src={movie.portraitImgUrl} alt='' height={200} width={150}/>
                            <div className="details">
                                <h1>{movie.title}</h1>
                                <p>{screen.screenType}</p>
                                <p>{formatDate(booking.showDate)} | {formatTime(booking.showTime)}</p>
                                <p>{screen.location} | {screen.city}</p>
                            </div>
                        </div>
                        <div className="qr-div">
                            <Image src={booking.qrCode} alt='qr' height={170} width={170}/>
                            <div className="details">
                                <p>{booking.seats.length} Ticket(s)</p>
                                <h1>{screen.name}</h1>
                                <p>
                                {booking.seats.map((seat:any,index:any)=>(
                                     <span key={index}>{seat.row}{seat.col}{seat.seat_id} </span>
                                ))}
                                </p>
                                <p className='bookId'>Booking Id: <span>{booking._id}</span></p>
                            </div>
                        </div>
                        <div className="info-div">
                            <div className='amount-div'>Total Amount <span>:  Rs.{booking.totalPrice}</span></div>
                            <p>A confirmation email will be sent within 15 mins of booking</p>
                            <button className={isDownloading?'down-disabled':'theme_btn1'} onClick={downloadTicket} disabled={isDownloading}>{isDownloading ? 'Downloading...' : 'Download Ticket'}</button>
                        </div>
                    </div>
                </div>
            </div>
        }
    </div>
    
  )
}

export default Viewticketpage