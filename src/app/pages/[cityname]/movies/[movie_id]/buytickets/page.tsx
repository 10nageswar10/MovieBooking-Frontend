'use client'
import React from 'react'
import DatePicker from 'react-horizontal-datepicker'
import './buytickets.css'
import { usePathname,useParams} from 'next/navigation'
import Link from 'next/link'


const Page = () => {
  const pathname = usePathname();
  const params=useParams();
  const {movie_id,cityname}=params;
  const [selectedDate,setSelectedDate]=React.useState<any>(new Date())
  const [movie,setMovie]=React.useState<any>(null)
  const [theatres,setTheatres]=React.useState<any>(null)

  const [count,setCount]=React.useState<any>(0)

  const setDateTimeToZero = (date:any) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };


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


  const getTheatres = React.useCallback(async(date:string)=>{
    let movieId=movie_id;
    let city=cityname;
    console.log("Original Date:", date);
    const currentDate = new Date(date);
    const adjustedDate = currentDate.toISOString().split('T')[0]; // Format the date as YYYY-MM-DD
    console.log(adjustedDate)

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/screensbymovieschedule/${city}/${adjustedDate}/${movieId}`,{
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
        setTheatres(data.data)
      }
      else{
        console.log(data)
      }
    })
    .catch((err)=>{
      console.log(err);
    })
  },[cityname,movie_id])


  React.useEffect(()=>{
    getMovie()
  },[getMovie])


  return (
    <>
    {
      movie &&
        <div className='buytickets'>
        <div className="s1">
          <div className="head">
            <h1>{movie.title} - {movie.language}</h1>
            <h3>{movie.genre.join(', ')}</h3>
          </div>
          <DatePicker getSelectedDay={(date:any)=>{
            console.log("Selected Date:", setDateTimeToZero(date));
            setSelectedDate(setDateTimeToZero(date));
            const adjustDate=new Date(date)
            if(count!=0){
              adjustDate.setDate(adjustDate.getDate() + 1);
              getTheatres(adjustDate.toISOString().split('T')[0]);
            }
            else{
              getTheatres(date.toISOString().split('T')[0]);
              setCount(1)
            }  
          }}
                    endDate={100}
                    labelFormat={"MMMM"}
                    color={"#CD1818"}          
          />
        </div>
        <>
        {
          theatres&&theatres.length>0?
          <div className="screens">
            {
              theatres.map((screen:any,index:any)=>{
                let screenId=screen._id
                return(
                  <div className="screen" key={index}>
                    <div>
                      <h2>{screen.name}</h2>
                      <h3>{screen.location}</h3>
                    </div>
                    <Link href={`${pathname}/${screenId}/?date=${selectedDate}`} className='theme-btn1 linkstylenone'>Select</Link>
                  </div>
                )
              })
            }
          </div>:
          <div className="screens"> 
            <h1>No Shows Available</h1>
          </div>

        }
        </>

      </div>
    }
    </>
  )
}

export default Page