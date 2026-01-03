import React from 'react';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import useAxios from '../../../Hook/useAxios';
import { useState } from 'react';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const [paymentInfo, setPaymentInfo] = useState({});

    const axios = useAxios();

    const sessionId = searchParams.get("session_id");
    // console.log(sessionId);

    useEffect(()=>{
        if(sessionId){
            axios.patch(`/payment-success?session_id=${sessionId}`)
            .then(response=>{
                console.log(response.data);
                setPaymentInfo({
                    transactionId : response.data.transactionId,
                    trackingId : response.data.trackingId
                })
            });
        }
    },[sessionId,axios])


    return (
      <div className="bg-surface rounded-xl">
        <p className="text-xl text-center font-semibold py-5">Thank you.</p>
        <h1 className="text-2xl font-bold text-green-500 text-center my-5">
          Payment Successful!
        </h1>

        <div className="my-5 border-gray-300 rounded-md p-4 flex flex-col items-center space-y-2">
          <p>
            <span className="font-bold">Transaction ID: </span>
            {paymentInfo.transactionId}
          </p>
          <p>
            <span className="font-bold">Tracking ID: </span>
            {paymentInfo.trackingId}
          </p>
        </div>
      </div>
    );
};

export default PaymentSuccess;