'use client'
import React from 'react'
import DatePicker from 'react-horizontal-datepicker'
import './buytickets.css'
import { usePathname,useParams} from 'next/navigation'
import Link from 'next/link'


const page = () => {
  const pathname = usePathname();
  const params=useParams();
  const {movie_id,cityname}=params;
  const [selectedDate,setSelectedDate]=React.useState<any>(new Date())
  const [movie,setMovie]=React.useState<any>(null)
  const [theatres,setTheatres]=React.useState<any>(null)

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
  },[])


  const getTheatres = React.useCallback(async(date:string)=>{
    let movieId=movie_id;
    let city=cityname;
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/screensbymovieschedule/${city}/${date}/${movieId}`,{
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
  },[selectedDate])


  React.useEffect(()=>{
    getMovie()
  },[getMovie])

  React.useEffect(()=>{
    getTheatres(selectedDate)
  },[getTheatres,selectedDate])



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
            console.log(date)
            setSelectedDate(date)
          }}
                    endDate={100}
                    selectDate={selectedDate}
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

export default page