"use client"
import { url } from 'inspector'
import React from 'react'
import { BsShare,BsStarFill } from 'react-icons/bs'
import Image from 'next/image'
import './MoviePage.css'
import MovieCarousel from '@/components/MovieCarousel/MovieCarousel'
// swiperimports
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css';
import 'swiper/css/scrollbar';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import CelebCard from '@/components/CelebCard/CelebCard'
import Link from 'next/link'
import { usePathname,useParams } from 'next/navigation'

const Moviepage = () => {
    const pathname = usePathname();

    const {movie_id}=useParams();
    const [movie,setMovie]=React.useState<any>(null)
    console.log(movie_id);

    const getMovies=React.useCallback(async()=>{
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/movies/${movie_id}`,{
          method: 'GET',
          headers: {
            'Content-Type':'application/json',
          },
          credentials:'include'
        })
      .then((res)=>res.json())
      .then((data)=>{
        if(data.ok){
          setMovie(data.data);
        }
      })
      .catch((err)=>{
        console.log(err)
      })
      }
    ,[movie_id]);

      React.useEffect(()=>{
        getMovies();
      },[getMovies])

      const totalmin=movie?.duration;
      const hours=Math.floor(totalmin/60);
      const minutes=totalmin%60;

  return (
    <>
        {
            movie &&
            <div className='moviepage'>
        <div className="c1"
        style={{backgroundImage:`url(${movie.landscapeImgUrl})`}}
        >
            <div className="c11">
                <div className="left">
                    <div className="movie-poster"
                    style={{
                        backgroundImage: `url(${movie.portraitImgUrl})`
                    }}>
                        <p>In Cinemas</p>
                    </div>
                    <div className="movie-details">
                        <p className="title">{movie.title}</p>
                        <p className='rating'>
                            <BsStarFill className='star'/>&nbsp;&nbsp;
                            {movie.rating}/10
                        </p>
                        <p className='duration_type_releasedat'>
                            <span className='duration'>
                                {hours}h {minutes} m
                            </span>
                            <span>•</span>
                            <span className='type'>
                                {movie.genre.join(', ')}
                            </span>
                            <span>•</span>
                            {/* <span className='releasedat'>
                                {movie.releasedate}
                            </span> */}
                        </p>
                        <Link href={`${pathname}/buytickets`}>
                            <button className="bookbtn" >Book Tickets</button>
                        </Link>
                        
                    </div>
                </div>
                <div className="right">
                    <button className='sharebtn'><BsShare className='shareicon'/>Share</button>
                </div>
            </div>

        </div>
        <div className="c2">
            <h1>About the Movie</h1>
            <p>{movie.description}</p>
            {
                movie.cast.length>0 &&
                <div className="circlecardslider">
                    <div className="line"></div>
                    <h1>cast</h1>
                    <Swiper
                            slidesPerView={1}
                            spaceBetween={1} 
                            pagination={{
                                clickable: true,
                            }}
                            breakpoints={{
                                '@0.00': {
                                    slidesPerView: 1,
                                    spaceBetween: 2,
                                },
                                '@0.75': {
                                    slidesPerView: 2,
                                    spaceBetween: 2,
                                },
                                '@1.00': {
                                    slidesPerView: 3,
                                    spaceBetween: 2,
                                },
                                '@1.50': {
                                    slidesPerView: 6,
                                    spaceBetween: 2,
                                },
                            }}
                            modules={[Pagination]}
                            className="mySwiper"
                        >
                            {
                                movie.cast.map((cast:any,index:any)=>{
                                    return(
                                        <SwiperSlide key={index} style={{width:'150px',height:'180px'}}>
                                            <CelebCard {...cast}/>
                                        </SwiperSlide>
                                    )
                                })
                            }
                    
                    </Swiper>
            </div>
            }
            {
                movie.crew.length>0 &&
                <div className="circlecardslider">
                    <div className="line"></div>
                    <h1>crew</h1>
                    <Swiper
                                slidesPerView={1}
                                spaceBetween={1}
                                pagination={{
                                    clickable: true,
                                }}
                                breakpoints={{
                                    '@0.00': {
                                        slidesPerView: 1,
                                        spaceBetween: 2,
                                    },
                                    '@0.75': {
                                        slidesPerView: 2,
                                        spaceBetween: 2,
                                    },
                                    '@1.00': {
                                        slidesPerView: 3,
                                        spaceBetween: 2,
                                    },
                                    '@1.50': {
                                        slidesPerView: 6,
                                        spaceBetween: 2,
                                    },
                                }}
                                modules={[Pagination]}
                                className="mySwiper"
                            >
                                {
                                    movie.crew.map((crew:any,index:any)=>{
                                        return(
                                            <SwiperSlide key={index} style={{width:'150px',height:'180px'}}>
                                                <CelebCard {...crew}/>
                                            </SwiperSlide>
                                        )
                                    })
                                }
                        
                        </Swiper>
                </div>
            }
            
            
            <div className="line"></div>
            <h1>You Might Also Like</h1>
            < MovieCarousel/>
        </div>
            </div>
        }
    </>
    
  )
}

export default Moviepage