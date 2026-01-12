import React from 'react';
import useRole from '../Hook/useRole';
import ForbiddenRoute from '../Shared Components/ForbiddenRoute';
import LoaderBar from '../Shared Components/LoaderBar';

const RiderRoute = ({children}) => {
    const {isLoading, role} = useRole();

    if (isLoading) {
      return (
        <div className="h-[50vh]">
          <LoaderBar></LoaderBar>
        </div>
      );
    }

    if(role !== "rider"){
        return <ForbiddenRoute></ForbiddenRoute>
    }

    return children;
};

export default RiderRoute;