import React, { useRef, useState } from "react";
import { use } from "react";
// import { useEffect } from "react";
// import { useState } from "react";
import { AuthContext } from "../../Context/Auth/AuthContext";
import useAxios from "../../Hook/useAxios";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { CiSearch } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import Swal from "sweetalert2";

const MyParcels = () => {
  const { user } = use(AuthContext);
  const axios = useAxios();

  const [selectedParcel, setSelectedParcel] = useState({});
  const parcelDetailsModal = useRef();

  const {
    data: myParcels = [],
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["myParcels", user?.email],
    queryFn: async () => {
      const response = await axios.get(`/parcels?email=${user?.email}`);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <p>
        <i>Percels Loading...</i>
      </p>
    );
  }

  /* const [myParcels, setMyparcels] = useState([]);

    useEffect(()=>{
        if(!user.email) return <p><i>Parcels loading...</i></p>

        axios.get(`/parcels?email=${user?.email}`)
        .then(response =>setMyparcels(response.data));
    },[axios, user?.email]) */

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`/parcels/${id}`).then((afterDelete) => {
          if (afterDelete.data.deletedCount) {
            refetch();
            Swal.fire({
              title: "Deleted!",
              text: "Your parcel has been deleted.",
              icon: "success",
            });
          }
        });
      }
    });
  };

  const handlePayment = async (parcel)=>{
    try{
      const paymentInfo = {
        parcelId: parcel._id,
        parcelName: parcel.parcelName,
        deliveryFee: parcel.deliveryFee,
        senderEmail: parcel.senderEmail,
        receiverName : parcel.receiverName,
        trackingId : parcel.trackingId
      };

      const response = await axios.post('/create-checkout-session',paymentInfo);
      window.location.assign(response.data.url);
    }
    catch(err){
      console.log(err);
    }
  }

  //view parcel details
  const viewDetails = (parcel)=>{
    setSelectedParcel(parcel);
    parcelDetailsModal.current.showModal();
  }

  return (
    <div className="">
      {isFetching && (
        <p>
          <i>fetching data...</i>
        </p>
      )}
      <h1 className="text-2xl font-bold">My Parcels ({myParcels.length})</h1>

      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 mt-2">
        <table className="table table-sm md:table-md">
          {/* head */}
          <thead>
            <tr>
              <th className="text-center">#</th>
              <th className="text-center">Name</th>
              <th className="text-center">Tracking Id</th>
              <th className="text-center">Payment Status</th>
              <th className="text-center">Delivery Status</th>
              <th className="text-center">Delivery Fees</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {myParcels.map((parcel, index) => {
              return (
                <tr key={parcel._id}>
                  <th>{index + 1}</th>
                  <td
                    onClick={() => viewDetails(parcel)}
                    className="font-semibold cursor-pointer hover:underline text-center"
                  >
                    {parcel.parcelName}
                  </td>
                  <td className="text-center">
                    <Link
                      className="font-semibold hover:underline hover:text-lime-500 text-xs md:text-base"
                      to={`/track-parcel/${parcel.trackingId}`}
                    >
                      {parcel.trackingId}
                    </Link>
                  </td>
                  <td className="text-center">
                    {parcel.paymentStatus === "Paid" ? (
                      <span className="text-green-400 font-semibold">Paid</span>
                    ) : (
                      <button
                        onClick={() => handlePayment(parcel)}
                        className="text-red-500 font-semibold cursor-pointer"
                      >
                        Pay Now
                      </button>
                    )}
                  </td>
                  <td
                    className={`${
                      parcel.deliveryStatus === "In transit"
                        ? "text-accent"
                        : parcel.deliveryStatus === "Rider Assigned"
                        ? "text-blue-500"
                        : parcel.deliveryStatus === "Rider arriving"
                        ? "text-purple-500"
                        : parcel.deliveryStatus === "Delivered"
                        ? "text-green-500"
                        : "text-primary"
                    } font-semibold text-center`}
                  >
                    {parcel.deliveryStatus
                      ? parcel.deliveryStatus
                      : "Parcel created"}
                  </td>
                  <td className="font-semibold text-center">
                    ${parcel.deliveryFee}
                  </td>
                  <td className="align-middle">
                    <div className="flex gap-4">
                      <button
                        onClick={() => viewDetails(parcel)}
                        className="cursor-pointer tooltip"
                        data-tip="View details"
                      >
                        <CiSearch className="text-2xl hover:text-lime-500" />
                      </button>
                      <button
                        disabled={parcel.paymentStatus === "Paid"}
                        className={`cursor-pointer`}
                        onClick={() => handleDelete(parcel._id)}
                      >
                        <RiDeleteBin6Line
                          className={`text-2xl  ${
                            parcel.paymentStatus === "Paid"
                              ? "text-gray-400 hover:text-gray-400"
                              : "hover:text-red-500"
                          }`}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* view parcel details modal */}
      <dialog ref={parcelDetailsModal} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Details</h3>

          <div className="my-3">
            <p><span className="font-semibold">Parcel Name:</span> {selectedParcel.parcelName}</p>
            <p><span className="font-semibold">Sender Name:</span> {selectedParcel.senderName}</p>
            <p><span className="font-semibold">Delivery Fee:</span> ${selectedParcel.deliveryFee}</p>
            <p><span className="font-semibold">Rider Name:</span> {selectedParcel.riderName}</p>
            <p><span className="font-semibold">Rider Email:</span> {selectedParcel.riderEmail}</p>
            <p><span className="font-semibold">Delivery Status:</span> {selectedParcel.deliveryStatus}</p>
            <p><span className="font-semibold">Tracking ID:</span> {selectedParcel.trackingId}</p>
          </div>


          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn bt-sm bg-gray-600 text-white">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default MyParcels;
