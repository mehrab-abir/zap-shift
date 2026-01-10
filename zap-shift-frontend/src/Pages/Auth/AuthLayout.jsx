import React from 'react';
import { Outlet } from 'react-router';
import Footer from '../../Shared Components/Footer';
import Header from '../../Shared Components/Header/Header';

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