import React from 'react';
import Banner from './Banner';
import HowItWorks from './HowItWorks';
import OurServices from './OurServices';
import BrandsSlider from './BrandsSlider';
import TopFeature from './TopFeature';
import BeAMarchent from './BeAMarchent';
import CustomerReviews from './CustomerReviews';
import FAQ from './FAQ';

const HomePage = () => {
    return (
        <div className='w-full md:w-10/12 mx-auto mt-10'>
            <Banner></Banner>
            <HowItWorks></HowItWorks>
            <OurServices></OurServices>
            <BrandsSlider></BrandsSlider>
            <TopFeature></TopFeature>
            <BeAMarchent></BeAMarchent>
            <CustomerReviews></CustomerReviews>
            <FAQ></FAQ>
        </div>
    );
};

export default HomePage;