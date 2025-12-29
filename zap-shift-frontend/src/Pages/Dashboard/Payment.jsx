import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { useParams } from 'react-router';
import useAxios from '../../Hook/useAxios';

const Payment = () => {

    const {parcelId} = useParams();
    const axios = useAxios();

    const {isLoading, data : parcel} = useQuery({
        queryKey : ['parcel',parcelId],
        queryFn : async () => {
            const response = await axios.get(`/parcels/${parcelId}`);
            return response.data;
        }     
    })

    if(isLoading){
        return <p>Loading...</p>
    }

    return (
        <div className='w-11/12 md:w-10/12 my-5 mx-auto'>
            <p>Pay for the Parcel: {parcel.parcelName}</p>
            <p>Amount : {parcel.deliveryFee}</p>
        </div>
    );
};

export default Payment;