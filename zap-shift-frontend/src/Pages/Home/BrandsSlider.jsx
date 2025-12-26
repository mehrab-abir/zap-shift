import React from 'react';
import brand1 from '../../assets/brands/amazon.png'
import brand2 from '../../assets/brands/amazon_vector.png'
import brand3 from '../../assets/brands/casio.png'
import brand4 from '../../assets/brands/moonstar.png'
import brand5 from '../../assets/brands/randstad.png'
import brand6 from '../../assets/brands/star.png'
import brand7 from '../../assets/brands/start_people.png'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";

import { Autoplay } from "swiper/modules";

const brands = [brand1, brand2, brand3, brand4, brand5, brand6, brand7];

const BrandsMarquee = () => {
    return (
      <div className="my-20 bg-surface-alt rounded-xl py-5 w-11/12 mx-auto md:w-full">
        <h2 className="text-xl md:text-2xl font-bold text-primary text-center mb-10">We've helped thousands of sales team</h2>
        <Swiper
          slidesPerView={4}
          centeredSlides={true}
          spaceBetween={30}
          autoplay={{
            delay : 1000,
            disableOnInteraction:false
          }}
          loop={true}
          grabCursor={true}
          modules={[Autoplay]}
          className="mySwiper"
        >
            {
                brands.map((brand,index)=>{
                    return (
                      <SwiperSlide key={index}>
                        <img src={brand} alt="" />
                      </SwiperSlide>
                    );
                })
            }
          
        </Swiper>
      </div>
    );
};

export default BrandsMarquee;