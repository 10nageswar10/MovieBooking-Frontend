'use client'
import React from 'react'
import { useState,useEffect } from 'react'
import './selectSeat.css'
import Link from 'next/link'
import { useParams,usePathname,useSearchParams } from 'next/navigation'
import { toast } from 'react-toastify'
import { loadStripe } from '@stripe/stripe-js'
import Loading from '@/components/Loading/Loading'

const stripeKey=process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
if(!stripeKey){
    toast.error('Missing Stripe Publishable Key')
}
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

const Page = () => {
    const params=useParams();
    const pathname=usePathname();
    const searchParams=useSearchParams();
    const date=searchParams.get('date');
    const {movie_id,cityname,screenid}=params;
    console.log(movie_id,screenid,cityname,date);

    const [screen,setScreen]=useState<any>(null)
    const [selectedTime,setSelectedTime]=useState<any>(null) 
    const [movie,setMovie]=useState<any>(null)
    const [isBooking, setIsBooking] = useState(false);
    const [selectedSeats,setSelectedSeats]=useState<any[]>([])

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


    const getSchedules=React.useCallback(async()=>{
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/schedulebymovie/${screenid}/${date}/${movie_id}`,{
            method:'GET',
            headers:{
                'Content-Type':'application/json',
            },
            credentials:'include'
        })
        .then(res=>res.json())
        .then(response=>{
            if(response.ok){
                console.log('API response:', response);
                setScreen(response.data);
                setSelectedTime(response.data.movieSchedulesforDate[0]);
            }
            else{
                console.log(response)
            }
        })
        .catch(err=>console.log(err))
    },[screenid,date,movie_id])

    const getMovie =React.useCallback(async()=>{
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/movies/${movie_id}`,{
          method:'GET',
          headers:{
            'Content-Type':'application/json'
          },
          credentials:'include'
        })
        .then((res)=>res.json())
        .then((data)=>{
          if(data.ok){
            console.log(data);
            setMovie(data.data)
          }
        })
        .catch((err)=>{
          console.log(err);
        })
    },[movie_id])
    
    useEffect(()=>{
        const fetchData = async () => {
            await Promise.all([getSchedules(), getMovie()]);
        };
    
        fetchData();
    },[date, movie_id, screenid,getMovie,getSchedules])

    

    const selectdeselectseat=(seat:any)=>{
        console.log(seat)
        const isselected=selectedSeats.find((s:any)=>(
            s.row===seat.row&&
            s.col===seat.col&&
            s.seat_id===seat.seat_id
        ))
        if(isselected){
            setSelectedSeats(selectedSeats.filter((s:any)=>(
                s.row!==seat.row||
                s.col!==seat.col||
                s.seat_id!==seat.seat_id
            )))
        }
        else{
            setSelectedSeats([...selectedSeats,seat])
        }
    }

    const generateSeatLayout = () => {
        const x = screen.movieSchedulesforDate.findIndex((t: any) => t.showTime === selectedTime.showTime)
        if (x === -1 || !screen.movieSchedulesforDate[x].notavailableseats) {
            return <div>No unavailable seats found.</div>; // Handle case with no unavailable seats
        }

        let notavailableseats = screen.movieSchedulesforDate[x].notavailableseats||[]

        return (
            <div>
                {screen.screen.seats.map((seatType:any, index:number) => (
                    <div className="seat-type" key={index}>
                        <h2>{seatType.type} - Rs. {seatType.price}</h2>
                        <div className='seat-rows'>
                            {seatType.rows.map((row:any, rowIndex:number) => (
                                <div className="seat-row" key={rowIndex}>
                                    <p className="rowname">{row.rowname}</p>
                                    <div className="seat-cols">
                                        {row.cols.map((col:any, colIndex:number) => (


                                            <div className="seat-col" key={colIndex}>
                                                {col.seats.map((seat:any, seatIndex:number) => (
                                                    // console.log(seat),

                                                    <div key={seatIndex}>
                                                        {
                                                            notavailableseats.find((s: any) => (
                                                                s.row === row.rowname &&
                                                                s.seat_id === seat.seat_id &&
                                                                s.col === colIndex
                                                            )) ?(
                                                                <span className='seat-unavailable'>
                                                                    {seatIndex + 1}
                                                                </span>
                                                            )
                                                                :
                                                                <span className={
                                                                    selectedSeats.find((s: any) => (
                                                                        s.row === row.rowname &&
                                                                        s.seat_id === seat.seat_id &&
                                                                        s.col === colIndex
                                                                    )) ? "seat-selected" : "seat-available"
                                                                }
                                                                    onClick={() => selectdeselectseat({
                                                                        row: row.rowname,
                                                                        col: colIndex,
                                                                        seat_id: seat.seat_id,
                                                                        price: seatType.price
                                                                    })}
                                                                >
                                                                    {seatIndex + 1}
                                                                </span>

                                                        }
                                                    </div>
                                                
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                    <br /> <br /> <br />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };


    const handleBooking=async()=>{
        if(selectedSeats.length===0){
            toast.error('Please select a seat',{
                position: 'top-center',
            })
            return;
        }
        setIsBooking(true); // Disable the button
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/create-checkout-session`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({
                seats: selectedSeats,
                movieTitle: movie.title,
                totalPrice: selectedSeats.reduce((acc, seat) => acc + seat.price, 0),
                showTime: selectedTime ? selectedTime.showTime : '',
                showDate: date,
                movieId: movie_id,
                screenId: screenid,
              },),
            });
            const session = await res.json();
      
            const stripe = await stripePromise;

            const bookingDetails={
                showTime: selectedTime ? selectedTime.showTime : '',
                showDate: date,
                movieId: movie_id,
                screenId: screenid,
                seats: selectedSeats,
                totalPrice: selectedSeats.reduce((acc, seat) => acc + seat.price, 0),
                paymenId:session.payment_intent,
                paymentType: 'online',
            };

            await stripe.redirectToCheckout({ sessionId: session.id });
          } catch (error) {
            toast.error('Something went wrong');
            console.error(error);
          }

    }


  return (
    <div className='selectseatpage'>
            {
                movie && screen &&
                <div className='s1'>
                    <div className='head'>
                        <h1>{movie.title} - {screen?.screen?.name}</h1>
                        <h3 style={{'margin':'15px 0px'}}>{movie.genre.join(" / ")}</h3>
                    </div>
                </div>
            }

            {
                screen ?
                <div className="selectseat">
                    <div className='timecont'>
                        {
                            screen.movieSchedulesforDate.map((time: any, index: number) => (
                                <h3 className={selectedTime?._id === time._id ? 'time selected' : 'time'} 
                                onClick={() => {
                                    setSelectedTime(time)
                                    setSelectedSeats([])
                                }} key={index}>
                                    {formatTime(time.showTime)}
                                </h3>
                            ))
                        }
                    </div>
                    <div className='indicators'>
                        <div>
                            <span className='seat-unavailable'></span>
                            <p>Not available</p>
                        </div>
                        <div>
                            <span className='seat-available'></span>
                            <p>Available</p>
                        </div>
                        <div>
                            <span className='seat-selected'></span>
                            <p>Selected</p>
                        </div>
                    </div>

                    {generateSeatLayout()}


                    <div className='totalcont'>
                        <div className='total'>
                            <h2>Total</h2>
                            <h3>Rs. {selectedSeats.reduce((acc, seat) => acc + seat.price, 0)}</h3>
                        </div>

                        {/* <Link href="/" className='theme_btn1 linkstylenone'>Continue</Link> */}
                        <button
                            className={isBooking?'theme-btn1 linkstylenone book-disabled':'theme-btn1 linkstylenone'}
                            onClick={handleBooking}
                            disabled={isBooking}
                        >{isBooking ? 'Booking...' : 'Book Now'}</button>
                    </div>
                </div>:<Loading/>
            }
        </div>
  )
}
export default Page