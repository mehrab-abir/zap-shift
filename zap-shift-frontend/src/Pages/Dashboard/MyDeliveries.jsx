import React, { use } from "react";
import useAxios from "../../Hook/useAxios";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../Context/Auth/AuthContext";
import Swal from "sweetalert2";
import LoaderBar from "../../Shared Components/LoaderBar";

const MyDeliveries = () => {
  const { user } = use(AuthContext);
  const axios = useAxios();

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

  //get all completed deliveries
  const { data: completedDeliveries = [], refetch: refetchCompletedDelivery } =
    useQuery({
      queryKey: ["completed-delivery", user?.email],
      queryFn: async () => {
        const response = await axios.get(
          `/rider/my-completed-deliveries/${user?.email}`
        );
        return response.data;
      },
    });

  const handleRiderResponse = async (parcel, riderResponse) => {
    try {
      const response = await axios.patch(`/parcel-request/${parcel._id}`, {
        riderResponse: riderResponse,
        riderEmail: parcel.riderEmail,
        riderName: parcel.riderName,
        trackingId : parcel.trackingId
      });

      if (response.data.updatedParcelDoc.acknowledged) {
        refetch();
        if (riderResponse === "complete delivery"){
            insertCompletedDelivery(parcel);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const accpetParcel = (parcel) => {
    handleRiderResponse(parcel, "accept");
  };
  const rejectParcel = (parcel) => {
    handleRiderResponse(parcel, "reject");
  };
  const confirmPickup = (parcel) => {
    handleRiderResponse(parcel, "confirm pickup");
  };
  const completeDelivery = (parcel) => {
    handleRiderResponse(parcel, "complete delivery");
  };

  const insertCompletedDelivery = async (parcel) => {
    const fare = calculateFare(parcel);
    const completed = { ...parcel, fare };

    const response = await axios.post(`/rider/complete-delivery`, completed);

    if (response.data.insertedId) {
      Swal.fire("Delivery completed");
      refetchCompletedDelivery();
    }
  };

  const calculateFare = (parcel) => {
    if (parcel.senderDistrict === parcel.receiverDistrict) {
      return Number(parcel.deliveryFee) * 0.6;
    } else {
      return Number(parcel.deliveryFee) * 0.8;
    }
  };

  if (isLoading) {
    return (
      <div className="h-[50vh]">
        <LoaderBar></LoaderBar>
      </div>
    );
  }

  return (
    <div className="bg-surface p-5 md:p-10 w-11/12 mx-auto">
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
                  <span className="font-bold">Fare:</span> $
                  {calculateFare(assigned_parcel).toFixed(2)}
                </p>
                <p>
                  <span className="font-bold">Parcel weight:</span>{" "}
                  {assigned_parcel.parcelWeight} Kg
                </p>

                {/* accept/reject button */}
                <div
                  className={`flex gap-3 items-center mt-4 ${
                    assigned_parcel.deliveryStatus !== "Rider Assigned" &&
                    "hidden"
                  }`}
                >
                  <button
                    onClick={() => accpetParcel(assigned_parcel)}
                    className="btn btn-sm text-black bg-green-500 border-none outline-none"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => rejectParcel(assigned_parcel)}
                    className="btn btn-sm text-black bg-red-400 border-none outline-none"
                  >
                    Reject
                  </button>
                </div>

                {/* confirm pickup and complete delivery buttons */}
                <div className={`flex gap-3 items-center mt-4`}>
                  <button
                    onClick={() => confirmPickup(assigned_parcel)}
                    className={`btn btn-sm text-black border-none outline-none ${
                      assigned_parcel.deliveryStatus !== "Rider arriving"
                        ? "bg-green-300 cursor-not-allowed"
                        : "bg-green-500"
                    }`}
                    disabled={
                      assigned_parcel.deliveryStatus !== "Rider arriving"
                    }
                  >
                    Confirm Pickup
                  </button>
                  <button
                    onClick={() => completeDelivery(assigned_parcel)}
                    className={`btn btn-sm text-black  border-none outline-none ${
                      assigned_parcel.deliveryStatus === "In transit"
                        ? "bg-red-400"
                        : "bg-red-200 cursor-not-allowed"
                    }`}
                    disabled={assigned_parcel.deliveryStatus !== "In transit"}
                  >
                    Complete Delivery
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* my completed deliveries */}
      <div className="mt-10 rounded-lg p-2 md:p-5">
        <h2 className="text-2xl font-bold text-accent mb-5">
          Your completed Deliveries
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {completedDeliveries.length === 0 ? (
            <p className="text-center text-muted my-2">
              -You have not completed any deliveries yet-
            </p>
          ) : (
            completedDeliveries.map((delivery) => {
              return (
                <div key={delivery._id} className="shadow-md shadow-lime-400 p-4 rounded-lg">
                  <p>
                    <span className="font-bold">Parcel Name: </span>
                    {delivery.parcelName}
                  </p>
                  <p>
                    <span className="font-bold">Sender Name: </span>
                    {delivery.senderName}
                  </p>
                  <p>
                    <span className="font-bold">Receiver Name: </span>
                    {delivery.receiverName}
                  </p>
                  <p>
                    <span className="font-bold">Rider Name: </span>
                    {delivery.riderName}
                  </p>
                  <p>
                    <span className="font-bold">From: </span>
                    {delivery.senderDistrict}
                  </p>
                  <p>
                    <span className="font-bold">To: </span>
                    {delivery.receiverDistrict}
                  </p>
                  <p>
                    <span className="font-bold">Fare: </span>
                    ${delivery.fare}
                  </p>
                  <p>
                    <span className="font-bold">Completed at: </span>
                    {new Date(delivery.completedAt).toLocaleString()}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default MyDeliveries;
