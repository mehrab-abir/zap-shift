import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import useAxios from "../../../Hook/useAxios";
import LoaderBar from "../../../Shared Components/LoaderBar";

const Payment = () => {
  const { parcelId } = useParams();
  const axios = useAxios();

  const { isLoading, data: parcel } = useQuery({
    queryKey: ["parcel", parcelId],
    queryFn: async () => {
      const response = await axios.get(`/parcels/${parcelId}`);
      return response.data;
    },
  });

  const handlePayment = async () => {
    try {
      const paymentInfo = {
        parcelId: parcel._id,
        parcelName: parcel.parcelName,
        deliveryFee: parcel.deliveryFee,
        senderEmail: parcel.senderEmail,
      };

      const response = await axios.post(
        "/create-checkout-session",
        paymentInfo
      );
    //   console.log("Response:",response.data);
    window.location.href = response.data.url;
    } catch (err) {
        console.log("Error in client : ",err);
    }
  };

  if (isLoading) {
    return <LoaderBar></LoaderBar>;
  }

  return (
    <div className="w-11/12 md:w-10/12 my-5 mx-auto">
      <p>Pay for the Parcel: {parcel.parcelName}</p>
      <p>Amount : {parcel.deliveryFee}</p>
      <button
        onClick={handlePayment}
        className="btn bg-green-700 text-white m-2"
      >
        Proceed to Payment
      </button>
    </div>
  );
};

export default Payment;
