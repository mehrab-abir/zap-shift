import React, { useEffect, useState } from "react";
import customerTop from "../../assets/customer-top.png";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/autoplay";

// import required modules
import { Autoplay, EffectCoverflow, Pagination } from "swiper/modules";

const CustomerReviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch("/reviews.json")
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className="mb-20">
      <img src={customerTop} alt="" className="mx-auto" />
      <h1 className="text-xl md:text-3xl font-bold text-accent text-center my-5">
        What our customers are saying
      </h1>

      <div className="mt-10 flex items-center justify-center">
        <Swiper
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={2}
          coverflowEffect={{
            rotate: 30,
            stretch: "50%",
            depth: 200,
            scal : 0.75,
            modifier: 1,
            slideShadows: true,
          }}
          autoplay={{
            delay : 3000,
            disableOnInteraction : false
          }}
          loop={true}
          modules={[EffectCoverflow,Autoplay]}
          className="mySwiper"
        >
          {reviews.map((review) => {
            return (
              <SwiperSlide key={review.id}>
                <div className="p-4 bg-surface">
                  <p className="text-sm md:text-base text-center my-5">{review.review}</p>
                  <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
                    <img
                      src={review.user_photoURL}
                      alt=""
                      className="w-12 md:w-24 rounded-full"
                    />
                    <div className="text-secondary">
                      <h4 className="text-lg font-bold">{review.userName}</h4>
                      <p className="text-sm">{review.user_email}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default CustomerReviews;
