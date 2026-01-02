import React from 'react';
import { Link } from 'react-router';

const ForbiddenRoute = () => {
    return (
      <div className="w-11/12 md:w-10/12 mx-auto bg-surface my-10 flex items-center justify-center">
        <div className="p-10">
          <h3 className="font-semibold text-2xl md:text-4xl text-red-500 my-5">
            Forbidden Access!
          </h3>
          <div className="flex space-x-3 items-center my-5">
            <Link
              to="/"
              className="btn btn-sm md:btn-md bg-gray-800 text-white"
            >
              Go to Home Page
            </Link>
            <Link
              to="/dashboard"
              className="btn btn-sm md:btn-md bg-primary text-black"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
};

export default ForbiddenRoute;