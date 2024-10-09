import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/scrollbar';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
// import MovieCard from './MovieCard'
import { MovieCardType } from '@/types/types';

import { Keyboard, Scrollbar, Navigation, Pagination } from 'swiper/modules';
import MovieCard from './MovieCard';
import './MovieCard.css'


const MovieCarousel = () => {

    const [movies,setMovies]=React.useState<MovieCardType[]>([])
    const [user,setUser]=React.useState<any>(null)
    const [loading,setLoading]=React.useState<boolean>(true)
    
    const getMovies=async()=>{
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/movies`,{
        method: 'GET',
        headers: {
          'Content-Type':'application/json',
        },
        credentials:'include'
      })
    .then((res)=>res.json())
    .then((data)=>{
      if(data.ok){
        setMovies(data.data);
      }
    })
    .catch((err)=>{
      console.log(err)
    })
    }

    const getUser=async()=>{
      try{
        const res=await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/auth/getuser`,{
          method: 'GET',
          headers: {
            'Content-Type':'application/json',
          },
          credentials: 'include',
        });
        const response=await res.json();
        if(response.ok){
          setUser(response.data);
        }
      } 
      catch (error) {
        console.error('Error fetching user:', error);
      }
      finally{
        setLoading(false)
      }
    }

    React.useEffect(()=>{
      getMovies();
      getUser();
    },[])

    React.useEffect(() => {
      if (user) {
        console.log('Updated User State:', user);
      }
    }, [user]);
    if (loading) {
      return <div>Loading...</div>;
    }
  return (
    <div className="slider-out">
        <Swiper
        slidesPerView={1}
        centeredSlides={false}
        slidesPerGroupSkip={1}
        grabCursor={true}
        keyboard={{
          enabled: true,
        }}
        breakpoints={{
          '@0.00':{
            slidesPerView: 1,
            slidesPerGroup: 1,
          },
          '@0.50':{
            slidesPerView: 2,
            slidesPerGroup: 2,
          },
          '@1.00':{
            slidesPerView: 3,
            slidesPerGroup: 3,
          },
          '@1.50':{
            slidesPerView: 5,
            slidesPerGroup: 5,
          },
        }}
        navigation={true}
        pagination={{
          clickable: true,
        }}
        modules={[Keyboard, Navigation, Pagination]}
        className="mySwiper"
      >
       {
        movies.map((movie,index)=>{
            return(
                <SwiperSlide key={index}>
                    <MovieCard movie={movie} user={user} />
                </SwiperSlide>
            )
        })
       }
      </Swiper>
    </div>
    
  )
}

export default MovieCarousel