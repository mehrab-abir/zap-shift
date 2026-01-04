import React, { use } from 'react';
import useAxios from '../../Hook/useAxios';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '../../Context/Auth/AuthContext';

const RiderApplicationStatus = () => {
    const {user} = use(AuthContext);
    const axios = useAxios();

    const {data : rider, isLoading} = useQuery({
        queryKey : ["application-status"],
        queryFn : async ()=>{
            const response = await axios.get(`/rider/details/${user?.email}`);
            return response.data;
        }
    })

    if(isLoading){
        return <p><i>Loading...</i></p>
    }

    return (
        <div className='bg-surface p-10 text-center'>
            <h3 className="text-2xl font-bold">Your application to be a rider: </h3>
            <p className='text-lg font-semibold my-5'>Status: <span className={`${rider.status === "approved" ? "text-green-500" : rider.status === "pending" ? "text-yellow-500" : "text-red-500"}`}>{rider.status.toUpperCase()}</span></p>
        </div>
    );
};

export default RiderApplicationStatus;