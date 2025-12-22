import React from 'react';
import Header from '../Shared Components/Header';
import Footer from '../Shared Components/Footer';
import { Outlet } from 'react-router';

const Root = () => {
    return (
        <div className='bg-base text-base'>
            <Header></Header>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default Root;