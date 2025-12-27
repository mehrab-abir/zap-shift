import React from "react";
import banner1 from "../../assets/banner/banner1.png";
import banner2 from "../../assets/banner/banner2.png";
import banner3 from "../../assets/banner/banner3.png";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

const Banner = () => {
  return (
    <Carousel infiniteLoop={true} autoPlay={true} className="">
      <div className="relative">
        <img src={banner1} />
        <div className="flex items-center absolute bottom-5 text-sm md:text-neutral md:bottom-16 ml-20 gap-10">
          <button className="btn rounded-full bg-primary hover:bg-primary-hover hover:text-white border-none text-black">
            Track Your Parcel
          </button>
          <button className="btn rounded-full bg-surface border border-lime-500 outline-none hover:bg-primary-hover hover:text-white">
            Be A Rider
          </button>
        </div>
      </div>
      <div className="relative">
        <img src={banner2} />
        <div className="flex items-center absolute bottom-5 text-sm md:text-neutral md:bottom-16 ml-20 gap-10">
          <button className="btn rounded-full bg-primary hover:bg-primary-hover hover:text-white border-none text-black">
            Track Your Parcel
          </button>
          <button className="btn rounded-full bg-surface border border-lime-500 outline-none hover:bg-primary-hover hover:text-white">
            Be A Rider
          </button>
        </div>
      </div>
      <div className="relative">
        <img src={banner3} />
        <div className="flex items-center absolute bottom-5 text-sm md:text-neutral md:bottom-16 ml-20 gap-10">
          <button className="btn rounded-full bg-primary hover:bg-primary-hover hover:text-white border-none text-black">
            Track Your Parcel
          </button>
          <button className="btn rounded-full bg-surface border border-lime-500 outline-none hover:bg-primary-hover hover:text-white">
            Be A Rider
          </button>
        </div>
      </div>
    </Carousel>
  );
};

export default Banner;
