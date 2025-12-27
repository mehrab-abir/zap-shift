import React from 'react';
import Header from '../../Shared Components/Header';
import { Outlet } from 'react-router';
import Footer from '../../Shared Components/Footer';

const AuthLayout = () => {
    return (
        <>
            <Header></Header>
            <Outlet></Outlet>
            <Footer></Footer>
        </>
    );
};

export default AuthLayout;