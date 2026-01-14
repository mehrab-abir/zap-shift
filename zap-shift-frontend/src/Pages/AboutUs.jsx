import React from 'react';
import img from '../assets/authImage.png'

const AboutUs = () => {
    return (
      <div className="w-11/12 md:w-10/12 bg-surface mx-auto my-10 p-10 rounded-lg">
        <title>About</title>
        <h1 className="text-xl md:text-3xl font-bold">About Us</h1>
        <div className='flex flex-col items-center justify-center'>
          <img src={img} alt="" className='mx-auto' />
        <p className="mt-2 text-muted md:w-[50%] text-center">
          Enjoy fast, reliable parcel delivery with real-time tracking and zero
          hassle. From personal packages to business shipments — we deliver on
          time, every time.
        </p>
        </div>
        

        <h2 className='font-smeibold text-xl md:text-2xl my-10'>Story</h2>

        <p className='mt-5 text-secondary'>
          We started with a simple promise — to make parcel delivery fast,
          reliable, and stress-free. Over the years, our commitment to real-time
          tracking, efficient logistics, and customer-first service has made us
          a trusted partner for thousands. Whether it's a personal gift or a
          time-sensitive business delivery, we ensure it reaches its destination
          — on time, every time. We started with a simple promise — to make
          parcel delivery fast, reliable, and stress-free. Over the years, our
          commitment to real-time tracking, efficient logistics, and
          customer-first service has made us a trusted partner for thousands.
          Whether it's a personal gift or a time-sensitive business delivery, we
          ensure it reaches its destination — on time, every time. We started
          with a simple promise — to make parcel delivery fast, reliable, and
          stress-free. Over the years, our commitment to real-time tracking,
          efficient logistics, and customer-first service has made us a trusted
          partner for thousands. Whether it's a personal gift or a
          time-sensitive business delivery, we ensure it reaches its destination
          — on time, every time.
        </p>
      </div>
    );
};

export default AboutUs;