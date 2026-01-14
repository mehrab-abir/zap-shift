import React from 'react';
import errorCartoon from '../assets/errorCartoon.png';
import { Link } from 'react-router';

const ErrorPage = () => {
    return (
        <div className='w-11/12 md:w-10/12 bg-surface p-10 mx-auto flex flex-col items-center justify-center'>
            <title>Error: Page Not Found</title>
            <div className='my-10 flex items-center justify-center'>
                <img src={errorCartoon} alt="" className='w-[50%]' />
            </div>

            <p className='text-center text-red-500'>Oops! The page you are looking for is not available.</p>
            <Link to='/' className='btn bg-gray-700 text-white mt-5'>Go to Home Page</Link>
        </div>
    );
};

export default ErrorPage;