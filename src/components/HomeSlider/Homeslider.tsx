import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Pagination, Navigation } from 'swiper/modules';

const Homeslider = () => {
    const [banners,setBanners]=useState([
        {
            imageUrl:"https://www.businessoftollywood.com/wp-content/uploads/2024/03/goat-life-banner.jpg"
        },
        {
            imageUrl:"https://i.ytimg.com/vi/DL7eKjB1Uhw/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLA42oIiagggIaithHuzR3lZ12qpww"
        }
    ]
    );

    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }
    }, []);

  return (
    <Swiper
        slidesPerView={1}
        spaceBetween={30}
        loop={true}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="mySwiper"
      >
        {
            banners.map((banner, index) => (
                <SwiperSlide key={index}>
                    <Image src={banner.imageUrl} alt="banner" width={dimensions.width} height={dimensions.height/1.5} 
                    style={{
                        objectFit: 'cover',
                        backgroundPosition:'center',
                    }}/>
                </SwiperSlide>
            ))
        }
    </Swiper>
  )
}

export default Homeslider