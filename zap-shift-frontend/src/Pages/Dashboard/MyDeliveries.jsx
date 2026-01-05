import React, { use, useState } from "react";
import useAxios from "../../Hook/useAxios";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../Context/Auth/AuthContext";
import Swal from "sweetalert2";

const MyDeliveries = () => {
  const { user } = use(AuthContext);
  const axios = useAxios();

//   const [showActionBtns, setShowActionBtns] = useState(false);
  const [accept, setAccept] = useState(false);

  const {
    data: assigned_parcels = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["assigned-parcels", user?.email],
    queryFn: async () => {
      const response = await axios.get(
        `/parcels/assigned-to-me/${user?.email}`
      );
      return response.data;
    },
  });

  const handleRiderResponse = async (parcel,riderResponse)=>{
    if(riderResponse === "accept"){
        setAccept(true);
    }

    try{
      const response = await axios.patch(`/parcel-request/${parcel._id}`,{riderResponse :riderResponse, riderEmail : parcel.riderEmail, riderName : parcel.riderName});
      
      console.log(response.data);

      if(response.data.updatedParcelDoc.acknowledged){
        refetch();
      }
    }
    catch(error){
        console.log(error);
    }
  }

  const accpetParcel = (parcel)=>{
    handleRiderResponse(parcel,"accept");
  }
  const rejectParcel = (parcel)=>{
    handleRiderResponse(parcel,"reject");
  }


  const calculateCompensation = (parcel) => {
    if (parcel.senderDistrict === parcel.receiverDistrict) {
      return Number(parcel.deliveryFee) * 0.6;
    } else {
      return Number(parcel.deliveryFee) * 0.8;
    }
  };

  return (
    <div className="bg-surface p-10">
      <h1 className="text-2xl md:text-4xl font-bold my-5">My Deliveries</h1>

      <h3 className="text-xl font-bold text-accent">Parcel request:</h3>
      <div className="mt-2">
        {assigned_parcels.length === 0 ? (
          <p className="text-muted text-center">
            -No Delivery Request For You At This Moment. Please Check Back
            Later-
          </p>
        ) : (
          assigned_parcels.map((assigned_parcel) => {
            return (
              <div
                key={assigned_parcel._id}
                className="p-3 space-y-3 shadow-lg bg-surface rounded-lg"
              >
                <p>
                  <span className="font-bold">Parcel type: </span>
                  {assigned_parcel.parcelType}
                </p>
                <p>
                  <span className="font-bold">Parcel Name: </span>
                  {assigned_parcel.parcelName}
                </p>
                <p>
                  <span className="font-bold">Sender District: </span>{" "}
                  {assigned_parcel.senderDistrict}
                </p>
                <p>
                  <span className="font-bold">Receiver District:</span>{" "}
                  {assigned_parcel.receiverDistrict}
                </p>
                <p>
                  <span className="font-bold">Compensation:</span> $
                  {calculateCompensation(assigned_parcel).toFixed(2)}
                </p>
                <p>
                  <span className="font-bold">Parcel weight:</span>{" "}
                  {assigned_parcel.parcelWeight} Kg
                </p>

                <div
                  className={`flex gap-3 items-center mt-4 ${
                    accept && "hidden"
                  }`}
                >
                  <button onClick={()=>accpetParcel(assigned_parcel)} className="btn btn-sm text-black bg-green-500 border-none outline-none">
                    Accept
                  </button>
                  <button onClick={()=>rejectParcel(assigned_parcel)} className="btn btn-sm text-black bg-red-400 border-none outline-none">
                    Reject
                  </button>
                </div>

                <div
                  className={`flex gap-3 items-center mt-4 ${
                    accept ? "block" : "hidden"
                  }`}
                >
                  <button className="btn btn-sm text-black bg-green-500 border-none outline-none">
                    Confirm Pickup
                  </button>
                  <button className="btn btn-sm text-black bg-red-400 border-none outline-none">
                    Complete Delivery
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MyDeliveries;
