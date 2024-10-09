import React from 'react'
import { MovieCardType } from '@/types/types'
import { useRouter } from 'next/navigation';
import { BsStarFill } from 'react-icons/bs';
import { toast } from 'react-toastify';

const MovieCard : React.FC<{ movie: MovieCardType; user: any }> = ({ movie, user }) => {
  const router=useRouter();  
  const {city}=user||{};
  const {_id,title,genre,rating,portraitImgUrl}=movie;

  const handleCardClick = () => {
    if (!user) {
      // Show toast message if the user is not logged in
      toast.info("Please Sign in to continue!", {
        position: 'top-center', // Position of the toast
        autoClose: 3000, // Duration before the toast closes
      });
    } else {
      // Redirect to the movie details page if the user is logged in
      router.push(`/pages/${city}/movies/${_id}`);
    }
  };


  return (
    <div 
      className='moviecard'    
      onClick={handleCardClick}
    >
    <div className="movieimage" 
      style={{backgroundImage:`url(${portraitImgUrl})`}
    }>
    <p className='rating'>
      <BsStarFill className='star'/>&nbsp;&nbsp;
      {rating}/10
    </p>

    </div>  
    <div className="details">
      <p className="title">
        {title}
      </p>
      <p className="type">
        {genre.join(",")}
      </p>
    </div>
    </div>
  )
}

export default MovieCard