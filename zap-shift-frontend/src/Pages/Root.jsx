import React from 'react';
import Footer from '../Shared Components/Footer';
import { Outlet } from 'react-router';
import Header from '../Shared Components/Header/Header';

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