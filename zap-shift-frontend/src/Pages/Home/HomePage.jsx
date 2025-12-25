import React from 'react';
import Banner from './Banner';
import HowItWorks from './HowItWorks';
import OurServices from './OurServices';
import BrandsMarquee from './BrandsMarquee';

const HomePage = () => {
    return (
        <div className='w-full md:w-10/12 mx-auto mt-10'>
            <Banner></Banner>
            <HowItWorks></HowItWorks>
            <OurServices></OurServices>
            <BrandsMarquee></BrandsMarquee>
        </div>
    );
};

export default HomePage;